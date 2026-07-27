import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "./supabase";

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  hasAccess: boolean;
  isAdmin: boolean;
  loading: boolean;
  refreshAccess: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL as string | undefined;
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAccess = useCallback(async (userId: string | undefined, email: string | undefined) => {
    if (!userId) { setHasAccess(false); return; }
    const [purchaseRes, preApprovalRes] = await Promise.all([
      supabase.from("purchases").select("status").eq("user_id", userId).eq("status", "paid").limit(1).maybeSingle(),
      email ? supabase.from("pre_approved_emails").select("email").eq("email", email).limit(1).maybeSingle() : Promise.resolve({ data: null, error: null }),
    ]);
    setHasAccess(Boolean(purchaseRes.data) || Boolean(preApprovalRes.data));
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session);
      await checkAccess(data.session?.user.id, data.session?.user.email);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      await checkAccess(newSession?.user.id, newSession?.user.email);
    });
    return () => listener.subscription.unsubscribe();
  }, [checkAccess]);

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    return { error: error?.message ?? null };
  };
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  };
  const signOut = async () => { await supabase.auth.signOut(); };
  const refreshAccess = async () => { await checkAccess(session?.user.id, session?.user.email); };
  const isAdmin = Boolean(session?.user?.email && ADMIN_EMAIL && session.user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase());

  return (
    <AuthContext.Provider value={{ session, user: session?.user ?? null, hasAccess, isAdmin, loading, refreshAccess, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
