/**
 * User-Specific Storage Manager
 * Handles all localStorage operations with user-specific prefixing
 * Ensures data isolation between different users on the same device
 */

const STORAGE_PREFIX = "scihub";

/**
 * Get user-specific storage key
 * @param {string|number} userId - The user ID
 * @param {string} key - The storage key
 * @returns {string} User-specific prefixed key
 */
export const getUserStorageKey = (userId, key) => {
  if (!userId) {
    console.warn("⚠️ No userId provided to getUserStorageKey");
    return `${STORAGE_PREFIX}_${key}`;
  }
  return `${STORAGE_PREFIX}_user_${userId}_${key}`;
};

/**
 * Recalculate and get accurate dashboard stats from source data
 * @param {string|number} userId - The user ID
 * @returns {object} Accurate stats object
 */
export const recalculateDashboardStats = (userId) => {
  try {
    // Get completed lessons from source
    const storageKey = getUserStorageKey(userId, "completed_lessons");
    const completedLessons = JSON.parse(localStorage.getItem(storageKey) || "[]");
    const lessonsCompleted = completedLessons.length;
    
    // Get current stats from storage
    const currentStats = getDashboardStats(userId);
    
    // Return stats with accurate lessons count
    const accurateStats = {
      ...currentStats,
      lessonsCompleted: lessonsCompleted,
    };
    
    return accurateStats;
  } catch (error) {
    console.error(`❌ Error recalculating dashboard stats:`, error);
    return getDashboardStats(userId);
  }
};

/**
 * Get global storage key (non-user-specific)
 * @param {string} key - The storage key
 * @returns {string} Global prefixed key
 */
export const getGlobalStorageKey = (key) => {
  return `${STORAGE_PREFIX}_global_${key}`;
};

/**
 * Set user-specific data in localStorage
 * @param {string|number} userId - The user ID
 * @param {string} key - The storage key
 * @param {any} value - The value to store (will be JSON stringified)
 */
export const setUserData = (userId, key, value) => {
  try {
    const storageKey = getUserStorageKey(userId, key);
    localStorage.setItem(storageKey, JSON.stringify(value));
    console.log(`✅ Saved user data: ${storageKey}`);
  } catch (error) {
    console.error(`❌ Error saving user data (${key}):`, error);
  }
};

/**
 * Get user-specific data from localStorage
 * @param {string|number} userId - The user ID
 * @param {string} key - The storage key
 * @param {any} defaultValue - Default value if not found
 * @returns {any} The stored value or default
 */
export const getUserData = (userId, key, defaultValue = null) => {
  try {
    const storageKey = getUserStorageKey(userId, key);
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      console.log(`✅ Retrieved user data: ${storageKey}`);
      return JSON.parse(stored);
    } else {
      console.log(`⚠️ No data found for key: ${storageKey}`);
    }
  } catch (error) {
    console.error(`❌ Error reading user data (${key}):`, error);
  }
  return defaultValue;
};

/**
 * Remove user-specific data from localStorage
 * @param {string|number} userId - The user ID
 * @param {string} key - The storage key
 */
export const removeUserData = (userId, key) => {
  try {
    const storageKey = getUserStorageKey(userId, key);
    localStorage.removeItem(storageKey);
    console.log(`✅ Removed user data: ${storageKey}`);
  } catch (error) {
    console.error(`❌ Error removing user data (${key}):`, error);
  }
};

/**
 * Clear all data for a specific user
 * @param {string|number} userId - The user ID
 */
export const clearUserData = (userId) => {
  try {
    const prefix = `${STORAGE_PREFIX}_user_${userId}_`;
    const keysToRemove = [];
    
    // Find all keys for this user
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        keysToRemove.push(key);
      }
    }
    
    // Remove all user-specific keys
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
    
    console.log(`✅ Cleared ${keysToRemove.length} user data entries for user ${userId}`);
  } catch (error) {
    console.error(`❌ Error clearing user data:`, error);
  }
};

/**
 * Set global (non-user-specific) data in localStorage
 * @param {string} key - The storage key
 * @param {any} value - The value to store (will be JSON stringified)
 */
