"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { MagneticButton } from "./Navbar";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!parallaxRef.current || !heroRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to(parallaxRef.current, {
        y: 200,
        scale: 1.1,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
        },
      });
    }, heroRef);
    return () => ctx.revert();
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

  useEffect(() => {
    if (!statsRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".stat-item", {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: statsRef.current,
          start: "top 90%",
        },
      });
    }, statsRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div ref={parallaxRef} className="absolute inset-0 z-0 gpu-accelerated">
        <Image src="/hero-bg.png" alt="Breathtaking aerial view of tropical waters" fill className="object-cover" priority quality={90} />
        <div className="absolute inset-0 bg-gradient-to-b from-abyss/70 via-abyss/40 to-abyss" />
        <div className="absolute inset-0 bg-gradient-to-r from-abyss/50 via-transparent to-abyss/50" />
      </div>

      {[...Array(15)].map((_, i) => (
        <div key={i} className="hero-particle absolute rounded-full bg-cyan/20" style={{ width: `${Math.random() * 4 + 2}px`, height: `${Math.random() * 4 + 2}px`, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, filter: "blur(1px)" }} />
      ))}

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-16 text-center pt-28 pb-20 md:pb-32">
        {/* Handwritten badge — like a passport stamp */}
        <motion.div initial={{ opacity: 0, scale: 0.8, rotate: -3 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }} className="mb-6 md:mb-8">
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-dashed border-cyan/30 text-cyan text-sm md:text-base tracking-wide" style={{ fontFamily: "var(--font-handwritten)" }}>
            <span className="w-2 h-2 rounded-full bg-cyan pulse-glow" />
            Curated Luxury Travel Experiences ✦
          </span>
        </motion.div>

        {/* Main headline — brush script for emotional impact */}
        <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }} className="mb-4 md:mb-6">
          <span className="block text-5xl sm:text-6xl md:text-8xl lg:text-9xl leading-[0.95] tracking-tight" style={{ fontFamily: "var(--font-brush)" }}>
            <span className="text-white">Where </span>
            <span className="bg-gradient-to-r from-cyan via-cyan-dim to-violet bg-clip-text text-transparent text-glow-cyan">Wanderlust</span>
          </span>
          <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-text-secondary mt-2 md:mt-3" style={{ fontFamily: "var(--font-handwritten)" }}>
            meets experience
          </span>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }} className="text-text-secondary text-base md:text-xl max-w-2xl mx-auto mb-10 md:mb-14 leading-relaxed px-2">
          Curated luxury travel experiences designed to make every moment extraordinary. From Bali sunsets to Dubai skylines.
        </motion.p>

        {/* CTA — organic flowing text, not a rectangular button */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}>
          <MagneticButton>
            <a href="#destinations" className="group inline-flex flex-col items-center gap-1 cursor-pointer">
              <span className="text-2xl md:text-3xl text-orange hover:text-warm transition-colors" style={{ fontFamily: "var(--font-brush)" }}>
                Discover Your Orbit
              </span>
              <span className="flex items-center gap-2">
                <span className="h-[1px] w-8 bg-gradient-to-r from-transparent to-orange group-hover:w-16 transition-all duration-500" />
                <motion.span animate={{ x: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="text-orange text-xl">✦</motion.span>
                <span className="h-[1px] w-8 bg-gradient-to-l from-transparent to-orange group-hover:w-16 transition-all duration-500" />
              </span>
            </a>
          </MagneticButton>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="mt-14 md:mt-20 hidden md:block">
          <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 2, repeat: Infinity }} className="flex flex-col items-center gap-2">
            <span className="text-text-muted text-xs tracking-[0.2em] uppercase" style={{ fontFamily: "var(--font-handwritten)" }}>Scroll to explore</span>
            <div className="w-6 h-10 rounded-full border-2 border-text-muted/30 flex items-start justify-center p-2">
              <motion.div animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-cyan" />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Stats bar */}
      <motion.div ref={statsRef} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.2, ease: [0.22, 1, 0.36, 1] }} className="absolute bottom-0 left-0 right-0 glass-strong border-t border-glass-border">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-16 py-4 md:py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[{ v: "15K+", l: "Happy Travelers" }, { v: "200+", l: "Destinations" }, { v: "98%", l: "Satisfaction" }, { v: "24/7", l: "Support" }].map((s) => (
              <div key={s.l} className="stat-item text-center">
                <p className="text-xl md:text-3xl font-bold text-cyan text-glow-cyan" style={{ fontFamily: "var(--font-brush)" }}>{s.v}</p>
                <p className="text-text-muted text-[10px] md:text-xs mt-1" style={{ fontFamily: "var(--font-handwritten)" }}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
