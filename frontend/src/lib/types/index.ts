export type Role = "customer" | "admin" | "superadmin";

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: Role;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type SpaceType = "event" | "office";
export type PriceUnit = "hour" | "day" | "month";
export type SpaceStatus = "active" | "inactive" | "maintenance";

export interface Space {
  id: number;
  name: string;
  slug: string;
  type: SpaceType;
  description: string | null;
  capacity: number;
  price: string;
  price_unit: PriceUnit;
  deposit_amount: string;
  location: string | null;
  amenities: string[] | null;
  images: string[] | null;
  status: SpaceStatus;
  created_at: string;
  updated_at: string;
}

export interface Equipment {
  id: number;
  name: string;
  description: string | null;
  price: string;
  stock: number;
  is_active: boolean;
}

export type BookingType = "event" | "office";
export type BookingStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "cancelled"
  | "completed";

export interface BookingEquipmentLine {
  id: number;
  name: string;
  price: string;
  pivot: { quantity: number; unit_price: string };
}

export interface CompanyProfile {
  id: number;
  booking_id: number;
  company_name: string;
  registration_number: string | null;
  contact_person: string;
  contact_phone: string;
  contact_email: string;
  address: string | null;
}

export interface DocumentFile {
  id: number;
  category: "business_license" | "id_card" | "contract" | "other";
  original_name: string;
  path: string;
  mime_type: string | null;
  size: number;
  created_at: string;
}

export interface Contract {
  id: number;
  booking_id: number;
  contract_number: string;
  terms: string;
  status: "pending_signature" | "signed" | "expired" | "cancelled";
  pdf_path: string | null;
  signed_by: number | null;
  signed_at: string | null;
  expiry_date: string | null;
  booking?: Booking;
}

export interface InvoiceItem {
  label: string;
  amount: number;
}

export interface Invoice {
  id: number;
  booking_id: number;
  invoice_number: string;
  issue_date: string;
  due_date: string;
  items: InvoiceItem[];
  subtotal: string;
  tax: string;
  total: string;
  status: "unpaid" | "partially_paid" | "paid" | "overdue" | "cancelled";
  booking?: Booking;
}

export type PaymentMethod =
  | "cash"
  | "bank_transfer"
  | "qr_payment"
  | "card"
  | "other";
export type PaymentType = "deposit" | "full" | "monthly" | "other";
export type PaymentStatus = "pending" | "confirmed" | "rejected";

export interface Payment {
  id: number;
  booking_id: number;
  invoice_id: number | null;
  payment_number: string;
  amount: string;
  currency: string;
  method: PaymentMethod;
  type: PaymentType;
  status: PaymentStatus;
  reference_note: string | null;
  proof_path: string | null;
  paid_at: string | null;
  created_at: string;
  booking?: Booking;
  invoice?: Invoice;
}

export interface Booking {
  id: number;
  booking_number: string;
  user_id: number;
  space_id: number;
  type: BookingType;
  start_date: string;
  end_date: string | null;
  start_time: string | null;
  end_time: string | null;
  attendees: number | null;
  purpose: string | null;
  status: BookingStatus;
  admin_note: string | null;
  space_price: string;
  equipment_price: string;
  total_price: string;
  deposit_amount: string;
  reviewed_by: number | null;
  reviewed_at: string | null;
  created_at: string;
  space?: Space;
  user?: User;
  equipment?: BookingEquipmentLine[];
  companyProfile?: CompanyProfile | null;
  documents?: DocumentFile[];
  contract?: Contract | null;
  invoices?: Invoice[];
  payments?: Payment[];
}

export interface Paginated<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface AppNotification {
  id: string;
  type: string;
  data: { type: string; message: string; [key: string]: unknown };
  read_at: string | null;
  created_at: string;
}

export interface DashboardStats {
  total_bookings: number;
  revenue: number;
  total_spaces: number;
  pending_bookings: number;
  booking_trend: { date: string; label: string; count: number }[];
  recent_bookings: Booking[];
}

export interface SystemSettings {
  site_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  tax_rate_percent: string | null;
  default_deposit_percent: string | null;
  booking_lead_time_hours: string | null;
  cancellation_window_hours: string | null;
  [key: string]: string | null;
}

export interface AuditLogEntry {
  id: number;
  user_id: number | null;
  action: string;
  description: string | null;
  ip_address: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  user?: User | null;
}
