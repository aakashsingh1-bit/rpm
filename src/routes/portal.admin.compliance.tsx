import { createFileRoute } from "@tanstack/react-router";
import {
  ShieldCheck,
  Lock,
  KeyRound,
  FileClock,
  Database,
  Network,
  ServerCog,
  Activity,
  HardDriveDownload,
  Users,
  Building2,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowLeftRight,
  CheckCircle2,
} from "lucide-react";
import { Panel } from "@/components/portal/Module";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/portal/admin/compliance")({
  component: CompliancePage,
});

const CONTROLS = [
  {
    icon: ShieldCheck,
    title: "ADHICS V2 Alignment",
    body:
      "Architecture aligned with Abu Dhabi Healthcare Information & Cyber Security Standard V2 — governance, secure authentication, RBAC, audit logging, encryption, session management, password policy, and secure protocols for protecting healthcare information.",
  },
  {
    icon: Building2,
    title: "ADEMSIS Compliance & Interoperability",
    body:
      "Designed to support ADEMSIS operational and information exchange requirements. During the FSD phase, client-provided specifications are mapped to workflows, data elements, reporting, interface specs and integration points to ensure compatibility with the Abu Dhabi EMS ecosystem.",
  },
  {
    icon: Users,
    title: "Role-Based Access Control (RBAC)",
    body:
      "Comprehensive role and permission management. Access is controlled at module, screen, feature and action level based on organizational hierarchy, department and responsibility.",
  },
  {
    icon: KeyRound,
    title: "Secure Authentication & Authorization",
    body:
      "Enterprise authentication with configurable password policy, session management, account lockout, optional multi-factor authentication (MFA) and centralized identity management.",
  },
  {
    icon: Lock,
    title: "End-to-End Data Encryption",
    body:
      "Healthcare and operational data protected in transit (TLS 1.2+) and at rest (AES-256) to ensure confidentiality and compliance with healthcare security requirements.",
  },
  {
    icon: FileClock,
    title: "Comprehensive Audit Trail",
    body:
      "Full audit logging of user activity, login history, patient record access, operational updates, configuration and administrative actions — see Admin › Audit Logs.",
  },
  {
    icon: ShieldCheck,
    title: "Healthcare Data Privacy & Governance",
    body:
      "Controlled access to PHI, privacy safeguards, data retention policy, consent handling (where applicable) and secure information lifecycle management.",
  },
  {
    icon: Network,
    title: "Secure API & Integration Framework",
    body:
      "Authenticated, encrypted RESTful APIs for IVMS, HIS, ERP, GIS, government platforms and third-party systems via standardized interfaces (OAuth 2.0 / mTLS / signed webhooks).",
  },
  {
    icon: ServerCog,
    title: "Infrastructure & Application Security",
    body:
      "HTTPS everywhere, SSL/TLS, firewall compatibility, secure configuration management, vulnerability management practices and segregated Development / UAT / Production environments.",
  },
  {
    icon: Activity,
    title: "Logging, Monitoring & Security Alerts",
    body:
      "Centralized logging and application monitoring for system health, operational events, security incidents and abnormal activity — proactive alerting to Ops and Security.",
  },
  {
    icon: HardDriveDownload,
    title: "Backup, DR & Business Continuity",
    body:
      "Configurable backups, disaster recovery planning, tested restoration procedures and business continuity mechanisms for high availability and resilience.",
  },
];

type Direction = "in" | "out" | "bi";
interface Flow {
  system: string;
  direction: Direction;
  protocol: string;
  auth: string;
  data: string;
  encryption: string;
  frequency: string;
}

