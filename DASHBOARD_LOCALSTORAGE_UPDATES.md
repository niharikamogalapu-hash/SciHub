# Dashboard Local Storage Implementation - Complete Guide

## Overview
The dashboard has been completely refactored to use **localStorage** for persistent data storage. All user progress, stats, and activity are now automatically saved and synced across the application.

## What Changed

### 1. **storageManager.js** - New Dashboard Functions
Added comprehensive dashboard management functions:

#### Dashboard Stats Functions
```javascript
// Get user's dashboard statistics
const stats = getDashboardStats(userId);

// Update dashboard statistics  
setDashboardStats(userId, { xp: 2500, coins: 150 });

// Add XP (automatically updates dashboard)
addXP(userId, 50);

// Add coins (automatically updates dashboard)
addCoins(userId, 10);

// Add game score (automatically updates dashboard)
addGameScore(userId, 100);
```

**Stored as:** `scihub_user_<userId>_dashboard_stats`

#### Lesson Completion Functions
```javascript
// Mark a lesson as completed
markLessonCompleted(userId, lessonId, { title, category, subject });

// Check if lesson is completed
isLessonCompleted(userId, lessonId);

// Get all completed lessons
getCompletedLessons(userId);
```

**Stored as:** `scihub_user_<userId>_completed_lessons`

#### Tutoring Session Functions
```javascript
// Book a tutoring session
bookTutoringSession(userId, {
  tutorName: "Dr. Rivera",
  subject: "Biology",
  date: "2024-01-20",
  time: "14:00"
});

// Get all booked sessions
getBookedSessions(userId);
```

**Stored as:** `scihub_user_<userId>_booked_sessions`

#### Activity Logging Functions
```javascript
// Log user activity
logActivity(userId, {
  type: "Lesson Completed",
  description: "Finished Photosynthesis lesson",
  subject: "Biology"
});

// Get recent activity
getActivityLog(userId, limit = 10);
```

**Stored as:** `scihub_user_<userId>_activity_log` (keeps last 50 entries)

---

### 2. **Dashboard.js** - Auto-Loading from Storage

#### Key Changes:
✅ **Automatic Data Loading** - Loads all user data from localStorage on mount
✅ **Real-Time Updates** - Listens to storage change events
✅ **Auto-Refresh** - Refreshes every 10 seconds to catch updates from other pages/tabs
✅ **Event-Driven** - Updates when:
  - Lesson completed
  - Coins earned/spent
  - XP gained
  - Session booked
  - Game completed

#### Data Flow:
1. Component mounts → Calls `loadDashboardData()`
2. Fetches stats from `getDashboardStats()`
3. Fetches sessions from `getBookedSessions()`
4. Fetches activity from `getActivityLog()`
5. Listens to `dashboardStorageChange` events
6. Auto-refreshes every 10 seconds

---

### 3. **Lesson.js** - Saves on Completion

#### What Happens When Lesson Completed:
1. Awards **50 XP** via `addXP()`
2. Marks lesson as completed via `markLessonCompleted()`
3. Logs activity via `logActivity()`
4. Updates local user object
5. Dispatches `dashboardStorageChange` event
6. Navigates to next lesson

#### Key Updates:
```javascript
// Instead of:
localStorage.setItem("user", JSON.stringify(updatedUser));

// Now uses:
addXP(user.id, 50);
markLessonCompleted(user.id, lesson.id, { title, category, subject });
logActivity(user.id, { type: "Lesson Completed", ... });
```

---

### 4. **Schedule.js** - Saves Sessions

#### What Happens When Session Booked:
1. Validates user is logged in
2. Books session via `bookTutoringSession()`
3. Logs activity via `logActivity()`
4. Shows success message
5. Resets form
6. Dispatches `dashboardStorageChange` event
7. Dashboard auto-updates

#### Key Features:
✅ Form validation with error messages
✅ Success confirmation
✅ Automatic dashboard sync
✅ Real-time feedback

---

### 5. **Games.js** - Saves Game Scores

#### What Happens When Game Completed:
1. Adds game score via `addGameScore()`
2. Logs activity via `logActivity()`
3. Updates user coins
4. Shows completion modal
5. Dispatches `dashboardStorageChange` event
6. Dashboard auto-updates

#### Key Updates:
```javascript
// Now includes:
addGameScore(user.id, activeGame.base_reward);
logActivity(user.id, {
  type: "Game Won",
  description: `Completed ${activeGame.title}`
});
```

---

### 6. **AIQuiz.js** - Logs Quiz Generation

#### What Happens When Quiz Generated:
1. Checks user is logged in
2. Generates quiz questions
3. Logs activity via `logActivity()`
4. Awards **5 XP** via `addXP()`
5. Dispatches `dashboardStorageChange` event
6. Dashboard auto-updates

---

## Data Structure

