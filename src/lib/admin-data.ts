export const ADMIN_TABS = [
  { key: "dashboard",     label: "Dashboard",          path: "/portal/admin",                icon: "LayoutDashboard" },
  { key: "organizations", label: "Organizations",      path: "/portal/admin/organizations",  icon: "Building2" },
  { key: "users",         label: "User Management",    path: "/portal/admin/users",          icon: "Users" },
  { key: "roles",         label: "Roles & Permissions",path: "/portal/admin/roles",          icon: "ShieldCheck" },
  { key: "modules",       label: "Module Access",      path: "/portal/admin/modules",        icon: "LayoutGrid" },
  { key: "master",        label: "Master Data",        path: "/portal/admin/master",         icon: "Database" },
  { key: "workflow",      label: "Workflows",          path: "/portal/admin/workflow",       icon: "GitBranch" },
  { key: "notifications", label: "Notifications",      path: "/portal/admin/notifications",  icon: "Bell" },
  { key: "integrations",  label: "Integrations",       path: "/portal/admin/integrations",   icon: "Plug" },
  { key: "settings",      label: "System Settings",    path: "/portal/admin/settings",       icon: "Settings" },
  { key: "audit",         label: "Audit Logs",         path: "/portal/admin/audit",          icon: "FileClock" },
  { key: "reports",       label: "Admin Reports",      path: "/portal/admin/reports",        icon: "BarChart3" },
  { key: "profile",       label: "Profile & Security", path: "/portal/admin/profile",        icon: "UserCog" },
] as const;

export type AdminUserStatus = "Active" | "Inactive" | "Locked" | "Pending Approval" | "Suspended";

export interface AdminOrg {
  id: string;
  name: string;
  code: string;
  country: string;
  region: string;
  timezone: string;
  language: string;
  contact: string;
  phone: string;
  email: string;
  address: string;
  users: number;
  status: "Active" | "Inactive";
  createdAt: string;
}

export interface AdminUser {
  id: string;
  employeeId: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  designation: string;
  department: string;
  organization: string;
  branch: string;
  userType: "Internal" | "Contractor" | "Partner";
  role: string;
  status: AdminUserStatus;
  mfa: boolean;
  lastLogin: string;
  createdAt: string;
}

export interface AdminRole {
  id: string;
  name: string;
  description: string;
  organization: string;
  users: number;
  status: "Active" | "Archived";
  system: boolean;
}

export interface AuditEntry {
  id: string;
  ts: string;
  user: string;
  module: string;
  action: string;
  before: string;
  after: string;
  ip: string;
  device: string;
  browser: string;
}

export interface Integration {
  id: string;
  name: string;
  category: "Maps" | "Comms" | "Hospital" | "Payments" | "AI" | "Storage";
  endpoint: string;
  status: "Connected" | "Disconnected" | "Error";
  lastCheck: string;
  authMode: "API Key" | "OAuth" | "Basic" | "Bearer";
}

export interface NotificationRule {
  id: string;
  event: string;
  channels: { inApp: boolean; sms: boolean; email: boolean; push: boolean };
  audience: string;
  enabled: boolean;
}

export interface WorkflowStep {
  id: string;
  name: string;
  status: string;
  requiresApproval: boolean;
  mandatoryFields: string[];
}

