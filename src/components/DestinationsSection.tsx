"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { MagneticButton } from "./Navbar";
import { ArrowRight, Plane, Hotel, UtensilsCrossed, ChevronLeft, ChevronRight } from "lucide-react";

const destinations = [
  { name: "Thailand", image: "/thailand.png", duration: "7N", price: "₹62,000", tags: ["Adventure", "Culture"], description: "Ancient temples, tropical beaches, and vibrant street food" },
  { name: "Dubai", image: "/dubai.png", duration: "5N", price: "₹81,500", tags: ["Luxury", "Adventure"], description: "Futuristic skyline, golden deserts, and world-class dining" },
  { name: "Singapore", image: "/singapore.png", duration: "7N", price: "₹1,15,000", tags: ["Culture", "Luxury"], description: "Garden city wonders, hawker centers, and stunning architecture" },
  { name: "Bali", image: "/bali.png", duration: "5N", price: "₹45,000", tags: ["Relaxation", "Culture"], description: "Sacred temples, rice terraces, and serene spa retreats" },
];

const packages = [
  { name: "4N Thailand", price: "₹45,000", highlights: ["4-Star Hotel", "Sightseeing", "Transfers", "Breakfast", "Activities"], image: "/thailand.png" },
  { name: "4N Thai Ex-Blr", price: "₹52,000", highlights: ["Flights Included", "4-Star Hotel", "Transfers", "Breakfast", "City Tour"], image: "/thailand.png" },
  { name: "5N Dubai", price: "₹81,500", highlights: ["5-Star Hotel", "Return Flights", "Desert Safari", "City Tour", "All Meals"], image: "/dubai.png" },
  { name: "6N Bali", price: "₹55,000", highlights: ["Private Villa", "Spa Package", "Rice Terrace", "Breakfast", "Transfers"], image: "/bali.png" },
  { name: "7N Singapore Cruise Malaysia", price: "₹1,15,000", highlights: ["4-Star Hotels", "Cruise Included", "City Tours", "Transfers", "Half Board"], image: "/singapore.png" },
];

