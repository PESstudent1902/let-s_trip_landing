"use server";

import {
  DEFAULT_DESTINATIONS,
  DEFAULT_PACKAGES,
  findLocalImage,
  type Destination,
  type Package,
  type ItineraryDay,
} from "@/lib/packageStore";
import fs from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { submitToOdooWebhook } from "@/lib/odoo";

// Upstash Redis credentials
const KV_REST_API_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "https://game-husky-119092.upstash.io";
const KV_REST_API_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "gQAAAAAAAdE0AAIgcDI4NjA3NTk5MTJjMGQ0NWU5OWQ0ZDEyMDZkZWMxYWM0NA";

const DESTINATIONS_KEY = "letstrip_destinations";
const PACKAGES_KEY = "letstrip_packages";

async function redisGet<T>(key: string): Promise<T | null> {
  try {
    const res = await fetch(`${KV_REST_API_URL}/get/${key}`, {
      headers: { Authorization: `Bearer ${KV_REST_API_TOKEN}` },
      next: { revalidate: 0 },
    });
    const data = await res.json();
    if (data && data.result) {
      return typeof data.result === "string" ? JSON.parse(data.result) : data.result;
    }
    return null;
  } catch (err) {
    console.error(`Redis GET error for key ${key}:`, err);
    return null;
  }
}

async function redisSet<T>(key: string, value: T): Promise<void> {
  try {
    await fetch(`${KV_REST_API_URL}/set/${key}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${KV_REST_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(value),
    });
  } catch (err) {
    console.error(`Redis SET error for key ${key}:`, err);
  }
}

async function getLocalDb(): Promise<{ destinations: Destination[]; packages: Package[] }> {
  try {
    const filepath = path.join(process.cwd(), "src/lib/db.json");
    const content = await fs.readFile(filepath, "utf-8");
    return JSON.parse(content);
  } catch (err) {
    console.error("Failed to read local db.json, returning defaults", err);
    return { destinations: DEFAULT_DESTINATIONS, packages: DEFAULT_PACKAGES };
  }
}

async function saveLocalDb(data: { destinations: Destination[]; packages: Package[] }): Promise<void> {
  try {
    const filepath = path.join(process.cwd(), "src/lib/db.json");
    await fs.writeFile(filepath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write to local db.json", err);
  }
}

async function getCurrentDb(): Promise<{ destinations: Destination[]; packages: Package[] }> {
  try {
    const dests = await redisGet<Destination[]>(DESTINATIONS_KEY);
    const pkgs = await redisGet<Package[]>(PACKAGES_KEY);

    if (dests && dests.length > 0 && pkgs && pkgs.length > 0) {
      return { destinations: dests, packages: pkgs };
    }

    // Fallback/Seed from local DB
    const local = await getLocalDb();
    
    const finalDests = dests && dests.length > 0 ? dests : local.destinations;
    const finalPkgs = pkgs && pkgs.length > 0 ? pkgs : local.packages;

    if (!dests || dests.length === 0) {
      if (finalDests && finalDests.length > 0) {
        await redisSet(DESTINATIONS_KEY, finalDests);
      }
    }
    if (!pkgs || pkgs.length === 0) {
      if (finalPkgs && finalPkgs.length > 0) {
        await redisSet(PACKAGES_KEY, finalPkgs);
      }
    }

    return { 
      destinations: finalDests, 
      packages: finalPkgs 
    };
  } catch (err) {
    console.error("getCurrentDb error, returning local DB fallback:", err);
    return getLocalDb();
  }
}



// ── CRM Configuration ──────────────────────────────────────────────────────
const CRM_BASE = "https://travbizz.online/crm/API";
const TOKEN_ID = "1";

// ── Server-side in-memory cache ─────────────────────────────────────────────
// Avoids hammering the CRM on every page load. Cache TTL = 5 minutes.
const CACHE_TTL = 5 * 60 * 1000;
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}
const cache: Record<string, CacheEntry<unknown>> = {};

function getCached<T>(key: string): T | null {
  const entry = cache[key] as CacheEntry<T> | undefined;
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) return entry.data;
  return null;
}
function setCache<T>(key: string, data: T): void {
  cache[key] = { data, timestamp: Date.now() };
}



// ── CRM API Helper ──────────────────────────────────────────────────────────
async function callCrmApi<T>(
  endpoint: string,
  body: Record<string, unknown>
): Promise<T | null> {
  try {
    const res = await fetch(`${CRM_BASE}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        EndUserIp: "127.0.0.1",
        TokenId: TOKEN_ID,
        ...body,
      }),
      // 8 second timeout to prevent hanging
      signal: AbortSignal.timeout(8000),
    });
    const text = await res.text();
    // Some CRM endpoints return malformed JSON – clean up
    const cleaned = text.replace(/[\x00-\x1F\x7F]/g, "").trim();
    return JSON.parse(cleaned) as T;
  } catch (err) {
    console.error(`CRM API error (${endpoint}):`, err);
    return null;
  }
}