export const ORGS: AdminOrg[] = [
  { id: "ORG-001", name: "RPM Holding — Abu Dhabi", code: "RPM-AUH", country: "UAE", region: "Abu Dhabi", timezone: "Asia/Dubai", language: "EN / AR", contact: "Fatima Al Suwaidi", phone: "+971 2 555 0100", email: "auh@rpm.ae", address: "Corniche Rd, Abu Dhabi", users: 214, status: "Active", createdAt: "01 Jan 2024" },
  { id: "ORG-002", name: "RPM Holding — Dubai",     code: "RPM-DXB", country: "UAE", region: "Dubai",     timezone: "Asia/Dubai", language: "EN / AR", contact: "Ahmed Al Marri",    phone: "+971 4 555 0200", email: "dxb@rpm.ae", address: "Business Bay, Dubai",   users: 176, status: "Active", createdAt: "12 Feb 2024" },
  { id: "ORG-003", name: "RPM Holding — Al Ain",    code: "RPM-AAN", country: "UAE", region: "Al Ain",    timezone: "Asia/Dubai", language: "EN / AR", contact: "Salem Al Ameri",    phone: "+971 3 555 0300", email: "aan@rpm.ae", address: "Al Jimi, Al Ain",      users: 82,  status: "Active", createdAt: "04 May 2024" },
  { id: "ORG-004", name: "RPM Holding — Sharjah",   code: "RPM-SHJ", country: "UAE", region: "Sharjah",   timezone: "Asia/Dubai", language: "EN / AR", contact: "Mona Al Kaabi",     phone: "+971 6 555 0400", email: "shj@rpm.ae", address: "Al Majaz, Sharjah",    users: 48,  status: "Inactive", createdAt: "20 Aug 2024" },
];

export const ADMIN_USERS: AdminUser[] = [
  { id: "U-1001", employeeId: "EMP-0021", name: "Fatima Al Suwaidi",   username: "f.suwaidi",  email: "f.suwaidi@rpm.ae",   phone: "+971 50 111 0011", designation: "Ops Manager",      department: "Operations",  organization: "RPM-AUH", branch: "HQ",           userType: "Internal",  role: "Operations Manager", status: "Active",          mfa: true,  lastLogin: "07 Jul 09:12", createdAt: "01 Jan 2024" },
  { id: "U-1002", employeeId: "EMP-0044", name: "Rashid Al Ameri",     username: "r.ameri",    email: "r.ameri@rpm.ae",     phone: "+971 50 111 0022", designation: "Dispatcher",       department: "Dispatch",    organization: "RPM-AUH", branch: "CAD Room 1",   userType: "Internal",  role: "Dispatcher",         status: "Active",          mfa: false, lastLogin: "07 Jul 08:44", createdAt: "18 Feb 2024" },
  { id: "U-1003", employeeId: "EMP-0087", name: "Nadia Al Zaabi",      username: "n.zaabi",    email: "n.zaabi@rpm.ae",     phone: "+971 50 111 0033", designation: "Fleet Manager",    department: "Fleet",       organization: "RPM-DXB", branch: "Depot A",      userType: "Internal",  role: "Fleet Manager",      status: "Active",          mfa: true,  lastLogin: "06 Jul 22:10", createdAt: "07 Mar 2024" },
  { id: "U-1004", employeeId: "EMP-0102", name: "Yusuf Al Mazrouei",   username: "y.mazrouei", email: "y.mazrouei@rpm.ae",  phone: "+971 50 111 0044", designation: "Paramedic",        department: "Field Ops",   organization: "RPM-AUH", branch: "Station 3",    userType: "Internal",  role: "Ambulance User",     status: "Active",          mfa: false, lastLogin: "07 Jul 07:03", createdAt: "22 Mar 2024" },
  { id: "U-1005", employeeId: "EMP-0119", name: "Aisha Al Qubaisi",    username: "a.qubaisi",  email: "a.qubaisi@rpm.ae",   phone: "+971 50 111 0055", designation: "Finance Officer",  department: "Finance",     organization: "RPM-AUH", branch: "HQ",           userType: "Internal",  role: "Finance User",       status: "Pending Approval",mfa: false, lastLogin: "—",            createdAt: "05 Jul 2026" },
  { id: "U-1006", employeeId: "EMP-0123", name: "Mohammed Al Hameli",  username: "m.hameli",   email: "m.hameli@rpm.ae",    phone: "+971 50 111 0066", designation: "Hospital Coord.",  department: "Hospital",    organization: "RPM-DXB", branch: "CCAD Liaison", userType: "Internal",  role: "Hospital Coordinator", status: "Active",       mfa: true,  lastLogin: "07 Jul 06:20", createdAt: "12 Apr 2024" },
  { id: "U-1007", employeeId: "EMP-0140", name: "Salim Al Ketbi",      username: "s.ketbi",    email: "s.ketbi@rpm.ae",     phone: "+971 50 111 0077", designation: "Crew Supervisor",  department: "Field Ops",   organization: "RPM-AAN", branch: "Al Ain HQ",    userType: "Internal",  role: "Crew Manager",       status: "Locked",          mfa: true,  lastLogin: "05 Jul 18:00", createdAt: "01 May 2024" },
  { id: "U-1008", employeeId: "EMP-0155", name: "Layla Al Zaabi",      username: "l.zaabi",    email: "l.zaabi@rpm.ae",     phone: "+971 50 111 0088", designation: "Analyst",          department: "Analytics",   organization: "RPM-AUH", branch: "HQ",           userType: "Contractor",role: "Reporting User",     status: "Inactive",        mfa: false, lastLogin: "22 Jun 11:44", createdAt: "10 May 2024" },
];

