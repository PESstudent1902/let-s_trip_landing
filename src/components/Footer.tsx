"use client";


import { MapPin, Phone, Mail, Camera, Globe, MessageSquare, Play } from "lucide-react";
import Link from "next/link";

const quickLinks = [
  { label: "Destinations", href: "#destinations" },
  { label: "Packages", href: "#packages" },
  { label: "AI Concierge", href: "#concierge" },
  { label: "Reviews", href: "#reviews" },
];

const destinations = ["Thailand", "Dubai", "Singapore", "Bali", "Maldives", "Vietnam"];

const socials = [
  { icon: Camera, href: "#", label: "Instagram" },
  { icon: Globe, href: "#", label: "Facebook" },
  { icon: MessageSquare, href: "#", label: "Twitter" },
  { icon: Play, href: "#", label: "Youtube" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-glass-border">
      <div className="absolute inset-0 bg-gradient-to-t from-[#020810] to-abyss" />
      
      <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-16 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-block mb-6">
              <span className="text-3xl font-bold text-glow-cyan" style={{ fontFamily: "var(--font-headline)" }}>
                <span className="text-cyan">Lets</span><span className="text-text-primary">Trip</span>
              </span>
            </Link>
            <p className="text-text-secondary text-sm leading-relaxed mb-6">
              Curated luxury travel experiences designed to make every moment extraordinary. Your journey begins here.
            </p>
            <div className="flex gap-3">
              {socials.map((s) => (
                <a key={s.label} href={s.href} aria-label={s.label}
                  className="p-2.5 glass rounded-xl hover:border-cyan/30 hover:text-cyan transition-all text-text-muted">
                  <s.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold tracking-[0.15em] uppercase text-text-muted mb-6" style={{ fontFamily: "var(--font-headline)" }}>Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-text-secondary hover:text-cyan transition-colors text-sm">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Destinations */}
          <div>
            <h4 className="text-sm font-bold tracking-[0.15em] uppercase text-text-muted mb-6" style={{ fontFamily: "var(--font-headline)" }}>Destinations</h4>
            <ul className="space-y-3">
              {destinations.map((d) => (
                <li key={d}>
                  <Link href="#destinations" className="text-text-secondary hover:text-cyan transition-colors text-sm flex items-center gap-2">
                    <MapPin size={12} className="text-cyan/50" /> {d}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold tracking-[0.15em] uppercase text-text-muted mb-6" style={{ fontFamily: "var(--font-headline)" }}>Get In Touch</h4>
            <ul className="space-y-4">
              <li>
                <a href="https://wa.me/918867767171" className="flex items-center gap-3 text-text-secondary hover:text-green-400 transition-colors text-sm group">
                  <div className="p-2 glass rounded-lg group-hover:border-green-400/30 transition-all">
                    <Phone size={14} className="text-green-400" />
                  </div>
                  +91 88677 67171
                </a>
              </li>
              <li>
                <a href="mailto:connect@letstrip.co.in" className="flex items-center gap-3 text-text-secondary hover:text-cyan transition-colors text-sm group">
                  <div className="p-2 glass rounded-lg group-hover:border-cyan/30 transition-all">
                    <Mail size={14} className="text-cyan" />
                  </div>
                  connect@letstrip.co.in
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-glass-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-text-muted text-xs">© 2026 LetsTrip. All rights reserved. Crafted with ✦ for wanderers.</p>
          <div className="flex gap-6 text-text-muted text-xs">
            <Link href="#" className="hover:text-cyan transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-cyan transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-cyan transition-colors">Cancellation Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