export const setGlobalData = (key, value) => {
  try {
    const storageKey = getGlobalStorageKey(key);
    localStorage.setItem(storageKey, JSON.stringify(value));
    console.log(`✅ Saved global data: ${storageKey}`);
  } catch (error) {
    console.error(`❌ Error saving global data (${key}):`, error);
  }
};

/**
 * Get global (non-user-specific) data from localStorage
 * @param {string} key - The storage key
 * @param {any} defaultValue - Default value if not found
 * @returns {any} The stored value or default
 */
export const getGlobalData = (key, defaultValue = null) => {
  try {
    const storageKey = getGlobalStorageKey(key);
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error(`❌ Error reading global data (${key}):`, error);
  }
  return defaultValue;
};

/**
 * VIDEO TRACKING FUNCTIONS - Store video watch progress in localStorage
 */

/**
 * Mark a video as watched for a specific lesson
 * @param {string|number} userId - The user ID
 * @param {string|number} lessonId - The lesson ID
 * @param {string|number} videoId - The video ID
 * @param {object} videoData - Optional video metadata (title, url, etc)
 */
export const markVideoWatched = (userId, lessonId, videoId, videoData = {}) => {
  try {
    const storageKey = getUserStorageKey(userId, `lesson_${lessonId}_videos`);
    const watchedVideos = JSON.parse(localStorage.getItem(storageKey) || "{}");
    
    watchedVideos[videoId] = {
      watched: true,
      completedAt: new Date().toISOString(),
      ...videoData
    };
    
    localStorage.setItem(storageKey, JSON.stringify(watchedVideos));
    console.log(`✅ Marked video ${videoId} as watched for lesson ${lessonId}`);
    return true;
  } catch (error) {
    console.error(`❌ Error marking video as watched:`, error);
    return false;
  }
};

/**
 * Get watched videos for a specific lesson
 * @param {string|number} userId - The user ID
 * @param {string|number} lessonId - The lesson ID
 * @returns {object} Object containing watched videos with their completion data
 */
export const getWatchedVideos = (userId, lessonId) => {
  try {
    const storageKey = getUserStorageKey(userId, `lesson_${lessonId}_videos`);
    const watched = localStorage.getItem(storageKey);
    if (watched) {
      return JSON.parse(watched);
    }
  } catch (error) {
    console.error(`❌ Error retrieving watched videos:`, error);
  }
  return {};
};

/**
 * Check if a specific video has been watched
 * @param {string|number} userId - The user ID
 * @param {string|number} lessonId - The lesson ID
 * @param {string|number} videoId - The video ID
 * @returns {boolean} True if video is watched, false otherwise
 */
export const isVideoWatched = (userId, lessonId, videoId) => {
  const watched = getWatchedVideos(userId, lessonId);
  return watched[videoId]?.watched === true;
};

/**
 * Get count of watched videos for a lesson
 * @param {string|number} userId - The user ID
 * @param {string|number} lessonId - The lesson ID
 * @returns {number} Number of watched videos
 */
export const getWatchedVideoCount = (userId, lessonId) => {
  const watched = getWatchedVideos(userId, lessonId);
  return Object.keys(watched).length;
};

/**
 * INTRO VIDEO TRACKING - For ScienceDetail intro videos
 */

/**
 * Mark an intro video as watched for a science subject
 * @param {string|number} userId - The user ID
 * @param {string} branch - The branch (natural or social)
 * @param {string} scienceId - The science ID (biology, chemistry, etc)
 * @param {string} subjectName - Optional subject name to track
 */
export const markIntroVideoWatched = (userId, branch, scienceId, subjectName = "") => {
  try {
    const storageKey = getUserStorageKey(userId, `intro_video_${branch}_${scienceId}`);
    const data = {
      watched: true,
      watchedAt: new Date().toISOString(),
      branch,
      scienceId,
      subject: subjectName || (scienceId.charAt(0).toUpperCase() + scienceId.slice(1))
    };
    localStorage.setItem(storageKey, JSON.stringify(data));
    console.log(`✅ Marked intro video watched for ${branch}/${scienceId} - Subject: ${data.subject}`);
    return true;
  } catch (error) {
    console.error(`❌ Error marking intro video as watched:`, error);
    return false;
  }
};

