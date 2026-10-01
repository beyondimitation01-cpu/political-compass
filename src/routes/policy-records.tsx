import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Search, ExternalLink, Plus, X, ClipboardList } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { PageShell } from "@/components/PageShell";
import { figures } from "@/lib/figures";

type PolicyRecord = {
  id: string; figure_slug: string; figure_name: string; policy_topic: string;
  record_type: "position" | "vote"; position: string; description: string;
  recorded_at: string | null; legislative_body: string | null; bill_or_policy: string | null;
  vote: string | null; source_title: string; source_url: string; source_publisher: string | null;
  verification_status: string; verification_notes: string; published: boolean;
};
const blank = {
  figure_slug: "", policy_topic: "", record_type: "position" as "position" | "vote",
  position: "", description: "", recorded_at: "", legislative_body: "",
  bill_or_policy: "", vote: "", source_title: "", source_url: "", source_publisher: "",
  verification_status: "unverified", verification_notes: "", published: false,
};
export const Route = createFileRoute("/policy-records")({
  head: () => ({ meta: [
    { title: "Voting Records & Policy Positions — Statesmen Archive" },
    { name: "description", content: "A sourced archive of documented policy positions and legislative voting records." },
  ] }),
  component: PolicyRecordsPage,
});
function PolicyRecordsPage() {
  const { isAdmin } = useAuth();
  const [items, setItems] = useState<PolicyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [figureFilter, setFigureFilter] = useState("all");
  const [topicFilter, setTopicFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);
  async function load() {
    setLoading(true); setError("");
    const { data, error: loadError } = await supabase.from("figure_policy_records" as never)
      .select("*").order("recorded_at", { ascending: false, nullsFirst: false });
    if (loadError) setError(loadError.message);
    else setItems((data ?? []) as unknown as PolicyRecord[]);
    setLoading(false);
  }
  useEffect(() => { void load(); }, []);
  const topics = useMemo(() => [...new Set(items.map((item) => item.policy_topic))].sort(), [items]);
  const filtered = useMemo(() => items.filter((item) => {
    const haystack = [item.figure_name, item.policy_topic, item.position, item.description,
      item.bill_or_policy ?? "", item.legislative_body ?? "", item.source_title,
      item.verification_notes ?? ""].join(" ").toLowerCase();
    return haystack.includes(query.toLowerCase()) &&
      (figureFilter === "all" || item.figure_slug === figureFilter) &&
      (topicFilter === "all" || item.policy_topic === topicFilter);
  }), [items, query, figureFilter, topicFilter]);
  function edit(item: PolicyRecord) {
    setEditing(item.id);
    setForm({
      figure_slug: item.figure_slug, policy_topic: item.policy_topic, record_type: item.record_type,
      position: item.position, description: item.description, recorded_at: item.recorded_at ?? "",
      legislative_body: item.legislative_body ?? "", bill_or_policy: item.bill_or_policy ?? "",
      vote: item.vote ?? "", source_title: item.source_title, source_url: item.source_url,
      source_publisher: item.source_publisher ?? "", verification_status: item.verification_status,
      verification_notes: item.verification_notes ?? "", published: item.published,
    });
    setFormOpen(true);
  }
  async function save(event: FormEvent) {
    event.preventDefault(); setSaving(true); setError("");
    const figure = figures.find((candidate) => candidate.slug === form.figure_slug);
    if (!figure) { setError("Select a figure."); setSaving(false); return; }
    const payload = { ...form, figure_name: figure.name, recorded_at: form.recorded_at || null,
      vote: form.record_type === "vote" && form.vote ? form.vote : null,
      legislative_body: form.legislative_body || null, bill_or_policy: form.bill_or_policy || null,
      source_publisher: form.source_publisher || null };
    const result = editing
      ? await supabase.from("figure_policy_records" as never).update(payload as never).eq("id", editing)
      : await supabase.from("figure_policy_records" as never).insert({
          ...payload, created_by: (await supabase.auth.getUser()).data.user?.id,
        } as never);
    if (result.error) setError(result.error.message);
    else { setFormOpen(false); setEditing(null); setForm(blank); await load(); }
    setSaving(false);
  }
  async function remove(id: string) {
    if (!window.confirm("Delete this policy record?")) return;
    const { error: deleteError } = await supabase.from("figure_policy_records" as never).delete().eq("id", id);
    if (deleteError) setError(deleteError.message); else await load();
  }
  const field = "w-full rounded-md border border-input bg-background p-2 text-sm";
  const label = "grid gap-1 text-sm";
  return <PageShell eyebrow="Documented record" title="Voting Records & Policy Positions"
    intro="Explore sourced records of public figures’ stated policy positions and legislative votes. Entries distinguish documented votes from stated positions and show source and verification details.">
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-5">
      <div className="flex gap-2 text-xs text-muted-foreground"><span>{items.length} records</span><span>·</span><span>{topics.length} policy topics</span></div>
      {isAdmin && <button onClick={() => { setEditing(null); setForm(blank); setFormOpen(true); }}
        className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"><Plus className="size-4"/> Add record</button>}
    </div>
    {formOpen && isAdmin && <form onSubmit={save} className="my-6 grid gap-4 rounded-md border border-border bg-card p-5">
      <div className="flex items-center justify-between"><h2 className="font-display text-xl font-semibold">{editing ? "Edit record" : "Add policy record"}</h2><button type="button" onClick={() => setFormOpen(false)} aria-label="Close"><X className="size-5"/></button></div>
      <label className={label}>Figure<select required className={field} value={form.figure_slug} onChange={e=>setForm({...form,figure_slug:e.target.value})}><option value="">Select figure</option>{figures.map(f=><option key={f.slug} value={f.slug}>{f.name}</option>)}</select></label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className={label}>Record type<select className={field} value={form.record_type} onChange={e=>setForm({...form,record_type:e.target.value as "position"|"vote"})}><option value="position">Stated position</option><option value="vote">Legislative vote</option></select></label>
        <label className={label}>Policy topic<input required className={field} value={form.policy_topic} onChange={e=>setForm({...form,policy_topic:e.target.value})} placeholder="Healthcare, defense spending…"/></label>
        <label className={label}>Position / vote summary<input required className={field} value={form.position} onChange={e=>setForm({...form,position:e.target.value})} placeholder="Supports the proposed reform"/></label>
        <label className={label}>Date<input type="date" className={field} value={form.recorded_at} onChange={e=>setForm({...form,recorded_at:e.target.value})}/></label>
        <label className={label}>Legislative body<input className={field} value={form.legislative_body} onChange={e=>setForm({...form,legislative_body:e.target.value})} placeholder="Parliament / Congress"/></label>
        <label className={label}>Bill or policy<input className={field} value={form.bill_or_policy} onChange={e=>setForm({...form,bill_or_policy:e.target.value})}/></label>
        {form.record_type === "vote" && <label className={label}>Vote<select required className={field} value={form.vote} onChange={e=>setForm({...form,vote:e.target.value})}><option value="">Select vote</option>{["for","against","abstain","absent"].map(v=><option key={v} value={v}>{v}</option>)}</select></label>}
        <label className={label}>Source title<input required className={field} value={form.source_title} onChange={e=>setForm({...form,source_title:e.target.value})}/></label>
        <label className={label}>Source URL<input required type="url" className={field} value={form.source_url} onChange={e=>setForm({...form,source_url:e.target.value})}/></label>
        <label className={label}>Publisher<input className={field} value={form.source_publisher} onChange={e=>setForm({...form,source_publisher:e.target.value})}/></label>
        <label className={label}>Verification status<select className={field} value={form.verification_status} onChange={e=>setForm({...form,verification_status:e.target.value})}>{["unverified","verified","partially_verified","disputed"].map(v=><option key={v} value={v}>{v.replace("_"," ")}</option>)}</select></label>
      </div>
      <label className={label}>Context / explanation<textarea rows={3} className={field} value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></label>
      <label className={label}>Verification notes<textarea rows={2} className={field} value={form.verification_notes} onChange={e=>setForm({...form,verification_notes:e.target.value})}/></label>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.published} onChange={e=>setForm({...form,published:e.target.checked})}/> Published (visible to everyone)</label>
      <button disabled={saving} className="w-fit rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50">{saving ? "Saving…" : "Save record"}</button>
    </form>}
    {error && <p role="alert" className="my-4 rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">{error}</p>}
    <div className="my-6 grid gap-3 sm:grid-cols-[1fr_14rem_12rem]">
      <label className="relative"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search figures, policies, votes…" className={field+" py-2 pl-9"}/></label>
      <select aria-label="Filter by figure" className={field} value={figureFilter} onChange={e=>setFigureFilter(e.target.value)}><option value="all">All figures</option>{figures.map(f=><option key={f.slug} value={f.slug}>{f.name}</option>)}</select>
      <select aria-label="Filter by topic" className={field} value={topicFilter} onChange={e=>setTopicFilter(e.target.value)}><option value="all">All topics</option>{topics.map(t=><option key={t} value={t}>{t}</option>)}</select>
    </div>
    {loading ? <p className="py-12 text-center text-sm text-muted-foreground">Loading records…</p> :
      filtered.length === 0 ? <div className="rounded-md border border-dashed border-border py-14 text-center"><ClipboardList className="mx-auto size-8 text-muted-foreground"/><p className="mt-3 font-display text-xl">No records found</p><p className="mt-1 text-sm text-muted-foreground">{items.length ? "Try another search or filter." : "The archive is ready for sourced records."}</p></div> :
      <div className="space-y-4">{filtered.map(item=><article key={item.id} className="rounded-md border border-border bg-card p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2"><span className="eyebrow text-accent">{item.figure_name}</span><span className="text-muted-foreground">·</span><span className="text-xs capitalize text-muted-foreground">{item.record_type === "vote" ? "Legislative vote" : "Stated position"}</span>{item.recorded_at && <><span className="text-muted-foreground">·</span><time className="text-xs text-muted-foreground">{new Date(item.recorded_at+"T00:00:00").toLocaleDateString()}</time></>}</div>
        <h2 className="mt-3 font-display text-xl font-semibold">{item.policy_topic}</h2><p className="mt-2 text-base font-medium text-foreground">{item.position}</p>
        {item.description && <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.description}</p>}
        {(item.legislative_body || item.bill_or_policy || item.vote) && <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">{item.legislative_body && <span>{item.legislative_body}</span>}{item.bill_or_policy && <span>· {item.bill_or_policy}</span>}{item.vote && <span>· Vote: {item.vote}</span>}</div>}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4"><div className="min-w-0"><p className="text-xs font-semibold">{item.source_title}</p>{item.source_publisher && <p className="text-xs text-muted-foreground">{item.source_publisher}</p>}<a href={item.source_url} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline">View source <ExternalLink className="size-3"/></a></div><span className={"rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide "+(item.verification_status==="verified"?"bg-emerald-500/10 text-emerald-700":item.verification_status==="disputed"?"bg-rose-500/10 text-rose-700":"bg-amber-500/10 text-amber-700")}>{item.verification_status.replace("_"," ")}</span></div>
        {item.verification_notes && <p className="mt-3 text-xs leading-relaxed text-muted-foreground">Verification notes: {item.verification_notes}</p>}
        {isAdmin && <div className="mt-3 flex gap-3 border-t border-border pt-3"><button onClick={()=>edit(item)} className="text-xs font-semibold text-accent">Edit</button><button onClick={()=>void remove(item.id)} className="text-xs font-semibold text-destructive">Delete</button></div>}
      </article>)}</div>}
  </PageShell>;
}
