import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  User, MapPin, Activity, Stethoscope, Syringe, Pill, Signature,
  Check, Download, Printer, Save, Plus, Trash2,
} from "lucide-react";
import { ModuleHeader, Panel } from "@/components/portal/Module";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { INCOMING, EPCR_SAMPLE, type Incoming } from "@/lib/hospital-data";

export const Route = createFileRoute("/portal/hospital/epcr-viewer")({
  validateSearch: (s: Record<string, unknown>) => ({ patient: (s.patient as string | undefined) ?? undefined }),
  component: EpcrHospitalBuilder,
});

type Med = { drug: string; dose: string; route: string; time: string };
type EpcrForm = {
  patient: { name: string; gender: string; dob: string; contact: string; nationality: string; nok: string; allergies: string };
  incident: { number: string; type: string; pickup: string; dispatch: string; unit: string; crew: string };
  vitals: { bp: string; hr: string; rr: string; temp: string; spo2: string; gcs: string };
  assessment: { primary: string; complaint: string; condition: string; notes: string };
  treatments: string[];
  medications: Med[];
  handover: { destination: string; bay: string; receiver: string; signed: boolean; ackNotes: string };
  completed: Record<string, boolean>;
};

const steps = [
  { id: "patient", label: "Patient", icon: User },
  { id: "incident", label: "Incident", icon: MapPin },
  { id: "vitals", label: "Vitals", icon: Activity },
  { id: "assessment", label: "Assessment", icon: Stethoscope },
  { id: "treatments", label: "Treatments", icon: Syringe },
  { id: "medications", label: "Medications", icon: Pill },
  { id: "handover", label: "Handover", icon: Signature },
];

function buildForm(i: Incoming): EpcrForm {
  const [hr, bp, spo2] = i.vitals.split("·").map((s) => s.trim());
  return {
    patient: {
      name: i.patient.name, gender: i.patient.gender, dob: "",
      contact: "", nationality: "UAE", nok: "", allergies: "",
    },
    incident: {
      number: i.incident, type: i.cond, pickup: "Al Reem Island",
      dispatch: "09:04", unit: i.unit, crew: i.crew,
    },
    vitals: {
      bp: bp?.replace("BP ", "") ?? EPCR_SAMPLE.vitals.bp,
      hr: hr?.replace("HR ", "") ?? String(EPCR_SAMPLE.vitals.hr),
      rr: String(EPCR_SAMPLE.vitals.rr),
      temp: EPCR_SAMPLE.vitals.temp,
      spo2: spo2?.replace("SpO₂ ", "") ?? EPCR_SAMPLE.vitals.spo2,
      gcs: "14",
    },
    assessment: {
      primary: EPCR_SAMPLE.assessment.primary,
      complaint: i.patient.complaint,
      condition: i.priority === "P1" ? "Critical" : "Stable",
      notes: EPCR_SAMPLE.notes,
    },
    treatments: [...EPCR_SAMPLE.treatments],
    medications: EPCR_SAMPLE.medications.map((m) => ({ ...m })),
    handover: {
      destination: i.hospital, bay: i.bay,
      receiver: "Dr. Noura Al Zaabi", signed: false, ackNotes: "",
    },
    completed: {},
  };
}

