import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import DestinationsSection from "@/components/DestinationsSection";
import WhyChooseUsSection from "@/components/WhyChooseUsSection";
import ConciergeSection from "@/components/ConciergeSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";
import MobileWhatsAppCTA from "@/components/MobileWhatsAppCTA";
import TravelChatbot from "@/components/TravelChatbot";

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <HeroSection />
      <DestinationsSection />
      <WhyChooseUsSection />
      <ConciergeSection />
      <TestimonialsSection />
      <Footer />
      <MobileWhatsAppCTA />
      <TravelChatbot />
    </main>
  );
}
