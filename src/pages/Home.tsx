import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Hero from "../components/Hero";
import WhyChooseUs from "../components/WhyChooseUs";
import AboutUs from "../components/AboutUs";
import FeaturedVehicles from "../components/FeaturedVehicles";
import Testimonials from "../components/Testimonials";
import TestimonialForm from "../components/TestimonialForm";
import EnquirySection from "../components/EnquirySection";
import VehicleDeliveryGallery from "../components/VehicleDeliveryGallery";
import FeaturedBanner from "../components/FeaturedBanner";

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(
      location.search
    );

    if (
      params.get("scroll") !== "enquiry"
    ) {
      return;
    }

    // Give React time to mount the Home sections.
    const timer = window.setTimeout(() => {
      const enquirySection =
        document.getElementById("enquiry");

      if (enquirySection) {
        enquirySection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

        // Remove ?scroll=enquiry from URL
        window.history.replaceState(
          {},
          "",
          "/"
        );
      }
    }, 300);

    return () => {
      window.clearTimeout(timer);
    };
  }, [location.search]);
  return (
    <main>
      <Hero />

      <FeaturedBanner />

      <FeaturedVehicles />

      <WhyChooseUs />

      <AboutUs />

      <Testimonials />

      <VehicleDeliveryGallery />

      <TestimonialForm />

      <EnquirySection />
    </main>
  );
};

export default Home;