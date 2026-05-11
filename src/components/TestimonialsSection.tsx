"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";
import Image from "next/image";

const testimonials = [
  {
    text: "Our family took a trip to Indonesia this summer booked through LetsTrip. All of the flights, went smoothly and there was an english speaking tour guide to pick us up at each location. The tour guides were very friendly and a pleasure to be with. The accommodations at each location were even better than expected! During the planning phase it was nice to be able to go back and forth and change things up until we created a trip that was perfect for our family and our budget.",
    name: "Priya & Raj Sharma",
    date: "June 2025",
    rating: "5/5",
    image: "/bali.png",
  },
  {
    text: "Our Dubai trip was magical! The kids loved the desert safari and we felt so well taken care of. LetsTrip handled everything from airport pickup to every single activity. Five-star treatment from booking to return. This is the only travel agency I trust now.",
    name: "Arjun M.",
    date: "August 2025",
    rating: "5/5",
    image: "/dubai.png",
  },
  {
    text: "The cultural immersion in Thailand was unforgettable. Our guide knew every hidden gem, every secret temple, every authentic restaurant. We felt like locals. Truly unforgettable.",
    name: "Meera K.",
    date: "September 2025",
    rating: "4.9/5",
    image: "/thailand.png",
  },
  {
    text: "The Singapore-Malaysia cruise package blew our minds. Incredible value for money and seamless planning! The support team was always just a WhatsApp message away!",
    name: "Vikram P.",
    date: "December 2025",
    rating: "5/5",
    image: "/singapore.png",
  },
];

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="reviews" className="relative h-screen min-h-[700px] w-full overflow-hidden flex items-center bg-abyss">
      {/* Background Images */}
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={testimonials[currentIndex].image}
            alt="Background"
            fill
            className="object-cover"
            priority
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-abyss via-abyss/80 to-transparent" />
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 sm:px-10 md:px-16 lg:px-24 py-20 flex flex-col items-start justify-end h-full text-left">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl sm:text-5xl md:text-6xl text-white mb-10 tracking-tight font-light"
          style={{ fontFamily: "var(--font-headline)" }}
        >
          What our guests say
        </motion.h2>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <div className="flex gap-2 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={32} className="text-white fill-white drop-shadow-lg" />
              ))}
            </div>

            <div className="flex items-center gap-4 text-white/80 text-sm mb-8 font-medium tracking-wide">
              <span>{testimonials[currentIndex].date}</span>
              <span className="w-px h-4 bg-white/40" />
              <span>Rating {testimonials[currentIndex].rating}</span>
            </div>

            <p className="text-white text-lg sm:text-xl md:text-2xl leading-relaxed mb-10 max-w-3xl drop-shadow-md">
              {testimonials[currentIndex].text}
            </p>

            <div className="w-16 h-px bg-white mb-6" />

            <h3 className="text-white text-xl sm:text-2xl font-bold tracking-wide" style={{ fontFamily: "var(--font-headline)" }}>
              {testimonials[currentIndex].name}
            </h3>
          </motion.div>
        </AnimatePresence>

        {/* Pagination Dots */}
        <div className="flex gap-3 mt-16 md:mt-24">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className="group py-2"
              aria-label={`Go to slide ${i + 1}`}
            >
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentIndex ? "w-10 bg-white" : "w-6 bg-white/30 group-hover:bg-white/60"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
