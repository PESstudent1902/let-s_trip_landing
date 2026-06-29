"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon } from "lucide-react";
import Link from "next/link";
import InquiryFormModal from "./InquiryFormModal";

const navLinks = [
  { label: "Destinations", href: "#destinations" },
  { label: "Services", href: "#services" },
  { label: "Contact Us", href: "#contact" },
  { label: "Reviews", href: "#reviews" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [showInquiry, setShowInquiry] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("letstrip-theme") as "dark" | "light" | null;
    const preferred = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    const initialTheme = saved || preferred;
    setTheme(initialTheme);
    document.documentElement.classList.toggle("light", initialTheme === "light");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("letstrip-theme", newTheme);
    document.documentElement.classList.toggle("light", newTheme === "light");
  };

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <motion.nav
        ref={navRef}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "glass-strong py-3" : "bg-transparent py-4 md:py-5"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-16 flex items-center justify-between">
          {/* Brush Script Logo */}
          <Link href="/" className="group flex items-center gap-1">
            <motion.div className="relative" whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 400 }}>
              <span className="text-3xl md:text-4xl text-glow-cyan" style={{ fontFamily: "var(--font-brush)" }}>
                <span className="bg-gradient-to-r from-cyan via-cyan-dim to-white bg-clip-text text-transparent">Let&apos;sTrip</span>
              </span>
              <span className="absolute -bottom-2 right-0 text-[10px] md:text-xs text-text-muted italic tracking-wider" style={{ fontFamily: "var(--font-handwritten)" }}>
                the journey begins...
              </span>
            </motion.div>
          </Link>

          {/* Desktop Links — organic underline style, not buttons */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className={`adventure-link text-sm font-medium tracking-wide ${
                  scrolled 
                    ? "text-text-secondary hover:text-text-primary" 
                    : "text-white/80 hover:text-white"
                }`}
                style={{ fontFamily: "var(--font-headline)" }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA — flowing text link, not a button */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-full glass border transition-all flex items-center justify-center cursor-pointer ${
                scrolled 
                  ? "border-glass-border text-cyan hover:border-cyan/40" 
                  : "border-white/10 text-white hover:border-white/30"
              }`}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} className="text-violet" />}
            </button>
            <MagneticButton>
              <a
                href="https://wa.me/918867767171"
                target="_blank" rel="noopener noreferrer"
                className="group/cta flex items-center gap-2 text-orange hover:text-warm transition-colors cursor-pointer"
                style={{ fontFamily: "var(--font-brush)" }}
              >
                <span className="text-lg">Book Your Adventure</span>
                <motion.span
                  animate={{ x: [0, 6, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="text-xl"
                >
                  →
                </motion.span>
              </a>
            </MagneticButton>
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full glass border flex items-center justify-center cursor-pointer ${
                scrolled || mobileOpen
                  ? "border-glass-border text-cyan" 
                  : "border-white/10 text-white"
              }`}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} className="text-violet" />}
            </button>
            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`p-2 z-[60] relative cursor-pointer ${
                scrolled || mobileOpen ? "text-text-primary" : "text-white"
              }`}
              aria-label="Toggle menu"
            >
            <AnimatePresence mode="wait">
              {mobileOpen ? (
                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <X size={24} />
                </motion.div>
              ) : (
                <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Menu size={24} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>
    </motion.nav>

      {/* Full-screen Mobile Menu — adventure journal style */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-abyss/95 backdrop-blur-2xl"
              onClick={() => setMobileOpen(false)}
            />
            
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-8 py-20">
              {/* Logo in menu */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="mb-12"
              >
                <span className="text-4xl bg-gradient-to-r from-cyan to-white bg-clip-text text-transparent" style={{ fontFamily: "var(--font-brush)" }}>
                  Let&apos;sTrip
                </span>
              </motion.div>

              <nav className="flex flex-col items-center gap-1 mb-12">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      onClick={() => !link.external && setMobileOpen(false)}
                      className="text-3xl text-text-secondary hover:text-white transition-colors py-3 block"
                      style={{ fontFamily: "var(--font-brush)" }}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Odoo CRM Inquiry CTA */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="text-center"
              >
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    setShowInquiry(true);
                  }}
                  className="group inline-flex flex-col items-center gap-1 cursor-pointer"
                >
                  <span className="text-2xl text-orange" style={{ fontFamily: "var(--font-brush)" }}>
                    Start your journey
                  </span>
                  <span className="flex items-center gap-2 text-text-muted text-sm animate-pulse" style={{ fontFamily: "var(--font-handwritten)" }}>
                    Inquire Online
                  </span>
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <InquiryFormModal
        isOpen={showInquiry}
        onClose={() => setShowInquiry(false)}
      />
    </>
  );
}

/* Magnetic Button Effect */
function MagneticButton({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    window.requestAnimationFrame(() => {
      if (!ref.current) return;
      const { left, top, width, height } = ref.current.getBoundingClientRect();
      const x = (e.clientX - left - width / 2) * 0.15;
      const y = (e.clientY - top - height / 2) * 0.15;
      ref.current.style.transform = `translate(${x}px, ${y}px)`;
    });
  };

  const handleMouseLeave = () => {
    if (!ref.current) return;
    window.requestAnimationFrame(() => {
      if (!ref.current) return;
      ref.current.style.transform = "translate(0, 0)";
      ref.current.style.transition = "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)";
    });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="inline-block transition-transform"
    >
      {children}
    </div>
  );
}

export { MagneticButton };
