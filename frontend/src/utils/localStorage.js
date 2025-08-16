// Local Storage utilities for game data persistence

const STORAGE_KEYS = {
  GAME_STATS: 'magicSquare_gameStats',
  SETTINGS: 'magicSquare_settings',
  DAILY_PROGRESS: 'magicSquare_dailyProgress'
};

// Default game statistics
const defaultStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  totalTime: 0,
  bestTime: null,
  totalScore: 0,
  streakCurrent: 0,
  streakBest: 0,
  difficultyStats: {
    easy: { played: 0, won: 0, bestTime: null },
    normal: { played: 0, won: 0, bestTime: null },
    hard: { played: 0, won: 0, bestTime: null },
    master: { played: 0, won: 0, bestTime: null }
  },
  achievements: []
};

// Save game statistics
export const saveGameStats = (stats) => {
  try {
    localStorage.setItem(STORAGE_KEYS.GAME_STATS, JSON.stringify(stats));
  } catch (error) {
    console.error('Failed to save game stats:', error);
  }
};

// Load game statistics
export const getGameStats = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.GAME_STATS);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Merge with defaults to handle new fields
      return { ...defaultStats, ...parsed };
    }
  } catch (error) {
    console.error('Failed to load game stats:', error);
  }
  return defaultStats;
};

// Update specific difficulty stats
export const updateDifficultyStats = (difficulty, gameData) => {
  const stats = getGameStats();
  
  if (!stats.difficultyStats[difficulty]) {
    stats.difficultyStats[difficulty] = { played: 0, won: 0, bestTime: null };
  }
  
  stats.difficultyStats[difficulty].played += 1;
  
  if (gameData.won) {
    stats.difficultyStats[difficulty].won += 1;
    
    // Update best time for this difficulty
    if (!stats.difficultyStats[difficulty].bestTime || 
        gameData.time < stats.difficultyStats[difficulty].bestTime) {
      stats.difficultyStats[difficulty].bestTime = gameData.time;
    }
  }
  
  saveGameStats(stats);
  return stats;
};

// Save user settings
export const saveSettings = (settings) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
};

// Load user settings
export const getSettings = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load settings:', error);
  }
  
  // Return default settings
  return {
    soundEnabled: true,
    animationsEnabled: true,
    theme: 'light',
    difficulty: 'normal',
    gridSize: 3
  };
};

// Daily challenge progress
export const saveDailyProgress = (date, completed, score) => {
  try {
    const progress = getDailyProgress();
    progress[date] = { completed, score, timestamp: Date.now() };
    localStorage.setItem(STORAGE_KEYS.DAILY_PROGRESS, JSON.stringify(progress));
  } catch (error) {
    console.error('Failed to save daily progress:', error);
  }
};

// Get daily challenge progress
export const getDailyProgress = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.DAILY_PROGRESS);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load daily progress:', error);
  }
  return {};
};

// Check if daily challenge is completed for today
export const isDailyChallengeCompleted = () => {
  const today = new Date().toDateString();
  const progress = getDailyProgress();
  return progress[today]?.completed || false;
};

// Clear all game data (for reset functionality)
export const clearAllData = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Failed to clear game data:', error);
  }
};

// Export game data for backup
export const exportGameData = () => {
  try {
    const data = {
      stats: getGameStats(),
      settings: getSettings(),
      dailyProgress: getDailyProgress(),
      exportDate: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  } catch (error) {
    console.error('Failed to export game data:', error);
    return null;
  }
};

// Import game data from backup
export const importGameData = (jsonData) => {
  try {
    const data = JSON.parse(jsonData);
    
    if (data.stats) {
      saveGameStats(data.stats);
    }
    
    if (data.settings) {
      saveSettings(data.settings);
    }
    
    if (data.dailyProgress) {
      localStorage.setItem(STORAGE_KEYS.DAILY_PROGRESS, JSON.stringify(data.dailyProgress));
    }
    
    return true;
  } catch (error) {
    console.error('Failed to import game data:', error);
    return false;
  }
};

// Achievement system
export const checkAndUnlockAchievements = (gameData, stats) => {
  const newAchievements = [];
  
  // First win achievement
  if (stats.gamesWon === 1 && !stats.achievements.includes('first_win')) {
    newAchievements.push('first_win');
  }
  
  // Speed demon - complete in under 60 seconds
  if (gameData.time < 60000 && !stats.achievements.includes('speed_demon')) {
    newAchievements.push('speed_demon');
  }
  
  // Perfect game - no hints, no failed attempts
  if (gameData.hintsUsed === 0 && gameData.attempts === 1 && !stats.achievements.includes('perfect_game')) {
    newAchievements.push('perfect_game');
  }
  
  // Master player - win 10 games on master difficulty
  if (stats.difficultyStats.master?.won >= 10 && !stats.achievements.includes('master_player')) {
    newAchievements.push('master_player');
  }
  
  // Persistent - play 50 games
  if (stats.gamesPlayed >= 50 && !stats.achievements.includes('persistent')) {
    newAchievements.push('persistent');
  }
  
  // High scorer - reach 50000 total score
  if (stats.totalScore >= 50000 && !stats.achievements.includes('high_scorer')) {
    newAchievements.push('high_scorer');
  }
  
  // Update achievements
  if (newAchievements.length > 0) {
    stats.achievements = [...(stats.achievements || []), ...newAchievements];
    saveGameStats(stats);
  }
  
  return newAchievements;
};

// Get achievement descriptions
export const getAchievementInfo = (achievementId) => {
  const achievements = {
    first_win: {
      name: 'First Victory',
      description: 'Complete your first magic square',
      icon: '🏆'
    },
    speed_demon: {
      name: 'Speed Demon',
      description: 'Complete a puzzle in under 60 seconds',
      icon: '⚡'
    },
    perfect_game: {
      name: 'Perfect Game',
      description: 'Win without using hints or making mistakes',
      icon: '💎'
    },
    master_player: {
      name: 'Master Player', 
      description: 'Win 10 games on Master difficulty',
      icon: '👑'
    },
    persistent: {
      name: 'Persistent Player',
      description: 'Play 50 games',
      icon: '🎯'
    },
    high_scorer: {
      name: 'High Scorer',
      description: 'Reach 50,000 total score',
      icon: '🌟'
    }
  };
  
  return achievements[achievementId] || { name: 'Unknown', description: '', icon: '❓' };
};