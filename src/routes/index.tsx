import { createFileRoute, useNavigate } from "@tanstack/react-router";
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
import {
  news,
  recentlyUpdated,
  popularFigures,
  countriesByRegion,
} from "@/lib/news";
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
          "A neutral editorial reference of political figures worldwide — biographies, offices held, timelines, and country-by-country browsing.",
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

  const navigate = useNavigate();
  const featured = figures.slice(0, 3);
  const lead = figures[0]!;

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

  const goToSearch = (overrides?: { q?: string; region?: Figure["region"] }) =>
    navigate({
      to: "/search",
      search: {
        q: overrides?.q ?? query,
        era,
        region: overrides?.region ?? region,
        office,
        sort: "relevance",
        page: 1,
      },
    });

  return (
    <div className="home-vintage-maroon">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <img
          src={heroLibrary}
          alt=""
          width={1600}
          height={1008}
          className="pointer-events-none absolute inset-0 size-full object-cover opacity-[0.12]"
        />
        <div className="relative mx-auto max-w-6xl px-5 py-14 sm:py-20">
          <p className="eyebrow text-accent">Profiles in public life</p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-5xl lg:text-6xl">
            A verified record of the political figures who shaped the modern
            world.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            The Statesmen Archive is a neutral reference platform. Search
            biographies, offices held, party affiliations and dated timelines
            for heads of state and government across every region and era.
          </p>

          {/* Search */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              goToSearch();
            }}
            className="mt-8 flex w-full max-w-2xl flex-col gap-3 rounded-md border border-border bg-card p-3 shadow-sm sm:flex-row sm:items-center"
          >
            <div className="flex flex-1 items-center gap-3 px-1">
              <svg
                className="size-4 shrink-0 text-muted-foreground"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
                <path
                  d="M11 11l3 3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search political leaders"
                placeholder="Search leaders, offices, parties, countries…"
                className="w-full bg-transparent py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="shrink-0 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Search the archive
            </button>
          </form>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="eyebrow mr-1 text-muted-foreground">Jump to</span>
            <QuickLink href="#featured" label="Featured leaders" />
            <QuickLink href="#popular" label="Popular" />
            <QuickLink href="#news" label="Latest activity" />
            <QuickLink href="#browse" label="Browse by country" />
            <QuickLink href="#directory" label="Full directory" />
          </div>

          <dl className="mt-10 grid max-w-2xl grid-cols-2 gap-6 sm:grid-cols-4">
            <Stat value={String(figures.length)} label="Profiles" />
            <Stat value={String(countriesByRegion.reduce((n, g) => n + g.countries.length, 0))} label="Countries" />
            <Stat value={String(regions.length)} label="Regions" />
            <Stat value={String(eras.length)} label="Eras" />
          </dl>
        </div>
      </section>

      {/* Featured */}
      <section id="featured" className="border-b border-border scroll-mt-20">
        <div className="mx-auto max-w-6xl px-5 py-14">
          <SectionHeading
            eyebrow="Featured"
            title="Featured political leaders"
            action={{ label: "View all profiles", href: "#directory" }}
          />

          <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr]">
            <Link
              to="/figure/$slug"
              params={{ slug: lead.slug }}
              className="group flex flex-col gap-5 rounded-md border border-border bg-card p-6 transition-colors hover:border-foreground/30 sm:flex-row"
            >
              <Portrait initials={lead.initials} name={lead.name} size="xl" />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="eyebrow text-accent">{lead.country}</span>
                  <span className="text-[10px] text-muted-foreground">·</span>
                  <span className="eyebrow text-muted-foreground">
                    {lifespan(lead)}
                  </span>
                </div>
                <h3 className="mt-2 font-display text-3xl font-semibold leading-tight text-foreground group-hover:text-accent">
                  {lead.name}
                </h3>
                <p className="mt-1 text-sm font-medium text-muted-foreground">
                  {lead.title}
                </p>
                <p className="mt-4 text-base leading-relaxed text-foreground/80">
                  {lead.summary}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent">
                  Read full profile
                  <Arrow />
                </span>
              </div>
            </Link>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {featured.slice(1).map((f) => (
                <FigureCard key={f.slug} figure={f} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Recently updated + news */}
      <section id="news" className="border-b border-border scroll-mt-20">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-14 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <SectionHeading eyebrow="Archive" title="Recently updated profiles" />
            <ul className="divide-y divide-border rounded-md border border-border bg-card">
              {recentlyUpdated.map((f) => (
                <li key={f.slug}>
                  <Link
                    to="/figure/$slug"
                    params={{ slug: f.slug }}
                    className="group flex items-center gap-4 p-4 transition-colors hover:bg-secondary/60"
                  >
                    <Portrait initials={f.initials} name={f.name} size="md" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display text-base font-semibold text-foreground group-hover:text-accent">
                        {f.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {f.title}
                      </p>
                    </div>
                    <span className="eyebrow shrink-0 text-muted-foreground">
                      {f.countryCode}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <SectionHeading
              eyebrow="Newsroom"
              title="Latest political activity"
            />
            <div className="space-y-4">
              {news.map((item) => (
                <article
                  key={item.id}
                  className="rounded-md border border-border bg-card p-5"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="eyebrow text-accent">{item.category}</span>
                    <span className="text-[10px] text-muted-foreground">·</span>
                    <time className="eyebrow text-muted-foreground">
                      {item.date}
                    </time>
                  </div>
                  <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-foreground">
                    {item.headline}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Popular */}
      <section id="popular" className="border-b border-border scroll-mt-20">
        <div className="mx-auto max-w-6xl px-5 py-14">
          <SectionHeading eyebrow="Most read" title="Popular leaders" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {popularFigures.map((f, i) => (
              <Link
                key={f.slug}
                to="/figure/$slug"
                params={{ slug: f.slug }}
                className="group flex items-start gap-4 rounded-md border border-border bg-card p-4 transition-colors hover:border-foreground/30"
              >
                <span className="font-display text-2xl font-semibold text-muted-foreground/60">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <h3 className="font-display text-base font-semibold leading-tight text-foreground group-hover:text-accent">
                    {f.name}
                  </h3>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {f.country} · {lifespan(f)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by country */}
      <section id="browse" className="border-b border-border scroll-mt-20">
        <div className="mx-auto max-w-6xl px-5 py-14">
          <SectionHeading
            eyebrow="Geography"
            title="Browse leaders by country and region"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {countriesByRegion.map((group) => (
              <div
                key={group.region}
                className="rounded-md border border-border bg-card p-5"
              >
                <button
                  onClick={() => goToSearch({ q: "", region: group.region })}
                  className="eyebrow text-accent hover:underline"
                >
                  {group.region}
                </button>
                <ul className="mt-3 space-y-1.5">
                  {group.countries.map((c) => (
                    <li key={c.country}>
                      <button
                        onClick={() => goToSearch({ q: c.country })}
                        className="flex w-full items-center justify-between gap-3 text-left text-sm text-foreground/80 transition-colors hover:text-accent"
                      >
                        <span className="truncate">{c.country}</span>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {c.count}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Directory */}
      <section id="directory" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-14">
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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((figure) => (
              <FigureCard key={figure.slug} figure={figure} />
            ))}
          </div>
        )}
      </section>

    </div>
  );
}

function lifespan(f: Figure) {
  return f.died ? `${f.born.slice(-4)}–${f.died.slice(-4)}` : `${f.born.slice(-4)}–`;
}

function Arrow() {
  return (
    <svg
      className="size-4 transition-transform group-hover:translate-x-1"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}



function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
    >
      {label}
    </a>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dt className="eyebrow text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-display text-3xl font-semibold text-foreground">
        {value}
      </dd>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <p className="eyebrow text-accent">{eyebrow}</p>
        <h2 className="mt-1 font-display text-2xl font-semibold text-foreground sm:text-3xl">
          {title}
        </h2>
      </div>
      {action && (
        <a
          href={action.href}
          className="text-sm font-semibold text-accent hover:underline"
        >
          {action.label}
        </a>
      )}
    </div>
  );
}

function FilterRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="eyebrow w-16 shrink-0 text-muted-foreground">
        {label}
      </span>
      {children}
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

