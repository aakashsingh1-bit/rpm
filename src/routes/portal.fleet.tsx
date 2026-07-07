import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  Plus, Ambulance, MapPin, Fuel, Wrench, Gauge, ShieldCheck, ClipboardList,
  Activity, Radio, Route as RouteIcon, User, Building2, Phone, Calendar,
  AlertTriangle, CheckCircle2, ArrowRight, FileText, Navigation,
} from "lucide-react";
import { ModuleGuard, ModuleHeader, Panel, StatCard, DynIcon } from "@/components/portal/Module";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/portal/fleet")({
  component: () => (
    <ModuleGuard module="fleet">
      <FleetPage />
    </ModuleGuard>
  ),
});

type VehicleStatus = "Available" | "En route" | "At scene" | "Transporting" | "Maintenance" | "Offline";

interface Vehicle {
  id: string;
  type: string;
  plate: string;
  status: VehicleStatus;
  station: string;
  fuel: number;
  odometer: number;
  utilization: number;
  nextService: string;
  regExpiry: string;
  insuranceExpiry: string;
  driver: string;
  driverPhone: string;
  medic: string;
  incident: string | null;
  destination: string | null;
  route: string | null;
  vin: string;
  make: string;
  year: number;
  equipment: { name: string; status: "OK" | "Due" | "Fail"; calibrated: string }[];
  workOrders: { id: string; type: string; opened: string; status: "Open" | "In progress" | "Closed"; tech: string }[];
  serviceHistory: { date: string; km: number; type: string; cost: string; vendor: string }[];
}

