"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star, Quote, Shield, Heart, ThumbsUp } from "lucide-react";

const testimonials = [
  {
    text: "Our Dubai trip was magical! The kids loved the desert safari and we felt so well taken care of. LetsTrip handled everything from airport pickup to every single activity.",
    name: "Priya & Raj Sharma", sub: "Family of 4", tag: "Family", tagColor: "bg-cyan/20 text-cyan", size: "large",
  },
  {
    text: "Bali was a dream come true. The private villa, the sunset dinners... everything was perfect for our honeymoon. Truly unforgettable.",
    name: "Anita & Karan", sub: "Newlyweds", tag: "Honeymoon", tagColor: "bg-pink-500/20 text-pink-400", size: "medium",
  },
  {
    text: "Traveled solo to Thailand and never felt alone. The support team was always just a WhatsApp message away!",
    name: "Vikram P.", sub: "Solo Traveler", tag: "Solo", tagColor: "bg-violet/20 text-violet", size: "small",
  },
  {
    text: "The Singapore-Malaysia cruise package blew our minds. Incredible value for money and seamless planning!",
    name: "Neha's Group", sub: "Group of 6", tag: "Adventure", tagColor: "bg-orange/20 text-orange", size: "medium",
  },
  {
    text: "Five-star treatment from booking to return. This is the only travel agency I trust now.",
    name: "Arjun M.", sub: "Business Traveler", tag: "Luxury", tagColor: "bg-gold/20 text-gold", size: "small",
  },
  {
    text: "The cultural immersion in Thailand was unforgettable. Our guide knew every hidden gem, every secret temple, every authentic restaurant. We felt like locals.",
    name: "Meera K.", sub: "Culture Explorer", tag: "Culture", tagColor: "bg-green-500/20 text-green-400", size: "large",
  },
];


export default function TestimonialsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} id="reviews" className="relative py-20 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-abyss via-deep-space to-abyss" />
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full bg-violet/5 blur-[150px]" />

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-16">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="text-center mb-10 md:mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-gold text-xs font-semibold tracking-[0.15em] uppercase mb-4 md:mb-6" style={{ fontFamily: "var(--font-headline)" }}>
            <Star size={14} fill="currentColor" /> Trusted by Thousands
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-3 md:mb-4" style={{ fontFamily: "var(--font-headline)" }}>
            What Travelers <span className="bg-gradient-to-r from-gold via-orange to-violet bg-clip-text text-transparent">Say</span>
          </h2>
          <p className="text-text-secondary text-base md:text-lg max-w-xl mx-auto">Real stories from real adventurers who trusted LetsTrip</p>
        </motion.div>

        {/* Masonry Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 md:gap-6 space-y-4 md:space-y-6">
          {testimonials.map((t, i) => (
            <motion.div key={t.name} initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="break-inside-avoid glass rounded-2xl p-5 md:p-6 hover:border-cyan/20 transition-all duration-300 group">
              {/* Quote Icon */}
              <Quote className="text-cyan/20 mb-3" size={24} />
              
              {/* Stars */}
              <div className="flex gap-1 mb-3 md:mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={14} className="text-gold fill-gold" />
                ))}
              </div>

              {/* Text */}
              <p className="text-text-secondary text-sm leading-relaxed mb-5 md:mb-6">&ldquo;{t.text}&rdquo;</p>

              {/* Author */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-cyan to-violet flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ fontFamily: "var(--font-headline)" }}>
                    {t.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate" style={{ fontFamily: "var(--font-headline)" }}>{t.name}</p>
                    <p className="text-text-muted text-xs">{t.sub}</p>
                  </div>
                </div>
                <span className={`px-2.5 md:px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase flex-shrink-0 ${t.tagColor}`} style={{ fontFamily: "var(--font-headline)" }}>
                  {t.tag}
                </span>
              </div>
            </motion.div>
          ))}
        </div>


      </div>
    </section>
  );
}