function EpcrHospitalBuilder() {
  const { patient: patientParam } = Route.useSearch();
  const initialId = INCOMING.find((i) => i.incident === patientParam)?.incident ?? INCOMING[0].incident;
  const [selId, setSelId] = useState(initialId);
  const [forms, setForms] = useState<Record<string, EpcrForm>>(() => {
    const initial: Record<string, EpcrForm> = {};
    INCOMING.forEach((i) => (initial[i.incident] = buildForm(i)));
    return initial;
  });
  const [step, setStep] = useState(0);

  const patient = useMemo(() => INCOMING.find((i) => i.incident === selId)!, [selId]);
  const form = forms[selId];

  const update = (patch: Partial<EpcrForm>) =>
    setForms((prev) => ({ ...prev, [selId]: { ...prev[selId], ...patch } }));

  const markComplete = (key: string) => {
    update({ completed: { ...form.completed, [key]: true } });
    toast.success(`${steps.find((s) => s.id === key)?.label} saved`);
  };

  const progress = Math.round((Object.keys(form.completed).length / steps.length) * 100);

  return (
    <div>
      <ModuleHeader
        module="hospital"
        actions={
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => toast("Printing…")}>
              <Printer className="h-4 w-4 mr-1" /> Print
            </Button>
            <Button
              size="sm"
              className="bg-gradient-primary text-primary-foreground shadow-glow"
              onClick={() => toast.success(`ePCR ${form.incident.number} exported`)}
            >
              <Download className="h-4 w-4 mr-1" /> Export PDF
            </Button>
          </div>
        }
      />

      <div className="grid lg:grid-cols-[280px_240px_1fr] gap-6">
        {/* Assigned patients */}
        <Panel title="Assigned patients" subtitle="From ambulance handover">
          <div className="space-y-1">
            {INCOMING.map((i) => {
              const active = selId === i.incident;
              const f = forms[i.incident];
              const pct = Math.round((Object.keys(f.completed).length / steps.length) * 100);
              return (
                <button
                  key={i.incident}
                  onClick={() => { setSelId(i.incident); setStep(0); }}
                  className={`w-full text-left rounded-md border p-2.5 transition-colors ${
                    active ? "border-primary/50 bg-primary/5" : "border-border/60 hover:border-primary/30"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium truncate">{i.patient.name}</div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-border text-muted-foreground">
                      {i.priority}
                    </span>
                  </div>
                  <div className="text-[11px] text-muted-foreground truncate">
                    {i.incident} · {i.unit}
                  </div>
                  <div className="mt-1.5 h-1 rounded bg-border/50 overflow-hidden">
                    <div className="h-full bg-gradient-primary" style={{ width: `${pct}%` }} />
                  </div>
                </button>
              );
            })}
          </div>
        </Panel>

        {/* Stepper */}
        <Panel title="ePCR workflow" subtitle={`${patient.incident} · ${progress}%`}>
          <ol className="relative space-y-5">
            <div className="absolute left-[15px] top-2 bottom-2 w-px bg-border" />
            {steps.map((s, i) => {
              const active = step === i;
              const done = form.completed[s.id];
              return (
                <li key={s.id} className="relative flex items-center gap-3">
                  <button
                    onClick={() => setStep(i)}
                    className={`relative z-10 h-8 w-8 rounded-full grid place-items-center border transition-all ${
                      done
                        ? "bg-success border-success text-primary-foreground"
                        : active
                          ? "bg-gradient-primary border-transparent text-primary-foreground shadow-glow"
                          : "bg-surface border-border text-muted-foreground"
                    }`}
                  >
                    {done ? <Check className="h-4 w-4" /> : <s.icon className="h-4 w-4" />}
                  </button>
                  <div>
                    <div className={`text-sm ${active ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                      {s.label}
                    </div>
                    <div className="text-[10px] text-muted-foreground">Step {i + 1}</div>
                  </div>
                </li>
              );
            })}
          </ol>
        </Panel>

        <div className="space-y-4">
          {step === 0 && (
            <PatientStep
              value={form.patient}
              onChange={(patient) => update({ patient })}
              onSave={() => markComplete("patient")}
            />
          )}
          {step === 1 && (
            <IncidentStep
              value={form.incident}
              onChange={(incident) => update({ incident })}
              onSave={() => markComplete("incident")}
            />
          )}
          {step === 2 && (
            <VitalsStep
              value={form.vitals}
              onChange={(vitals) => update({ vitals })}
              onSave={() => markComplete("vitals")}
            />
          )}
          {step === 3 && (
            <AssessmentStep
              value={form.assessment}
              onChange={(assessment) => update({ assessment })}
              onSave={() => markComplete("assessment")}
            />
          )}
          {step === 4 && (
            <TreatmentsStep
              value={form.treatments}
              onChange={(treatments) => update({ treatments })}
              onSave={() => markComplete("treatments")}
            />
          )}
          {step === 5 && (
            <MedicationsStep
              value={form.medications}
              onChange={(medications) => update({ medications })}
              onSave={() => markComplete("medications")}
            />
          )}
          {step === 6 && (
            <HandoverStep
              value={form.handover}
              onChange={(handover) => update({ handover })}
              onSave={() => {
                markComplete("handover");
                toast.success(`ePCR ${form.incident.number} submitted to ${form.handover.destination}`);
              }}
            />
          )}

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
              Back
            </Button>
            <Button
              className="bg-gradient-primary text-primary-foreground"
              onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
              disabled={step === steps.length - 1}
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, subtitle, children, onSave }: {
  title: string; subtitle?: string; children: React.ReactNode; onSave: () => void;
}) {
  return (
    <Panel title={title} subtitle={subtitle}>
      <div className="space-y-4">
        {children}
        <div className="flex justify-end pt-2 border-t border-border/50">
          <Button size="sm" className="bg-gradient-primary text-primary-foreground" onClick={onSave}>
            <Save className="h-3.5 w-3.5 mr-1" /> Save & update
          </Button>
        </div>
      </div>
    </Panel>
  );
}

function Field({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

function PatientStep({ value, onChange, onSave }: {
  value: EpcrForm["patient"]; onChange: (v: EpcrForm["patient"]) => void; onSave: () => void;
}) {
  return (
    <Section title="Patient information" subtitle="Demographics & history" onSave={onSave}>
      <div className="grid md:grid-cols-2 gap-3">
        <Field label="Full name" value={value.name} onChange={(v) => onChange({ ...value, name: v })} />
        <Field label="Gender" value={value.gender} onChange={(v) => onChange({ ...value, gender: v })} />
        <Field label="Date of birth" value={value.dob} onChange={(v) => onChange({ ...value, dob: v })} placeholder="YYYY-MM-DD" />
        <Field label="Contact" value={value.contact} onChange={(v) => onChange({ ...value, contact: v })} />
        <Field label="Nationality" value={value.nationality} onChange={(v) => onChange({ ...value, nationality: v })} />
        <Field label="Next of kin" value={value.nok} onChange={(v) => onChange({ ...value, nok: v })} />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">Allergies & chronic conditions</Label>
        <Textarea rows={3} value={value.allergies} onChange={(e) => onChange({ ...value, allergies: e.target.value })} />
      </div>
    </Section>
  );
}

function IncidentStep({ value, onChange, onSave }: {
  value: EpcrForm["incident"]; onChange: (v: EpcrForm["incident"]) => void; onSave: () => void;
}) {
  return (
    <Section title="Incident details" subtitle="Dispatch & crew" onSave={onSave}>
      <div className="grid md:grid-cols-2 gap-3">
        <Field label="Incident #" value={value.number} onChange={(v) => onChange({ ...value, number: v })} />
        <Field label="Call type" value={value.type} onChange={(v) => onChange({ ...value, type: v })} />
        <Field label="Pickup location" value={value.pickup} onChange={(v) => onChange({ ...value, pickup: v })} />
        <Field label="Dispatch time" value={value.dispatch} onChange={(v) => onChange({ ...value, dispatch: v })} />
        <Field label="Ambulance unit" value={value.unit} onChange={(v) => onChange({ ...value, unit: v })} />
        <Field label="Crew" value={value.crew} onChange={(v) => onChange({ ...value, crew: v })} />
      </div>
    </Section>
  );
}

function VitalsStep({ value, onChange, onSave }: {
  value: EpcrForm["vitals"]; onChange: (v: EpcrForm["vitals"]) => void; onSave: () => void;
}) {
  const items: { key: keyof EpcrForm["vitals"]; label: string; unit: string }[] = [
    { key: "hr", label: "Heart rate", unit: "bpm" },
    { key: "bp", label: "Blood pressure", unit: "mmHg" },
    { key: "spo2", label: "SpO₂", unit: "%" },
    { key: "temp", label: "Temperature", unit: "°C" },
    { key: "rr", label: "Resp rate", unit: "/min" },
    { key: "gcs", label: "GCS", unit: "/15" },
  ];
  return (
    <Section title="Vital signs" subtitle="Editable readings" onSave={onSave}>
      <div className="grid md:grid-cols-3 gap-3">
        {items.map((it) => (
          <div key={it.key} className="rounded-lg border border-border bg-surface p-3">
            <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">
              {it.label} <span className="normal-case">({it.unit})</span>
            </Label>
            <Input
              className="mt-1.5 font-mono"
              value={value[it.key]}
              onChange={(e) => onChange({ ...value, [it.key]: e.target.value })}
            />
          </div>
        ))}
      </div>
    </Section>
  );
}

function AssessmentStep({ value, onChange, onSave }: {
  value: EpcrForm["assessment"]; onChange: (v: EpcrForm["assessment"]) => void; onSave: () => void;
}) {
  return (
    <Section title="Clinical assessment" subtitle="Primary findings & notes" onSave={onSave}>
      <div className="grid md:grid-cols-2 gap-3">
        <Field label="Primary assessment" value={value.primary} onChange={(v) => onChange({ ...value, primary: v })} />
        <Field label="Chief complaint" value={value.complaint} onChange={(v) => onChange({ ...value, complaint: v })} />
        <Field label="Patient condition" value={value.condition} onChange={(v) => onChange({ ...value, condition: v })} />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">Crew notes</Label>
        <Textarea rows={4} value={value.notes} onChange={(e) => onChange({ ...value, notes: e.target.value })} />
      </div>
    </Section>
  );
}

function TreatmentsStep({ value, onChange, onSave }: {
  value: string[]; onChange: (v: string[]) => void; onSave: () => void;
}) {
  return (
    <Section title="Interventions" subtitle="Add or edit procedures performed" onSave={onSave}>
      <div className="space-y-2">
        {value.map((t, i) => (
          <div key={i} className="flex gap-2">
            <Input value={t} onChange={(e) => {
              const next = [...value]; next[i] = e.target.value; onChange(next);
            }} />
            <Button size="icon" variant="outline" onClick={() => onChange(value.filter((_, idx) => idx !== i))}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button variant="outline" className="w-full" onClick={() => onChange([...value, ""])}>
          <Plus className="h-4 w-4 mr-1" /> Add intervention
        </Button>
      </div>
    </Section>
  );
}

function MedicationsStep({ value, onChange, onSave }: {
  value: Med[]; onChange: (v: Med[]) => void; onSave: () => void;
}) {
  const set = (i: number, patch: Partial<Med>) => {
    const next = [...value]; next[i] = { ...next[i], ...patch }; onChange(next);
  };
  return (
    <Section title="Medications administered" subtitle="Editable log" onSave={onSave}>
      <div className="space-y-2">
        <div className="grid grid-cols-[1fr_100px_80px_90px_40px] gap-2 text-[10px] uppercase tracking-widest text-muted-foreground px-1">
          <div>Drug</div><div>Dose</div><div>Route</div><div>Time</div><div />
        </div>
        {value.map((m, i) => (
          <div key={i} className="grid grid-cols-[1fr_100px_80px_90px_40px] gap-2">
            <Input value={m.drug} onChange={(e) => set(i, { drug: e.target.value })} />
            <Input value={m.dose} onChange={(e) => set(i, { dose: e.target.value })} />
            <Input value={m.route} onChange={(e) => set(i, { route: e.target.value })} />
            <Input className="font-mono" value={m.time} onChange={(e) => set(i, { time: e.target.value })} />
            <Button size="icon" variant="outline" onClick={() => onChange(value.filter((_, idx) => idx !== i))}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button variant="outline" className="w-full"
          onClick={() => onChange([...value, { drug: "", dose: "", route: "IV", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }])}>
          <Plus className="h-4 w-4 mr-1" /> Add medication
        </Button>
      </div>
    </Section>
  );
}

function HandoverStep({ value, onChange, onSave }: {
  value: EpcrForm["handover"]; onChange: (v: EpcrForm["handover"]) => void; onSave: () => void;
}) {
  return (
    <Section title="Digital handover" subtitle="Receiving clinician signature" onSave={onSave}>
      <div className="grid md:grid-cols-2 gap-3">
        <Field label="Destination" value={value.destination} onChange={(v) => onChange({ ...value, destination: v })} />
        <Field label="Receiving bay" value={value.bay} onChange={(v) => onChange({ ...value, bay: v })} />
        <Field label="Receiving clinician" value={value.receiver} onChange={(v) => onChange({ ...value, receiver: v })} />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">Acknowledgement notes</Label>
        <Textarea rows={3} value={value.ackNotes} onChange={(e) => onChange({ ...value, ackNotes: e.target.value })} />
      </div>
      <div>
        <Label className="text-xs">Signature</Label>
        <button
          onClick={() => onChange({ ...value, signed: !value.signed })}
          className={`mt-2 relative w-full h-28 rounded-lg border-2 border-dashed transition-all ${
            value.signed ? "border-success bg-success/5" : "border-border bg-surface hover:border-primary/50"
          }`}
        >
          {value.signed ? (
            <div className="flex items-center justify-center gap-2 text-success">
              <Check className="h-5 w-5" /> Signed by {value.receiver}
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Signature className="h-5 w-5" /> Tap to capture signature
            </div>
          )}
        </button>
      </div>
    </Section>
  );
}
