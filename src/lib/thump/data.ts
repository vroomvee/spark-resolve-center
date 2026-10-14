import { BellRing, Droplets, FireExtinguisher, Waves, PanelsTopLeft, Wrench } from "lucide-react";

export const services = [
  {
    name: "Fire alarm systems",
    icon: BellRing,
    text: "Early detection. Immediate response.",
    description: "Installation, inspection and maintenance of fire detection and alarm systems.",
  },
  {
    name: "Hydrants & pumps",
    icon: Droplets,
    text: "Built for critical moments.",
    description: "Dependable hydrant networks and fire pump systems, maintained for readiness.",
  },
  {
    name: "Fire extinguishers",
    icon: FireExtinguisher,
    text: "Your first line of defence.",
    description: "Supply, inspection and servicing of portable fire extinguishers.",
  },
  {
    name: "Sprinkler systems",
    icon: Waves,
    text: "Protection that responds.",
    description: "Automatic fire suppression systems with ongoing inspection and support.",
  },
  {
    name: "Fire curtains",
    icon: PanelsTopLeft,
    text: "Contain fire. Protect spaces.",
    description: "Fire curtain consultation, installation and maintenance for your building.",
  },
  {
    name: "Maintenance services",
    icon: Wrench,
    text: "Readiness is a continuous effort.",
    description: "Preventive maintenance and service support for your fire safety equipment.",
  },
];
export const categories = [
  "Fire alarm panels",
  "Hydrants",
  "Fire extinguishers",
  "Sprinkler systems",
  "Fire pumps",
  "Fire curtains",
  "Other fire safety equipment",
] as const;
export const statuses = [
  "New",
  "Under Review",
  "Scheduled",
  "In Progress",
  "Awaiting Parts",
  "Resolved",
  "Closed",
] as const;
export type Ticket = {
  id: string;
  title: string;
  site: string;
  asset: string;
  category: string;
  description: string;
  priority: string;
  status: (typeof statuses)[number];
  date: string;
  visit?: string | undefined;
  photo?: string | undefined;
  history: { status: string; date: string; note: string }[];
};
export const sites = ["Demo — Orion Business Park", "Demo — Cedar Heights"] as const;
export const assets = [
  { id: "FAP-01", site: sites[0], name: "Main fire alarm panel", category: categories[0] },
  { id: "PMP-02", site: sites[0], name: "Basement fire pump", category: categories[4] },
  { id: "EXT-08", site: sites[1], name: "Lobby fire extinguisher", category: categories[2] },
];
export const demoTickets: Ticket[] = [
  {
    id: "DEMO-1042",
    title: "Intermittent fault on main alarm panel",
    site: sites[0],
    asset: "FAP-01",
    category: categories[0],
    description:
      "The main fire alarm panel intermittently shows a zone fault. Please inspect the panel and connected devices.",
    priority: "High",
    status: "Scheduled",
    date: "12 Oct 2026",
    visit: "16 Oct 2026",
    history: [
      { status: "New", date: "12 Oct 2026 · 09:20", note: "Demo request created." },
      {
        status: "Under Review",
        date: "12 Oct 2026 · 11:45",
        note: "Demo request reviewed by the service team.",
      },
      {
        status: "Scheduled",
        date: "13 Oct 2026 · 10:00",
        note: "Fictional visit scheduled for 16 October.",
      },
    ],
  },
  {
    id: "DEMO-1041",
    title: "Fire pump pressure fluctuation",
    site: sites[0],
    asset: "PMP-02",
    category: categories[4],
    description: "Pressure fluctuates during routine testing of the basement fire pump.",
    priority: "High",
    status: "In Progress",
    date: "10 Oct 2026",
    history: [
      { status: "New", date: "10 Oct 2026", note: "Demo request created." },
      { status: "In Progress", date: "12 Oct 2026", note: "Fictional inspection in progress." },
    ],
  },
  {
    id: "DEMO-1038",
    title: "Extinguisher inspection",
    site: sites[1],
    asset: "EXT-08",
    category: categories[2],
    description: "Routine inspection of the lobby fire extinguisher.",
    priority: "Normal",
    status: "Resolved",
    date: "07 Oct 2026",
    history: [
      { status: "New", date: "07 Oct 2026", note: "Demo request created." },
      {
        status: "Resolved",
        date: "09 Oct 2026",
        note: "Fictional equipment inspection completed.",
      },
    ],
  },
];
export function pageHead(title: string, description: string) {
  return {
    meta: [
      { title: `${title} | THUMP Services & Solutions` },
      { name: "description", content: description },
      { property: "og:title", content: `${title} | THUMP` },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  };
}
