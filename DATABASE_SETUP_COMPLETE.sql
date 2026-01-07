-- ============================================================================
-- SciHub Complete Database Setup Script
-- This script creates all necessary tables for the lesson progress tracking system
-- ============================================================================

-- Disable foreign key checks temporarily
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================================
-- DROP EXISTING TABLES (if any) - in reverse dependency order
-- ============================================================================
DROP TABLE IF EXISTS qa_post_comments;
DROP TABLE IF EXISTS qa_post_likes;
DROP TABLE IF EXISTS qa_posts;
DROP TABLE IF EXISTS game_progress;
DROP TABLE IF EXISTS worksheet_submissions;
DROP TABLE IF EXISTS tutor_bookings;
DROP TABLE IF EXISTS video_progress;
DROP TABLE IF EXISTS lesson_progress;
DROP TABLE IF EXISTS activity_log;
DROP TABLE IF EXISTS user_stats;
DROP TABLE IF EXISTS tutor_sessions;
DROP TABLE IF EXISTS lessons;
DROP TABLE IF EXISTS tutors;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS subsciences;
DROP TABLE IF EXISTS sciences;

-- ============================================================================
-- CREATE REFERENCE TABLES (no dependencies)
-- ============================================================================

-- 1. sciences (Parent categories like "Natural Sciences", "Physical Sciences")
CREATE TABLE sciences (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(50) UNIQUE,
  description TEXT,
  icon_url VARCHAR(255),
  color_code VARCHAR(7),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_code (code)
);

-- 2. subsciences (Biology, Chemistry, Physics, etc. - child of sciences)
CREATE TABLE subsciences (
  id INT PRIMARY KEY AUTO_INCREMENT,
  science_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(50) UNIQUE,
  description TEXT,
  icon_url VARCHAR(255),
  color_code VARCHAR(7),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (science_id) REFERENCES sciences(id),
  INDEX idx_code (code),
  INDEX idx_science_id (science_id)
);

-- 2. users (Student/User accounts)
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

-- 2.1. user_stats (User progress and achievements tracking)
CREATE TABLE user_stats (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL UNIQUE,
  total_xp INT DEFAULT 0,
  total_points INT DEFAULT 0,
  total_lessons_completed INT DEFAULT 0,
  total_games_completed INT DEFAULT 0,
  total_worksheets_submitted INT DEFAULT 0,
  total_qa_posts INT DEFAULT 0,
  current_level INT DEFAULT 1,
  achievement_badges JSON DEFAULT NULL,
  last_activity_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id)
);

-- 2.2. activity_log (User activity tracking)
CREATE TABLE activity_log (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  activity_type VARCHAR(100) NOT NULL,
  subject VARCHAR(255),
  description TEXT,
  xp_earned INT DEFAULT 0,
  coins_earned INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_activity_type (activity_type),
  INDEX idx_created_at (created_at)
);

