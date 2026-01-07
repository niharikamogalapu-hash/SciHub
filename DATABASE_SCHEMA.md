# SciHub Lesson Progress Database Schema

## Overview
This schema tracks user progress through multi-step lessons (6 steps total). Each step unlocks when the previous step is completed.

---

## Tables

### 0. **lessons**
Stores all lesson information and metadata.

```sql
CREATE TABLE lessons (
  id INT PRIMARY KEY AUTO_INCREMENT,
  subject_id INT NOT NULL,                       -- References subsciences/subjects (Biology, Chemistry, Physics, etc.)
  lesson_number INT NOT NULL,                    -- 1-10 for each subject
  
  title VARCHAR(255) NOT NULL,                   -- e.g., "Introduction to Biology"
  description TEXT,                              -- Lesson overview/summary
  
  -- Step 1: Videos
  video_count INT DEFAULT 5,                     -- Number of videos in step 1
  
  -- Step 2: Tutoring
  has_tutoring BOOLEAN DEFAULT TRUE,             -- Whether tutoring is available
  
  -- Step 3: Worksheets
  worksheet_count INT DEFAULT 2,                 -- Number of worksheets
  
  -- Step 4: Q&A
  has_qa BOOLEAN DEFAULT TRUE,                   -- Whether Q&A is available
  
  -- Step 5: Games
  has_game BOOLEAN DEFAULT TRUE,                 -- Whether a game is available
  game_type VARCHAR(100),                        -- Type of game (quiz, simulation, etc.)
  
  difficulty_level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'intermediate',
  estimated_hours DECIMAL(3, 1) DEFAULT 2.0,    -- Estimated time to complete
  
  is_published BOOLEAN DEFAULT FALSE,            -- Whether lesson is visible to users
  is_locked BOOLEAN DEFAULT FALSE,               -- Admin lock to disable lesson
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (subject_id) REFERENCES subsciences(id),
  UNIQUE KEY unique_subject_lesson (subject_id, lesson_number),
  INDEX idx_subject_id (subject_id),
  INDEX idx_published (is_published)
);
```

---

### 1. **lesson_progress**
Tracks overall progress for each user in each lesson.

```sql
CREATE TABLE lesson_progress (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  lesson_id INT NOT NULL,
  
  -- Step completion tracking
  step_1_completed BOOLEAN DEFAULT FALSE,        -- Watched all 5 videos
  step_2_completed BOOLEAN DEFAULT FALSE,        -- Booked a tutoring session
  step_3_completed BOOLEAN DEFAULT FALSE,        -- Submitted both worksheets
  step_4_completed BOOLEAN DEFAULT FALSE,        -- Posted in Q&A
  step_5_completed BOOLEAN DEFAULT FALSE,        -- Completed game
  step_6_completed BOOLEAN DEFAULT FALSE,        -- Finished lesson
  
  current_step INT DEFAULT 1,
  lesson_progress_percentage INT DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (lesson_id) REFERENCES lessons(id),
  UNIQUE KEY unique_user_lesson (user_id, lesson_id),
  INDEX idx_user_id (user_id),
  INDEX idx_lesson_id (lesson_id)
);
```

---

### 2. **video_progress**
Tracks which videos a user has watched and marked complete.

```sql
CREATE TABLE video_progress (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  lesson_id INT NOT NULL,
  video_id INT NOT NULL,
  
  watched BOOLEAN DEFAULT FALSE,
  completed BOOLEAN DEFAULT FALSE,
  
  watch_started_at TIMESTAMP NULL,
  completed_at TIMESTAMP NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (lesson_id) REFERENCES lessons(id),
  UNIQUE KEY unique_user_video (user_id, lesson_id, video_id),
  INDEX idx_user_id (user_id),
  INDEX idx_lesson_id (lesson_id)
);
```

---

### 3. **tutor_bookings**
Tracks tutoring sessions booked by students.