/**
 * Check if intro video has been watched
 * @param {string|number} userId - The user ID
 * @param {string} branch - The branch (natural or social)
 * @param {string} scienceId - The science ID (biology, chemistry, etc)
 * @returns {boolean} True if video is watched, false otherwise
 */
export const isIntroVideoWatched = (userId, branch, scienceId) => {
  try {
    const storageKey = getUserStorageKey(userId, `intro_video_${branch}_${scienceId}`);
    const data = localStorage.getItem(storageKey);
    if (data) {
      const parsed = JSON.parse(data);
      console.log(`📺 Intro video status for ${branch}/${scienceId}:`, parsed);
      return parsed.watched === true;
    }
  } catch (error) {
    console.error(`❌ Error checking intro video status:`, error);
  }
  return false;
};

/**
 * DASHBOARD STATS FUNCTIONS - Manage user progress and stats
 */

/**
 * Initialize or get user dashboard stats
 * @param {string|number} userId - The user ID
 * @returns {object} User stats object with xp, coins, streak, lessons, games
 */
export const getDashboardStats = (userId) => {
  try {
    const storageKey = getUserStorageKey(userId, "dashboard_stats");
    const stats = localStorage.getItem(storageKey);
    const parsedStats = stats ? JSON.parse(stats) : null;
    
    if (parsedStats) {
      console.log(`✅ Retrieved dashboard stats for user ${userId}`);
      
      // Always recalculate lessonsCompleted from actual completed lessons
      const completedLessonsKey = getUserStorageKey(userId, "completed_lessons");
      const completedLessons = JSON.parse(localStorage.getItem(completedLessonsKey) || "[]");
      parsedStats.lessonsCompleted = completedLessons.length;
      
      return parsedStats;
    }
  } catch (error) {
    console.error(`❌ Error retrieving dashboard stats:`, error);
  }
  
  // Return default stats if not found
  const defaultStats = {
    xp: 0,
    coins: 0,
    streak: 0,
    lessonsCompleted: 0,
    lessonsInProgress: 0,
    totalGameScore: 0,
    lastActivityDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };
  
  return defaultStats;
};

/**
 * Save or update user dashboard stats
 * @param {string|number} userId - The user ID
 * @param {object} stats - Stats object to save
 */
export const setDashboardStats = (userId, stats) => {
  try {
    const storageKey = getUserStorageKey(userId, "dashboard_stats");
    const currentStats = getDashboardStats(userId);
    const updatedStats = {
      ...currentStats,
      ...stats,
      lastActivityDate: new Date().toISOString(),
    };
    localStorage.setItem(storageKey, JSON.stringify(updatedStats));
    console.log(`✅ Saved dashboard stats for user ${userId}`, updatedStats);
    return updatedStats;
  } catch (error) {
    console.error(`❌ Error saving dashboard stats:`, error);
  }
};

/**
 * Update XP for a user
 * @param {string|number} userId - The user ID
 * @param {number} xpGained - Amount of XP to add
 * @returns {object} Updated stats
 */
export const addXP = (userId, xpGained = 0) => {
  const stats = getDashboardStats(userId);
  stats.xp = (stats.xp || 0) + xpGained;
  console.log(`✅ Added ${xpGained} XP to user ${userId}. Total: ${stats.xp}`);
  return setDashboardStats(userId, stats);
};

/**
 * Update coins for a user
 * @param {string|number} userId - The user ID
 * @param {number} coinsGained - Amount of coins to add
 * @returns {object} Updated stats
 */
export const addCoins = (userId, coinsGained = 0) => {
  const stats = getDashboardStats(userId);
  stats.coins = (stats.coins || 0) + coinsGained;
  console.log(`✅ Added ${coinsGained} coins to user ${userId}. Total: ${stats.coins}`);
  return setDashboardStats(userId, stats);
};

/**
 * Mark a lesson as completed
 * @param {string|number} userId - The user ID
 * @param {string|number} lessonId - The lesson ID
 * @param {object} lessonData - Optional lesson metadata
 */