const VEHICLES: Vehicle[] = [
  {
    id: "A-14", type: "ALS Ambulance", plate: "AUH 45821", status: "En route", station: "AD Central",
    fuel: 82, odometer: 84210, utilization: 78, nextService: "12 Aug 2026",
    regExpiry: "30 Sep 2026", insuranceExpiry: "12 Nov 2026",
    driver: "Rashid Al Ameri", driverPhone: "+971 50 111 4402", medic: "Fatima Yousif",
    incident: "INC-8842", destination: "Cleveland Clinic Abu Dhabi", route: "Yas Marina → Cleveland Clinic AD · 18.4 km",
    vin: "WDB9066571S123456", make: "Mercedes-Benz Sprinter", year: 2023,
    equipment: [
      { name: "Defibrillator (LIFEPAK 15)", status: "OK",  calibrated: "18 Jun 2026" },
      { name: "Ventilator (Hamilton T1)",    status: "OK",  calibrated: "02 Jul 2026" },
      { name: "Suction unit",                 status: "Due", calibrated: "11 Jan 2026" },
      { name: "O₂ cylinders (2×D)",           status: "OK",  calibrated: "—" },
    ],
    workOrders: [
      { id: "WO-1042", type: "Preventive · 90k service", opened: "05 Jul 2026", status: "Open", tech: "Ahmed Shibli" },
    ],
    serviceHistory: [
      { date: "12 May 2026", km: 78500, type: "PM 15k", cost: "AED 1,240", vendor: "Al Habtoor Motors" },
      { date: "20 Feb 2026", km: 63200, type: "Tyres · rotate", cost: "AED 380", vendor: "Bridgestone AD" },
    ],
  },
  {
    id: "A-07", type: "ALS Ambulance", plate: "AUH 21903", status: "At scene", station: "AD Central",
    fuel: 64, odometer: 91340, utilization: 84, nextService: "22 Aug 2026",
    regExpiry: "14 Oct 2026", insuranceExpiry: "01 Dec 2026",
    driver: "Yusuf Al Mazrouei", driverPhone: "+971 50 220 8891", medic: "Layla Hassan",
    incident: "INC-8841", destination: "Sheikh Khalifa Medical City", route: "Al Reem Island → SKMC · 12.1 km",
    vin: "WDB9066571S654321", make: "Mercedes-Benz Sprinter", year: 2022,
    equipment: [
      { name: "Defibrillator", status: "OK",  calibrated: "22 May 2026" },
      { name: "Ventilator",    status: "OK",  calibrated: "22 May 2026" },
      { name: "Spinal board",  status: "OK",  calibrated: "—" },
    ],
    workOrders: [],
    serviceHistory: [
      { date: "22 Apr 2026", km: 85100, type: "PM 90k", cost: "AED 2,140", vendor: "Al Habtoor Motors" },
    ],
  },
  {
    id: "A-22", type: "BLS Ambulance", plate: "AUH 88112", status: "Available", station: "Al Reem",
    fuel: 91, odometer: 42110, utilization: 52, nextService: "05 Sep 2026",
    regExpiry: "22 Nov 2026", insuranceExpiry: "22 Nov 2026",
    driver: "Omar Al Suwaidi", driverPhone: "+971 55 334 1120", medic: "Nadia Al Falasi",
    incident: null, destination: null, route: null,
    vin: "JN1TCNT31Z0022110", make: "Nissan NV350", year: 2024,
    equipment: [
      { name: "AED",           status: "OK", calibrated: "10 Jun 2026" },
      { name: "Trauma kit",    status: "OK", calibrated: "—" },
    ],
    workOrders: [],
    serviceHistory: [],
  },
  {
    id: "A-31", type: "ALS Ambulance", plate: "AUH 33420", status: "Transporting", station: "Corniche",
    fuel: 47, odometer: 112800, utilization: 88, nextService: "18 Aug 2026",
    regExpiry: "03 Aug 2026", insuranceExpiry: "03 Aug 2026",
    driver: "Ali Al Kaabi", driverPhone: "+971 52 998 3311", medic: "Mira Al Jaberi",
    incident: "INC-8839", destination: "Sheikh Khalifa Medical City", route: "Cleveland Clinic AD → SKMC · 9.6 km",
    vin: "WDB9066571S998877", make: "Mercedes-Benz Sprinter", year: 2021,
    equipment: [
      { name: "Defibrillator", status: "OK",   calibrated: "01 Jun 2026" },
      { name: "Infusion pump", status: "Fail", calibrated: "10 Mar 2026" },
    ],
    workOrders: [
      { id: "WO-1039", type: "Corrective · infusion pump", opened: "01 Jul 2026", status: "In progress", tech: "Ravi Kumar" },
    ],
    serviceHistory: [
      { date: "18 Feb 2026", km: 104500, type: "PM 110k", cost: "AED 2,860", vendor: "EMC Workshop" },
    ],
  },
  {
    id: "A-08", type: "BLS Ambulance", plate: "AUH 55901", status: "Maintenance", station: "AD Central",
    fuel: 22, odometer: 76400, utilization: 0, nextService: "In service",
    regExpiry: "18 Jan 2027", insuranceExpiry: "18 Jan 2027",
    driver: "—", driverPhone: "—", medic: "—",
    incident: null, destination: null, route: null,
    vin: "JN1TCNT31Z0055901", make: "Nissan NV350", year: 2023,
    equipment: [
      { name: "AED", status: "Due", calibrated: "02 Jan 2026" },
    ],
    workOrders: [
      { id: "WO-1040", type: "Corrective · brake pads", opened: "03 Jul 2026", status: "In progress", tech: "Ahmed Shibli" },
      { id: "WO-1041", type: "Preventive · oil change", opened: "03 Jul 2026", status: "Open",         tech: "Ahmed Shibli" },
    ],
    serviceHistory: [
      { date: "10 Jan 2026", km: 68200, type: "PM 60k", cost: "AED 1,880", vendor: "Al Habtoor Motors" },
    ],
  },
  {
    id: "A-19", type: "Rapid Response", plate: "AUH 71204", status: "Available", station: "Yas",
    fuel: 78, odometer: 32100, utilization: 41, nextService: "14 Sep 2026",
    regExpiry: "05 Dec 2026", insuranceExpiry: "05 Dec 2026",
    driver: "Hamad Al Dhaheri", driverPhone: "+971 50 771 2044", medic: "Amina Saleh",
    incident: null, destination: null, route: null,
    vin: "JTMBK33V80D032100", make: "Toyota Land Cruiser", year: 2024,
    equipment: [{ name: "Response kit", status: "OK", calibrated: "—" }],
    workOrders: [],
    serviceHistory: [],
  },
  {
    id: "A-25", type: "MCI Unit", plate: "AUH 90015", status: "Offline", station: "HQ",
    fuel: 100, odometer: 58900, utilization: 12, nextService: "01 Aug 2026",
    regExpiry: "10 Aug 2026", insuranceExpiry: "10 Aug 2026",
    driver: "Reserve pool", driverPhone: "+971 2 599 0001", medic: "—",
    incident: null, destination: null, route: null,
    vin: "IVEC70C17E5X58900", make: "Iveco Daily", year: 2020,
    equipment: [
      { name: "Triage tags (200)",  status: "OK",  calibrated: "—" },
      { name: "Field ventilators",  status: "Due", calibrated: "05 Dec 2025" },
    ],
    workOrders: [
      { id: "WO-1035", type: "Corrective · comms rack", opened: "24 Jun 2026", status: "Open", tech: "Vendor · Motorola" },
    ],
    serviceHistory: [],
  },
];

