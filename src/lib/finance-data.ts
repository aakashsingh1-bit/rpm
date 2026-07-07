export const FINANCE_TABS = [
  { key: "dashboard", label: "Finance Dashboard", path: "/portal/billing", icon: "LayoutDashboard" },
  { key: "billing", label: "Billing Management", path: "/portal/billing/billing", icon: "FileSpreadsheet" },
  { key: "invoices", label: "Invoice Management", path: "/portal/billing/invoices", icon: "FileText" },
  { key: "payments", label: "Payment Management", path: "/portal/billing/payments", icon: "Wallet" },
  { key: "customers", label: "Customers & Contracts", path: "/portal/billing/customers", icon: "Building2" },
  
  { key: "reports", label: "Financial Reports", path: "/portal/billing/reports", icon: "BarChart3" },
  { key: "settings", label: "Finance Settings", path: "/portal/billing/settings", icon: "Settings" },
] as const;

export type BillStatus = "Draft" | "Pending Approval" | "Approved" | "Invoiced";
export type InvoiceStatus = "Draft" | "Sent" | "Paid" | "Partial" | "Overdue" | "Cancelled";
export type PaymentStatus = "Pending" | "Partial" | "Paid" | "Overdue";

export interface Bill {
  id: string;
  incident: string;
  patient: string;
  unit: string;
  service: string;
  hospital: string;
  crew: string;
  distanceKm: number;
  epcrComplete: boolean;
  charges: {
    base: number;
    emergency: number;
    mileage: number;
    waiting: number;
    consumables: number;
    additional: number;
  };
  status: BillStatus;
  createdAt: string;
}

export interface Invoice {
  id: string;
  bill: string;
  customer: string;
  incident: string;
  date: string;
  due: string;
  subtotal: number;
  vat: number;
  discount: number;
  total: number;
  paid: number;
  status: InvoiceStatus;
  method: "Card" | "Bank" | "Cash" | "Insurance" | "Cheque";
}

export interface PaymentRow {
  id: string;
  invoice: string;
  customer: string;
  date: string;
  method: Invoice["method"];
  amount: number;
  outstanding: number;
  status: PaymentStatus;
}

export interface Customer {
  id: string;
  name: string;
  org: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  category: "Insurance" | "Corporate" | "Government" | "Private";
  contract: {
    number: string;
    from: string;
    to: string;
    pricing: string;
    services: string[];
    terms: string;
  };
  ytd: number;
  outstanding: number;
}

export const BILLS: Bill[] = [
  { id: "BILL-4501", incident: "INC-8842", patient: "Khalid Al Nuaimi",   unit: "A-14", service: "Emergency · STEMI",     hospital: "Cleveland Clinic Abu Dhabi",  crew: "Rashid Al Ameri",    distanceKm: 12, epcrComplete: true,  charges: { base: 850, emergency: 400, mileage: 96,  waiting: 0,   consumables: 220, additional: 0 },   status: "Pending Approval", createdAt: "05 Jul 09:44" },
  { id: "BILL-4500", incident: "INC-8841", patient: "Fatima Al Marri",    unit: "A-07", service: "Emergency · Cardiac",   hospital: "Sheikh Khalifa Medical City", crew: "Yusuf Al Mazrouei",  distanceKm: 9,  epcrComplete: true,  charges: { base: 850, emergency: 400, mileage: 72,  waiting: 60,  consumables: 140, additional: 0 },   status: "Approved",         createdAt: "05 Jul 08:12" },
  { id: "BILL-4499", incident: "INC-8840", patient: "Ahmed Al Suwaidi",   unit: "A-22", service: "Emergency · Trauma",    hospital: "Sheikh Khalifa Medical City", crew: "Omar Al Suwaidi",    distanceKm: 18, epcrComplete: true,  charges: { base: 850, emergency: 550, mileage: 144, waiting: 120, consumables: 380, additional: 0 },   status: "Invoiced",         createdAt: "04 Jul 21:30" },
  { id: "BILL-4498", incident: "INC-8839", patient: "Layla Al Zaabi",     unit: "A-31", service: "IFT · Post-op",         hospital: "Sheikh Khalifa Medical City", crew: "Ali Al Kaabi",       distanceKm: 24, epcrComplete: true,  charges: { base: 600, emergency: 0,   mileage: 192, waiting: 0,   consumables: 40,  additional: 80 },  status: "Invoiced",         createdAt: "04 Jul 18:05" },
  { id: "BILL-4497", incident: "INC-8838", patient: "Salim Al Ketbi",     unit: "A-19", service: "Emergency · Stroke",    hospital: "Cleveland Clinic Abu Dhabi",  crew: "Mohammed Al Hameli", distanceKm: 14, epcrComplete: false, charges: { base: 850, emergency: 400, mileage: 112, waiting: 30,  consumables: 180, additional: 0 },   status: "Draft",            createdAt: "04 Jul 16:22" },
];