### Dashboard Stats (localStorage key: `scihub_user_<userId>_dashboard_stats`)
```json
{
  "xp": 2450,
  "coins": 125,
  "streak": 7,
  "lessonsCompleted": 12,
  "lessonsInProgress": 8,
  "totalGameScore": 3540,
  "lastActivityDate": "2024-01-10T15:30:00.000Z",
  "createdAt": "2024-01-01T10:00:00.000Z"
}
```

### Completed Lessons (localStorage key: `scihub_user_<userId>_completed_lessons`)
```json
[
  {
    "id": 1,
    "title": "Cell Structure & Function",
    "category": "biology",
    "subject": "Biology",
    "completedAt": "2024-01-10T15:30:00.000Z"
  }
]
```

### Booked Sessions (localStorage key: `scihub_user_<userId>_booked_sessions`)
```json
[
  {
    "id": 1704950400000,
    "tutorId": "t1",
    "tutorName": "Dr. Rivera",
    "subject": "Biology",
    "date": "2024-01-20",
    "time": "14:00",
    "sessionTime": "2024-01-20T14:00:00.000Z",
    "zoomLink": "https://zoom.us/...",
    "bookedAt": "2024-01-10T15:30:00.000Z"
  }
]
```

### Activity Log (localStorage key: `scihub_user_<userId>_activity_log`)
```json
[
  {
    "id": 1704950400000,
    "type": "Lesson Completed",
    "description": "Finished Photosynthesis lesson",
    "subject": "Biology",
    "created_at": "2024-01-10T15:30:00.000Z"
  }
]
```

---

## How Events Work

### Dashboard Storage Change Event
Dispatched whenever data is updated:
```javascript
window.dispatchEvent(new CustomEvent("dashboardStorageChange"));
```

**Listened by:**
- Dashboard.js → Triggers `loadDashboardData()`
- Any other page that needs updates

### Custom Event Flow
```
Lesson Completed
      ↓
addXP() → Updates dashboard_stats in localStorage
markLessonCompleted() → Updates completed_lessons
logActivity() → Updates activity_log
      ↓
dispatchEvent("dashboardStorageChange")
      ↓
Dashboard Listener → Calls loadDashboardData()
      ↓
Dashboard Re-renders with new data
```

---

## Feature Summary

| Feature | Trigger | Action | Storage |
|---------|---------|--------|---------|
| **XP Gain** | Lesson complete, Quiz generated | `addXP()` | dashboard_stats |
| **Coins** | Game complete, Lesson reward | `addCoins()` | dashboard_stats |
| **Lessons** | Lesson completion step | `markLessonCompleted()` | completed_lessons |
| **Game Score** | Game completion | `addGameScore()` | dashboard_stats |
| **Sessions** | Form submission | `bookTutoringSession()` | booked_sessions |
| **Activity** | Any major action | `logActivity()` | activity_log |

---

## Testing Checklist

- [ ] Complete a lesson → Check XP increased on Dashboard
- [ ] Complete a game → Check game score increased on Dashboard
- [ ] Book a tutoring session → Check appears in "Upcoming Sessions"
- [ ] Generate a quiz → Check activity logged
- [ ] Refresh page → All data persists
- [ ] Open in new tab → Data syncs between tabs (10s refresh)
- [ ] Check localStorage in DevTools → All data properly stored
- [ ] Close browser & reopen → Data still there

---

## Browser DevTools Inspection

To view stored data in Chrome/Firefox DevTools:

1. Open DevTools (F12)
2. Go to **Application** → **Local Storage**
3. Look for keys starting with `scihub_user_`
4. Example key: `scihub_user_1704534000000_dashboard_stats`

---

## API Reference Summary

### Core Functions
- `getDashboardStats(userId)` - Get all dashboard stats
- `setDashboardStats(userId, stats)` - Update dashboard stats
- `addXP(userId, amount)` - Add XP to user
- `addCoins(userId, amount)` - Add coins to user
- `addGameScore(userId, score)` - Add game score
- `markLessonCompleted(userId, lessonId, data)` - Complete lesson
- `bookTutoringSession(userId, sessionData)` - Book session
- `logActivity(userId, activityData)` - Log activity
- `getActivityLog(userId, limit)` - Get recent activities
- `getBookedSessions(userId)` - Get all sessions
- `getCompletedLessons(userId)` - Get completed lessons

### Event System
```javascript
// Listen to storage changes
window.addEventListener("dashboardStorageChange", () => {
  // Reload dashboard data
});

// Dispatch update
window.dispatchEvent(new CustomEvent("dashboardStorageChange"));
```

---

## Notes

- All timestamps are ISO 8601 format
- Data is automatically saved on every action
- Activity log keeps last 50 entries
- Stats are always merged (never fully replaced)
- User-specific data is isolated by userId
- No backend calls required for data persistence
