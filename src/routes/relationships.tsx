import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Search, ExternalLink, Plus, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { PageShell } from "@/components/PageShell";
import { figures } from "@/lib/figures";

type Relationship = {
  id: string; from_figure_slug: string; from_figure_name: string;
  to_figure_slug: string; to_figure_name: string; relationship_type: string;
  description: string; started_at: string | null; ended_at: string | null;
  source_title: string; source_url: string; source_publisher: string | null;
  verification_status: string; verification_notes: string; published: boolean;
};
const kinds = [
  ["cabinet_colleague", "Cabinet colleague"], ["political_ally", "Political ally"],
  ["political_rival", "Political rival"], ["predecessor", "Predecessor"],
  ["successor", "Successor"], ["family", "Family relationship"],
] as const;
const emptyForm = { from_figure_slug: "", to_figure_slug: "", relationship_type: "political_ally",
  description: "", started_at: "", ended_at: "", source_title: "", source_url: "",
  source_publisher: "", verification_status: "unverified", verification_notes: "", published: false };
export const Route = createFileRoute("/relationships")({
  head: () => ({ meta: [
    { title: "Political Connections & Relationship Mapping — Statesmen Archive" },
    { name: "description", content: "Explore sourced relationships between political figures, including cabinet roles, alliances, rivalries, succession, and family ties." },
  ] }),
  component: RelationshipsPage,
});
function RelationshipsPage() {
  const { isAdmin } = useAuth();
  const [items, setItems] = useState<Relationship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true); setError("");
    const { data, error: loadError } = await supabase.from("figure_relationships" as never)
      .select("*").order("started_at", { ascending: false });
    if (loadError) setError(loadError.message);
    else setItems((data ?? []) as unknown as Relationship[]);
    setLoading(false);
  }
  useEffect(() => { void load(); }, []);
  const filtered = useMemo(() => items.filter((item) =>
    (kind === "all" || item.relationship_type === kind) &&
    [item.from_figure_name, item.to_figure_name, item.description, item.source_title]
      .some((value) => value.toLowerCase().includes(query.toLowerCase().trim()))
  ), [items, kind, query]);

  async function save(e: FormEvent) {
    e.preventDefault(); setSaving(true); setError("");
    const from = figures.find((f) => f.slug === form.from_figure_slug);
    const to = figures.find((f) => f.slug === form.to_figure_slug);
    if (!from || !to || from.slug === to.slug) { setError("Choose two different figures."); setSaving(false); return; }
    const payload = { ...form, from_figure_name: from.name, to_figure_name: to.name,
      started_at: form.started_at || null, ended_at: form.ended_at || null };
    const { error: saveError } = await supabase.from("figure_relationships" as never).insert(payload as never);
    if (saveError) setError(saveError.message);
    else { setForm(emptyForm); setShowForm(false); await load(); }
    setSaving(false);
  }
  const label = (value: string) => kinds.find(([key]) => key === value)?.[1] ?? value;
  return <PageShell>
    <main className="mx-auto max-w-5xl px-5 py-12">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div><p className="eyebrow text-accent">Research tools</p><h1 className="mt-2 font-display text-3xl font-semibold text-foreground sm:text-4xl">Political connections</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">Explore documented connections between political figures. Each relationship is presented with its source and verification status; a connection does not by itself establish motive or endorsement.</p></div>
        {isAdmin && <button onClick={() => setShowForm(!showForm)} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">{showForm ? <X className="size-4"/> : <Plus className="size-4"/>}{showForm ? "Close" : "Add relationship"}</button>}
      </div>
      {showForm && isAdmin && <form onSubmit={save} className="mt-8 grid gap-4 rounded-md border border-border bg-card p-5 sm:grid-cols-2">
        <h2 className="eyebrow sm:col-span-2">New sourced relationship</h2>
        <label className="grid gap-1 text-xs text-muted-foreground">Figure one<select required value={form.from_figure_slug} onChange={e=>setForm({...form,from_figure_slug:e.target.value})} className="rounded-md border border-border bg-background p-2 text-sm text-foreground"><option value="">Choose figure</option>{figures.map(f=><option key={f.slug} value={f.slug}>{f.name}</option>)}</select></label>
        <label className="grid gap-1 text-xs text-muted-foreground">Figure two<select required value={form.to_figure_slug} onChange={e=>setForm({...form,to_figure_slug:e.target.value})} className="rounded-md border border-border bg-background p-2 text-sm text-foreground"><option value="">Choose figure</option>{figures.map(f=><option key={f.slug} value={f.slug}>{f.name}</option>)}</select></label>
        <label className="grid gap-1 text-xs text-muted-foreground">Relationship type<select value={form.relationship_type} onChange={e=>setForm({...form,relationship_type:e.target.value})} className="rounded-md border border-border bg-background p-2 text-sm text-foreground">{kinds.map(([key,name])=><option key={key} value={key}>{name}</option>)}</select></label>
        <label className="grid gap-1 text-xs text-muted-foreground">Verification<select value={form.verification_status} onChange={e=>setForm({...form,verification_status:e.target.value})} className="rounded-md border border-border bg-background p-2 text-sm text-foreground"><option value="unverified">Unverified</option><option value="partially_verified">Partially verified</option><option value="verified">Verified</option><option value="disputed">Disputed</option></select></label>
        <label className="grid gap-1 text-xs text-muted-foreground sm:col-span-2">Context / evidence<textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} rows={3} className="rounded-md border border-border bg-background p-2 text-sm text-foreground"/></label>
        <label className="grid gap-1 text-xs text-muted-foreground">Start date<input type="date" value={form.started_at} onChange={e=>setForm({...form,started_at:e.target.value})} className="rounded-md border border-border bg-background p-2 text-sm text-foreground"/></label>
        <label className="grid gap-1 text-xs text-muted-foreground">End date<input type="date" value={form.ended_at} onChange={e=>setForm({...form,ended_at:e.target.value})} className="rounded-md border border-border bg-background p-2 text-sm text-foreground"/></label>
        <label className="grid gap-1 text-xs text-muted-foreground">Source title<input required value={form.source_title} onChange={e=>setForm({...form,source_title:e.target.value})} className="rounded-md border border-border bg-background p-2 text-sm text-foreground"/></label>
        <label className="grid gap-1 text-xs text-muted-foreground">Source URL<input required type="url" value={form.source_url} onChange={e=>setForm({...form,source_url:e.target.value})} className="rounded-md border border-border bg-background p-2 text-sm text-foreground"/></label>
        <label className="grid gap-1 text-xs text-muted-foreground">Publisher<input value={form.source_publisher} onChange={e=>setForm({...form,source_publisher:e.target.value})} className="rounded-md border border-border bg-background p-2 text-sm text-foreground"/></label>
        <label className="grid gap-1 text-xs text-muted-foreground">Verification notes<input value={form.verification_notes} onChange={e=>setForm({...form,verification_notes:e.target.value})} className="rounded-md border border-border bg-background p-2 text-sm text-foreground"/></label>
        <label className="flex items-center gap-2 text-sm text-foreground sm:col-span-2"><input type="checkbox" checked={form.published} onChange={e=>setForm({...form,published:e.target.checked})}/> Publish publicly</label>
        {error && <p role="alert" className="text-sm text-destructive sm:col-span-2">{error}</p>}
        <button disabled={saving} className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50 sm:col-span-2">{saving ? "Saving…" : "Save relationship"}</button>
      </form>}
      <div className="mt-8 flex flex-wrap gap-3"><div className="relative min-w-48 flex-1"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search figures or sources" className="w-full rounded-md border border-border bg-card py-2 pl-9 pr-3 text-sm text-foreground"/></div><select value={kind} onChange={e=>setKind(e.target.value)} className="rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground"><option value="all">All relationship types</option>{kinds.map(([key,name])=><option key={key} value={key}>{name}</option>)}</select></div>
      {error && !showForm && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}
      {loading ? <p className="mt-8 text-sm text-muted-foreground">Loading relationships…</p> : filtered.length ? <div className="mt-6 grid gap-4">{filtered.map(item=><article key={item.id} className="rounded-md border border-border bg-card p-5"><div className="flex flex-wrap items-center gap-2"><span className="eyebrow text-accent">{label(item.relationship_type)}</span><span className="text-xs text-muted-foreground">· {item.verification_status.replace("_"," ")}</span>{item.started_at && <span className="text-xs text-muted-foreground">· {item.started_at}{item.ended_at ? ` – ${item.ended_at}` : ""}</span>}</div><div className="mt-3 flex flex-wrap items-center gap-2 font-display text-lg font-semibold"><Link to="/figure/$slug" params={{slug:item.from_figure_slug}} className="text-foreground hover:text-accent">{item.from_figure_name}</Link><span className="text-muted-foreground">↔</span><Link to="/figure/$slug" params={{slug:item.to_figure_slug}} className="text-foreground hover:text-accent">{item.to_figure_name}</Link></div>{item.description && <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>}<a href={item.source_url} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline">{item.source_title}{item.source_publisher ? ` · ${item.source_publisher}` : ""}<ExternalLink className="size-3"/></a>{item.verification_notes && <p className="mt-2 text-xs text-muted-foreground">Verification note: {item.verification_notes}</p>}</article>)}</div> : <div className="mt-8 rounded-md border border-dashed border-border p-10 text-center"><h2 className="font-display text-lg font-semibold text-foreground">No relationships found</h2><p className="mt-2 text-sm text-muted-foreground">{query || kind !== "all" ? "Try changing your search or filter." : "Sourced political connections will appear here as they are added to the archive."}</p></div>}
    </main>
  </PageShell>;
}
