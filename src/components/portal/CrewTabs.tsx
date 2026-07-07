import { Link, useRouterState } from "@tanstack/react-router";
import * as Icons from "lucide-react";
import { CREW_TABS } from "@/lib/crew-data";

function Icon({ name, className }: { name: string; className?: string }) {
  const I = (Icons as unknown as Record<string, Icons.LucideIcon>)[name] ?? Icons.Circle;
  return <I className={className} />;
}

export function CrewTabs() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="mb-6 -mx-1 overflow-x-auto">
      <div className="inline-flex items-center gap-1 rounded-xl border border-border bg-card p-1 min-w-full">
        {CREW_TABS.map((t) => {
          const active = t.path === "/portal/crew" ? pathname === "/portal/crew" : pathname.startsWith(t.path);
          return (
            <Link
              key={t.key}
              to={t.path}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all whitespace-nowrap ${
                active
                  ? "bg-gradient-primary text-primary-foreground shadow-glow"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/40"
              }`}
            >
              <Icon name={t.icon} className="h-3.5 w-3.5" />
              {t.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
