import { createFileRoute, Link } from "@tanstack/react-router";

import { figures } from "@/lib/figures";
import { FigureCard } from "@/components/FigureCard";
import { PageShell } from "@/components/PageShell";
import { SignedOutNotice } from "@/components/SignedOutNotice";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Your Dashboard — Statesmen Archive" },
      {
        name: "description",
        content:
          "Your Statesmen Archive dashboard: profile details, saved political leaders and reading activity in one place.",
      },
      { property: "og:title", content: "Your Dashboard — Statesmen Archive" },
      {
        property: "og:description",
        content: "Profile and saved political leader bookmarks in one place.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { user, isAuthenticated, saved, notifications, toggleSaved } =
    useAuth();

  if (!isAuthenticated || !user) return <SignedOutNotice page="your dashboard" />;

  const list = figures.filter((f) => saved.includes(f.slug));
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <PageShell
      eyebrow="Account"
      title={`Welcome back, ${user.name}`}
      intro="Your profile and bookmarked leaders at a glance."
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile summary */}
        <aside className="space-y-4">
          <div className="rounded-md border border-border bg-card p-6">
            <p className="eyebrow text-muted-foreground">Profile</p>
            <p className="mt-2 font-display text-2xl font-semibold text-foreground">
              {user.name}
            </p>
            <p className="mt-1 text-sm text-foreground/85">{user.email}</p>
            <p className="mt-1 text-sm capitalize text-muted-foreground">
              {user.role}
            </p>
            <Link
              to="/profile"
              className="mt-4 inline-block text-xs font-semibold text-accent hover:underline"
            >
              View full profile
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Tile value={String(saved.length)} label="Saved leaders" />
            <Tile value={String(unread)} label="Unread alerts" />
          </div>
        </aside>

        {/* Saved leaders */}
        <section className="lg:col-span-2">
          <div className="mb-4 flex items-baseline justify-between gap-4">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Your saved leaders
            </h2>
            <Link
              to="/leaders"
              className="text-xs font-semibold text-accent hover:underline"
            >
              Browse more
            </Link>
          </div>
          {list.length === 0 ? (
            <p className="rounded-md border border-border bg-card p-6 text-sm text-muted-foreground">
              Nothing saved yet.{" "}
              <Link
                to="/leaders"
                className="font-semibold text-accent hover:underline"
              >
                Browse political leaders
              </Link>{" "}
              and use the Save button on any card.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {list.map((f) => (
                <div key={f.slug} className="relative">
                  <FigureCard figure={f} />
                  <button
                    onClick={() => toggleSaved(f.slug)}
                    className="absolute right-3 top-3 rounded-full border border-border bg-background px-2.5 py-1 text-[10px] font-semibold text-muted-foreground hover:text-accent"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </PageShell>
  );
}

function Tile({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-md border border-border bg-card p-5">
      <p className="font-display text-3xl font-semibold text-foreground">
        {value}
      </p>
      <p className="eyebrow mt-1 text-muted-foreground">{label}</p>
    </div>
  );
}
