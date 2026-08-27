import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  figures,
  eras,
  regions,
  officeRoles,
  searchFigures,
  type Figure,
  type OfficeRole,
} from "@/lib/figures";
import { FigureCard } from "@/components/FigureCard";
import { Portrait } from "@/components/Portrait";
import heroLibrary from "@/assets/hero-library.jpg";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Statesmen Archive — Profiles of Political Figures" },
      {
        name: "description",
        content:
          "A neutral editorial reference of political figures from across the world and across eras — biographies, offices held, and key timeline events.",
      },
      { property: "og:title", content: "The Statesmen Archive" },
      {
        property: "og:description",
        content:
          "Profiles of political figures from across the world and across eras — biographies, offices, and timelines.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [query, setQuery] = useState("");
  const [era, setEra] = useState<Figure["era"] | "all">("all");
  const [region, setRegion] = useState<Figure["region"] | "all">("all");
  const [office, setOffice] = useState<OfficeRole | "all">("all");

  const featured = figures[0]!;

  const filtered = useMemo(
    () => searchFigures({ query, era, region, office }),
    [query, era, region, office],
  );

  const hasFilters =
    query.trim() !== "" || era !== "all" || region !== "all" || office !== "all";

  const clearAll = () => {
    setQuery("");
    setEra("all");
    setRegion("all");
    setOffice("all");
  };


  const featuredLifespan = featured.died
    ? `${featured.born.slice(-4)}–${featured.died.slice(-4)}`
    : `${featured.born.slice(-4)}–`;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <Link to="/" className="flex items-baseline gap-2">
            <span className="font-display text-2xl font-semibold tracking-tight text-foreground">
              Statesmen
            </span>
            <span className="eyebrow text-muted-foreground">Archive</span>
          </Link>
          <nav className="flex items-center gap-5">
            <span className="eyebrow text-muted-foreground">A neutral reference</span>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <img
          src={heroLibrary}
          alt=""
          width={1600}
          height={1008}
          className="pointer-events-none absolute inset-0 size-full object-cover opacity-[0.12]"
        />
        <div className="relative mx-auto max-w-5xl px-5 py-14 sm:py-20">
          <p className="eyebrow text-accent">Profiles in public life</p>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-5xl">
            A record of the political figures who shaped the modern world.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
            Concise, factual biographies of heads of state and government —
            their offices, parties, and the moments that defined them — drawn
            from across regions and across centuries.
          </p>

          {/* Search */}
          <div className="mt-8 flex max-w-md items-center gap-3 rounded-sm border border-border bg-card px-4 py-3">
            <svg
              className="size-4 shrink-0 text-muted-foreground"
              viewBox="0 0 16 16"
              fill="none"
            >
              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search political figures"
              placeholder="Search names, offices, parties, biographies…"
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="shrink-0 text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                Clear
              </button>
            )}
          </div>

        </div>
      </section>

      {/* Featured */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-5xl px-5 py-12">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="eyebrow text-muted-foreground">Featured figure</h2>
            <span className="eyebrow text-muted-foreground">
              {figures.length} profiles
            </span>
          </div>

          <Link
            to="/figure/$slug"
            params={{ slug: featured.slug }}
            className="group grid gap-6 sm:grid-cols-[auto_1fr]"
          >
            <div className="flex flex-col items-start gap-4 sm:flex-row">
              <Portrait
                initials={featured.initials}
                name={featured.name}
                size="xl"
              />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="eyebrow text-accent">{featured.country}</span>
                <span className="text-[10px] text-muted-foreground">·</span>
                <span className="eyebrow text-muted-foreground">
                  {featuredLifespan}
                </span>
              </div>
              <h3 className="mt-2 font-display text-3xl font-semibold leading-tight text-foreground group-hover:text-accent sm:text-4xl">
                {featured.name}
              </h3>
              <p className="mt-1 text-sm font-medium text-muted-foreground">
                {featured.title}
              </p>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-foreground/80">
                {featured.summary}
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent">
                Read full profile
                <svg
                  className="size-4 transition-transform group-hover:translate-x-1"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M3 8h10M9 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* Directory */}
      <section id="directory" className="mx-auto max-w-5xl px-5 py-12">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-display text-2xl font-semibold text-foreground">
            The directory
          </h2>
          <p className="text-sm text-muted-foreground">
            {filtered.length} of {figures.length} profiles
            {hasFilters && (
              <>
                {" · "}
                <button
                  onClick={clearAll}
                  className="font-semibold text-accent hover:underline"
                >
                  Clear all
                </button>
              </>
            )}
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <FilterRow label="Era">
            <FilterChip
              active={era === "all"}
              onClick={() => setEra("all")}
              label="All"
            />
            {eras.map((e) => (
              <FilterChip
                key={e}
                active={era === e}
                onClick={() => setEra(e)}
                label={e}
              />
            ))}
          </FilterRow>

          <FilterRow label="Region">
            <FilterChip
              active={region === "all"}
              onClick={() => setRegion("all")}
              label="All"
            />
            {regions.map((r) => (
              <FilterChip
                key={r}
                active={region === r}
                onClick={() => setRegion(r)}
                label={r}
              />
            ))}
          </FilterRow>

          <FilterRow label="Office">
            <FilterChip
              active={office === "all"}
              onClick={() => setOffice("all")}
              label="All"
            />
            {officeRoles.map((o) => (
              <FilterChip
                key={o}
                active={office === o}
                onClick={() => setOffice(o)}
                label={o}
              />
            ))}
          </FilterRow>
        </div>

        {filtered.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            No figures match your search.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {filtered.map((figure) => (
              <FigureCard key={figure.slug} figure={figure} />
            ))}
          </div>
        )}
      </section>


      <Footer />
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
        active
          ? "bg-primary text-primary-foreground"
          : "border border-border bg-card text-muted-foreground hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-5xl px-5 py-10">
        <div className="flex items-baseline justify-between">
          <span className="font-display text-xl font-semibold text-foreground">
            Statesmen Archive
          </span>
          <span className="eyebrow text-muted-foreground">A neutral reference</span>
        </div>
        <p className="mt-3 max-w-md text-xs leading-relaxed text-muted-foreground">
          Biographical summaries are compiled for educational reference. Content
          is neutral and factual; verify against primary sources for scholarly
          use.
        </p>
        <p className="mt-6 text-[10px] text-muted-foreground/70">
          © {new Date().getFullYear()} Statesmen Archive
        </p>
      </div>
    </footer>
  );
}