-- 3. tutors (Tutor information)
CREATE TABLE tutors (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  bio TEXT,
  specializations JSON,
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

-- ============================================================================
-- CREATE LESSONS TABLE
-- ============================================================================

CREATE TABLE lessons (
  id INT PRIMARY KEY AUTO_INCREMENT,
  subject_id INT NOT NULL,
  lesson_number INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  video_count INT DEFAULT 5,
  has_tutoring BOOLEAN DEFAULT TRUE,
  worksheet_count INT DEFAULT 2,
  has_qa BOOLEAN DEFAULT TRUE,
  has_game BOOLEAN DEFAULT TRUE,
  game_type VARCHAR(100),
  difficulty_level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'intermediate',
  estimated_hours DECIMAL(3, 1) DEFAULT 2.0,
  is_published BOOLEAN DEFAULT FALSE,
  is_locked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (subject_id) REFERENCES subsciences(id),
  UNIQUE KEY unique_subject_lesson (subject_id, lesson_number),
  INDEX idx_subject_id (subject_id),
  INDEX idx_published (is_published)
);

-- 4. tutor_sessions (Available tutoring slots)
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

-- ============================================================================
-- CREATE PROGRESS TRACKING TABLES
-- ============================================================================

-- 5. lesson_progress (Main tracking table)
CREATE TABLE lesson_progress (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  lesson_id INT NOT NULL,
  step_1_completed BOOLEAN DEFAULT FALSE,
  step_2_completed BOOLEAN DEFAULT FALSE,
  step_3_completed BOOLEAN DEFAULT FALSE,
  step_4_completed BOOLEAN DEFAULT FALSE,
  step_5_completed BOOLEAN DEFAULT FALSE,
  step_6_completed BOOLEAN DEFAULT FALSE,
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

-- 6. video_progress (Step 1 tracking)
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

-- 7. tutor_bookings (Step 2 tracking)
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

-- 8. worksheet_submissions (Step 3 tracking)
CREATE TABLE worksheet_submissions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  lesson_id INT NOT NULL,
  worksheet_id INT NOT NULL,
  answers JSON NOT NULL,
  total_questions INT NOT NULL,
  correct_answers INT NOT NULL,
  score_percentage INT NOT NULL,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (lesson_id) REFERENCES lessons(id),
  UNIQUE KEY unique_user_worksheet (user_id, lesson_id, worksheet_id),
  INDEX idx_user_id (user_id),
  INDEX idx_lesson_id (lesson_id)
);

-- 9. qa_posts (Step 4 tracking)
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

-- 10. qa_post_likes (Step 4 likes)
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

-- 11. qa_post_comments (Step 4 replies)
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

-- 12. game_progress (Step 5 tracking)
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

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- VERIFY TABLE CREATION
-- ============================================================================
SELECT 'Tables created successfully!' as status;
SHOW TABLES;

-- ============================================================================
-- SAMPLE DATA INSERTION (Optional - comment out if not needed)
-- ============================================================================

-- Insert sciences (parent categories)
INSERT INTO sciences (name, code, description, color_code) VALUES
('Natural Sciences', 'natural', 'Study of the natural world and living systems', '#10B981'),
('Social Sciences', 'social', 'Study of human society, culture, and behavior', '#8B5CF6');

-- Insert subsciences (child of sciences)
INSERT INTO subsciences (science_id, name, code, description, color_code) VALUES
(1, 'Biology', 'biology', 'Study of living organisms and life processes', '#00BCD4'),
(1, 'Chemistry', 'chemistry', 'Study of matter and chemical reactions', '#9C27B0'),
(1, 'Physics', 'physics', 'Study of matter, energy, and forces', '#FF9800'),
(2, 'History', 'history', 'Study of past events and civilizations', '#DC2626'),
(2, 'Psychology', 'psychology', 'Study of human behavior and mind', '#06B6D4'),
(2, 'Economics', 'economics', 'Study of production, consumption, and resources', '#F59E0B');

-- Insert sample users
INSERT INTO users (email, firstName, lastName, is_verified, is_active) VALUES
('student1@example.com', 'John', 'Doe', TRUE, TRUE),
('student2@example.com', 'Jane', 'Smith', TRUE, TRUE),
('tutor1@example.com', 'Dr. Sarah', 'Mitchell', TRUE, TRUE),
('tutor2@example.com', 'Prof. James', 'Chen', TRUE, TRUE);

-- Insert user stats for students
INSERT INTO user_stats (user_id, total_xp, total_points, total_lessons_completed, current_level) VALUES
(1, 450, 450, 3, 2),
(2, 300, 300, 2, 1);

-- Insert tutors
INSERT INTO tutors (user_id, name, bio, specializations, years_experience, hourly_rate, is_available) VALUES
(3, 'Dr. Sarah Mitchell', 'Expert in Biology with 10+ years of teaching experience', '[1]', 10, 45.00, TRUE),
(4, 'Prof. James Chen', 'Physics specialist with passion for student learning', '[3]', 8, 50.00, TRUE);

-- Insert lessons (10 per subject)
INSERT INTO lessons (subject_id, lesson_number, title, description, difficulty_level, estimated_hours, is_published) VALUES
-- Biology lessons
(1, 1, 'Introduction to Biology', 'Learn the basics of life and living organisms', 'beginner', 2.5, TRUE),
(1, 2, 'Cell Structure and Function', 'Understanding prokaryotic and eukaryotic cells', 'beginner', 3.0, TRUE),
(1, 3, 'Genetics and DNA', 'Explore heredity and genetic material', 'intermediate', 3.5, TRUE),
(1, 4, 'Evolution and Natural Selection', 'How species change over time', 'intermediate', 3.5, TRUE),
(1, 5, 'Ecology and Ecosystems', 'Relationships between organisms and environments', 'intermediate', 3.0, TRUE),
(1, 6, 'Photosynthesis and Respiration', 'Energy conversion in living organisms', 'intermediate', 3.0, TRUE),
(1, 7, 'Human Body Systems', 'Anatomy and physiology overview', 'intermediate', 4.0, TRUE),
(1, 8, 'Reproduction and Development', 'Biological reproduction and growth', 'intermediate', 3.5, TRUE),
(1, 9, 'Plant Biology', 'Structure and function of plants', 'intermediate', 3.0, TRUE),
(1, 10, 'Advanced Biology Topics', 'Capstone lesson covering complex concepts', 'advanced', 4.0, TRUE),

-- Chemistry lessons
(2, 1, 'Introduction to Chemistry', 'Fundamentals of matter and atoms', 'beginner', 2.5, TRUE),
(2, 2, 'Periodic Table and Elements', 'Understanding elements and their properties', 'beginner', 3.0, TRUE),
(2, 3, 'Atomic Structure', 'Protons, neutrons, and electron configuration', 'beginner', 3.0, TRUE),
(2, 4, 'Chemical Bonding', 'Ionic, covalent, and metallic bonds', 'intermediate', 3.5, TRUE),
(2, 5, 'Chemical Reactions', 'Types of reactions and stoichiometry', 'intermediate', 3.5, TRUE),
(2, 6, 'Acids and Bases', 'pH, neutralization, and acid-base reactions', 'intermediate', 3.0, TRUE),
(2, 7, 'Thermochemistry', 'Energy changes in chemical reactions', 'intermediate', 3.5, TRUE),
(2, 8, 'Equilibrium', 'Chemical equilibrium and Le Chatelier principle', 'intermediate', 3.5, TRUE),
(2, 9, 'Organic Chemistry Basics', 'Introduction to carbon compounds', 'intermediate', 3.5, TRUE),
(2, 10, 'Advanced Chemistry Topics', 'Kinetics, electrochemistry, and nuclear chemistry', 'advanced', 4.0, TRUE),

-- Physics lessons
(3, 1, 'Introduction to Physics', 'Fundamentals of motion and forces', 'beginner', 2.5, TRUE),
(3, 2, 'Kinematics', 'Motion in one and two dimensions', 'beginner', 3.0, TRUE),
(3, 3, 'Newton''s Laws of Motion', 'Force, mass, and acceleration', 'beginner', 3.5, TRUE),
(3, 4, 'Work, Energy, and Power', 'Energy transformation and conservation', 'intermediate', 3.5, TRUE),
(3, 5, 'Momentum and Collisions', 'Conservation of momentum', 'intermediate', 3.0, TRUE),
(3, 6, 'Waves and Sound', 'Properties and behavior of waves', 'intermediate', 3.5, TRUE),
(3, 7, 'Light and Optics', 'Reflection, refraction, and optical instruments', 'intermediate', 3.5, TRUE),
(3, 8, 'Electricity and Magnetism', 'Electric fields and magnetic forces', 'intermediate', 3.5, TRUE),
(3, 9, 'Modern Physics', 'Quantum mechanics and relativity basics', 'advanced', 4.0, TRUE),
(3, 10, 'Applied Physics Topics', 'Real-world applications and advanced concepts', 'advanced', 4.0, TRUE);

-- Insert tutor sessions (example: 9 sessions per day for 14 days for Biology lesson 1)
-- This is a simplified version - you may want to generate more
INSERT INTO tutor_sessions (tutor_id, lesson_id, session_time, max_spots, is_active) VALUES
(1, 1, '2025-01-07 09:00:00', 5, TRUE),
(1, 1, '2025-01-07 10:00:00', 5, TRUE),
(1, 1, '2025-01-07 11:00:00', 5, TRUE),
(1, 1, '2025-01-07 13:00:00', 5, TRUE),
(1, 1, '2025-01-07 14:00:00', 5, TRUE),
(2, 1, '2025-01-07 09:00:00', 5, TRUE),
(2, 1, '2025-01-07 10:00:00', 5, TRUE),
(2, 1, '2025-01-07 11:00:00', 5, TRUE),
(2, 1, '2025-01-07 13:00:00', 5, TRUE);

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
SELECT 'Sciences count:' as info, COUNT(*) as count FROM sciences;
SELECT 'Subsciences count:' as info, COUNT(*) as count FROM subsciences;
SELECT 'Users count:' as info, COUNT(*) as count FROM users;
SELECT 'Tutors count:' as info, COUNT(*) as count FROM tutors;
SELECT 'Lessons count:' as info, COUNT(*) as count FROM lessons;
SELECT 'Tutor sessions count:' as info, COUNT(*) as count FROM tutor_sessions;

SELECT 'Setup complete! Database is ready for use.' as message;
