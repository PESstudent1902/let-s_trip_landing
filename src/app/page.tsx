import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import DestinationsSection from "@/components/DestinationsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";
import MobileInquiryCTA from "@/components/MobileInquiryCTA";

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <HeroSection />
      <DestinationsSection />
      <TestimonialsSection />
      <Footer />
      <MobileInquiryCTA />
    </main>
  );
}
// Trigger Vercel Redeployment for Revert to May 24th State - 1