```sql
CREATE TABLE tutor_bookings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  lesson_id INT NOT NULL,
  session_id INT NOT NULL,
  tutor_id INT NOT NULL,
  
  booked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  attended BOOLEAN DEFAULT FALSE,
  attended_at TIMESTAMP NULL,
  
  session_time DATETIME NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (lesson_id) REFERENCES lessons(id),
  FOREIGN KEY (tutor_id) REFERENCES tutors(id),
  FOREIGN KEY (session_id) REFERENCES tutor_sessions(id),
  INDEX idx_user_id (user_id),
  INDEX idx_lesson_id (lesson_id),
  INDEX idx_session_id (session_id)
);
```

---

### 4. **worksheet_submissions**
Tracks worksheet completion and scores.

```sql
CREATE TABLE worksheet_submissions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  lesson_id INT NOT NULL,
  worksheet_id INT NOT NULL,        -- 1 or 2
  
  answers JSON NOT NULL,             -- Array of selected answers {q_id: option_index}
  total_questions INT NOT NULL,      -- Should be 10
  correct_answers INT NOT NULL,      -- Number of correct answers
  score_percentage INT NOT NULL,     -- (correct_answers / total_questions) * 100
  
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (lesson_id) REFERENCES lessons(id),
  UNIQUE KEY unique_user_worksheet (user_id, lesson_id, worksheet_id),
  INDEX idx_user_id (user_id),
  INDEX idx_lesson_id (lesson_id)
);
```

---

### 5. **qa_posts**
Tracks student Q&A contributions (questions and answers).

```sql
CREATE TABLE qa_posts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  lesson_id INT NOT NULL,
  
  post_type ENUM('question', 'answer') NOT NULL,
  content TEXT NOT NULL,
  
  likes_count INT DEFAULT 0,
  replies_count INT DEFAULT 0,
  
  is_flagged BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (lesson_id) REFERENCES lessons(id),
  INDEX idx_user_id (user_id),
  INDEX idx_lesson_id (lesson_id),
  INDEX idx_post_type (post_type),
  INDEX idx_created_at (created_at)
);
```

---

### 6. **qa_post_likes**
Tracks likes on Q&A posts (prevents duplicate likes).

```sql
CREATE TABLE qa_post_likes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  post_id INT NOT NULL,
  
  liked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (post_id) REFERENCES qa_posts(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_post (user_id, post_id),
  INDEX idx_post_id (post_id)
);
```

---

### 7. **qa_post_comments** (Optional - for Step 4 replies)
Tracks replies/comments on Q&A posts.

```sql
CREATE TABLE qa_post_comments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  
  content TEXT NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (post_id) REFERENCES qa_posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_post_id (post_id),
  INDEX idx_user_id (user_id)
);
```

---

### 8. **game_progress** (For Step 5)
Tracks game completion data.

```sql
CREATE TABLE game_progress (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  lesson_id INT NOT NULL,
  
  game_id INT NOT NULL,
  
  score INT DEFAULT 0,
  level_completed INT DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  
  started_at TIMESTAMP NULL,
  completed_at TIMESTAMP NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (lesson_id) REFERENCES lessons(id),
  INDEX idx_user_id (user_id),
  INDEX idx_lesson_id (lesson_id)
);
```

---

---

## Related Reference Tables

### **subsciences** (Pre-existing - referenced by lessons)
Subject/discipline table for Biology, Chemistry, Physics, etc.

```sql
CREATE TABLE subsciences (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,                    -- e.g., "Biology", "Chemistry"
  code VARCHAR(50) UNIQUE,                       -- e.g., "biology", "chemistry"
  description TEXT,
  icon_url VARCHAR(255),
  color_code VARCHAR(7),                         -- Hex color for UI
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_code (code)
);
```

### **users** (Pre-existing - referenced by progress tables)
User authentication and profile table.

```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  firstName VARCHAR(100),
  lastName VARCHAR(100),
  password_hash VARCHAR(255),
  
  profile_picture_url VARCHAR(255),
  bio TEXT,
  
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_email (email),
  INDEX idx_is_active (is_active)
);
```

