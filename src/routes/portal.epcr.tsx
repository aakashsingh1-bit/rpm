import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { HeartPulse, Activity, Thermometer, Wind, Droplet, Signature, Check } from "lucide-react";
import { ModuleGuard, ModuleHeader, Panel } from "@/components/portal/Module";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/portal/epcr")({
  component: () => (
    <ModuleGuard module="epcr">
      <EpcrPage />
    </ModuleGuard>
  ),
});

const steps = [
  { id: "patient", label: "Patient", icon: HeartPulse },
  { id: "vitals", label: "Vitals", icon: Activity },
  { id: "treatment", label: "Treatment", icon: Droplet },
  { id: "handover", label: "Handover", icon: Signature },
];

function EpcrPage() {
  const [step, setStep] = useState(1);
  const [signed, setSigned] = useState(false);

  return (
    <div>
      <ModuleHeader module="epcr" />

      <div className="grid lg:grid-cols-[260px_1fr] gap-6">
        {/* Stepper */}
        <Panel title="Clinical workflow" subtitle="Case INC-8842">
          <ol className="relative space-y-6">
            <div className="absolute left-[15px] top-2 bottom-2 w-px bg-border" />
            {steps.map((s, i) => {
              const active = step === i;
              const done = step > i;
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

        <div className="space-y-6">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {step === 0 && <PatientStep />}
            {step === 1 && <VitalsStep />}
            {step === 2 && <TreatmentStep />}
            {step === 3 && <HandoverStep signed={signed} setSigned={setSigned} />}
          </motion.div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
              Back
            </Button>
            {step < steps.length - 1 ? (
              <Button className="bg-gradient-primary text-primary-foreground" onClick={() => setStep((s) => s + 1)}>
                Continue
              </Button>
            ) : (
              <Button
                className="bg-gradient-primary text-primary-foreground shadow-glow"
                disabled={!signed}
                onClick={() => toast.success("ePCR submitted · sent to receiving hospital")}
              >
                Submit ePCR
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PatientStep() {
  return (
    <Panel title="Patient registration" subtitle="Demographics & history">
      <div className="grid md:grid-cols-2 gap-4">
        {["Full name", "Emirates ID / MRN", "Date of birth", "Gender", "Nationality", "Next of kin"].map((l) => (
          <div key={l} className="space-y-1.5">
            <Label>{l}</Label>
            <Input placeholder={`Enter ${l.toLowerCase()}`} />
          </div>
        ))}
        <div className="md:col-span-2 space-y-1.5">
          <Label>Known allergies & chronic conditions</Label>
          <Textarea placeholder="Penicillin, hypertension…" rows={3} />
        </div>
      </div>
    </Panel>
  );
}

function VitalsStep() {
  const vitals = [
    { icon: HeartPulse, label: "Heart rate", value: "112", unit: "bpm", tone: "warning" },
    { icon: Activity, label: "Blood pressure", value: "138/92", unit: "mmHg", tone: "warning" },
    { icon: Wind, label: "SpO₂", value: "94", unit: "%", tone: "success" },
    { icon: Thermometer, label: "Temp", value: "37.4", unit: "°C", tone: "success" },
    { icon: Wind, label: "Resp rate", value: "22", unit: "/min", tone: "warning" },
    { icon: Activity, label: "GCS", value: "14", unit: "/15", tone: "success" },
  ];
  return (
    <Panel title="Vital signs" subtitle={`Captured ${new Date().toLocaleTimeString()}`}>
      <div className="grid md:grid-cols-3 gap-3">
        {vitals.map((v, i) => (
          <motion.div
            key={v.label}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-lg border border-border bg-surface p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <v.icon className={`h-4 w-4 ${v.tone === "warning" ? "text-warning" : "text-success"}`} />
              <span className="text-xs text-muted-foreground">{v.label}</span>
            </div>
            <div className="text-2xl font-display font-semibold tabular-nums">
              {v.value} <span className="text-xs text-muted-foreground font-sans">{v.unit}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </Panel>
  );
}

function TreatmentStep() {
  return (
    <Panel title="Interventions & medications" subtitle="Log treatments administered">
      <div className="space-y-3">
        {[
          { time: "09:42", med: "Aspirin 300mg PO", by: "R. Al Ameri" },
          { time: "09:44", med: "GTN spray 400mcg SL", by: "F. Yousif" },
          { time: "09:46", med: "IV access · 18G left AC", by: "R. Al Ameri" },
          { time: "09:48", med: "12-lead ECG · STEMI inferior", by: "R. Al Ameri" },
        ].map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            className="flex items-center gap-3 rounded-md border border-border/60 bg-surface p-3"
          >
            <span className="font-mono text-xs text-primary">{t.time}</span>
            <span className="flex-1 text-sm">{t.med}</span>
            <span className="text-xs text-muted-foreground">{t.by}</span>
          </motion.div>
        ))}
        <Button variant="outline" className="w-full">+ Add intervention</Button>
      </div>
    </Panel>
  );
}

function HandoverStep({ signed, setSigned }: { signed: boolean; setSigned: (v: boolean) => void }) {
  return (
    <Panel title="Digital handover" subtitle="Patient consent & receiving clinician signature">
      <div className="space-y-4">
        <div className="rounded-lg border border-border bg-surface p-4">
          <div className="text-xs text-muted-foreground mb-2">Receiving facility</div>
          <div className="text-lg font-display font-semibold">Sheikh Khalifa Medical City</div>
          <div className="text-xs text-muted-foreground">Bay 3 · Trauma team ready · ETA 3 min</div>
        </div>
        <div>
          <Label>Signature</Label>
          <button
            onClick={() => setSigned(true)}
            className={`mt-2 relative w-full h-32 rounded-lg border-2 border-dashed transition-all ${
              signed ? "border-success bg-success/5" : "border-border bg-surface hover:border-primary/50"
            }`}
          >
            {signed ? (
              <div className="flex items-center justify-center gap-2 text-success">
                <Check className="h-5 w-5" /> Signed by Dr. Noura Al Zaabi
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Signature className="h-5 w-5" /> Tap to capture signature
              </div>
            )}
          </button>
        </div>
      </div>
    </Panel>
  );
}