export const ADMIN_ROLES: AdminRole[] = [
  { id: "R-01", name: "Super Administrator",   description: "Full platform access",                    organization: "All",     users: 3,  status: "Active", system: true },
  { id: "R-02", name: "Operations Manager",    description: "Ops dashboard, calls, CAD, fleet, crew",  organization: "All",     users: 8,  status: "Active", system: true },
  { id: "R-03", name: "Dispatcher",            description: "Emergency Calls, CAD, Fleet/Crew (view)", organization: "All",     users: 32, status: "Active", system: true },
  { id: "R-04", name: "Fleet Manager",         description: "Fleet management, reports",               organization: "All",     users: 6,  status: "Active", system: true },
  { id: "R-05", name: "Crew Manager",          description: "Crew management, reports",                organization: "All",     users: 11, status: "Active", system: true },
  { id: "R-06", name: "Finance User",          description: "Finance & billing, reports",              organization: "All",     users: 9,  status: "Active", system: true },
  { id: "R-07", name: "Hospital Coordinator",  description: "Hospital coordination, ePCR (view)",      organization: "All",     users: 14, status: "Active", system: true },
  { id: "R-08", name: "Ambulance User",        description: "Mobile field app only",                   organization: "All",     users: 148,status: "Active", system: true },
  { id: "R-09", name: "Reporting User",        description: "Analytics & reports",                     organization: "All",     users: 5,  status: "Active", system: true },
  { id: "R-10", name: "Read Only User",        description: "Configured view-only access",             organization: "All",     users: 2,  status: "Active", system: true },
  { id: "R-11", name: "DXB Night Supervisor",  description: "Custom role — DXB night shift oversight", organization: "RPM-DXB", users: 2,  status: "Active", system: false },
];

export const ALL_MODULES = [
  "Dashboard","Emergency Calls","CAD","Dispatchers","Fleet","Crew","Field App","ePCR","Hospital","Finance","Analytics","Administration","Reports",
] as const;

export const PERMISSIONS = [
  "View","Create","Edit","Delete","Approve","Export","Print","Assign","Close","Reopen","Configure",
] as const;

// Default per-role module access matrix (checkboxes for grid).
export const MODULE_ACCESS: Record<string, Record<string, boolean>> = {
  "Super Administrator":  Object.fromEntries(ALL_MODULES.map((m) => [m, true])),
  "Operations Manager":   Object.fromEntries(ALL_MODULES.map((m) => [m, ["Dashboard","Emergency Calls","CAD","Dispatchers","Fleet","Crew","Reports","Analytics"].includes(m)])),
  "Dispatcher":           Object.fromEntries(ALL_MODULES.map((m) => [m, ["Dashboard","Emergency Calls","CAD","Fleet","Crew"].includes(m)])),
  "Fleet Manager":        Object.fromEntries(ALL_MODULES.map((m) => [m, ["Fleet","Reports","Analytics"].includes(m)])),
  "Crew Manager":         Object.fromEntries(ALL_MODULES.map((m) => [m, ["Crew","Reports"].includes(m)])),
  "Finance User":         Object.fromEntries(ALL_MODULES.map((m) => [m, ["Finance","Reports"].includes(m)])),
  "Hospital Coordinator": Object.fromEntries(ALL_MODULES.map((m) => [m, ["Hospital","ePCR","Reports"].includes(m)])),
  "Ambulance User":       Object.fromEntries(ALL_MODULES.map((m) => [m, ["Field App","ePCR"].includes(m)])),
  "Reporting User":       Object.fromEntries(ALL_MODULES.map((m) => [m, ["Analytics","Reports"].includes(m)])),
  "Read Only User":       Object.fromEntries(ALL_MODULES.map((m) => [m, ["Dashboard","Reports"].includes(m)])),
};

