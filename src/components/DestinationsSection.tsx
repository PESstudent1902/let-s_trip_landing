"use client";

import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { MagneticButton } from "./Navbar";
import { ChevronLeft, ChevronRight, Hotel, Plane, UtensilsCrossed, Globe } from "lucide-react";
import { type Destination, type Package } from "@/lib/packageStore";
import { fetchDestinations, fetchPackages } from "@/app/actions";

// Emoji icons for destinations that don't have custom images
const DESTINATION_ICONS: Record<string, string> = {
  thailand: "🏛️",
  dubai: "🏙️",
  singapore: "🌆",
  bali: "🌴",
  maldives: "🏝️",
  vietnam: "🎋",
  japan: "⛩️",
  europe: "🏰",
};

export default function DestinationsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [selectedDestinationId, setSelectedDestinationId] = useState<string>("all");

  // Load data + refresh every 30s for admin panel changes
  const loadData = useCallback(async () => {
    const [dests, pkgs] = await Promise.all([fetchDestinations(), fetchPackages()]);
    setDestinations(dests);
    setPackages(pkgs);
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [loadData]);

  const destinationMap = useMemo(() => new Map(destinations.map((d) => [d.id, d.name])), [destinations]);

  const visiblePackages = useMemo(() => {
    if (selectedDestinationId === "all") return packages;
    return packages.filter((pkg) => pkg.destinationId === selectedDestinationId);
  }, [packages, selectedDestinationId]);

  const scroll = (dir: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const amount = dir === "left" ? -400 : 400;
    scrollContainerRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <section ref={ref} id="destinations" className="relative py-16 md:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-abyss via-deep-space to-abyss" />

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-16">
        {/* Section Header */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="text-center mb-8 md:mb-12">
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-dashed border-cyan/30 text-cyan text-sm tracking-wide mb-4 md:mb-6" style={{ fontFamily: "var(--font-handwritten)" }}>
            <span className="w-2 h-2 rounded-full bg-cyan pulse-glow" /> Holiday Packages
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl mb-3 md:mb-4" style={{ fontFamily: "var(--font-brush)" }}>
            <span className="text-white">Choose Your </span>
            <span className="bg-gradient-to-r from-cyan to-violet bg-clip-text text-transparent text-glow-cyan">Destination</span>
          </h2>
          <p className="text-text-secondary text-sm md:text-lg max-w-2xl mx-auto" style={{ fontFamily: "var(--font-handwritten)" }}>
            Select a destination to explore curated packages
          </p>
        </motion.div>

        {/* ========== DESTINATION SELECTOR — CARD GRID ========== */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={isInView ? { opacity: 1, y: 0 } : {}} 
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 mb-14 md:mb-20"
        >
          {/* "All" card */}
          <button
            onClick={() => setSelectedDestinationId("all")}
            className={`group relative flex flex-col items-center justify-center gap-2 sm:gap-3 p-4 sm:p-5 rounded-2xl border transition-all duration-300 cursor-pointer active:scale-95 ${
              selectedDestinationId === "all"
                ? "bg-cyan/10 border-cyan/40 shadow-[0_0_20px_rgba(0,240,255,0.15)]"
                : "bg-white/[0.04] border-white/10 hover:bg-white/[0.08] hover:border-cyan/20"
            }`}
          >
            <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-2xl transition-all ${
              selectedDestinationId === "all" ? "bg-cyan/20 shadow-lg" : "bg-white/10 group-hover:bg-white/15"
            }`}>
              <Globe size={24} className={selectedDestinationId === "all" ? "text-cyan" : "text-white/70"} />
            </div>
            <span className={`text-xs sm:text-sm font-semibold tracking-wide transition-colors ${
              selectedDestinationId === "all" ? "text-cyan" : "text-white/80 group-hover:text-white"
            }`} style={{ fontFamily: "var(--font-headline)" }}>
              All
            </span>
            {selectedDestinationId === "all" && (
              <motion.div layoutId="activeIndicator" className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-cyan" />
            )}
          </button>

          {/* Destination cards */}
          {destinations.map((dest) => (
            <button
              key={dest.id}
              onClick={() => setSelectedDestinationId(dest.id)}
              className={`group relative flex flex-col items-center justify-center gap-2 sm:gap-3 p-4 sm:p-5 rounded-2xl border transition-all duration-300 cursor-pointer active:scale-95 ${
                selectedDestinationId === dest.id
                  ? "bg-cyan/10 border-cyan/40 shadow-[0_0_20px_rgba(0,240,255,0.15)]"
                  : "bg-white/[0.04] border-white/10 hover:bg-white/[0.08] hover:border-cyan/20"
              }`}
            >
              <div className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden flex items-center justify-center transition-all ${
                selectedDestinationId === dest.id ? "ring-2 ring-cyan/50 shadow-lg" : "ring-1 ring-white/10 group-hover:ring-white/20"
              }`}>
                {dest.image && dest.image !== "/hero-bg.png" ? (
                  <Image src={dest.image} alt={dest.name} fill className="object-cover" />
                ) : (
                  <span className="text-2xl">{DESTINATION_ICONS[dest.id] || "✈️"}</span>
                )}
              </div>
              <span className={`text-xs sm:text-sm font-semibold tracking-wide transition-colors text-center leading-tight ${
                selectedDestinationId === dest.id ? "text-cyan" : "text-white/80 group-hover:text-white"
              }`} style={{ fontFamily: "var(--font-headline)" }}>
                {dest.name}
              </span>
              {selectedDestinationId === dest.id && (
                <motion.div layoutId="activeIndicator" className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-cyan" />
              )}
            </button>
          ))}
        </motion.div>

        {/* ========== POPULAR PACKAGES ========== */}
        <div id="packages" className="relative z-10">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }} className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-3 md:mb-4" style={{ fontFamily: "var(--font-brush)" }}>
              <span className="text-white">Popular </span>
              <span className="text-orange text-glow-orange">Packages</span>
            </h2>
            <p className="text-text-secondary text-sm md:text-lg" style={{ fontFamily: "var(--font-handwritten)" }}>
              {selectedDestinationId === "all"
                ? "All-inclusive experiences at unbeatable value"
                : `Showing packages for ${destinationMap.get(selectedDestinationId) || "selected destination"}`}
            </p>
          </motion.div>

          {visiblePackages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {visiblePackages.map((pkg, i) => (
                <PackageCard
                  key={pkg.id}
                  pkg={pkg}
                  destinationName={pkg.destinationId ? destinationMap.get(pkg.destinationId) : undefined}
                  index={i}
                  isInView={isInView}
                />
              ))}
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 md:py-16 glass rounded-3xl">
              <p className="text-2xl mb-2" style={{ fontFamily: "var(--font-brush)" }}>No packages yet</p>
              <p className="text-text-secondary text-sm" style={{ fontFamily: "var(--font-handwritten)" }}>
                Check back soon or contact us on WhatsApp!
              </p>
            </motion.div>
          )}
        </div>

        {/* ========== DESTINATION SHOWCASE CAROUSEL (with arrows — now BELOW packages) ========== */}
        <div className="relative group mt-16 md:mt-24">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.4 }} className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl" style={{ fontFamily: "var(--font-brush)" }}>
              <span className="text-white">Explore </span>
              <span className="bg-gradient-to-r from-cyan to-violet bg-clip-text text-transparent">Destinations</span>
            </h2>
          </motion.div>

          <button onClick={() => scroll("left")} className="absolute -left-3 md:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 glass-strong rounded-full border border-white/10 hover:border-cyan/30 flex items-center justify-center transition-all cursor-pointer opacity-0 group-hover:opacity-100 hidden md:flex">
            <ChevronLeft className="text-cyan" size={22} />
          </button>
          <button onClick={() => scroll("right")} className="absolute -right-3 md:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 glass-strong rounded-full border border-white/10 hover:border-cyan/30 flex items-center justify-center transition-all cursor-pointer opacity-0 group-hover:opacity-100 hidden md:flex">
            <ChevronRight className="text-cyan" size={22} />
          </button>

          <div ref={scrollContainerRef} className="hidden md:flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: "none" }}>
            {destinations.map((dest, i) => (
              <DestinationCard key={dest.id} destination={dest} index={i} isInView={isInView} />
            ))}
          </div>

          {/* Mobile: vertical stack */}
          <div className="flex flex-col gap-5 md:hidden">
            {destinations.slice(0, 4).map((dest, i) => (
              <MobileDestinationCard key={dest.id} destination={dest} index={i} isInView={isInView} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ========== DESTINATION CARD (Desktop Carousel) ========== */
function DestinationCard({ destination, index, isInView }: { destination: Destination; index: number; isInView: boolean }) {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      cardRef.current.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale(1.02)`;
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    cardRef.current.style.transform = "perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)";
    setHovered(false);
  };

  const rotation = [1, -0.8, 1.2, -0.5][index % 4];

  return (
    <motion.div initial={{ opacity: 0, x: 50, rotate: rotation }} animate={isInView ? { opacity: 1, x: 0, rotate: rotation } : {}} transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }} className="min-w-[320px] md:min-w-[380px] snap-center flex-shrink-0">
      <div ref={cardRef} onMouseMove={handleMouseMove} onMouseEnter={() => setHovered(true)} onMouseLeave={handleMouseLeave} className="relative h-[520px] rounded-3xl overflow-hidden cursor-pointer group" style={{ transformStyle: "preserve-3d", transition: "transform 0.15s ease-out" }}>
        <Image src={destination.image} alt={destination.name} fill className={`object-cover transition-transform duration-700 ${hovered ? "scale-110" : "scale-100"}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-abyss via-abyss/30 to-transparent" />

        <div className="absolute top-4 left-4 flex gap-2 z-10">
          {destination.tags.map((tag) => (
            <span key={tag} className="px-3 py-1 rounded-full border border-dashed border-white/20 text-[11px] text-cyan tracking-wider" style={{ fontFamily: "var(--font-handwritten)" }}>
              {tag}
            </span>
          ))}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
          <h3 className="text-4xl mb-1" style={{ fontFamily: "var(--font-brush)" }}>{destination.name}</h3>
          <p className="text-text-secondary text-sm mb-4" style={{ fontFamily: "var(--font-handwritten)" }}>{destination.description}</p>

          <motion.div animate={{ opacity: hovered ? 1 : 0.7, y: hovered ? 0 : 10 }} className="flex items-center justify-between">
            <div>
              <span className="text-text-muted text-xs" style={{ fontFamily: "var(--font-handwritten)" }}>{destination.duration}</span>
            </div>
            <a href="https://wa.me/918867767171" target="_blank" rel="noopener noreferrer" className="adventure-link flex items-center gap-2 text-orange hover:text-warm transition-colors cursor-pointer text-sm" style={{ fontFamily: "var(--font-brush)" }}>
              Explore <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>→</motion.span>
            </a>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

/* ========== MOBILE DESTINATION CARD ========== */
function MobileDestinationCard({ destination, index, isInView }: { destination: Destination; index: number; isInView: boolean }) {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}>
      <div className="relative h-[280px] sm:h-[340px] rounded-3xl overflow-hidden">
        <Image src={destination.image} alt={destination.name} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-abyss via-abyss/40 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
          <h3 className="text-2xl sm:text-3xl mb-1" style={{ fontFamily: "var(--font-brush)" }}>{destination.name}</h3>
          <p className="text-text-secondary text-xs sm:text-sm mb-3 line-clamp-2" style={{ fontFamily: "var(--font-handwritten)" }}>{destination.description}</p>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-text-muted text-xs" style={{ fontFamily: "var(--font-handwritten)" }}>{destination.duration}</span>
            </div>
            <a href="https://wa.me/918867767171" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-orange text-sm active:scale-95 transition-transform" style={{ fontFamily: "var(--font-brush)" }}>
              Explore →
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ========== PACKAGE CARD ========== */
function PackageCard({ pkg, destinationName, index, isInView }: { pkg: Package; destinationName?: string; index: number; isInView: boolean }) {
  return (
    <motion.div initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.35 + index * 0.08, ease: [0.22, 1, 0.36, 1] }} className="glass rounded-3xl overflow-hidden group hover:border-cyan/15 transition-all duration-500">
      <div className="flex flex-col sm:flex-row">
        <div className="relative h-44 sm:h-auto sm:w-44 md:w-48 flex-shrink-0">
          <Image src={pkg.image} alt={pkg.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-b sm:bg-gradient-to-r from-transparent to-abyss/80" />
        </div>
        <div className="p-4 sm:p-5 md:p-6 flex-1">
          <div className="flex items-start justify-between mb-2 sm:mb-3">
            <div>
              <h3 className="text-lg sm:text-xl md:text-2xl mb-0.5" style={{ fontFamily: "var(--font-brush)" }}>{pkg.name}</h3>
              <p className="text-cyan text-lg sm:text-xl md:text-2xl text-glow-cyan" style={{ fontFamily: "var(--font-brush)" }}>{pkg.price}</p>
              <p className="text-text-muted text-xs" style={{ fontFamily: "var(--font-handwritten)" }}>
                {destinationName} · per person
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-4 sm:mb-5">
            {pkg.highlights.map((h) => (
              <span key={h} className="flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-dashed border-white/10 text-[10px] sm:text-xs text-text-secondary" style={{ fontFamily: "var(--font-handwritten)" }}>
                {h.includes("Hotel") ? <Hotel size={10} className="text-cyan" /> : h.includes("Flight") ? <Plane size={10} className="text-cyan" /> : <UtensilsCrossed size={10} className="text-cyan" />}
                {h}
              </span>
            ))}
          </div>

          <MagneticButton>
            <a href="https://wa.me/918867767171" target="_blank" rel="noopener noreferrer" className="adventure-link inline-flex items-center gap-2 text-orange hover:text-warm transition-colors cursor-pointer text-sm" style={{ fontFamily: "var(--font-brush)" }}>
              Book This Journey <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>→</motion.span>
            </a>
          </MagneticButton>
        </div>
      </div>
    </motion.div>
  );
}
