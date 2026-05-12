/**
 * Shared travel data models and defaults.
 */

export interface Destination {
  id: string;
  name: string;
  image: string;
  duration: string;
  price: string;
  tags: string[];
  description: string;
  bestTimeToVisit?: string;
}

export type ItineraryDay = {
  day: number;
  title: string;
  details: string[];
};

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
}

export const DEFAULT_DESTINATIONS: Destination[] = [
  { id: "thailand", name: "Thailand", image: "/thailand.png", duration: "7N", price: "₹62,000", tags: ["Adventure", "Culture"], description: "Ancient temples, tropical beaches, and vibrant street food", bestTimeToVisit: "November to April" },
  { id: "dubai", name: "Dubai", image: "/dubai.png", duration: "5N", price: "₹81,500", tags: ["Luxury", "Adventure"], description: "Futuristic skyline, golden deserts, and world-class dining" },
  { id: "singapore", name: "Singapore", image: "/singapore.png", duration: "7N", price: "₹1,15,000", tags: ["Culture", "Luxury"], description: "Garden city wonders, hawker centers, and stunning architecture" },
  { id: "bali", name: "Bali", image: "/bali.png", duration: "5N", price: "₹45,000", tags: ["Relaxation", "Culture"], description: "Sacred temples, rice terraces, and serene spa retreats" },
  { id: "maldives", name: "Maldives", image: "/hero-bg.png", duration: "4N", price: "₹92,000", tags: ["Luxury", "Relaxation"], description: "Overwater villas, turquoise lagoons, and private island calm" },
  { id: "vietnam", name: "Vietnam", image: "/hero-bg.png", duration: "6N", price: "₹58,000", tags: ["Culture", "Adventure"], description: "Limestone bays, old quarters, and unforgettable local cuisine" },
  { id: "japan", name: "Japan", image: "/hero-bg.png", duration: "6N", price: "₹1,45,000", tags: ["Culture", "Luxury"], description: "Neon cities, mountain shrines, and iconic seasonal beauty" },
  { id: "europe", name: "Europe", image: "/hero-bg.png", duration: "8N", price: "₹1,68,000", tags: ["Luxury", "Culture"], description: "Multi-city classics with guided tours and premium stays" },
  { id: "spiti", name: "Spiti Valley", image: "/hero-bg.png", duration: "9N", price: "₹18,000", tags: ["Adventure", "Backpacking"], description: "The middle land between Tibet and India, a cold desert mountain valley", bestTimeToVisit: "May to October (Circuit), February (Winter)" },
  { id: "himachal", name: "Himachal Pradesh", image: "/hero-bg.png", duration: "6N", price: "₹13,500", tags: ["Backpacking", "Nature"], description: "Mist-covered mountains, lush valleys, and serene pine forests", bestTimeToVisit: "March to June, September to December" },
];

