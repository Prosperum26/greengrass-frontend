import React from 'react';
import HeroSection from './HeroSection';
import TrustSection from './TrustSection';
import FeaturesSection from './FeaturesSection';
import HowItWorksSection from './HowItWorksSection';
import HighlightEvents from './HighlightEvents';
import GamificationPreview from './GamificationPreview';
import CTASection from './CTASection';
import { useHomeData } from '../hooks/useHomeData';

export const HomePage = () => {
  const { events, leaderboard, stats, loading, error } = useHomeData();

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-primary font-medium">Đang tải dữ liệu GreenGrass...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-red-50 text-red-600 font-medium">
        Lỗi: {error}
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col bg-white overflow-hidden">
      <HeroSection stats={stats} />
      <TrustSection />
      <FeaturesSection />
      <HowItWorksSection />
      <HighlightEvents events={events} />
      <GamificationPreview stats={stats} leaderboard={leaderboard} />
      <CTASection />
    </div>
  );
};

export default HomePage;
