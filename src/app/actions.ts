"use server";

import {
  DEFAULT_DESTINATIONS,
  DEFAULT_PACKAGES,
  findLocalImage,
  type Destination,
  type Package,
  type ItineraryDay,
} from "@/lib/packageStore";

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
  body: Record<string, any>
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

// ── Public API: Destinations ────────────────────────────────────────────────
export async function fetchDestinations(): Promise<Destination[]> {
  const cached = getCached<Destination[]>("destinations");
  if (cached) return cached;

  try {
    const [domestic, international] = await Promise.all([
      callCrmApi<{ Destination?: CrmDestination[] }>("destinationlist.php", { type: "domestic" }),
      callCrmApi<{ Destination?: CrmDestination[] }>("destinationlist.php", { type: "international" }),
    ]);

    const rawDomestic = domestic?.Destination || [];
    const rawInternational = international?.Destination || [];

    const destMap = new Map<string, Destination>();

    const processDestinations = (items: CrmDestination[], sections: string[]) => {
      items.forEach((d, i) => {
        const name = d.name || "Unknown";
        const id = slugify(name);
        if (destMap.has(id)) return;

        const localFallback = findLocalImage(name);
        const crmPhoto = d.photo || "";
        const image =
          localFallback !== "/hero-bg.png"
            ? localFallback
            : crmPhoto && !crmPhoto.includes("placeholder") && crmPhoto.startsWith("http")
            ? crmPhoto
            : "/hero-bg.png";

        destMap.set(id, {
          id,
          name,
          image,
          duration: "5N",
          price: "Custom",
          tags: [],
          description: `Explore the beauty of ${name}`,
          sections,
          order: i + 1,
        });
      });
    };

    processDestinations(rawDomestic, ["domestic"]);
    processDestinations(rawInternational, ["explore"]);

    let destinations = Array.from(destMap.values());

    // If CRM returned nothing useful, fall back to defaults
    if (destinations.length < 3) {
      destinations = DEFAULT_DESTINATIONS;
    }

    setCache("destinations", destinations);
    return destinations;
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
    const result = await callCrmApi<{ Package?: CrmPackage[] }>("packagelist.php", {
      searchdestination: "",
    });

    const rawPackages = result?.Package || [];

    if (rawPackages.length < 2) {
      setCache("packages", DEFAULT_PACKAGES);
      return DEFAULT_PACKAGES;
    }

    const packages: Package[] = rawPackages.map((p, i) => {
      const name = p.name || "Travel Package";
      const dest = p.destination || "";
      const nights = parseInt(p.nights || p.days || "0", 10) - (p.nights ? 0 : 1);
      const actualNights = nights > 0 ? nights : undefined;
      const priceVal = p.price ? parseInt(p.price, 10) : 0;
      const price = priceVal > 0 ? `₹${priceVal.toLocaleString("en-IN")}` : "Custom";
      const inclusions = (p.inclusion || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const themeName = p.themeName || "";
      const pkgType = inferPackageType(dest, name, themeName);

      const localFallback = findLocalImage(dest || name);
      const crmBanner = p.banner || "";
      const image =
        localFallback !== "/hero-bg.png"
          ? localFallback
          : crmBanner && !crmBanner.includes("placeholder") && crmBanner.startsWith("http") && crmBanner !== "https://travbizz.online/crm/package_image/"
          ? crmBanner
          : "/hero-bg.png";

      return {
        id: `crm-${p.packageId || i}`,
        name,
        price,
        highlights: inclusions.length > 0 ? inclusions : ["Transfers", "Hotel Stay", "Sightseeing"],
        image,
        destinationId: slugify(dest || name.split(" ")[0] || ""),
        durationNights: actualNights,
        tags: themeName ? [themeName] : [],
        sections: inferSectionsFromTheme(themeName, pkgType),
        order: i + 1,
        type: pkgType,
      };
    });

    setCache("packages", packages);
    return packages;
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
  pkg: any;
} | null> {
  // Extract numeric ID from our "crm-XXXX" format
  const numericId = packageId.replace("crm-", "");

  const cacheKey = `pkg_detail_${numericId}`;
  const cached = getCached<{ itinerary: ItineraryDay[]; terms: string; pkg: any }>(cacheKey);
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
    const result = await callCrmApi<{ status?: string; error_code?: string }>(
      "addquery.php",
      {
        name: leadData.name,
        email: leadData.email,
        contact: leadData.contact,
        destination: leadData.destination,
        startDate: leadData.fromDate,
        endDate: leadData.toDate,
        adult: parseInt(leadData.adults, 10) || 0,
        child: parseInt(leadData.children, 10) || 0,
        infant: parseInt(leadData.infants, 10) || 0,
      }
    );

    if (result?.status === "Success" || result?.error_code === "200") {
      return { success: true, message: "Inquiry submitted successfully!" };
    }
    return { success: false, message: "Could not submit inquiry. Please try WhatsApp." };
  } catch (err) {
    console.error("submitInquiryAction error:", err);
    return { success: false, message: "Network error. Please try WhatsApp." };
  }
}
