import { PageShell } from "@/components/PageShell";
import { useAuth } from "@/lib/auth";

export function SignedOutNotice({ page }: { page: string }) {
  const { signIn } = useAuth();
  return (
    <PageShell
      eyebrow="Account"
      title="Sign in required"
      intro={`Sign in to view ${page}.`}
    >
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => signIn("member")}
          className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Sign in as reader
        </button>
        <button
          onClick={() => signIn("admin")}
          className="rounded-md border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
        >
          Sign in as administrator
        </button>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        Sessions are stored locally for demonstration. Connect Lovable Cloud to
        add real accounts.
      </p>
    </PageShell>
  );
}
