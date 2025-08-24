import React from 'react';
import Header from "../components/sections/Header";
import Hero from "../components/sections/Hero";
import Features from "../components/sections/Features";
import Pricing from "../components/sections/Pricing";
import Testimonials from "../components/sections/Testimonials";
import FAQ from "../components/sections/FAQ";
import Footer from "../components/sections/Footer";
import RobotAssistant from "../components/robot/RobotAssistant";

const Landing = () => {
    return (
    <div className="min-h-screen bg-background relative">
      <Header />
      <main>
        <Hero />
        <Features />
        <Pricing />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
      
      {/* Robot Assistant */}
      <RobotAssistant />
    </div>
  );
};

export default Landing;
