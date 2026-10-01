import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Bell, Bookmark, User, LogOut, Shield } from "lucide-react";

import { useAuth } from "@/lib/auth";

const searchDefaults = {
  q: "",
  era: "all",
  region: "all",
  office: "all",
  sort: "relevance",
  page: 1,
} as const;

const primaryNav = [
  { to: "/", label: "Home" },
  { to: "/leaders", label: "Political Leaders" },
  { to: "/countries", label: "Countries" },
  { to: "/regions", label: "States/Regions" },
  { to: "/parties", label: "Political Parties" },
  { to: "/news", label: "News" },
  { to: "/quotes", label: "Quotes Archive" },
  { to: "/policy-records", label: "Voting & Policy Records" },
  { to: "/relationships", label: "Political Connections" },
  { to: "/compare", label: "Compare" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, user, notifications, signOut } = useAuth();


  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => setOpen(false);

  const handleSignOut = () => {
    void signOut();
    close();
    navigate({ to: "/" });
  };


  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-3">
        <Link to="/" onClick={close} className="flex min-w-0 items-baseline gap-2">
          <span className="truncate font-display text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            Statesmen
          </span>
          <span className="eyebrow hidden text-muted-foreground sm:inline">
            Archive
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 xl:flex">
          {primaryNav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{ className: "text-foreground bg-secondary" }}
              inactiveProps={{ className: "text-muted-foreground" }}
              className="rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            to="/search"
            search={searchDefaults}
            className="rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Search
          </Link>

          {/* Signed-in quick actions (desktop) */}
          {isAuthenticated && (
            <div className="hidden items-center gap-1 xl:flex">
              <Link
                to="/dashboard"
                className="rounded-md px-2.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{ className: "text-foreground bg-secondary" }}
              >
                Dashboard
              </Link>
              <Link
                to="/notifications"
                aria-label="Notifications"
                className="relative rounded-md p-2 text-muted-foreground transition-colors hover:text-foreground"
              >
                <Bell className="size-4" />
                {unread > 0 && (
                  <span className="absolute right-1 top-1 size-1.5 rounded-full bg-accent" />
                )}
              </Link>
              <Link
                to="/saved"
                aria-label="Saved leaders"
                className="rounded-md p-2 text-muted-foreground transition-colors hover:text-foreground"
              >
                <Bookmark className="size-4" />
              </Link>
              <Link
                to="/profile"
                aria-label="Profile"
                className="rounded-md p-2 text-muted-foreground transition-colors hover:text-foreground"
              >
                <User className="size-4" />
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  aria-label="Admin dashboard"
                  className="rounded-md p-2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Shield className="size-4" />
                </Link>
              )}
              <button
                onClick={handleSignOut}
                aria-label="Log out"
                className="rounded-md p-2 text-muted-foreground transition-colors hover:text-foreground"
              >
                <LogOut className="size-4" />
              </button>
            </div>
          )}

          {!isAuthenticated && (
            <Link
              to="/auth"
              className="hidden rounded-md border border-border px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-secondary xl:inline-flex"
            >
              Sign in
            </Link>
          )}


          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-border text-foreground xl:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-border bg-background xl:hidden">
          <nav className="mx-auto max-w-6xl px-5 py-4">
            <ul className="grid gap-1">
              {primaryNav.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={close}
                    activeOptions={{ exact: item.to === "/" }}
                    activeProps={{ className: "bg-secondary text-foreground" }}
                    className="block rounded-md px-3 py-3 text-sm font-medium text-foreground/90"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/search"
                  search={searchDefaults}
                  onClick={close}
                  className="block rounded-md px-3 py-3 text-sm font-medium text-foreground/90"
                >
                  Search
                </Link>
              </li>
            </ul>

            <div className="mt-4 border-t border-border pt-4">
              {isAuthenticated ? (
                <>
                  <p className="eyebrow mb-2 text-muted-foreground">
                    {user?.name} · {user?.role}
                  </p>
                  <ul className="grid gap-1">
                    <li>
                      <MobileItem to="/dashboard" label="Dashboard" onClick={close} />
                    </li>
                    <li>
                      <MobileItem to="/profile" label="Profile" onClick={close} />
                    </li>
                    <li>
                      <MobileItem to="/saved" label="Saved Leaders" onClick={close} />
                    </li>
                    <li>
                      <MobileItem
                        to="/notifications"
                        label={`Notifications${unread ? ` (${unread})` : ""}`}
                        onClick={close}
                      />
                    </li>
                    {isAdmin && (
                      <li>
                        <MobileItem to="/admin" label="Admin Dashboard" onClick={close} />
                      </li>
                    )}
                    <li>
                      <button
                        onClick={handleSignOut}
                        className="w-full rounded-md px-3 py-3 text-left text-sm font-medium text-accent"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </>
              ) : (
                <div className="flex flex-wrap gap-2">
                  <Link
                    to="/auth"
                    onClick={close}
                    className="rounded-md bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/auth"
                    onClick={close}
                    className="rounded-md border border-border px-4 py-2.5 text-xs font-semibold text-foreground"
                  >
                    Create account
                  </Link>
                </div>
              )}

            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

function MobileItem({
  to,
  label,
  onClick,
}: {
  to: "/dashboard" | "/profile" | "/saved" | "/notifications" | "/admin";
  label: string;
  onClick: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      activeProps={{ className: "bg-secondary text-foreground" }}
      className="block rounded-md px-3 py-3 text-sm font-medium text-foreground/90"
    >
      {label}
    </Link>
  );
}