export const markLessonCompleted = (userId, lessonId, lessonData = {}) => {
  try {
    const storageKey = getUserStorageKey(userId, "completed_lessons");
    const completedLessons = JSON.parse(localStorage.getItem(storageKey) || "[]");
    
    const lesson = {
      id: lessonId,
      completedAt: new Date().toISOString(),
      ...lessonData
    };
    
    // Check if lesson already marked as completed
    if (!completedLessons.find(l => l.id === lessonId)) {
      completedLessons.push(lesson);
      localStorage.setItem(storageKey, JSON.stringify(completedLessons));
      console.log(`✅ Marked lesson ${lessonId} as completed for user ${userId}`);
      
      // Update dashboard stats
      const stats = getDashboardStats(userId);
      stats.lessonsCompleted = (stats.lessonsCompleted || 0) + 1;
      stats.lessonsInProgress = Math.max(0, (stats.lessonsInProgress || 0) - 1);
      setDashboardStats(userId, stats);
    }
    
    return true;
  } catch (error) {
    console.error(`❌ Error marking lesson as completed:`, error);
    return false;
  }
};

/**
 * Check if a lesson is completed
 * @param {string|number} userId - The user ID
 * @param {string|number} lessonId - The lesson ID
 * @returns {boolean} True if lesson is completed
 */
export const isLessonCompleted = (userId, lessonId) => {
  try {
    const storageKey = getUserStorageKey(userId, "completed_lessons");
    const completedLessons = JSON.parse(localStorage.getItem(storageKey) || "[]");
    return completedLessons.some(l => l.id === lessonId);
  } catch (error) {
    console.error(`❌ Error checking lesson completion:`, error);
  }
  return false;
};

/**
 * Get all completed lessons for a user
 * @param {string|number} userId - The user ID
 * @returns {array} Array of completed lessons
 */
export const getCompletedLessons = (userId) => {
  try {
    const storageKey = getUserStorageKey(userId, "completed_lessons");
    const completedLessons = JSON.parse(localStorage.getItem(storageKey) || "[]");
    return completedLessons;
  } catch (error) {
    console.error(`❌ Error retrieving completed lessons:`, error);
  }
  return [];
};

/**
 * Add game score to user's total
 * @param {string|number} userId - The user ID
 * @param {number} score - The score to add
 * @returns {object} Updated stats
 */
export const addGameScore = (userId, score = 0) => {
  const stats = getDashboardStats(userId);
  stats.totalGameScore = (stats.totalGameScore || 0) + score;
  console.log(`✅ Added ${score} to game score. Total: ${stats.totalGameScore}`);
  return setDashboardStats(userId, stats);
};

/**
 * Book a tutoring session
 * @param {string|number} userId - The user ID
 * @param {object} sessionData - Session details (tutorName, subject, date, time, etc)
 * @returns {boolean} True if session booked successfully
 */
export const bookTutoringSession = (userId, sessionData) => {
  try {
    const storageKey = getUserStorageKey(userId, "booked_sessions");
    const sessions = JSON.parse(localStorage.getItem(storageKey) || "[]");
    
    const session = {
      id: Date.now(), // Use timestamp as unique ID
      ...sessionData,
      bookedAt: new Date().toISOString(),
      sessionTime: sessionData.sessionTime || new Date(sessionData.date + " " + sessionData.time).toISOString(),
    };
    
    sessions.push(session);
    localStorage.setItem(storageKey, JSON.stringify(sessions));
    console.log(`✅ Booked tutoring session for user ${userId}`, session);
    return true;
  } catch (error) {
    console.error(`❌ Error booking tutoring session:`, error);
    return false;
  }
};

/**
 * Get all booked sessions for a user
 * @param {string|number} userId - The user ID
 * @returns {array} Array of booked sessions
 */
export const getBookedSessions = (userId) => {
  try {
    const storageKey = getUserStorageKey(userId, "booked_sessions");
    const sessions = JSON.parse(localStorage.getItem(storageKey) || "[]");
    return sessions;
  } catch (error) {
    console.error(`❌ Error retrieving booked sessions:`, error);
  }
  return [];
};

