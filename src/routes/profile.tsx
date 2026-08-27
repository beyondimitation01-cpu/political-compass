import { createFileRoute } from "@tanstack/react-router";

import { PageShell } from "@/components/PageShell";
import { useAuth } from "@/lib/auth";
import { SignedOutNotice } from "@/components/SignedOutNotice";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your Profile — Statesmen Archive" },
      { name: "description", content: "Manage your Statesmen Archive reader profile, role and reading preferences." },
      { property: "og:title", content: "Your Profile — Statesmen Archive" },
      { property: "og:description", content: "Reader profile and preferences." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, isAuthenticated, saved, notifications } = useAuth();

  if (!isAuthenticated || !user) return <SignedOutNotice page="your profile" />;

  return (
    <PageShell eyebrow="Account" title="Your profile">
      <div className="grid gap-6 sm:grid-cols-3">
        <div className="rounded-md border border-border bg-card p-6 sm:col-span-2">
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="eyebrow text-muted-foreground">Name</dt>
              <dd className="mt-1 font-display text-xl text-foreground">
                {user.name}
              </dd>
            </div>
            <div>
              <dt className="eyebrow text-muted-foreground">Email</dt>
              <dd className="mt-1 text-foreground/85">{user.email}</dd>
            </div>
            <div>
              <dt className="eyebrow text-muted-foreground">Role</dt>
              <dd className="mt-1 capitalize text-foreground/85">{user.role}</dd>
            </div>
          </dl>
        </div>
        <div className="space-y-4">
          <Tile value={String(saved.length)} label="Saved leaders" />
          <Tile
            value={String(notifications.filter((n) => !n.read).length)}
            label="Unread alerts"
          />
        </div>
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