// ── Section assignment heuristics ───────────────────────────────────────────
function inferSectionsFromTheme(
  themeName: string,
  type?: string
): string[] {
  const t = (themeName || "").toLowerCase();
  const sections: string[] = [];

  if (t.includes("honeymoon") || t.includes("romantic") || t.includes("couple")) {
    sections.push("honeymoon");
  }
  if (t.includes("adventure") || t.includes("trek") || t.includes("hiking") || t.includes("camp")) {
    sections.push("adventures");
  }
  if (t.includes("heritage") || t.includes("culture") || t.includes("spiritual")) {
    sections.push("expert-picks");
  }
  if (t.includes("family") || t.includes("group")) {
    sections.push("expert-picks");
  }

  if (type === "domestic") {
    sections.push("domestic");
  }
  if (type === "international") {
    sections.push("explore");
  }

  // Default: if no match, classify by type
  if (sections.length === 0) {
    sections.push(type === "domestic" ? "domestic" : "expert-picks");
  }

  return [...new Set(sections)];
}

function slugify(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ── CRM Type Definitions ────────────────────────────────────────────────────
interface CrmDestination {
  name?: string;
  photo?: string;
}

interface CrmPackage {
  packageId?: string;
  name?: string;
  destination?: string;
  nights?: string;
  days?: string;
  price?: string;
  themeName?: string;
  banner?: string;
  inclusion?: string;
  type?: string;
}

interface CrmPackageDetails {
  themeId?: string;
  theme?: string;
  packageId?: string;
  name?: string;
  nights?: string;
  days?: string;
  price?: string;
  destination?: string;
  destinationId?: string;
  description?: string;
  includeServices?: string;
}

interface CrmDayDetail {
  day?: string | number;
  name?: string;
  description?: string;
}

interface CrmTerm {
  name?: string;
  description?: string;
}

interface CrmPackageDetailResponse {
  PackageDetails?: CrmPackageDetails;
  DayDetails?: CrmDayDetail[];
  Terms?: CrmTerm[];
  ImageGallery?: { image?: string }[];
}

// ── Image Validation Helper ─────────────────────────────────────────────────
function isValidCrmImage(url: string | undefined): boolean {
  if (!url) return false;
  const cleaned = url.trim();
  return (
    cleaned.startsWith("http") &&
    !cleaned.includes("placeholder") &&
    cleaned !== "https://travbizz.online/crm/package_image/" &&
    cleaned !== "https://travbizz.online/crm/package_image"
  );
}

// ── Package Destination Matching Helper ─────────────────────────────────────
function matchDestinationId(
  destField: string,
  packageName: string,
  allDestinations: Destination[]
): string {
  const cleanDestField = (destField || "").trim().toLowerCase();
  const cleanName = (packageName || "").trim().toLowerCase();

  // 1. Try matching using the destField (split by commas)
  if (cleanDestField) {
    const parts = cleanDestField.split(",").map(s => s.trim()).filter(Boolean);
    for (const part of parts) {
      const idMatch = allDestinations.find(d => d.id === part);
      if (idMatch) return idMatch.id;

      const exactMatch = allDestinations.find(d => d.name.toLowerCase() === part);
      if (exactMatch) return exactMatch.id;
    }
  }

  // 2. Keyword mapping for cities/regions to main destination IDs
  const keywordToDestId: Record<string, string> = {
    phuket: "phuket-krabi",
    krabi: "phuket-krabi",
    pattaya: "thailand",
    bangkok: "thailand",
    thailand: "thailand",
    srinagar: "kashmir",
    pahalgam: "kashmir",
    gulmarg: "kashmir",
    sonmarg: "kashmir",
    kashmir: "kashmir",
    munnar: "kerala",
    thekkady: "kerala",
    alleppey: "kerala",
    kochi: "kerala",
    kovalam: "kerala",
    trivandrum: "kerala",
    kerala: "kerala",
    goa: "goa",
    jaipur: "rajasthan",
    udaipur: "rajasthan",
    jodhpur: "rajasthan",
    jaisalmer: "rajasthan",
    rajasthan: "rajasthan",
    portblair: "andaman-delight",
    "port blair": "andaman-delight",
    havelock: "andaman-delight",
    andaman: "andaman-delight",
    darjeeling: "sikkim-darjeeling",
    gangtok: "sikkim-darjeeling",
    sikkim: "sikkim-darjeeling",
    shillong: "meghalaya-jungle-to-clouds",
    meghalaya: "meghalaya-jungle-to-clouds",
    cherrapunji: "meghalaya-jungle-to-clouds",
    tawang: "tawang",
    dirang: "tawang",
    bomdila: "tawang",
    manali: "himachal",
    shimla: "himachal",
    sissu: "himachal",
    kasol: "himachal",
    dharamshala: "himachal",
    himachal: "himachal",
    rishikesh: "rishikesh",
    haridwar: "haridwar",
    corbett: "jim-corbett",
    dubai: "dubai",
    singapore: "singapore",
    bali: "bali",
    vietnam: "vietnam",
    hanoi: "hanoi-danang",
    danang: "hanoi-danang",
    almaty: "almaty",
    egypt: "egypt",
    france: "france",
    kenya: "kenya",
  };

  // Check in dest field
  if (cleanDestField) {
    for (const [kw, destId] of Object.entries(keywordToDestId)) {
      if (cleanDestField.includes(kw)) {
        if (allDestinations.some(d => d.id === destId)) {
          return destId;
        }
      }
    }
  }

  // Check in package name
  for (const [kw, destId] of Object.entries(keywordToDestId)) {
    if (cleanName.includes(kw)) {
      if (allDestinations.some(d => d.id === destId)) {
        return destId;
      }
    }
  }

  // 3. Try partial name match
  const matchByName = allDestinations.find(d => 
    cleanName.includes(d.name.toLowerCase()) || d.name.toLowerCase().includes(cleanName)
  );
  if (matchByName) return matchByName.id;

  // 4. Default fallback: slugified first word
  const fallbackSource = (cleanDestField.split(",")[0] || cleanName.split(" ")[0] || "").trim();
  return slugify(fallbackSource) || "general";
}

// ── Public API: Destinations ────────────────────────────────────────────────
export async function fetchDestinations(): Promise<Destination[]> {
  const cached = getCached<Destination[]>("destinations");
  if (cached) return cached;

  try {
    let dests = await redisGet<Destination[]>(DESTINATIONS_KEY);
    if (!dests || dests.length === 0) {
      const local = await getLocalDb();
      dests = local.destinations;
      if (dests && dests.length > 0) {
        await redisSet(DESTINATIONS_KEY, dests);
      }
    }
    setCache("destinations", dests);
    return dests;
  } catch (err) {
    console.error("fetchDestinations error:", err);
    return DEFAULT_DESTINATIONS;
  }
}

function inferPackageType(dest: string, name: string, themeName: string): "domestic" | "international" {
  const text = `${dest} ${name} ${themeName}`.toLowerCase();
  
  const intlKeywords = [
    "thailand", "phuket", "krabi", "bangkok", "pattaya",
    "dubai", "abu dhabi", "singapore", "bali", "maldives",
    "vietnam", "hanoi", "ho chi minh", "halong", "europe",
    "paris", "france", "egypt", "cairo", "giza", "almaty",
    "kazakhstan", "sri lanka", "colombo", "switzerland",
    "australia", "sydney", "melbourne", "turkey", "istanbul",
    "greece", "athens", "mauritius", "canada", "toronto",
    "italy", "rome", "venice", "florence", "london", "uk",
    "international"
  ];

  for (const kw of intlKeywords) {
    if (text.includes(kw)) return "international";
  }

  return "domestic";
}

// ── Public API: Packages ────────────────────────────────────────────────────
export async function fetchPackages(): Promise<Package[]> {

  const cached = getCached<Package[]>("packages");
  if (cached) return cached;

  try {
    let pkgs = await redisGet<Package[]>(PACKAGES_KEY);
    if (!pkgs || pkgs.length === 0) {
      const local = await getLocalDb();
      pkgs = local.packages;
      if (pkgs && pkgs.length > 0) {
        await redisSet(PACKAGES_KEY, pkgs);
      }
    }
    setCache("packages", pkgs);
    return pkgs;
  } catch (err) {
    console.error("fetchPackages error:", err);
    return DEFAULT_PACKAGES;
  }
}

// ── Public API: Package Detail (fetches itinerary on-demand) ────────────────
export async function fetchPackageDetail(
  packageId: string
): Promise<{
  itinerary: ItineraryDay[];
  terms: string;
  pkg: unknown;
} | null> {
  // Extract numeric ID from our "crm-XXXX" format
  const numericId = packageId.replace("crm-", "");

  const cacheKey = `pkg_detail_${numericId}`;
  const cached = getCached<{ itinerary: ItineraryDay[]; terms: string; pkg: unknown }>(cacheKey);
  if (cached) return cached;

  try {
    const result = await callCrmApi<CrmPackageDetailResponse>("packagedetails.php", {
      packageId: numericId,
      type: "domestic",
    });

    if (!result) return null;

    const dayDetails = result.DayDetails || [];
    const itinerary: ItineraryDay[] = dayDetails.map((d, i) => {
      const title = d.name || `Day ${d.day || i + 1}`;
      const desc = (d.description || "")
        .replace(/<[^>]*>/g, "")
        .replace(/&nbsp;/g, " ")
        .trim();
      const details = desc
        .split(/[.\n]/)
        .map((s) => s.trim())
        .filter((s) => s.length > 5);

      return {
        day: typeof d.day === "number" ? d.day : parseInt(d.day || "1", 10) || (i + 1),
        title,
        details: details.length > 0 ? details : ["Details will be shared upon booking"],
      };
    });

    const termsArray = result.Terms || [];
    const terms = termsArray
      .map((t) => {
        const name = t.name || "";
        let desc = (t.description || "")
          .replace(/<[^>]*>/g, "")
          .replace(/&nbsp;/g, " ")
          .trim();

        // Clean placeholders and entity formatting
        desc = desc
          .replace(/\[percentage\]/g, "25")
          .replace(/\[number\] days prior/g, "15 days prior")
          .replace(/\[currency\]/g, "INR")
          .replace(/\[45\]/g, "45")
          .replace(/\[x\]/g, "25")
          .replace(/30&ndash44/g, "30 to 44")
          .replace(/30&ndash;44/g, "30 to 44")
          .replace(/\[y\]/g, "50")
          .replace(/\[30\]/g, "30")
          .replace(/processed within \[number\]/g, "processed within 10-14")
          .replace(/&ldquo/g, "“")
          .replace(/&rdquo/g, "”")
          .replace(/&ndash/g, " to ");

        return name ? `**${name}**\n${desc}` : desc;
      })
      .filter(Boolean)
      .join("\n\n");

    const data = { itinerary, terms, pkg: result };
    setCache(cacheKey, data);
    return data;
  } catch (err) {
    console.error("fetchPackageDetail error:", err);
    return null;
  }
}

// ── Public API: Submit Lead/Inquiry to CRM ──────────────────────────────────
export async function submitInquiryAction(leadData: {
  name: string;
  email: string;
  contact: string;
  destination: string;
  fromDate: string;
  toDate: string;
  adults: string;
  children: string;
  infants: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    const result = await submitToOdooWebhook(leadData);

    if (result.success) {
      return { success: true, message: "Inquiry submitted successfully!" };
    }
    return { success: false, message: result.error || "Could not submit inquiry. Please check details and try again." };
  } catch (err) {
    console.error("submitInquiryAction error:", err);
    return { success: false, message: "Network error. Please verify your connection and try again." };
  }
}

// ── Server Action: Save Destination ──────────────────────────────────────────
export async function saveDestinationAction(data: Destination): Promise<{ success: boolean; message: string }> {
  try {
    const local = await getCurrentDb();
    const existingIdx = local.destinations.findIndex(d => d.id === data.id);

    if (existingIdx > -1) {
      local.destinations[existingIdx] = data;
    } else {
      local.destinations.push(data);
    }

    await saveLocalDb(local);
    await redisSet(DESTINATIONS_KEY, local.destinations);

    // Clear cache
    delete cache["destinations"];

    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true, message: "Destination saved successfully!" };
  } catch (err) {
    console.error("saveDestinationAction error:", err);
    return { success: false, message: "Failed to save destination." };
  }
}

