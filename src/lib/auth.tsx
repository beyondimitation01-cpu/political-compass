import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";

export type SessionUser = {
  name: string;
  email: string;
  role: "member" | "admin";
};

type AuthValue = {
  user: SessionUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  saved: string[];
  notifications: { id: string; date: string; text: string; read: boolean }[];
  signOut: () => Promise<void>;
  toggleSaved: (slug: string) => Promise<void>;
  markAllRead: () => void;
};

const AuthContext = createContext<AuthValue | null>(null);

const seedNotifications = [
  { id: "a1", date: "12 Aug 2026", text: "Timeline entries expanded for post-war European leaders.", read: false },
  { id: "a2", date: "04 Aug 2026", text: "Office classifications standardised across all profiles.", read: false },
  { id: "a3", date: "27 Jul 2026", text: "Source review completed for independence-era biographies.", read: true },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState<string[]>([]);
  const [notifications, setNotifications] = useState(seedNotifications);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setLoading(false);
    });
    void supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const authUser = session?.user;
    if (!authUser) {
      setUser(null);
      setSaved([]);
      return;
    }

    let active = true;

    void (async () => {
      const [profileRes, rolesRes, savedRes] = await Promise.all([
        supabase.from("profiles").select("display_name, email").eq("id", authUser.id).maybeSingle(),
        supabase.from("user_roles").select("role").eq("user_id", authUser.id),
        supabase.from("saved_figures").select("slug").eq("user_id", authUser.id),
      ]);
      if (!active) return;

      const isAdmin = (rolesRes.data ?? []).some((r) => r.role === "admin");
      setUser({
        name:
          profileRes.data?.display_name ??
          (authUser.email ? authUser.email.split("@")[0]! : "Reader"),
        email: profileRes.data?.email ?? authUser.email ?? "",
        role: isAdmin ? "admin" : "member",
      });
      setSaved((savedRes.data ?? []).map((row) => row.slug));
    })();

    return () => {
      active = false;
    };
  }, [session]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setSaved([]);
  }, []);

  const toggleSaved = useCallback(
    async (slug: string) => {
      const userId = session?.user.id;
      if (!userId) return;
      const isSaved = saved.includes(slug);
      setSaved((prev) => (isSaved ? prev.filter((s) => s !== slug) : [...prev, slug]));
      if (isSaved) {
        await supabase.from("saved_figures").delete().eq("user_id", userId).eq("slug", slug);
      } else {
        await supabase.from("saved_figures").insert({ user_id: userId, slug });
      }
    },
    [session, saved],
  );

  const markAllRead = useCallback(
    () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true }))),
    [],
  );

  const value = useMemo<AuthValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      isAdmin: user?.role === "admin",
      loading,
      saved,
      notifications,
      signOut,
      toggleSaved,
      markAllRead,
    }),
    [user, loading, saved, notifications, signOut, toggleSaved, markAllRead],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
