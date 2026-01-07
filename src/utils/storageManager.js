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
  
  // Global keys (non-user-specific)
  USER: "user",
  THEME: "theme",
  LANGUAGE: "language",
};
