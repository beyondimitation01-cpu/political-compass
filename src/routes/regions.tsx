import { createFileRoute, Link } from "@tanstack/react-router";

import { figures, regions } from "@/lib/figures";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/regions")({
  head: () => ({
    meta: [
      { title: "States & Regions — Statesmen Archive" },
      { name: "description", content: "Browse political leaders by world region and the states they governed." },
      { property: "og:title", content: "States & Regions — Statesmen Archive" },
      { property: "og:description", content: "Political leaders grouped by world region and state." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RegionsPage,
});

const searchDefaults = {
  q: "",
  era: "all",
  office: "all",
  sort: "relevance",
  page: 1,
} as const;

function RegionsPage() {
  return (
    <PageShell
      eyebrow="Geography"
      title="States & regions"
      intro="The archive is organised into five world regions. Each region lists the states represented and the leaders who governed them."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {regions.map((region) => {
          const inRegion = figures.filter((f) => f.region === region);
          const states = [...new Set(inRegion.map((f) => f.country))].sort();
          return (
            <section
              key={region}
              className="rounded-md border border-border bg-card p-6"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-display text-2xl font-semibold text-foreground">
                  {region}
                </h2>
                <Link
                  to="/search"
                  search={{ ...searchDefaults, region }}
                  className="text-sm font-semibold text-accent hover:underline"
                >
                  Search this region
                </Link>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {inRegion.length} leaders · {states.length} states
              </p>
              <ul className="mt-4 space-y-2">
                {states.map((state) => (
                  <li key={state} className="text-sm">
                    <span className="font-medium text-foreground">{state}</span>
                    <span className="text-muted-foreground">
                      {" — "}
                      {inRegion
                        .filter((f) => f.country === state)
                        .map((f) => f.name)
                        .join(", ")}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </PageShell>
  );
}
