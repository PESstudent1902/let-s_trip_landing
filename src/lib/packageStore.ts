/**
 * Shared travel data models and defaults.
 */
import dbData from "./db.json";

export interface Destination {
  id: string;
  name: string;
  image: string;
  duration: string;
  price: string;
  tags: string[];
  description: string;
  bestTimeToVisit?: string;
  sections?: string[];
  order?: number;
}

export type ItineraryDay = {
  day: number;
  title: string;
  details: string[];
};

export const DESTINATION_SECTIONS = [
  { id: "expert-picks", label: "Expert Picks Itineraries", icon: "✦" },
  { id: "domestic", label: "Domestic Tours", icon: "🇮🇳" },
  { id: "explore", label: "Explore Destinations", icon: "🌍" },
] as const;

export const PACKAGE_SECTIONS = [
  { id: "expert-picks", label: "Expert Picks to Inspire You", icon: "✦" },
  { id: "adventures", label: "Adventures for You", icon: "🏔️" },
  { id: "honeymoon", label: "Honeymoon Special", icon: "💕" },
  { id: "domestic", label: "Domestic / Indian", icon: "🇮🇳" },
] as const;

export type PackageSectionId = typeof PACKAGE_SECTIONS[number]["id"];

export interface Package {
  id: string;
  name: string;
  price: string;
  highlights: string[]; // kept for backwards compatibility; used as inclusions/benefits in UI
  image: string;
  destinationId?: string;
  durationNights?: number;
  tags?: string[];
  itinerary?: ItineraryDay[];
  sections?: string[]; // which website sections this package appears in (multi-select)
  order?: number;
  type?: "domestic" | "international"; // CRM package classification
}

export const DEFAULT_DESTINATIONS: Destination[] = dbData.destinations as Destination[];

export const DEFAULT_PACKAGES: Package[] = dbData.packages as Package[];


export const GENERAL_DESTINATION_ID = "general";

export function slugifyDestinationName(name: string): string {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function inferDestinationIdFromPackage(pkg: Pick<Package, "name" | "image">, destinations: Destination[]): string {
  const byName = destinations.find((d) => pkg.name.toLowerCase().includes(d.name.toLowerCase()));
  if (byName) return byName.id;

  const byImage = destinations.find((d) => d.image === pkg.image);
  if (byImage) return byImage.id;

  return destinations[0]?.id || GENERAL_DESTINATION_ID;
}

// === Admin Auth ===
// Default password: "letstrip2026"

const ADMIN_PASSWORD_HASH = "d072f2d8c297fed0a7ba34c3fa16824d32b42bdc1080f66d950d60d39366519e";
const AUTH_KEY = "letstrip_admin_auth";
const AUTH_EXPIRY = 24 * 60 * 60 * 1000;

function getFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored) as T;
  } catch (error) {
    console.error(`Failed to read ${key} from localStorage:`, error);
  }
  return fallback;
}

function saveToStorage<T>(key: string, data: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Failed to save ${key} to localStorage:`, error);
  }
}

async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  const hash = await sha256(password);
  if (hash === ADMIN_PASSWORD_HASH) {
    saveToStorage(AUTH_KEY, { authenticated: true, timestamp: Date.now() });
    return true;
  }
  return false;
}

export function isAdminAuthenticated(): boolean {
  const session = getFromStorage<{ authenticated: boolean; timestamp: number } | null>(AUTH_KEY, null);
  if (!session) return false;
  if (Date.now() - session.timestamp > AUTH_EXPIRY) {
    if (typeof window !== "undefined") localStorage.removeItem(AUTH_KEY);
    return false;
  }
  return session.authenticated;
}

export function logoutAdmin(): void {
  if (typeof window !== "undefined") localStorage.removeItem(AUTH_KEY);
}

export const AVAILABLE_IMAGES = [
  { value: "/thailand.png", label: "Thailand" },
  { value: "/dubai.png", label: "Dubai" },
  { value: "/singapore.png", label: "Singapore" },
  { value: "/bali.png", label: "Bali" },
  { value: "/hero-bg.png", label: "Generic Travel" },
];

export const LOCAL_IMAGE_MAP: Record<string, string> = {
  thailand: "/thailand.png",
  phuket: "/thailand.png",
  krabi: "/thailand.png",
  pattaya: "/thailand.png",
  bangkok: "/thailand.png",
  france: "/france.png",
  egypt: "/egypt.png",
  casablanca: "/egypt.png",
  maldives: "/maldives.png",
  dubai: "/dubai.png",
  singapore: "/singapore.png",
  bali: "/bali.png",
  vietnam: "/vietnam.png",
  japan: "/japan.png",
  europe: "/interlaken.png",
  spiti: "/zermatt.png",
  "spiti valley": "/zermatt.png",
  himachal: "/paragliding.png",
  "himachal pradesh": "/paragliding.png",
  manali: "/paragliding.png",
  shimla: "/paragliding.png",
  sissu: "/paragliding.png",
  kasol: "/paragliding.png",
  manikaran: "/paragliding.png",
  ladakh: "/ladakh.png",
  kashmir: "/kashmir.png",
  srinagar: "/kashmir.png",
  pahalgam: "/kashmir.png",
  gulmarg: "/kashmir.png",
  sonmarg: "/kashmir.png",
  kerala: "/kerala.png",
  munnar: "/kerala.png",
  thekkady: "/kerala.png",
  alleppey: "/kerala.png",
  kochi: "/kerala.png",
  kovalam: "/kerala.png",
  trivandrum: "/kerala.png",
  goa: "/goa.png",
  rajasthan: "/rajasthan.png",
  jaipur: "/rajasthan.png",
  udaipur: "/rajasthan.png",
  jodhpur: "/rajasthan.png",
  jaisalmer: "/rajasthan.png",
  canada: "/canada.png",
  italy: "/italy.png",
  almaty: "/almaty.png",
  andaman: "/bali.png",
  portblair: "/bali.png",
  havelock: "/bali.png",
  sikkim: "/interlaken.png",
  darjeeling: "/interlaken.png",
  bhutan: "/interlaken.png",
  "sri lanka": "/bali.png",
  switzerland: "/interlaken.png",
  australia: "/singapore.png",
  turkey: "/egypt.png",
  greece: "/italy.png",
  mauritius: "/maldives.png",
};

export function findLocalImage(name: string): string {
  if (!name) return "/hero-bg.png";
  const lower = name.toLowerCase();
  for (const [key, val] of Object.entries(LOCAL_IMAGE_MAP)) {
    if (lower.includes(key)) return val;
  }
  return "/hero-bg.png";
}

