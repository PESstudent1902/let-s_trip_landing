"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import FallbackImage from "./FallbackImage";
import { 
  MapPin, Compass, Ship, Wind, Snowflake, 
  Award, DollarSign, MessageSquare, ChevronLeft, ChevronRight,
  FileText, Globe, Headphones
} from "lucide-react";
import { type Destination, type Package } from "@/lib/packageStore";
import { fetchDestinations, fetchPackages } from "@/app/actions";

// Adventure Icons Helper
function getAdventureIcon(id: string) {
  if (id.includes("bungee")) return <Compass className="text-black group-hover:text-white" size={20} />;
  if (id.includes("rafting")) return <Ship className="text-black group-hover:text-white" size={20} />;
  if (id.includes("paragliding")) return <Wind className="text-black group-hover:text-white" size={20} />;
  return <Snowflake className="text-black group-hover:text-white" size={20} />;
}

// Reusable Scrollable Carousel Wrapper with Left/Right Arrows
interface CarouselProps {
  children: React.ReactNode;
}

function Carousel({ children }: CarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const updateScrollButtons = useCallback(() => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setShowLeft(scrollLeft > 5);
      setShowRight(scrollLeft + clientWidth < scrollWidth - 5);
    }
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      el.addEventListener("scroll", updateScrollButtons);
      
      // Check immediately and also use ResizeObserver for dynamic resizing/data load adjustments
      updateScrollButtons();
      const observer = new ResizeObserver(() => {
        updateScrollButtons();
      });
      observer.observe(el);

      window.addEventListener("resize", updateScrollButtons);
      
      return () => {
        el.removeEventListener("scroll", updateScrollButtons);
        observer.disconnect();
        window.removeEventListener("resize", updateScrollButtons);
      };
    }
  }, [children, updateScrollButtons]);

  const handleScroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      const scrollAmount = containerRef.current.clientWidth * 0.75;
      containerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative group/carousel w-full">
      {/* Left Arrow Button */}
      <button
        onClick={() => handleScroll("left")}
        disabled={!showLeft}
        className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-30 w-11 h-11 rounded-full border border-white/10 bg-black/60 hover:bg-cyan/20 backdrop-blur-md text-white flex items-center justify-center transition-all duration-300 shadow-2xl scale-95 hover:scale-105 active:scale-95 disabled:opacity-0 disabled:pointer-events-none opacity-0 md:opacity-0 group-hover/carousel:opacity-100`}
        aria-label="Scroll left"
      >
        <ChevronLeft size={20} />
      </button>

      {/* Right Arrow Button */}
      <button
        onClick={() => handleScroll("right")}
        disabled={!showRight}
        className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-30 w-11 h-11 rounded-full border border-white/10 bg-black/60 hover:bg-cyan/20 backdrop-blur-md text-white flex items-center justify-center transition-all duration-300 shadow-2xl scale-95 hover:scale-105 active:scale-95 disabled:opacity-0 disabled:pointer-events-none opacity-0 md:opacity-0 group-hover/carousel:opacity-100`}
        aria-label="Scroll right"
      >
        <ChevronRight size={20} />
      </button>

      {/* Horizontal Scroll Area */}
      <div
        ref={containerRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide pb-6 px-1"
      >
        {children}
      </div>
    </div>
  );
}

