export type CrewRole = "Paramedic · ALS" | "Paramedic · BLS" | "EMT · ALS" | "EMT · BLS" | "Driver" | "Supervisor";
export type Shift = "Day" | "Night" | "Off";
export type DutyStatus = "On duty" | "Off duty" | "Break" | "Leave" | "Training";

export interface Certification {
  name: string;
  issuer: string;
  issued: string; // ISO date
  expires: string; // ISO date
  status: "Valid" | "Expiring" | "Expired";
}

export interface Assignment {
  date: string;
  incident: string;
  unit: string;
  role: string;
  outcome: string;
}

export interface LeaveRequest {
  id: string;
  memberId: string;
  memberName: string;
  type: "Annual" | "Sick" | "Emergency" | "Training" | "Unpaid";
  from: string;
  to: string;
  days: number;
  status: "Pending" | "Approved" | "Denied";
  reason: string;
}

export interface CrewMember {
  id: string;
  employeeId: string;
  name: string;
  role: CrewRole;
  station: string;
  unit: string;
  shift: Shift;
  shiftHours: string;
  duty: DutyStatus;
  perf: number;
  attendance: number; // %
  phone: string;
  email: string;
  nationality: string;
  joined: string;
  supervisor: string;
  languages: string[];
  bloodType: string;
  emergencyContact: string;
  certifications: Certification[];
  assignments: Assignment[];
  leaveBalance: number;
  clockedInAt?: string;
  runsThisMonth: number;
  patientsThisMonth: number;
  onTime: number; // %
  avgResponse: string;
}

const today = new Date();
const iso = (offsetDays: number) => new Date(today.getTime() + offsetDays * 86400000).toISOString().slice(0, 10);

