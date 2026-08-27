import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * Lightweight demo session used to drive navigation state.
 * Replace with Lovable Cloud auth when a real backend is added.
 */
export type SessionUser = {
  name: string;
  email: string;
  role: "member" | "admin";
};

type AuthValue = {
  user: SessionUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  saved: string[];
  notifications: { id: string; date: string; text: string; read: boolean }[];
  signIn: (role?: SessionUser["role"]) => void;
  signOut: () => void;
  toggleSaved: (slug: string) => void;
  markAllRead: () => void;
};

const STORAGE_KEY = "sa.session";
const SAVED_KEY = "sa.saved";

const AuthContext = createContext<AuthValue | null>(null);

const seedNotifications = [
  { id: "a1", date: "12 Aug 2026", text: "Timeline entries expanded for post-war European leaders.", read: false },
  { id: "a2", date: "04 Aug 2026", text: "Office classifications standardised across all profiles.", read: false },
  { id: "a3", date: "27 Jul 2026", text: "Source review completed for independence-era biographies.", read: true },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [saved, setSaved] = useState<string[]>([]);
  const [notifications, setNotifications] = useState(seedNotifications);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw) as SessionUser);
      const rawSaved = window.localStorage.getItem(SAVED_KEY);
      if (rawSaved) setSaved(JSON.parse(rawSaved) as string[]);
    } catch {
      /* ignore malformed storage */
    }
  }, []);

  const signIn = useCallback((role: SessionUser["role"] = "member") => {
    const next: SessionUser = {
      name: role === "admin" ? "Archive Editor" : "Archive Reader",
      email: role === "admin" ? "editor@statesmen.archive" : "reader@statesmen.archive",
      role,
    };
    setUser(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    window.localStorage.removeItem(STORAGE_KEY);
  }, []);

  const toggleSaved = useCallback((slug: string) => {
    setSaved((prev) => {
      const next = prev.includes(slug)
        ? prev.filter((s) => s !== slug)
        : [...prev, slug];
      window.localStorage.setItem(SAVED_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const markAllRead = useCallback(
    () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true }))),
    [],
  );

  const value = useMemo<AuthValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      isAdmin: user?.role === "admin",
      saved,
      notifications,
      signIn,
      signOut,
      toggleSaved,
      markAllRead,
    }),
    [user, saved, notifications, signIn, signOut, toggleSaved, markAllRead],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
