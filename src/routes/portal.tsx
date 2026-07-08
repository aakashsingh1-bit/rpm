import { createFileRoute, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { PortalShell } from "@/components/portal/PortalShell";
import { CommandPalette } from "@/components/portal/CommandPalette";

export const Route = createFileRoute("/portal")({
  component: PortalLayout,
});

// Dispatcher gets the full command-deck chrome (top-nav only, no sidebar) on
// their dashboard and CAD routes. All other roles keep the standard sidebar.
function PortalLayout() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!session) navigate({ to: "/" });
  }, [session, navigate]);

  if (!session) return null;

  const hasDeck = session.role === "dispatcher" || session.role === "ops_manager";
  const isCadRoute = pathname.startsWith("/portal/cad");
  const fullDeck = isCadRoute || (hasDeck && pathname === "/portal");

  if (fullDeck) {
    return (
      <>
        <Outlet />
        <CommandPalette />
      </>
    );
  }

  return (
    <PortalShell>
      <Outlet />
      <CommandPalette />
    </PortalShell>
  );
}
