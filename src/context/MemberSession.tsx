import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

const MemberSession = createContext<{
  user: User | null;
  loading: boolean;
  error: string;
}>({ user: null, loading: true, error: "" });

export function MemberSessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(Boolean(supabase));
  const [error, setError] = useState("");
  useEffect(() => {
    if (!supabase) return;
    let active = true;
    let authEventReceived = false;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      authEventReceived = true;
      if (!active) return;
      setUser(session?.user ?? null);
      setLoading(false);
    });
    void supabase.auth
      .getUser()
      .then(({ data, error: authError }) => {
        if (!active || authEventReceived) return;
        setUser(data.user);
        if (authError && authError.name !== "AuthSessionMissingError")
          setError(
            "We couldn't check your sign-in. Please reload and try again.",
          );
        setLoading(false);
      })
      .catch(() => {
        if (active) {
          setError(
            "We couldn't check your sign-in. Please reload and try again.",
          );
          setLoading(false);
        }
      });
    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);
  return (
    <MemberSession.Provider value={{ user, loading, error }}>
      {children}
    </MemberSession.Provider>
  );
}

export const useMemberSession = () => useContext(MemberSession);
