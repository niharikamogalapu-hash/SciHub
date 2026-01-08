import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./LessonsHub.css";

function Lessons() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredLessons, setFilteredLessons] = useState([]);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [lessonProgress, setLessonProgress] = useState({});

  const user = useMemo(() => JSON.parse(localStorage.getItem("user") || "null") || null, []);

  // Load completed lessons and progress from localStorage on mount
  useEffect(() => {
    let completedLessonIds = [];
    
    if (user && user.id) {
      // Get completed lessons from storageManager format
      const completedLessonsKey = `scihub_user_${user.id}_completed_lessons`;
      const completedData = JSON.parse(localStorage.getItem(completedLessonsKey) || "[]");
      completedLessonIds = completedData.map(l => l.id);
    } else {
      // Fallback to legacy format
      completedLessonIds = JSON.parse(localStorage.getItem("completedLessons") || "[]");
    }
    
    setCompletedLessons(completedLessonIds);
    
    // Build progress map (100% for completed, 0% for not started)
    const progressMap = {};
    completedLessonIds.forEach(lessonId => {
      progressMap[lessonId] = 100;
    });
    setLessonProgress(progressMap);
      
    console.log("📚 Loaded completed lessons:", completedLessonIds);
    console.log("📊 Lesson progress:", progressMap);

  // All lessons data
  const allLessons = [
    // Biology Lessons
    {
      id: 1,
      title: "Introduction to Biology",
      category: "biology",
      subject: "Biology",
      level: "Beginner",
      duration: "45 min",
      videos: 5,
      icon: "🔬",
      progress: 75,
      description: "Master the fundamentals of biology including the scientific method, organization of life, and ecological principles",
      color: "#10b981",
      lessons: [
        { id: 1, title: "Introduction to Biology", url: "https://www.youtube.com/watch?v=tZE_fQFK8EY" },
        { id: 2, title: "Scientific Method", url: "https://www.youtube.com/watch?v=xOLcZMw0hd4" },
        { id: 3, title: "What do Biologists Do?", url: "https://www.youtube.com/watch?v=rgZhDoPgzK8" },
        { id: 4, title: "Organized Life", url: "https://www.youtube.com/watch?v=cjR5zPrVjTc" },
        { id: 5, title: "Introduction to Ecology", url: "https://www.youtube.com/watch?v=aO3Yp45zmw8" },
      ]
    },
    {
      id: 2,
      title: "Photosynthesis",
      category: "biology",
      subject: "Biology",
      level: "Intermediate",
      duration: "50 min",
      videos: 6,
      icon: "🌱",
      progress: 45,
      description: "Understand how plants convert sunlight into energy",
      color: "#10b981",
      lessons: [
        { id: 1, title: "Light Reactions", url: "https://www.youtube.com/watch?v=dQCAPalUOL0" },
        { id: 2, title: "Dark Reactions", url: "https://www.youtube.com/watch?v=h4T8T-p-SdY" },
      ]
    },
    {
      id: 3,
      title: "Evolution & Natural Selection",
      category: "biology",
      subject: "Biology",
      level: "Advanced",
      duration: "60 min",
      videos: 8,
      icon: "🦎",
      progress: 20,
      description: "Explore the mechanisms of evolution",
      color: "#10b981",
      lessons: []
    },

    // Chemistry Lessons
    {
      id: 4,
      title: "Atomic Structure",
      category: "chemistry",
      subject: "Chemistry",
      level: "Beginner",
      duration: "40 min",
      videos: 5,
      icon: "⚛️",
      progress: 60,
      description: "Master the basics of atoms and electrons",
      color: "#f59e0b",
      lessons: []
    },
    {
      id: 5,
      title: "Chemical Bonding",
      category: "chemistry",
      subject: "Chemistry",
      level: "Intermediate",
      duration: "55 min",
      videos: 7,
      icon: "🔗",
      progress: 30,
      description: "Learn about different types of chemical bonds",
      color: "#f59e0b",
      lessons: []
    },
    {
      id: 6,
      title: "Reactions & Equations",
      category: "chemistry",
      subject: "Chemistry",
      level: "Intermediate",
      duration: "50 min",
      videos: 6,
      icon: "💥",
      progress: 0,
      description: "Understanding chemical reactions and balancing equations",
      color: "#f59e0b",
      lessons: []
    },

    // Physics Lessons
    {
      id: 7,
      title: "Force & Motion",
      category: "physics",
      subject: "Physics",
      level: "Beginner",
      duration: "45 min",
      videos: 5,
      icon: "🚀",
      progress: 50,
      description: "Newton's laws and motion fundamentals",
      color: "#06b6d4",
      lessons: []
    },
    {
      id: 8,
      title: "Energy & Work",
      category: "physics",
      subject: "Physics",
      level: "Intermediate",
      duration: "50 min",
      videos: 6,
      icon: "⚡",
      progress: 25,
      description: "Learn about kinetic and potential energy",
      color: "#06b6d4",
      lessons: []
    },
    {
      id: 9,
      title: "Waves & Sound",
      category: "physics",
      subject: "Physics",
      level: "Advanced",
      duration: "60 min",
      videos: 8,
      icon: "🌊",
      progress: 0,
      description: "Understanding waves, frequency, and sound",
      color: "#06b6d4",
      lessons: []
    },

    // Environmental Science Lessons
    {
      id: 10,
      title: "Climate Change",
      category: "environmental",
      subject: "Environmental Science",
      level: "Intermediate",
      duration: "55 min",
      videos: 6,
      icon: "🌍",
      progress: 40,
      description: "Causes and effects of global climate change",
      color: "#8b5cf6",
      lessons: []
    },
    {
      id: 11,
      title: "Ecosystems & Biodiversity",
      category: "environmental",
      subject: "Environmental Science",
      level: "Beginner",
      duration: "45 min",
      videos: 5,
      icon: "🌿",
      progress: 65,
      description: "Explore biodiversity and ecosystem interactions",
      color: "#8b5cf6",
      lessons: []
    },

    // Social Science Lessons
    {
      id: 12,
      title: "World History Overview",
      category: "history",
      subject: "History",
      level: "Beginner",
      duration: "50 min",
      videos: 7,
      icon: "📜",
      progress: 35,
      description: "Major events that shaped world history",
      color: "#ec4899",
      lessons: []
    },
    {
      id: 13,
      title: "Economics Fundamentals",
      category: "economics",
      subject: "Economics",
      level: "Beginner",
      duration: "45 min",
      videos: 5,
      icon: "💼",
      progress: 0,
      description: "Supply, demand, and market economics",
      color: "#f59e0b",
      lessons: []
    },
  ];

  // Memoize filtered lessons to avoid unnecessary recalculations
  const filteredLessonsComputed = useMemo(() => {
    let filtered = allLessons;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(lesson => lesson.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(lesson =>
        lesson.title.toLowerCase().includes(query) ||
        lesson.description.toLowerCase().includes(query) ||
        lesson.subject.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [searchQuery, selectedCategory]);

  // Update filtered lessons state
  useEffect(() => {
    setFilteredLessons(filteredLessonsComputed);
  }, [filteredLessonsComputed]);

  const categories = [
    { id: "all", name: "All Subjects", icon: "📚" },
    { id: "biology", name: "Biology", icon: "🔬" },
    { id: "chemistry", name: "Chemistry", icon: "⚛️" },
    { id: "physics", name: "Physics", icon: "🚀" },
    { id: "environmental", name: "Environmental", icon: "🌍" },
    { id: "history", name: "History", icon: "📜" },
    { id: "economics", name: "Economics", icon: "💼" },
  ];

  const handleLessonClick = (lesson) => {
    navigate(`/lesson/${lesson.id}`, { state: { lesson } });
  };

  // Check if a lesson is locked (requires previous lesson completion)
  const isLessonLocked = (lessonId) => {
    if (lessonId === 1) return false; // First lesson is always unlocked
    const previousLessonId = lessonId - 1;
    return !completedLessons.includes(previousLessonId);
  };

  return (
    <div className="lessons-page">
      <Sidebar />

      <main className="lessons-main">
        {/* HERO SECTION */}
        <header className="lessons-hero">
          <div className="hero-content">
            <h1 className="hero-title">Learning Hub</h1>
            <p className="hero-subtitle">Master new skills with our comprehensive lessons and expert guidance</p>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <div className="stat-number">{allLessons.length}</div>
              <div className="stat-label">Lessons</div>
            </div>
            <div className="stat">
              <div className="stat-number">6</div>
              <div className="stat-label">Subjects</div>
            </div>
            <div className="stat">
              <div className="stat-number">100+</div>
              <div className="stat-label">Videos</div>
            </div>
          </div>
        </header>

        {/* SEARCH & FILTER SECTION */}
        <div className="search-filter-container">
          <div className="search-box">
            <input
              type="text"
              placeholder="🔍 Search lessons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-tags">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`filter-tag ${selectedCategory === category.id ? "active" : ""}`}
                onClick={() => setSelectedCategory(category.id)}
                style={{
                  cursor: "pointer",
                  transition: "all 200ms ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <span className="tag-icon">{category.icon}</span>
                <span className="tag-name">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* LESSONS GRID */}
        <div className="lessons-container">
          {filteredLessons.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>No lessons found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="lessons-grid">
              {filteredLessons.map((lesson, index) => {
                const locked = isLessonLocked(lesson.id);
                return (
                  <div
                    key={lesson.id}
                    className={`lesson-card ${completedLessons.includes(lesson.id) ? "completed" : ""} ${locked ? "locked" : ""}`}
                    style={{ 
                      animationDelay: `${index * 0.05}s`,
                      cursor: locked ? "not-allowed" : "pointer",
                      transition: "all 300ms ease",
                      opacity: locked ? 0.6 : 1
                    }}
                    onClick={() => !locked && handleLessonClick(lesson)}
                    onMouseEnter={(e) => {
                      if (!locked) {
                        e.currentTarget.style.transform = "translateY(-8px)";
                        e.currentTarget.style.boxShadow = "0 20px 60px rgba(100, 200, 255, 0.3)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.3)";
                    }}
                  >
                    {/* Lock Badge for Locked Lessons */}
                    {locked && (
                      <div style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        background: "rgba(239, 68, 68, 0.9)",
                        color: "white",
                        padding: "0.5rem 0.75rem",
                        borderRadius: "8px",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        zIndex: 10,
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem"
                      }}>
                        🔒 Locked
                      </div>
                    )}
                    
                    {/* Card Header with Icon and Category */}
                    <div className="card-header" style={{ borderTopColor: lesson.color }}>
                      <div className="card-icon">{lesson.icon}</div>
                      <div className="card-meta">
                        <span className="card-subject">{lesson.subject}</span>
                        <span className="card-level">{lesson.level}</span>
                      </div>
                      {completedLessons.includes(lesson.id) && (
                        <div className="completed-badge">✅ Completed</div>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="card-content">
                      <h3 className="card-title">{lesson.title}</h3>
                      <p className="card-description">{lesson.description}</p>

                      {/* Progress Bar */}
                      <div className="progress-section">
                        <div className="progress-header">
                          <span className="progress-label">Progress</span>
                          <span className="progress-percent">{lessonProgress[lesson.id] || 0}%</span>
                        </div>
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{
                              width: `${lessonProgress[lesson.id] || 0}%`,
                              backgroundColor: lesson.color
                            }}
                          ></div>
                        </div>
                      </div>

                      {/* Lesson Stats */}
                      <div className="card-stats">
                        <div className="stat-item" style={{ cursor: "pointer" }}>
                          <span className="stat-icon">⏱️</span>
                          <span className="stat-text">{lesson.duration}</span>
                        </div>
                        <div className="stat-item" style={{ cursor: "pointer" }}>
                          <span className="stat-icon">🎬</span>
                          <span className="stat-text">{lesson.videos} videos</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="card-footer">
                      <button 
                        className="continue-btn" 
                        disabled={locked}
                        style={{ 
                          backgroundColor: lesson.color,
                          cursor: locked ? "not-allowed" : "pointer",
                          transition: "all 200ms ease",
                          opacity: locked ? 0.5 : 1
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (locked) {
                            alert(`Complete Lesson ${lesson.id - 1} first to unlock this lesson!`);
                            return;
                          }
                          handleLessonClick(lesson);
                        }}
                        onMouseEnter={(e) => {
                          if (!locked) {
                            e.currentTarget.style.transform = "scale(1.05)";
                            e.currentTarget.style.boxShadow = `0 10px 30px ${lesson.color}40`;
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "scale(1)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        {completedLessons.includes(lesson.id) ? "Completed ✓" : (lessonProgress[lesson.id] > 0 ? "Continue" : "Start")} →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* MOTIVATIONAL SECTION */}
        {filteredLessons.length > 0 && (
          <div className="motivation-section">
            <div className="motivation-card primary">
              <h3>💡 Learning Tips</h3>
              <p>Consistency is key! Study a little bit every day for better retention and understanding.</p>
            </div>
            <div className="motivation-card secondary">
              <h3>🎯 Set Goals</h3>
              <p>Challenge yourself to complete one lesson per week. Track your progress and celebrate wins!</p>
            </div>
            <div className="motivation-card tertiary">
              <h3>👥 Get Help</h3>
              <p>Join our community Q&A or book a tutoring session when you need extra support.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Lessons;
