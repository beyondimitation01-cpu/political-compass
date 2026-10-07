import { createFileRoute } from "@tanstack/react-router";
import { FormEvent, useEffect, useState } from "react";

import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/complaints")({
  head: () => ({
    meta: [
      { title: "Complaints — Statesmen Archive" },
      { name: "description", content: "Submit a complaint to the Statesmen Archive." },
    ],
  }),
  component: ComplaintsPage,
});

function ComplaintsPage() {
  const [count, setCount] = useState<number | null>(null);
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    void fetch("/api/public/complaints/count")
      .then(async (response) => {
        const data = (await response.json()) as { ok?: boolean; count?: number; error?: string };
        if (!response.ok || !data.ok) throw new Error(data.error || "Unable to load complaint count");
        setCount(data.count ?? 0);
      })
      .catch((error: unknown) => setStatus(error instanceof Error ? error.message : "Unable to load complaint count"));
  }, []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus("");
    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/public/complaints/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          message: formData.get("message"),
        }),
      });
      const data = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !data.ok) throw new Error(data.error || "Unable to submit complaint");

      setStatus("Thanks, your complaint was received");
      form.reset();

      const countResponse = await fetch("/api/public/complaints/count");
      const countData = (await countResponse.json()) as { count?: number };
      if (countResponse.ok && typeof countData.count === "number") setCount(countData.count);
    } catch (error: unknown) {
      setStatus(error instanceof Error ? error.message : "Unable to submit complaint");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageShell eyebrow="Feedback" title="Complaints" intro="Tell the archive team about a problem, concern, or issue that needs attention.">
      <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <form onSubmit={submit} className="space-y-4 rounded-md border border-border bg-card p-6">
          <Field label="Your name" id="name">
            <input id="name" name="name" required className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground" placeholder="Jane Okafor" />
          </Field>
          <Field label="Email" id="email">
            <input id="email" name="email" type="email" required className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground" placeholder="you@example.com" />
          </Field>
          <Field label="Message" id="message">
            <textarea id="message" name="message" required rows={6} className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground" placeholder="Describe your complaint." />
          </Field>
          <button type="submit" disabled={submitting} className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">
            {submitting ? "Submitting…" : "Submit complaint"}
          </button>
          {status && <p className="text-sm text-foreground" role="status">{status}</p>}
        </form>

        <aside className="rounded-md border border-border bg-card p-6">
          <h2 className="eyebrow text-muted-foreground">Complaints received</h2>
          <p className="mt-3 font-display text-4xl font-semibold text-foreground">{count === null ? "…" : count}</p>
          <p className="mt-2 text-sm text-muted-foreground">Total complaints: {count === null ? "…" : count}</p>
        </aside>
      </div>
    </PageShell>
  );
}

function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="eyebrow text-muted-foreground">{label}</label>
      <div className="mt-2">{children}</div>
    </div>
  );
}