export default function DestinationsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (scrollContainerRef.current) {
      const amount = dir === "left" ? -400 : 400;
      scrollContainerRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  return (
    <section ref={ref} id="destinations" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-abyss via-deep-space to-abyss" />

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-16">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-cyan text-xs font-semibold tracking-[0.15em] uppercase mb-6" style={{ fontFamily: "var(--font-headline)" }}>
            <span className="w-2 h-2 rounded-full bg-cyan pulse-glow" /> Featured Destinations
          </span>
          <h2 className="text-4xl md:text-6xl font-bold text-glow-cyan mb-4" style={{ fontFamily: "var(--font-headline)" }}>
            Handpicked <span className="bg-gradient-to-r from-cyan to-violet bg-clip-text text-transparent">Experiences</span>
          </h2>
          <p className="text-text-secondary text-lg max-w-xl mx-auto">Destinations that defy gravity and exceed expectations</p>
        </motion.div>

        {/* Carousel removed from here */}

        {/* Destination Cards Carousel */}
        <div className="relative group">
          {/* Carousel Controls */}
          <button onClick={() => scroll("left")} className="absolute -left-5 top-1/2 -translate-y-1/2 z-20 p-4 glass-strong rounded-full border border-white/10 hover:border-cyan/30 hover:bg-white/10 transition-all cursor-pointer opacity-0 group-hover:opacity-100 hidden md:block backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.5)]">
            <ChevronLeft className="text-cyan" size={24} />
          </button>
          <button onClick={() => scroll("right")} className="absolute -right-5 top-1/2 -translate-y-1/2 z-20 p-4 glass-strong rounded-full border border-white/10 hover:border-cyan/30 hover:bg-white/10 transition-all cursor-pointer opacity-0 group-hover:opacity-100 hidden md:block backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.5)]">
            <ChevronRight className="text-cyan" size={24} />
          </button>

          <div ref={scrollContainerRef} className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: "none" }}>
            {destinations.map((dest, i) => (
              <DestinationCard key={dest.name} destination={dest} index={i} isInView={isInView} />
            ))}
          </div>
        </div>
      </div>

      {/* Packages Grid */}
      <div id="packages" className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-16 mt-32">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.3 }} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "var(--font-headline)" }}>
            Popular <span className="text-orange text-glow-orange">Packages</span>
          </h2>
          <p className="text-text-secondary text-lg">All-inclusive experiences at unbeatable value</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {packages.map((pkg, i) => (
            <PackageCard key={pkg.name} pkg={pkg} index={i} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
}

function DestinationCard({ destination, index, isInView }: { destination: typeof destinations[0]; index: number; isInView: boolean }) {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    
    // Throttle the animation frame to avoid excessive calculations
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    
    rafRef.current = requestAnimationFrame(() => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      cardRef.current.style.transform = `perspective(1000px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) scale(1.02)`;
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    cardRef.current.style.transform = "perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)";
    setHovered(false);
  };

  return (
    <motion.div initial={{ opacity: 0, x: 50 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: index * 0.15 }} className="min-w-[320px] md:min-w-[380px] snap-center flex-shrink-0">
      <div ref={cardRef} onMouseMove={handleMouseMove} onMouseEnter={() => setHovered(true)} onMouseLeave={handleMouseLeave}
        className="relative h-[500px] rounded-2xl overflow-hidden glass cursor-pointer group transition-all duration-300"
        style={{ transformStyle: "preserve-3d", transition: "transform 0.1s ease-out" }}>
        <Image src={destination.image} alt={destination.name} fill className={`object-cover transition-transform duration-700 ${hovered ? "scale-110" : "scale-100"}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-abyss via-abyss/40 to-transparent" />
        
        {/* Tags */}
        <div className="absolute top-4 left-4 flex gap-2 z-10">
          {destination.tags.map((tag) => (
            <span key={tag} className="px-3 py-1 glass rounded-full text-[10px] text-cyan font-semibold tracking-wider uppercase" style={{ fontFamily: "var(--font-headline)" }}>{tag}</span>
          ))}
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
          <h3 className="text-3xl font-bold mb-1" style={{ fontFamily: "var(--font-headline)" }}>{destination.name}</h3>
          <p className="text-text-secondary text-sm mb-3">{destination.description}</p>
          
          <motion.div animate={{ opacity: hovered ? 1 : 0.7, y: hovered ? 0 : 10 }} className="flex items-center justify-between">
            <div>
              <span className="text-text-muted text-xs">{destination.duration}</span>
              <span className="text-cyan text-xl font-bold ml-2 text-glow-cyan" style={{ fontFamily: "var(--font-headline)" }}>{destination.price}</span>
            </div>
            <a href="https://wa.me/918867767171" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-orange text-white text-sm font-semibold rounded-xl hover:glow-orange transition-all flex items-center gap-2 cursor-pointer inline-flex">
              Explore <ArrowRight size={14} />
            </a>
          </motion.div>
        </div>

        {/* Hover Glow Border */}
        {hovered && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{ boxShadow: "inset 0 0 0 1px rgba(0, 240, 255, 0.3), 0 0 30px rgba(0, 240, 255, 0.1)" }} />
        )}
      </div>
    </motion.div>
  );
}

function PackageCard({ pkg, index, isInView }: { pkg: typeof packages[0]; index: number; isInView: boolean }) {
  return (
    <motion.div initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
      className="glass rounded-2xl overflow-hidden group hover:border-cyan/20 transition-all duration-300">
      <div className="flex flex-col md:flex-row">
        <div className="relative h-48 md:h-auto md:w-48 flex-shrink-0">
          <Image src={pkg.image} alt={pkg.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-abyss/80 hidden md:block" />
        </div>
        <div className="p-6 flex-1">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold mb-1" style={{ fontFamily: "var(--font-headline)" }}>{pkg.name}</h3>
              <p className="text-cyan text-2xl font-bold text-glow-cyan" style={{ fontFamily: "var(--font-headline)" }}>{pkg.price}</p>
              <p className="text-text-muted text-xs">per person</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {pkg.highlights.map((h) => (
              <span key={h} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-lg text-xs text-text-secondary">
                {h.includes("Hotel") ? <Hotel size={12} className="text-cyan" /> : h.includes("Flight") ? <Plane size={12} className="text-cyan" /> : <UtensilsCrossed size={12} className="text-cyan" />}
                {h}
              </span>
            ))}
          </div>
          <MagneticButton>
            <a href="https://wa.me/918867767171" target="_blank" rel="noopener noreferrer" className="px-6 py-2.5 bg-orange text-white text-sm font-semibold rounded-xl hover:shadow-[0_0_30px_rgba(255,107,53,0.4)] transition-all cursor-pointer inline-flex items-center" style={{ fontFamily: "var(--font-headline)" }}>
              Book Now <ArrowRight size={14} className="inline ml-1" />
            </a>
          </MagneticButton>
        </div>
      </div>
    </motion.div>
  );
}
