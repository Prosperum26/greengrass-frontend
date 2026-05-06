import React, { useState, useEffect, useRef } from 'react';

export const AnimatedPointsDisplay = ({ points, previousPoints = 0, showLevelUp = true }) => {
  const [displayPoints, setDisplayPoints] = useState(previousPoints);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showLevelUpAnimation, setShowLevelUpAnimation] = useState(false);
  const animationRef = useRef(null);

  useEffect(() => {
    if (points !== previousPoints && points > previousPoints) {
      const timer = setTimeout(() => {
        setIsAnimating(true);
        const duration = 1500;
        const steps = 30;
        const increment = (points - previousPoints) / steps;
        let current = previousPoints;
        
        animationRef.current = setInterval(() => {
          current += increment;
          if (current >= points) {
            current = points;
            setDisplayPoints(Math.floor(current));
            setIsAnimating(false);
            clearInterval(animationRef.current);
            
            // Check for level up (every 100 points)
            if (showLevelUp && Math.floor(points / 100) > Math.floor(previousPoints / 100)) {
              setShowLevelUpAnimation(true);
              setTimeout(() => setShowLevelUpAnimation(false), 3000);
            }
          } else {
            setDisplayPoints(Math.floor(current));
          }
        }, duration / steps);
      }, 0);
      
      return () => {
        clearTimeout(timer);
        if (animationRef.current) {
          clearInterval(animationRef.current);
        }
      };
    } else {
      const timer = setTimeout(() => {
        setDisplayPoints(points);
      }, 0);
      return () => {
        clearTimeout(timer);
        if (animationRef.current) {
          clearInterval(animationRef.current);
        }
      };
    }
  }, [points, previousPoints, showLevelUp]);

  const currentLevel = Math.floor(displayPoints / 100) + 1;
  const nextLevelPoints = currentLevel * 100;
  const progress = ((displayPoints % 100) / 100) * 100;

  return (
    <div className="relative">
      {/* Level Up Animation */}
      {showLevelUpAnimation && (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <div className="animate-bounce text-4xl font-bold text-primary animate-pulse">
            🎉 LEVEL UP! 🎉
          </div>
        </div>
      )}
      
      {/* Points Display */}
      <div className={`text-center transition-all duration-300 ${isAnimating ? 'scale-110' : 'scale-100'}`}>
        <div className="relative inline-block">
          <div className="text-3xl sm:text-4xl font-extrabold font-display text-primary">
            {displayPoints.toLocaleString()}
          </div>
          {isAnimating && (
            <div className="absolute -top-2 -right-2 text-xs font-bold text-accent animate-pulse">
              +{points - previousPoints}
            </div>
          )}
        </div>
        
        {/* Level Progress */}
        {showLevelUp && (
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between text-xs text-ink/60">
              <span>Level {currentLevel}</span>
              <span>{nextLevelPoints - (displayPoints % 100)} to Level {currentLevel + 1}</span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-surface-highest rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-1000 ease-out rounded-full relative"
                style={{ width: `${progress}%` }}
              >
                {isAnimating && (
                  <div className="absolute inset-0 bg-white/30 animate-pulse" />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
