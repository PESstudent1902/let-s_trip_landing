"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, CheckCircle2, Calendar, Users, MapPin, User, Mail, Phone } from "lucide-react";
import { submitInquiryAction } from "@/app/actions";

interface InquiryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageName?: string;
  destination?: string;
}

export default function InquiryFormModal({
  isOpen,
  onClose,
  packageName,
  destination,
}: InquiryFormModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    destination: destination || "",
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

  const whatsappText = `Hi! I'm interested in${packageName ? ` the ${packageName} package` : " a travel package"}.%0A%0A📍 Destination: ${formData.destination || "TBD"}%0A📅 Dates: ${formData.fromDate || "Flexible"} to ${formData.toDate || "Flexible"}%0A👥 Travelers: ${formData.adults} Adults, ${formData.children} Children%0A%0AName: ${formData.name}%0APhone: ${formData.contact}`;

  const handleClose = () => {
    setStatus("idle");
    setMessage("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-abyss/80 backdrop-blur-md"
            onClick={handleClose}
          />

          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg max-h-[90vh] bg-[#0A1118] border border-white/10 rounded-3xl shadow-2xl overflow-y-auto"
            data-lenis-prevent
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-white/20 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="p-6 sm:p-8">
              {status === "success" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="text-green-400" size={32} />
                  </div>
                  <h3
                    className="text-2xl text-white mb-2"
                    style={{ fontFamily: "var(--font-brush)" }}
                  >
                    Inquiry Registered!
                  </h3>
                  <p className="text-text-secondary mb-6">{message}</p>

                  <a
                    href={`https://wa.me/918867767171?text=${whatsappText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-green-600 hover:bg-green-500 text-white font-bold transition-colors"
                  >
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.612.616l4.533-1.471A11.956 11.956 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.24 0-4.31-.727-5.99-1.958l-.418-.312-2.688.872.896-2.634-.343-.446A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                    </svg>
                    Continue on WhatsApp
                  </a>
                </motion.div>
              ) : (
                <>
                  <div className="mb-6">
                    <h3
                      className="text-2xl text-white"
                      style={{ fontFamily: "var(--font-brush)" }}
                    >
                      {packageName
                        ? `Inquire about ${packageName}`
                        : "Plan Your Dream Trip"}
                    </h3>
                    <p
                      className="text-text-secondary text-sm mt-1"
                      style={{ fontFamily: "var(--font-handwritten)" }}
                    >
                      Fill in your details and we&#39;ll get back to you instantly.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div className="relative">
                      <User
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                      />
                      <input
                        type="text"
                        placeholder="Your Name"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-text-muted focus:border-cyan/50 focus:outline-none transition-colors text-sm"
                      />
                    </div>

                    {/* Email & Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="relative">
                        <Mail
                          size={16}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                        />
                        <input
                          type="email"
                          placeholder="Email"
                          required
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-text-muted focus:border-cyan/50 focus:outline-none transition-colors text-sm"
                        />
                      </div>
                      <div className="relative">
                        <Phone
                          size={16}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                        />
                        <input
                          type="tel"
                          placeholder="Phone"
                          required
                          value={formData.contact}
                          onChange={(e) =>
                            setFormData({ ...formData, contact: e.target.value })
                          }
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-text-muted focus:border-cyan/50 focus:outline-none transition-colors text-sm"
                        />
                      </div>
                    </div>

                    {/* Destination */}
                    <div className="relative">
                      <MapPin
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                      />
                      <input
                        type="text"
                        placeholder="Destination"
                        value={formData.destination}
                        onChange={(e) =>
                          setFormData({ ...formData, destination: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-text-muted focus:border-cyan/50 focus:outline-none transition-colors text-sm"
                      />
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative">
                        <Calendar
                          size={16}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                        />
                        <input
                          type="date"
                          placeholder="From Date"
                          value={formData.fromDate}
                          onChange={(e) =>
                            setFormData({ ...formData, fromDate: e.target.value })
                          }
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-text-muted focus:border-cyan/50 focus:outline-none transition-colors text-sm [color-scheme:dark]"
                        />
                      </div>
                      <div className="relative">
                        <Calendar
                          size={16}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                        />
                        <input
                          type="date"
                          placeholder="To Date"
                          value={formData.toDate}
                          onChange={(e) =>
                            setFormData({ ...formData, toDate: e.target.value })
                          }
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-text-muted focus:border-cyan/50 focus:outline-none transition-colors text-sm [color-scheme:dark]"
                        />
                      </div>
                    </div>

                    {/* Travelers */}
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-text-muted text-xs mb-1 flex items-center gap-1">
                          <Users size={12} /> Adults
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={formData.adults}
                          onChange={(e) =>
                            setFormData({ ...formData, adults: e.target.value })
                          }
                          className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-center focus:border-cyan/50 focus:outline-none transition-colors text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-text-muted text-xs mb-1 block">
                          Children
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="10"
                          value={formData.children}
                          onChange={(e) =>
                            setFormData({ ...formData, children: e.target.value })
                          }
                          className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-center focus:border-cyan/50 focus:outline-none transition-colors text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-text-muted text-xs mb-1 block">
                          Infants
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="5"
                          value={formData.infants}
                          onChange={(e) =>
                            setFormData({ ...formData, infants: e.target.value })
                          }
                          className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-center focus:border-cyan/50 focus:outline-none transition-colors text-sm"
                        />
                      </div>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-cyan to-violet text-white font-bold tracking-wide hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {status === "loading" ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Submitting...
                        </span>
                      ) : (
                        <>
                          <Send size={16} /> Submit Inquiry
                        </>
                      )}
                    </button>

                    {status === "error" && (
                      <p className="text-red-400 text-sm text-center">{message}</p>
                    )}
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
