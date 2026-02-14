import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { signOut as firebaseSignOut } from "./services/firebaseAuth";

export type AuthUser = {
  id: string;
  email: string;
  name?: string;
  token: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  signOut: () => Promise<void>;
  getAuthHeaders: () => Record<string, string>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const storageKey = "cantorium:user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen to Firebase auth state changes
  useEffect(() => {
    if (!auth) {
      // If Firebase is not configured, try to load from localStorage
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          setUserState(parsed);
        } catch (error) {
          console.error('Failed to parse stored user data:', error);
          localStorage.removeItem(storageKey);
        }
      }
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Convert Firebase user directly to avoid extra async call
          const token = await firebaseUser.getIdToken();
          const authUser: AuthUser = {
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: firebaseUser.displayName || undefined,
            token,
          };
          setUserState(authUser);
          localStorage.setItem(storageKey, JSON.stringify(authUser));
        } catch (error) {
          console.error("Error getting user token:", error);
          setUserState(null);
          localStorage.removeItem(storageKey);
        }
      } else {
        setUserState(null);
        localStorage.removeItem(storageKey);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const setUser = useCallback((u: AuthUser | null) => {
    setUserState(u);
    if (u) {
      localStorage.setItem(storageKey, JSON.stringify(u));
    } else {
      localStorage.removeItem(storageKey);
    }
  }, []);

  const signOut = useCallback(async () => {
    if (auth) {
      await firebaseSignOut();
    }
    setUser(null);
  }, [setUser]);

  const getAuthHeaders = useCallback((): Record<string, string> => {
    if (user?.token) {
      return { Authorization: `Bearer ${user.token}` };
    }
    return {};
  }, [user]);

  const value = useMemo(() => ({ user, setUser, signOut, getAuthHeaders, loading }), [user, setUser, signOut, getAuthHeaders, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
