import { createFileRoute, Link } from "@tanstack/react-router";

import { figures } from "@/lib/figures";
import { FigureCard } from "@/components/FigureCard";
import { PageShell } from "@/components/PageShell";
import { SignedOutNotice } from "@/components/SignedOutNotice";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/saved")({
  head: () => ({
    meta: [
      { title: "Saved Leaders — Statesmen Archive" },
      { name: "description", content: "The political leaders you have saved for later reading in the Statesmen Archive." },
      { property: "og:title", content: "Saved Leaders — Statesmen Archive" },
      { property: "og:description", content: "Your saved political leader profiles." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SavedPage,
});

function SavedPage() {
  const { isAuthenticated, saved, toggleSaved } = useAuth();

  if (!isAuthenticated) return <SignedOutNotice page="your saved leaders" />;

  const list = figures.filter((f) => saved.includes(f.slug));

  return (
    <PageShell
      eyebrow="Account"
      title="Saved leaders"
      intro="Profiles you have bookmarked for later."
    >
      {list.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nothing saved yet.{" "}
          <Link to="/leaders" className="font-semibold text-accent hover:underline">
            Browse political leaders
          </Link>{" "}
          and use the Save button on any card.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
    </PageShell>
  );
}
