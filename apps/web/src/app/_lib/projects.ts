import type { Service, ServiceSlug } from "@/app/_lib/services";
import { SERVICES } from "@/app/_lib/services";
import type { PlaceKey } from "@/app/work/_lib/places";

/** A company site: navigation, a promise, one action, and the first row beneath the fold. */
export interface SiteScreen {
  kind: "site";
  nav: readonly string[];
  headline: string;
  text: string;
  action: string;
  features: readonly string[];
}

export interface Product {
  name: string;
  price: string;
}

/** A shop: the range, prices in francs, and Swiss payment at the till. */
export interface ShopScreen {
  kind: "shop";
  nav: readonly string[];
  headline: string;
  products: readonly Product[];
  action: string;
}

export type RowTone = "open" | "busy" | "done";

export interface AppRow {
  label: string;
  date: string;
  status: string;
  tone: RowTone;
}

/** A figure on an application's overview, as the drawn interface shows it. */
export interface AppStat {
  value: string;
  label: string;
}

/** An application: a sidebar, the week at a glance, one list of records with their state. */
export interface AppScreen {
  kind: "app";
  nav: readonly string[];
  headline: string;
  action: string;
  stats: readonly AppStat[];
  rows: readonly AppRow[];
}

/** What the built thing shows on its first screen, drawn in the project's cover. */
export type Screen = SiteScreen | ShopScreen | AppScreen;

export interface Project {
  slug: string;
  title: string;
  /** The client's trade, in a word or two. */
  sector: string;
  /** Where the client works. */
  town: string;
  year: number;
  /** What was built, in one line. Results and numbers only once they are real. */
  summary: string;
  services: readonly ServiceSlug[];
  /** The live site, when it is public. */
  url?: string;
  /** The photograph of the client's surroundings the work stands in front of. */
  place: PlaceKey;
  /** Hue of the client's own accent colour in the drawn interface. */
  accentHue: number;
  screen: Screen;
}

