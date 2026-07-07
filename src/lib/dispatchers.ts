export interface DispatcherCall {
  id: string;
  time: string;
  caller: string;
  location: string;
  type: string;
  priority: "P1" | "P2" | "P3" | "P4";
  duration: string;
  outcome: "Dispatched" | "Advice" | "Transferred" | "Hoax";
  incident?: string;
}

export interface Dispatcher {
  id: string;
  name: string;
  location: string;
  desk: string;
  status: "On call" | "Available" | "Break" | "Offline";
  calls: number;
  active: string;
  channel: string;
  shiftStart: string;
  shiftEnd: string;
  phone: string;
  email: string;
  employeeId: string;
  certifications: string[];
  avgHandle: string;
  totalToday: number;
  languages: string[];
  supervisor: string;
  recentCalls: DispatcherCall[];
}

export const DISPATCHERS: Dispatcher[] = [
  {
    id: "sara-al-hosani",
    name: "Sara Al Hosani",
    location: "Abu Dhabi Central",
    desk: "Desk 3",
    status: "On call",
    calls: 42,
    active: "INC-8842",
    channel: "TAC-1",
    shiftStart: "07:00",
    shiftEnd: "19:00",
    phone: "+971 50 123 4567",
    email: "s.alhosani@rpm.ae",
    employeeId: "DSP-0031",
    certifications: ["EMD Certified", "APCO", "Crisis Comms L2"],
    avgHandle: "2:14",
    totalToday: 42,
    languages: ["English", "Arabic"],
    supervisor: "Omar Al Suwaidi",
    recentCalls: [
      { id: "CL-11288", time: "14:42", caller: "Mohammed A.", location: "Yas Marina", type: "Cardiac arrest", priority: "P1", duration: "3:12", outcome: "Dispatched", incident: "INC-8842" },
      { id: "CL-11284", time: "14:11", caller: "Anonymous", location: "Corniche Road", type: "RTA", priority: "P2", duration: "2:48", outcome: "Dispatched", incident: "INC-8836" },
      { id: "CL-11279", time: "13:47", caller: "Fatima K.", location: "Marina Mall", type: "Fall injury", priority: "P3", duration: "1:52", outcome: "Advice" },
      { id: "CL-11271", time: "13:22", caller: "Reception SKMC", location: "SKMC", type: "IFT request", priority: "P3", duration: "2:04", outcome: "Transferred" },
    ],
  },
  {
    id: "mariam-al-blooshi",
    name: "Mariam Al Blooshi",
    location: "Abu Dhabi Central",
    desk: "Desk 5",
    status: "On call",
    calls: 38,
    active: "INC-8840",
    channel: "TAC-2",
    shiftStart: "07:00",
    shiftEnd: "19:00",
    phone: "+971 50 234 5678",
    email: "m.alblooshi@rpm.ae",
    employeeId: "DSP-0044",
    certifications: ["EMD Certified", "Trauma Triage"],
    avgHandle: "2:31",
    totalToday: 38,
    languages: ["English", "Arabic", "Urdu"],
    supervisor: "Omar Al Suwaidi",
    recentCalls: [
      { id: "CL-11290", time: "14:51", caller: "Hassan B.", location: "SZR km 42", type: "Polytrauma", priority: "P2", duration: "4:02", outcome: "Dispatched", incident: "INC-8840" },
      { id: "CL-11283", time: "14:05", caller: "Anonymous", location: "Al Reem", type: "Chest pain", priority: "P1", duration: "2:12", outcome: "Dispatched" },
      { id: "CL-11276", time: "13:40", caller: "Layla M.", location: "Khalidiya", type: "Diabetic emergency", priority: "P2", duration: "3:18", outcome: "Dispatched" },
    ],
  },
  {
    id: "ahmed-al-balushi",
    name: "Ahmed Al Balushi",
    location: "Dubai Ops",
    desk: "Desk 1",
    status: "Available",
    calls: 27,
    active: "—",
    channel: "TAC-3",
    shiftStart: "07:00",
    shiftEnd: "19:00",
    phone: "+971 50 345 6789",
    email: "a.albalushi@rpm.ae",
    employeeId: "DSP-0052",
    certifications: ["EMD Certified"],
    avgHandle: "2:48",
    totalToday: 27,
    languages: ["English", "Arabic"],
    supervisor: "Layla Al Marri",
    recentCalls: [
      { id: "CL-11282", time: "14:03", caller: "Ali R.", location: "Downtown Dubai", type: "Elderly fall", priority: "P3", duration: "1:40", outcome: "Advice" },
      { id: "CL-11268", time: "13:12", caller: "Anonymous", location: "Business Bay", type: "Faint", priority: "P3", duration: "2:22", outcome: "Dispatched" },
    ],
  },
  {
    id: "noura-al-suwaidi",
    name: "Noura Al Suwaidi",
    location: "Sharjah Ops",
    desk: "Desk 2",
    status: "Break",
    calls: 19,
    active: "—",
    channel: "—",
    shiftStart: "07:00",
    shiftEnd: "19:00",
    phone: "+971 50 456 7890",
    email: "n.alsuwaidi@rpm.ae",
    employeeId: "DSP-0067",
    certifications: ["EMD Certified", "APCO"],
    avgHandle: "3:02",
    totalToday: 19,
    languages: ["English", "Arabic"],
    supervisor: "Layla Al Marri",
    recentCalls: [
      { id: "CL-11265", time: "12:58", caller: "Ahmed S.", location: "Al Nahda", type: "Asthma", priority: "P2", duration: "2:34", outcome: "Dispatched" },
    ],
  },
];

export function getDispatcher(id: string) {
  return DISPATCHERS.find((d) => d.id === id);
}
