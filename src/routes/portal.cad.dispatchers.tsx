import { createFileRoute } from "@tanstack/react-router";
import { DispatcherPanel } from "@/components/portal/cad/DispatcherPanel";

export const Route = createFileRoute("/portal/cad/dispatchers")({
  component: DispatchersPage,
});

function DispatchersPage() {
  return (
    <div className="p-3 flex-1 min-h-0 flex flex-col gap-3">
      <div className="rounded-xl border border-border bg-card shadow-sm p-5">
        <div className="text-[10px] uppercase tracking-[0.2em] text-primary mb-2">Operations · Dispatcher Oversight</div>
        <h1 className="text-2xl font-display font-semibold tracking-tight">Dispatcher Floor</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Live view of every dispatcher, current call load, and shift controls. Monitor, message,
          reassign, or take over calls from here.
        </p>
      </div>
      <DispatcherPanel />
    </div>
  );
}