// TODO: placeholder projects — replace with real case studies and real screenshots (next/image)
// before lifting the Work noindex. Names, clients and the drawn interfaces are invented.
export const PROJECTS: readonly Project[] = [
  {
    slug: "alpstein-treuhand",
    title: "Alpstein Treuhand",
    sector: "Fiduciary",
    town: "St. Gallen",
    year: 2026,
    summary:
      "Relaunch with a clear service overview and online appointment booking.",
    services: ["websites", "design"],
    place: "st-gallen",
    accentHue: 255,
    screen: {
      kind: "site",
      nav: ["Leistungen", "Team", "Kontakt"],
      headline: "Treuhand für KMU in der Ostschweiz",
      text: "Buchhaltung, Steuern und Lohn – persönlich betreut, digital organisiert.",
      action: "Termin buchen",
      features: ["Buchhaltung", "Steuern", "Lohnadministration"],
    },
  },
  {
    slug: "rheintal-bikes",
    title: "Rheintal Bikes",
    sector: "Retail",
    town: "Buchs",
    year: 2026,
    summary:
      "Online shop with TWINT and click-and-collect for the local store.",
    services: ["shops"],
    place: "werdenberg",
    accentHue: 150,
    screen: {
      kind: "shop",
      nav: ["Velos", "E-Bikes", "Werkstatt"],
      headline: "Velos fürs Rheintal",
      products: [
        { name: "Gravel GX 2", price: "CHF 1’890.–" },
        { name: "City Classic", price: "CHF 980.–" },
        { name: "E-MTB Trail 7", price: "CHF 4’290.–" },
      ],
      action: "Mit TWINT bezahlen",
    },
  },
  {
    slug: "saentis-facility",
    title: "Säntis Facility",
    sector: "Facility management",
    town: "Gossau",
    year: 2026,
    summary: "Customer portal for service requests, schedules and invoices.",
    services: ["applications"],
    place: "saentis",
    accentHue: 235,
    screen: {
      kind: "app",
      nav: ["Übersicht", "Aufträge", "Einsätze", "Rechnungen"],
      headline: "Serviceaufträge",
      action: "Neuer Auftrag",
      stats: [
        { value: "12", label: "Offen" },
        { value: "5", label: "Diese Woche" },
        { value: "48", label: "Erledigt im Mai" },
      ],
      rows: [
        {
          label: "Heizung prüfen, Gossau",
          date: "Mo 16.6.",
          status: "In Arbeit",
          tone: "busy",
        },
        {
          label: "Liftwartung, Herisau",
          date: "Di 17.6.",
          status: "Geplant",
          tone: "open",
        },
        {
          label: "Fensterreinigung, Flawil",
          date: "Fr 13.6.",
          status: "Erledigt",
          tone: "done",
        },
        {
          label: "Treppenhaus, St. Gallen",
          date: "Fr 20.6.",
          status: "Geplant",
          tone: "open",
        },
        {
          label: "Lüftung, Uzwil",
          date: "Mi 11.6.",
          status: "Erledigt",
          tone: "done",
        },
      ],
    },
  },
  {
    slug: "toggenburg-tourismus",
    title: "Toggenburg Tourismus",
    sector: "Tourism",
    town: "Wildhaus",
    year: 2025,
    summary: "Multilingual site with an events calendar and seasonal content.",
    services: ["websites", "care"],
    place: "wildhaus",
    accentHue: 140,
    screen: {
      kind: "site",
      nav: ["Erleben", "Events", "DE · EN · FR"],
      headline: "Sommer unter den Churfirsten",
      text: "Wandern, Klangweg, Bergseen und Alpkäse – alle Events der Saison an einem Ort.",
      action: "Events ansehen",
      features: ["Klangweg", "Schwendiseen", "Chäserrugg"],
    },
  },
  {
    slug: "nova-dental",
    title: "Nova Dental",
    sector: "Dental practice",
    town: "Zürich",
    year: 2025,
    summary:
      "Brand refresh and a site that makes booking a check-up a two-minute job.",
    services: ["design", "websites"],
    place: "zurich",
    accentHue: 195,
    screen: {
      kind: "site",
      nav: ["Behandlungen", "Praxis", "Team"],
      headline: "Ihr Check-up, in zwei Minuten gebucht",
      text: "Freie Termine sehen, wählen, fertig. Die Praxis liegt am Limmatquai.",
      action: "Termin wählen",
      features: ["Kontrolle", "Dentalhygiene", "Notfall"],
    },
  },
  {
    slug: "walensee-charters",
    title: "Walensee Charters",
    sector: "Boat hire",
    town: "Weesen",
    year: 2025,
    summary:
      "Booking system with availability, deposits and automatic confirmations.",
    services: ["applications", "shops"],
    place: "walensee",
    accentHue: 215,
    screen: {
      kind: "app",
      nav: ["Kalender", "Buchungen", "Boote", "Kunden"],
      headline: "Buchungen im Juni",
      action: "Verfügbarkeit",
      stats: [
        { value: "9", label: "Boote frei" },
        { value: "23", label: "Buchungen" },
        { value: "3", label: "Anfragen" },
      ],
      rows: [
        {
          label: "Motorboot, 6 Personen",
          date: "Sa 14.6.",
          status: "Bestätigt",
          tone: "done",
        },
        {
          label: "Segelboot Lilly",
          date: "So 15.6.",
          status: "Anzahlung offen",
          tone: "busy",
        },
        {
          label: "Pedalo, 4 Personen",
          date: "Mi 18.6.",
          status: "Angefragt",
          tone: "open",
        },
        {
          label: "Motorboot, 8 Personen",
          date: "Sa 21.6.",
          status: "Bestätigt",
          tone: "done",
        },
        {
          label: "Segelboot Lilly",
          date: "So 22.6.",
          status: "Angefragt",
          tone: "open",
        },
      ],
    },
  },
  {
    slug: "bodensee-kanzlei",
    title: "Bodensee Kanzlei",
    sector: "Law firm",
    town: "Rorschach",
    year: 2025,
    summary: "Ongoing care: updates, security and monthly content changes.",
    services: ["care"],
    place: "rorschach",
    accentHue: 20,
    screen: {
      kind: "site",
      nav: ["Rechtsgebiete", "Anwälte", "Kontakt"],
      headline: "Anwaltskanzlei am Bodensee",
      text: "Vertragsrecht, Arbeitsrecht und Nachfolge für Unternehmen der Region.",
      action: "Kontakt aufnehmen",
      features: ["Vertragsrecht", "Arbeitsrecht", "Nachfolge"],
    },
  },
];

export const projectsFor = (slug: ServiceSlug): readonly Project[] =>
  PROJECTS.filter((project) => project.services.includes(slug));

/** A project's services in catalogue order, for its tags. */
export const servicesOf = (project: Project): readonly Service[] =>
  SERVICES.filter((service) => project.services.includes(service.slug));
