"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import InquiryFormModal from "./InquiryFormModal";

interface BookAdventureButtonProps {
  destinationName: string;
}

export default function BookAdventureButton({ destinationName }: BookAdventureButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan to-violet text-white font-bold text-sm text-center hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
        style={{ fontFamily: "var(--font-headline)" }}
      >
        Book My Adventure <ChevronRight size={18} />
      </button>

      <InquiryFormModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        destination={destinationName}
      />
    </>
  );
}
