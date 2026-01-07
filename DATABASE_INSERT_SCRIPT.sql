-- ============================================================
-- SciHub Database - Sample Data for Lessons
-- ============================================================

-- Step 1: Insert Subsciences (Subjects)
-- ============================================================

INSERT INTO subsciences (id, name, code, description, color_code) VALUES
(1, 'Biology', 'biology', 'Discover living systems, cells, genetics and ecology', '#10b981'),
(2, 'Chemistry', 'chemistry', 'Master atomic structure, bonding, reactions and solutions', '#f59e0b'),
(3, 'Physics', 'physics', 'Explore motion, forces, energy and waves', '#3b82f6');


-- Step 2: Insert Lessons for Biology (10 Lessons)
-- ============================================================

INSERT INTO lessons (
  subject_id, 
  lesson_number, 
  title, 
  description, 
  video_count, 
  has_tutoring, 
  worksheet_count, 
  has_qa, 
  has_game, 
  game_type, 
  difficulty_level, 
  estimated_hours, 
  is_published
) VALUES

-- Lesson 1: Introduction to Biology
(1, 1, 'Introduction to Biology', 
'Master the fundamentals of biology including the scientific method, branches of biology, and life organization.',
5, TRUE, 2, TRUE, TRUE, 'quiz', 'beginner', 2.5, TRUE),

-- Lesson 2: Cell Structure and Function
(1, 2, 'Cell Structure and Function', 
'Explore cell types, organelles, cell membranes and how cells carry out life functions.',
5, TRUE, 2, TRUE, TRUE, 'interactive', 'beginner', 2.5, TRUE),

-- Lesson 3: DNA and Genetics
(1, 3, 'DNA and Genetics', 
'Understand DNA structure, genetic inheritance, and how traits are passed down through generations.',
5, TRUE, 2, TRUE, TRUE, 'quiz', 'intermediate', 3.0, TRUE),

-- Lesson 4: Cell Division and Reproduction
(1, 4, 'Cell Division and Reproduction', 
'Learn about mitosis, meiosis, and asexual vs sexual reproduction in organisms.',
5, TRUE, 2, TRUE, TRUE, 'interactive', 'intermediate', 3.0, TRUE),

-- Lesson 5: Evolution and Natural Selection
(1, 5, 'Evolution and Natural Selection', 
'Discover how species adapt and evolve over time through natural selection mechanisms.',
5, TRUE, 2, TRUE, TRUE, 'quiz', 'intermediate', 3.0, TRUE),

-- Lesson 6: Plant Biology and Photosynthesis
(1, 6, 'Plant Biology and Photosynthesis', 
'Study plant structures, photosynthesis, and how plants convert light into chemical energy.',
5, TRUE, 2, TRUE, TRUE, 'interactive', 'intermediate', 3.0, TRUE),

-- Lesson 7: Human Body Systems
(1, 7, 'Human Body Systems', 
'Examine the circulatory, respiratory, digestive, and nervous systems in humans.',
5, TRUE, 2, TRUE, TRUE, 'quiz', 'intermediate', 3.5, TRUE),

-- Lesson 8: Ecology and Ecosystems
(1, 8, 'Ecology and Ecosystems', 
'Explore populations, communities, food chains, and ecosystem dynamics.',
5, TRUE, 2, TRUE, TRUE, 'interactive', 'intermediate', 3.0, TRUE),

-- Lesson 9: Microorganisms and Disease
(1, 9, 'Microorganisms and Disease', 
'Understand bacteria, viruses, fungi, and how disease transmission and immunity work.',
5, TRUE, 2, TRUE, TRUE, 'quiz', 'advanced', 3.5, TRUE),

-- Lesson 10: Biotechnology and Modern Biology
(1, 10, 'Biotechnology and Modern Biology', 
'Learn about genetic engineering, CRISPR, cloning, and modern biotechnology applications.',
5, TRUE, 2, TRUE, TRUE, 'simulation', 'advanced', 3.5, TRUE);


-- Step 3: Insert Tutors (Example Tutors for Biology)
-- ============================================================

INSERT INTO tutors (id, user_id, name, bio, specializations, years_experience, hourly_rate, is_available, rating_average, total_reviews) VALUES
(1, 1, 'Dr. Sarah Mitchell', 
'Expert in Biology with 10+ years of teaching experience. Specializes in cellular biology and genetics.', 
'[1]', 12, 50.00, TRUE, 4.9, 87),

