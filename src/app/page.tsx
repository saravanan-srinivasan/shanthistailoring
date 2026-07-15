import HeroSection from "@/components/home/HeroSection";
import MarqueeSection from "@/components/home/MarqueeSection";
import ServicesSection from "@/components/home/ServicesSection";
import GalleryPreviewSection from "@/components/home/GalleryPreviewSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import WhyUsSection from "@/components/home/WhyUsSection";
import CTABanner from "@/components/home/CTABanner";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <HeroSection />
      <MarqueeSection />
      <ServicesSection />
      <GalleryPreviewSection />
      <WhyUsSection />
      <TestimonialsSection />
      <CTABanner />
    </main>
  );
}
