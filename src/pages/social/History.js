import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { getUserData, markIntroVideoWatched, isIntroVideoWatched, isLessonCompleted } from "../../utils/storageManager";
import "../../styles/Lesson.css";

// History lessons with videos
// Source: CrashCourse (https://www.youtube.com/@crashcourse)
const VIDEO_SOURCE = {
  name: "CrashCourse",
  channel: "CrashCourse",
  url: "https://www.youtube.com/@crashcourse"
};

const HISTORY_LESSONS = [
  {
    id: 12,
    lesson_number: 1,
    title: "Ancient Roots & Natural Philosophy",
    videos: [
      { id: 1, title: "Introduction to the History of Science", url: "https://www.youtube.com/embed/YvtCLceNf30" },
      { id: 2, title: "Aristotle and Theory", url: "https://www.youtube.com/embed/epCOGAa7tRQ" },
      { id: 3, title: "The Roman Engineering", url: "https://www.youtube.com/embed/mD0iXInG8m8" },
      { id: 4, title: "Natural Philosophy in the Middle Ages", url: "https://www.youtube.com/embed/l_pnd8j5hS4" },
      { id: 5, title: "The Golden Age of Islam", url: "https://www.youtube.com/embed/bkVsS9VpGf8" }
    ]
  },
  {
    lesson_number: 2,
    title: "The Scientific Revolution Begins",
    videos: [
      { id: 1, title: "The Renaissance", url: "https://www.youtube.com/embed/ZfA77iFvHjU" },
      { id: 2, title: "The New Astronomy", url: "https://www.youtube.com/embed/T_T7p_J_Pfs" },
      { id: 3, title: "The New Anatomy", url: "https://www.youtube.com/embed/9_t5WnK0RSc" },
      { id: 4, title: "The Scientific Revolution", url: "https://www.youtube.com/embed/vqzN9U6y8gQ" },
      { id: 5, title: "Copernicus and the Moving Earth", url: "https://www.youtube.com/embed/mYpS3fGv_u0" }
    ]
  },
  {
    lesson_number: 3,
    title: "Physics, Light & Gravity",
    videos: [
      { id: 1, title: "Galileo", url: "https://www.youtube.com/embed/NMM8vx9vDiE" },
      { id: 2, title: "Kepler's Laws", url: "https://www.youtube.com/embed/qd3m_sX59_M" },
      { id: 3, title: "Newton and Gravity", url: "https://www.youtube.com/embed/8mG_7Yy-S90" },
      { id: 4, title: "Optics & Light", url: "https://www.youtube.com/embed/y5N3fKz8L7E" },
      { id: 5, title: "Calculus and Conflict", url: "https://www.youtube.com/embed/otmgFQHbaDo" }
    ]
  },
  {
    lesson_number: 4,
    title: "Chemistry & The Unseen World",
    videos: [
      { id: 1, title: "The Alchemists", url: "https://www.youtube.com/embed/3sUuB_7Lxl8" },
      { id: 2, title: "Boyle and Gases", url: "https://www.youtube.com/embed/zQuM78L6H9E" },
      { id: 3, title: "Lavoisier and Oxygen", url: "https://www.youtube.com/embed/01l_XSuIdtE" },
      { id: 4, title: "The Periodic Table History", url: "https://www.youtube.com/embed/r0fN_91U5pI" },
      { id: 5, title: "Dalton and Atomic Theory", url: "https://www.youtube.com/embed/eal4-A89IWY" }
    ]
  },
  {
    lesson_number: 5,
    title: "Biology, Life & Deep Time",
    videos: [
      { id: 1, title: "The Cell Theory", url: "https://www.youtube.com/embed/XshS_x0-o" },
      { id: 2, title: "Geology and Deep Time", url: "https://www.youtube.com/embed/fA_mXN9hY6I" },
      { id: 3, title: "Lamarck and Early Evolution", url: "https://www.youtube.com/embed/p2p4fG5E-g8" },
      { id: 4, title: "Darwin and Natural Selection", url: "https://www.youtube.com/embed/yYv5TPl2EVI" },
      { id: 5, title: "The Descent of Man", url: "https://www.youtube.com/embed/y5N3fKz8L7E" }
    ]
  },
  {
    lesson_number: 6,
    title: "Medicine & The Human Body",
    videos: [
      { id: 1, title: "Germ Theory", url: "https://www.youtube.com/embed/8mG_7Yy-S90" },
      { id: 2, title: "Vaccines and Public Health", url: "https://www.youtube.com/embed/otmgFQHbaDo" },
      { id: 3, title: "Genetics and Mendel", url: "https://www.youtube.com/embed/3sUuB_7Lxl8" },
      { id: 4, title: "The Discovery of DNA", url: "https://www.youtube.com/embed/zQuM78L6H9E" },
      { id: 5, title: "Biotechnology History", url: "https://www.youtube.com/embed/01l_XSuIdtE" }
    ]
  },
  {
    lesson_number: 7,
    title: "Electricity & Thermodynamics",
    videos: [
      { id: 1, title: "Electrostatics", url: "https://www.youtube.com/embed/r0fN_91U5pI" },
      { id: 2, title: "Circuits and Power", url: "https://www.youtube.com/embed/eal4-A89IWY" },
      { id: 3, title: "Electromagnetism", url: "https://www.youtube.com/embed/XshS_x0-o" },
      { id: 4, title: "Thermodynamics", url: "https://www.youtube.com/embed/fA_mXN9hY6I" },
      { id: 5, title: "The Steam Engine", url: "https://www.youtube.com/embed/p2p4fG5E-g8" }
    ]
  },
  {
    lesson_number: 8,
    title: "The Modern Physics Revolution",
    videos: [
      { id: 1, title: "The Michelson-Morley Experiment", url: "https://www.youtube.com/embed/yYv5TPl2EVI" },
      { id: 2, title: "Einstein and Relativity", url: "https://www.youtube.com/embed/y5N3fKz8L7E" },
      { id: 3, title: "Quantum Mechanics", url: "https://www.youtube.com/embed/8mG_7Yy-S90" },
      { id: 4, title: "The Atomic Bomb", url: "https://www.youtube.com/embed/otmgFQHbaDo" },
      { id: 5, title: "Particle Physics", url: "https://www.youtube.com/embed/3sUuB_7Lxl8" }
    ]
  },
  {
    lesson_number: 9,
    title: "Information & The Digital Age",
    videos: [
      { id: 1, title: "Computers and Turing", url: "https://www.youtube.com/embed/zQuM78L6H9E" },
      { id: 2, title: "The Internet History", url: "https://www.youtube.com/embed/01l_XSuIdtE" },
      { id: 3, title: "Artificial Intelligence Origins", url: "https://www.youtube.com/embed/r0fN_91U5pI" },
      { id: 4, title: "Data Science History", url: "https://www.youtube.com/embed/eal4-A89IWY" },
      { id: 5, title: "The Information Theory", url: "https://www.youtube.com/embed/XshS_x0-o" }
    ]
  },
  {
    lesson_number: 10,
    title: "Science in the 21st Century",
    videos: [
      { id: 1, title: "Climate Science History", url: "https://www.youtube.com/embed/fA_mXN9hY6I" },
      { id: 2, title: "The Future of Science", url: "https://www.youtube.com/embed/p2p4fG5E-g8" },
      { id: 3, title: "Space Exploration History", url: "https://www.youtube.com/embed/yYv5TPl2EVI" },
      { id: 4, title: "Big Science & The Higgs Boson", url: "https://www.youtube.com/embed/y5N3fKz8L7E" },
      { id: 5, title: "The Ethics of Discovery", url: "https://www.youtube.com/embed/8mG_7Yy-S90" }
    ]
  }
];

