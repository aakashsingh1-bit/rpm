import { createFileRoute, Outlet } from "@tanstack/react-router";
import { ModuleGuard } from "@/components/portal/Module";

export const Route = createFileRoute("/portal/hospital")({
  component: () => (
    <ModuleGuard module="hospital">
      <Outlet />
    </ModuleGuard>
  ),
});
