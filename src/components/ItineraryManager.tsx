"use client";

import { useState, useEffect } from "react";
import ItineraryModal from "./ItineraryModal";
import { Package } from "@/lib/packageStore";

export function openItinerary(pkg: Package, destinationName?: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("open-itinerary", { detail: { pkg, destinationName } }));
  }
}

export default function ItineraryManager() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState<Package | null>(null);
  const [destinationName, setDestinationName] = useState<string | undefined>();

  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent;
      setSelectedPkg(customEvent.detail.pkg);
      setDestinationName(customEvent.detail.destinationName);
      setIsOpen(true);
    };
    window.addEventListener("open-itinerary", handleOpen);
    return () => window.removeEventListener("open-itinerary", handleOpen);
  }, []);

  return (
    <ItineraryModal
      pkg={selectedPkg}
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      destinationName={destinationName}
    />
  );
}
