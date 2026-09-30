import { Link } from "@tanstack/react-router";

import { PageShell } from "@/components/PageShell";

export function SignedOutNotice({ page }: { page: string }) {
  return (
    <PageShell
      eyebrow="Account"
      title="Sign in required"
      intro={`Sign in to view ${page}.`}
    >
      <div className="flex flex-wrap gap-3">
        <Link
          to="/auth"
          className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Sign in
        </Link>
        <Link
          to="/auth"
          className="rounded-md border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
        >
          Create an account
        </Link>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        Your saved leaders are stored with your account and follow you across
        devices.
      </p>
    </PageShell>
  );
}
