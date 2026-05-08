"use server";

import { Redis } from '@upstash/redis';
import { revalidatePath } from 'next/cache';
import { DEFAULT_DESTINATIONS, DEFAULT_PACKAGES, type Destination, type Package } from '@/lib/packageStore';

// Initialize Redis (Hardcoded connection per user request to bypass Vercel env var setup)
const redis = new Redis({
  url: "https://game-husky-119092.upstash.io",
  token: "gQAAAAAAAdE0AAIgcDI4NjA3NTk5MTJjMGQ0NWU5OWQ0ZDEyMDZkZWMxYWM0NA",
});

// --- Destinations ---

export async function fetchDestinations(): Promise<Destination[]> {
  if (!redis) return DEFAULT_DESTINATIONS;
  
  try {
    const data = await redis.get<Destination[]>('letstrip_destinations');
    return data || DEFAULT_DESTINATIONS;
  } catch (error) {
    console.error("Error fetching destinations from Redis:", error);
    return DEFAULT_DESTINATIONS;
  }
}

export async function saveDestination(newDestination: Destination): Promise<{ success: boolean; error?: string }> {
  if (!redis) {
    return { success: false, error: "Vercel KV is not configured. Please add the Upstash Redis integration in your Vercel Dashboard." };
  }

  try {
    const existing = await fetchDestinations();
    const updated = [...existing, newDestination];
    await redis.set('letstrip_destinations', updated);
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to save destination" };
  }
}

export async function updateDestination(updatedDestination: Destination): Promise<{ success: boolean; error?: string }> {
  if (!redis) {
    return { success: false, error: "Vercel KV is not configured." };
  }

  try {
    const existing = await fetchDestinations();
    const updated = existing.map(d => d.id === updatedDestination.id ? updatedDestination : d);
    await redis.set('letstrip_destinations', updated);
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update destination" };
  }
}

export async function deleteDestinationAction(id: string): Promise<{ success: boolean; error?: string }> {
  if (!redis) {
    return { success: false, error: "Vercel KV is not configured." };
  }

  try {
    const existing = await fetchDestinations();
    const updated = existing.filter(d => d.id !== id);
    await redis.set('letstrip_destinations', updated);
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete destination" };
  }
}

// --- Packages ---

export async function fetchPackages(): Promise<Package[]> {
  if (!redis) return DEFAULT_PACKAGES;
  
  try {
    const data = await redis.get<Package[]>('letstrip_packages');
    return data || DEFAULT_PACKAGES;
  } catch (error) {
    console.error("Error fetching packages from Redis:", error);
    return DEFAULT_PACKAGES;
  }
}

export async function savePackage(newPackage: Package): Promise<{ success: boolean; error?: string }> {
  if (!redis) {
    return { success: false, error: "Vercel KV is not configured. Please add the Upstash Redis integration in your Vercel Dashboard." };
  }

  try {
    const existing = await fetchPackages();
    const updated = [...existing, newPackage];
    await redis.set('letstrip_packages', updated);
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to save package" };
  }
}

export async function updatePackage(updatedPackage: Package): Promise<{ success: boolean; error?: string }> {
  if (!redis) {
    return { success: false, error: "Vercel KV is not configured." };
  }

  try {
    const existing = await fetchPackages();
    const updated = existing.map(p => p.id === updatedPackage.id ? updatedPackage : p);
    await redis.set('letstrip_packages', updated);
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update package" };
  }
}

export async function deletePackageAction(id: string): Promise<{ success: boolean; error?: string }> {
  if (!redis) {
    return { success: false, error: "Vercel KV is not configured." };
  }

  try {
    const existing = await fetchPackages();
    const updated = existing.filter(p => p.id !== id);
    await redis.set('letstrip_packages', updated);
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete package" };
  }
}
