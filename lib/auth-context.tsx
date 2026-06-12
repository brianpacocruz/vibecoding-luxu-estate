"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { User, Session, AuthChangeEvent } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "./supabase-browser";
import type { UserRoleType } from "./supabase";

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  role: UserRoleType | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  session: null,
  role: null,
  isLoading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = getSupabaseBrowserClient();

  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<UserRoleType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRole = useCallback(
    async (userId: string) => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .single();

      if (error) {
        console.warn("Could not fetch role:", error.message);
      }

      setRole((data?.role as UserRoleType) ?? "user");
    },
    [supabase]
  );

  useEffect(() => {
    let mounted = true;

    // 1. Suscribirse a cambios de auth ANTES de getSession
    //    para no perder el evento SIGNED_IN del redirect OAuth
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        if (!mounted) return;

        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          // Usar setTimeout(0) para asegurarse que el estado de auth
          // está completamente propagado antes de hacer la query
          setTimeout(async () => {
            if (mounted) {
              await fetchRole(session.user.id);
              setIsLoading(false);
            }
          }, 0);
        } else {
          setRole(null);
          setIsLoading(false);
        }
      }
    );

    // 2. Obtener la sesión inicial (para SSR / primer load)
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
      if (!mounted) return;

      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        fetchRole(session.user.id).finally(() => {
          if (mounted) setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase, fetchRole]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, role, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
