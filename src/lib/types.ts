export type Block =
  | { id: string; type: "hero"; title: string; text: string; buttonLabel: string; buttonHref: string }
  | { id: string; type: "heading"; text: string }
  | { id: string; type: "text"; text: string }
  | { id: string; type: "image"; url: string; caption: string }
  | { id: string; type: "file"; url: string; label: string }
  | { id: string; type: "button"; label: string; href: string }
  | { id: string; type: "routes" }
  | { id: string; type: "signup" };

export type BlockType = Block["type"];

export type Page = {
  id: string;
  title: string;
  slug: string;
  blocks: Block[];
  is_home: boolean;
  show_in_menu: boolean;
  menu_order: number;
  published: boolean;
  deleted_at: string | null;
  updated_at: string;
};

export type Route = {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  peaks: number;
  duration: string;
  distance: string;
  features: string[];
  illustration: string;
  trail_color: string;
  image_url: string;
  blocks: Block[];
  sort_order: number;
  published: boolean;
  deleted_at: string | null;
  updated_at: string;
};

export type Settings = {
  club_name: string;
  tagline: string;
  contact_email: string;
  contact_phone: string;
  postal_address: string;
  bank_recipient: string;
  bank_account: string;
  bank_name: string;
  declaration_pdf_url: string;
  declaration_pdf_name: string;
  fee: number;
  footer_text: string;
};

export type RegistrationStatus = "nowe" | "oplacone" | "anulowane";

export type Registration = {
  id: string;
  ref_code: string;
  route_id: string | null;
  route_title: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  amount: number;
  message: string;
  status: RegistrationStatus;
  declaration_received: boolean;
  paid_at: string | null;
  admin_notes: string;
  created_at: string;
};
