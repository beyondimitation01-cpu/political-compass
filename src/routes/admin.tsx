import { createFileRoute } from "@tanstack/react-router";

import { figures, regions } from "@/lib/figures";
import { news } from "@/lib/news";
import { PageShell } from "@/components/PageShell";
import { SignedOutNotice } from "@/components/SignedOutNotice";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Statesmen Archive" },
      { name: "description", content: "Administrative overview of archive content: profile counts, coverage by region and editorial activity." },
      { property: "og:title", content: "Admin Dashboard — Statesmen Archive" },
      { property: "og:description", content: "Content overview and editorial activity." },
      { property: "og:type", content: "website" },
      { name: "robots", content: "noindex" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) return <SignedOutNotice page="the admin dashboard" />;

  if (!isAdmin) {
    return (
      <PageShell
        eyebrow="Restricted"
        title="Administrator access required"
        intro="Your account does not have administrator permissions."
      >
        <p className="text-sm text-muted-foreground">
          Sign out and sign back in as an administrator to view this dashboard.
        </p>
      </PageShell>
    );
  }

  const parties = new Set(figures.map((f) => f.party)).size;
  const countries = new Set(figures.map((f) => f.country)).size;

  return (
    <PageShell
      eyebrow="Administration"
      title="Admin dashboard"
      intro="Content coverage and recent editorial activity."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat value={figures.length} label="Profiles" />
        <Stat value={countries} label="Countries" />
        <Stat value={parties} label="Parties" />
        <Stat value={news.length} label="Activity entries" />
      </div>

      <h2 className="eyebrow mt-10 text-muted-foreground">Coverage by region</h2>
      <div className="mt-4 space-y-3">
        {regions.map((r) => {
          const count = figures.filter((f) => f.region === r).length;
          const pct = Math.round((count / figures.length) * 100);
          return (
            <div key={r} className="grid grid-cols-[8rem_minmax(0,1fr)_3rem] items-center gap-3">
              <span className="truncate text-sm text-foreground/85">{r}</span>
              <div className="h-2 rounded-full bg-secondary">
                <div
                  className="h-2 rounded-full bg-primary"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-right text-xs text-muted-foreground">
                {count}
              </span>
            </div>
          );
        })}
      </div>

      <h2 className="eyebrow mt-10 text-muted-foreground">Editorial log</h2>
      <ul className="mt-4 divide-y divide-border rounded-md border border-border bg-card">
        {news.map((n) => (
          <li key={n.id} className="p-4">
            <p className="text-sm font-medium text-foreground">{n.headline}</p>
            <p className="eyebrow mt-1 text-muted-foreground">
              {n.category} · {n.date}
            </p>
          </li>
        ))}
      </ul>
    </PageShell>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-md border border-border bg-card p-5">
      <p className="font-display text-3xl font-semibold text-foreground">
        {value}
      </p>
      <p className="eyebrow mt-1 text-muted-foreground">{label}</p>
    </div>
  );
}
