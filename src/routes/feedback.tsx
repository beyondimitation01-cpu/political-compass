import { createFileRoute } from "@tanstack/react-router";
import { type FormEvent, useState } from "react";

import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/feedback")({
  head: () => ({
    meta: [
      { title: "Feedback — Statesmen Archive" },
      {
        name: "description",
        content: "Share feedback, suggestions, or report a problem with the Statesmen Archive.",
      },
    ],
  }),
  component: FeedbackPage,
});

function FeedbackPage() {
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/public/feedback/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          category: formData.get("category"),
          rating: formData.get("rating"),
          message: formData.get("message"),
        }),
      });

      const data = (await response.json()) as {
        ok?: boolean;
        error?: string;
      };

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Unable to submit feedback");
      }

      form.reset();
      setStatus("Thank you — your feedback has been received.");
    } catch (error: unknown) {
      setStatus(
        error instanceof Error ? error.message : "Unable to submit feedback",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageShell
      eyebrow="Feedback"
      title="Share your feedback"
      intro="Tell us what you think of the Statesmen Archive. Suggestions, useful observations, and reports of problems all help us improve the platform."
    >
      <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <form
          onSubmit={submit}
          className="space-y-4 rounded-md border border-border bg-card p-6"
        >
          <Field label="Your name (optional)" id="name">
            <input
              id="name"
              name="name"
              className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground"
              placeholder="Jane Okafor"
            />
          </Field>

          <Field label="Email (optional)" id="email">
            <input
              id="email"
              name="email"
              type="email"
              className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground"
              placeholder="you@example.com"
            />
          </Field>

          <Field label="Feedback type" id="category">
            <select
              id="category"
              name="category"
              defaultValue="General feedback"
              className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground"
            >
              <option>General feedback</option>
              <option>Suggestion</option>
              <option>Report a problem</option>
              <option>Content correction</option>
            </select>
          </Field>

          <Field label="How would you rate the site?" id="rating">
            <select
              id="rating"
              name="rating"
              defaultValue="5"
              required
              className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground"
            >
              <option value="5">5 — Excellent</option>
              <option value="4">4 — Good</option>
              <option value="3">3 — Okay</option>
              <option value="2">2 — Needs improvement</option>
              <option value="1">1 — Poor</option>
            </select>
          </Field>

          <Field label="Your feedback" id="message">
            <textarea
              id="message"
              name="message"
              required
              rows={7}
              minLength={5}
              className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground"
              placeholder="What would you like us to know?"
            />
          </Field>

          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Submitting…" : "Send feedback"}
          </button>

          {status && (
            <p className="text-sm text-foreground" role="status">
              {status}
            </p>
          )}
        </form>

        <aside className="rounded-md border border-border bg-card p-6">
          <h2 className="eyebrow text-muted-foreground">Your feedback matters</h2>
          <p className="mt-3 text-sm leading-relaxed text-foreground/85">
            Feedback is reviewed by the team and used to improve the archive,
            its content, and the experience of using the site.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Your message is sent securely to the site's backend and is not
            displayed publicly.
          </p>
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
