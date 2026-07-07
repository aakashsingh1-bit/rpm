import { createFileRoute, Outlet, Link, useRouterState } from "@tanstack/react-router";
import * as Icons from "lucide-react";
import { ModuleGuard } from "@/components/portal/Module";
import { ADMIN_TABS } from "@/lib/admin-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/portal/admin")({
  component: () => (
    <ModuleGuard module="admin">
      <AdminLayout />
    </ModuleGuard>
  ),
});

function DynIcon({ name, className }: { name: string; className?: string }) {
  const I = (Icons as unknown as Record<string, Icons.LucideIcon>)[name] ?? Icons.Circle;
  return <I className={className} />;
}

function AdminLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div>
      <div className="mb-6 -mx-5 lg:-mx-8 px-5 lg:px-8 border-b border-border/60 bg-card/40 sticky top-16 z-20 backdrop-blur">
        <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-hide">
          {ADMIN_TABS.map((t) => {
            const active = t.path === "/portal/admin" ? pathname === "/portal/admin" : pathname.startsWith(t.path);
            return (
              <Link
                key={t.key}
                to={t.path}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-1.5 text-xs whitespace-nowrap transition-colors border",
                  active
                    ? "bg-gradient-primary text-primary-foreground border-transparent shadow-glow"
                    : "bg-transparent text-muted-foreground border-transparent hover:text-foreground hover:bg-muted",
                )}
              >
                <DynIcon name={t.icon} className="h-3.5 w-3.5" />
                <span>{t.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
      <Outlet />
    </div>
  );
}
