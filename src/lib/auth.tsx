import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { ROLES, type Role } from "./rbac";

const STORAGE_KEY = "rpm.session.v1";

export interface Session {
  role: Role;
  name: string;
  email: string;
  station: string;
  loggedInAt: number;
}

interface AuthCtx {
  session: Session | null;
  signIn: (role: Role, name?: string) => void;
  signOut: () => void;
}

const Ctx = createContext<AuthCtx | null>(null);

const DEMO_NAMES: Record<Role, string> = {
  super_admin: "Layla Al Marri",
  ops_manager: "Omar Al Suwaidi",
  dispatcher: "Sara Al Hosani",
  fleet_manager: "Khalid Al Nuaimi",
  crew_supervisor: "Mariam Al Blooshi",
  ambulance_crew: "Rashid Al Ameri",
  hospital_coordinator: "Dr. Noura Al Zaabi",
  finance: "Fatima Al Qassimi",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY);
      if (raw) setSession(JSON.parse(raw));
    } catch {
      /* noop */
    }
  }, []);

  const signIn = (role: Role, name?: string) => {
    const s: Session = {
      role,
      name: name ?? DEMO_NAMES[role],
      email: `${role}@rpm.ae`,
      station: "Abu Dhabi Central Station",
      loggedInAt: Date.now(),
    };
    setSession(s);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    } catch {
      /* noop */
    }
  };

  const signOut = () => {
    setSession(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* noop */
    }
  };

  return <Ctx.Provider value={{ session, signIn, signOut }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}

export function useRoleDef() {
  const { session } = useAuth();
  return session ? ROLES[session.role] : null;
}