export const INVOICES: Invoice[] = [
  { id: "INV-2026-3421", bill: "BILL-4499", customer: "Daman Insurance",     incident: "INC-8840", date: "05 Jul", due: "20 Jul", subtotal: 2044, vat: 102.2, discount: 0,   total: 2146.2,  paid: 2146.2, status: "Paid",     method: "Insurance" },
  { id: "INV-2026-3420", bill: "BILL-4498", customer: "Cleveland Clinic AD", incident: "INC-8839", date: "05 Jul", due: "20 Jul", subtotal: 912,  vat: 45.6,  discount: 0,   total: 957.6,   paid: 0,      status: "Sent",     method: "Bank" },
  { id: "INV-2026-3419", bill: "BILL-4488", customer: "Adnoc Corporate",     incident: "INC-8834", date: "04 Jul", due: "19 Jul", subtotal: 11857, vat: 592.85, discount: 200, total: 12249.85, paid: 12249.85, status: "Paid", method: "Bank" },
  { id: "INV-2026-3418", bill: "BILL-4485", customer: "Private · A. Rashid", incident: "INC-8831", date: "01 Jul", due: "16 Jul", subtotal: 743,  vat: 37.15, discount: 0,   total: 780.15,  paid: 200,    status: "Partial",  method: "Card" },
  { id: "INV-2026-3417", bill: "BILL-4482", customer: "SEHA",                incident: "INC-8828", date: "01 Jul", due: "16 Jul", subtotal: 7924, vat: 396.2, discount: 0,   total: 8320.2,  paid: 8320.2, status: "Paid",     method: "Bank" },
  { id: "INV-2026-3416", bill: "BILL-4479", customer: "Al Ain Municipality", incident: "INC-8821", date: "29 Jun", due: "14 Jul", subtotal: 3120, vat: 156,   discount: 0,   total: 3276,    paid: 0,      status: "Overdue",  method: "Bank" },
];

export const PAYMENTS: PaymentRow[] = [
  { id: "PAY-9012", invoice: "INV-2026-3421", customer: "Daman Insurance",     date: "05 Jul", method: "Insurance", amount: 2146.2,  outstanding: 0,       status: "Paid" },
  { id: "PAY-9011", invoice: "INV-2026-3419", customer: "Adnoc Corporate",     date: "04 Jul", method: "Bank",      amount: 12249.85, outstanding: 0,      status: "Paid" },
  { id: "PAY-9010", invoice: "INV-2026-3418", customer: "Private · A. Rashid", date: "02 Jul", method: "Card",      amount: 200,     outstanding: 580.15, status: "Partial" },
  { id: "PAY-9009", invoice: "INV-2026-3417", customer: "SEHA",                date: "01 Jul", method: "Bank",      amount: 8320.2,  outstanding: 0,      status: "Paid" },
  { id: "PAY-9008", invoice: "INV-2026-3416", customer: "Al Ain Municipality", date: "—",      method: "Bank",      amount: 0,       outstanding: 3276,   status: "Overdue" },
  { id: "PAY-9007", invoice: "INV-2026-3420", customer: "Cleveland Clinic AD", date: "—",      method: "Bank",      amount: 0,       outstanding: 957.6,  status: "Pending" },
];

