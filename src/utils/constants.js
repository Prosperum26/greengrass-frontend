// Application Constants

// API
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Event Types
export const EVENT_TYPES = {
  PICKUP_TRASH: 'pickup_trash',
  RECYCLING: 'recycling',
  TREE_PLANTING: 'tree_planting',
  AWARENESS: 'awareness',
  WORKSHOP: 'workshop',
  CAMPAIGN: 'campaign',
};

export const EVENT_TYPE_LABELS = {
  [EVENT_TYPES.PICKUP_TRASH]: 'Nhặt rác',
  [EVENT_TYPES.RECYCLING]: 'Thu gom tái chế',
  [EVENT_TYPES.TREE_PLANTING]: 'Trồng cây',
  [EVENT_TYPES.AWARENESS]: 'Tuyên truyền',
  [EVENT_TYPES.WORKSHOP]: 'Workshop',
  [EVENT_TYPES.CAMPAIGN]: 'Chiến dịch',
};

// Event Categories
export const EVENT_CATEGORIES = {
  PLATFORM: 'platform',
  COMMUNITY: 'community',
};

// Badge Types
export const BADGE_TYPES = {
  GREEN_WARRIOR: 'green_warrior',
  RECYCLING_AMBASSADOR: 'recycling_ambassador',
  TREE_PLANTER: 'tree_planter',
  EARLY_BIRD: 'early_bird',
  STREAK_MASTER: 'streak_master',
};

export const BADGE_LABELS = {
  [BADGE_TYPES.GREEN_WARRIOR]: 'Chiến binh xanh',
  [BADGE_TYPES.RECYCLING_AMBASSADOR]: 'Đại sứ tái chế',
  [BADGE_TYPES.TREE_PLANTER]: 'Người gieo mầm',
  [BADGE_TYPES.EARLY_BIRD]: 'Người dậy sớm',
  [BADGE_TYPES.STREAK_MASTER]: 'Bậc thầy kiên trì',
};

// Schools in ĐHQG-HCM
export const SCHOOLS = [
  { id: 'uit', name: 'ĐH Công nghệ Thông tin', shortName: 'UIT' },
  { id: 'uel', name: 'ĐH Kinh tế - Luật', shortName: 'UEL' },
  { id: 'hcmus', name: 'ĐH Khoa học Tự nhiên', shortName: 'HCMUS' },
  { id: 'hcmussh', name: 'ĐH Khoa học Xã hội và Nhân văn', shortName: 'HCMUSSH' },
  { id: 'hcmiu', name: 'ĐH Quốc tế', shortName: 'HCMIU' },
  { id: 'hcmut', name: 'ĐH Bách Khoa', shortName: 'HCMUT' },
  { id: 'iuh', name: 'ĐH Công nghiệp TP.HCM', shortName: 'IUH' },
];

// Map Settings
export const MAP_CONFIG = {
  center: [10.869778, 106.802583], // ĐHQG-HCM
  zoom: 15,
  maxZoom: 18,
  minZoom: 12,
};

// Check-in Settings
export const CHECKIN_CONFIG = {
  maxDistance: 500, // meters
  qrRefreshInterval: 30, // seconds
  proofRequired: true,
};

// Pagination
export const DEFAULT_PAGE_SIZE = 12;

// Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'greengrass_token',
  USER: 'greengrass_user',
  THEME: 'greengrass_theme',
};
