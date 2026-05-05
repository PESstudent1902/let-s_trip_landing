"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Search, Calendar, Users, Wallet } from "lucide-react";
import { MagneticButton } from "./Navbar";
import Image from "next/image";
import gsap from "gsap";

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (parallaxRef.current) {
            const scrollY = window.scrollY;
            parallaxRef.current.style.transform = `translate3d(0, ${scrollY * 0.4}px, 0) scale(${1 + scrollY * 0.0003})`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const particles = document.querySelectorAll(".hero-particle");
      particles.forEach((particle) => {
        gsap.to(particle, {
          y: "random(-100, 100)",
          x: "random(-50, 50)",
          opacity: "random(0.2, 0.8)",
          duration: "random(3, 8)",
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div ref={parallaxRef} className="absolute inset-0 z-0">
        <Image src="/hero-bg.png" alt="Breathtaking aerial view of tropical waters" fill className="object-cover" priority quality={90} />
        <div className="absolute inset-0 bg-gradient-to-b from-abyss/80 via-abyss/50 to-abyss" />
        <div className="absolute inset-0 bg-gradient-to-r from-abyss/60 via-transparent to-abyss/60" />
      </div>

      {[...Array(15)].map((_, i) => (
        <div key={i} className="hero-particle absolute rounded-full bg-cyan/20" style={{ width: `${Math.random() * 4 + 2}px`, height: `${Math.random() * 4 + 2}px`, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, filter: "blur(1px)" }} />
      ))}

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-16 text-center pt-24 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-cyan text-xs font-semibold tracking-[0.15em] uppercase" style={{ fontFamily: "var(--font-headline)" }}>
            <span className="w-2 h-2 rounded-full bg-cyan pulse-glow" />
            Curated Luxury Travel Experiences
          </span>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }} className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight mb-6 text-glow-cyan" style={{ fontFamily: "var(--font-headline)" }}>
          Where Wanderlust<br />
          <span className="bg-gradient-to-r from-cyan via-cyan-dim to-violet bg-clip-text text-transparent">Meets Experience</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.7 }} className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
          Curated luxury travel experiences designed to make every moment extraordinary. From Bali sunsets to Dubai skylines.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 40, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.8, delay: 0.9 }} className="glass rounded-2xl p-4 md:p-6 max-w-4xl mx-auto floating">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <SearchField icon={<Search size={18} />} label="Destination" placeholder="Where to?" />
            <SearchField icon={<Calendar size={18} />} label="Travel Dates" placeholder="Select dates" />
            <SearchField icon={<Users size={18} />} label="Travelers" placeholder="2 Adults" />
            <SearchField icon={<Wallet size={18} />} label="Budget" placeholder="₹50K - ₹1L" />
          </div>
          <div className="mt-4 flex justify-center">
            <MagneticButton>
              <a href="#destinations" className="px-10 py-3.5 bg-orange text-white font-bold rounded-xl text-base hover:shadow-[0_0_40px_rgba(255,107,53,0.5)] transition-all duration-300 active:scale-95 cursor-pointer inline-block" style={{ fontFamily: "var(--font-headline)" }}>
                Discover Your Orbit ✦
              </a>
            </MagneticButton>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="mt-16">
          <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 2, repeat: Infinity }} className="flex flex-col items-center gap-2">
            <span className="text-text-muted text-xs tracking-[0.2em] uppercase" style={{ fontFamily: "var(--font-headline)" }}>Scroll to explore</span>
            <div className="w-6 h-10 rounded-full border-2 border-text-muted/30 flex items-start justify-center p-2">
              <motion.div animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-cyan" />
            </div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.2 }} className="absolute bottom-0 left-0 right-0 glass-strong border-t border-glass-border">
        <div className="max-w-[1440px] mx-auto px-6 md:px-16 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[{ v: "15K+", l: "Happy Travelers" }, { v: "200+", l: "Destinations" }, { v: "98%", l: "Satisfaction" }, { v: "24/7", l: "Support" }].map((s) => (
              <div key={s.l} className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-cyan text-glow-cyan" style={{ fontFamily: "var(--font-headline)" }}>{s.v}</p>
                <p className="text-text-muted text-xs mt-1 tracking-wide">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function SearchField({ icon, label, placeholder }: { icon: React.ReactNode; label: string; placeholder: string }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-cyan/30 transition-all duration-300 group cursor-pointer">
      <div className="text-cyan/60 group-hover:text-cyan transition-colors">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-text-muted uppercase tracking-[0.15em] font-semibold mb-0.5" style={{ fontFamily: "var(--font-headline)" }}>{label}</p>
        <p className="text-text-secondary text-sm truncate">{placeholder}</p>
      </div>
    </div>
  );
}
