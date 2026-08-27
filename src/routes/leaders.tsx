import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { figures, eras, regions, officeRoles, searchFigures, type Figure, type OfficeRole } from "@/lib/figures";
import { FigureCard } from "@/components/FigureCard";
import { PageShell } from "@/components/PageShell";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/leaders")({
  head: () => ({
    meta: [
      { title: "Political Leaders — Statesmen Archive" },
      { name: "description", content: "Browse every political leader in the archive with filters for era, region and office held." },
      { property: "og:title", content: "Political Leaders — Statesmen Archive" },
      { property: "og:description", content: "Browse every political leader in the archive with filters for era, region and office." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LeadersPage,
});

function LeadersPage() {
  const [era, setEra] = useState<Figure["era"] | "all">("all");
  const [region, setRegion] = useState<Figure["region"] | "all">("all");
  const [office, setOffice] = useState<OfficeRole | "all">("all");
  const { isAuthenticated, saved, toggleSaved } = useAuth();

  const list = useMemo(
    () => searchFigures({ query: "", era, region, office }),
    [era, region, office],
  );

  return (
    <PageShell
      eyebrow="Directory"
      title="Political leaders"
      intro={`All ${figures.length} profiles in the archive, filterable by era, region and office.`}
    >
      <div className="mb-8 space-y-3">
        <Row label="Era">
          <Chip active={era === "all"} onClick={() => setEra("all")} label="All" />
          {eras.map((e) => (
            <Chip key={e} active={era === e} onClick={() => setEra(e)} label={e} />
          ))}
        </Row>
        <Row label="Region">
          <Chip active={region === "all"} onClick={() => setRegion("all")} label="All" />
          {regions.map((r) => (
            <Chip key={r} active={region === r} onClick={() => setRegion(r)} label={r} />
          ))}
        </Row>
        <Row label="Office">
          <Chip active={office === "all"} onClick={() => setOffice("all")} label="All" />
          {officeRoles.map((o) => (
            <Chip key={o} active={office === o} onClick={() => setOffice(o)} label={o} />
          ))}
        </Row>
      </div>

      <p className="mb-4 text-sm text-muted-foreground">
        {list.length} of {figures.length} profiles
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((f) => (
          <div key={f.slug} className="relative">
            <FigureCard figure={f} />
            {isAuthenticated && (
              <button
                onClick={() => toggleSaved(f.slug)}
                className="absolute right-3 top-3 rounded-full border border-border bg-background px-2.5 py-1 text-[10px] font-semibold text-muted-foreground hover:text-accent"
              >
                {saved.includes(f.slug) ? "Saved" : "Save"}
              </button>
            )}
          </div>
        ))}
      </div>
    </PageShell>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="eyebrow w-16 shrink-0 text-muted-foreground">{label}</span>
      {children}
    </div>
  );
}

function Chip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
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