export const MASTER_DATA = {
  "Ambulance Types":  ["ALS", "BLS", "ICU", "Rapid Response", "Neonatal"],
  "Incident Types":   ["Trauma", "Cardiac", "Stroke", "Fire", "Transfer", "Obstetric", "Pediatric"],
  "Priority Levels":  ["P1 · Life threatening", "P2 · Urgent", "P3 · Non-urgent", "P4 · Scheduled"],
  "Crew Types":       ["Driver", "EMT", "Paramedic", "Nurse", "Doctor"],
  "Hospital Types":   ["Government", "Private", "Trauma Center", "Cardiac Center", "Pediatric"],
  "Service Categories":["Emergency", "Transfer", "Standby", "Home Care", "Event"],
};

export const WORKFLOW_STEPS: WorkflowStep[] = [
  { id: "W-1", name: "Emergency Call",     status: "Received",    requiresApproval: false, mandatoryFields: ["Caller name","Location","Chief complaint"] },
  { id: "W-2", name: "CAD Triage",         status: "Triaged",     requiresApproval: false, mandatoryFields: ["Priority","Incident type"] },
  { id: "W-3", name: "Crew Assignment",    status: "Assigned",    requiresApproval: false, mandatoryFields: ["Unit","Crew"] },
  { id: "W-4", name: "En Route",           status: "Enroute",     requiresApproval: false, mandatoryFields: ["Timestamp"] },
  { id: "W-5", name: "Arrived Scene",      status: "On Scene",    requiresApproval: false, mandatoryFields: ["Timestamp","GPS"] },
  { id: "W-6", name: "Transporting",       status: "Transporting",requiresApproval: false, mandatoryFields: ["Destination hospital","Patient vitals"] },
  { id: "W-7", name: "Hospital Handover",  status: "At Hospital", requiresApproval: true,  mandatoryFields: ["Handover clinician","ePCR"] },
  { id: "W-8", name: "Completed",          status: "Closed",      requiresApproval: false, mandatoryFields: ["Signature"] },
];

export const NOTIFICATION_RULES: NotificationRule[] = [
  { id: "N-1", event: "New dispatch created",   channels: { inApp: true,  sms: true,  email: false, push: true  }, audience: "Assigned crew, Ops",        enabled: true  },
  { id: "N-2", event: "Incident assigned",      channels: { inApp: true,  sms: true,  email: false, push: true  }, audience: "Assigned crew",             enabled: true  },
  { id: "N-3", event: "Shift reminder",         channels: { inApp: true,  sms: false, email: true,  push: true  }, audience: "All crew",                  enabled: true  },
  { id: "N-4", event: "Invoice generated",      channels: { inApp: true,  sms: false, email: true,  push: false }, audience: "Finance, Customer",         enabled: true  },
  { id: "N-5", event: "Hospital ETA alert",     channels: { inApp: true,  sms: true,  email: true,  push: false }, audience: "Hospital coordinator",      enabled: true  },
  { id: "N-6", event: "User created",           channels: { inApp: true,  sms: false, email: true,  push: false }, audience: "Super Admin, New user",     enabled: true  },
  { id: "N-7", event: "Password reset",         channels: { inApp: false, sms: true,  email: true,  push: false }, audience: "Requesting user",           enabled: true  },
  { id: "N-8", event: "Failed login (3x)",      channels: { inApp: true,  sms: false, email: true,  push: false }, audience: "Super Admin, Account owner",enabled: false },
];

