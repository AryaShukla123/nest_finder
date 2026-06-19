import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedProperties from "@/components/FeaturedProperties";
import CityGrid from "@/components/CityGrid";
import HowItWorks from "@/components/HowItWorks";
import NewProjects from "@/components/NewProjects";
import Testimonials from "@/components/Testimonials";
import { ServicesBanner, CtaStrip } from "@/components/ServicesAndCta";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar activeLabel="Buy" />
      <Hero />
      <FeaturedProperties />
      <CityGrid />
      <HowItWorks />
      <NewProjects />
      <Testimonials />
      <ServicesBanner />
      <CtaStrip />
      <Footer />
    </>
  );
}