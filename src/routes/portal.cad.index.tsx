import { createFileRoute } from "@tanstack/react-router";
import { CadDashboard } from "@/components/portal/cad/CadDashboard";

export const Route = createFileRoute("/portal/cad/")({
  component: CadDashboard,
});
