import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";

import { figures } from "@/lib/figures";
import { compareWithAi } from "@/lib/compare-ai.functions";

export function AiComparison() {
  const run = useServerFn(compareWithAi);
  const [selected, setSelected] = useState<string[]>([figures[0]!.slug, figures[1]!.slug]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const toggle = (slug: string) =>
    setSelected((cur) =>
      cur.includes(slug) ? cur.filter((s) => s !== slug) : cur.length >= 4 ? cur : [...cur, slug],
    );

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setAnswer(null);
    try {
      const res = await run({ data: { slugs: selected, question } });
      if (res.ok) setAnswer(res.text);
      else setError(res.error);
    } catch {
      setError("The comparison could not be generated.");
    } finally {
      setLoading(false);
    }
  }

  const canSubmit = selected.length >= 2 && question.trim().length >= 3 && !loading;

  return (
    <section className="mt-12 rounded-md border border-border bg-card p-6">
      <p className="eyebrow text-accent">AI-powered</p>
      <h2 className="mt-1 font-display text-2xl font-semibold text-foreground">Ask a comparison question</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Choose 2–4 leaders and ask a question. The answer is neutral and based only on their profiles here.
      </p>

      <form onSubmit={submit} className="mt-5 space-y-4">
        <div className="flex flex-wrap gap-2">
          {figures.map((f) => {
            const on = selected.includes(f.slug);
            return (
              <button
                type="button"
                key={f.slug}
                onClick={() => toggle(f.slug)}
                aria-pressed={on}
                className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                  on
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-foreground/80 hover:border-foreground/40"
                }`}
              >
                {f.name}
              </button>
            );
          })}
        </div>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          maxLength={500}
          rows={3}
          placeholder="e.g. How did their approaches to national unity differ?"
          className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground"
        />
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-muted-foreground">{selected.length} selected</span>
          <button
            type="submit"
            disabled={!canSubmit}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
          >
            {loading ? "Comparing…" : "Compare"}
          </button>
        </div>
      </form>

      {error && <p className="mt-4 rounded-md border border-destructive/40 p-3 text-sm text-destructive">{error}</p>}
      {answer && (
        <div className="mt-6 whitespace-pre-wrap border-t border-border pt-5 text-sm leading-relaxed text-foreground/90">
          {answer}
        </div>
      )}
    </section>
  );
}
