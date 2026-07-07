import { createFileRoute, Link, useParams, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowLeft, Phone, Mail, MapPin, Calendar, Award, Languages, Droplet,
  User, Shield, TrendingUp, ClipboardList, MessageSquare,
} from "lucide-react";
import { Panel, StatCard } from "@/components/portal/Module";
import { Button } from "@/components/ui/button";
import { getCrew } from "@/lib/crew-data";
import { toast } from "sonner";

export const Route = createFileRoute("/portal/crew/$id")({
  component: CrewProfile,
});

function CrewProfile() {
  const { id } = useParams({ from: "/portal/crew/$id" });
  const navigate = useNavigate();
  const c = getCrew(id);

  if (!c) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <h2 className="text-xl font-display font-semibold">Crew member not found</h2>
        <Button className="mt-4" onClick={() => navigate({ to: "/portal/crew/directory" })}>Back to directory</Button>
      </div>
    );
  }

  return (
    <div>
      <Link to="/portal/crew/directory" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors mb-4">
        <ArrowLeft className="h-3.5 w-3.5" /> All crew
      </Link>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between gap-4 flex-wrap mb-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-gradient-primary grid place-items-center text-primary-foreground text-lg font-semibold shadow-glow">
            {c.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-primary">{c.employeeId} · {c.role}</div>
            <h1 className="text-2xl md:text-3xl font-display font-semibold tracking-tight">{c.name}</h1>
            <p className="text-sm text-muted-foreground mt-1">{c.station} · Unit {c.unit} · Reports to {c.supervisor}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => toast(`Calling ${c.name}`)}><Phone className="h-4 w-4 mr-2" /> Call</Button>
          <Button variant="outline" onClick={() => toast(`Message sent to ${c.name}`)}><MessageSquare className="h-4 w-4 mr-2" /> Message</Button>
          <Button className="bg-gradient-primary text-primary-foreground" onClick={() => toast(`Assignment reassigned for ${c.name}`)}>
            Reassign
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Duty" value={c.duty} icon="Activity" tone={c.duty === "On duty" ? "success" : "default"} index={0} />
        <StatCard label="Performance" value={`${c.perf}%`} icon="TrendingUp" tone="info" index={1} />
        <StatCard label="Attendance" value={`${c.attendance}%`} icon="Percent" tone="success" index={2} />
        <StatCard label="Leave balance" value={`${c.leaveBalance}d`} icon="Plane" index={3} />
      </div>

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6">
        <div className="space-y-6">
          <Panel title="Assignment history" subtitle="Recent runs">
            <div className="divide-y divide-border/60 -mx-5">
              {c.assignments.length === 0 && (
                <div className="px-5 py-6 text-sm text-muted-foreground text-center">No recent assignments</div>
              )}
              {c.assignments.map((a) => (
                <div key={a.incident} className="flex items-center gap-3 px-5 py-3 hover:bg-accent/30 transition-colors">
                  <div className="text-xs font-mono text-muted-foreground w-20">{a.date}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{a.role} · Unit {a.unit}</div>
                    <div className="text-xs text-muted-foreground truncate">{a.outcome}</div>
                  </div>
                  <Link to="/portal/cad" className="text-[10px] font-mono text-primary hover:underline">{a.incident} →</Link>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Certifications & training">
            <div className="space-y-2">
              {c.certifications.map((cert) => (
                <div key={cert.name} className={`flex items-center gap-3 rounded-md border p-3 ${
                  cert.status === "Expired" ? "border-destructive/40 bg-destructive/5"
                    : cert.status === "Expiring" ? "border-warning/40 bg-warning/5"
                    : "border-border bg-surface/40"
                }`}>
                  <Award className={`h-4 w-4 ${
                    cert.status === "Expired" ? "text-destructive"
                      : cert.status === "Expiring" ? "text-warning" : "text-success"
                  }`} />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{cert.name}</div>
                    <div className="text-xs text-muted-foreground">{cert.issuer} · issued {cert.issued}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-mono">{cert.expires}</div>
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{cert.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Performance">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <PerfBox label="Runs / mo" value={c.runsThisMonth} icon={<TrendingUp className="h-4 w-4" />} />
              <PerfBox label="Patients" value={c.patientsThisMonth} icon={<ClipboardList className="h-4 w-4" />} />
              <PerfBox label="On-time %" value={c.onTime} icon={<Shield className="h-4 w-4" />} />
              <PerfBox label="Avg response" value={c.avgResponse} icon={<Calendar className="h-4 w-4" />} />
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title="Personal details">
            <dl className="space-y-3 text-sm">
              <Row icon={<User className="h-3.5 w-3.5" />} label="Nationality" value={c.nationality} />
              <Row icon={<Calendar className="h-3.5 w-3.5" />} label="Joined" value={c.joined} mono />
              <Row icon={<Droplet className="h-3.5 w-3.5" />} label="Blood type" value={c.bloodType} mono />
              <Row icon={<Phone className="h-3.5 w-3.5" />} label="Phone" value={c.phone} />
              <Row icon={<Mail className="h-3.5 w-3.5" />} label="Email" value={c.email} />
              <Row icon={<MapPin className="h-3.5 w-3.5" />} label="Station" value={c.station} />
              <Row icon={<User className="h-3.5 w-3.5" />} label="Emergency" value={c.emergencyContact} />
            </dl>
          </Panel>

          <Panel title="Shift & assignment">
            <dl className="space-y-3 text-sm">
              <Row icon={<Calendar className="h-3.5 w-3.5" />} label="Shift" value={`${c.shift} · ${c.shiftHours}`} />
              <Row icon={<Shield className="h-3.5 w-3.5" />} label="Assigned unit" value={c.unit} mono />
              <Row icon={<User className="h-3.5 w-3.5" />} label="Supervisor" value={c.supervisor} />
              {c.clockedInAt && <Row icon={<Calendar className="h-3.5 w-3.5" />} label="Clocked in" value={c.clockedInAt} mono />}
            </dl>
          </Panel>

          <Panel title="Languages">
            <div className="flex flex-wrap gap-1.5">
              {c.languages.map((l) => (
                <span key={l} className="text-[10px] font-mono px-2 py-0.5 rounded border border-primary/30 bg-primary/10 text-primary">
                  <Languages className="inline h-3 w-3 mr-1" />{l}
                </span>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function Row({ icon, label, value, mono = false }: { icon: React.ReactNode; label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-xs text-muted-foreground flex items-center gap-1.5">{icon} {label}</dt>
      <dd className={`text-sm ${mono ? "font-mono" : ""} truncate text-right`}>{value}</dd>
    </div>
  );
}

function PerfBox({ label, value, icon }: { label: string; value: number | string; icon: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-surface/40 p-3">
      <div className="text-primary mb-1">{icon}</div>
      <div className="text-2xl font-display font-semibold tabular-nums">{value}</div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">{label}</div>
    </div>
  );
}
