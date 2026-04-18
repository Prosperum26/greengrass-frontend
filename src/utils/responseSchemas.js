/**
 * Response Validation Schemas
 * Validates API responses against expected backend contracts.
 * Prevents silent data errors from contract changes.
 * 
 * Backend contract source: FRONTEND_AI_CONTEXT.md
 */

import { z } from 'zod';

// ==================== Shared Schemas ====================

// Standard wrapped response (most endpoints)
const SuccessResponseSchema = z.object({
  success: z.boolean(),
  data: z.unknown(),
  message: z.string().optional(),
});

// JWT token from auth endpoints
const TokenSchema = z.string().min(10, 'Invalid token format');

const UserIdSchema = z.number().int().positive('Invalid userId');

// ==================== Auth Responses ====================

export const AuthLoginResponseSchema = z.object({
  accessToken: TokenSchema,
  refreshToken: TokenSchema,
});

export const AuthRegisterResponseSchema = z.object({
  accessToken: TokenSchema,
  refreshToken: TokenSchema,
});

export const AuthRefreshResponseSchema = z.object({
  accessToken: TokenSchema,
  refreshToken: TokenSchema,
});

// ==================== User Responses ====================

export const UserProfileSchema = z.object({
  id: UserIdSchema,
  email: z.string().email(),
  username: z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  avatar: z.string().url().optional().nullable(),
  role: z.enum(['STUDENT', 'ORGANIZER', 'ADMIN']),
  organization: z.string().optional().nullable(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'PENDING']),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const UserMeResponseSchema = SuccessResponseSchema.extend({
  data: UserProfileSchema,
});

export const UserUpdateResponseSchema = SuccessResponseSchema.extend({
  data: UserProfileSchema,
});

// ==================== Event Responses ====================

export const EventSchema = z.object({
  id: z.number().int(),
  title: z.string(),
  description: z.string().optional(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  location: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  capacity: z.number().int().positive().optional(),
  registeredCount: z.number().int().nonnegative().optional(),
  organizerId: UserIdSchema,
  organizer: z.object({
    id: UserIdSchema,
    username: z.string(),
    avatar: z.string().url().optional().nullable(),
  }).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'COMPLETED', 'CANCELLED']).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const EventListResponseSchema = SuccessResponseSchema.extend({
  data: z.array(EventSchema),
});

export const EventDetailResponseSchema = SuccessResponseSchema.extend({
  data: EventSchema,
});

export const EventCreateResponseSchema = SuccessResponseSchema.extend({
  data: EventSchema,
});

// ==================== Check-in Responses ====================

export const CheckInStatsSchema = z.object({
  totalParticipants: z.number().int().nonnegative(),
  checkedIn: z.number().int().nonnegative(),
  pending: z.number().int().nonnegative(),
  absent: z.number().int().nonnegative(),
});

export const CheckInStatsResponseSchema = SuccessResponseSchema.extend({
  data: CheckInStatsSchema,
});

export const QRCodeResponseSchema = SuccessResponseSchema.extend({
  data: z.object({
    qrToken: TokenSchema,
    expiresAt: z.string().datetime(),
    eventId: z.number().int(),
  }),
});

export const CheckInParticipantSchema = z.object({
  id: z.number().int(),
  userId: UserIdSchema,
  username: z.string(),
  email: z.string().email(),
  checkedInAt: z.string().datetime(),
});

export const CheckedInListResponseSchema = SuccessResponseSchema.extend({
  data: z.array(CheckInParticipantSchema),
});

// ==================== Gamification Responses ====================

export const PointsSchema = z.object({
  id: z.number().int(),
  userId: UserIdSchema,
  points: z.number().int().nonnegative(),
  reason: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const PointsResponseSchema = SuccessResponseSchema.extend({
  data: PointsSchema,
});

export const PointsHistoryResponseSchema = SuccessResponseSchema.extend({
  data: z.array(PointsSchema),
});

export const LeaderboardEntrySchema = z.object({
  userId: UserIdSchema,
  username: z.string(),
  avatar: z.string().url().optional().nullable(),
  totalPoints: z.number().int().nonnegative(),
  rank: z.number().int().positive(),
  streak: z.number().int().nonnegative().optional(),
});

export const LeaderboardResponseSchema = SuccessResponseSchema.extend({
  data: z.array(LeaderboardEntrySchema),
});

export const UserRankResponseSchema = SuccessResponseSchema.extend({
  data: z.object({
    userId: UserIdSchema,
    rank: z.number().int().positive(),
    totalPoints: z.number().int().nonnegative(),
  }),
});

export const BadgeSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  description: z.string().optional(),
  icon: z.string().optional(),
  points: z.number().int().nonnegative(),
});

export const UserBadgesResponseSchema = SuccessResponseSchema.extend({
  data: z.array(BadgeSchema),
});

// ==================== Notification Responses ====================

export const NotificationSchema = z.object({
  id: z.number().int(),
  userId: UserIdSchema,
  title: z.string(),
  message: z.string(),
  type: z.enum(['INFO', 'SUCCESS', 'WARNING', 'ERROR', 'EVENT']),
  read: z.boolean(),
  link: z.string().url().optional().nullable(),
  createdAt: z.string().datetime(),
  readAt: z.string().datetime().optional().nullable(),
});

export const NotificationsListResponseSchema = SuccessResponseSchema.extend({
  data: z.array(NotificationSchema),
});

export const UnreadCountResponseSchema = SuccessResponseSchema.extend({
  data: z.object({
    unreadCount: z.number().int().nonnegative(),
  }),
});

// ==================== Map Responses ====================

export const MapMarkerSchema = z.object({
  id: z.number().int(),
  eventId: z.number().int().optional(),
  title: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  description: z.string().optional(),
  icon: z.string().optional(),
  type: z.enum(['EVENT', 'LOCATION', 'RESOURCE']).optional(),
});

export const MapMarkersResponseSchema = SuccessResponseSchema.extend({
  data: z.array(MapMarkerSchema),
});

export const NearbyResponseSchema = SuccessResponseSchema.extend({
  data: z.array(MapMarkerSchema),
});

// ==================== Validation Wrapper ====================

/**
 * Validates an API response against a Zod schema.
 * Throws ZodError if validation fails, returns parsed data if valid.
 * 
 * @param {any} response - Raw API response to validate
 * @param {z.ZodSchema} schema - Zod schema for validation
 * @param {string} contextLabel - For error messages (e.g., "Login response")
 * @returns {any} Validated and parsed data
 * @throws {z.ZodError} If validation fails
 * 
 * Example:
 *   const data = validateResponse(apiResponse, EventListResponseSchema, 'Events list');
 */
export const validateResponse = (response, schema, contextLabel = 'API response') => {
  try {
    return schema.parse(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.errors
        .map(err => `${err.path.join('.')}: ${err.message}`)
        .join('; ');
      const message = `${contextLabel} validation failed: ${messages}`;
      console.error(message, { originalError: error, response });
      throw new Error(message);
    }
    throw error;
  }
};

/**
 * Safely validates response, returns null on validation failure instead of throwing.
 * Useful for fallback scenarios where graceful degradation is preferred.
 * 
 * @param {any} response - Raw API response
 * @param {z.ZodSchema} schema - Zod schema
 * @param {string} contextLabel - For logging
 * @returns {any|null} Validated data or null
 */
export const validateResponseSafe = (response, schema, contextLabel = 'API response') => {
  try {
    return schema.parse(response);
  } catch (error) {
    console.warn(`${contextLabel} validation failed (non-blocking):`, error);
    return null;
  }
};
