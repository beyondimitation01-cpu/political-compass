import { createFileRoute, Link } from "@tanstack/react-router";

import { figures } from "@/lib/figures";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/parties")({
  head: () => ({
    meta: [
      { title: "Political Parties — Statesmen Archive" },
      { name: "description", content: "Political parties and movements represented in the archive, with the leaders affiliated to each." },
      { property: "og:title", content: "Political Parties — Statesmen Archive" },
      { property: "og:description", content: "Parties and movements with their affiliated leaders." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PartiesPage,
});

function PartiesPage() {
  const parties = [...new Set(figures.map((f) => f.party))].sort();

  return (
    <PageShell
      eyebrow="Affiliation"
      title="Political parties"
      intro={`${parties.length} parties and movements are represented across the archive.`}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {parties.map((party) => {
          const members = figures.filter((f) => f.party === party);
          return (
            <article
              key={party}
              className="rounded-md border border-border bg-card p-5"
            >
              <h2 className="font-display text-lg font-semibold leading-snug text-foreground">
                {party}
              </h2>
              <p className="eyebrow mt-1 text-muted-foreground">
                {members.length} leader{members.length > 1 ? "s" : ""}
              </p>
              <ul className="mt-3 space-y-1.5">
                {members.map((f) => (
                  <li key={f.slug}>
                    <Link
                      to="/figure/$slug"
                      params={{ slug: f.slug }}
                      className="text-sm text-foreground/80 transition-colors hover:text-accent"
                    >
                      {f.name}
                      <span className="text-muted-foreground"> · {f.country}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </PageShell>
  );
}
