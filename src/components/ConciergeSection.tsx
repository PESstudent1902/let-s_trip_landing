"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { MessageCircle, Send, CheckCircle2, User, Mail, Phone, MapPin, Calendar, Users } from "lucide-react";
import { submitInquiryAction } from "@/app/actions";

export default function ConciergeSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    destination: "",
    fromDate: "",
    toDate: "",
    adults: "2",
    children: "0",
    infants: "0",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    const result = await submitInquiryAction(formData);
    if (result.success) {
      setStatus("success");
      setMessage(result.message);
    } else {
      setStatus("error");
      setMessage(result.message);
    }
  };

  const whatsappText = `Hi! I'm interested in planning a trip.%0A%0A📍 Destination: ${formData.destination || "TBD"}%0A📅 Dates: ${formData.fromDate || "Flexible"} to ${formData.toDate || "Flexible"}%0A👥 Travelers: ${formData.adults} Adults, ${formData.children} Children%0A%0AName: ${formData.name}%0APhone: ${formData.contact}`;

  return (
    <section ref={ref} id="contact" className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-abyss via-deep-space to-abyss" />
      <div className="absolute top-1/2 left-1/2 w-[800px] h-[600px] rounded-full bg-green-500/5 blur-[150px] -translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-16 text-center">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="max-w-3xl mx-auto glass rounded-[2rem] p-6 sm:p-8 md:p-14 border border-green-500/10 relative overflow-hidden">
          {/* Decorative corner flourishes */}
          <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-dashed border-green-500/20 rounded-tl-xl" />
          <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-dashed border-green-500/20 rounded-tr-xl" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-dashed border-green-500/20 rounded-bl-xl" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-dashed border-green-500/20 rounded-br-xl" />

          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-dashed border-green-400/20 text-green-400 text-sm tracking-wide mb-6" style={{ fontFamily: "var(--font-handwritten)" }}>
            <MessageCircle size={14} /> Plan Your Trip
          </span>
          
          <h2 className="text-3xl sm:text-4xl md:text-6xl mb-4 md:mb-6" style={{ fontFamily: "var(--font-brush)" }}>
            <span className="text-white">Ready to plan your</span><br />
            <span className="bg-gradient-to-r from-green-400 to-cyan bg-clip-text text-transparent">Dream Vacation?</span>
          </h2>

          {status === "success" ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-6">
              <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="text-green-400" size={28} />
              </div>
              <p className="text-white text-lg mb-2" style={{ fontFamily: "var(--font-headline)" }}>Inquiry Registered!</p>
              <p className="text-text-secondary mb-6 text-sm">{message}</p>
              <a
                href={`https://wa.me/918867767171?text=${whatsappText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-green-600 hover:bg-green-500 text-white font-bold transition-colors text-sm"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.612.616l4.533-1.471A11.956 11.956 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.24 0-4.31-.727-5.99-1.958l-.418-.312-2.688.872.896-2.634-.343-.446A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                Continue on WhatsApp
              </a>
            </motion.div>
          ) : (
            <>
              <p className="text-text-secondary text-base md:text-lg mb-8 max-w-xl mx-auto leading-relaxed" style={{ fontFamily: "var(--font-handwritten)" }}>
                Tell us about your dream trip and our experts will craft the perfect itinerary for you.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4 text-left max-w-lg mx-auto">
                {/* Name */}
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input type="text" placeholder="Your Name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-text-muted focus:border-green-400/50 focus:outline-none transition-colors text-sm" />
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input type="email" placeholder="Email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-text-muted focus:border-green-400/50 focus:outline-none transition-colors text-sm" />
                  </div>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input type="tel" placeholder="Phone" required value={formData.contact} onChange={(e) => setFormData({ ...formData, contact: e.target.value })} className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-text-muted focus:border-green-400/50 focus:outline-none transition-colors text-sm" />
                  </div>
                </div>

                {/* Destination */}
                <div className="relative">
                  <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input type="text" placeholder="Where do you want to go?" value={formData.destination} onChange={(e) => setFormData({ ...formData, destination: e.target.value })} className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-text-muted focus:border-green-400/50 focus:outline-none transition-colors text-sm" />
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input type="date" value={formData.fromDate} onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })} className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-text-muted focus:border-green-400/50 focus:outline-none transition-colors text-sm [color-scheme:dark]" />
                  </div>
                  <div className="relative">
                    <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input type="date" value={formData.toDate} onChange={(e) => setFormData({ ...formData, toDate: e.target.value })} className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-text-muted focus:border-green-400/50 focus:outline-none transition-colors text-sm [color-scheme:dark]" />
                  </div>
                </div>

                {/* Travelers */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-text-muted text-xs mb-1 flex items-center gap-1"><Users size={12} /> Adults</label>
                    <input type="number" min="1" max="20" value={formData.adults} onChange={(e) => setFormData({ ...formData, adults: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-center focus:border-green-400/50 focus:outline-none transition-colors text-sm" />
                  </div>
                  <div>
                    <label className="text-text-muted text-xs mb-1 block">Children</label>
                    <input type="number" min="0" max="10" value={formData.children} onChange={(e) => setFormData({ ...formData, children: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-center focus:border-green-400/50 focus:outline-none transition-colors text-sm" />
                  </div>
                  <div>
                    <label className="text-text-muted text-xs mb-1 block">Infants</label>
                    <input type="number" min="0" max="5" value={formData.infants} onChange={(e) => setFormData({ ...formData, infants: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-center focus:border-green-400/50 focus:outline-none transition-colors text-sm" />
                  </div>
                </div>

                {/* Submit */}
                <button type="submit" disabled={status === "loading"} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-green-500 to-cyan text-white font-bold tracking-wide hover:opacity-90 transition-opacity disabled:opacity-50">
                  {status === "loading" ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </span>
                  ) : (
                    <><Send size={16} /> Send Inquiry</>
                  )}
                </button>

                {status === "error" && <p className="text-red-400 text-sm text-center">{message}</p>}
              </form>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}
