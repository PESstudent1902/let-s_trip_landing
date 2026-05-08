/**
 * Package Store — localStorage-based data layer for LetsTrip
 * 
 * This module provides CRUD operations for destinations and packages.
 * Data persists in localStorage with hardcoded defaults as fallback.
 * The admin panel writes to this store; the main website reads from it.
 */

export interface Destination {
  id: string;
  name: string;
  image: string;
  duration: string;
  price: string;
  tags: string[];
  description: string;
}

export interface Package {
  id: string;
  name: string;
  price: string;
  highlights: string[];
  image: string;
}

// === Default Data (matches current hardcoded values exactly) ===

export const DEFAULT_DESTINATIONS: Destination[] = [
  { id: "dest-1", name: "Thailand", image: "/thailand.png", duration: "7N", price: "₹62,000", tags: ["Adventure", "Culture"], description: "Ancient temples, tropical beaches, and vibrant street food" },
  { id: "dest-2", name: "Dubai", image: "/dubai.png", duration: "5N", price: "₹81,500", tags: ["Luxury", "Adventure"], description: "Futuristic skyline, golden deserts, and world-class dining" },
  { id: "dest-3", name: "Singapore", image: "/singapore.png", duration: "7N", price: "₹1,15,000", tags: ["Culture", "Luxury"], description: "Garden city wonders, hawker centers, and stunning architecture" },
  { id: "dest-4", name: "Bali", image: "/bali.png", duration: "5N", price: "₹45,000", tags: ["Relaxation", "Culture"], description: "Sacred temples, rice terraces, and serene spa retreats" },
];

export const DEFAULT_PACKAGES: Package[] = [
  { id: "pkg-1", name: "4N Thailand", price: "₹45,000", highlights: ["4-Star Hotel", "Sightseeing", "Transfers", "Breakfast", "Activities"], image: "/thailand.png" },
  { id: "pkg-2", name: "4N Thai Ex-Blr", price: "₹52,000", highlights: ["Flights Included", "4-Star Hotel", "Transfers", "Breakfast", "City Tour"], image: "/thailand.png" },
  { id: "pkg-3", name: "5N Dubai", price: "₹81,500", highlights: ["5-Star Hotel", "Return Flights", "Desert Safari", "City Tour", "All Meals"], image: "/dubai.png" },
  { id: "pkg-4", name: "6N Bali", price: "₹55,000", highlights: ["Private Villa", "Spa Package", "Rice Terrace", "Breakfast", "Transfers"], image: "/bali.png" },
  { id: "pkg-5", name: "7N Singapore Cruise Malaysia", price: "₹1,15,000", highlights: ["4-Star Hotels", "Cruise Included", "City Tours", "Transfers", "Half Board"], image: "/singapore.png" },
];

const STORAGE_KEYS = {
  destinations: "letstrip_destinations",
  packages: "letstrip_packages",
} as const;

// === Helper: Safe localStorage access (SSR-safe) ===

function getFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored) as T;
    }
  } catch (e) {
    console.error(`Failed to read ${key} from localStorage:`, e);
  }
  return fallback;
}

function saveToStorage<T>(key: string, data: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Failed to save ${key} to localStorage:`, e);
  }
}

// === Destinations CRUD ===

export function getDestinations(): Destination[] {
  return getFromStorage(STORAGE_KEYS.destinations, DEFAULT_DESTINATIONS);
}

export function addDestination(dest: Omit<Destination, "id">): Destination {
  const destinations = getDestinations();
  const newDest: Destination = { ...dest, id: `dest-${Date.now()}` };
  destinations.push(newDest);
  saveToStorage(STORAGE_KEYS.destinations, destinations);
  return newDest;
}

export function updateDestination(id: string, updates: Partial<Omit<Destination, "id">>): void {
  const destinations = getDestinations();
  const index = destinations.findIndex((d) => d.id === id);
  if (index !== -1) {
    destinations[index] = { ...destinations[index], ...updates };
    saveToStorage(STORAGE_KEYS.destinations, destinations);
  }
}

export function removeDestination(id: string): void {
  const destinations = getDestinations().filter((d) => d.id !== id);
  saveToStorage(STORAGE_KEYS.destinations, destinations);
}

// === Packages CRUD ===

export function getPackages(): Package[] {
  return getFromStorage(STORAGE_KEYS.packages, DEFAULT_PACKAGES);
}

export function addPackage(pkg: Omit<Package, "id">): Package {
  const packages = getPackages();
  const newPkg: Package = { ...pkg, id: `pkg-${Date.now()}` };
  packages.push(newPkg);
  saveToStorage(STORAGE_KEYS.packages, packages);
  return newPkg;
}

export function updatePackage(id: string, updates: Partial<Omit<Package, "id">>): void {
  const packages = getPackages();
  const index = packages.findIndex((p) => p.id === id);
  if (index !== -1) {
    packages[index] = { ...packages[index], ...updates };
    saveToStorage(STORAGE_KEYS.packages, packages);
  }
}

export function removePackage(id: string): void {
  const packages = getPackages().filter((p) => p.id !== id);
  saveToStorage(STORAGE_KEYS.packages, packages);
}

// === Admin Auth ===
// Simple password check using SHA-256 hash comparison
// Default password: "letstrip2026"

const ADMIN_PASSWORD_HASH = "d072f2d8c297fed0a7ba34c3fa16824d32b42bdc1080f66d950d60d39366519e";
const AUTH_KEY = "letstrip_admin_auth";
const AUTH_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  const hash = await sha256(password);
  if (hash === ADMIN_PASSWORD_HASH) {
    const session = { authenticated: true, timestamp: Date.now() };
    saveToStorage(AUTH_KEY, session);
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

// === Available images for selection in admin ===
export const AVAILABLE_IMAGES = [
  { value: "/thailand.png", label: "Thailand" },
  { value: "/dubai.png", label: "Dubai" },
  { value: "/singapore.png", label: "Singapore" },
  { value: "/bali.png", label: "Bali" },
  { value: "/hero-bg.png", label: "Hero Background" },
];
