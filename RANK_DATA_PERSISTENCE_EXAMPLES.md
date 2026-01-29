# Rank System - Data Persistence Code Examples

## 1. XP Award & Storage (Games.js)

### Code Flow
```javascript
// When student completes a game
function handleGameComplete() {
  // Award coins
  addGameScore(user.id, activeGame.base_reward);
  
  // Award XP (NEW - equal to coins)
  addXP(user.id, activeGame.base_reward);
  
  // Log activity
  logActivity(user.id, "game_completed");
  
  // Check achievements
  checkAndUnlockAchievements(user.id);
}
```

### Storage Result
```
Before:
localStorage = {
  "user_1_dashboard_stats": {
    "xp": 1500,
    "coins": 3000,
    "gamesPlayed": 10
  }
}

After (game worth 100 points):
localStorage = {
  "user_1_dashboard_stats": {
    "xp": 1600,        ← XP increased by 100
    "coins": 3100,     ← Coins increased by 100
    "gamesPlayed": 11  ← Games count increased
  }
}
```

---

## 2. Daily Snapshot Recording (Dashboard.js)

### Code Flow
```javascript
// Called once when Dashboard loads each day
useEffect(() => {
  if (!user) return;
  
  // Record daily progress snapshot
  recordDailyProgressSnapshot(user.id);
  
  // Load other stats
  const userStats = getDashboardStats(user.id);
  setStats(userStats);
}, [user]);
```

### Storage Result
```
localStorage = {
  "user_1_daily_snapshot_2026-01-28": {
    "date": "2026-01-28",
    "xp": 1600,
    "coins": 3100,
    "lessonsCompleted": 8,
    "gamesPlayed": 11,
    "streak": 5
  },
  "user_1_daily_snapshot_2026-01-27": {
    "date": "2026-01-27",
    "xp": 1450,
    "coins": 2950,
    "lessonsCompleted": 7,
    "gamesPlayed": 10,
    "streak": 4
  },
  "user_1_daily_snapshot_2026-01-26": {
    "date": "2026-01-26",
    "xp": 1300,
    "coins": 2800,
    "lessonsCompleted": 6,
    "gamesPlayed": 9,
    "streak": 3
  }
}
```

**Key Point**: Each day gets a unique snapshot, allowing growth tracking over time.

---

## 3. Rank Calculation & Detection (UserRank Component)

### Code Flow
```javascript
// UserRank.js component lifecycle
useEffect(() => {
  // 1. Get current rank from stored XP
  const currentRank = getUserRank(userId);
  setRank(currentRank);
  
  // 2. Get all rank tiers for roadmap
  const tiers = getAllRankTiers();
  setAllTiers(tiers);
  
  // 3. Check if newly ranked up
  const newRank = checkRankUp(userId);
  if (newRank) {
    // Show celebration modal
    setNewRankUnlocked(newRank);
    // Auto-dismiss after 5 seconds
    setTimeout(() => setNewRankUnlocked(null), 5000);
  }
}, [userId]);
```

### Rank Calculation Logic (storageManager.js)
```javascript
export const getUserRank = (userId) => {
  // 1. Get current stats from localStorage
  const stats = getDashboardStats(userId);
  const currentXP = stats.xp || 0;
  
  // 2. Match XP against rank tiers
  const RANK_TIERS = [
    { rank: 0, name: "Novice", minXP: 0, maxXP: 499, ... },
    { rank: 1, name: "Apprentice", minXP: 500, maxXP: 999, ... },
    { rank: 2, name: "Scholar", minXP: 1000, maxXP: 1999, ... },
    { rank: 3, name: "Expert", minXP: 2000, maxXP: 4999, ... },
    { rank: 4, name: "Master", minXP: 5000, maxXP: 9999, ... },
    { rank: 5, name: "Sage", minXP: 10000, maxXP: Infinity, ... },
  ];
  
  // 3. Find current rank
  let currentRank = RANK_TIERS.find(
    t => currentXP >= t.minXP && currentXP <= t.maxXP
  );
  
  // 4. Calculate progress to next rank
  const nextRank = RANK_TIERS[currentRank.rank + 1] || currentRank;
  
  return {
    ...currentRank,
    currentXP: 1600,
    nextLevelXP: 2000,
    xpUntilNextRank: 400,
    progressPercent: 60,  // (1600 - 1000) / (2000 - 1000) * 100
    isMaxRank: false
  };
};
```

