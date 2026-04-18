/**
 * Skeleton Loading Components
 * Tailwind-based skeleton loaders for improved perceived performance.
 * Shows structure while content is loading.
 */

import React from 'react';

// ==================== Base Skeleton ====================

/**
 * Base animated skeleton component
 * @param {string} className - Tailwind classes for size/shape
 */
export const Skeleton = ({ className = 'h-12 w-full' }) => (
  <div className={`${className} bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse rounded`} />
);

// ==================== Card Skeletons ====================

/**
 * EventCard skeleton - matches EventCard.jsx dimensions
 */
export const EventCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md p-4">
    {/* Image placeholder */}
    <Skeleton className="h-32 w-full mb-3 rounded" />
    
    {/* Title */}
    <Skeleton className="h-5 w-3/4 mb-2 rounded" />
    
    {/* Description lines */}
    <Skeleton className="h-3 w-full mb-2 rounded" />
    <Skeleton className="h-3 w-5/6 mb-3 rounded" />
    
    {/* Meta info - date/location row */}
    <div className="flex gap-2 mb-3">
      <Skeleton className="h-3 w-1/3 rounded" />
      <Skeleton className="h-3 w-1/3 rounded" />
    </div>
    
    {/* Button */}
    <Skeleton className="h-10 w-full rounded" />
  </div>
);

/**
 * EventCard skeleton list - typically 3-4 cards
 * @param {number} count - Number of skeleton cards (default: 3)
 */
export const EventCardListSkeleton = ({ count = 3 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {Array(count).fill(0).map((_, i) => (
      <EventCardSkeleton key={i} />
    ))}
  </div>
);

/**
 * Map region info card skeleton
 */
export const MapPreviewCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md p-3">
    {/* Region image */}
    <Skeleton className="h-24 w-full mb-2 rounded" />
    
    {/* Region name */}
    <Skeleton className="h-4 w-2/3 mb-1 rounded" />
    
    {/* Small text */}
    <Skeleton className="h-3 w-1/2 rounded" />
  </div>
);

// ==================== Event Detail Skeleton ====================

/**
 * Event detail page skeleton
 */
