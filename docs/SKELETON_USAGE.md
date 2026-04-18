/**
 * Skeleton Component Usage Examples
 * Shows how to integrate loading skeletons into existing components.
 */

import React, { useState, useEffect } from 'react';
import { EventCardListSkeleton, ProfilePageSkeleton, EventDetailSkeleton } from '../components/common/Skeleton';
import { eventsApi } from '../api';
import { useError } from '../hooks';

// ==================== Example 1: HomePage Events with Skeleton ====================

/**
 * HomePage with EventCard list and skeleton loading state
 * Replaces white loader with EventCard-shaped skeleton
 */
export const HomePageWithSkeleton = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addError } = useError();

  useEffect(() => {
    const loadEvents = async () => {
      setIsLoading(true);
      try {
        const response = await eventsApi.getAll({});
        setEvents(response.data?.data || []);
      } catch (error) {
        addError('Failed to load events');
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadEvents();
  }, [addError]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Events</h1>
      
      {/* Show skeleton during loading, events when ready */}
      {isLoading ? (
        <EventCardListSkeleton count={3} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};

// ==================== Example 2: EventDetail with Skeleton ====================

/**
 * Event detail page with skeleton loading
 */
export const EventDetailWithSkeleton = ({ eventId }) => {
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addError } = useError();

  useEffect(() => {
    const loadEvent = async () => {
      setIsLoading(true);
      try {
        const response = await eventsApi.getById(eventId);
        setEvent(response.data?.data || null);
      } catch (error) {
        addError('Failed to load event');
      } finally {
        setIsLoading(false);
      }
    };

    loadEvent();
  }, [eventId, addError]);

  return (
    <div>
      {isLoading ? (
        <EventDetailSkeleton />
      ) : event ? (
        <div>
          <h1>{event.title}</h1>
          {/* Event content */}
        </div>
      ) : (
        <div>Event not found</div>
      )}
    </div>
  );
};

// ==================== Example 3: Progressive Loading Pattern ====================

/**
 * Shows skeleton for main content, then loads additional data
 * Improves perceived performance - user sees structure immediately
 */
export const ProfileWithProgressiveLoading = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const { addError } = useError();

  useEffect(() => {
    // Load user profile first (critical path)
    const loadProfile = async () => {
      try {
        const response = await usersApi.getMe();
        setUser(response.data?.data || null);
      } catch (error) {
        addError('Failed to load profile');
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadProfile();
  }, [addError]);

  useEffect(() => {
    // Load stats after profile (secondary)
    if (!user) return;
    
    const loadStats = async () => {
      try {
        const response = await pointsApi.getMe();
        setStats(response.data?.data || null);
      } catch (error) {
        addError('Failed to load stats');
      } finally {
        setIsLoadingStats(false);
      }
    };

    loadStats();
  }, [user, addError]);

  return (
    <div>
      {isLoadingProfile ? (
        <ProfilePageSkeleton />
      ) : (
        <div>
          {/* Profile content loads first */}
          <h1>{user?.firstName} {user?.lastName}</h1>
          
          {/* Stats load separately */}
          {isLoadingStats ? (
            <div className="h-24 bg-gray-100 rounded animate-pulse" />
          ) : (
            <div>{/* Stats content */}</div>
          )}
        </div>
      )}
    </div>
  );
};

// ==================== Example 4: List with Skeleton ====================

/**
 * Leaderboard with skeleton loading
 */
export const LeaderboardWithSkeleton = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addError } = useError();

  useEffect(() => {
    const loadLeaderboard = async () => {
      setIsLoading(true);
      try {
        const response = await pointsApi.getLeaderboard();
        setLeaderboard(response.data?.data || []);
      } catch (error) {
        addError('Failed to load leaderboard');
      } finally {
        setIsLoading(false);
      }
    };

    loadLeaderboard();
  }, [addError]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
      
      {isLoading ? (
        <div className="space-y-2">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      ) : (
        <div>
          {leaderboard.map(entry => (
            <LeaderboardEntry key={entry.userId} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
};

// ==================== Best Practices ====================

/**
 * DO: Use skeleton loading for initial page loads
 * - Shows content structure immediately
 * - Feels faster even if network is slow
 * - Prevents layout shift when content loads
 */
export const BestPractices = () => {
  return (
    <div>
      {/* ✅ Good: Skeleton shows structure during load */}
      {isLoading ? (
        <EventCardListSkeleton />
      ) : (
        <EventList events={events} />
      )}
      
      {/* ❌ Avoid: Generic spinner loses context */}
      {/* {isLoading && <Spinner />} */}
      {/* {!isLoading && <EventList />} */}
    </div>
  );
};

/**
 * Layout Shift Mitigation
 * Skeleton has exact same dimensions as real component
 * Prevents visual jank when content appears
 */
export const DimensionMatching = () => {
  // EventCardSkeleton: 
  //   - 32px padding
  //   - 128px image height
  //   - Matches EventCard.jsx dimensions
  
  // When EventCard replaces skeleton:
  //   - Same size = no layout shift
  //   - Smooth transition
  //   - Professional feel
};

/**
 * Accessibility Considerations
 * Skeleton is decorative - not interactive
 * Screen readers skip it (no semantic meaning)
 * Real content is what matters for a11y
 */
export const AccessibilityPattern = () => {
  return (
    <div>
      {isLoading && <EventCardSkeleton aria-hidden="true" />}
      {!isLoading && <EventCard event={event} />}
    </div>
  );
};

// ==================== Integration Checklist ====================

/**
 * To add skeletal loading to a component:
 * 
 * 1. Identify loading pattern
 *    - Is it a single item? Single item skeleton
 *    - Is it a list? List skeleton with count
 *    - Is it a page? Page skeleton
 * 
 * 2. Import skeleton
 *    import { EventCardSkeleton } from '../components/common';
 * 
 * 3. Add loading state
 *    const [isLoading, setIsLoading] = useState(true);
 * 
 * 4. Replace/show during load
 *    {isLoading ? <EventCardSkeleton /> : <RealComponent />}
 * 
 * 5. Test
 *    - Check dimensions match
 *    - No layout shift
 *    - Smooth transition
 * 
 * Performance Note:
 * - Skeleton rendering is negligible
 * - Network latency is the real cost
 * - UX improvement outweighs minimal render cost
 */

// ==================== Custom Skeleton Example ====================

/**
 * Creating custom skeletons for new components
 * 
 * Pattern:
 * 1. Identify component structure
 * 2. Replace each visual element with Skeleton
 * 3. Match actual dimensions
 * 4. Name clearly (ComponentNameSkeleton)
 */

export const CustomSkeletonExample = () => {
  return (
    <div className="bg-white rounded-lg p-4 shadow">
      {/* Header section */}
      <Skeleton className="h-6 w-1/3 mb-4 rounded" />
      
      {/* Multiple items */}
      {Array(3).fill(0).map((_, i) => (
        <div key={i} className="mb-3">
          <Skeleton className="h-4 w-2/3 mb-2 rounded" />
          <Skeleton className="h-3 w-full rounded" />
        </div>
      ))}
      
      {/* Footer button */}
      <Skeleton className="h-10 w-full mt-4 rounded" />
    </div>
  );
};

/**
 * Import the base Skeleton component for custom patterns:
 * import { Skeleton } from '../components/common';
 * 
 * Then compose it for your specific needs
 */
