import { createFileRoute, Outlet } from "@tanstack/react-router";
import { ModuleGuard } from "@/components/portal/Module";
import { CadShell } from "@/components/portal/cad/CadShell";

export const Route = createFileRoute("/portal/cad")({
  component: () => (
    <ModuleGuard module="cad">
      <CadShell>
        <Outlet />
      </CadShell>
    </ModuleGuard>
  ),
});
