import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type AuthUser = {
  id: string;
  email: string;
  name?: string;
  token: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  signOut: () => void;
  getAuthHeaders: () => Record<string, string>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const storageKey = "cantorium:user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<AuthUser | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setUserState(parsed);
      } catch {
        localStorage.removeItem(storageKey);
      }
    }
  }, []);

  const setUser = useCallback((u: AuthUser | null) => {
    setUserState(u);
    if (u) {
      localStorage.setItem(storageKey, JSON.stringify(u));
    } else {
      localStorage.removeItem(storageKey);
    }
  }, []);

  const signOut = useCallback(() => setUser(null), [setUser]);

  const getAuthHeaders = useCallback((): Record<string, string> => {
    if (user?.token) {
      return { Authorization: `Bearer ${user.token}` };
    }
    return {};
  }, [user]);

  const value = useMemo(() => ({ user, setUser, signOut, getAuthHeaders }), [user, setUser, signOut, getAuthHeaders]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
