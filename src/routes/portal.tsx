import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { PortalShell } from "@/components/portal/PortalShell";
import { CommandPalette } from "@/components/portal/CommandPalette";

export const Route = createFileRoute("/portal")({
  component: PortalLayout,
});

function PortalLayout() {
  const { session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session) navigate({ to: "/" });
  }, [session, navigate]);

  if (!session) return null;

  return (
    <PortalShell>
      <Outlet />
      <CommandPalette />
    </PortalShell>
  );
}
