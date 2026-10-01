import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Search, ExternalLink, Quote, Plus, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { PageShell } from "@/components/PageShell";
import { SignedOutNotice } from "@/components/SignedOutNotice";
import { figures } from "@/lib/figures";

type QuoteRecord = {
  id: string; figure_slug: string; figure_name: string; quote_text: string;
  statement_type: string; spoken_at: string | null; venue: string | null;
  context: string; topic_tags: string[]; source_title: string; source_url: string;
  source_publisher: string | null; verification_status: string;
  verification_notes: string; published: boolean;
};
const emptyForm = {
  figure_slug: "", quote_text: "", statement_type: "quote", spoken_at: "",
  venue: "", context: "", topic_tags: "", source_title: "", source_url: "",
  source_publisher: "", verification_status: "unverified", verification_notes: "",
  published: false,
};
export const Route = createFileRoute("/quotes")({
  head: () => ({ meta: [
    { title: "Fact-Checked Quotes Archive — Statesmen Archive" },
    { name: "description", content: "A sourced archive of speeches, quotations, and public statements by political figures." },
  ] }),
  component: QuotesPage,
});
function QuotesPage() {
  const { isAuthenticated, isAdmin } = useAuth();
  const [items, setItems] = useState<QuoteRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [figureFilter, setFigureFilter] = useState("all");
  const [topicFilter, setTopicFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true); setError("");
    const { data, error: loadError } = await supabase.from("figure_quotes" as never)
      .select("*").order("spoken_at", { ascending: false, nullsFirst: false });
    if (loadError) setError(loadError.message);
    else setItems((data ?? []) as unknown as QuoteRecord[]);
    setLoading(false);
  }
  useEffect(() => { void load(); }, []);

  const topics = useMemo(() => [...new Set(items.flatMap((item) => item.topic_tags ?? []))].sort(), [items]);
  const filtered = useMemo(() => items.filter((item) => {
    const text = [item.quote_text, item.figure_name, item.context, item.source_title, ...(item.topic_tags ?? [])].join(" ").toLowerCase();
    return text.includes(query.toLowerCase()) &&
      (figureFilter === "all" || item.figure_slug === figureFilter) &&
      (topicFilter === "all" || item.topic_tags?.includes(topicFilter));
  }), [items, query, figureFilter, topicFilter]);

  function beginEdit(item: QuoteRecord) {
    setEditing(item.id); setForm({
      figure_slug: item.figure_slug, quote_text: item.quote_text,
      statement_type: item.statement_type, spoken_at: item.spoken_at ?? "",
      venue: item.venue ?? "", context: item.context ?? "",
      topic_tags: (item.topic_tags ?? []).join(", "), source_title: item.source_title,
      source_url: item.source_url, source_publisher: item.source_publisher ?? "",
      verification_status: item.verification_status, verification_notes: item.verification_notes ?? "",
      published: item.published,
    }); setShowForm(true);
  }
  async function save(event: FormEvent) {
    event.preventDefault(); setSaving(true); setError("");
    const figure = figures.find((f) => f.slug === form.figure_slug);
    if (!figure) { setError("Select a figure."); setSaving(false); return; }
    const payload = { ...form, figure_name: figure.name, spoken_at: form.spoken_at || null,
      topic_tags: form.topic_tags.split(",").map((tag) => tag.trim()).filter(Boolean) };
    const result = editing
      ? await supabase.from("figure_quotes" as never).update(payload as never).eq("id", editing)
      : await supabase.from("figure_quotes" as never).insert({ ...payload, created_by: (await supabase.auth.getUser()).data.user?.id } as never);
    if (result.error) setError(result.error.message);
    else { setShowForm(false); setEditing(null); setForm(emptyForm); await load(); }
    setSaving(false);
  }
  async function remove(id: string) {
    if (!window.confirm("Delete this archive entry?")) return;
    const { error: deleteError } = await supabase.from("figure_quotes" as never).delete().eq("id", id);
    if (deleteError) setError(deleteError.message); else await load();
  }

  if (!isAuthenticated && false) return <SignedOutNotice page="the quotes archive" />;
  return <PageShell eyebrow="Primary sources" title="Fact-Checked Quotes Archive"
    intro="A searchable record of public statements, with source links, context, and transparent verification status.">
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-5">
      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
        <span>{items.length} archive entries</span><span>·</span><span>{topics.length} topics</span>
      </div>
      {isAdmin && <button onClick={() => { setEditing(null); setForm(emptyForm); setShowForm(true); }}
        className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"><Plus className="size-4"/> Add entry</button>}
    </div>
    {showForm && isAdmin && <form onSubmit={save} className="my-6 grid gap-4 rounded-md border border-border bg-card p-5">
      <div className="flex items-center justify-between"><h2 className="font-display text-xl font-semibold">{editing ? "Edit entry" : "Add archive entry"}</h2><button type="button" onClick={() => setShowForm(false)} aria-label="Close"><X className="size-5"/></button></div>
      <label className="grid gap-1 text-sm">Political figure<select required value={form.figure_slug} onChange={e=>setForm({...form,figure_slug:e.target.value})} className="rounded-md border border-input bg-background p-2"><option value="">Select figure</option>{figures.map(f=><option key={f.slug} value={f.slug}>{f.name}</option>)}</select></label>
      <label className="grid gap-1 text-sm">Quote / statement<textarea required rows={4} value={form.quote_text} onChange={e=>setForm({...form,quote_text:e.target.value})} className="rounded-md border border-input bg-background p-2"/></label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1 text-sm">Type<select value={form.statement_type} onChange={e=>setForm({...form,statement_type:e.target.value})} className="rounded-md border border-input bg-background p-2">{["quote","speech","interview","public_statement"].map(v=><option key={v} value={v}>{v.replace("_"," ")}</option>)}</select></label>
        <label className="grid gap-1 text-sm">Date<input type="date" value={form.spoken_at} onChange={e=>setForm({...form,spoken_at:e.target.value})} className="rounded-md border border-input bg-background p-2"/></label>
        <label className="grid gap-1 text-sm">Venue / event<input value={form.venue} onChange={e=>setForm({...form,venue:e.target.value})} className="rounded-md border border-input bg-background p-2"/></label>
        <label className="grid gap-1 text-sm">Topics (comma-separated)<input value={form.topic_tags} onChange={e=>setForm({...form,topic_tags:e.target.value})} placeholder="economy, foreign policy" className="rounded-md border border-input bg-background p-2"/></label>
        <label className="grid gap-1 text-sm">Source title<input required value={form.source_title} onChange={e=>setForm({...form,source_title:e.target.value})} className="rounded-md border border-input bg-background p-2"/></label>
        <label className="grid gap-1 text-sm">Source URL<input required type="url" value={form.source_url} onChange={e=>setForm({...form,source_url:e.target.value})} className="rounded-md border border-input bg-background p-2"/></label>
        <label className="grid gap-1 text-sm">Publisher<input value={form.source_publisher} onChange={e=>setForm({...form,source_publisher:e.target.value})} className="rounded-md border border-input bg-background p-2"/></label>
        <label className="grid gap-1 text-sm">Verification status<select value={form.verification_status} onChange={e=>setForm({...form,verification_status:e.target.value})} className="rounded-md border border-input bg-background p-2">{["unverified","verified","partially_verified","disputed"].map(v=><option key={v} value={v}>{v.replace("_"," ")}</option>)}</select></label>
      </div>
      <label className="grid gap-1 text-sm">Context<textarea rows={3} value={form.context} onChange={e=>setForm({...form,context:e.target.value})} className="rounded-md border border-input bg-background p-2"/></label>
      <label className="grid gap-1 text-sm">Verification notes<textarea rows={2} value={form.verification_notes} onChange={e=>setForm({...form,verification_notes:e.target.value})} className="rounded-md border border-input bg-background p-2"/></label>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.published} onChange={e=>setForm({...form,published:e.target.checked})}/> Published (visible to everyone)</label>
      <button disabled={saving} className="w-fit rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50">{saving ? "Saving…" : "Save entry"}</button>
    </form>}
    {error && <p role="alert" className="my-4 rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">{error}</p>}
    <div className="my-6 grid gap-3 sm:grid-cols-[1fr_14rem_12rem]">
      <label className="relative"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search quotes, people, topics…" className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm"/></label>
      <select value={figureFilter} onChange={e=>setFigureFilter(e.target.value)} className="rounded-md border border-input bg-background p-2 text-sm"><option value="all">All figures</option>{figures.map(f=><option key={f.slug} value={f.slug}>{f.name}</option>)}</select>
      <select value={topicFilter} onChange={e=>setTopicFilter(e.target.value)} className="rounded-md border border-input bg-background p-2 text-sm"><option value="all">All topics</option>{topics.map(t=><option key={t} value={t}>{t}</option>)}</select>
    </div>
    {loading ? <p className="py-12 text-center text-sm text-muted-foreground">Loading archive…</p> :
      filtered.length === 0 ? <div className="rounded-md border border-dashed border-border py-14 text-center"><Quote className="mx-auto size-8 text-muted-foreground"/><p className="mt-3 font-display text-xl">No statements found</p><p className="mt-1 text-sm text-muted-foreground">{items.length ? "Try another search or filter." : "The archive is ready for verified source material."}</p></div> :
      <div className="space-y-4">{filtered.map(item=><article key={item.id} className="rounded-md border border-border bg-card p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2"><span className="eyebrow text-accent">{item.figure_name}</span><span className="text-muted-foreground">·</span><span className="text-xs capitalize text-muted-foreground">{item.statement_type.replace("_"," ")}</span>{item.spoken_at && <><span className="text-muted-foreground">·</span><time className="text-xs text-muted-foreground">{new Date(item.spoken_at+"T00:00:00").toLocaleDateString()}</time></>}</div>
        <blockquote className="mt-4 border-l-2 border-accent pl-4 font-display text-xl leading-relaxed text-foreground">“{item.quote_text}”</blockquote>
        {item.context && <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{item.context}</p>}
        <div className="mt-4 flex flex-wrap gap-2">{(item.topic_tags??[]).map(tag=><span key={tag} className="rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground">{tag}</span>)}</div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
          <div className="min-w-0"><p className="text-xs font-semibold text-foreground">{item.source_title}</p><p className="text-xs text-muted-foreground">{item.source_publisher}</p><a href={item.source_url} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline">View source <ExternalLink className="size-3"/></a></div>
          <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${item.verification_status==="verified"?"bg-emerald-500/10 text-emerald-700":item.verification_status==="disputed"?"bg-rose-500/10 text-rose-700":"bg-amber-500/10 text-amber-700"}`}>{item.verification_status.replace("_"," ")}</span>
        </div>
        {item.verification_notes && <p className="mt-3 text-xs leading-relaxed text-muted-foreground">Verification notes: {item.verification_notes}</p>}
        {isAdmin && <div className="mt-3 flex gap-3 border-t border-border pt-3"><button onClick={()=>beginEdit(item)} className="text-xs font-semibold text-accent">Edit</button><button onClick={()=>void remove(item.id)} className="text-xs font-semibold text-destructive">Delete</button></div>}
      </article>)}</div>}
  </PageShell>;
}
