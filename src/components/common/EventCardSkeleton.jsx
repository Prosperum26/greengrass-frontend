import React from 'react';

export const EventCardSkeleton = () => {
  return (
    <div className="bg-surface-container-low rounded-2xl sm:rounded-3xl p-3 sm:p-4 animate-pulse">
      {/* Image skeleton */}
      <div className="relative aspect-[16/10] rounded-xl sm:rounded-2xl overflow-hidden mb-4 sm:mb-5">
        <div className="w-full h-full bg-gradient-to-br from-surface-container-highest to-surface-container-low"></div>
        
        {/* Badge skeletons */}
        <div className="absolute top-2 sm:top-4 left-2 sm:left-4 flex gap-1.5 sm:gap-2">
          <div className="h-5 w-16 bg-surface-container-high rounded-md"></div>
          <div className="h-5 w-12 bg-surface-container-high rounded-md"></div>
        </div>
        
        {/* Status skeleton */}
        <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4">
          <div className="h-5 w-20 bg-surface-container-high rounded-full"></div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="px-1 sm:px-2 pb-2">
        <div className="flex justify-between items-start mb-2 sm:mb-3 gap-2">
          <div className="flex-1">
            <div className="h-6 bg-surface-container-high rounded-md mb-2"></div>
            <div className="h-4 bg-surface-container-high rounded-md w-3/4"></div>
          </div>
        </div>
        
        {/* Location skeleton */}
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <div className="w-4 h-4 bg-surface-container-high rounded-full"></div>
          <div className="h-4 bg-surface-container-high rounded-md flex-1"></div>
        </div>
        
        {/* Time skeleton */}
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <div className="w-4 h-4 bg-surface-container-high rounded-full"></div>
          <div className="h-4 bg-surface-container-high rounded-md flex-1"></div>
        </div>
        
        {/* Button skeleton */}
        <div className="h-10 bg-surface-container-high rounded-xl w-full"></div>
      </div>
    </div>
  );
};
