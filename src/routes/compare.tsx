import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { figures, figureOfficeRoles, type Figure } from "@/lib/figures";
import { PageShell } from "@/components/PageShell";
import { Portrait } from "@/components/Portrait";
import { AiComparison } from "@/components/AiComparison";

export const Route = createFileRoute("/compare")({
  head: () => ({
    meta: [
      { title: "Compare Political Leaders — Statesmen Archive" },
      { name: "description", content: "Compare two political leaders side by side: offices held, party, era, region and key timeline events." },
      { property: "og:title", content: "Compare Political Leaders" },
      { property: "og:description", content: "Side-by-side comparison of offices, party, era and timelines." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ComparePage,
});

function ComparePage() {
  const [leftSlug, setLeftSlug] = useState(figures[0]!.slug);
  const [rightSlug, setRightSlug] = useState(figures[1]!.slug);

  const left = figures.find((f) => f.slug === leftSlug)!;
  const right = figures.find((f) => f.slug === rightSlug)!;

  return (
    <PageShell
      eyebrow="Tool"
      title="Compare leaders"
      intro="Place two profiles side by side to compare offices, affiliations and defining events."
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <Picker label="First leader" value={leftSlug} onChange={setLeftSlug} />
        <Picker label="Second leader" value={rightSlug} onChange={setRightSlug} />
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <Column figure={left} />
        <Column figure={right} />
      </div>

      <AiComparison />
    </PageShell>
  );
}

function Picker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="eyebrow text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-md border border-border bg-card px-3 py-2.5 text-sm text-foreground"
      >
        {figures.map((f) => (
          <option key={f.slug} value={f.slug}>
            {f.name} — {f.country}
          </option>
        ))}
      </select>
    </label>
  );
}

function Column({ figure }: { figure: Figure }) {
  const roles = figureOfficeRoles(figure);
  return (
    <article className="rounded-md border border-border bg-card p-6">
      <div className="flex items-start gap-4">
        <Portrait initials={figure.initials} name={figure.name} size="md" />
        <div className="min-w-0">
          <h2 className="font-display text-xl font-semibold leading-tight text-foreground">
            {figure.name}
          </h2>
          <p className="text-xs text-muted-foreground">{figure.title}</p>
        </div>
      </div>

      <dl className="mt-5 space-y-3 text-sm">
        <Fact label="Country" value={figure.country} />
        <Fact label="Region" value={figure.region} />
        <Fact label="Era" value={figure.era} />
        <Fact label="Party" value={figure.party} />
        <Fact label="Born" value={figure.born} />
        <Fact label="Died" value={figure.died ?? "—"} />
        <Fact label="Roles" value={roles.join(", ") || "—"} />
      </dl>

      <h3 className="eyebrow mt-6 text-muted-foreground">Offices held</h3>
      <ul className="mt-2 space-y-1.5 text-sm text-foreground/80">
        {figure.offices.map((o) => (
          <li key={o}>{o}</li>
        ))}
      </ul>

      <h3 className="eyebrow mt-6 text-muted-foreground">Key events</h3>
      <ul className="mt-2 space-y-2 text-sm">
        {figure.timeline.slice(0, 4).map((t) => (
          <li key={t.year + t.title}>
            <span className="font-semibold text-accent">{t.year}</span>{" "}
            <span className="text-foreground/80">{t.title}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[7rem_minmax(0,1fr)] gap-3">
      <dt className="eyebrow text-muted-foreground">{label}</dt>
      <dd className="text-foreground/85">{value}</dd>
    </div>
  );
}
