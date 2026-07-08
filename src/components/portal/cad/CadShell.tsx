import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import {
  LayoutDashboard, PhoneCall, Truck, Building2, MessageSquare, Headphones,
  LogOut, PhoneIncoming, PhoneOff,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { LOGO_URL } from "@/lib/assets";

const BASE_CAD_NAV = [
  { key: "dashboard",   label: "Dashboard",   icon: LayoutDashboard, to: "/portal/cad" },
  { key: "calls",       label: "Calls",       icon: PhoneCall,       to: "/portal/cad/calls" },
  { key: "fleet",       label: "Fleet",       icon: Truck,           to: "/portal/cad/fleet" },
  { key: "hospitals",   label: "Hospitals",   icon: Building2,       to: "/portal/cad/hospital" },
  { key: "messages",    label: "Messages",    icon: MessageSquare,   to: "/portal/cad/messages" },
] as const;

const DISPATCHERS_NAV = { key: "dispatchers", label: "Dispatchers", icon: Headphones, to: "/portal/cad/dispatchers" } as const;

export function CadShell({ children }: { children: ReactNode }) {
  const [incoming, setIncoming] = useState<{ id: string; caller: string; number: string; type: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => {
      setIncoming({ id: "CALL-9031", caller: "Anonymous", number: "+971 50 ••• 4421", type: "Traffic Accident" });
    }, 8000);
    return () => clearTimeout(t);
  }, []);

  const accept = () => {
    if (!incoming) return;
    toast.success(`Call ${incoming.id} accepted`, { description: `${incoming.caller} · ${incoming.type}` });
    try {
      sessionStorage.setItem("cad:activeCall", JSON.stringify(incoming));
    } catch { /* ignore */ }
    navigate({ to: "/portal/cad/calls/active" });
    setIncoming(null);
  };
  const decline = () => {
    if (!incoming) return;
    toast(`${incoming.id} declined`, { description: "Routed to next available dispatcher" });
    setIncoming(null);
  };

  return (
    <div className="min-h-dvh bg-background text-foreground flex flex-col">
      <CadTopBar />
      <AnimatePresence>
        {incoming && <IncomingCallBanner incoming={incoming} onAccept={accept} onDecline={decline} />}
      </AnimatePresence>
      <div className="flex-1 min-h-0 flex flex-col">{children}</div>
    </div>
  );
}

function CadTopBar() {
  const { session, signOut } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const initials = session?.name.split(" ").map((n) => n[0]).slice(0, 2).join("") ?? "JS";
  const timeStr = now.toLocaleTimeString("en-GB", { hour12: false });
  const dateStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const activeKey = (() => {
    if (pathname.startsWith("/portal/cad/calls")) return "calls";
    if (pathname.startsWith("/portal/cad/fleet")) return "fleet";
    if (pathname.startsWith("/portal/cad/hospital")) return "hospitals";
    if (pathname.startsWith("/portal/cad/messages")) return "messages";
    if (pathname.startsWith("/portal/cad/dispatchers")) return "dispatchers";
    return "dashboard";
  })();

  const isOps = session?.role === "ops_manager";
  const nav = isOps ? [...BASE_CAD_NAV, DISPATCHERS_NAV] : BASE_CAD_NAV;
  const roleLabel = isOps ? "Ops Manager" : "Dispatcher";
  

  return (
    <header className="relative px-5 py-3 flex items-center gap-6 bg-gradient-nav-header text-white shrink-0 shadow-elegant">
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-brand opacity-60" />

      {/* Brand: logo on top, name stacked below */}
      <Link to="/portal/cad" className="flex flex-col items-start gap-1 min-w-[220px] shrink-0">
        <img src={LOGO_URL} alt="Response Plus Holding PJSC" className="h-12 w-auto max-w-[240px] object-contain" />
        <div className="leading-tight">
          <div className="font-display font-bold text-[13px] text-white tracking-wide whitespace-nowrap">
            RESPONSE PLUS MEDICAL
          </div>
          <div className="text-[9px] uppercase tracking-[0.22em] text-white/60 whitespace-nowrap">
            Computer Aided Dispatch
          </div>
        </div>
      </Link>

      <nav className="flex items-center gap-0.5 flex-1 justify-center">
        {nav.map((n) => {
          const Icon = n.icon;
          const isActive = n.key === activeKey;
          return (
            <Link
              key={n.key}
              to={n.to}
              className={`relative flex flex-col items-center gap-1 px-4 py-2 rounded-md transition-colors ${
                isActive ? "text-white" : "text-white/65 hover:text-white hover:bg-white/10"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-semibold uppercase tracking-widest">{n.label}</span>
              {isActive && (
                <motion.span
                  layoutId="cad-top-active"
                  className="absolute -bottom-[13px] left-2 right-2 h-[3px] bg-brand-red rounded-t shadow-glow"
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-4 min-w-[260px] justify-end">
        <div className="text-right leading-tight">
          <div className="font-mono text-lg font-semibold text-white tabular-nums">{timeStr}</div>
          <div className="text-[10px] uppercase tracking-widest text-white/60">{dateStr}</div>
        </div>
        <div className="h-10 w-px bg-white/15" />
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-brand-red to-brand-magenta grid place-items-center text-white text-xs font-semibold">
              {initials}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-success border-2 border-[oklch(0.24_0.11_255)]" />
          </div>
          <div className="leading-tight">
            <div className="text-[10px] uppercase tracking-widest text-white/60">{roleLabel}</div>
            <div className="text-sm font-semibold text-white">{session?.name ?? "Julia Smith"}</div>
          </div>
          <button onClick={signOut} title="Sign out" className="ml-1 text-white/70 hover:text-white p-1.5 rounded-md hover:bg-white/10">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

function IncomingCallBanner({
  incoming, onAccept, onDecline,
}: {
  incoming: { id: string; caller: string; number: string; type: string };
  onAccept: () => void; onDecline: () => void;
}) {
  return (
    <motion.div
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -60, opacity: 0 }}
      className="relative z-20 border-b border-destructive/40 bg-gradient-to-r from-destructive/95 via-brand-red/95 to-destructive/90 text-white shadow-elegant"
    >
      <div className="px-5 py-2.5 flex items-center gap-4">
        <span className="relative flex h-9 w-9 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/40" />
          <span className="relative inline-flex h-9 w-9 rounded-full bg-white/20 grid place-items-center">
            <PhoneIncoming className="h-4 w-4 text-white" />
          </span>
        </span>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] uppercase tracking-widest text-white/80">Incoming Emergency Call</div>
          <div className="text-sm font-semibold truncate">
            {incoming.id} · {incoming.caller} · <span className="text-white/85">{incoming.number}</span> — {incoming.type}
          </div>
        </div>
        <Button onClick={onDecline} variant="outline" className="border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white">
          <PhoneOff className="h-4 w-4 mr-1.5" /> Decline
        </Button>
        <Button onClick={onAccept} className="bg-white text-destructive hover:bg-white/90 font-semibold">
          <PhoneCall className="h-4 w-4 mr-1.5" /> Accept
        </Button>
      </div>
    </motion.div>
  );
}
