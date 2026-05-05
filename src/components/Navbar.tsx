"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";

const navLinks = [
  { label: "Destinations", href: "#destinations" },
  { label: "Packages", href: "#packages" },
  { label: "Concierge", href: "#concierge" },
  { label: "Reviews", href: "#reviews" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  return (
    <motion.nav
      ref={navRef}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "glass-strong py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2">
          <motion.div
            className="relative"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <span
              className="text-2xl font-bold tracking-tight text-glow-cyan"
              style={{ fontFamily: "var(--font-headline)" }}
            >
              <span className="text-cyan">Lets</span>
              <span className="text-text-primary">Trip</span>
            </span>
            <motion.div
              className="absolute -bottom-1 left-0 h-[2px] bg-cyan rounded-full"
              initial={{ width: 0 }}
              whileHover={{ width: "100%" }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-text-secondary hover:text-cyan transition-colors duration-300 text-sm font-medium tracking-wide"
              style={{ fontFamily: "var(--font-headline)" }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden md:block">
          <MagneticButton>
            <a
              href="https://wa.me/918867767171"
              target="_blank" rel="noopener noreferrer"
              className="relative px-6 py-2.5 bg-orange text-white text-sm font-semibold rounded-xl
                         hover:shadow-[0_0_30px_rgba(255,107,53,0.5)] transition-all duration-300
                         flex items-center gap-2 cursor-pointer"
              style={{ fontFamily: "var(--font-headline)" }}
            >
              <span>Book Now</span>
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </a>
          </MagneticButton>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-text-primary p-2"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-strong mt-2 mx-4 rounded-2xl overflow-hidden"
          >
            <div className="p-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-text-secondary hover:text-cyan transition-colors py-2 text-lg"
                  style={{ fontFamily: "var(--font-headline)" }}
                >
                  {link.label}
                </Link>
              ))}
              <a
                href="https://wa.me/918867767171"
                target="_blank" rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className="mt-2 px-6 py-3 bg-orange text-white text-center rounded-xl font-semibold"
              >
                Book Now
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
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
