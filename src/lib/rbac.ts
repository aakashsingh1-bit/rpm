export type Role =
  | "super_admin"
  | "dispatcher"
  | "ops_manager"
  | "fleet_manager"
  | "crew_supervisor"
  | "ambulance_crew"
  | "hospital_coordinator"
  | "finance";

export type ModuleKey =
  | "dashboard"
  | "users"
  | "calls"
  | "cad"
  | "dispatchers"
  | "fleet"
  | "crew"
  | "mobile"
  | "epcr"
  | "hospital"
  | "billing"
  | "analytics"
  | "admin";

export interface RoleDef {
  key: Role;
  label: string;
  shortLabel: string;
  description: string;
  modules: ModuleKey[]; // permitted modules
}

// Super admin sees everything. Other roles are scoped per Annexure A §4.1 RBAC.
export const ROLES: Record<Role, RoleDef> = {
  super_admin: {
    key: "super_admin",
    label: "Super Administrator",
    shortLabel: "Super Admin",
    description: "Full platform control — all modules, users, configuration and audit.",
    modules: [
      "dashboard",
      "users",
      "calls",
      "cad",
      "dispatchers",
      "fleet",
      "crew",
      "mobile",
      "epcr",
      "hospital",
      "billing",
      "analytics",
      "admin",
    ],
  },
  ops_manager: {
    key: "ops_manager",
    label: "Operations Manager",
    shortLabel: "Ops Manager",
    description: "Command overview across dispatch, fleet, crew and analytics.",
    modules: ["dashboard", "calls", "cad", "dispatchers", "fleet", "analytics"],
  },
  dispatcher: {
    key: "dispatcher",
    label: "Emergency Dispatcher",
    shortLabel: "Dispatcher",
    description: "Call intake, incident triage and ambulance dispatch.",
    modules: ["dashboard", "calls", "cad"],
  },
  fleet_manager: {
    key: "fleet_manager",
    label: "Fleet Manager",
    shortLabel: "Fleet",
    description: "Vehicle registry, geofencing, equipment and maintenance.",
    modules: ["fleet", "analytics"],
  },
  crew_supervisor: {
    key: "crew_supervisor",
    label: "Crew Supervisor",
    shortLabel: "Crew",
    description: "Rosters, certifications, attendance and deployment.",
    modules: ["crew"],
  },

  ambulance_crew: {
    key: "ambulance_crew",
    label: "Ambulance Crew",
    shortLabel: "Field Crew",
    description: "Mobile field workflows: assignments, navigation, ePCR.",
    modules: ["dashboard", "mobile", "epcr"],
  },
  hospital_coordinator: {
    key: "hospital_coordinator",
    label: "Hospital Coordinator",
    shortLabel: "Hospital",
    description: "ETA notifications, digital handovers and IFT workflows.",
    modules: ["dashboard", "hospital", "epcr"],
  },
  finance: {
    key: "finance",
    label: "Finance Officer",
    shortLabel: "Finance",
    description: "Billing, invoicing, VAT and reconciliation.",
    modules: ["dashboard", "billing", "analytics"],
  },
};

export interface ModuleDef {
  key: ModuleKey;
  label: string;
  path: string;
  icon: string; // lucide icon name
  tagline: string;
  code: string; // FSD prefix like "CAD"
}

export const MODULES: Record<ModuleKey, ModuleDef> = {
  dashboard: {
    key: "dashboard",
    label: "Command Center",
    path: "/portal",
    icon: "LayoutDashboard",
    tagline: "Live operational overview",
    code: "OPS",
  },
  users: {
    key: "users",
    label: "Users & Access",
    path: "/portal/users",
    icon: "ShieldCheck",
    tagline: "RBAC, audit & compliance",
    code: "UM",
  },
  calls: {
    key: "calls",
    label: "Emergency Calls",
    path: "/portal/calls",
    icon: "PhoneCall",
    tagline: "Call intake & triage",
    code: "ECM",
  },
  cad: {
    key: "cad",
    label: "CAD Dispatch",
    path: "/portal/cad",
    icon: "Radio",
    tagline: "Computer aided dispatch",
    code: "CAD",
  },
  dispatchers: {
    key: "dispatchers",
    label: "Dispatchers",
    path: "/portal/dispatchers",
    icon: "Headphones",
    tagline: "Desk activity & 360° profiles",
    code: "DSP",
  },
  fleet: {
    key: "fleet",
    label: "Fleet",
    path: "/portal/fleet",
    icon: "Ambulance",
    tagline: "Vehicles, geofencing, maintenance",
    code: "FLT",
  },
  crew: {
    key: "crew",
    label: "Crew",
    path: "/portal/crew",
    icon: "Users",
    tagline: "Rosters, certifications, shifts",
    code: "CRW",
  },
  mobile: {
    key: "mobile",
    label: "Field App",
    path: "/portal/mobile",
    icon: "Smartphone",
    tagline: "Ambulance mobile workflows",
    code: "MOB",
  },
  epcr: {
    key: "epcr",
    label: "ePCR",
    path: "/portal/epcr",
    icon: "HeartPulse",
    tagline: "Electronic patient care records",
    code: "PCR",
  },
  hospital: {
    key: "hospital",
    label: "Hospital Coord.",
    path: "/portal/hospital",
    icon: "Building2",
    tagline: "Handovers & IFT",
    code: "HSP",
  },
  billing: {
    key: "billing",
    label: "Finance & Billing",
    path: "/portal/billing",
    icon: "Receipt",
    tagline: "Bills, invoices, payments, contracts & VAT",
    code: "FIN",
  },
  analytics: {
    key: "analytics",
    label: "Analytics & AI",
    path: "/portal/analytics",
    icon: "BarChart3",
    tagline: "Executive insights & recommendations",
    code: "AI",
  },
  admin: {
    key: "admin",
    label: "Super Admin",
    path: "/portal/admin",
    icon: "ShieldAlert",
    tagline: "Platform governance, RBAC, audit & configuration",
    code: "ADM",
  },
};

export const ROLE_LIST: RoleDef[] = Object.values(ROLES);
export const MODULE_LIST: ModuleDef[] = Object.values(MODULES);