### Storage Example
```
Input XP: 1600

Processing:
1. Find tier where 1600 is between minXP and maxXP
   → Matches Scholar tier (minXP: 1000, maxXP: 1999)

2. Calculate progress:
   - currentXP = 1600
   - nextLevelXP = 2000 (Expert tier)
   - xpUntilNextRank = 2000 - 1600 = 400
   - progressPercent = (1600 - 1000) / (2000 - 1000) * 100 = 60%

Return Object: {
  rank: 2,
  name: "Scholar",
  emoji: "🟣",
  color: "#8b5cf6",
  currentXP: 1600,
  nextLevelXP: 2000,
  xpUntilNextRank: 400,
  progressPercent: 60,
  isMaxRank: false
}
```

---

## 4. Rank-Up Detection & Storage

### Code Flow
```javascript
export const checkRankUp = (userId) => {
  // 1. Get last recorded rank
  const storageKey = getUserStorageKey(userId, "last_rank");
  const lastRank = parseInt(localStorage.getItem(storageKey) || "0");
  
  // 2. Calculate current rank from XP
  const currentRank = getUserRank(userId);
  
  // 3. Compare - did rank advance?
  if (currentRank.rank > lastRank) {
    // 4. Update stored rank
    localStorage.setItem(storageKey, currentRank.rank.toString());
    
    // 5. Log and return new rank
    console.log(`🎉 User ranked up to ${currentRank.name}!`);
    return currentRank;
  }
  
  return null;  // No rank up
};
```

### Storage Example

**Scenario**: Student goes from 950 XP (Apprentice) to 1050 XP (Scholar)

```
Before:
localStorage = {
  "user_1_last_rank": "1",  // Was Apprentice
  "user_1_dashboard_stats": {
    "xp": 950
  }
}

After playing games (earn 100 XP):
Step 1: addXP() updates XP
localStorage = {
  "user_1_last_rank": "1",
  "user_1_dashboard_stats": {
    "xp": 1050  ← Updated
  }
}

Step 2: checkRankUp() detects advancement
  - lastRank = 1 (Apprentice)
  - currentRank = 2 (Scholar - because 1050 is in 1000-1999 range)
  - 2 > 1 → RANK UP!

Step 3: Update last_rank in storage
localStorage = {
  "user_1_last_rank": "2",  ← Updated to Scholar
  "user_1_dashboard_stats": {
    "xp": 1050
  }
}

Step 4: UserRank component shows:
✨ Celebration modal pops in
💜 "RANK UP! You're now a Scholar!"
```

---

## 5. User-Scoped Data Isolation

### Storage Key Pattern
```javascript
const getUserStorageKey = (userId, key) => `user_${userId}_${key}`;
```

### Multi-Student Example
```
Classroom with 3 students:

Student 1 (ID: 1):
  user_1_dashboard_stats
  user_1_last_rank
  user_1_daily_snapshot_2026-01-28
  
Student 2 (ID: 2):
  user_2_dashboard_stats
  user_2_last_rank
  user_2_daily_snapshot_2026-01-28
  
Student 3 (ID: 3):
  user_3_dashboard_stats
  user_3_last_rank
  user_3_daily_snapshot_2026-01-28

No data mixing - each student completely isolated!
```

### Code Example
```javascript
// Getting data for Student 1
getDashboardStats(1)  // Returns user_1_dashboard_stats

// Getting data for Student 2
getDashboardStats(2)  // Returns user_2_dashboard_stats

// They never mix because userId is in the key
```

---

## 6. Complete Data Flow Timeline

### Day 1 - Student Joins
```
9:00 AM - Login
  └─ No data yet

9:05 AM - Complete 2 games (100 points each)
  └─ addXP(1, 100)
  └─ addXP(1, 100)
  └─ localStorage["user_1_dashboard_stats"] = { xp: 200, coins: 200, ... }

9:30 AM - Dashboard loads
  └─ recordDailyProgressSnapshot(1)
  └─ localStorage["user_1_daily_snapshot_2026-01-28"] = { 
       date: "2026-01-28", 
       xp: 200, 
       gamesPlayed: 2, 
       ... 
     }
  └─ UserRank shows: Novice, 200/500 XP, 40%

Result:
localStorage = {
  "user_1_dashboard_stats": { xp: 200, coins: 200, gamesPlayed: 2, ... },
  "user_1_last_rank": "0",
  "user_1_daily_snapshot_2026-01-28": { xp: 200, gamesPlayed: 2, ... }
}
```

