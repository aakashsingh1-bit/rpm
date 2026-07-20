import { createFileRoute } from "@tanstack/react-router";
import {
  PhoneCall, Bot, Building2, LogIn, Ambulance, Clock, MessageSquare,
  Tablet, ClipboardCheck, Receipt, Plug, ShieldCheck, Boxes,
  CheckCircle2, Circle, CircleDashed,
} from "lucide-react";

export const Route = createFileRoute("/portal/admin/roadmap")({
  component: RoadmapPage,
});

type Status = "Done" | "In demo" | "Planned";

interface Item {
  n: number;
  title: string;
  icon: typeof PhoneCall;
  status: Status;
  feedback: string;
  expectation: string[];
  where: string;
}

const ITEMS: Item[] = [
  {
    n: 1, title: "Call Center Integration", icon: PhoneCall, status: "In demo",
    feedback: "Ops team records emergency calls in Excel today. CAD must integrate directly with the existing call-center platform to eliminate manual entry.",
    expectation: [
      "Incoming call pop-up with caller ID, ANI/ALI location and PBX queue.",
      "Automatic incident creation from every accepted call.",
      "Call recording link stored on the incident record.",
      "Live queue depth and wait time visible on the dispatcher deck.",
    ],
    where: "CAD Dispatch → Incoming Call banner + Active Call screen",
  },
  {
    n: 2, title: "Dispatch Automation", icon: Bot, status: "In demo",
    feedback: "Can ambulance assignment be automated to reduce dispatcher effort?",
    expectation: [
      "Auto-recommend the nearest available ambulance by ETA + capability (ALS/BLS).",
      "Dispatcher can Accept the recommendation with one click.",
      "Manual override to Change the unit at any time.",
    ],
    where: "CAD Dispatch → Recommended Ambulance panel on Call Details",
  },
  {
    n: 3, title: "Hospital Coordination Workflow", icon: Building2, status: "Done",
    feedback: "RPM does not operate hospitals. Responsibility ends at patient handover.",
    expectation: [
      "Receive ambulance pre-arrival notifications.",
      "View incoming patient details and ePCR summary.",
      "Digital handover acknowledgement.",
      "Removed: hospital bed management, patient queue, internal hospital workflows.",
    ],
    where: "Hospital Coord. module (tabs trimmed to Incoming / Handover / ePCR / Comms / IFT)",
  },
  {
    n: 4, title: "Ambulance Crew Login Flow", icon: LogIn, status: "Planned",
    feedback: "Crew members log in individually first, then select the assigned ambulance.",
    expectation: [
      "Crew Login → Select Assigned Ambulance → Start Shift → Receive Dispatch.",
      "Vehicle login before crew login is not the intended flow.",
      "Shift start pulls roster + attendance + vehicle safety check.",
    ],
    where: "Field App (Surface Pro) — sign-in sequence to be updated",
  },
  {
    n: 5, title: "Fleet Management Visibility", icon: Ambulance, status: "In demo",
    feedback: "Client wants full visibility of fleet on a single screen.",
    expectation: [
      "Vehicle availability + assigned crew + equipment inventory.",
      "Vehicle utilization, fuel status, maintenance status.",
      "Vehicle assignment history.",
    ],
    where: "Fleet module + CAD → Fleet quick view",
  },
  {
    n: 6, title: "Attendance & Crew Management", icon: Clock, status: "Planned",
    feedback: "Client asked how attendance is tracked.",
    expectation: [
      "Manual clock in/out.",
      "Biometric integration.",
      "GPS geo-fencing on station perimeter.",
      "Shift rosters that feed directly into dispatch availability.",
    ],
    where: "Crew → Attendance + Roster (integration hooks planned)",
  },
  {
    n: 7, title: "Multi-Channel Communication", icon: MessageSquare, status: "Planned",
    feedback: "Crew notifications must support multiple channels.",
    expectation: [
      "SMS, Push, Email, WhatsApp.",
      "Per-user preferred channel with fallback order.",
      "Delivery + read receipts stored on the audit trail.",
    ],
    where: "Admin → Notifications + Field App",
  },
  {
    n: 8, title: "Ambulance App Platform (Windows / Surface Pro)", icon: Tablet, status: "Planned",
    feedback: "Client confirmed Microsoft Surface Pro tablets are the standard field device.",
    expectation: [
      "Windows-based crew application.",
      "Compatible with Surface Pro form factor and pen input.",
      "Installable locally, works offline in the field.",
    ],
    where: "Field App target — current preview is a design reference",
  },
  {
    n: 9, title: "Patient Handover (scope re-confirmed)", icon: ClipboardCheck, status: "Done",
    feedback: "Hospital coordination is pre-arrival + handover + acknowledgement — not hospital operations.",
    expectation: [
      "Pre-arrival notification with ETA and vitals.",
      "Patient handover screen with ePCR snapshot.",
      "Receiving hospital acknowledgement (digital signature).",
    ],
    where: "Hospital Coord. → Handover flow",
  },
  {
    n: 10, title: "Finance Module", icon: Receipt, status: "In demo",
    feedback: "Finance should cover billing, invoices, customers and payment status with a payment gateway.",
    expectation: [
      "Billing, invoice generation, customer master, payment status.",
      "Payment gateway integration — Network International and Stripe named as examples.",
    ],
    where: "Finance & Billing module",
  },
  {
    n: 11, title: "Existing System Integration (ePCR + IVMS)", icon: Plug, status: "Planned",
    feedback: "CAD should act as the central command platform and pull from the client's existing ePCR and IVMS via APIs — not replace them.",
    expectation: [
      "REST / HL7-FHIR pull from existing ePCR for patient care records.",
      "Live vehicle telemetry pull from existing IVMS (location, speed, ignition, odometer).",
      "CAD stays the single pane of glass for dispatch and command.",
    ],
    where: "Admin → Integrations (endpoints + mapping to be provisioned)",
  },
  {
    n: 12, title: "Security — MFA, RBAC, Audit Logs", icon: ShieldCheck, status: "Done",
    feedback: "Client asked whether the system supports MFA, RBAC and audit logs.",
    expectation: [
      "MFA on all privileged accounts.",
      "Role-Based Access Control across every module.",
      "Immutable audit log of user, data and configuration events.",
    ],
    where: "Admin → Roles & Permissions, Profile & Security, Audit Logs, Compliance & Data",
  },
  {
    n: 14, title: "3D Maps (future capability)", icon: Boxes, status: "Planned",
    feedback: "Client asked whether 3D mapping can be supported.",
    expectation: [
      "Keep as future capability / design provision.",
      "No need to prototype in detail at this stage.",
    ],
    where: "CAD Map deck — 3D tilt toggle already provisioned",
  },
];