export const CREW: CrewMember[] = [
  {
    id: "rashid-al-ameri", employeeId: "EMS-1042", name: "Rashid Al Ameri", role: "Paramedic · ALS",
    station: "Abu Dhabi Central", unit: "A-14", shift: "Day", shiftHours: "07:00 – 19:00", duty: "On duty",
    perf: 96, attendance: 99, phone: "+971 50 111 2233", email: "r.alameri@rpm.ae", nationality: "UAE",
    joined: "2019-03-14", supervisor: "Mariam Al Blooshi", languages: ["Arabic", "English"], bloodType: "O+",
    emergencyContact: "Aisha Al Ameri · +971 50 999 1000",
    certifications: [
      { name: "ACLS", issuer: "AHA", issued: "2023-06-01", expires: iso(180), status: "Valid" },
      { name: "PHTLS", issuer: "NAEMT", issued: "2023-02-10", expires: iso(45), status: "Expiring" },
      { name: "UAE Paramedic License", issuer: "DoH Abu Dhabi", issued: "2022-08-20", expires: iso(400), status: "Valid" },
    ],
    assignments: [
      { date: iso(-1), incident: "INC-8842", unit: "A-14", role: "Lead paramedic", outcome: "Delivered · SKMC" },
      { date: iso(-2), incident: "INC-8801", unit: "A-14", role: "Lead paramedic", outcome: "Delivered · Cleveland" },
      { date: iso(-3), incident: "INC-8764", unit: "A-14", role: "Lead paramedic", outcome: "Refused transport" },
    ],
    leaveBalance: 18, clockedInAt: "06:52", runsThisMonth: 84, patientsThisMonth: 91, onTime: 98, avgResponse: "5:48",
  },
  {
    id: "fatima-yousif", employeeId: "EMS-1088", name: "Fatima Yousif", role: "EMT · BLS",
    station: "Abu Dhabi Central", unit: "A-14", shift: "Day", shiftHours: "07:00 – 19:00", duty: "On duty",
    perf: 91, attendance: 97, phone: "+971 50 222 3344", email: "f.yousif@rpm.ae", nationality: "Egypt",
    joined: "2021-01-05", supervisor: "Mariam Al Blooshi", languages: ["Arabic", "English", "French"], bloodType: "A+",
    emergencyContact: "Karim Yousif · +971 55 200 4400",
    certifications: [
      { name: "BLS Provider", issuer: "AHA", issued: "2024-01-11", expires: iso(300), status: "Valid" },
      { name: "EMT Certification", issuer: "DoH Abu Dhabi", issued: "2020-11-02", expires: iso(120), status: "Valid" },
    ],
    assignments: [
      { date: iso(-1), incident: "INC-8842", unit: "A-14", role: "EMT support", outcome: "Delivered · SKMC" },
      { date: iso(-2), incident: "INC-8801", unit: "A-14", role: "EMT support", outcome: "Delivered · Cleveland" },
    ],
    leaveBalance: 22, clockedInAt: "06:55", runsThisMonth: 84, patientsThisMonth: 90, onTime: 96, avgResponse: "5:52",
  },
  {
    id: "yusuf-al-marzooqi", employeeId: "EMS-1104", name: "Yusuf Al Marzooqi", role: "Paramedic · ALS",
    station: "Abu Dhabi Central", unit: "A-07", shift: "Day", shiftHours: "07:00 – 19:00", duty: "On duty",
    perf: 89, attendance: 96, phone: "+971 50 333 4455", email: "y.marzooqi@rpm.ae", nationality: "UAE",
    joined: "2018-09-11", supervisor: "Mariam Al Blooshi", languages: ["Arabic", "English"], bloodType: "B+",
    emergencyContact: "Nora Al Marzooqi · +971 50 888 2200",
    certifications: [
      { name: "ACLS", issuer: "AHA", issued: "2023-04-19", expires: iso(220), status: "Valid" },
      { name: "PALS", issuer: "AHA", issued: "2022-12-05", expires: iso(-14), status: "Expired" },
    ],
    assignments: [
      { date: iso(-1), incident: "INC-8841", unit: "A-07", role: "Lead paramedic", outcome: "Delivered · SKMC" },
    ],
    leaveBalance: 12, clockedInAt: "06:48", runsThisMonth: 78, patientsThisMonth: 85, onTime: 94, avgResponse: "6:04",
  },
  {
    id: "layla-hussein", employeeId: "EMS-1132", name: "Layla Hussein", role: "EMT · BLS",
    station: "Abu Dhabi Central", unit: "A-07", shift: "Day", shiftHours: "07:00 – 19:00", duty: "Break",
    perf: 84, attendance: 94, phone: "+971 50 444 5566", email: "l.hussein@rpm.ae", nationality: "Jordan",
    joined: "2021-05-22", supervisor: "Mariam Al Blooshi", languages: ["Arabic", "English"], bloodType: "AB+",
    emergencyContact: "Sami Hussein · +971 55 300 4400",
    certifications: [
      { name: "BLS Provider", issuer: "AHA", issued: "2023-10-01", expires: iso(25), status: "Expiring" },
    ],
    assignments: [
      { date: iso(-1), incident: "INC-8841", unit: "A-07", role: "EMT support", outcome: "Delivered · SKMC" },
    ],
    leaveBalance: 16, clockedInAt: "07:01", runsThisMonth: 71, patientsThisMonth: 76, onTime: 91, avgResponse: "6:12",
  },
  {
    id: "omar-saleh", employeeId: "EMS-1156", name: "Omar Saleh", role: "Paramedic · BLS",
    station: "Al Reem", unit: "A-22", shift: "Night", shiftHours: "19:00 – 07:00", duty: "Off duty",
    perf: 78, attendance: 92, phone: "+971 50 555 6677", email: "o.saleh@rpm.ae", nationality: "Syria",
    joined: "2020-02-17", supervisor: "Khalid Al Nuaimi", languages: ["Arabic", "English"], bloodType: "O-",
    emergencyContact: "Rana Saleh · +971 55 400 2200",
    certifications: [
      { name: "BLS Provider", issuer: "AHA", issued: "2024-03-11", expires: iso(500), status: "Valid" },
      { name: "UAE Driving · Cat 4", issuer: "AD Police", issued: "2019-06-01", expires: iso(200), status: "Valid" },
    ],
    assignments: [
      { date: iso(-1), incident: "INC-8802", unit: "A-22", role: "Lead paramedic", outcome: "Delivered · Mafraq" },
    ],
    leaveBalance: 9, runsThisMonth: 62, patientsThisMonth: 68, onTime: 88, avgResponse: "6:41",
  },
  {
    id: "mira-jamal", employeeId: "EMS-1178", name: "Mira Jamal", role: "EMT · ALS",
    station: "Corniche", unit: "A-31", shift: "Day", shiftHours: "07:00 – 19:00", duty: "On duty",
    perf: 92, attendance: 98, phone: "+971 50 666 7788", email: "m.jamal@rpm.ae", nationality: "Lebanon",
    joined: "2022-06-30", supervisor: "Mariam Al Blooshi", languages: ["Arabic", "English"], bloodType: "A-",
    emergencyContact: "Rami Jamal · +971 55 500 1100",
    certifications: [
      { name: "ACLS", issuer: "AHA", issued: "2024-02-01", expires: iso(400), status: "Valid" },
      { name: "PHTLS", issuer: "NAEMT", issued: "2023-08-14", expires: iso(210), status: "Valid" },
    ],
    assignments: [
      { date: iso(-1), incident: "INC-8839", unit: "A-31", role: "EMT support", outcome: "IFT complete" },
    ],
    leaveBalance: 20, clockedInAt: "06:44", runsThisMonth: 79, patientsThisMonth: 82, onTime: 97, avgResponse: "5:33",
  },
  {
    id: "ali-al-kaabi", employeeId: "EMS-1201", name: "Ali Al Kaabi", role: "Paramedic · ALS",
    station: "Corniche", unit: "A-31", shift: "Day", shiftHours: "07:00 – 19:00", duty: "On duty",
    perf: 88, attendance: 95, phone: "+971 50 777 8899", email: "a.kaabi@rpm.ae", nationality: "UAE",
    joined: "2019-11-04", supervisor: "Mariam Al Blooshi", languages: ["Arabic", "English"], bloodType: "B-",
    emergencyContact: "Hana Al Kaabi · +971 55 600 9900",
    certifications: [
      { name: "ACLS", issuer: "AHA", issued: "2023-09-01", expires: iso(150), status: "Valid" },
    ],
    assignments: [
      { date: iso(-1), incident: "INC-8839", unit: "A-31", role: "Lead paramedic", outcome: "IFT complete" },
    ],
    leaveBalance: 14, clockedInAt: "06:50", runsThisMonth: 74, patientsThisMonth: 78, onTime: 93, avgResponse: "5:58",
  },
  {
    id: "hamad-al-dhaheri", employeeId: "EMS-1225", name: "Hamad Al Dhaheri", role: "Paramedic · ALS",
    station: "Yas", unit: "A-09", shift: "Night", shiftHours: "19:00 – 07:00", duty: "Leave",
    perf: 85, attendance: 91, phone: "+971 50 888 9900", email: "h.dhaheri@rpm.ae", nationality: "UAE",
    joined: "2017-04-19", supervisor: "Khalid Al Nuaimi", languages: ["Arabic", "English"], bloodType: "O+",
    emergencyContact: "Salem Al Dhaheri · +971 55 700 1200",
    certifications: [
      { name: "ACLS", issuer: "AHA", issued: "2022-11-11", expires: iso(-30), status: "Expired" },
    ],
    assignments: [],
    leaveBalance: 4, runsThisMonth: 41, patientsThisMonth: 47, onTime: 89, avgResponse: "6:28",
  },
];

