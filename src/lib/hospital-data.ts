export const HOSPITAL_TABS = [
  { key: "dashboard", label: "Hosp. Dashboard", path: "/portal/hospital", icon: "LayoutDashboard" },
  { key: "incoming", label: "Incoming Ambulances", path: "/portal/hospital/incoming", icon: "Ambulance" },
  { key: "queue", label: "Patient Queue", path: "/portal/hospital/queue", icon: "ListOrdered" },
  { key: "handover", label: "Patient Handover", path: "/portal/hospital/handover", icon: "ClipboardCheck" },
  
  { key: "communication", label: "Hospital Comms", path: "/portal/hospital/communication", icon: "MessageSquare" },
  { key: "ift", label: "IFT Transfers", path: "/portal/hospital/ift", icon: "ArrowLeftRight" },
  { key: "reports", label: "Hospital Reports", path: "/portal/hospital/reports", icon: "BarChart3" },
] as const;

export interface Incoming {
  incident: string;
  unit: string;
  crew: string;
  dispatcher: string;
  cond: string;
  eta: string;
  bay: string;
  status: "En route" | "On scene" | "Assigned" | "Arrived";
  priority: "P1" | "P2" | "P3" | "P4";
  vitals: string;
  hospital: string;
  patient: { name: string; age: number; gender: "M" | "F"; complaint: string };
}

export const INCOMING: Incoming[] = [
  { incident: "INC-8842", unit: "A-14", crew: "Rashid Al Ameri",    dispatcher: "Sara Al Hosani",    cond: "STEMI · cardiac arrest",   eta: "3:12",  bay: "Cath Lab 1", status: "En route", priority: "P1", vitals: "HR 140 · BP 90/60 · SpO₂ 92%", hospital: "Cleveland Clinic Abu Dhabi",   patient: { name: "Khalid Al Nuaimi", age: 58, gender: "M", complaint: "Acute chest pain" } },
  { incident: "INC-8841", unit: "A-07", crew: "Yusuf Al Mazrouei",  dispatcher: "Sara Al Hosani",    cond: "Chest pain · 62F",         eta: "5:44",  bay: "Bay 3",      status: "En route", priority: "P1", vitals: "HR 112 · BP 150/95 · SpO₂ 96%", hospital: "Sheikh Khalifa Medical City",  patient: { name: "Fatima Al Marri", age: 62, gender: "F", complaint: "Chest tightness, radiating arm pain" } },
  { incident: "INC-8840", unit: "A-22", crew: "Omar Al Suwaidi",    dispatcher: "Mariam Al Blooshi", cond: "RTA · polytrauma",         eta: "8:20",  bay: "Trauma 1",   status: "Assigned", priority: "P2", vitals: "GCS 12 · BP 100/70",             hospital: "Sheikh Khalifa Medical City",  patient: { name: "Ahmed Al Suwaidi", age: 34, gender: "M", complaint: "MVC, chest & lower limb trauma" } },
  { incident: "INC-8839", unit: "A-31", crew: "Ali Al Kaabi",       dispatcher: "Ahmed Al Balushi",  cond: "IFT · post-op",            eta: "12:04", bay: "Ward 4A",    status: "On scene", priority: "P3", vitals: "Stable",                         hospital: "Sheikh Khalifa Medical City",  patient: { name: "Layla Al Zaabi", age: 47, gender: "F", complaint: "Post-op transfer, stable" } },
  { incident: "INC-8838", unit: "A-19", crew: "Mohammed Al Hameli", dispatcher: "Noura Al Dhaheri",  cond: "Stroke · dysarthria",      eta: "6:38",  bay: "Stroke A",   status: "En route", priority: "P1", vitals: "BP 180/110 · GCS 13",           hospital: "Cleveland Clinic Abu Dhabi",   patient: { name: "Salim Al Ketbi", age: 71, gender: "M", complaint: "Sudden left-sided weakness" } },
];

export const HOSPITALS = [
  { name: "Sheikh Khalifa Medical City", capacity: 82, incoming: 4, spec: "Trauma · Cardiac",    beds: { total: 420, free: 76 },  phone: "+971 2 610 0000", status: "Open" as const },
  { name: "Cleveland Clinic Abu Dhabi",  capacity: 64, incoming: 2, spec: "Cardiology · Neuro",  beds: { total: 364, free: 131 }, phone: "+971 2 659 0200", status: "Open" as const },
  { name: "Mafraq Hospital",             capacity: 91, incoming: 1, spec: "General",             beds: { total: 720, free: 65 },  phone: "+971 2 501 1111", status: "Divert" as const },
  { name: "Burjeel Medical City",        capacity: 55, incoming: 3, spec: "Trauma · Peds",       beds: { total: 400, free: 180 }, phone: "+971 2 508 5555", status: "Open" as const },
];

