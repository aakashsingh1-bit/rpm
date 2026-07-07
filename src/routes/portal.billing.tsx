import { createFileRoute, Outlet } from "@tanstack/react-router";
import { ModuleGuard } from "@/components/portal/Module";

export const Route = createFileRoute("/portal/billing")({
  component: () => (
    <ModuleGuard module="billing">
      <Outlet />
    </ModuleGuard>
  ),
});
