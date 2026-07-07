import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAuth } from "@/lib/auth";
import { MODULES, ROLES } from "@/lib/rbac";
import { DynamicIcon } from "./PortalShell";
import { toast } from "sonner";

const QUICK_ACTIONS: { id: string; label: string; icon: string; hint: string; to?: string }[] = [
  { id: "new-incident", label: "Log new emergency call", icon: "PhoneCall", hint: "P1 · Immediate", to: "/portal/calls" },
  { id: "dispatch", label: "Dispatch nearest ambulance", icon: "Radio", hint: "AI recommend", to: "/portal/cad" },
  { id: "broadcast", label: "Broadcast to all crews", icon: "Megaphone", hint: "Priority push", to: "/portal/crew" },
  { id: "hospital-alert", label: "Alert receiving hospital", icon: "Building2", hint: "ETA sync", to: "/portal/hospital" },
  { id: "mayday", label: "Crew MAYDAY — panic activation", icon: "TriangleAlert", hint: "SOS", to: "/portal/mobile" },
  { id: "mass-casualty", label: "Declare mass casualty incident", icon: "Users", hint: "MCI protocol", to: "/portal/cad" },
  { id: "vehicle-oos", label: "Mark vehicle out of service", icon: "Ambulance", hint: "Maintenance", to: "/portal/fleet" },
  { id: "shift-swap", label: "Approve shift swap", icon: "RefreshCcw", hint: "Roster", to: "/portal/crew" },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const { session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onEvt = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("rpm:quick-action", onEvt as EventListener);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("rpm:quick-action", onEvt as EventListener);
    };
  }, []);

  const modules = useMemo(() => {
    if (!session) return [];
    const allowed = ROLES[session.role].modules;
    return allowed.map((k) => MODULES[k]);
  }, [session]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 overflow-hidden border-border bg-surface-elevated max-w-2xl">
        <Command className="bg-transparent">
          <CommandInput placeholder="Search actions, incidents, ambulances, crews…" />
          <CommandList className="max-h-[420px]">
            <CommandEmpty>No matching action.</CommandEmpty>
            <CommandGroup heading="Rapid response">
              {QUICK_ACTIONS.map((a) => (
                <CommandItem
                  key={a.id}
                  onSelect={() => {
                    toast.success(`${a.label}`, {
                      description: `Broadcast · ${new Date().toLocaleTimeString()}`,
                    });
                    if (a.to) navigate({ to: a.to });
                    setOpen(false);
                  }}
                  className="flex items-center gap-3 py-2.5"
                >
                  <div className="h-8 w-8 rounded-md bg-gradient-primary/20 border border-primary/30 grid place-items-center">
                    <DynamicIcon name={a.icon} className="h-4 w-4 text-primary" />
                  </div>
                  <span className="flex-1">{a.label}</span>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                    {a.hint}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading="Navigate">
              {modules.map((m) => (
                <CommandItem
                  key={m.key}
                  onSelect={() => {
                    navigate({ to: m.path });
                    setOpen(false);
                  }}
                  className="flex items-center gap-3 py-2"
                >
                  <DynamicIcon name={m.icon} className="h-4 w-4 text-muted-foreground" />
                  <span className="flex-1">{m.label}</span>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                    {m.code}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