export const IFT = [
  { id: "IFT-2201", from: "Cleveland Clinic AD", to: "SKMC · Cath Lab",    when: "10:30", pt: "Cardiac transfer",   unit: "A-31", status: "Confirmed" as const, priority: "P2" as const },
  { id: "IFT-2202", from: "Burjeel Medical",     to: "Tawam · Oncology",   when: "11:15", pt: "Chemo follow-up",    unit: "—",    status: "Pending" as const,   priority: "P4" as const },
  { id: "IFT-2203", from: "Mafraq Hospital",     to: "SKMC · Neuro",       when: "12:00", pt: "Post-stroke",        unit: "—",    status: "Pending" as const,   priority: "P3" as const },
  { id: "IFT-2204", from: "Al Ain Hospital",     to: "SKMC · Trauma 2",    when: "13:45", pt: "Ortho referral",     unit: "A-08", status: "En route" as const,  priority: "P3" as const },
];

export const COMMS = [
  { id: "MSG-4401", from: "Dispatch · Sara Al Hosani", to: "Hospital · SKMC", at: "09:12", text: "STEMI activation for INC-8842. ETA 3 min. Cath lab needed.", kind: "alert" as const },
  { id: "MSG-4402", from: "Hospital · SKMC ER",        to: "Dispatch",        at: "09:14", text: "Cath lab 1 ready. Team notified.",                                kind: "ack" as const },
  { id: "MSG-4403", from: "Dispatch · Noura",          to: "Hospital · CCAD", at: "09:20", text: "Stroke alert INC-8838, ETA 6 min. Please pre-alert imaging.",   kind: "alert" as const },
  { id: "MSG-4404", from: "Hospital · CCAD",           to: "Dispatch",        at: "09:22", text: "Imaging queued. Neuro on standby.",                              kind: "ack" as const },
  { id: "MSG-4405", from: "Hospital · SKMC",           to: "Ops Command",     at: "09:30", text: "Bed capacity now at 82%, please divert non-urgent.",             kind: "update" as const },
];

export const ACTIVITY = [
  { at: "09:32", text: "INC-8842 (STEMI) handover accepted at Cath Lab 1", kind: "success" as const },
  { at: "09:28", text: "IFT-2204 dispatched from Al Ain → SKMC Trauma 2",  kind: "info" as const },
  { at: "09:20", text: "Stroke alert INC-8838 transmitted to CCAD",         kind: "alert" as const },
  { at: "09:14", text: "Cath Lab 1 confirmed ready by SKMC ER",             kind: "ack" as const },
  { at: "09:12", text: "STEMI activation sent from CAD → SKMC",             kind: "alert" as const },
  { at: "09:05", text: "Bed capacity update from Mafraq: 91% (Divert)",     kind: "warning" as const },
];

export const REPORTS = {
  daily: [
    { label: "Incoming patients", value: 62, delta: "+8" },
    { label: "Completed handovers", value: 47, delta: "+5" },
    { label: "Transfer requests", value: 12, delta: "+2" },
    { label: "Avg handover", value: "4:12", delta: "-0:18" },
  ],
  cases: [
    { type: "Cardiac", count: 14, share: 22 },
    { type: "Trauma", count: 18, share: 29 },
    { type: "Stroke", count: 7,  share: 11 },
    { type: "Respiratory", count: 9, share: 15 },
    { type: "Other", count: 14, share: 23 },
  ],
};

export const EPCR_SAMPLE = {
  patient: { name: "Khalid Al Nuaimi", gender: "M", dob: "1967-04-11", contact: "+971 50 442 0221" },
  incident: { number: "INC-8842", type: "Cardiac · STEMI", pickup: "Al Reem Island, Tower 3", dispatch: "09:04" },
  assessment: { primary: "Acute MI", complaint: "Central chest pain", condition: "Critical" },
  vitals: { bp: "90/60", hr: 140, rr: 24, temp: "36.9°C", spo2: "92%" },
  treatments: ["Oxygen 15L NRM", "IV access · L antecubital", "12-lead ECG", "Aspirin 300 mg PO"],
  medications: [
    { drug: "Aspirin",    dose: "300 mg",  route: "PO", time: "09:08" },
    { drug: "GTN spray",  dose: "400 mcg", route: "SL", time: "09:10" },
    { drug: "Morphine",   dose: "5 mg",    route: "IV", time: "09:13" },
  ],
  attachments: [
    { name: "12-lead ECG · STEMI anterior", type: "ECG" },
    { name: "Scene photo · patient position", type: "Image" },
  ],
  notes: "Patient conscious on arrival, chest pain 8/10. Improved to 4/10 post-morphine. Transported priority 1.",
  destination: "Cleveland Clinic Abu Dhabi · Cath Lab 1",
};
