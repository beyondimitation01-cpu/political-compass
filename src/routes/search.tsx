import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { useMemo, useState, useEffect } from "react";
import {
  eras,
  regions,
  officeRoles,
  searchFigures,
  figureOfficeRoles,
  type Figure,
  type OfficeRole,
} from "@/lib/figures";
import { FigureCard } from "@/components/FigureCard";

const searchSchema = z.object({
  q: fallback(z.string(), "").default(""),
  era: fallback(z.string(), "all").default("all"),
  region: fallback(z.string(), "all").default("all"),
  office: fallback(z.string(), "all").default("all"),
  sort: fallback(z.string(), "relevance").default("relevance"),
  page: fallback(z.number().int(), 1).default(1),
});

const PER_PAGE = 6;

const sortOptions = [
  { value: "relevance", label: "Relevance" },
  { value: "name", label: "Name A–Z" },
  { value: "born-asc", label: "Born (earliest)" },
  { value: "born-desc", label: "Born (latest)" },
] as const;

export const Route = createFileRoute("/search")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "Search Political Figures — Statesmen Archive" },
      {
        name: "description",
        content:
          "Full-text search across biographies, offices, parties, and timelines of political figures, with filters for region, era, and office plus sorting and pagination.",
      },
      { property: "og:title", content: "Search the Statesmen Archive" },
      {
        property: "og:description",
        content:
          "Find political figures by keyword, region, era, and office — sorted and paginated results.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SearchPage,
});

function birthYear(f: Figure) {
  return Number(f.born.slice(-4));
}

function SearchPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/search" });

  const era = (eras as string[]).includes(search.era)
    ? (search.era as Figure["era"])
    : "all";
  const region = (regions as string[]).includes(search.region)
    ? (search.region as Figure["region"])
    : "all";
  const office = (officeRoles as readonly string[]).includes(search.office)
    ? (search.office as OfficeRole)
    : "all";
  const sort = sortOptions.some((o) => o.value === search.sort)
    ? search.sort
    : "relevance";

  const [term, setTerm] = useState(search.q);
  useEffect(() => setTerm(search.q), [search.q]);

  const results = useMemo(() => {
    const found = searchFigures({ query: search.q, era, region, office });
    const sorted = [...found];
    if (sort === "name") sorted.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "born-asc") sorted.sort((a, b) => birthYear(a) - birthYear(b));
    if (sort === "born-desc") sorted.sort((a, b) => birthYear(b) - birthYear(a));
    return sorted;
  }, [search.q, era, region, office, sort]);

  const totalPages = Math.max(1, Math.ceil(results.length / PER_PAGE));
  const page = Math.min(Math.max(1, search.page), totalPages);
  const pageItems = results.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const update = (patch: Record<string, string | number>) =>
    navigate({ search: (prev) => ({ ...prev, page: 1, ...patch }) });

  return (
    <div>
      

      <section className="border-b border-border">
        <div className="mx-auto max-w-5xl px-5 py-10">
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Search the archive
          </h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              update({ q: term });
            }}
            className="mt-6 flex max-w-xl items-center gap-3 rounded-sm border border-border bg-card px-4 py-3"
          >
            <svg
              className="size-4 shrink-0 text-muted-foreground"
              viewBox="0 0 16 16"
              fill="none"
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
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              aria-label="Search political figures"
              placeholder="Search names, offices, parties, biographies…"
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-10">
        <div className="space-y-4">
          <Row label="Era">
            <Chip
              active={era === "all"}
              onClick={() => update({ era: "all" })}
              label="All"
            />
            {eras.map((e) => (
              <Chip
                key={e}
                active={era === e}
                onClick={() => update({ era: e })}
                label={e}
              />
            ))}
          </Row>
          <Row label="Region">
            <Chip
              active={region === "all"}
              onClick={() => update({ region: "all" })}
              label="All"
            />
            {regions.map((r) => (
              <Chip
                key={r}
                active={region === r}
                onClick={() => update({ region: r })}
                label={r}
              />
            ))}
          </Row>
          <Row label="Office">
            <Chip
              active={office === "all"}
              onClick={() => update({ office: "all" })}
              label="All"
            />
            {officeRoles.map((o) => (
              <Chip
                key={o}
                active={office === o}
                onClick={() => update({ office: o })}
                label={o}
              />
            ))}
          </Row>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
          <p className="text-sm text-muted-foreground">
            {results.length} result{results.length === 1 ? "" : "s"}
            {search.q && (
              <>
                {" for "}
                <span className="font-medium text-foreground">
                  “{search.q}”
                </span>
              </>
            )}
          </p>
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            Sort
            <select
              value={sort}
              onChange={(e) => update({ sort: e.target.value })}
              className="rounded-sm border border-border bg-card px-2 py-1.5 text-sm text-foreground focus:outline-none"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {pageItems.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">
            No figures match your search.
          </p>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {pageItems.map((f) => (
              <div key={f.slug}>
                <FigureCard figure={f} />
                <p className="mt-1.5 px-1 text-[10px] uppercase tracking-widest text-muted-foreground">
                  {figureOfficeRoles(f).join(" · ")}
                </p>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <nav className="mt-10 flex items-center justify-center gap-2">
            <PageBtn
              disabled={page === 1}
              onClick={() =>
                navigate({ search: (p) => ({ ...p, page: page - 1 }) })
              }
              label="Previous"
            />
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => navigate({ search: (p) => ({ ...p, page: n }) })}
                className={`size-8 rounded-full text-xs font-medium transition-colors ${
                  n === page
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                {n}
              </button>
            ))}
            <PageBtn
              disabled={page === totalPages}
              onClick={() =>
                navigate({ search: (p) => ({ ...p, page: page + 1 }) })
              }
              label="Next"
            />
          </nav>
        )}
      </section>
    </div>
  );
}

function Row({
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

function Chip({
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

function PageBtn({
  disabled,
  onClick,
  label,
}: {
  disabled: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
    >
      {label}
    </button>
  );
}