// ── Server Action: Delete Destination ────────────────────────────────────────
export async function deleteDestinationAction(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const local = await getCurrentDb();
    
    // Deleting a destination removes its linked packages
    local.destinations = local.destinations.filter(d => d.id !== id);
    local.packages = local.packages.filter(p => p.destinationId !== id);

    await saveLocalDb(local);
    await redisSet(DESTINATIONS_KEY, local.destinations);
    await redisSet(PACKAGES_KEY, local.packages);

    // Clear cache
    delete cache["destinations"];
    delete cache["packages"];

    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true, message: "Destination and linked packages deleted successfully!" };
  } catch (err) {
    console.error("deleteDestinationAction error:", err);
    return { success: false, message: "Failed to delete destination." };
  }
}

// ── Server Action: Save Package ─────────────────────────────────────────────
export async function savePackageAction(data: Package): Promise<{ success: boolean; message: string }> {
  try {
    const local = await getCurrentDb();
    const existingIdx = local.packages.findIndex(p => p.id === data.id);

    if (existingIdx > -1) {
      local.packages[existingIdx] = data;
    } else {
      local.packages.push(data);
    }

    await saveLocalDb(local);
    await redisSet(PACKAGES_KEY, local.packages);

    // Clear cache
    delete cache["packages"];

    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true, message: "Package saved successfully!" };
  } catch (err) {
    console.error("savePackageAction error:", err);
    return { success: false, message: "Failed to save package." };
  }
}

