# Achievements System - Complete Guide

## Overview

Achievements now work dynamically based on user milestones. Players automatically unlock achievements as they progress!

---

## Available Achievements

| Icon | Title | Requirement | Color |
|------|-------|-------------|-------|
| 🌟 | Rising Star | Earn 2000+ XP | Green |
| 🔥 | On Fire | Maintain 7-day streak | Orange |
| 🎮 | Game Master | Reach 3000+ game score | Blue |
| 📚 | Scholar | Complete 10 lessons | Purple |
| 📖 | Lesson Legend | Complete 25 lessons | Cyan |
| 💰 | Coin Collector | Earn 500+ coins | Yellow |
| ⚡ | Speed Demon | Complete 5 games | Red |
| 👨‍🏫 | Tutor Master | Book 5 tutoring sessions | Indigo |

---

## How It Works

### Automatic Unlocking
Achievements unlock automatically as you meet requirements:
- After earning XP → Check for XP achievements
- After completing lesson → Check for lesson achievements
- After playing game → Check for game achievements
- After booking session → Check for session achievements

### Visual Feedback
- **Locked**: Grayed out (50% opacity)
- **Unlocked**: Bright and colorful with ✓ mark
- **Hover**: Scales up slightly on hover to show it's interactive
- **Tooltip**: Shows unlock date when hovering

---

## How to Use in Code

### Get All Achievements
```javascript
import { getUserAchievementProgress } from "../utils/storageManager";

const achievements = getUserAchievementProgress(userId);
// Returns array with unlocked status for each achievement
```

### Check and Unlock Achievements
```javascript
import { checkAndUnlockAchievements } from "../utils/storageManager";

// Called automatically after user actions, but can call manually:
const newlyUnlocked = checkAndUnlockAchievements(userId);
console.log(`New achievements: ${newlyUnlocked.length}`);
```

### Get Next Achievement to Work Towards
```javascript
import { getNextAchievement } from "../utils/storageManager";

const next = getNextAchievement(userId);
if (next) {
  console.log(`Work towards: ${next.title}`);
}
```

### Manually Unlock Achievement
```javascript
import { unlockAchievement } from "../utils/storageManager";

unlockAchievement(userId, "rising_star");
```

---

## Integration Points

### Automatically Checked When:
1. ✅ XP is awarded → `addXP()`
2. ✅ Coins are earned → `addCoins()`
3. ✅ Lesson completed → `markLessonCompleted()`
4. ✅ Game finished → `addGameScore()`
5. ✅ Session booked → `bookTutoringSession()`
6. ✅ Quiz generated → `logActivity()`

### Dashboard Display:
- Loads achievements on mount
- Checks for unlocks on every refresh
- Shows unlocked badges as bright, locked as grayed out
- Displays unlock date on hover

---

## Storage

### Stored As:
```
Key: scihub_user_<userId>_unlocked_achievements
```

### Data Format:
```json
[
  {
    "id": "rising_star",
    "title": "Rising Star",
    "icon": "🌟",
    "color": "green",
    "description": "Earn 2000+ XP",
    "requirement": { "type": "xp", "value": 2000 },
    "unlockedAt": "2024-01-10T15:30:00.000Z"
  }
]
```

---

## Console Logging

Watch for achievement messages in console:
- 🏆 `Achievement Unlocked: Rising Star` - New unlock
- ✅ `Saved 2 newly unlocked achievements` - Batch save
- ⚠️ `Achievement rising_star not found` - Invalid ID

---

## Example Flow

```
User completes 10th lesson
        ↓
markLessonCompleted(userId, 10)
        ↓
checkAndUnlockAchievements(userId) called
        ↓
lessonsCompleted = 10 ≥ 10 (Scholar requirement)
        ↓
Achievement "Scholar" unlocked! 📚
        ↓
Stored in localStorage
        ↓
Dashboard detects change
        ↓
Achievement badge lights up with ✓ mark
```

---

## Requirements Reference

Each achievement has a `requirement` object:

```javascript
{
  type: "xp",                    // Type: xp, coins, gameScore, etc
  value: 2000                    // Threshold to meet
}
```

### Supported Types:
- `xp` - Total XP earned
- `coins` - Total coins earned
- `gameScore` - Total game score
- `lessonsCompleted` - Number of lessons completed
- `streak` - Current consecutive day streak
- `gamesCompleted` - Number of games played
- `sessionsBooked` - Number of tutoring sessions booked

---

## Customizing Achievements

To add/modify achievements, edit `getAllAchievements()` in [storageManager.js](src/utils/storageManager.js#L594):

```javascript
{
  id: "my_achievement",
  title: "My Achievement",
  icon: "🎯",
  color: "cyan",
  description: "Do something awesome",
  requirement: { type: "xp", value: 5000 },
  unlockedAt: null,
}
```

---

## Testing Achievements

### Quick Test:
1. Go to Dashboard
2. See locked/unlocked badges
3. Complete a lesson (should unlock Scholar at 10 lessons)
4. Play a game (should unlock Game Master at 3000 points)
5. Achievements auto-unlock!

### Manual Unlock (for testing):
```javascript
// In console:
const user = JSON.parse(localStorage.getItem('user'));
const achievements = JSON.parse(localStorage.getItem(`scihub_user_${user.id}_unlocked_achievements`) || '[]');

// Add an achievement manually
achievements.push({
  id: "test_achievement",
  title: "Test",
  icon: "✨",
  unlockedAt: new Date().toISOString()
});

localStorage.setItem(`scihub_user_${user.id}_unlocked_achievements`, JSON.stringify(achievements));
location.reload();
```

---

## API Summary

| Function | Purpose |
|----------|---------|
| `getAllAchievements()` | Get achievement templates |
| `getUnlockedAchievements(userId)` | Get unlocked achievements |
| `getUserAchievementProgress(userId)` | Get all with unlock status |
| `checkAndUnlockAchievements(userId)` | Auto-check and unlock |
| `unlockAchievement(userId, id)` | Manually unlock |
| `getNextAchievement(userId)` | Get next to work towards |

---

## Notes

- Achievements are stored per user (isolated by userId)
- Once unlocked, they stay unlocked
- Dashboard checks for new achievements every 10 seconds
- All timestamps in ISO 8601 format
- Grayed out achievements are locked but still visible as goals