### Day 2 - Student Progresses
```
9:00 AM - Login, Dashboard loads
  └─ recordDailyProgressSnapshot(1) - NEW snapshot for today
  └─ localStorage["user_1_daily_snapshot_2026-01-29"] created

10:00 AM - Complete 5 games (100 each = 500 points)
  └─ addXP(1, 500)
  └─ localStorage["user_1_dashboard_stats"]["xp"] = 700

10:05 AM - Dashboard loads again
  └─ getUserRank(1) reads xp: 700
  └─ Matches Apprentice tier (500-999)
  └─ Returns rank: 1, Apprentice, 200/500 XP, 40% progress
  └─ checkRankUp(1):
     - lastRank = 0 (Novice)
     - currentRank = 1 (Apprentice)
     - 1 > 0 → RANK UP!
     - localStorage["user_1_last_rank"] = "1"
     - Returns new rank → celebration modal shows!

Result:
localStorage = {
  "user_1_dashboard_stats": { xp: 700, coins: 700, gamesPlayed: 7, ... },
  "user_1_last_rank": "1",  ← Updated!
  "user_1_daily_snapshot_2026-01-28": { xp: 200, ... },
  "user_1_daily_snapshot_2026-01-29": { xp: 700, ... }  ← New day!
}
```

### Day 5 - Student Reaches Scholar
```
Multiple days of playing...

Current State:
localStorage = {
  "user_1_dashboard_stats": { xp: 1050, coins: 2500, gamesPlayed: 45, ... },
  "user_1_last_rank": "1",  (Still Apprentice from day 2)
  "user_1_daily_snapshot_2026-01-28": { xp: 200, ... },
  "user_1_daily_snapshot_2026-01-29": { xp: 700, ... },
  "user_1_daily_snapshot_2026-01-30": { xp: 850, ... },
  "user_1_daily_snapshot_2026-01-31": { xp: 950, ... },
  "user_1_daily_snapshot_2026-02-01": { xp: 1050, ... }  ← Today
}

Dashboard loads:
  └─ getUserRank(1):
     - Reads xp: 1050
     - Matches Scholar tier (1000-1999)
     - Returns rank: 2, Scholar, 50/1000 XP, 5%
  
  └─ checkRankUp(1):
     - lastRank = 1
     - currentRank = 2
     - 2 > 1 → RANK UP!
     - localStorage["user_1_last_rank"] = "2"
     - CELEBRATION MODAL SHOWS! 🎉

Visual Result:
✨ Modal pops in with bounce animation
💜 "RANK UP!"
🟣 "You're now a Scholar!"
📊 Roadmap shows Scholar as current (glowing)
🏆 Celebration auto-dismisses after 5s
```

---

## 7. Data Validation & Integrity

### Input Validation
```javascript
addXP = (userId, xp) => {
  if (!userId || typeof userId !== "number") {
    console.error("Invalid userId");
    return;
  }
  
  if (!xp || xp < 0) {
    console.error("Invalid XP amount");
    return;
  }
  
  // ... proceed with save
};
```

### XP Never Decreases
```javascript
const stats = getDashboardStats(userId);
const newXP = (stats.xp || 0) + xp;  // Only addition, never subtraction
localStorage.setItem(userStatsKey, JSON.stringify({
  ...stats,
  xp: newXP
}));
```

### Rank Only Goes Forward
```javascript
if (currentRank.rank > lastRank) {
  // Only saves if HIGHER, never lower
  localStorage.setItem(storageKey, currentRank.rank.toString());
}
```

### Error Handling
```javascript
try {
  const rank = getUserRank(userId);
  return rank;
} catch (error) {
  console.error(`❌ Error getting rank:`, error);
  return null;  // Graceful fallback
}
```

---

## Summary

✅ **XP Awarded**: Saved to `user_{id}_dashboard_stats`
✅ **Daily Snapshots**: Saved to `user_{id}_daily_snapshot_{date}`
✅ **Last Rank**: Saved to `user_{id}_last_rank` (prevents duplicate notifications)
✅ **Data Isolated**: Each student's data completely separate
✅ **Always Increasing**: XP never decreases, rank only goes forward
✅ **Error Handling**: Try-catch blocks prevent data loss
✅ **Validated**: Input checking prevents invalid data entry
✅ **Efficient**: O(1) lookups, instant retrieval
✅ **User-Scoped**: No cross-student data leakage
✅ **Persistent**: Survives page refresh, browser close, logout/login

All user data is automatically saved to localStorage immediately upon earn/achievement!
