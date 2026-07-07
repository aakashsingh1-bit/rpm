import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Ambulance } from "lucide-react";
import { CrewPhone } from "./portal.mobile";

export const Route = createFileRoute("/crew-app")({
  head: () => ({
    meta: [
      { title: "EMS Field Crew App — Sign In" },
      { name: "description", content: "Ambulance crew mobile application login and field workflows." },
    ],
  }),
  component: CrewAppPage,
});

function CrewAppPage() {
  return (
    <div className="min-h-dvh bg-background text-foreground flex flex-col">
      <div className="px-5 py-4 flex items-center justify-between border-b border-border">
        <Link to="/" className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to portal
        </Link>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-primary grid place-items-center shadow-glow">
            <Ambulance className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="text-xs font-display font-semibold tracking-wide">EMS Field Crew</div>
        </div>
        <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground hidden sm:block">
          Ambulance User App
        </div>
      </div>
      <div className="flex-1 grid place-items-center py-6">
        <CrewPhone />
      </div>
    </div>
  );
}