(2, 2, 'Prof. James Chen', 
'Passionate educator with a focus on interactive learning. Great at breaking down complex concepts.', 
'[1]', 8, 45.00, TRUE, 4.8, 64);


-- Step 4: Insert Tutor Sessions for Lesson 1 (Example: 2 weeks of sessions)
-- ============================================================

-- For Tutor 1 (Dr. Sarah Mitchell) - Lesson 1
INSERT INTO tutor_sessions (tutor_id, lesson_id, session_time, max_spots, booked_spots, is_active) VALUES
-- Week 1 - Jan 8-14, 2026
(1, 1, '2026-01-08 09:00:00', 5, 2, TRUE),
(1, 1, '2026-01-08 10:00:00', 5, 1, TRUE),
(1, 1, '2026-01-08 11:00:00', 5, 0, TRUE),
(1, 1, '2026-01-08 14:00:00', 5, 3, TRUE),
(1, 1, '2026-01-08 15:00:00', 5, 2, TRUE),

(1, 1, '2026-01-09 09:00:00', 5, 0, TRUE),
(1, 1, '2026-01-09 10:00:00', 5, 1, TRUE),
(1, 1, '2026-01-09 14:00:00', 5, 2, TRUE),
(1, 1, '2026-01-09 15:00:00', 5, 3, TRUE),

(1, 1, '2026-01-10 09:00:00', 5, 1, TRUE),
(1, 1, '2026-01-10 11:00:00', 5, 2, TRUE),
(1, 1, '2026-01-10 14:00:00', 5, 0, TRUE),
(1, 1, '2026-01-10 15:00:00', 5, 4, TRUE),

-- For Tutor 2 (Prof. James Chen) - Lesson 1
(2, 1, '2026-01-08 10:00:00', 5, 2, TRUE),
(2, 1, '2026-01-08 12:00:00', 5, 1, TRUE),
(2, 1, '2026-01-08 15:00:00', 5, 3, TRUE),
(2, 1, '2026-01-08 16:00:00', 5, 0, TRUE),

(2, 1, '2026-01-09 11:00:00', 5, 2, TRUE),
(2, 1, '2026-01-09 13:00:00', 5, 1, TRUE),
(2, 1, '2026-01-09 16:00:00', 5, 2, TRUE),

(2, 1, '2026-01-10 10:00:00', 5, 0, TRUE),
(2, 1, '2026-01-10 12:00:00', 5, 3, TRUE),
(2, 1, '2026-01-10 14:00:00', 5, 1, TRUE);


-- Step 5: Insert Lessons for Chemistry (10 Lessons)
-- ============================================================

INSERT INTO lessons (
  subject_id, 
  lesson_number, 
  title, 
  description, 
  video_count, 
  has_tutoring, 
  worksheet_count, 
  has_qa, 
  has_game, 
  game_type, 
  difficulty_level, 
  estimated_hours, 
  is_published
) VALUES

(2, 1, 'Atomic Structure and the Periodic Table', 
'Understand atomic structure, electron configuration, and how the periodic table is organized.',
5, TRUE, 2, TRUE, TRUE, 'interactive', 'beginner', 2.5, TRUE),

(2, 2, 'Chemical Bonding and Compounds', 
'Learn about ionic, covalent, and metallic bonds, and how atoms combine to form compounds.',
5, TRUE, 2, TRUE, TRUE, 'quiz', 'beginner', 2.5, TRUE),

(2, 3, 'States of Matter and Phase Changes', 
'Explore the properties of solids, liquids, and gases, and understand phase transitions.',
5, TRUE, 2, TRUE, TRUE, 'interactive', 'intermediate', 3.0, TRUE),

(2, 4, 'Chemical Reactions and Equations', 
'Master balancing equations, types of reactions, and reaction rates.',
5, TRUE, 2, TRUE, TRUE, 'quiz', 'intermediate', 3.0, TRUE),

(2, 5, 'Acids, Bases, and pH', 
'Understand pH scale, acid-base reactions, and neutralization processes.',
5, TRUE, 2, TRUE, TRUE, 'interactive', 'intermediate', 3.0, TRUE),

(2, 6, 'Solutions and Solubility', 
'Study solutions, solubility, concentration, and dilution.',
5, TRUE, 2, TRUE, TRUE, 'quiz', 'intermediate', 3.0, TRUE),