export const DEFAULT_PACKAGES: Package[] = [
  {
    id: "pkg-1",
    name: "4N Thailand",
    price: "₹45,000",
    durationNights: 4,
    highlights: ["4-Star Hotel", "Sightseeing", "Transfers", "Breakfast", "Activities"],
    image: "/thailand.png",
    destinationId: "thailand",
    sections: ["expert-picks", "adventures"],
    itinerary: [
      { day: 1, title: "Arrival & Check-in", details: ["Airport pickup", "Hotel check-in", "Evening at leisure"] },
      { day: 2, title: "City Highlights", details: ["Guided sightseeing", "Local markets", "Optional activities"] },
      { day: 3, title: "Island/Day Trip", details: ["Full-day excursion", "Transfers included"] },
      { day: 4, title: "Departure", details: ["Breakfast", "Checkout", "Drop to airport"] },
    ],
  },
  {
    id: "pkg-2",
    name: "4N Thai Ex-Blr",
    price: "₹52,000",
    durationNights: 4,
    highlights: ["Flights Included", "4-Star Hotel", "Transfers", "Breakfast", "City Tour"],
    image: "/thailand.png",
    destinationId: "thailand",
    sections: ["adventures", "explore-more"],
    itinerary: [
      { day: 1, title: "Fly & Arrive", details: ["Flights (as per schedule)", "Pickup & check-in"] },
      { day: 2, title: "Guided City Tour", details: ["Top attractions", "Evening free time"] },
      { day: 3, title: "Leisure / Add-ons", details: ["Optional experiences", "Relaxation"] },
      { day: 4, title: "Return", details: ["Checkout", "Airport transfer", "Fly back"] },
    ],
  },
  {
    id: "pkg-3",
    name: "5N Dubai",
    price: "₹81,500",
    durationNights: 5,
    highlights: ["5-Star Hotel", "Return Flights", "Desert Safari", "City Tour", "All Meals"],
    image: "/dubai.png",
    destinationId: "dubai",
    sections: ["expert-picks", "honeymoon"],
    itinerary: [
      { day: 1, title: "Arrival & Marina Evening", details: ["Airport pickup", "Check-in", "Dhow cruise (optional)"] },
      { day: 2, title: "Dubai City Tour", details: ["Landmarks & souks", "Photo stops", "Evening free"] },
      { day: 3, title: "Desert Safari", details: ["Dune bashing", "BBQ dinner", "Cultural shows"] },
      { day: 4, title: "Leisure Day", details: ["Shopping / theme parks (optional)"] },
      { day: 5, title: "Departure", details: ["Checkout", "Airport transfer"] },
    ],
  },
  {
    id: "pkg-4",
    name: "6N Bali",
    price: "₹55,000",
    durationNights: 6,
    highlights: ["Private Villa", "Spa Package", "Rice Terrace", "Breakfast", "Transfers"],
    image: "/bali.png",
    destinationId: "bali",
    sections: ["honeymoon", "explore-more"],
    itinerary: [
      { day: 1, title: "Arrival & Villa Check-in", details: ["Pickup", "Settle in", "Leisure"] },
      { day: 2, title: "Ubud & Rice Terraces", details: ["Scenic stops", "Local experiences"] },
      { day: 3, title: "Spa & Relaxation", details: ["Spa session", "Free time"] },
      { day: 4, title: "Beach Day", details: ["Coastline exploration", "Optional water sports"] },
      { day: 5, title: "Temple Visit", details: ["Iconic temples", "Sunset viewpoint"] },
      { day: 6, title: "Flight Back", details: ["Travel home"] },
    ],
  },
  {
    id: "pkg-spiti-winter",
    name: "Winter Spiti Trip",
    price: "₹18,000 + GST",
    durationNights: 8,
    highlights: ["Tempo Traveler", "Homestays", "All Meals", "Sightseeing", "Guided Tour"],
    image: "/hero-bg.png",
    destinationId: "spiti",
    sections: ["domestic", "adventures"],
    itinerary: [
      { day: 1, title: "Delhi to Shimla", details: ["Overnight travel"] },
      { day: 2, title: "Shimla to Kalpa", details: ["Scenic drive", "Apple orchards"] },
      { day: 3, title: "Kalpa to Nako/Tabo", details: ["Frozen landscapes"] },
      { day: 4, title: "Tabo to Kaza", details: ["Key Monastery", "Khibber"] },
      { day: 5, title: "Kaza Sightseeing", details: ["Hikkim", "Komic", "Langza"] },
      { day: 6, title: "Kaza to Pin Valley", details: ["Snow leopards", "Local culture"] },
      { day: 7, title: "Kaza to Kalpa", details: ["Descent", "Evening walk"] },
      { day: 8, title: "Kalpa to Shimla", details: ["Farewell dinner"] },
      { day: 9, title: "Shimla to Delhi", details: ["Morning arrival"] },
    ],
  },
  {
    id: "pkg-spiti-circuit",
    name: "Spiti Valley Circuit Trip",
    price: "₹23,000 + GST",
    durationNights: 9,
    highlights: ["9N Accommodations", "All Transfers", "Meals", "Inner Line Permit", "Oxygen Support"],
    image: "/hero-bg.png",
    destinationId: "spiti",
    sections: ["domestic", "expert-picks"],
    itinerary: [
      { day: 1, title: "Delhi to Manali", details: ["Overnight journey"] },
      { day: 2, title: "Manali Arrival", details: ["Rest & Acclimatization"] },
      { day: 3, title: "Manali to Chandratal", details: ["Rohtang Pass", "Camping"] },
      { day: 4, title: "Chandratal to Kaza", details: ["Kunzum Pass"] },
      { day: 5, title: "Kaza Local", details: ["Key Monastery", "Hikkim"] },
      { day: 6, title: "Kaza to Mudh (Pin Valley)", details: ["Scenic trek"] },
      { day: 7, title: "Mudh to Nako", details: ["Lake visit"] },
      { day: 8, title: "Nako to Kalpa", details: ["Kinnaur views"] },
      { day: 9, title: "Kalpa to Shimla", details: ["Long drive"] },
      { day: 10, title: "Shimla to Delhi", details: ["Return home"] },
    ],
  },
  {
    id: "pkg-himachal-backpacking",
    name: "Himachal Backpacking (Manali, Kasol, Jibhi)",
    price: "₹13,500 + GST",
    durationNights: 6,
    highlights: ["Delhi-Manali-Delhi Volvo", "Stays", "Breakfast & Dinner", "Sightseeing", "Trek to Kheerganga"],
    image: "/hero-bg.png",
    destinationId: "himachal",
    sections: ["domestic", "explore-more"],
    itinerary: [
      { day: 1, title: "Delhi to Manali", details: ["Evening departure"] },
      { day: 2, title: "Manali Arrival", details: ["Hadimba Temple", "Old Manali"] },
      { day: 3, title: "Manali Local", details: ["Solang Valley", "Vashisht"] },
      { day: 4, title: "Manali to Kasol", details: ["Parvati Valley", "Chhalal"] },
      { day: 5, title: "Kasol/Kheerganga", details: ["Trek", "Hot springs"] },
      { day: 6, title: "Kasol to Jibhi", details: ["Tirthan Valley", "Waterfall"] },
      { day: 7, title: "Jibhi to Delhi", details: ["Morning arrival"] },
    ],
  },
  {
    id: "pkg-5",
    name: "7N Singapore Cruise Malaysia",
    price: "₹1,15,000",
    durationNights: 7,
    highlights: ["4-Star Hotels", "Cruise Included", "City Tours", "Transfers", "Half Board"],
    image: "/singapore.png",
    destinationId: "singapore",
    sections: ["expert-picks", "adventures", "explore-more"],
    itinerary: [
      { day: 1, title: "Arrival Singapore", details: ["Airport pickup", "Check-in", "Evening walk"] },
      { day: 2, title: "Singapore City Tour", details: ["Must-see highlights", "Leisure time"] },
      { day: 3, title: "Embark Cruise", details: ["Transfer to port", "Cruise check-in"] },
      { day: 4, title: "Cruise Day", details: ["On-board activities", "Meals as per plan"] },
      { day: 5, title: "Malaysia Stop", details: ["Shore excursion (optional)"] },
      { day: 6, title: "Disembark & Free Day", details: ["Back to city", "Shopping / attractions"] },
      { day: 7, title: "Departure", details: ["Checkout", "Airport drop"] },
    ],
  },
];

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
