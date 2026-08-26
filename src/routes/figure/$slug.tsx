import { createFileRoute, Link } from "@tanstack/react-router";
import { getFigure, figures } from "@/lib/figures";
import { Portrait } from "@/components/Portrait";

export const Route = createFileRoute("/figure/$slug")({
  head: ({ params }) => {
    const figure = getFigure(params.slug);
    const title = figure
      ? `${figure.name} — Statesmen Archive`
      : "Figure — Statesmen Archive";
    const description = figure
      ? `${figure.name}, ${figure.title} of ${figure.country}. ${figure.summary}`
      : "Profile of a political figure.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: FigureProfile,
  notFoundComponent: () => <NotFoundFigure />,
});

function NotFoundFigure() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-24 text-center">
      <h1 className="font-display text-3xl font-semibold text-foreground">
        Figure not found
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        This profile doesn't exist in the archive.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent"
      >
        ← Back to the directory
      </Link>
    </div>
  );
}

function FigureProfile() {
  const { slug } = Route.useParams();
  const figure = getFigure(slug);

  if (!figure) return <NotFoundFigure />;

  const lifespan = figure.died
    ? `${figure.born} – ${figure.died}`
    : `${figure.born} – present`;

  const related = figures
    .filter((f) => f.slug !== figure.slug && f.region === figure.region)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <Link to="/" className="flex items-baseline gap-2">
            <span className="font-display text-2xl font-semibold tracking-tight text-foreground">
              Statesmen
            </span>
            <span className="eyebrow text-muted-foreground">Archive</span>
          </Link>
          <Link
            to="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Directory
          </Link>
        </div>
      </header>

      {/* Profile header */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-5xl px-5 py-10">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            ← All figures
          </Link>
          <div className="mt-6 grid gap-8 sm:grid-cols-[auto_1fr] sm:gap-10">
            <Portrait
              initials={figure.initials}
              name={figure.name}
              size="xl"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="eyebrow text-accent">{figure.country}</span>
                <span className="text-[10px] text-muted-foreground">·</span>
                <span className="eyebrow text-muted-foreground">
                  {figure.era}
                </span>
              </div>
              <h1 className="mt-2 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl">
                {figure.name}
              </h1>
              <p className="mt-2 text-lg text-muted-foreground">
                {figure.title}
              </p>
              <p className="mt-1 text-sm font-medium text-foreground/70">
                {lifespan}
              </p>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-foreground/80">
                {figure.summary}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Body: bio + sidebar */}
      <section className="mx-auto max-w-5xl px-5 py-12">
        <div className="grid gap-12 lg:grid-cols-[1fr_18rem]">
          {/* Main column */}
          <div className="min-w-0">
            <h2 className="eyebrow text-muted-foreground">Biography</h2>
            <div className="mt-5 space-y-5">
              {figure.bio.map((para, i) => (
                <p
                  key={i}
                  className="text-base leading-relaxed text-foreground/85"
                >
                  {para}
                </p>
              ))}
            </div>

            {/* Timeline */}
            <h2 className="eyebrow mt-14 text-muted-foreground">Timeline</h2>
            <ol className="mt-6 space-y-8 border-l border-border pl-6">
              {figure.timeline.map((event, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[27px] top-1.5 size-2.5 rounded-full bg-accent ring-4 ring-background" />
                  <time className="text-xs font-semibold uppercase tracking-widest text-accent">
                    {event.year}
                  </time>
                  <h3 className="mt-1 font-display text-xl font-semibold leading-tight text-foreground">
                    {event.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {event.detail}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <div className="rounded-sm border border-border bg-card p-5">
              <h2 className="eyebrow text-muted-foreground">Key facts</h2>
              <dl className="mt-4 space-y-4">
                <Fact label="Born" value={figure.born} />
                {figure.died && <Fact label="Died" value={figure.died} />}
                <Fact label="Country" value={figure.country} />
                <Fact label="Party" value={figure.party} />
                <Fact label="Region" value={figure.region} />
              </dl>

              <div className="mt-6 border-t border-border pt-5">
                <h3 className="eyebrow text-muted-foreground">Offices held</h3>
                <ul className="mt-3 space-y-2">
                  {figure.offices.map((office, i) => (
                    <li
                      key={i}
                      className="text-sm leading-snug text-foreground/80"
                    >
                      {office}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="border-t border-border">
          <div className="mx-auto max-w-5xl px-5 py-12">
            <h2 className="eyebrow text-muted-foreground">
              More from {figure.region}
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {related.map((f) => (
                <Link
                  key={f.slug}
                  to="/figure/$slug"
                  params={{ slug: f.slug }}
                  className="group flex items-center gap-3 rounded-sm border border-border bg-card p-3 transition-colors hover:border-foreground/30"
                >
                  <Portrait
                    initials={f.initials}
                    name={f.name}
                    size="sm"
                  />
                  <div className="min-w-0">
                    <h3 className="truncate font-display text-sm font-semibold text-foreground group-hover:text-accent">
                      {f.name}
                    </h3>
                    <p className="truncate text-xs text-muted-foreground">
                      {f.title}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="mx-auto max-w-5xl px-5 py-10">
          <div className="flex items-baseline justify-between">
            <span className="font-display text-xl font-semibold text-foreground">
              Statesmen Archive
            </span>
            <span className="eyebrow text-muted-foreground">
              A neutral reference
            </span>
          </div>
          <p className="mt-6 text-[10px] text-muted-foreground/70">
            © {new Date().getFullYear()} Statesmen Archive
          </p>
        </div>
      </footer>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </dt>
      <dd className="text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}