(2, 7, 'Oxidation-Reduction Reactions', 
'Learn about electron transfer, oxidation states, and redox reactions.',
5, TRUE, 2, TRUE, TRUE, 'interactive', 'advanced', 3.5, TRUE),

(2, 8, 'Thermochemistry and Energy', 
'Explore energy changes in chemical reactions, enthalpy, and calorimetry.',
5, TRUE, 2, TRUE, TRUE, 'quiz', 'advanced', 3.5, TRUE),

(2, 9, 'Equilibrium and Reaction Kinetics', 
'Understand chemical equilibrium, Le Chatelier\'s principle, and reaction mechanisms.',
5, TRUE, 2, TRUE, TRUE, 'interactive', 'advanced', 3.5, TRUE),

(2, 10, 'Organic Chemistry Basics', 
'Introduction to carbon chemistry, hydrocarbons, and organic compound families.',
5, TRUE, 2, TRUE, TRUE, 'simulation', 'advanced', 4.0, TRUE);


-- Step 6: Insert Lessons for Physics (10 Lessons)
-- ============================================================

INSERT INTO lessons (
  subject_id, 
  lesson_number, 
  title, 
  description, 
  video_count, 
  has_tutoring, 
  worksheet_count, 
  has_qa, 
  has_game, 
  game_type, 
  difficulty_level, 
  estimated_hours, 
  is_published
) VALUES

(3, 1, 'Motion and Kinematics', 
'Understand displacement, velocity, acceleration, and kinematic equations.',
5, TRUE, 2, TRUE, TRUE, 'interactive', 'beginner', 2.5, TRUE),

(3, 2, 'Forces and Newton\'s Laws', 
'Learn Newton\'s three laws of motion and how to apply them to real-world situations.',
5, TRUE, 2, TRUE, TRUE, 'quiz', 'beginner', 2.5, TRUE),

(3, 3, 'Work, Energy, and Power', 
'Explore kinetic energy, potential energy, work-energy theorem, and power.',
5, TRUE, 2, TRUE, TRUE, 'interactive', 'intermediate', 3.0, TRUE),

(3, 4, 'Momentum and Collisions', 
'Understand conservation of momentum and analyze elastic and inelastic collisions.',
5, TRUE, 2, TRUE, TRUE, 'quiz', 'intermediate', 3.0, TRUE),

(3, 5, 'Circular Motion and Gravitation', 
'Study centripetal force, orbital motion, and Newton\'s law of universal gravitation.',
5, TRUE, 2, TRUE, TRUE, 'interactive', 'intermediate', 3.0, TRUE),

(3, 6, 'Simple Harmonic Motion and Waves', 
'Explore periodic motion, pendulums, springs, and wave properties.',
5, TRUE, 2, TRUE, TRUE, 'quiz', 'intermediate', 3.0, TRUE),

(3, 7, 'Sound and Acoustics', 
'Understand sound waves, frequency, wavelength, and the Doppler effect.',
5, TRUE, 2, TRUE, TRUE, 'interactive', 'intermediate', 3.0, TRUE),

(3, 8, 'Light and Optics', 
'Learn about light properties, reflection, refraction, and optical instruments.',
5, TRUE, 2, TRUE, TRUE, 'interactive', 'advanced', 3.5, TRUE),

(3, 9, 'Electricity and Magnetism', 
'Explore electric charge, current, circuits, magnetic fields, and electromagnetic induction.',
5, TRUE, 2, TRUE, TRUE, 'quiz', 'advanced', 3.5, TRUE),

(3, 10, 'Modern Physics: Atoms and Relativity', 
'Introduction to quantum mechanics, atomic structure, and Einstein\'s theory of relativity.',
5, TRUE, 2, TRUE, TRUE, 'simulation', 'advanced', 4.0, TRUE);


-- ============================================================
-- VERIFICATION QUERIES
-- ============================================================

-- View all lessons for Biology
-- SELECT * FROM lessons WHERE subject_id = 1;

-- View all tutors and their specializations
-- SELECT * FROM tutors;

-- View all tutor sessions for Biology Lesson 1
-- SELECT ts.*, t.name as tutor_name 
-- FROM tutor_sessions ts
-- JOIN tutors t ON ts.tutor_id = t.id
-- WHERE ts.lesson_id = 1
-- ORDER BY ts.session_time;

-- Count lessons by subject
-- SELECT s.name, COUNT(l.id) as lesson_count 
-- FROM subsciences s
-- LEFT JOIN lessons l ON s.id = l.subject_id
-- GROUP BY s.id, s.name;