/**
 * Add activity log entry (for Recent Activity section)
 * @param {string|number} userId - The user ID
 * @param {object} activityData - Activity details (type, description, subject)
 * @returns {boolean} True if activity logged successfully
 */
export const logActivity = (userId, activityData) => {
  try {
    const storageKey = getUserStorageKey(userId, "activity_log");
    const activities = JSON.parse(localStorage.getItem(storageKey) || "[]");
    
    const activity = {
      id: Date.now(),
      ...activityData,
      created_at: new Date().toISOString(),
    };
    
    // Keep only last 50 activities
    activities.unshift(activity);
    const recentActivities = activities.slice(0, 50);
    
    localStorage.setItem(storageKey, JSON.stringify(recentActivities));
    console.log(`✅ Logged activity for user ${userId}`, activity);
    return true;
  } catch (error) {
    console.error(`❌ Error logging activity:`, error);
    return false;
  }
};

/**
 * Get activity log for a user
 * @param {string|number} userId - The user ID
 * @param {number} limit - Max number of activities to return (default: 10)
 * @returns {array} Array of recent activities
 */
export const getActivityLog = (userId, limit = 10) => {
  try {
    const storageKey = getUserStorageKey(userId, "activity_log");
    const activities = JSON.parse(localStorage.getItem(storageKey) || "[]");
    return activities.slice(0, limit);
  } catch (error) {
    console.error(`❌ Error retrieving activity log:`, error);
  }
  return [];
};

/**
 * Storage key constants for consistency
 */
export const STORAGE_KEYS = {
  // User-specific keys
  LESSON_PROGRESS: "lesson_progress",
  LESSON_COMPLETED: "lesson_completed",
  LESSON_UNLOCKED: "lesson_unlocked",
  LESSON_WORKSHEETS: "worksheets",
  QNA_QUESTIONS: "qna_questions",
  UNLOCKED_GAMES: "unlocked_games",
  GAME_SCORES: "game_scores",
  BOOKED_SESSIONS: "booked_sessions",
  WATCHED_VIDEOS: "watched_videos",
  INTRO_VIDEOS: "intro_videos",
  DASHBOARD_STATS: "dashboard_stats",
  ACTIVITY_LOG: "activity_log",
  
  // Global keys (non-user-specific)
  USER: "user",
  THEME: "theme",
  LANGUAGE: "language",
};

/**
 * ACHIEVEMENTS SYSTEM - Unlock achievements based on user milestones
 */

/**
 * Get all available achievements
 * @returns {array} Array of achievement templates
 */
export const getAllAchievements = () => {
  return [
    {
      id: "rising_star",
      title: "Rising Star",
      icon: "🌟",
      color: "green",
      description: "Earn 2000+ XP",
      requirement: { type: "xp", value: 2000 },
      unlockedAt: null,
    },
    {
      id: "on_fire",
      title: "On Fire",
      icon: "🔥",
      color: "orange",
      description: "Maintain a 7-day streak",
      requirement: { type: "streak", value: 7 },
      unlockedAt: null,
    },
    {
      id: "game_master",
      title: "Game Master",
      icon: "🎮",
      color: "blue",
      description: "Reach 3000+ game score",
      requirement: { type: "gameScore", value: 3000 },
      unlockedAt: null,
    },
    {
      id: "scholar",
      title: "Scholar",
      icon: "📚",
      color: "purple",
      description: "Complete 10 lessons",
      requirement: { type: "lessonsCompleted", value: 10 },
      unlockedAt: null,
    },
    {
      id: "lesson_legend",
      title: "Lesson Legend",
      icon: "📖",
      color: "cyan",
      description: "Complete 25 lessons",
      requirement: { type: "lessonsCompleted", value: 25 },
      unlockedAt: null,
    },
    {
      id: "coin_collector",
      title: "Coin Collector",
      icon: "💰",
      color: "yellow",
      description: "Earn 500+ coins",
      requirement: { type: "coins", value: 500 },
      unlockedAt: null,
    },
    {
      id: "speed_demon",
      title: "Speed Demon",
      icon: "⚡",
      color: "red",
      description: "Complete 5 games",
      requirement: { type: "gamesCompleted", value: 5 },
      unlockedAt: null,
    },
    {
      id: "tutor_master",
      title: "Tutor Master",
      icon: "👨‍🏫",
      color: "indigo",
      description: "Book 5 tutoring sessions",
      requirement: { type: "sessionsBooked", value: 5 },
      unlockedAt: null,
    },
  ];
};

