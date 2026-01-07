# Video Tracking with localStorage

## Overview
Video watch progress is now stored in **localStorage** instead of the backend database. This includes:
1. **Lesson Videos** - Videos watched in Step 1 of lessons
2. **Intro Videos** - Videos watched on science detail pages

## Files Modified

### 1. **storageManager.js** (`src/utils/storageManager.js`)
Added new functions for video tracking:

#### Lesson Video Functions:
- `markVideoWatched(userId, lessonId, videoId, videoData)` - Mark a video as watched
- `getWatchedVideos(userId, lessonId)` - Get all watched videos for a lesson
- `isVideoWatched(userId, lessonId, videoId)` - Check if specific video is watched
- `getWatchedVideoCount(userId, lessonId)` - Count watched videos

#### Intro Video Functions:
- `markIntroVideoWatched(userId, branch, scienceId)` - Mark intro video as watched
- `isIntroVideoWatched(userId, branch, scienceId)` - Check if intro video is watched

### 2. **Lesson.js** (`src/pages/Lesson.js`)
Updated to use localStorage for video progress:
- Imports `saveVideoToStorage` and `getWatchedVideos` from storageManager
- `markVideoWatched()` function now saves to localStorage instead of backend
- Videos continue to show as "✓ Completed" after watching

### 3. **ScienceDetail.js** (`src/pages/ScienceDetail.js`)
Added intro video tracking:
- Imports `markIntroVideoWatched` and `isIntroVideoWatched` from storageManager
- Displays status indicator when intro video is watched
- Manual button to mark video as watched
- Automatically tracks when iframe loads

## Data Structure

### Lesson Videos (localStorage)
Key: `scihub_user_{userId}_lesson_{lessonId}_videos`
```json
{
  "1": {
    "watched": true,
    "completedAt": "2024-01-06T12:00:00.000Z",
    "title": "Introduction to Biology"
  },
  "2": {
    "watched": true,
    "completedAt": "2024-01-06T12:05:00.000Z",
    "title": "Scientific Method"
  }
}
```

### Intro Videos (localStorage)
Key: `scihub_user_{userId}_intro_video_{branch}_{scienceId}`
```json
{
  "watched": true,
  "watchedAt": "2024-01-06T12:10:00.000Z",
  "branch": "natural",
  "scienceId": "biology"
}
```

## How It Works

### Step 1 - Lesson Videos
1. User watches a video in the lesson
2. When video ends or "Mark Complete" is clicked, `markVideoWatched()` is called
3. Video ID is saved to localStorage with completion timestamp
4. Video card shows "✓ Completed - Click to review"
5. Progress bar updates to reflect completed videos

### Intro Videos
1. User navigates to a science detail page
2. Intro video iframe loads on the page
3. `handleIntroVideoWatched()` is triggered on iframe load
4. Video is marked as watched in localStorage
5. A "✓ Completed" badge appears next to "Intro Video" heading
6. Button changes from "Mark as Watched" to "✓ Intro Video Watched"

## Persistence
- Data persists across browser sessions until localStorage is manually cleared
- Each user's data is isolated by their user ID
- Data structure supports multiple lessons and subjects per user

## Usage Examples

### Checking if a video was watched:
```javascript
import { isVideoWatched } from "../utils/storageManager";

const watched = isVideoWatched(userId, lessonId, videoId);
// Returns: true/false
```

### Getting all watched videos for a lesson:
```javascript
import { getWatchedVideos } from "../utils/storageManager";

const allWatched = getWatchedVideos(userId, lessonId);
// Returns: { "1": {...}, "2": {...}, ... }
```

### Checking intro video status:
```javascript
import { isIntroVideoWatched } from "../utils/storageManager";

const introWatched = isIntroVideoWatched(userId, "natural", "biology");
// Returns: true/false
```

## Re-enabling Backend
To switch back to backend database tracking:
1. Replace localStorage functions with axios API calls in each component
2. Update endpoints to match backend API structure
3. Ensure backend server is running and accessible

## Notes
- Backend database for video tracking is currently **disabled**
- All video progress is stored **locally** in browser storage
- Users can view their progress across multiple browsers since data is browser-local
- No internet connection required for video tracking (data stored locally)
