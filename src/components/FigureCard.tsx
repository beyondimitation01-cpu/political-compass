import { Link } from "@tanstack/react-router";
import type { Figure } from "@/lib/figures";
import { Portrait } from "@/components/Portrait";

export function FigureCard({ figure }: { figure: Figure }) {
  const lifespan = figure.died
    ? `${figure.born.slice(-4)}–${figure.died.slice(-4)}`
    : `${figure.born.slice(-4)}–`;

  return (
    <Link
      to="/figure/$slug"
      params={{ slug: figure.slug }}
      className="group block rounded-sm border border-border bg-card p-4 transition-colors hover:border-foreground/30"
    >
      <div className="flex items-start gap-3">
        <Portrait
          initials={figure.initials}
          name={figure.name}
          size="md"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="eyebrow text-accent">{figure.countryCode}</span>
            <span className="text-[10px] text-muted-foreground">·</span>
            <span className="eyebrow text-muted-foreground">{lifespan}</span>
          </div>
          <h3 className="mt-1 font-display text-lg font-semibold leading-tight text-foreground group-hover:text-accent">
            {figure.name}
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{figure.title}</p>
        </div>
      </div>
      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
        {figure.summary}
      </p>
    </Link>
  );
}
