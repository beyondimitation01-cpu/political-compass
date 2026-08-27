import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Statesmen Archive" },
      { name: "description", content: "Submit a correction, suggest a political leader for inclusion, or contact the archive's editorial team." },
      { property: "og:title", content: "Contact the Statesmen Archive" },
      { property: "og:description", content: "Corrections, submissions and editorial enquiries." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <PageShell
      eyebrow="Platform"
      title="Contact"
      intro="Corrections, submissions and editorial enquiries are reviewed by the archive team."
    >
      <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        {sent ? (
          <div className="rounded-md border border-border bg-card p-6">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Message noted
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              This form is a front-end demo — connect a backend to deliver
              messages to the editorial team.
            </p>
            <button
              onClick={() => setSent(false)}
              className="mt-4 text-sm font-semibold text-accent hover:underline"
            >
              Send another
            </button>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
            className="space-y-4 rounded-md border border-border bg-card p-6"
          >
            <Field label="Your name" id="name">
              <input
                id="name"
                required
                className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground"
                placeholder="Jane Okafor"
              />
            </Field>
            <Field label="Email" id="email">
              <input
                id="email"
                type="email"
                required
                className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground"
                placeholder="you@example.com"
              />
            </Field>
            <Field label="Subject" id="subject">
              <select
                id="subject"
                className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground"
              >
                <option>Correction to a profile</option>
                <option>Suggest a leader</option>
                <option>Source enquiry</option>
                <option>Other</option>
              </select>
            </Field>
            <Field label="Message" id="message">
              <textarea
                id="message"
                required
                rows={5}
                className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground"
                placeholder="Describe the correction or request, with a source where possible."
              />
            </Field>
            <button
              type="submit"
              className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Send message
            </button>
          </form>
        )}

        <aside className="rounded-md border border-border bg-card p-6">
          <h2 className="eyebrow text-muted-foreground">Editorial desk</h2>
          <p className="mt-3 text-sm leading-relaxed text-foreground/85">
            Corrections are prioritised when accompanied by a citation to a
            primary or published secondary source.
          </p>
          <dl className="mt-5 space-y-3 text-sm">
            <div>
              <dt className="eyebrow text-muted-foreground">Response time</dt>
              <dd className="mt-1 text-foreground/85">Within five working days</dd>
            </div>
            <div>
              <dt className="eyebrow text-muted-foreground">Scope</dt>
              <dd className="mt-1 text-foreground/85">
                Heads of state, heads of government and party leaders
              </dd>
            </div>
          </dl>
        </aside>
      </div>
    </PageShell>
  );
}

function Field({
  label,
  id,
  children,
}: {
  label: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="eyebrow text-muted-foreground">
        {label}
      </label>
      <div className="mt-2">{children}</div>
    </div>
  );
}