/**
 * Get user's unlocked achievements
 * @param {string|number} userId - The user ID
 * @returns {array} Array of unlocked achievements
 */
export const getUnlockedAchievements = (userId) => {
  try {
    const storageKey = getUserStorageKey(userId, "unlocked_achievements");
    const achievements = JSON.parse(localStorage.getItem(storageKey) || "[]");
    return achievements;
  } catch (error) {
    console.error(`❌ Error retrieving unlocked achievements:`, error);
  }
  return [];
};

/**
 * Get user's achievement progress (both locked and unlocked)
 * @param {string|number} userId - The user ID
 * @returns {array} Array of all achievements with unlock status
 */
export const getUserAchievementProgress = (userId) => {
  try {
    const allAchievements = getAllAchievements();
    const unlockedIds = new Set(
      getUnlockedAchievements(userId).map(a => a.id)
    );
    
    return allAchievements.map(achievement => ({
      ...achievement,
      unlocked: unlockedIds.has(achievement.id),
    }));
  } catch (error) {
    console.error(`❌ Error getting achievement progress:`, error);
  }
  return [];
};

/**
 * Check and unlock achievements based on current stats
 * @param {string|number} userId - The user ID
 * @returns {array} Array of newly unlocked achievements
 */
export const checkAndUnlockAchievements = (userId) => {
  try {
    const stats = getDashboardStats(userId);
    const unlockedAchievements = getUnlockedAchievements(userId);
    const unlockedIds = new Set(unlockedAchievements.map(a => a.id));
    const allAchievements = getAllAchievements();
    
    const newlyUnlocked = [];
    
    // Check each achievement
    for (const achievement of allAchievements) {
      // Skip if already unlocked
      if (unlockedIds.has(achievement.id)) continue;
      
      const { type, value } = achievement.requirement;
      let isUnlocked = false;
      
      // Check requirement type
      switch (type) {
        case "xp":
          isUnlocked = stats.xp >= value;
          break;
        case "coins":
          isUnlocked = stats.coins >= value;
          break;
        case "gameScore":
          isUnlocked = stats.totalGameScore >= value;
          break;
        case "lessonsCompleted":
          isUnlocked = stats.lessonsCompleted >= value;
          break;
        case "streak":
          isUnlocked = stats.streak >= value;
          break;
        case "gamesCompleted":
          // Count games from activity log
          const activities = getActivityLog(userId, 100);
          const gamesCompleted = activities.filter(a => a.type === "Game Won").length;
          isUnlocked = gamesCompleted >= value;
          break;
        case "sessionsBooked":
          // Count sessions
          const sessions = getBookedSessions(userId);
          isUnlocked = sessions.length >= value;
          break;
        default:
          break;
      }
      
      // Unlock if requirement is met
      if (isUnlocked) {
        const unlockedAchievement = {
          ...achievement,
          unlockedAt: new Date().toISOString(),
        };
        unlockedAchievements.push(unlockedAchievement);
        unlockedIds.add(achievement.id);
        newlyUnlocked.push(unlockedAchievement);
        console.log(`🏆 Achievement Unlocked: ${achievement.title}`);
      }
    }
    
    // Save updated achievements
    if (newlyUnlocked.length > 0) {
      const storageKey = getUserStorageKey(userId, "unlocked_achievements");
      localStorage.setItem(storageKey, JSON.stringify(unlockedAchievements));
      console.log(`✅ Saved ${newlyUnlocked.length} newly unlocked achievements`);
    }
    
    return newlyUnlocked;
  } catch (error) {
    console.error(`❌ Error checking achievements:`, error);
  }
  return [];
};

