"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send } from "lucide-react";
import InquiryFormModal from "./InquiryFormModal";

export default function MobileInquiryCTA() {
  const [visible, setVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-0 left-0 right-0 z-30 md:hidden safe-bottom"
          >
            <div className="bg-abyss/95 backdrop-blur-xl border-t border-white/5 px-4 py-2.5">
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center justify-center gap-3 w-full py-3 bg-gradient-to-r from-cyan to-violet text-white font-bold rounded-xl active:scale-[0.98] transition-transform text-sm cursor-pointer shadow-lg shadow-cyan/10"
                style={{ fontFamily: "var(--font-headline)" }}
              >
                <Send size={16} />
                Plan Your Trip Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <InquiryFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
