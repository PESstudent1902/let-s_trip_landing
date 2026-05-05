import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import DestinationsSection from "@/components/DestinationsSection";
import ConciergeSection from "@/components/ConciergeSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <HeroSection />
      <DestinationsSection />
      <ConciergeSection />
      <TestimonialsSection />
      <Footer />
    </main>
  );
}