export const EventDetailSkeleton = () => (
  <div className="space-y-4">
    {/* Hero image */}
    <Skeleton className="h-64 w-full rounded-lg" />
    
    {/* Title + organizer section */}
    <div className="space-y-3">
      <Skeleton className="h-8 w-3/4 rounded" />
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-4 w-1/4 rounded" />
      </div>
    </div>
    
    {/* Info cards (date, location, capacity) */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {Array(3).fill(0).map((_, i) => (
        <div key={i} className="bg-surface-light dark:bg-surface-dark p-4 rounded-lg">
          <Skeleton className="h-3 w-1/2 mb-2 rounded" />
          <Skeleton className="h-5 w-3/4 rounded" />
        </div>
      ))}
    </div>
    
    {/* Description section */}
    <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-lg space-y-3">
      <Skeleton className="h-5 w-1/3 rounded" />
      <Skeleton className="h-3 w-full rounded" />
      <Skeleton className="h-3 w-full rounded" />
      <Skeleton className="h-3 w-2/3 rounded" />
    </div>
    
    {/* Register button */}
    <Skeleton className="h-12 w-full rounded-lg" />
  </div>
);

// ==================== Profile Page Skeleton ====================

/**
 * User profile page skeleton
 */
export const ProfilePageSkeleton = () => (
  <div className="space-y-6">
    {/* Header with avatar */}
    <div className="flex items-center gap-4 mb-6">
      <Skeleton className="h-20 w-20 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-6 w-1/2 rounded" />
        <Skeleton className="h-4 w-1/3 rounded" />
      </div>
    </div>
    
    {/* Stats cards */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {Array(4).fill(0).map((_, i) => (
        <div key={i} className="bg-surface-light dark:bg-surface-dark p-3 rounded-lg">
          <Skeleton className="h-3 w-2/3 mb-2 rounded" />
          <Skeleton className="h-6 w-full rounded" />
        </div>
      ))}
    </div>
    
    {/* Edit section */}
    <div className="space-y-3">
      <Skeleton className="h-5 w-1/4 mb-3 rounded" />
      {Array(3).fill(0).map((_, i) => (
        <div key={i}>
          <Skeleton className="h-3 w-1/6 mb-1 rounded" />
          <Skeleton className="h-10 w-full rounded" />
        </div>
      ))}
    </div>
    
    {/* Save button */}
    <Skeleton className="h-10 w-1/4 rounded" />
  </div>
);

// ==================== List Skeletons ====================

/**
 * Leaderboard entry skeleton
 */
export const LeaderboardEntrySkeleton = () => (
  <div className="flex items-center justify-between gap-4 p-3 bg-surface-light dark:bg-surface-dark rounded-lg">
    <div className="flex items-center gap-3 flex-1">
      <Skeleton className="h-8 w-8 rounded-full" />
      <div className="flex-1 space-y-1">
        <Skeleton className="h-3 w-1/2 rounded" />
        <Skeleton className="h-2 w-1/3 rounded" />
      </div>
    </div>
    <Skeleton className="h-5 w-12 rounded" />
  </div>
);

/**
 * Leaderboard list skeleton
 * @param {number} count - Number of entries (default: 5)
 */
export const LeaderboardSkeleton = ({ count = 5 }) => (
  <div className="space-y-2">
    {Array(count).fill(0).map((_, i) => (
      <LeaderboardEntrySkeleton key={i} />
    ))}
  </div>
);

/**
 * Notification item skeleton
 */
export const NotificationSkeleton = () => (
  <div className="flex gap-3 p-3 bg-surface-light dark:bg-surface-dark rounded-lg border border-gray-200 dark:border-gray-700">
    <Skeleton className="h-4 w-4 rounded flex-shrink-0 mt-1" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-2/3 rounded" />
      <Skeleton className="h-3 w-full rounded" />
    </div>
  </div>
);

/**
 * Notifications list skeleton
 * @param {number} count - Number of notifications (default: 4)
 */
export const NotificationsListSkeleton = ({ count = 4 }) => (
  <div className="space-y-2">
    {Array(count).fill(0).map((_, i) => (
      <NotificationSkeleton key={i} />
    ))}
  </div>
);

// ==================== Form Skeleton ====================

/**
 * Form input skeleton
 */
export const FormInputSkeleton = () => (
  <div className="space-y-1">
    <Skeleton className="h-3 w-1/4 rounded" />
    <Skeleton className="h-10 w-full rounded" />
  </div>
);

/**
 * Form layout skeleton (multiple fields)
 * @param {number} fieldCount - Number of form fields (default: 3)
 */
export const FormSkeleton = ({ fieldCount = 3 }) => (
  <div className="space-y-4">
    {Array(fieldCount).fill(0).map((_, i) => (
      <FormInputSkeleton key={i} />
    ))}
    <Skeleton className="h-10 w-1/3 rounded" />
  </div>
);

// ==================== Composite Skeletons ====================

/**
 * Full page loading skeleton - matches main layout
 */
export const PageLoadingSkeleton = () => (
  <div className="min-h-screen bg-white dark:bg-gray-900 space-y-4">
    {/* Header skeleton */}
    <div className="h-16 bg-surface-light dark:bg-surface-dark" />
    
    {/* Content area */}
    <div className="container mx-auto px-4 space-y-4">
      <Skeleton className="h-8 w-1/3 rounded" />
      
      {/* Main content */}
      <Skeleton className="h-64 w-full rounded-lg" />
      <Skeleton className="h-32 w-full rounded-lg" />
    </div>
  </div>
);

/**
 * List page skeleton - header + list of items
 * @param {number} itemCount - Number of list items (default: 5)
 */
export const ListPageSkeleton = ({ itemCount = 5 }) => (
  <div className="space-y-4">
    {/* Page header */}
    <div className="mb-6">
      <Skeleton className="h-8 w-1/3 mb-2 rounded" />
      <Skeleton className="h-4 w-1/2 rounded" />
    </div>
    
    {/* Search/filter section */}
    <div className="flex gap-2 mb-4">
      <Skeleton className="h-10 flex-1 rounded" />
      <Skeleton className="h-10 w-24 rounded" />
    </div>
    
    {/* List items */}
    <div className="space-y-2">
      {Array(itemCount).fill(0).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full rounded-lg" />
      ))}
    </div>
  </div>
);

// ==================== Utility for repeated skeletons ====================

/**
 * Creates an array of repeat count
 * Used internally for mapping
 * @param {number} count - Count of items to repeat
 * @returns {array} Array of indices
 */
export const createSkeletonArray = (count) => Array(count).fill(0);
