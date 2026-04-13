import { mockEvents, mockLeaderboard, mockStats } from '../mock/homeMockData';

// Simulated API latency
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const homeService = {
  getEvents: async () => {
    await delay(800);
    return mockEvents;
  },

  getLeaderboard: async () => {
    await delay(700);
    return mockLeaderboard;
  },

  getStats: async () => {
    await delay(600);
    return mockStats;
  }
};

export default homeService;