const DATA_FLOWS: Flow[] = [
  {
    system: "Public Caller (999)",
    direction: "in",
    protocol: "SIP / WebRTC (voice) + Web form",
    auth: "Public intake · CLI verification",
    data: "Caller name, phone (CLI), location (GPS/address), chief complaint, incident audio (recorded)",
    encryption: "TLS 1.2+ in transit · AES-256 at rest",
    frequency: "Real-time",
  },
  {
    system: "CAD Dispatch ↔ Ambulance Field App",
    direction: "bi",
    protocol: "HTTPS / WSS",
    auth: "OAuth 2.0 bearer · device binding",
    data: "Assignment, patient pickup address, GPS route, status updates, unit telemetry",
    encryption: "TLS 1.2+ · AES-256 at rest",
    frequency: "Real-time / streaming",
  },
  {
    system: "IVMS (Fleet Telematics)",
    direction: "in",
    protocol: "REST / MQTT",
    auth: "API key + IP allowlist",
    data: "Vehicle GPS, speed, ignition, odometer, diagnostics, geofence events",
    encryption: "TLS 1.2+",
    frequency: "Streaming (5–30s)",
  },
  {
    system: "Hospital Information System (HIS)",
    direction: "bi",
    protocol: "HL7 v2 / FHIR R4 over HTTPS",
    auth: "mTLS + OAuth 2.0",
    data: "ePCR handover, patient demographics, vitals, ETA, bed availability, ED capacity",
    encryption: "TLS 1.2+ · AES-256 at rest",
    frequency: "Per-incident + polling",
  },
  {
    system: "GIS / Mapping Provider",
    direction: "bi",
    protocol: "HTTPS REST",
    auth: "Signed API key",
    data: "Geocoding, routing, ETA (no PHI transmitted)",
    encryption: "TLS 1.2+",
    frequency: "On demand",
  },
  {
    system: "ERP (Finance / HR)",
    direction: "out",
    protocol: "REST / SFTP",
    auth: "OAuth 2.0 / SSH keys",
    data: "Invoices, payments, payroll hours, cost centers (no PHI)",
    encryption: "TLS 1.2+ · SFTP",
    frequency: "Daily batch",
  },
  {
    system: "Government / Regulatory (ADEMSIS)",
    direction: "out",
    protocol: "HTTPS REST / SFTP",
    auth: "mTLS + signed payloads",
    data: "De-identified operational metrics, incident summaries, regulatory reports",
    encryption: "TLS 1.2+ · signed & encrypted payload",
    frequency: "Per schedule",
  },
  {
    system: "Identity Provider (SSO / MFA)",
    direction: "bi",
    protocol: "SAML 2.0 / OIDC",
    auth: "Signed assertions",
    data: "User identity, role claims, MFA factor",
    encryption: "TLS 1.2+",
    frequency: "Per login",
  },
  {
    system: "SMS / Email Gateway",
    direction: "out",
    protocol: "HTTPS REST / SMTP+TLS",
    auth: "API key",
    data: "Notifications (no clinical detail — reference IDs only)",
    encryption: "TLS 1.2+",
    frequency: "Event driven",
  },
  {
    system: "Payment Gateway",
    direction: "bi",
    protocol: "HTTPS REST + webhooks",
    auth: "API key + HMAC-signed webhooks",
    data: "Tokenized card refs, amount, invoice ID (PCI scope minimized)",
    encryption: "TLS 1.2+ · tokenization",
    frequency: "Event driven",
  },
];

const CAPTURE = [
  { cat: "Patient / Clinical (PHI)", items: "Demographics, chief complaint, vitals, ePCR narrative, medications, allergies, treatments, outcome, hospital destination" },
  { cat: "Incident / Operational", items: "Call metadata, dispatch timeline, unit assignments, GPS route, status transitions, on-scene time, transport time, comms transcripts" },
  { cat: "Fleet / Telemetry", items: "Vehicle GPS, speed, ignition, odometer, fuel, diagnostics, geofence events, maintenance records" },
  { cat: "Crew / HR", items: "Employee ID, certifications, roster, attendance, leave, performance metrics" },
  { cat: "User / Identity", items: "Username, hashed password, role, MFA factor, session tokens, login history, IP, device, browser" },
  { cat: "Finance", items: "Customer master, invoices, payments, VAT records, contracts (no card PAN stored — tokenized)" },
  { cat: "Audit / Security", items: "Every create/update/delete with before→after, user, module, IP, device, timestamp; security events and alerts" },
];

