import { createFileRoute, Link } from "@tanstack/react-router";

import { countriesByRegion } from "@/lib/news";
import { figures } from "@/lib/figures";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/countries")({
  head: () => ({
    meta: [
      { title: "Browse Leaders by Country — Statesmen Archive" },
      { name: "description", content: "Browse political leaders country by country, grouped by world region." },
      { property: "og:title", content: "Browse Leaders by Country" },
      { property: "og:description", content: "Political leaders grouped by country and world region." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CountriesPage,
});

function CountriesPage() {
  return (
    <PageShell
      eyebrow="Geography"
      title="Countries"
      intro="Every country represented in the archive, grouped by region. Select a country to see its leaders."
    >
      <div className="space-y-10">
        {countriesByRegion.map((group) => (
          <section key={group.region}>
            <h2 className="eyebrow text-accent">{group.region}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.countries.map((c) => {
                const leaders = figures.filter((f) => f.country === c.country);
                return (
                  <div
                    key={c.country}
                    className="rounded-md border border-border bg-card p-5"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-display text-lg font-semibold text-foreground">
                        {c.country}
                      </h3>
                      <span className="eyebrow text-muted-foreground">
                        {c.countryCode}
                      </span>
                    </div>
                    <ul className="mt-3 space-y-1.5">
                      {leaders.map((f) => (
                        <li key={f.slug}>
                          <Link
                            to="/figure/$slug"
                            params={{ slug: f.slug }}
                            className="text-sm text-foreground/80 transition-colors hover:text-accent"
                          >
                            {f.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </PageShell>
  );
}