/**
 * Unlock a specific achievement
 * @param {string|number} userId - The user ID
 * @param {string} achievementId - The achievement ID
 * @returns {boolean} True if unlocked successfully
 */
export const unlockAchievement = (userId, achievementId) => {
  try {
    const achievements = getUnlockedAchievements(userId);
    
    // Check if already unlocked
    if (achievements.some(a => a.id === achievementId)) {
      return false;
    }
    
    // Find achievement template
    const template = getAllAchievements().find(a => a.id === achievementId);
    if (!template) {
      console.warn(`⚠️ Achievement ${achievementId} not found`);
      return false;
    }
    
    // Add to unlocked achievements
    const newAchievement = {
      ...template,
      unlockedAt: new Date().toISOString(),
    };
    achievements.push(newAchievement);
    
    const storageKey = getUserStorageKey(userId, "unlocked_achievements");
    localStorage.setItem(storageKey, JSON.stringify(achievements));
    console.log(`🏆 Achievement Unlocked: ${template.title}`);
    
    return true;
  } catch (error) {
    console.error(`❌ Error unlocking achievement:`, error);
  }
  return false;
};

/**
 * Get next achievement to work towards
 * @param {string|number} userId - The user ID
 * @returns {object} Next achievement with progress info
 */
export const getNextAchievement = (userId) => {
  try {
    const progress = getUserAchievementProgress(userId);
    const locked = progress.filter(a => !a.unlocked);
    
    if (locked.length === 0) {
      return null; // All achievements unlocked
    }
    
    // Return first locked achievement
    return locked[0];
  } catch (error) {
    console.error(`❌ Error getting next achievement:`, error);
  }
  return null;
};

/**
 * Mark intro video as completed
 * @param {string|number} userId - The user ID
 */
export const markIntroVideoCompleted = (userId) => {
  try {
    const storageKey = getUserStorageKey(userId, "intro_video_completed");
    localStorage.setItem(storageKey, JSON.stringify({
      completed: true,
      completedAt: new Date().toISOString(),
    }));
    console.log(`✅ Intro video marked as completed for user ${userId}`);
  } catch (error) {
    console.error(`❌ Error marking intro video as completed:`, error);
  }
};

/**
 * Check if intro video has been completed
 * @param {string|number} userId - The user ID
 * @returns {boolean} True if intro video is completed
 */
export const hasCompletedIntroVideo = (userId) => {
  try {
    const storageKey = getUserStorageKey(userId, "intro_video_completed");
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      const data = JSON.parse(stored);
      return data.completed === true;
    }
  } catch (error) {
    console.error(`❌ Error checking intro video completion:`, error);
  }
  return false;
};

/**
 * Save game progress for mid-game resumption
 * @param {string|number} userId - The user ID
 * @param {string} gameId - The game ID
 * @param {object} progress - The game progress data
 */
export const saveGameProgress = (userId, gameId, progress) => {
  try {
    const storageKey = getUserStorageKey(userId, `game_progress_${gameId}`);
    localStorage.setItem(storageKey, JSON.stringify({
      ...progress,
      savedAt: new Date().toISOString(),
    }));
    console.log(`✅ Game progress saved for ${gameId}`);
  } catch (error) {
    console.error(`❌ Error saving game progress:`, error);
  }
};

/**
 * Load game progress for a game
 * @param {string|number} userId - The user ID
 * @param {string} gameId - The game ID
 * @returns {object|null} The game progress or null if not found
 */
export const loadGameProgress = (userId, gameId) => {
  try {
    const storageKey = getUserStorageKey(userId, `game_progress_${gameId}`);
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error(`❌ Error loading game progress:`, error);
  }
  return null;
};

/**
 * Clear game progress when a game is completed
 * @param {string|number} userId - The user ID
 * @param {string} gameId - The game ID
 */
export const clearGameProgress = (userId, gameId) => {
  try {
    const storageKey = getUserStorageKey(userId, `game_progress_${gameId}`);
    localStorage.removeItem(storageKey);
    console.log(`✅ Game progress cleared for ${gameId}`);
  } catch (error) {
    console.error(`❌ Error clearing game progress:`, error);
  }
};