function DirIcon({ d }: { d: Direction }) {
  if (d === "in") return <ArrowDownLeft className="h-3.5 w-3.5 text-emerald-500" />;
  if (d === "out") return <ArrowUpRight className="h-3.5 w-3.5 text-sky-500" />;
  return <ArrowLeftRight className="h-3.5 w-3.5 text-primary" />;
}

function CompliancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-display font-semibold">Compliance, Security & Data Governance</h2>
        <p className="text-sm text-muted-foreground">
          Reference of the compliance and security capabilities the platform supports, together with the data captured and the transfers exchanged with external systems.
        </p>
      </div>

      <Panel title="Compliance & security capabilities">
        <div className="grid md:grid-cols-2 gap-3">
          {CONTROLS.map((c) => (
            <div key={c.title} className="rounded-md border border-border/60 bg-card/50 p-3 flex gap-3">
              <div className="h-9 w-9 shrink-0 rounded-md bg-primary/10 border border-primary/20 grid place-items-center">
                <c.icon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <div className="text-sm font-semibold">{c.title}</div>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                </div>
                <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{c.body}</div>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Data captured by the platform">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr className="border-b border-border">
                <th className="text-left px-3 py-2 w-64">Category</th>
                <th className="text-left px-3 py-2">Data elements</th>
              </tr>
            </thead>
            <tbody>
              {CAPTURE.map((c) => (
                <tr key={c.cat} className="border-b border-border/50">
                  <td className="px-3 py-2.5 font-medium">
                    <div className="flex items-center gap-2">
                      <Database className="h-3.5 w-3.5 text-primary" />
                      {c.cat}
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-xs text-muted-foreground">{c.items}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="Data transfers — integrations & external systems">
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground mb-2">
          <span className="flex items-center gap-1"><ArrowDownLeft className="h-3 w-3 text-emerald-500" /> Inbound</span>
          <span className="flex items-center gap-1"><ArrowUpRight className="h-3 w-3 text-sky-500" /> Outbound</span>
          <span className="flex items-center gap-1"><ArrowLeftRight className="h-3 w-3 text-primary" /> Bi-directional</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr className="border-b border-border">
                <th className="text-left px-3 py-2">System / Party</th>
                <th className="text-left px-3 py-2">Dir.</th>
                <th className="text-left px-3 py-2">Protocol</th>
                <th className="text-left px-3 py-2">Auth</th>
                <th className="text-left px-3 py-2">Data exchanged</th>
                <th className="text-left px-3 py-2">Encryption</th>
                <th className="text-left px-3 py-2">Frequency</th>
              </tr>
            </thead>
            <tbody>
              {DATA_FLOWS.map((f) => (
                <tr key={f.system} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="px-3 py-2.5 font-medium">{f.system}</td>
                  <td className="px-3 py-2.5"><DirIcon d={f.direction} /></td>
                  <td className="px-3 py-2.5 text-xs">{f.protocol}</td>
                  <td className="px-3 py-2.5 text-xs">{f.auth}</td>
                  <td className="px-3 py-2.5 text-xs text-muted-foreground">{f.data}</td>
                  <td className="px-3 py-2.5 text-xs">{f.encryption}</td>
                  <td className="px-3 py-2.5 text-xs">{f.frequency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="Environments & residency">
        <div className="grid md:grid-cols-3 gap-3 text-xs">
          {[
            { k: "Development", v: "Isolated tenant · synthetic data only · no PHI" },
            { k: "UAT / Staging", v: "De-identified data · restricted access · same controls as Prod" },
            { k: "Production", v: "UAE data residency · encrypted at rest (AES-256) · daily backups · DR site" },
          ].map((e) => (
            <div key={e.k} className="rounded-md border border-border/60 p-3">
              <div className="text-sm font-semibold">{e.k}</div>
              <div className="text-muted-foreground mt-1">{e.v}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {["ADHICS V2", "ADEMSIS", "ISO 27001-aligned", "HL7 / FHIR R4", "OAuth 2.0", "TLS 1.2+", "AES-256", "MFA"].map((b) => (
            <Badge key={b} variant="outline" className="text-[11px]">{b}</Badge>
          ))}
        </div>
      </Panel>
    </div>
  );
}
