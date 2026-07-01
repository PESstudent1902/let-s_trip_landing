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

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.contact.trim() ||
      !formData.destination.trim() ||
      !formData.fromDate ||
      !formData.toDate
    ) {
      setStatus("error");
      setMessage("Please fill out all fields.");
      return;
    }

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
                    Inquiry Received!
                  </h3>
                  <p className="text-text-secondary mb-6 text-sm leading-relaxed max-w-sm mx-auto">
                    Your details have been successfully transmitted. Our travel concierges will reach out to you shortly to customize your itinerary.
                  </p>

                  <button
                    onClick={handleClose}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan to-violet hover:opacity-90 text-white font-bold transition-all text-sm cursor-pointer"
                    style={{ fontFamily: "var(--font-headline)" }}
                  >
                    Done
                  </button>
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
                        required
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
                          required
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
                          required
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