// ── Server Action: Delete Package ───────────────────────────────────────────
export async function deletePackageAction(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const local = await getCurrentDb();
    local.packages = local.packages.filter(p => p.id !== id);

    await saveLocalDb(local);
    await redisSet(PACKAGES_KEY, local.packages);

    // Clear cache
    delete cache["packages"];

    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true, message: "Package deleted successfully!" };
  } catch (err) {
    console.error("deletePackageAction error:", err);
    return { success: false, message: "Failed to delete package." };
  }
}

// ── Server Action: Reorder Destinations ──────────────────────────────────────
export async function reorderDestinationsAction(orderedIds: string[]): Promise<{ success: boolean; message: string }> {
  try {
    const local = await getCurrentDb();
    
    // Set order property based on the index in orderedIds
    local.destinations.forEach(d => {
      const idx = orderedIds.indexOf(d.id);
      if (idx > -1) {
        d.order = idx + 1;
      }
    });

    // Sort the destinations array locally
    local.destinations.sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999));

    await saveLocalDb(local);
    await redisSet(DESTINATIONS_KEY, local.destinations);

    // Clear cache
    delete cache["destinations"];

    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true, message: "Destinations reordered successfully!" };
  } catch (err) {
    console.error("reorderDestinationsAction error:", err);
    return { success: false, message: "Failed to reorder destinations." };
  }
}

// ── Server Action: Reorder Packages ──────────────────────────────────────────
export async function reorderPackagesAction(orderedIds: string[]): Promise<{ success: boolean; message: string }> {
  try {
    const local = await getCurrentDb();

    // Set order property based on the index in orderedIds
    local.packages.forEach(p => {
      const idx = orderedIds.indexOf(p.id);
      if (idx > -1) {
        p.order = idx + 1;
      }
    });

    // Sort the packages array locally
    local.packages.sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999));

    await saveLocalDb(local);
    await redisSet(PACKAGES_KEY, local.packages);

    // Clear cache
    delete cache["packages"];

    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true, message: "Packages reordered successfully!" };
  } catch (err) {
    console.error("reorderPackagesAction error:", err);
    return { success: false, message: "Failed to reorder packages." };
  }
}