const STATUS_STYLE: Record<Status, { pill: string; icon: typeof CheckCircle2; label: string }> = {
  "Done":     { pill: "bg-success/15 text-success border-success/40",       icon: CheckCircle2, label: "Delivered" },
  "In demo":  { pill: "bg-primary/15 text-primary border-primary/40",       icon: Circle,       label: "In this demo" },
  "Planned":  { pill: "bg-warning/15 text-warning border-warning/40",       icon: CircleDashed, label: "Planned next" },
};

function RoadmapPage() {
  const counts = ITEMS.reduce(
    (acc, i) => ({ ...acc, [i.status]: (acc[i.status] ?? 0) + 1 }),
    {} as Record<Status, number>,
  );

  return (
    <div className="p-3 flex-1 min-h-0 flex flex-col gap-3 overflow-y-auto">
      <div className="rounded-xl border border-border bg-card shadow-sm p-5">
        <div className="text-[10px] uppercase tracking-[0.2em] text-primary mb-2">
          Super Admin · Client Feedback & Delivery Roadmap
        </div>
        <h1 className="text-2xl font-display font-semibold tracking-tight">Demo Feedback Tracker</h1>
        <p className="text-sm text-muted-foreground mt-1 max-w-3xl">
          Every point raised in the client demo review is tracked here with the agreed scope, where it lives in
          the prototype today, and its delivery status. Use this page as the single source of truth during
          walkthroughs.
        </p>
        <div className="mt-4 grid grid-cols-3 gap-2 max-w-lg">
          {(["Done", "In demo", "Planned"] as Status[]).map((s) => {
            const S = STATUS_STYLE[s];
            return (
              <div key={s} className={`rounded-md border px-3 py-2 ${S.pill}`}>
                <div className="text-xl font-display font-bold tabular-nums">{counts[s] ?? 0}</div>
                <div className="text-[10px] uppercase tracking-widest">{S.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          const S = STATUS_STYLE[item.status];
          const SIcon = S.icon;
          return (
            <div key={item.n} className="rounded-xl border border-border bg-card shadow-sm p-4 flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg grid place-items-center bg-primary/10 text-primary shrink-0">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-muted-foreground">#{item.n.toString().padStart(2, "0")}</span>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded border ${S.pill}`}>
                      <SIcon className="h-3 w-3" /> {S.label}
                    </span>
                  </div>
                  <div className="text-sm font-semibold mt-0.5">{item.title}</div>
                </div>
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Client feedback</div>
                <p className="text-xs text-foreground/80 leading-relaxed">{item.feedback}</p>
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Agreed expectation</div>
                <ul className="text-xs text-foreground/80 space-y-1 list-disc pl-4">
                  {item.expectation.map((e, i) => <li key={i}>{e}</li>)}
                </ul>
              </div>

              <div className="mt-auto pt-2 border-t border-border">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Where in the prototype</div>
                <div className="text-xs text-primary font-medium mt-0.5">{item.where}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
