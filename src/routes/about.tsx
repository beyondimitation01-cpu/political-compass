import { createFileRoute, Link } from "@tanstack/react-router";

import { figures } from "@/lib/figures";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About the Statesmen Archive" },
      { name: "description", content: "How the Statesmen Archive is compiled, its editorial standards, and how neutrality is maintained across profiles." },
      { property: "og:title", content: "About the Statesmen Archive" },
      { property: "og:description", content: "Editorial standards and methodology behind the archive." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <PageShell
      eyebrow="Platform"
      title="About the archive"
      intro="A neutral editorial reference for political biography — built for students, journalists and researchers."
    >
      <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
        <div className="space-y-5 text-base leading-relaxed text-foreground/85">
          <p>
            The Statesmen Archive collects concise, factual profiles of heads of
            state and government across regions and eras. Each profile records
            the offices a figure held, their party affiliation, and a dated
            timeline of the events that defined their public career.
          </p>
          <p>
            Entries are written in neutral language. Where a figure's record is
            contested, the archive describes the events and the positions taken
            rather than issuing a verdict. Portraits are typographic monograms
            rather than generated likenesses, so no image misrepresents a real
            person.
          </p>
          <p>
            The archive currently holds {figures.length} profiles and grows
            through periodic editorial review. Updates are logged publicly on
            the{" "}
            <Link to="/news" className="font-semibold text-accent hover:underline">
              news and activities
            </Link>{" "}
            page.
          </p>
        </div>

        <aside className="rounded-md border border-border bg-card p-6">
          <h2 className="eyebrow text-muted-foreground">Editorial standards</h2>
          <ul className="mt-4 space-y-3 text-sm text-foreground/85">
            <li>Facts are attributable to published records.</li>
            <li>Language avoids praise, condemnation and speculation.</li>
            <li>Dates and office titles follow official designations.</li>
            <li>Corrections are applied on review and logged.</li>
          </ul>
          <Link
            to="/contact"
            className="mt-6 inline-flex rounded-md bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground"
          >
            Suggest a correction
          </Link>
        </aside>
      </div>
    </PageShell>
  );
}
