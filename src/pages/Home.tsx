import Hero from "../components/Hero";
import WhyChooseUs from "../components/WhyChooseUs";
import AboutUs from "../components/AboutUs";
import FeaturedVehicles from "../components/FeaturedVehicles";
import Testimonials from "../components/Testimonials";
import TestimonialForm from "../components/TestimonialForm";
import EnquirySection from "../components/EnquirySection";

const Home = () => {
  return (
    <main>
      <Hero />

      <WhyChooseUs />

      <AboutUs />

      <FeaturedVehicles />

      <Testimonials />

      <TestimonialForm />

      <EnquirySection />
    </main>
  );
};

export default Home;