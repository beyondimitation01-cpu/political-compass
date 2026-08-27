import type { ReactNode } from "react";

export function PageShell({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <p className="eyebrow text-accent">{eyebrow}</p>
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h1>
      {intro && (
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
          {intro}
        </p>
      )}
      <div className="mt-10">{children}</div>
    </div>
  );
}
