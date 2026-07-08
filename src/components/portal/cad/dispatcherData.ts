export type DispatcherStatus = "Available" | "On Call" | "Break" | "Offline";

export interface Dispatcher {
  id: string;
  name: string;
  station: string;
  status: DispatcherStatus;
  activeCall: string | null;
  callsToday: number;
  avgHandle: string; // mm:ss
  shift: string;
}

export const DISPATCHERS: Dispatcher[] = [
  { id: "D-01", name: "Sara Al Hosani",   station: "AD Central", status: "On Call",    activeCall: "MED-25-05124", callsToday: 42, avgHandle: "03:12", shift: "07:00 – 19:00" },
  { id: "D-02", name: "Yousef Al Marri",  station: "AD Central", status: "Available",  activeCall: null,           callsToday: 37, avgHandle: "02:58", shift: "07:00 – 19:00" },
  { id: "D-03", name: "Hind Al Zaabi",    station: "Al Ain",     status: "On Call",    activeCall: "MED-25-05123", callsToday: 29, avgHandle: "03:44", shift: "07:00 – 19:00" },
  { id: "D-04", name: "Rashid Al Ameri",  station: "Dubai Ops",  status: "Break",      activeCall: null,           callsToday: 24, avgHandle: "03:21", shift: "10:00 – 22:00" },
  { id: "D-05", name: "Mariam Al Blooshi",station: "AD Central", status: "Available",  activeCall: null,           callsToday: 31, avgHandle: "02:47", shift: "10:00 – 22:00" },
  { id: "D-06", name: "Omar Al Suwaidi",  station: "Al Ain",     status: "On Call",    activeCall: "MED-25-05122", callsToday: 18, avgHandle: "04:02", shift: "13:00 – 01:00" },
  { id: "D-07", name: "Layla Al Nuaimi",  station: "Dubai Ops",  status: "Offline",    activeCall: null,           callsToday: 0,  avgHandle: "—",     shift: "Off duty" },
];

export const STATUS_TONE: Record<DispatcherStatus, string> = {
  "Available": "bg-success/15 text-success border-success/30",
  "On Call":   "bg-destructive/15 text-destructive border-destructive/30",
  "Break":     "bg-warning/15 text-warning border-warning/30",
  "Offline":   "bg-muted text-muted-foreground border-border",
};
