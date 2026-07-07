import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { LogOut, Zap, Bell, Search } from "lucide-react";
import { useAuth, useRoleDef } from "@/lib/auth";
import { MODULES, ROLES, type ModuleKey } from "@/lib/rbac";
import { CREW_TABS } from "@/lib/crew-data";
import { HOSPITAL_TABS } from "@/lib/hospital-data";
import { FINANCE_TABS } from "@/lib/finance-data";

import { LOGO_WHITE_URL } from "@/lib/assets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";


function DynamicIcon({ name, className }: { name: string; className?: string }) {
  const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[name] ?? Icons.Circle;
  return <Icon className={className} />;
}

export function PortalShell({ children }: { children: ReactNode }) {
  const { session, signOut } = useAuth();
  const role = useRoleDef();
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;

  if (!session || !role) return null;

  const allowed = role.modules;

  return (
    <div className="min-h-dvh bg-background text-foreground">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-white/10 bg-gradient-dark-nav text-sidebar-foreground lg:flex">
        <div className="flex flex-col items-start gap-3 px-5 py-5 border-b border-white/10">
          <img src={LOGO_WHITE_URL} alt="RPM Holding" className="h-10 w-auto object-contain" />
          <div className="leading-none">
            <div className="font-display font-bold tracking-tight text-white text-[22px]">
              EMS <span className="font-semibold text-white/85">Command</span>
            </div>
            <div className="text-[10px] uppercase tracking-[0.24em] text-white/60 mt-1.5">
              Platform
            </div>
          </div>
        </div>


        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {(Object.keys(MODULES) as ModuleKey[])
            .filter((k) => allowed.includes(k))
            .flatMap((k) => {
              const m = MODULES[k];
              // Expand crew module into its subpages in the sidebar.
              if (k === "crew" || k === "hospital" || k === "billing") {
                const tabs = k === "crew" ? CREW_TABS : k === "hospital" ? HOSPITAL_TABS : FINANCE_TABS;
                const rootPath = k === "crew" ? "/portal/crew" : k === "hospital" ? "/portal/hospital" : "/portal/billing";
                const code = k === "crew" ? "CRW" : k === "hospital" ? "HSP" : "FIN";
                return tabs.map((t) => {
                  const active = t.path === rootPath
                    ? pathname === rootPath
                    : pathname.startsWith(t.path);
                  return (
                    <Link
                      key={`${k}-${t.key}`}
                      to={t.path}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors",
                        active
                          ? "bg-white/15 text-white"
                          : "text-white/75 hover:bg-white/10 hover:text-white",
                      )}
                    >
                      {active && (
                        <motion.span
                          layoutId="side-active"
                          className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r bg-white shadow-glow"
                        />
                      )}
                      <DynamicIcon
                        name={t.icon}
                        className={cn("h-4 w-4", active ? "text-white" : "text-white/70")}
                      />
                      <span className="flex-1">{t.label}</span>
                      <span className="text-[9px] font-mono uppercase tracking-widest text-white/50">
                        {code}
                      </span>
                    </Link>
                  );
                });
              }

              const active =
                m.path === "/portal"
                  ? pathname === "/portal"
                  : pathname.startsWith(m.path);
              return [(
                <Link
                  key={k}
                  to={m.path}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors",
                    active
                      ? "bg-white/15 text-white"
                      : "text-white/75 hover:bg-white/10 hover:text-white",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="side-active"
                      className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r bg-white shadow-glow"
                    />
                  )}
                  <DynamicIcon
                    name={m.icon}
                    className={cn("h-4 w-4", active ? "text-white" : "text-white/70")}
                  />
                  <span className="flex-1">{m.label}</span>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-white/50">
                    {m.code}
                  </span>
                </Link>
              )];
            })}

        </nav>

        <div className="px-3 py-3 border-t border-white/10">
          <div className="flex items-center gap-3 rounded-md bg-white/10 px-3 py-2">
            <div className="h-8 w-8 rounded-full bg-white/20 border border-white/30 grid place-items-center text-[11px] font-semibold text-white">
              {session.name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-medium truncate text-white">{session.name}</div>
              <div className="text-[10px] text-white/60 truncate">{role.shortLabel}</div>
            </div>
            <button
              onClick={signOut}
              title="Sign out"
              className="text-white/70 hover:text-white transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-gradient-nav-header text-white border-b border-white/10 shadow-elegant">
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-brand opacity-60" />
          <div className="flex h-16 items-center gap-3 pl-5 pr-6 lg:pr-8">
            <div className="flex-1 relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
              <Input
                placeholder="Search incidents, ambulances, crews…"
                className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/50 h-10 focus-visible:ring-primary/60"
              />
            </div>
            <div className="hidden md:flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
              <span className="text-xs text-white/70">All systems operational</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="relative text-white/70 hover:text-white hover:bg-white/10"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-primary" />
            </Button>
            <QuickActionButton />
          </div>
        </header>

        <main className="p-5 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

function QuickActionButton() {
  return (
    <button
      onClick={() => window.dispatchEvent(new CustomEvent("rpm:quick-action"))}
      className="group relative inline-flex items-center gap-2 rounded-full bg-gradient-action px-4 py-2 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-[1.02] active:scale-[0.98]"
    >
      <Zap className="h-4 w-4" />
      <span className="hidden sm:inline">Quick Action</span>
      <kbd className="hidden md:inline text-[10px] font-mono bg-white/20 text-white px-1.5 py-0.5 rounded">
        ⌘K
      </kbd>

    </button>
  );
}

export { DynamicIcon };
