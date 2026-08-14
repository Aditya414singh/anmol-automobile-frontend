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