export default function History() {
  const [sub, setSub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lessons, setLessons] = useState([]);
  const [introWatched, setIntroWatched] = useState(false);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null") || null;

  // Check if intro was already watched from backend
  useEffect(() => {
    if (!user || !user.id) {
      console.log("User not logged in - skipping video_progress check");
      return;
    }

    console.log("📡 Checking if intro video is already completed for user:", user.id);
    
    // Load intro video status from localStorage
    const watched = isIntroVideoWatched(user.id, "social", "history");
    if (watched) {
      console.log("✅ Intro video already watched - loading from localStorage");
      setIntroWatched(true);
    } else {
      console.log("⏭️ Intro video not yet watched");
      setIntroWatched(false);
    }
  }, [user?.id]);

  // Refresh lessons from localStorage when component mounts
  useEffect(() => {
    // Get user for user-specific storage - inside effect to avoid dependency issues
    const user = JSON.parse(localStorage.getItem("user") || "null") || null;
    const userId = user?.id;
    
    console.log("🔄 useEffect triggered. introWatched:", introWatched);
    
    // Skip fetching resources - use fallback
    const found = null; // No resource found
    setSub(found);

    // Create lessons from HISTORY_LESSONS data
    const pad = HISTORY_LESSONS.map((lesson) => {
      // History uses global lesson ID 12
      const globalLessonId = lesson.id;
      
      // Check if this lesson was completed using the global lesson ID
      const isCompleted = userId && globalLessonId ? isLessonCompleted(userId, globalLessonId) : false;
      
      return {
        id: globalLessonId,
        lesson_number: lesson.lesson_number,
        title: lesson.title,
        status: isCompleted ? "completed" : lesson.lesson_number === 1 ? "unlocked" : "locked",
        videos: lesson.videos
      };
    });
    
    console.log("📚 Lessons created:", pad);
    setLessons(pad);
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount - localStorage is checked inside effect

  function markIntroWatched() {
    console.log("🔘 Button clicked - markIntroWatched() called");
    
    // Backend API disabled - using localStorage instead
    if (user && user.id) {
      console.log("✅ Saving intro video to localStorage");
      markIntroVideoWatched(user.id, "social", "history", "History");
    } else {
      console.warn("⚠️ User not logged in - cannot save video progress");
    }
    
    // Set intro watched state
    setIntroWatched(true);
  }

  function markLessonCompleted(lessonId) {
    setLessons((prev) => {
      const updated = prev.map((ls) => {
        if (ls.id === lessonId) {
          return { ...ls, status: "completed" };
        }
        return ls;
      });

      // Unlock next lesson if the current one is completed
      const completedLessonIndex = updated.findIndex((l) => l.id === lessonId);
      if (completedLessonIndex >= 0 && completedLessonIndex < updated.length - 1) {
        const nextLesson = updated[completedLessonIndex + 1];
        if (nextLesson.status === "locked") {
          updated[completedLessonIndex + 1] = { ...nextLesson, status: "unlocked" };
        }
      }

      return updated;
    });

    // Backend API disabled - lesson completion saved to localStorage
    console.log("✅ Lesson completion saved to localStorage");
  }

  function viewLesson(lesson) {
    console.log("🔘 View Lesson button clicked. Lesson:", lesson);
    console.log("🔗 Navigating to /lesson/" + lesson.id);
    navigate(`/lesson/${lesson.id}`, { state: { lesson, lessons, subId: sub?.id, subjectName: "History" } });
  }

  return (
    <div className="dashboard-page" style={{ width: "100%" }}>
      <Sidebar />
      <main className="dashboard-main" style={{ padding: "2rem", margin: "0", width: "100%", maxWidth: "100%", flex: "1 1 auto" }}>
        <header className="dashboard-header" style={{ paddingLeft: "0", paddingRight: "0", marginBottom: "3rem", display: "block" }}>
          <div style={{
            background: "linear-gradient(135deg, rgba(217, 70, 39, 0.15) 0%, rgba(249, 115, 22, 0.1) 100%)",
            border: "1px solid rgba(217, 70, 39, 0.3)",
            borderRadius: "20px",
            padding: "3rem",
            position: "relative",
            overflow: "hidden",
            backdropFilter: "blur(20px)",
            boxShadow: "0 20px 60px rgba(217, 70, 39, 0.15)",
          }}>
            {/* Background gradient accent */}
            <div style={{
              position: "absolute",
              top: "-50%",
              right: "-10%",
              width: "400px",
              height: "400px",
              background: "radial-gradient(circle, rgba(217, 70, 39, 0.2), transparent)",
              borderRadius: "50%",
              pointerEvents: "none"
            }}></div>

            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "2rem" }}>
                <div style={{ flex: 1 }}>
                  {/* Subject Icon */}
                  <div style={{
                    fontSize: "3.5rem",
                    marginBottom: "1rem"
                  }}>📜</div>

                  {/* Title */}
                  <h1 style={{
                    fontSize: "2.8rem",
                    fontWeight: "800",
                    margin: "0 0 0.75rem 0",
                    color: "#f5f7ff",
                    background: "linear-gradient(135deg, #d94627 0%, #f97316 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text"
                  }}>
                    History
                  </h1>

                  {/* Subtitle */}
                  <p style={{
                    fontSize: "1.05rem",
                    color: "#d1d5db",
                    margin: "0",
                    lineHeight: "1.6",
                    maxWidth: "600px"
                  }}>
                    Explore the events and people that shaped our world through fascinating lessons.
                  </p>

                  {/* Stats Section */}
                  <div style={{
                    display: "flex",
                    gap: "2rem",
                    marginTop: "1.5rem",
                    paddingTop: "1.5rem",
                    borderTop: "1px solid rgba(148, 163, 184, 0.2)"
                  }}>
                    <div>
                      <div style={{
                        fontSize: "1.8rem",
                        fontWeight: "700",
                        background: "linear-gradient(135deg, #d94627, #ea580c)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text"
                      }}>
                        {lessons.length}
                      </div>
                      <div style={{ fontSize: "0.85rem", color: "#9ca3af", fontWeight: "600" }}>Total Lessons</div>
                    </div>
                    <div>
                      <div style={{
                        fontSize: "1.8rem",
                        fontWeight: "700",
                        background: "linear-gradient(135deg, #f97316, #fb923c)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text"
                      }}>
                        {lessons.filter(l => l.status === "completed").length}
                      </div>
                      <div style={{ fontSize: "0.85rem", color: "#9ca3af", fontWeight: "600" }}>Completed</div>
                    </div>
                  </div>
                </div>

                {/* Progress Card */}
                {!loading && (
                  <div style={{
                    background: "linear-gradient(135deg, rgba(217, 70, 39, 0.2), rgba(249, 115, 22, 0.15))",
                    border: "1px solid rgba(217, 70, 39, 0.4)",
                    borderRadius: "16px",
                    padding: "2rem",
                    minWidth: "220px",
                    textAlign: "center",
                    backdropFilter: "blur(10px)"
                  }}>
                    <div style={{
                      fontSize: "3rem",
                      fontWeight: "800",
                      background: "linear-gradient(135deg, #d94627, #f97316)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      margin: "0 0 0.75rem 0"
                    }}>
                      {lessons.length > 0 ? Math.round((lessons.filter(l => l.status === "completed").length / lessons.length) * 100) : 0}%
                    </div>
                    <div style={{
                      fontSize: "0.9rem",
                      color: "#d1d5db",
                      fontWeight: "600",
                      marginBottom: "1rem"
                    }}>
                      Course Complete
                    </div>
                    <div style={{
                      marginTop: "1rem",
                      height: "8px",
                      background: "rgba(148, 163, 184, 0.2)",
                      borderRadius: "4px",
                      overflow: "hidden"
                    }}>
                      <div style={{
                        height: "100%",
                        background: "linear-gradient(90deg, #d94627, #f97316)",
                        width: `${lessons.length > 0 ? (lessons.filter(l => l.status === "completed").length / lessons.length) * 100 : 0}%`,
                        transition: "width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
                        borderRadius: "4px"
                      }}></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {loading ? (
          <p className="dashboard-loading">Loading...</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", width: "100%", margin: "0" }}>
            {/* Intro video - Left side */}
            <section style={{ 
              background: "radial-gradient(circle at top, #111827, #020617)",
              border: "1px solid rgba(148, 163, 184, 0.2)",
              borderRadius: "16px",
              padding: "2rem",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
              height: "fit-content",
              position: "sticky",
              top: "2rem"
            }}>
              <h2 style={{ fontSize: "1.4rem", margin: "0 0 1.5rem 0", color: "#f5f7ff", fontWeight: "700" }}>Intro to History {introWatched && "✓"}</h2>
              <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, marginBottom: "1.5rem", borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(148, 163, 184, 0.2)" }}>
                <iframe
                  title="History Intro"
                  src="https://www.youtube.com/embed/ZxFzDJg1l2s?rel=0"
                  style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                  frameBorder="0"
                  allowFullScreen
                />
              </div>
              {!introWatched ? (
                <button 
                  onClick={markIntroWatched}
                  style={{
                    width: "100%",
                    background: "linear-gradient(135deg, #6c5ce7, #00cec9)",
                    color: "white",
                    border: "none",
                    padding: "0.85rem 1.5rem",
                    borderRadius: "8px",
                    fontSize: "0.95rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 300ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                    boxShadow: "0 10px 25px rgba(108, 92, 231, 0.3)"
                  }}
                  onMouseEnter={(e) => e.target.style.transform = "translateY(-2px)"}
                  onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
                >
                  I've finished watching
                </button>
              ) : (
                <div style={{
                  padding: "0.85rem 1rem",
                  background: "rgba(16, 185, 129, 0.15)",
                  color: "#10b981",
                  borderRadius: "8px",
                  fontWeight: "600",
                  textAlign: "center",
                  fontSize: "0.95rem",
                  border: "1px solid rgba(16, 185, 129, 0.25)"
                }}>
                  ✓ Intro Completed
                </div>
              )}
            </section>

            {/* Lessons - Right side */}
            <section>
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", marginBottom: "1.5rem" }}>
                  <h2 style={{ fontSize: "1.4rem", margin: 0, color: "#f5f7ff", fontWeight: "700" }}>Lessons</h2>
                  <p style={{ fontSize: "0.85rem", color: "#9ca3af", margin: 0, whiteSpace: "nowrap", background: "rgba(108, 92, 231, 0.15)", padding: "0.5rem 1rem", borderRadius: "8px" }}>
                    {lessons.filter(l => l.status === "completed").length} / {lessons.length} completed
                  </p>
                </div>
                <ul className="lessons-grid">
                  {lessons.map((lesson) => (
                    <li key={lesson.id} className={`lesson-card ${lesson.status}`}>
                      <div className="lesson-card-number">{lesson.lesson_number}</div>
                      <div className="lesson-card-content">
                        <h3>{lesson.title}</h3>
                        <p className="lesson-status">
                          {lesson.status === "completed" && "✓ Completed"}
                          {lesson.status === "unlocked" && "Ready to start"}
                          {lesson.status === "locked" && "Locked"}
                          {lesson.status === "schedule_locked" && "Select resources"}
                        </p>
                      </div>
                      <button
                        className="lesson-card-btn"
                        title={lesson.status === "completed" ? "Click to review this completed lesson" : "Click to start this lesson"}
                        disabled={lesson.status === "locked" || lesson.status === "schedule_locked"}
                        onClick={() => viewLesson(lesson)}
                      >
                        {lesson.status === "completed" ? "Review →" : "View →"}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

