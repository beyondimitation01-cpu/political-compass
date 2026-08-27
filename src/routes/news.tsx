import { createFileRoute, Link } from "@tanstack/react-router";

import { news, recentlyUpdated } from "@/lib/news";
import { PageShell } from "@/components/PageShell";
import { Portrait } from "@/components/Portrait";

export const Route = createFileRoute("/news")({
  head: () => ({
    meta: [
      { title: "News & Activities — Statesmen Archive" },
      { name: "description", content: "Editorial activity log for the archive: profile updates, source reviews and research notes." },
      { property: "og:title", content: "News & Activities — Statesmen Archive" },
      { property: "og:description", content: "Profile updates, source reviews and research notes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NewsPage,
});

function NewsPage() {
  return (
    <PageShell
      eyebrow="Newsroom"
      title="News & activities"
      intro="A dated log of editorial changes, research reviews and archive activity."
    >
      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-4">
          {news.map((item) => (
            <article
              key={item.id}
              className="rounded-md border border-border bg-card p-6"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="eyebrow text-accent">{item.category}</span>
                <span className="text-[10px] text-muted-foreground">·</span>
                <time className="eyebrow text-muted-foreground">{item.date}</time>
              </div>
              <h2 className="mt-2 font-display text-xl font-semibold leading-snug text-foreground">
                {item.headline}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.body}
              </p>
            </article>
          ))}
        </div>

        <aside>
          <h2 className="eyebrow mb-4 text-muted-foreground">
            Recently updated profiles
          </h2>
          <ul className="divide-y divide-border rounded-md border border-border bg-card">
            {recentlyUpdated.map((f) => (
              <li key={f.slug}>
                <Link
                  to="/figure/$slug"
                  params={{ slug: f.slug }}
                  className="group flex items-center gap-4 p-4 transition-colors hover:bg-secondary/60"
                >
                  <Portrait initials={f.initials} name={f.name} size="md" />
                  <div className="min-w-0">
                    <p className="truncate font-display text-base font-semibold text-foreground group-hover:text-accent">
                      {f.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {f.country}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </PageShell>
  );
}