export const INTEGRATIONS: Integration[] = [
  { id: "I-1", name: "Google Maps Platform", category: "Maps",     endpoint: "maps.googleapis.com/maps/api",   status: "Connected",    lastCheck: "07 Jul 09:00", authMode: "API Key" },
  { id: "I-2", name: "Fleet GPS Provider",   category: "Maps",     endpoint: "gps.rpm-fleet.internal/v2",      status: "Connected",    lastCheck: "07 Jul 09:00", authMode: "Bearer"  },
  { id: "I-3", name: "SMS Gateway (Etisalat)",category: "Comms",   endpoint: "smsapi.etisalat.ae/send",        status: "Connected",    lastCheck: "07 Jul 08:45", authMode: "API Key" },
  { id: "I-4", name: "SMTP · Office 365",    category: "Comms",    endpoint: "smtp.office365.com:587",         status: "Connected",    lastCheck: "07 Jul 08:30", authMode: "Basic"   },
  { id: "I-5", name: "CCAD Hospital HL7",    category: "Hospital", endpoint: "hl7.ccad.ae/mllp",               status: "Error",        lastCheck: "07 Jul 07:12", authMode: "OAuth"   },
  { id: "I-6", name: "SEHA ePCR API",        category: "Hospital", endpoint: "api.seha.ae/epcr/v1",            status: "Connected",    lastCheck: "07 Jul 08:00", authMode: "OAuth"   },
  { id: "I-7", name: "Telephony · Twilio",   category: "Comms",    endpoint: "api.twilio.com/2010-04-01",      status: "Connected",    lastCheck: "07 Jul 09:00", authMode: "API Key" },
  { id: "I-8", name: "AI Analytics Gateway", category: "AI",       endpoint: "ai.gateway.sisgain.ae",          status: "Connected",    lastCheck: "07 Jul 09:00", authMode: "Bearer"  },
  { id: "I-9", name: "Stripe Payments",      category: "Payments", endpoint: "api.stripe.com/v1",              status: "Disconnected", lastCheck: "—",            authMode: "API Key" },
];

export const AUDIT_LOG: AuditEntry[] = [
  { id: "A-9012", ts: "07 Jul 09:14:22", user: "f.suwaidi",  module: "Users",         action: "Update role",       before: "Dispatcher",       after: "Ops Manager",     ip: "10.1.4.22",  device: "MacBook Pro",  browser: "Chrome 130" },
  { id: "A-9011", ts: "07 Jul 09:03:10", user: "admin",      module: "Roles",         action: "Create role",       before: "—",                after: "DXB Night Supervisor", ip: "10.1.4.10", device: "MacBook Pro",  browser: "Chrome 130" },
  { id: "A-9010", ts: "07 Jul 08:47:55", user: "admin",      module: "Integrations",  action: "Rotate API key",    before: "sk_...9812",       after: "sk_...44a1",      ip: "10.1.4.10",  device: "MacBook Pro",  browser: "Chrome 130" },
  { id: "A-9009", ts: "07 Jul 08:22:41", user: "r.ameri",    module: "CAD",           action: "Assign ambulance",  before: "Unassigned",       after: "A-14",            ip: "10.1.4.31",  device: "Dispatch WS",  browser: "Edge 130"   },
  { id: "A-9008", ts: "07 Jul 08:04:12", user: "admin",      module: "Notifications", action: "Toggle rule",       before: "Enabled",          after: "Disabled",        ip: "10.1.4.10",  device: "MacBook Pro",  browser: "Chrome 130" },
  { id: "A-9007", ts: "07 Jul 07:55:03", user: "l.zaabi",    module: "Login",         action: "Failed login",      before: "—",                after: "Wrong password",  ip: "94.200.11.5",device: "iPhone 15",    browser: "Safari 17"  },
  { id: "A-9006", ts: "07 Jul 07:30:18", user: "admin",      module: "Master Data",   action: "Add value",         before: "—",                after: "Priority · P4",   ip: "10.1.4.10",  device: "MacBook Pro",  browser: "Chrome 130" },
  { id: "A-9005", ts: "07 Jul 06:58:44", user: "n.zaabi",    module: "Fleet",         action: "Deactivate vehicle",before: "Active · A-05",    after: "Maintenance",     ip: "10.1.7.44",  device: "Windows PC",   browser: "Edge 130"   },
];