export const CUSTOMERS: Customer[] = [
  { id: "CUS-101", name: "Daman Insurance", org: "Daman National Health Insurance", contact: "Mona Al Hashimi", email: "billing@damanhealth.ae", phone: "+971 2 614 9999", address: "Muroor Road, Abu Dhabi", category: "Insurance", contract: { number: "CN-2025-014", from: "01 Jan 2025", to: "31 Dec 2026", pricing: "Preferred rate card v3", services: ["Emergency", "IFT", "Event standby"], terms: "Net 15 · e-invoice" }, ytd: 184500, outstanding: 0 },
  { id: "CUS-102", name: "Cleveland Clinic Abu Dhabi", org: "CCAD Hospital", contact: "Nadia Al Suwaidi", email: "ap@clevelandclinic.ae", phone: "+971 2 659 0200", address: "Al Maryah Island, AD", category: "Corporate", contract: { number: "CN-2025-022", from: "01 Mar 2025", to: "28 Feb 2027", pricing: "IFT tariff A", services: ["IFT", "Discharge"], terms: "Net 30" }, ytd: 96240, outstanding: 957.6 },
  { id: "CUS-103", name: "Adnoc Corporate", org: "ADNOC Group HSE", contact: "Hassan Al Mansoori", email: "hse.billing@adnoc.ae", phone: "+971 2 707 0000", address: "Corniche Road, AD", category: "Corporate", contract: { number: "CN-2025-031", from: "01 Feb 2025", to: "31 Jan 2027", pricing: "Onsite standby retainer", services: ["Event standby", "Emergency"], terms: "Net 30 · monthly consolidated" }, ytd: 214800, outstanding: 0 },
  { id: "CUS-104", name: "SEHA", org: "Abu Dhabi Health Services", contact: "Aisha Al Qubaisi", email: "finance@seha.ae", phone: "+971 2 410 2000", address: "Al Karamah, AD", category: "Government", contract: { number: "CN-2024-002", from: "01 Jan 2024", to: "31 Dec 2026", pricing: "Government tariff", services: ["All"], terms: "Net 45" }, ytd: 402180, outstanding: 0 },
  { id: "CUS-105", name: "Al Ain Municipality", org: "Al Ain City Municipality", contact: "Salem Al Ameri", email: "ap@am.gov.ae", phone: "+971 3 763 8888", address: "Al Ain", category: "Government", contract: { number: "CN-2025-045", from: "01 Apr 2025", to: "31 Mar 2027", pricing: "Standard tariff", services: ["Event standby"], terms: "Net 30" }, ytd: 18960, outstanding: 3276 },
  { id: "CUS-106", name: "Private · A. Rashid", org: "Individual patient", contact: "Ahmed Rashid", email: "a.rashid@mail.ae", phone: "+971 50 442 0221", address: "Al Reem Island", category: "Private", contract: { number: "—", from: "—", to: "—", pricing: "Retail card", services: ["Emergency"], terms: "Immediate" }, ytd: 780, outstanding: 580.15 },
];

export const REVENUE_BREAKDOWN = {
  byService: [
    { label: "Emergency response", value: 62, amount: 265360 },
    { label: "Inter-facility transfer", value: 18, amount: 77040 },
    { label: "Event standby", value: 14, amount: 59920 },
    { label: "Consumables & meds", value: 6, amount: 25680 },
  ],
  byCustomer: [
    { label: "SEHA", value: 34 },
    { label: "Daman Insurance", value: 22 },
    { label: "Adnoc Corporate", value: 18 },
    { label: "Cleveland Clinic AD", value: 12 },
    { label: "Other", value: 14 },
  ],
  byStatus: [
    { label: "Paid", value: 71 },
    { label: "Pending", value: 18 },
    { label: "Overdue", value: 8 },
    { label: "Draft", value: 3 },
  ],
};

export const FINANCE_ALERTS = [
  { kind: "warning" as const, text: "3 bills pending approval > 24h" },
  { kind: "danger"  as const, text: "AED 14k overdue past 30 days" },
  { kind: "info"    as const, text: "1 invoice missing VAT reference" },
  { kind: "warning" as const, text: "BILL-4497 missing ePCR — cannot invoice" },
];

export const FINANCE_SETTINGS = {
  serviceCharges: [
    { code: "SVC-EM",  label: "Emergency response (base)", price: 850, unit: "per call" },
    { code: "SVC-IFT", label: "Inter-facility transfer (base)", price: 600, unit: "per call" },
    { code: "SVC-EVT", label: "Event standby (hourly)", price: 320, unit: "per hour" },
    { code: "SVC-STB", label: "Standby retainer (daily)", price: 4200, unit: "per day" },
  ],
  ambulanceCharges: [
    { code: "AMB-ALS", label: "Advanced Life Support unit",  price: 400, unit: "per activation" },
    { code: "AMB-BLS", label: "Basic Life Support unit",     price: 250, unit: "per activation" },
    { code: "AMB-MIL", label: "Mileage",                     price: 8,   unit: "per km" },
    { code: "AMB-WAIT",label: "Waiting charge",              price: 60,  unit: "per 15 min" },
  ],
  tax: { vat: 5, jurisdiction: "UAE FTA", trn: "100234567800003" },
  invoiceFormat: "INV-YYYY-####",
  paymentMethods: ["Card", "Bank transfer", "Cash", "Insurance", "Cheque"],
  customerCategories: ["Insurance", "Corporate", "Government", "Private"],
  contractTypes: ["Retainer", "Per-service", "Tariff", "Volume-based"],
};

export function billTotal(b: Bill) {
  const c = b.charges;
  return c.base + c.emergency + c.mileage + c.waiting + c.consumables + c.additional;
}

export function money(n: number) {
  return `AED ${n.toLocaleString("en-AE", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}
