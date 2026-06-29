/**
 * Odoo CRM Webhook Integration Client
 * Sends lead inquiry data to the Make.com custom webhook listener, which forwards it to Odoo CRM.
 * Implements a strong handshake using authentication headers and structured JSON payloads.
 */

const WEBHOOK_URL = "https://hook.eu1.make.com/iurvy3w9u3oandfriqngtwzsafw6msnh";
const API_KEY = "9ca59bf6571044ea6d77cc8f9c9414fac3e89f70";

export interface OdooLeadData {
  name: string;
  email: string;
  contact: string;
  destination: string;
  fromDate: string;
  toDate: string;
  adults: string;
  children: string;
  infants: string;
}

/**
 * Submits lead data to Odoo via Make.com custom webhook.
 * Ensures a strong handshake by sending verification API key in headers and body.
 */
export async function submitToOdooWebhook(
  leadData: OdooLeadData
): Promise<{ success: boolean; error?: string }> {
  console.log("[Odoo Webhook] Starting secure handshake with Make.com webhook listener...", {
    destination: leadData.destination,
    name: leadData.name,
  });

  // Basic validation before handshake
  if (!leadData.name || !leadData.email || !leadData.contact) {
    console.error("[Odoo Webhook] Validation failed: Missing contact info.");
    return {
      success: false,
      error: "Validation failed: Name, email, and contact number are required.",
    };
  }

  const payload = {
    api_key: API_KEY,
    name: leadData.name,
    email: leadData.email,
    contact: leadData.contact,
    destination: leadData.destination || "Flexible / General Inquiry",
    fromDate: leadData.fromDate || "Flexible",
    toDate: leadData.toDate || "Flexible",
    adults: parseInt(leadData.adults, 10) || 0,
    children: parseInt(leadData.children, 10) || 0,
    infants: parseInt(leadData.infants, 10) || 0,
    source: "LetsTrip Website Inquiry Form",
    timestamp: new Date().toISOString(),
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
        "X-API-Key": API_KEY,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    console.log(`[Odoo Webhook] Response status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const responseText = await response.text();
      console.error(`[Odoo Webhook] Error response: ${responseText}`);
      return {
        success: false,
        error: `Odoo handshake failed. Webhook listener returned status ${response.status}.`,
      };
    }

    console.log("[Odoo Webhook] Secure handshake succeeded. Lead successfully submitted.");
    return { success: true };
  } catch (error: unknown) {
    console.error("[Odoo Webhook] Handshake failed due to network or connection issue:", error);
    let errorMessage = "Connection failed during Odoo handshake.";
    if (error instanceof Error) {
      if (error.name === "TimeoutError") {
        errorMessage = "Odoo integration timed out. The webhook server did not respond in time.";
      } else {
        errorMessage = error.message;
      }
    }
    return {
      success: false,
      error: errorMessage,
    };
  }
}
