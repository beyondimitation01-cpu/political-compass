import { createFileRoute } from "@tanstack/react-router";

import { PageShell } from "@/components/PageShell";
import { SignedOutNotice } from "@/components/SignedOutNotice";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — Statesmen Archive" },
      { name: "description", content: "Alerts about profile updates, corrections and archive activity relevant to you." },
      { property: "og:title", content: "Notifications — Statesmen Archive" },
      { property: "og:description", content: "Alerts about profile updates and archive activity." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NotificationsPage,
});

function NotificationsPage() {
  const { isAuthenticated, notifications, markAllRead } = useAuth();

  if (!isAuthenticated) return <SignedOutNotice page="your notifications" />;

  return (
    <PageShell
      eyebrow="Account"
      title="Notifications"
      intro="Updates to profiles and archive activity."
    >
      <div className="mb-4 flex justify-end">
        <button
          onClick={markAllRead}
          className="text-sm font-semibold text-accent hover:underline"
        >
          Mark all as read
        </button>
      </div>
      <ul className="divide-y divide-border rounded-md border border-border bg-card">
        {notifications.map((n) => (
          <li key={n.id} className="flex items-start gap-3 p-5">
            <span
              className={`mt-1.5 size-2 shrink-0 rounded-full ${
                n.read ? "bg-border" : "bg-accent"
              }`}
              aria-hidden="true"
            />
            <div className="min-w-0">
              <p className="text-sm text-foreground/90">{n.text}</p>
              <time className="eyebrow mt-1 block text-muted-foreground">
                {n.date}
              </time>
            </div>
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