### **tutors** (For Step 2 - Tutoring)
Tutor information and availability.

```sql
CREATE TABLE tutors (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,                         -- Links to users table
  name VARCHAR(255) NOT NULL,
  bio TEXT,
  
  specializations JSON,                         -- Array of subject IDs
  years_experience INT,
  hourly_rate DECIMAL(8, 2),
  
  is_available BOOLEAN DEFAULT TRUE,
  rating_average DECIMAL(3, 2),
  total_reviews INT DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_user_id (user_id),
  INDEX idx_is_available (is_available)
);
```

### **tutor_sessions** (For Step 2 - Available Sessions)
Tutoring session slots available for booking.

```sql
CREATE TABLE tutor_sessions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  tutor_id INT NOT NULL,
  lesson_id INT NOT NULL,
  
  session_time DATETIME NOT NULL,
  max_spots INT DEFAULT 5,
  booked_spots INT DEFAULT 0,
  
  is_active BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (tutor_id) REFERENCES tutors(id),
  FOREIGN KEY (lesson_id) REFERENCES lessons(id),
  INDEX idx_tutor_id (tutor_id),
  INDEX idx_session_time (session_time),
  INDEX idx_lesson_id (lesson_id)
);
```

---

## Relationships & Flow

```
lesson_progress (main tracking table)
├── video_progress (Step 1)
│   └── When all 5 videos watched → step_1_completed = TRUE
│
├── tutor_bookings (Step 2)
│   └── When session booked → step_2_completed = TRUE
│
├── worksheet_submissions (Step 3)
│   └── When both worksheets submitted → step_3_completed = TRUE
│
├── qa_posts (Step 4)
│   ├── qa_post_likes
│   └── qa_post_comments
│       └── When post created → step_4_completed = TRUE
│
├── game_progress (Step 5)
│   └── When game completed → step_5_completed = TRUE
│
└── lesson_completion (Step 6)
    └── When all steps complete → step_6_completed = TRUE
```

---

## Indexes

**Performance optimizations:**
- User lookups: `idx_user_id` on all tables
- Lesson lookups: `idx_lesson_id` on progress tables
- Timeline queries: `idx_created_at` on qa_posts
- Progress aggregation: `unique_user_lesson` on lesson_progress

---

## Queries for Key Operations

### Get User's Current Step
```sql
SELECT current_step FROM lesson_progress
WHERE user_id = ? AND lesson_id = ?;
```

### Get Video Completion Status
```sql
SELECT COUNT(*) as completed_videos
FROM video_progress
WHERE user_id = ? AND lesson_id = ? AND completed = TRUE;
```

### Calculate Step 3 Completion
```sql
SELECT COUNT(*) as submitted_worksheets
FROM worksheet_submissions
WHERE user_id = ? AND lesson_id = ?;
-- Returns 0, 1, or 2 (when 2 = step 3 complete)
```

### Get Recent Q&A Posts
```sql
SELECT * FROM qa_posts
WHERE lesson_id = ?
ORDER BY created_at DESC
LIMIT 20;
```

### Update Progress Percentage
```sql
UPDATE lesson_progress
SET lesson_progress_percentage = (
  (step_1_completed * 16.67) +
  (step_2_completed * 16.67) +
  (step_3_completed * 16.67) +
  (step_4_completed * 16.67) +
  (step_5_completed * 16.67) +
  (step_6_completed * 16.67)
)
WHERE user_id = ? AND lesson_id = ?;
```

---

## Notes

1. **Step Progression**: Each step unlocks only after the previous step is complete
2. **Video Completion**: All 5 videos must be marked complete in `video_progress`
3. **Worksheet Scoring**: Stores answers as JSON for review/analytics
4. **Q&A Community**: Both questions and answers contribute to Step 4 completion
5. **Automatic Updates**: Use triggers or application logic to update `lesson_progress` when subtasks complete
6. **User Privacy**: Q&A posts should be visible to all lesson participants but editable only by creator

