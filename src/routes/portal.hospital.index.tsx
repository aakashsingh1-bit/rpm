import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Ambulance, ArrowRight, Bed, Bell, Clock, ListOrdered, MessageSquare,
  Building2, ArrowLeftRight, BarChart3, ClipboardCheck, FileText,
} from "lucide-react";
import { ModuleHeader, Panel, StatCard } from "@/components/portal/Module";
import { INCOMING, HOSPITALS, IFT, ACTIVITY } from "@/lib/hospital-data";

export const Route = createFileRoute("/portal/hospital/")({
  component: HospitalDashboard,
});

function HospitalDashboard() {
  const awaiting = INCOMING.filter((i) => i.status !== "Arrived").length;
  const handovers = INCOMING.filter((i) => i.status === "Arrived" || i.status === "On scene").length;

  return (
    <div>
      <ModuleHeader
        module="hospital"
        actions={
          <div className="flex items-center gap-2">
            <Link to="/portal/cad" className="text-xs px-3 py-1.5 rounded-md border border-border bg-card hover:border-primary/50 transition-colors">Open CAD</Link>
            <Link to="/portal/hospital/communication" className="text-xs px-3 py-1.5 rounded-md bg-gradient-primary text-primary-foreground shadow-glow">Send update</Link>
          </div>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Incoming ambulances" value={INCOMING.length} tone="warning" icon="Ambulance" index={0} />
        <StatCard label="Patients awaiting" value={awaiting} tone="info" icon="ListOrdered" index={1} />
        <StatCard label="Active handovers" value={handovers} tone="success" icon="ClipboardCheck" index={2} />
        <StatCard label="IFT requests" value={IFT.length} icon="ArrowLeftRight" index={3} />
      </div>

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6">
        <div className="space-y-6">
          <Panel
            title="Quick access · Patient queue"
            subtitle="Latest inbound patients — click to open the queue"
            actions={<Link to="/portal/hospital/queue" className="text-xs text-primary hover:underline flex items-center gap-1">Open queue <ArrowRight className="h-3 w-3" /></Link>}
          >
            <div className="space-y-2">
              {INCOMING.slice(0, 4).map((r, i) => (
                <motion.div
                  key={r.incident}
                  initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="rounded-lg border border-border/60 bg-surface/40 p-3 flex items-center gap-3"
                >
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                    r.priority === "P1" ? "text-destructive border-destructive/40 bg-destructive/10"
                      : r.priority === "P2" ? "text-warning border-warning/40 bg-warning/10"
                      : "text-info border-info/40 bg-info/10"
                  }`}>{r.priority}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{r.patient.name} · {r.cond}</div>
                    <div className="text-[11px] text-muted-foreground">{r.incident} · Unit {r.unit} · Bay {r.bay}</div>
                  </div>
                  <div className="text-xs font-mono text-primary flex items-center gap-1"><Clock className="h-3 w-3" /> {r.eta}</div>
                </motion.div>
              ))}
            </div>
          </Panel>

          <Panel title="Recent activity" subtitle="Live timeline across CAD ↔ hospital">
            <div className="space-y-2">
              {ACTIVITY.map((a, i) => (
                <div key={i} className="flex items-start gap-3 rounded-md border border-border/50 bg-surface/40 p-2.5">
                  <span className={`h-2 w-2 rounded-full mt-1.5 ${
                    a.kind === "success" ? "bg-success"
                      : a.kind === "alert" ? "bg-destructive"
                      : a.kind === "warning" ? "bg-warning"
                      : a.kind === "ack" ? "bg-info"
                      : "bg-primary"
                  }`} />
                  <div className="flex-1 text-xs">{a.text}</div>
                  <span className="text-[10px] font-mono text-muted-foreground">{a.at}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel
            title="Hospital status"
            subtitle="Regional capacity"
            actions={<Link to="/portal/hospital/incoming" className="text-xs text-primary hover:underline flex items-center gap-1">Incoming <ArrowRight className="h-3 w-3" /></Link>}
          >
            <div className="space-y-3">
              {HOSPITALS.map((h) => (
                <div key={h.name} className="rounded-lg border border-border bg-surface p-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">{h.name}</div>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                      h.status === "Divert" ? "text-destructive border-destructive/40 bg-destructive/10" : "text-success border-success/40 bg-success/10"
                    }`}>{h.status}</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5 mb-2">{h.spec}</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-background overflow-hidden">
                      <div className={`h-full ${h.capacity > 85 ? "bg-destructive" : h.capacity > 65 ? "bg-warning" : "bg-success"}`} style={{ width: `${h.capacity}%` }} />
                    </div>
                    <span className="text-xs font-mono w-8 text-right">{h.capacity}%</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1"><Bed className="h-3 w-3" /> {h.beds.free}/{h.beds.total} beds · +{h.incoming} incoming</div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel
            title="Live notifications"
            subtitle="System & CAD alerts"
            actions={<Bell className="h-4 w-4 text-primary" />}
          >
            <div className="space-y-2 text-xs">
              <NotifRow icon={Ambulance} text="INC-8842 STEMI en route · ETA 3:12" tone="danger" />
              <NotifRow icon={ClipboardCheck} text="Cath Lab 1 confirmed ready" tone="success" />
              <NotifRow icon={FileText} text="ePCR uploaded for INC-8841" tone="info" />
              <NotifRow icon={ArrowLeftRight} text="New IFT request from Al Ain Hospital" tone="warning" />
            </div>
          </Panel>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mt-6">
        <QuickLink to="/portal/hospital/incoming" icon={Ambulance} title="Incoming Ambulances" desc="Track units assigned to your hospital." />
        <QuickLink to="/portal/hospital/queue" icon={ListOrdered} title="Patient Queue" desc="Manage all expected arrivals." />
        <QuickLink to="/portal/hospital/handover" icon={ClipboardCheck} title="Patient Handover" desc="Digital receipt from ambulance crews." />
        <QuickLink to="/portal/hospital/epcr-viewer" icon={FileText} title="ePCR" desc="Open patient care records from assigned list." />
        <QuickLink to="/portal/hospital/ift" icon={ArrowLeftRight} title="Inter-Facility Transfers" desc="Manage transfers between hospitals." />
        <QuickLink to="/portal/hospital/reports" icon={BarChart3} title="Hospital Reports" desc="Operational reports & analytics." />
      </div>
    </div>
  );
}

function NotifRow({ icon: I, text, tone }: { icon: React.ComponentType<{ className?: string }>; text: string; tone: "danger" | "success" | "info" | "warning" }) {
  const c = tone === "danger" ? "text-destructive" : tone === "success" ? "text-success" : tone === "warning" ? "text-warning" : "text-info";
  return (
    <div className="flex items-center gap-2 rounded-md border border-border/50 bg-surface/40 p-2">
      <I className={`h-3.5 w-3.5 ${c}`} />
      <span className="flex-1">{text}</span>
    </div>
  );
}

function QuickLink({ to, icon: I, title, desc }: { to: string; icon: React.ComponentType<{ className?: string }>; title: string; desc: string }) {
  return (
    <Link to={to} className="group rounded-xl border border-border bg-card p-4 hover:border-primary/50 hover:shadow-elegant transition-all">
      <div className="flex items-center gap-3 mb-2">
        <div className="h-9 w-9 rounded-md bg-gradient-primary grid place-items-center shadow-glow"><I className="h-4 w-4 text-primary-foreground" /></div>
        <div className="text-sm font-semibold">{title}</div>
      </div>
      <div className="text-xs text-muted-foreground">{desc}</div>
      <div className="mt-3 text-[11px] text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">Open <ArrowRight className="h-3 w-3" /></div>
    </Link>
  );
}
