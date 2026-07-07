import { createFileRoute, Outlet } from "@tanstack/react-router";
import { ModuleGuard } from "@/components/portal/Module";

export const Route = createFileRoute("/portal/crew")({
  component: () => (
    <ModuleGuard module="crew">
      <Outlet />
    </ModuleGuard>
  ),
});