const STATUS_STYLE: Record<VehicleStatus, string> = {
  Available:    "text-success border-success/40 bg-success/10",
  "En route":   "text-warning border-warning/40 bg-warning/10",
  "At scene":   "text-info border-info/40 bg-info/10",
  Transporting: "text-primary border-primary/40 bg-primary/10",
  Maintenance:  "text-muted-foreground border-border bg-surface",
  Offline:      "text-destructive border-destructive/40 bg-destructive/10",
};

function FleetPage() {
  const [selected, setSelected] = useState<Vehicle | null>(null);
  const [registerOpen, setRegisterOpen] = useState(false);

  return (
    <div>
      <ModuleHeader
        module="fleet"
        actions={
          <RegisterVehicleDialog open={registerOpen} onOpenChange={setRegisterOpen} />
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
        <StatCard label="Total fleet"  value={VEHICLES.length}                                        icon="Ambulance"    index={0} />
        <StatCard label="Available"    value={VEHICLES.filter((v) => v.status === "Available").length} tone="success" icon="CheckCircle2" index={1} />
        <StatCard label="On mission"   value={VEHICLES.filter((v) => ["En route","At scene","Transporting"].includes(v.status)).length} tone="info" icon="Activity" index={2} />
        <StatCard label="Maintenance"  value={VEHICLES.filter((v) => v.status === "Maintenance").length} tone="warning" icon="Wrench" index={3} />
        <StatCard label="Offline"      value={VEHICLES.filter((v) => v.status === "Offline").length}     tone="danger"  icon="AlertOctagon" index={4} />
        <StatCard label="Utilization"  value="68%"                                                       tone="info"    icon="Gauge"        index={5} />
      </div>

      <Tabs defaultValue="registry" className="w-full">
        <TabsList className="mb-4 flex flex-wrap h-auto">
          <TabsTrigger value="registry">    <Ambulance className="h-3.5 w-3.5 mr-1.5" /> Registry</TabsTrigger>
          <TabsTrigger value="status">      <Activity  className="h-3.5 w-3.5 mr-1.5" /> Status & AVL</TabsTrigger>
          <TabsTrigger value="maintenance"> <Wrench    className="h-3.5 w-3.5 mr-1.5" /> Maintenance</TabsTrigger>
          <TabsTrigger value="equipment">   <ClipboardList className="h-3.5 w-3.5 mr-1.5" /> Equipment</TabsTrigger>
          <TabsTrigger value="compliance">  <ShieldCheck className="h-3.5 w-3.5 mr-1.5" /> Compliance</TabsTrigger>
          <TabsTrigger value="fuel">        <Fuel      className="h-3.5 w-3.5 mr-1.5" /> Fuel & Mileage</TabsTrigger>
          <TabsTrigger value="reports">     <Gauge     className="h-3.5 w-3.5 mr-1.5" /> Performance</TabsTrigger>
        </TabsList>

        {/* Registry */}
        <TabsContent value="registry" className="mt-0">
          <Panel title="Vehicle registry" subtitle="Master data · click any vehicle for detailed record">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {VEHICLES.map((v, i) => (
                <motion.button
                  key={v.id}
                  onClick={() => setSelected(v)}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                  className="text-left rounded-lg border border-border bg-surface p-4 hover:border-primary/50 hover:shadow-glow transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <DynIcon name="Ambulance" className="h-4 w-4 text-primary" />
                        <span className="font-display font-semibold">{v.id}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">{v.type}</div>
                    </div>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${STATUS_STYLE[v.status]}`}>{v.status}</span>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div className="flex justify-between"><span>Plate</span><span className="font-mono text-foreground">{v.plate}</span></div>
                    <div className="flex justify-between"><span>Station</span><span className="text-foreground">{v.station}</span></div>
                    <div className="flex justify-between"><span>Driver</span><span className="text-foreground truncate ml-2">{v.driver}</span></div>
                    {v.incident && (
                      <div className="flex justify-between"><span>Incident</span><span className="font-mono text-primary">{v.incident}</span></div>
                    )}
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-[10px] mb-1"><span className="text-muted-foreground">Fuel</span><span className="font-mono">{v.fuel}%</span></div>
                    <div className="h-1 rounded-full bg-background overflow-hidden">
                      <div className={`h-full ${v.fuel < 30 ? "bg-destructive" : v.fuel < 60 ? "bg-warning" : "bg-success"}`} style={{ width: `${v.fuel}%` }} />
                    </div>
                  </div>
                  <div className="mt-3 text-[10px] font-mono uppercase tracking-widest text-primary flex items-center gap-1">
                    Open record <ArrowRight className="h-3 w-3" />
                  </div>
                </motion.button>
              ))}
            </div>
          </Panel>
        </TabsContent>

        {/* Status / AVL */}
        <TabsContent value="status" className="mt-0">
          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6">
            <Panel title="Live status & GPS/AVL" subtitle="Real-time vehicle telemetry">
              <div className="relative h-64 rounded-lg overflow-hidden border border-border bg-surface bg-grid mb-4">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_oklch(0.58_0.22_255_/_0.18),_transparent_60%)]" />
                {VEHICLES.map((v, i) => (
                  <div key={v.id} className="absolute" style={{ left: `${10 + (i * 12) % 80}%`, top: `${15 + (i * 17) % 70}%` }}>
                    <div className={`h-3 w-3 rounded-full border-2 border-background shadow-glow -translate-x-1/2 -translate-y-1/2 ${
                      v.status === "Available" ? "bg-success" : v.status === "Offline" ? "bg-destructive" : v.status === "Maintenance" ? "bg-muted-foreground" : "bg-primary"
                    }`} />
                    <span className="absolute top-1.5 left-2 text-[9px] font-mono text-foreground bg-background/70 px-1 rounded">{v.id}</span>
                  </div>
                ))}
                <div className="absolute bottom-2 right-2 text-[10px] font-mono uppercase tracking-widest text-muted-foreground bg-background/70 px-2 py-1 rounded">
                  <Navigation className="h-3 w-3 inline mr-1" /> {VEHICLES.length} units · 4 geofences
                </div>
              </div>
              <div className="space-y-2">
                {VEHICLES.filter((v) => v.incident).map((v) => (
                  <button key={v.id} onClick={() => setSelected(v)} className="w-full text-left rounded-md border border-border bg-surface p-3 hover:border-primary/50 transition-colors">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-semibold text-primary">{v.id}</span>
                      <span className={`font-mono px-1.5 py-0.5 rounded border text-[10px] ${STATUS_STYLE[v.status]}`}>{v.status}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><RouteIcon className="h-3 w-3" /> {v.route}</div>
                  </button>
                ))}
              </div>
            </Panel>
            <Panel title="Geofences" subtitle="Auto-status zones">
              <div className="space-y-2 text-xs">
                {[
                  { name: "AD Central Station", type: "Station",  units: 8 },
                  { name: "Corniche Station",   type: "Station",  units: 5 },
                  { name: "SKMC Hospital",      type: "Hospital", units: 3 },
                  { name: "Cleveland Clinic",   type: "Hospital", units: 2 },
                  { name: "Yas Zone",           type: "Coverage", units: 4 },
                ].map((g) => (
                  <div key={g.name} className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
                    <div><div className="text-sm">{g.name}</div><div className="text-[10px] text-muted-foreground">{g.type}</div></div>
                    <span className="font-mono text-primary">{g.units}u</span>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </TabsContent>

        {/* Maintenance */}
        <TabsContent value="maintenance" className="mt-0">
          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6">
            <Panel title="Open work orders" subtitle="Preventive & corrective">
              <div className="space-y-2">
                {VEHICLES.flatMap((v) => v.workOrders.map((w) => ({ ...w, unit: v.id, vehicle: v }))).map((w) => (
                  <div key={w.id} className="rounded-lg border border-border bg-surface p-3">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-primary">{w.id}</span>
                        <button onClick={() => setSelected(w.vehicle)} className="font-mono text-xs hover:text-primary underline-offset-2 hover:underline">{w.unit}</button>
                      </div>
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                        w.status === "In progress" ? "text-warning border-warning/40 bg-warning/10" :
                        w.status === "Open"        ? "text-info border-info/40 bg-info/10" :
                        "text-success border-success/40 bg-success/10"
                      }`}>{w.status}</span>
                    </div>
                    <div className="text-sm">{w.type}</div>
                    <div className="text-[11px] text-muted-foreground mt-1">Opened {w.opened} · {w.tech}</div>
                  </div>
                ))}
              </div>
            </Panel>
            <Panel title="Maintenance alerts">
              <div className="space-y-3 text-xs">
                {[
                  { u: "A-08", msg: "Brake pad service in progress", sev: "warning" },
                  { u: "A-25", msg: "Offline > 48h · escalate",       sev: "danger"  },
                  { u: "A-31", msg: "Fuel below 50%",                   sev: "info"    },
                  { u: "A-31", msg: "Infusion pump failed calibration", sev: "danger"  },
                ].map((a, i) => (
                  <div key={i} className="flex items-start gap-2 pb-2 border-b border-border/50 last:border-0">
                    <div className={`h-1.5 w-1.5 rounded-full mt-1.5 ${a.sev === "danger" ? "bg-destructive" : a.sev === "warning" ? "bg-warning" : "bg-info"}`} />
                    <div><div className="text-foreground font-mono">{a.u}</div><div className="text-muted-foreground">{a.msg}</div></div>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </TabsContent>

        {/* Equipment */}
        <TabsContent value="equipment" className="mt-0">
          <Panel title="Medical equipment inventory" subtitle="Assigned to vehicle · calibration tracked">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-2">Vehicle</th>
                    <th className="text-left py-2 px-2">Equipment</th>
                    <th className="text-left py-2 px-2">Status</th>
                    <th className="text-left py-2 px-2">Last calibrated</th>
                    <th className="text-right py-2 px-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {VEHICLES.flatMap((v) => v.equipment.map((e) => ({ v, e }))).map(({ v, e }, i) => (
                    <tr key={`${v.id}-${e.name}-${i}`} className="border-b border-border/60 hover:bg-surface/50">
                      <td className="py-2 px-2 font-mono">{v.id}</td>
                      <td className="py-2 px-2">{e.name}</td>
                      <td className="py-2 px-2">
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                          e.status === "OK"   ? "text-success border-success/40 bg-success/10" :
                          e.status === "Due"  ? "text-warning border-warning/40 bg-warning/10" :
                          "text-destructive border-destructive/40 bg-destructive/10"
                        }`}>{e.status}</span>
                      </td>
                      <td className="py-2 px-2 text-muted-foreground">{e.calibrated}</td>
                      <td className="py-2 px-2 text-right">
                        <button onClick={() => setSelected(v)} className="text-primary hover:underline text-[11px]">Open →</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </TabsContent>

        {/* Compliance */}
        <TabsContent value="compliance" className="mt-0">
          <Panel title="Compliance & certification" subtitle="Registration · insurance · certifications">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {VEHICLES.map((v) => {
                const exp = new Date(v.regExpiry.split(" ").reverse().join(" "));
                const days = Math.ceil((exp.getTime() - Date.now()) / 86400000);
                const tone = days < 30 ? "danger" : days < 90 ? "warning" : "success";
                return (
                  <button key={v.id} onClick={() => setSelected(v)} className="text-left rounded-lg border border-border bg-surface p-3 hover:border-primary/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono font-semibold">{v.id}</span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                        tone === "danger" ? "text-destructive border-destructive/40 bg-destructive/10" :
                        tone === "warning" ? "text-warning border-warning/40 bg-warning/10" :
                        "text-success border-success/40 bg-success/10"
                      }`}>
                        {days > 0 ? `${days}d` : "expired"}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-0.5">
                      <div className="flex justify-between"><span>Registration</span><span className="text-foreground">{v.regExpiry}</span></div>
                      <div className="flex justify-between"><span>Insurance</span><span className="text-foreground">{v.insuranceExpiry}</span></div>
                      <div className="flex justify-between"><span>VIN</span><span className="text-foreground font-mono truncate max-w-[8rem]">{v.vin}</span></div>
                    </div>
                  </button>
                );
              })}
            </div>
          </Panel>
        </TabsContent>

        {/* Fuel & Mileage */}
        <TabsContent value="fuel" className="mt-0">
          <Panel title="Fuel, mileage & utilization" subtitle="Telematics integration">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-2">Unit</th>
                    <th className="text-left py-2 px-2">Odometer</th>
                    <th className="text-left py-2 px-2">Fuel</th>
                    <th className="text-left py-2 px-2">Utilization</th>
                    <th className="text-left py-2 px-2">Station</th>
                    <th className="text-right py-2 px-2">Next service</th>
                  </tr>
                </thead>
                <tbody>
                  {VEHICLES.map((v) => (
                    <tr key={v.id} className="border-b border-border/60 hover:bg-surface/50 cursor-pointer" onClick={() => setSelected(v)}>
                      <td className="py-2 px-2 font-mono">{v.id}</td>
                      <td className="py-2 px-2 font-mono tabular-nums">{v.odometer.toLocaleString()} km</td>
                      <td className="py-2 px-2">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1 rounded-full bg-background overflow-hidden">
                            <div className={`h-full ${v.fuel < 30 ? "bg-destructive" : v.fuel < 60 ? "bg-warning" : "bg-success"}`} style={{ width: `${v.fuel}%` }} />
                          </div>
                          <span className="font-mono w-8 text-right">{v.fuel}%</span>
                        </div>
                      </td>
                      <td className="py-2 px-2">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1 rounded-full bg-background overflow-hidden">
                            <div className="h-full bg-gradient-primary" style={{ width: `${v.utilization}%` }} />
                          </div>
                          <span className="font-mono w-8 text-right">{v.utilization}%</span>
                        </div>
                      </td>
                      <td className="py-2 px-2 text-muted-foreground">{v.station}</td>
                      <td className="py-2 px-2 text-right text-muted-foreground">{v.nextService}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </TabsContent>

        {/* Performance */}
        <TabsContent value="reports" className="mt-0">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="MTBF"           value="820h"  tone="success" icon="Activity"     index={0} />
            <StatCard label="Downtime · MTD" value="42h"   tone="warning" icon="Clock"        index={1} />
            <StatCard label="Cost per km"    value="AED 2.14" tone="info" icon="Gauge"        index={2} />
            <StatCard label="Availability"   value="92.6%" tone="success" icon="CheckCircle2" index={3} />
          </div>
          <Panel title="Vehicle downtime · last 30 days" subtitle="Availability dashboard" className="mt-6">
            <div className="space-y-2">
              {VEHICLES.map((v) => {
                const down = v.status === "Offline" ? 78 : v.status === "Maintenance" ? 34 : Math.floor(Math.random() * 12);
                return (
                  <div key={v.id} className="flex items-center gap-3">
                    <span className="font-mono text-xs w-14">{v.id}</span>
                    <div className="flex-1 h-2 rounded-full bg-background overflow-hidden">
                      <div className={`h-full ${down > 60 ? "bg-destructive" : down > 20 ? "bg-warning" : "bg-success"}`} style={{ width: `${100 - down}%` }} />
                    </div>
                    <span className="font-mono text-xs w-16 text-right tabular-nums">{100 - down}% up</span>
                  </div>
                );
              })}
            </div>
          </Panel>
        </TabsContent>
      </Tabs>

      <VehicleDetail vehicle={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

/* ------------------------------------------------------------------ */

function RegisterVehicleDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [id, setId] = useState("");
  const [plate, setPlate] = useState("");
  const [type, setType] = useState("ALS Ambulance");
  const [station, setStation] = useState("AD Central");
  const [vin, setVin] = useState("");
  const [make, setMake] = useState("");

  const submit = () => {
    if (!id || !plate) return toast.error("Unit ID and plate are required");
    toast.success(`${id} registered`, { description: `${type} · ${plate} · ${station}` });
    onOpenChange(false);
    setId(""); setPlate(""); setVin(""); setMake("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-primary text-primary-foreground shadow-glow">
          <Plus className="h-4 w-4 mr-1" /> Register vehicle
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Register new vehicle</DialogTitle>
        </DialogHeader>
        <div className="grid md:grid-cols-2 gap-4">
          <div><Label>Unit ID</Label><Input value={id} onChange={(e) => setId(e.target.value)} placeholder="A-42" /></div>
          <div><Label>Plate</Label><Input value={plate} onChange={(e) => setPlate(e.target.value)} placeholder="AUH 00000" /></div>
          <div>
            <Label>Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ALS Ambulance">ALS Ambulance</SelectItem>
                <SelectItem value="BLS Ambulance">BLS Ambulance</SelectItem>
                <SelectItem value="Rapid Response">Rapid Response</SelectItem>
                <SelectItem value="MCI Unit">MCI Unit</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Home station</Label>
            <Select value={station} onValueChange={setStation}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="AD Central">AD Central</SelectItem>
                <SelectItem value="Corniche">Corniche</SelectItem>
                <SelectItem value="Al Reem">Al Reem</SelectItem>
                <SelectItem value="Yas">Yas</SelectItem>
                <SelectItem value="HQ">HQ</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div><Label>VIN</Label><Input value={vin} onChange={(e) => setVin(e.target.value)} placeholder="17-char VIN" /></div>
          <div><Label>Make / model</Label><Input value={make} onChange={(e) => setMake(e.target.value)} placeholder="Mercedes-Benz Sprinter" /></div>
          <div><Label>Registration expiry</Label><Input type="date" /></div>
          <div><Label>Insurance expiry</Label><Input type="date" /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} className="bg-gradient-primary text-primary-foreground">Register vehicle</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------------------------------------------ */

function VehicleDetail({ vehicle, onClose }: { vehicle: Vehicle | null; onClose: () => void }) {
  return (
    <Sheet open={!!vehicle} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        {vehicle && (
          <>
            <SheetHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-primary">
                    Vehicle record · {vehicle.type}
                  </div>
                  <SheetTitle className="text-2xl font-display">{vehicle.id} · {vehicle.plate}</SheetTitle>
                  <div className="text-sm text-muted-foreground">{vehicle.make} · {vehicle.year} · VIN {vehicle.vin}</div>
                </div>
                <span className={`text-[10px] font-mono px-2 py-1 rounded border ${STATUS_STYLE[vehicle.status]}`}>{vehicle.status}</span>
              </div>
            </SheetHeader>

            <div className="mt-6 space-y-6">
              {/* Assignment (only when active) */}
              {vehicle.incident ? (
                <section className="rounded-lg border border-primary/40 bg-primary/5 p-4">
                  <div className="text-[10px] uppercase tracking-widest text-primary mb-2 flex items-center gap-1.5">
                    <Radio className="h-3 w-3" /> Current assignment
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <Field icon={FileText}  label="Incident" value={
                      <Link to="/portal/cad" className="font-mono text-primary hover:underline">{vehicle.incident}</Link>
                    } />
                    <Field icon={Building2} label="Destination" value={
                      <Link to="/portal/hospital" className="hover:underline">{vehicle.destination}</Link>
                    } />
                    <Field icon={RouteIcon} label="Route" value={vehicle.route ?? "—"} full />
                  </div>
                </section>
              ) : (
                <section className="rounded-lg border border-border bg-surface/40 p-4 text-xs text-muted-foreground">
                  No active assignment. Vehicle is <span className="text-foreground">{vehicle.status.toLowerCase()}</span>.
                </section>
              )}

              {/* Crew */}
              <section>
                <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Assigned crew</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-border bg-surface p-3">
                    <div className="flex items-center gap-2 mb-2"><User className="h-3.5 w-3.5 text-primary" /><span className="text-[10px] uppercase tracking-widest text-muted-foreground">Driver</span></div>
                    <div className="text-sm font-medium">{vehicle.driver}</div>
                    <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-1"><Phone className="h-3 w-3" />{vehicle.driverPhone}</div>
                  </div>
                  <div className="rounded-lg border border-border bg-surface p-3">
                    <div className="flex items-center gap-2 mb-2"><User className="h-3.5 w-3.5 text-primary" /><span className="text-[10px] uppercase tracking-widest text-muted-foreground">Medic</span></div>
                    <div className="text-sm font-medium">{vehicle.medic}</div>
                    <Link to="/portal/crew" className="text-[11px] text-primary hover:underline mt-1 inline-flex items-center gap-1">Open crew module <ArrowRight className="h-3 w-3" /></Link>
                  </div>
                </div>
              </section>

              {/* Master data */}
              <section>
                <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Master data</h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <Field icon={MapPin}      label="Home station"     value={vehicle.station} />
                  <Field icon={Gauge}       label="Odometer"          value={`${vehicle.odometer.toLocaleString()} km`} />
                  <Field icon={Fuel}        label="Fuel"              value={`${vehicle.fuel}%`} />
                  <Field icon={Activity}    label="Utilization"       value={`${vehicle.utilization}%`} />
                  <Field icon={Calendar}    label="Next service"      value={vehicle.nextService} />
                  <Field icon={ShieldCheck} label="Registration"      value={vehicle.regExpiry} />
                  <Field icon={ShieldCheck} label="Insurance expires" value={vehicle.insuranceExpiry} />
                </div>
              </section>

              {/* Equipment */}
              <section>
                <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Medical equipment</h3>
                <div className="space-y-1.5">
                  {vehicle.equipment.map((e) => (
                    <div key={e.name} className="flex items-center justify-between rounded-md border border-border bg-surface px-3 py-2 text-xs">
                      <div>
                        <div>{e.name}</div>
                        <div className="text-[10px] text-muted-foreground">Last calibrated {e.calibrated}</div>
                      </div>
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                        e.status === "OK"   ? "text-success border-success/40 bg-success/10" :
                        e.status === "Due"  ? "text-warning border-warning/40 bg-warning/10" :
                        "text-destructive border-destructive/40 bg-destructive/10"
                      }`}>{e.status}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Work orders */}
              <section>
                <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Open work orders</h3>
                {vehicle.workOrders.length === 0 ? (
                  <div className="text-xs text-muted-foreground flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-success" /> No open work orders.</div>
                ) : (
                  <div className="space-y-2">
                    {vehicle.workOrders.map((w) => (
                      <div key={w.id} className="rounded-md border border-border bg-surface px-3 py-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-primary">{w.id}</span>
                          <span className="text-[10px] font-mono text-muted-foreground">{w.opened}</span>
                        </div>
                        <div className="mt-0.5">{w.type}</div>
                        <div className="text-[10px] text-muted-foreground">{w.tech} · {w.status}</div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Service history */}
              <section>
                <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Service history</h3>
                {vehicle.serviceHistory.length === 0 ? (
                  <div className="text-xs text-muted-foreground">No service history recorded.</div>
                ) : (
                  <div className="space-y-1.5">
                    {vehicle.serviceHistory.map((s, i) => (
                      <div key={i} className="flex items-center justify-between rounded-md border border-border bg-surface px-3 py-2 text-xs">
                        <div>
                          <div>{s.type}</div>
                          <div className="text-[10px] text-muted-foreground">{s.date} · {s.km.toLocaleString()} km · {s.vendor}</div>
                        </div>
                        <span className="font-mono">{s.cost}</span>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                <Button className="bg-gradient-primary text-primary-foreground" onClick={() => toast.success(`Work order created for ${vehicle.id}`)}>
                  <Wrench className="h-4 w-4 mr-2" /> New work order
                </Button>
                <Button variant="outline" onClick={() => toast(`${vehicle.id} marked out-of-service`)}>
                  <AlertTriangle className="h-4 w-4 mr-2" /> Out-of-service
                </Button>
                <Link to="/portal/cad" className="text-xs px-3 py-2 rounded-md border border-border bg-card hover:border-primary/50 flex items-center gap-1.5">
                  <Radio className="h-3.5 w-3.5 text-primary" /> View in CAD
                </Link>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Field({
  icon: I, label, value, full,
}: { icon: React.ComponentType<{ className?: string }>; label: string; value: React.ReactNode; full?: boolean }) {
  return (
    <div className={`rounded-md border border-border bg-surface px-3 py-2 ${full ? "col-span-2" : ""}`}>
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
        <I className="h-3 w-3" /> {label}
      </div>
      <div className="text-sm">{value}</div>
    </div>
  );
}
