"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Plane, Compass, Palmtree } from "lucide-react";

const features = [
  { icon: Plane, title: "500+ Destinations", color: "text-red-500", glow: "glow-red" },
  { icon: Compass, title: "Best Price Guarantee", color: "text-red-500", glow: "glow-red" },
  { icon: Palmtree, title: "Top Notch Support", color: "text-red-500", glow: "glow-red" },
];

export default function WhyChooseUsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-24 overflow-hidden bg-abyss">
      <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-16 text-center">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white" style={{ fontFamily: "var(--font-headline)" }}>
            Why Choose Us
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            We believe that travel is more than just visiting new places.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feat, i) => (
            <motion.div key={feat.title} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.15 }}
              className="bg-white rounded-lg p-10 flex flex-col items-center justify-center gap-6 hover:-translate-y-2 transition-transform duration-300">
              <div className={`${feat.color}`}>
                <feat.icon size={48} strokeWidth={1.5} />
              </div>
              <h3 className="text-abyss font-bold text-xl" style={{ fontFamily: "var(--font-headline)" }}>{feat.title}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
