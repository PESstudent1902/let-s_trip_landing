import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import DestinationsSection from "@/components/DestinationsSection";
import WhyChooseUsSection from "@/components/WhyChooseUsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";
import MobileWhatsAppCTA from "@/components/MobileWhatsAppCTA";
import ItineraryManager from "@/components/ItineraryManager";

export default function Home() {
  return (
    <main className="relative">
      <ItineraryManager />
      <Navbar />
      <HeroSection />
      <DestinationsSection />
      <WhyChooseUsSection />
      <TestimonialsSection />
      <Footer />
      <MobileWhatsAppCTA />
    </main>
  );
}
// Trigger Vercel Redeployment for Env Vars
