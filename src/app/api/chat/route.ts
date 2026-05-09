import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import {
  DEFAULT_DESTINATIONS,
  DEFAULT_PACKAGES,
  inferDestinationIdFromPackage,
  type Destination,
  type Package,
} from "@/lib/packageStore";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

function getRedisClient(): Redis | null {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

function parsePrice(price: string): number {
  const numeric = Number(price.replace(/[^\d]/g, ""));
  return Number.isFinite(numeric) ? numeric : Number.MAX_SAFE_INTEGER;
}

function normalizePackages(packages: Package[], destinations: Destination[]): Package[] {
  const safeDestinations = destinations.length > 0 ? destinations : DEFAULT_DESTINATIONS;
  return (packages.length > 0 ? packages : DEFAULT_PACKAGES).map((pkg) => ({
    ...pkg,
    destinationId: pkg.destinationId || inferDestinationIdFromPackage(pkg, safeDestinations),
  }));
}

async function fetchTravelContext(): Promise<{ destinations: Destination[]; packages: Package[] }> {
  const redis = getRedisClient();
  if (!redis) {
    return { destinations: DEFAULT_DESTINATIONS, packages: DEFAULT_PACKAGES };
  }

  try {
    const [destinationsRaw, packagesRaw] = await Promise.all([
      redis.get<Destination[]>("letstrip_destinations"),
      redis.get<Package[]>("letstrip_packages"),
    ]);

    const destinations = destinationsRaw && destinationsRaw.length > 0 ? destinationsRaw : DEFAULT_DESTINATIONS;
    const packages = normalizePackages(packagesRaw || [], destinations);

    return { destinations, packages };
  } catch {
    return { destinations: DEFAULT_DESTINATIONS, packages: DEFAULT_PACKAGES };
  }
}

function isTravelQuery(message: string, destinations: Destination[]): boolean {
  const value = message.toLowerCase();
  const travelWords = [
    "travel", "trip", "tour", "holiday", "vacation", "itinerary", "budget", "hotel", "flight", "package", "book", "visa", "destination", "honeymoon",
  ];

  if (travelWords.some((word) => value.includes(word))) return true;
  return destinations.some((destination) => value.includes(destination.name.toLowerCase()));
}

function findBestPackage(message: string, packages: Package[], destinations: Destination[]): Package | null {
  const text = message.toLowerCase();
  const matchedDestination = destinations.find((d) => text.includes(d.name.toLowerCase()));

  let filtered = matchedDestination ? packages.filter((pkg) => pkg.destinationId === matchedDestination.id) : packages;
  if (filtered.length === 0) filtered = packages;

  const budgetMatch = text.match(/(\d[\d,]*)/);
  if (budgetMatch) {
    const budget = Number(budgetMatch[1].replace(/,/g, ""));
    if (Number.isFinite(budget)) {
      const withinBudget = filtered.filter((pkg) => parsePrice(pkg.price) <= budget).sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
      if (withinBudget.length > 0) return withinBudget[0];
    }
  }

  return [...filtered].sort((a, b) => parsePrice(a.price) - parsePrice(b.price))[0] || null;
}

function buildFallbackReply(message: string, destinations: Destination[], packages: Package[]): string {
  if (!isTravelQuery(message, destinations)) {
    return "I can only help with travel planning and LetsTrip services. Ask me about destinations, package prices, itinerary ideas, or the best trip for your budget.";
  }

  const best = findBestPackage(message, packages, destinations);
  if (!best) {
    return "I could not find packages right now, but I can help compare destinations, budgets, and durations if you share your preference.";
  }

  const destinationName = destinations.find((d) => d.id === best.destinationId)?.name || "your selected destination";

  return [
    `Top match: ${best.name} (${destinationName}) — ${best.price}.`,
    `Highlights: ${best.highlights.slice(0, 4).join(", ")}.`,
    "If you share your budget, trip duration, and vibe (adventure/luxury/relaxation), I can refine this recommendation.",
  ].join("\n");
}

function createSystemPrompt(destinations: Destination[], packages: Package[], best: Package | null): string {
  const destinationSummary = destinations.map((d) => `- ${d.name}: ${d.description} | Typical ${d.duration} from ${d.price}`).join("\n");
  const packageSummary = packages
    .slice(0, 40)
    .map((pkg) => {
      const destination = destinations.find((d) => d.id === pkg.destinationId)?.name || pkg.destinationId;
      return `- ${pkg.name} | Destination: ${destination} | Price: ${pkg.price} | Highlights: ${pkg.highlights.join(", ")}`;
    })
    .join("\n");

  const bestLine = best ? `Current best-match candidate for the latest user request: ${best.name} (${best.price}).` : "No clear best match yet.";

  return `You are LetsTrip Travel Concierge, a strict travel-only assistant.

Rules:
1) Only answer travel-related queries and LetsTrip website service/package questions.
2) If user asks non-travel questions, politely refuse and redirect to travel planning.
3) Never claim to modify code, database, or admin settings. You are read-only.
4) Always ground recommendations in the packages and destinations below.
5) When recommending, explain why it fits the user's demand (budget, destination, duration, vibe).

LetsTrip destinations:
${destinationSummary}

LetsTrip packages:
${packageSummary}

${bestLine}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { messages?: ChatMessage[] };
    const messages = Array.isArray(body.messages) ? body.messages.filter((m) => m.role && m.content) : [];
    const latestMessage = messages[messages.length - 1]?.content?.trim();

    if (!latestMessage) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    const { destinations, packages } = await fetchTravelContext();
    const fallback = buildFallbackReply(latestMessage, destinations, packages);

    if (!isTravelQuery(latestMessage, destinations)) {
      return NextResponse.json({ reply: fallback });
    }

    const openRouterKey = process.env.OPENROUTER_API_KEY;
    if (!openRouterKey) {
      return NextResponse.json({ reply: fallback });
    }

    const model = process.env.OPENROUTER_MODEL || "google/gemma-4-26b-a4b";
    const best = findBestPackage(latestMessage, packages, destinations);

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openRouterKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "https://letstrip.vercel.app",
        "X-Title": "LetsTrip Concierge",
      },
      body: JSON.stringify({
        model,
        temperature: 0.3,
        max_tokens: 500,
        messages: [
          { role: "system", content: createSystemPrompt(destinations, packages, best) },
          ...messages.slice(-8),
        ],
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ reply: fallback });
    }

    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const reply = payload.choices?.[0]?.message?.content?.trim() || fallback;
    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json(
      { reply: "I can help with LetsTrip destinations and packages. Share your budget, preferred destination, and trip duration." },
      { status: 200 },
    );
  }
}