function HoneymoonCarousel({ packages }: { packages: Package[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const updateScrollButtons = useCallback(() => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setShowLeft(scrollLeft > 5);
      setShowRight(scrollLeft + clientWidth < scrollWidth - 5);
    }
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      el.addEventListener("scroll", updateScrollButtons);
      updateScrollButtons();
      const observer = new ResizeObserver(() => {
        updateScrollButtons();
      });
      observer.observe(el);
      window.addEventListener("resize", updateScrollButtons);
      
      return () => {
        el.removeEventListener("scroll", updateScrollButtons);
        observer.disconnect();
        window.removeEventListener("resize", updateScrollButtons);
      };
    }
  }, [packages, updateScrollButtons]);

  const handleScroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      const scrollAmount = containerRef.current.clientWidth;
      containerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative group/honeymoon w-full">
      {/* Left Arrow Button */}
      <button
        onClick={() => handleScroll("left")}
        disabled={!showLeft}
        className={`absolute left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full border border-white/10 bg-black/60 hover:bg-cyan/20 backdrop-blur-md text-white flex items-center justify-center transition-all duration-300 shadow-2xl scale-95 hover:scale-105 active:scale-95 disabled:opacity-0 disabled:pointer-events-none opacity-0 group-hover/honeymoon:opacity-100`}
        aria-label="Scroll left"
      >
        <ChevronLeft size={20} />
      </button>

      {/* Right Arrow Button */}
      <button
        onClick={() => handleScroll("right")}
        disabled={!showRight}
        className={`absolute right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full border border-white/10 bg-black/60 hover:bg-cyan/20 backdrop-blur-md text-white flex items-center justify-center transition-all duration-300 shadow-2xl scale-95 hover:scale-105 active:scale-95 disabled:opacity-0 disabled:pointer-events-none opacity-0 group-hover/honeymoon:opacity-100`}
        aria-label="Scroll right"
      >
        <ChevronRight size={20} />
      </button>

      {/* Horizontal Scroll Area */}
      <div
        ref={containerRef}
        className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide w-full gap-0"
      >
        {packages.map((pkg) => {
          const rawTag = pkg.tags?.[0] || "HoneymoonSpecial";
          const hashtag = `#${rawTag.toUpperCase()}`;
          const title = pkg.name;
          const subtitle = pkg.highlights.slice(0, 4).join(" · ");
          
          return (
            <div 
              key={pkg.id} 
              className="w-full flex-shrink-0 snap-start"
            >
              <div className="relative w-full rounded-3xl overflow-hidden border border-white/15 shadow-2xl min-h-[340px] md:min-h-[400px] flex items-center p-8 md:p-16">
                <FallbackImage src={pkg.image} alt={pkg.name} fallbackName={pkg.name} fill unoptimized={true} className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent z-0" />
                
                <div className="relative z-10 max-w-2xl text-left">
                  <span className="text-xs md:text-sm font-semibold tracking-wider text-cyan uppercase block mb-3" style={{ fontFamily: "var(--font-headline)" }}>
                    {hashtag}
                  </span>
                  <h3 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight mb-4 text-white" style={{ fontFamily: "var(--font-headline)" }}>
                    {title}
                  </h3>
                  <p className="text-base sm:text-lg font-medium text-text-secondary mb-8" style={{ fontFamily: "var(--font-headline)" }}>
                    {subtitle}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-6">
                    <Link href={`/packages/${pkg.id}`} className="px-8 py-4 rounded-2xl bg-[#FF385C] hover:bg-[#FF385C]/90 text-white font-bold text-sm tracking-wide text-center transition-all shadow-xl hover:scale-[1.02]">
                      RESERVE YOUR SPOT
                    </Link>
                    <span className="text-white text-lg font-bold" style={{ fontFamily: "var(--font-headline)" }}>
                      Starting @ {pkg.price}*
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function DestinationsSection() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);

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

  // --- Dynamic Section Filtering with Fail-Safe Fallbacks & Sorting ---
  const sortItems = <T extends { order?: number; name: string }>(items: T[]): T[] => {
    return [...items].sort((a, b) => {
      const aOrd = a.order ?? 9999;
      const bOrd = b.order ?? 9999;
      if (aOrd !== bOrd) return aOrd - bOrd;
      return a.name.localeCompare(b.name);
    });
  };

  // 1. Expert Picks Itineraries (Destinations)
  const expertPickDests = sortItems(
    destinations.filter(d => d.sections?.includes("expert-picks")).length > 0
      ? destinations.filter(d => d.sections?.includes("expert-picks"))
      : destinations.filter(d => ["thailand", "france", "egypt", "maldives"].includes(d.id))
  );

  // 2. Adventures for you (Packages)
  const adventurePkgs = sortItems(
    packages.filter(p => p.sections?.includes("adventures")).length > 0
      ? packages.filter(p => p.sections?.includes("adventures"))
      : packages.filter(p => ["pkg-bungee", "pkg-rafting", "pkg-paragliding", "pkg-skiing"].includes(p.id))
  );

  // 3. Honeymoon Special (Packages)
  const honeymoonPkgs = sortItems(
    packages.filter(p => p.sections?.includes("honeymoon")).length > 0
      ? packages.filter(p => p.sections?.includes("honeymoon"))
      : packages.filter(p => p.id === "pkg-almaty" || p.destinationId === "almaty")
  );

  // 4. Domestic Tours (Destinations)
  const domesticDests = sortItems(
    destinations.filter(d => d.sections?.includes("domestic")).length > 0
      ? destinations.filter(d => d.sections?.includes("domestic"))
      : destinations.filter(d => ["ladakh", "kashmir", "kerala", "goa", "rajasthan"].includes(d.id))
  );

  // 5. Explore Destinations (Destinations)
  const exploreDests = sortItems(
    destinations.filter(d => d.sections?.includes("explore")).length > 0
      ? destinations.filter(d => d.sections?.includes("explore"))
      : destinations.filter(d => ["maldives", "canada", "italy"].includes(d.id))
  );

  return (
    <section id="destinations" className="relative py-20 overflow-hidden bg-abyss">
      <div className="absolute inset-0 bg-abyss z-0" />
      <div className="absolute inset-0 bg-gradient-to-b from-abyss via-deep-space to-abyss opacity-80 z-0" />

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-16 space-y-16 md:space-y-20">

        {/* ============================================================
           1. EXPERT PICKS ITINERARIES
           ============================================================ */}
        <div>
          <div className="flex items-center gap-3 mb-6 md:mb-8">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-text-primary" style={{ fontFamily: "var(--font-headline)" }}>
              Expert Picks Itineraries
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-cyan to-transparent opacity-20" />
          </div>

          <Carousel>
            {expertPickDests.map((dest) => (
              <Link 
                href={`/destinations/${dest.id}`} 
                key={dest.id} 
                className="relative aspect-[4/3] w-[280px] sm:w-[320px] rounded-3xl overflow-hidden group hover:scale-[1.02] transition-all duration-500 border border-white/10 shadow-lg flex-shrink-0 snap-start"
              >
                <FallbackImage src={dest.image} alt={dest.name} fallbackName={dest.name} fill unoptimized={true} className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-5 left-5 flex items-center gap-2 text-white font-bold text-lg md:text-xl">
                  <MapPin size={18} className="text-cyan animate-pulse" />
                  <span style={{ fontFamily: "var(--font-headline)" }}>{dest.name}</span>
                </div>
              </Link>
            ))}
          </Carousel>
        </div>

        {/* ============================================================
           2. ADVENTURES FOR YOU
           ============================================================ */}
        <div>
          <div className="flex items-center gap-3 mb-6 md:mb-8">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-text-primary" style={{ fontFamily: "var(--font-headline)" }}>
              Adventures for you
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-orange to-transparent opacity-20" />
          </div>

          <Carousel>
            {adventurePkgs.map((pkg) => (
              <Link 
                href={`/packages/${pkg.id}`} 
                key={pkg.id} 
                className="relative aspect-[3/4] w-[240px] sm:w-[280px] rounded-none overflow-hidden group hover:scale-[1.02] transition-all duration-500 border border-white/10 shadow-lg flex-shrink-0 snap-start"
              >
                <FallbackImage src={pkg.image} alt={pkg.name} fallbackName={pkg.name} fill unoptimized={true} className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                
                {/* White bottom banner overlapping the bottom of the card - rectangular corners */}
                <div className="absolute bottom-5 left-4 right-4 bg-white text-black p-3.5 rounded-none flex items-center gap-3 shadow-2xl transition-all duration-300 group-hover:bg-cyan group-hover:text-white">
                  <div className="p-2 rounded-xl bg-black/5 transition-colors group-hover:bg-white/20">
                    {getAdventureIcon(pkg.id)}
                  </div>
                  <span className="font-bold text-sm md:text-base tracking-wide truncate" style={{ fontFamily: "var(--font-headline)" }}>
                    {pkg.name.replace(" Adventure", "").replace(" in River Rapids", "").replace(" Tandem Flight", "").replace(" Experience", "")}
                  </span>
                </div>
              </Link>
            ))}
          </Carousel>
        </div>

        {/* ============================================================
           3. HONEYMOON SPECIAL WIDE BANNER
           ============================================================ */}
        {honeymoonPkgs.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-6 md:mb-8">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-text-primary" style={{ fontFamily: "var(--font-headline)" }}>
                Honeymoon
              </h2>
              <div className="flex-1 h-px bg-gradient-to-r from-pink-400 to-transparent opacity-20" />
            </div>

            <HoneymoonCarousel packages={honeymoonPkgs} />
          </div>
        )}

        {/* ============================================================
           4. DOMESTIC TOURS
           ============================================================ */}
        <div>
          <div className="flex items-center gap-3 mb-6 md:mb-8">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-text-primary" style={{ fontFamily: "var(--font-headline)" }}>
              Domestic Tours
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-amber-400 to-transparent opacity-20" />
          </div>

          <Carousel>
            {domesticDests.map((dest) => (
              <Link 
                href={`/destinations/${dest.id}`} 
                key={dest.id} 
                className="relative aspect-[3/5] w-[185px] sm:w-[220px] rounded-none overflow-hidden group hover:scale-[1.02] transition-all duration-500 border border-black/10 dark:border-white/10 shadow-lg flex-shrink-0 snap-start"
              >
                <FallbackImage src={dest.image} alt={dest.name} fallbackName={dest.name} fill unoptimized={true} className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/10 to-transparent" />
                <div className="absolute bottom-6 left-0 right-0 text-center px-4">
                  <span className="text-white font-bold text-base md:text-lg block transition-colors group-hover:text-cyan" style={{ fontFamily: "var(--font-headline)" }}>
                    {dest.name}
                  </span>
                </div>
              </Link>
            ))}
          </Carousel>
        </div>

        {/* ============================================================
           5. EXPLORE DESTINATIONS - Shows 3 images at a time with carousel navigation
           ============================================================ */}
        <div>
          <div className="flex items-center gap-3 mb-6 md:mb-8">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-text-primary" style={{ fontFamily: "var(--font-headline)" }}>
              Explore Destinations
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-violet to-transparent opacity-20" />
          </div>

          <Carousel>
            {exploreDests.map((dest) => {
              const packageCount = packages.filter(pkg => pkg.destinationId === dest.id).length;
              return (
                <Link 
                  href={`/destinations/${dest.id}`} 
                  key={dest.id} 
                  className="relative aspect-[3/4] w-full sm:w-[calc((100%-24px)/2)] md:w-[calc((100%-48px)/3)] rounded-none overflow-hidden group hover:scale-[1.02] transition-all duration-500 border border-white/10 shadow-lg flex-shrink-0 snap-start"
                >
                  <FallbackImage src={dest.image} alt={dest.name} fallbackName={dest.name} fill unoptimized={true} className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="text-white font-bold text-2xl flex items-center gap-2 mb-2">
                      <MapPin size={22} className="text-cyan" />
                      <span style={{ fontFamily: "var(--font-headline)" }}>{dest.name}</span>
                    </div>
                    <div className="h-px bg-white/20 my-3" />
                    <div className="flex items-center justify-between text-sm text-text-secondary">
                      <span className="font-semibold" style={{ fontFamily: "var(--font-body)" }}>
                        {packageCount > 0 ? `${packageCount}+ Tour Packages` : "Custom Packages"}
                      </span>
                      <span className="text-orange font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform" style={{ fontFamily: "var(--font-headline)" }}>
                        Explore →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </Carousel>
        </div>

        {/* ============================================================
           6. SERVICES SECTION
           ============================================================ */}
        <div id="services" className="scroll-mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-text-primary" style={{ fontFamily: "var(--font-headline)" }}>
              Our Services
            </h2>
            <p className="text-text-secondary text-sm md:text-base mt-2" style={{ fontFamily: "var(--font-body)" }}>
              We provide professional support to ensure a worry-free travel experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Visa Support */}
            <div className="glass p-8 rounded-3xl border border-white/5 hover:border-white/10 transition-all flex flex-col items-center text-center">
              <div className="p-4 rounded-2xl bg-cyan-subtle border border-cyan/20 text-cyan mb-6">
                <FileText size={28} />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3" style={{ fontFamily: "var(--font-headline)" }}>
                Visa Support
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Comprehensive visa guidance, document checking, and application processing support.
              </p>
            </div>

            {/* Card 2: Passport Support */}
            <div className="glass p-8 rounded-3xl border border-white/5 hover:border-white/10 transition-all flex flex-col items-center text-center">
              <div className="p-4 rounded-2xl bg-orange-glow/10 border border-orange/20 text-orange mb-6">
                <Globe size={28} />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3" style={{ fontFamily: "var(--font-headline)" }}>
                Passport Support
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Assistance with fresh applications, re-issues, renewals, and tatkaal scheduling.
              </p>
            </div>

            {/* Card 3: Travel Support */}
            <div className="glass p-8 rounded-3xl border border-white/5 hover:border-white/10 transition-all flex flex-col items-center text-center">
              <div className="p-4 rounded-2xl bg-violet-glow/10 border border-violet/20 text-violet mb-6">
                <Headphones size={28} />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3" style={{ fontFamily: "var(--font-headline)" }}>
                Travel Support
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Flight booking assistance, local bus transfers, train reservations, and overall transport support.
              </p>
            </div>
          </div>
        </div>

        {/* ============================================================
           7. WHY CHOOSE US
           ============================================================ */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-text-primary" style={{ fontFamily: "var(--font-headline)" }}>
              Why Choose Us
            </h2>
            <p className="text-text-secondary text-sm md:text-base mt-2" style={{ fontFamily: "var(--font-body)" }}>
              We believe that travel is more than just visiting new places.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="glass p-8 rounded-3xl border border-white/5 hover:border-white/10 transition-all flex flex-col items-center text-center">
              <div className="p-4 rounded-2xl bg-cyan-subtle border border-cyan/20 text-cyan mb-6">
                <Award size={28} />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3" style={{ fontFamily: "var(--font-headline)" }}>
                500+ Destinations
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Handpicked locations across the globe for every kind of traveler.
              </p>
            </div>

            {/* Card 2 */}
            <div className="glass p-8 rounded-3xl border border-white/5 hover:border-white/10 transition-all flex flex-col items-center text-center">
              <div className="p-4 rounded-2xl bg-orange-glow/10 border border-orange/20 text-orange mb-6">
                <DollarSign size={28} />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3" style={{ fontFamily: "var(--font-headline)" }}>
                Best Price Guarantee
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                We match any price – luxury travel without the luxury price tag.
              </p>
            </div>

            {/* Card 3 */}
            <div className="glass p-8 rounded-3xl border border-white/5 hover:border-white/10 transition-all flex flex-col items-center text-center">
              <div className="p-4 rounded-2xl bg-violet-glow/10 border border-violet/20 text-violet mb-6">
                <MessageSquare size={28} />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3" style={{ fontFamily: "var(--font-headline)" }}>
                Top Notch Support
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                24/7 dedicated support – just a WhatsApp message away.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
