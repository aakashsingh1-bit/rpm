import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import type { ReactNode } from "react";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { MODULES, ROLES, type ModuleKey } from "@/lib/rbac";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

function DynIcon({ name, className }: { name: string; className?: string }) {
  const I = (Icons as unknown as Record<string, Icons.LucideIcon>)[name] ?? Icons.Circle;
  return <I className={className} />;
}

export function ModuleGuard({ module, children }: { module: ModuleKey; children: ReactNode }) {
  const { session } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!session) navigate({ to: "/" });
  }, [session, navigate]);
  if (!session) return null;
  const allowed = ROLES[session.role].modules.includes(module);
  if (!allowed) {
    return (
      <div className="max-w-lg mx-auto text-center py-20">
        <div className="h-14 w-14 rounded-full bg-destructive/10 border border-destructive/30 grid place-items-center mx-auto mb-4">
          <Lock className="h-6 w-6 text-destructive" />
        </div>
        <h2 className="text-xl font-display font-semibold">Access restricted</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Your role ({ROLES[session.role].label}) doesn't include the {MODULES[module].label}{" "}
          module. Contact your Super Administrator to request access.
        </p>
        <Button className="mt-6" onClick={() => navigate({ to: "/portal" })}>
          Back to Command Center
        </Button>
      </div>
    );
  }
  return <>{children}</>;
}

export function ModuleHeader({
  module,
  actions,
}: {
  module: ModuleKey;
  actions?: ReactNode;
}) {
  const m = MODULES[module];
  return (
    <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
      <div className="flex items-start gap-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="h-12 w-12 rounded-lg bg-gradient-primary grid place-items-center shadow-glow"
        >
          <DynIcon name={m.icon} className="h-6 w-6 text-primary-foreground" />
        </motion.div>
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-primary">
            Module {m.code}
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-semibold tracking-tight">
            {m.label}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{m.tagline}</p>
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function StatCard({
  label,
  value,
  delta,
  icon,
  tone = "default",
  index = 0,
}: {
  label: string;
  value: string | number;
  delta?: string;
  icon: string;
  tone?: "default" | "success" | "warning" | "danger" | "info";
  index?: number;
}) {
  const toneClass =
    tone === "success"
      ? "text-success border-success/30 bg-success/5"
      : tone === "warning"
        ? "text-warning border-warning/30 bg-warning/5"
        : tone === "danger"
          ? "text-destructive border-destructive/30 bg-destructive/5"
          : tone === "info"
            ? "text-info border-info/30 bg-info/5"
            : "text-primary border-primary/30 bg-primary/5";
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index, duration: 0.4 }}
      className="relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-panel"
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
            {label}
          </div>
          <div className="text-3xl font-display font-semibold mt-2 tabular-nums">{value}</div>
          {delta && (
            <div className="text-xs text-muted-foreground mt-1">
              <span className="text-success">{delta}</span> vs last shift
            </div>
          )}
        </div>
        <div className={`h-9 w-9 rounded-md border grid place-items-center ${toneClass}`}>
          <DynIcon name={icon} className="h-4 w-4" />
        </div>
      </div>
    </motion.div>
  );
}

export function Panel({
  title,
  subtitle,
  children,
  actions,
  className = "",
}: {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border border-border bg-card shadow-panel ${className}`}>
      {(title || actions) && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            {title && <div className="text-sm font-semibold">{title}</div>}
            {subtitle && (
              <div className="text-xs text-muted-foreground mt-0.5">{subtitle}</div>
            )}
          </div>
          {actions}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}

export { DynIcon };
