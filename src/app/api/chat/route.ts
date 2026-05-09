import { fetchDestinations, fetchPackages } from "@/app/actions";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const destinations = await fetchDestinations();
    const packages = await fetchPackages();

    const systemPrompt = `You are a LetsTrip travel assistant. Your ONLY purpose is to answer travel-related questions based on the packages available on our site. You must only recommend what is available. Do NOT book anything, just guide the user and give them the best matching packages.
    
    Here is our current database of destinations:
    ${JSON.stringify(destinations)}
    
    Here is our current database of packages:
    ${JSON.stringify(packages)}
    
    If the user asks about something we don't offer, politely inform them that you can only help with our current LetsTrip offerings. Use a friendly, engaging tone suitable for a premium travel agency.`;

    const openRouterApiKey = process.env.OPENROUTER_API_KEY;

    if (!openRouterApiKey) {
      return NextResponse.json({ error: "OpenRouter API Key not configured. Please add OPENROUTER_API_KEY to your environment variables." }, { status: 500 });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openRouterApiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "LetsTrip Assistant",
      },
      body: JSON.stringify({
        model: "google/gemma-2-27b-it", // Using Gemma model as requested (Gemma 4 26B A4B equivalent on OpenRouter)
        messages: [
          { role: "system", content: systemPrompt },
          ...messages
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter Error:", errorText);
      return NextResponse.json({ error: "Failed to communicate with AI provider." }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
