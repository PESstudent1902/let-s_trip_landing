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
              <p className="text-white text-lg mb-2" style={{ fontFamily: "var(--font-headline)" }}>Inquiry Received!</p>
              <p className="text-text-secondary mb-6 text-sm max-w-md mx-auto">
                Thank you! Your details have been successfully transmitted. One of our destination specialists will contact you shortly to build your custom itinerary.
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-green-500 to-cyan hover:opacity-90 text-white font-bold transition-all text-sm cursor-pointer"
                style={{ fontFamily: "var(--font-headline)" }}
              >
                Send Another Inquiry
              </button>
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