export const LEAVE_REQUESTS: LeaveRequest[] = [
  { id: "LV-2201", memberId: "hamad-al-dhaheri", memberName: "Hamad Al Dhaheri", type: "Annual", from: iso(-2), to: iso(8), days: 10, status: "Approved", reason: "Family holiday" },
  { id: "LV-2202", memberId: "layla-hussein", memberName: "Layla Hussein", type: "Sick", from: iso(3), to: iso(4), days: 2, status: "Pending", reason: "Medical appointment" },
  { id: "LV-2203", memberId: "omar-saleh", memberName: "Omar Saleh", type: "Emergency", from: iso(1), to: iso(1), days: 1, status: "Pending", reason: "Family emergency" },
  { id: "LV-2204", memberId: "yusuf-al-marzooqi", memberName: "Yusuf Al Marzooqi", type: "Training", from: iso(14), to: iso(16), days: 3, status: "Approved", reason: "ACLS refresher course" },
  { id: "LV-2205", memberId: "mira-jamal", memberName: "Mira Jamal", type: "Annual", from: iso(30), to: iso(37), days: 7, status: "Pending", reason: "Annual leave request" },
];

export const CREW_TABS = [
  { key: "dashboard", label: "Crew Dashboard", path: "/portal/crew", icon: "LayoutDashboard" },
  { key: "directory", label: "Directory", path: "/portal/crew/directory", icon: "Users" },
  { key: "roster", label: "Roster", path: "/portal/crew/roster", icon: "CalendarDays" },
  { key: "assignments", label: "Assignments", path: "/portal/crew/assignments", icon: "Ambulance" },
  { key: "attendance", label: "Attendance", path: "/portal/crew/attendance", icon: "Clock" },
  { key: "certifications", label: "Certifications", path: "/portal/crew/certifications", icon: "Award" },
  { key: "leave", label: "Leave", path: "/portal/crew/leave", icon: "Plane" },
  { key: "communications", label: "Broadcast", path: "/portal/crew/communications", icon: "MessageSquare" },
] as const;


export function getCrew(id: string) {
  return CREW.find((c) => c.id === id);
}

export function certStats() {
  const all = CREW.flatMap((c) => c.certifications.map((cert) => ({ ...cert, member: c.name, memberId: c.id })));
  return {
    all,
    valid: all.filter((c) => c.status === "Valid").length,
    expiring: all.filter((c) => c.status === "Expiring").length,
    expired: all.filter((c) => c.status === "Expired").length,
  };
}
