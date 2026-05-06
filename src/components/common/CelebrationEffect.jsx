import React, { useEffect, useState } from 'react';

export const CelebrationEffect = ({ active, duration = 3000 }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (active) {
      const timer = setTimeout(() => {
        const newParticles = Array.from({ length: 30 }, (_, i) => ({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          delay: Math.random() * 1000,
          duration: 2000 + Math.random() * 2000,
          color: ['#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#8b5cf6'][Math.floor(Math.random() * 5)]
        }));
        setParticles(newParticles);

        const cleanupTimer = setTimeout(() => {
          setParticles([]);
        }, duration);

        return () => clearTimeout(cleanupTimer);
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [active, duration]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 rounded-full animate-pulse"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            backgroundColor: particle.color,
            animation: `celebrate ${particle.duration}ms ease-out ${particle.delay}ms forwards`,
            boxShadow: `0 0 6px ${particle.color}`
          }}
        />
      ))}
      <style jsx>{`
        @keyframes celebrate {
          0% {
            transform: translateY(0) scale(0);
            opacity: 1;
          }
          50% {
            transform: translateY(-100px) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-200px) scale(0.3);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
