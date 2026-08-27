import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-5 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <span className="font-display text-xl font-semibold text-foreground">
              Statesmen Archive
            </span>
            <p className="mt-3 max-w-xs text-xs leading-relaxed text-muted-foreground">
              Biographical summaries compiled for educational reference. Content
              is neutral and factual; verify against primary sources for
              scholarly use.
            </p>
          </div>
          <FooterCol
            title="Explore"
            links={[
              { to: "/leaders", label: "Political Leaders" },
              { to: "/countries", label: "Countries" },
              { to: "/regions", label: "States/Regions" },
              { to: "/parties", label: "Political Parties" },
            ]}
          />
          <FooterCol
            title="Tools"
            links={[
              { to: "/compare", label: "Compare" },
              { to: "/news", label: "News & Activities" },
            ]}
          />
          <FooterCol
            title="Platform"
            links={[
              { to: "/about", label: "About" },
              { to: "/contact", label: "Contact" },
            ]}
          />
        </div>
        <p className="mt-8 text-[10px] text-muted-foreground/70">
          © {new Date().getFullYear()} Statesmen Archive
        </p>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { to: string; label: string }[];
}) {
  return (
    <div>
      <p className="eyebrow text-muted-foreground">{title}</p>
      <ul className="mt-3 space-y-2">
        {links.map((l) => (
          <li key={l.to}>
            <Link
              to={l.to}
              className="text-sm text-foreground/80 transition-colors hover:text-accent"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
