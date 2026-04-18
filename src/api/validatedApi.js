/**
 * API Response Validation Wrappers
 * Optional layer to validate API responses against backend contracts.
 * Prevents silent data errors from contract deviations.
 * 
 * Usage:
 *   // Without validation (existing code works as-is)
 *   const response = await authApi.login(credentials);
 *   
 *   // With validation
 *   const data = await authApi.loginWithValidation(credentials);
 *   // Throws if response doesn't match expected contract
 */

import {
  AuthLoginResponseSchema,
  AuthRegisterResponseSchema,
  AuthRefreshResponseSchema,
  UserMeResponseSchema,
  EventListResponseSchema,
  EventDetailResponseSchema,
  LeaderboardResponseSchema,
  validateResponse,
  validateResponseSafe,
} from '../utils/responseSchemas';
import { authApi } from './auth';
import { eventsApi } from './events';
import { usersApi } from './users';
import { pointsApi } from './points';

// ==================== Validated Auth API ====================

export const authApiValidated = {
  /**
   * Login with response validation.
   * @throws {Error} If response doesn't match expected contract
   */
  login: async (credentials) => {
    const response = await authApi.login(credentials);
    return validateResponse(response, AuthLoginResponseSchema, 'Login response');
  },

  /**
   * Register with response validation.
   * @throws {Error} If response doesn't match expected contract
   */
  registerStudent: async (data) => {
    const response = await authApi.registerStudent(data);
    return validateResponse(response, AuthRegisterResponseSchema, 'Register response');
  },

  /**
   * Request organizer role with response validation.
   * @throws {Error} If response doesn't match expected contract
   */
  registerOrganizerRequest: async (data) => {
    const response = await authApi.registerOrganizerRequest(data);
    return validateResponse(response, AuthRegisterResponseSchema, 'Organizer request response');
  },

  /**
   * Refresh tokens with response validation.
   * @throws {Error} If response doesn't match expected contract
   */
  refresh: async (payload) => {
    const response = await authApi.refresh(payload);
    return validateResponse(response, AuthRefreshResponseSchema, 'Refresh response');
  },

  logout: () => authApi.logout(),
};

// ==================== Validated Events API ====================

export const eventsApiValidated = {
  /**
   * Get all events with response validation.
   * @throws {Error} If response doesn't match expected contract
   */
  getAll: async (params) => {
    const response = await eventsApi.getAll(params);
    return validateResponse(response, EventListResponseSchema, 'Events list response');
  },

  /**
   * Get all events with response validation (non-blocking).
   * Returns null if validation fails, logs warning.
   */
  getAllSafe: async (params) => {
    const response = await eventsApi.getAll(params);
    return validateResponseSafe(response, EventListResponseSchema, 'Events list response');
  },

  /**
   * Get event by ID with response validation.
   * @throws {Error} If response doesn't match expected contract
   */
  getById: async (id) => {
    const response = await eventsApi.getById(id);
    return validateResponse(response, EventDetailResponseSchema, 'Event detail response');
  },

  // Non-validated methods still available
  create: (payload) => eventsApi.create(payload),
  register: (eventId) => eventsApi.register(eventId),
  getParticipants: (eventId) => eventsApi.getParticipants(eventId),
  getCheckedIn: (eventId) => eventsApi.getCheckedIn(eventId),
  getCheckInStats: (eventId) => eventsApi.getCheckInStats(eventId),
  getQrCode: (eventId) => eventsApi.getQrCode(eventId),
  checkIn: (eventId, payload) => eventsApi.checkIn(eventId, payload),
  exportParticipants: (eventId) => eventsApi.exportParticipants(eventId),
  addGalleryImage: (eventId, formData) => eventsApi.addGalleryImage(eventId, formData),
  cancelRegister: (eventId) => eventsApi.cancelRegister(eventId),
};

// ==================== Validated Users API ====================

export const usersApiValidated = {
  /**
   * Get current user profile with response validation.
   * @throws {Error} If response doesn't match expected contract
   */
  getMe: async () => {
    const response = await usersApi.getMe();
    return validateResponse(response, UserMeResponseSchema, 'User profile response');
  },

  /**
   * Get current user profile with response validation (non-blocking).
   * Returns null if validation fails, logs warning.
   */
  getMeSafe: async () => {
    const response = await usersApi.getMe();
    return validateResponseSafe(response, UserMeResponseSchema, 'User profile response');
  },

  // Non-validated methods still available
  update: (data) => usersApi.update(data),
  getProfile: (userId) => usersApi.getProfile(userId),
  getEvents: () => usersApi.getEvents(),
  getPoints: () => usersApi.getPoints(),
};

// ==================== Validated Points API ====================

export const pointsApiValidated = {
  /**
   * Get leaderboard with response validation.
   * @throws {Error} If response doesn't match expected contract
   */
  getLeaderboard: async (params) => {
    const response = await pointsApi.getLeaderboard(params);
    return validateResponse(response, LeaderboardResponseSchema, 'Leaderboard response');
  },

  /**
   * Get leaderboard with response validation (non-blocking).
   * Returns null if validation fails, logs warning.
   */
  getLeaderboardSafe: async (params) => {
    const response = await pointsApi.getLeaderboard(params);
    return validateResponseSafe(response, LeaderboardResponseSchema, 'Leaderboard response');
  },

  // Non-validated methods still available
  getMe: () => pointsApi.getMe(),
  getHistory: () => pointsApi.getHistory(),
  getBadges: () => pointsApi.getBadges(),
  getMyBadges: () => pointsApi.getMyBadges(),
  getRank: () => pointsApi.getRank(),
  getUser: (userId) => pointsApi.getUser(userId),
  add: (data) => pointsApi.add(data),
};

/**
 * Strategy for gradual adoption:
 * 
 * 1. Current code continues working unchanged
 * 2. New features use validated APIs by default
 * 3. Critical flows updated incrementally:
 *    - AuthContext: Use authApiValidated instead of authApi
 *    - HomePage: Use eventsApiValidated alternatively or check manually
 *    - Profile page: Use usersApiValidated for profile load
 * 
 * Example migration:
 *   // Before: const res = await authApi.login(creds);
 *   // After:  const res = await authApiValidated.login(creds);
 * 
 * If validation fails, error is caught by existing try/catch + error context.
 */
