import React from 'react';
import HeroSection from './HeroSection';
import TrustSection from './TrustSection';
import FeaturesSection from './FeaturesSection';
import HowItWorksSection from './HowItWorksSection';
import HighlightEvents from './HighlightEvents';
import GamificationPreview from './GamificationPreview';
import CTASection from './CTASection';

export const HomePage = () => {
  return (
    <div className="w-full flex flex-col bg-white overflow-hidden">
      <HeroSection />
      <TrustSection />
      <FeaturesSection />
      <HowItWorksSection />
      <HighlightEvents />
      <GamificationPreview />
      <CTASection />
    </div>
  );
};

export default HomePage;
