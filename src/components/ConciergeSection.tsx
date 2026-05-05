"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { MagneticButton } from "./Navbar";

export default function ConciergeSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} id="concierge" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-abyss via-deep-space to-abyss" />
      
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 w-[800px] h-[600px] rounded-full bg-green-500/5 blur-[150px] -translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-16 text-center">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} className="max-w-3xl mx-auto glass rounded-3xl p-8 md:p-12 border border-green-500/10">
          <span className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-green-400 text-xs font-semibold tracking-[0.15em] uppercase mb-6" style={{ fontFamily: "var(--font-headline)" }}>
            <MessageCircle size={14} /> Direct Connection
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: "var(--font-headline)" }}>
            Ready to plan your<br />
            <span className="bg-gradient-to-r from-green-400 to-cyan bg-clip-text text-transparent">Dream Vacation?</span>
          </h2>
          <p className="text-text-secondary text-lg mb-10 max-w-xl mx-auto">
            Skip the forms. Connect with our travel experts directly on WhatsApp to get personalized packages tailored to your vibe and budget.
          </p>

          <MagneticButton>
            <a href="https://wa.me/918867767171" target="_blank" rel="noopener noreferrer"
               className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-green-600 text-white font-bold rounded-2xl hover:shadow-[0_0_40px_rgba(34,197,94,0.5)] hover:bg-green-500 transition-all text-lg cursor-pointer" style={{ fontFamily: "var(--font-headline)" }}>
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.612.616l4.533-1.471A11.956 11.956 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.24 0-4.31-.727-5.99-1.958l-.418-.312-2.688.872.896-2.634-.343-.446A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
              Contact via WhatsApp
            </a>
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}
