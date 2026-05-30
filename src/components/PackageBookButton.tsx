"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import InquiryFormModal from "./InquiryFormModal";

interface PackageBookButtonProps {
  packageName: string;
  destination?: string;
}

export default function PackageBookButton({ packageName, destination }: PackageBookButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan to-violet text-white font-bold text-sm text-center hover:opacity-90 transition-opacity flex items-center gap-2"
        style={{ fontFamily: "var(--font-headline)" }}
      >
        Book Now <ChevronRight size={18} />
      </button>

      <InquiryFormModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        packageName={packageName}
        destination={destination}
      />
    </>
  );
}
