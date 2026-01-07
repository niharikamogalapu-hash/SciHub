import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { getUserData, markIntroVideoWatched, isIntroVideoWatched } from "../../utils/storageManager";
import "../../styles/Lesson.css";

// Physics lessons with videos
const PHYSICS_LESSONS = [
  {
    lesson_number: 21,
    title: "One-Dimensional Motion & Calculus",
    videos: [
      { id: 1, title: "Motion in a Straight Line", url: "https://www.youtube.com/embed/ZM8ECpBuQYE" },
      { id: 2, title: "Derivatives", url: "https://www.youtube.com/embed/ObHJJYvu3RE" },
      { id: 3, title: "Vectors and 2D Motion", url: "https://www.youtube.com/embed/w3BhzYI6zXU" },
      { id: 4, title: "Newton's Laws", url: "https://www.youtube.com/embed/kKKM8Y-u7ds" },
      { id: 5, title: "Newton's Laws (Review)", url: "https://www.youtube.com/embed/kKKM8Y-u7ds" }
    ]
  },
  {
    lesson_number: 22,
    title: "Forces, Friction & Circular Motion",
    videos: [
      { id: 1, title: "Friction", url: "https://www.youtube.com/embed/fo_pmp5rtzo" },
      { id: 2, title: "Centripetal Acceleration", url: "https://www.youtube.com/embed/9S_pX8584mE" },
      { id: 3, title: "Newtonian Gravity", url: "https://www.youtube.com/embed/7gf6YpdvtE0" },
      { id: 4, title: "Work, Energy, and Power", url: "https://www.youtube.com/embed/w4QFJba9qhA" },
      { id: 5, title: "Kinetic and Potential Energy", url: "https://www.youtube.com/embed/mXo70VEn0-8" }
    ]
  },
  {
    lesson_number: 23,
    title: "Momentum & Rotational Mechanics",
    videos: [
      { id: 1, title: "Collisions", url: "https://www.youtube.com/embed/Y-QD3782-Yw" },
      { id: 2, title: "Rotational Motion", url: "https://www.youtube.com/embed/XhS6_3mN9hA" },
      { id: 3, title: "Torque", url: "https://www.youtube.com/embed/b-mWssS7v8g" },
      { id: 4, title: "Statics", url: "https://www.youtube.com/embed/vVfT9fW9xK8" },
      { id: 5, title: "Statics (Review)", url: "https://www.youtube.com/embed/vVfT9fW9xK8" }
    ]
  },
  {
    lesson_number: 24,
    title: "Fluids & Oscillations",
    videos: [
      { id: 1, title: "Fluids at Rest", url: "https://www.youtube.com/embed/b5SqYuMA9E0" },
      { id: 2, title: "Fluids in Motion", url: "https://www.youtube.com/embed/fJpf0_Ush_8" },
      { id: 3, title: "Simple Harmonic Motion", url: "https://www.youtube.com/embed/jxstE6A_GYQ" },
      { id: 4, title: "Traveling Waves", url: "https://www.youtube.com/embed/TfYCnOvNnFU" },
      { id: 5, title: "Traveling Waves (Review)", url: "https://www.youtube.com/embed/TfYCnOvNnFU" }
    ]
  },
  {
    lesson_number: 25,
    title: "Sound & Thermal Physics",
    videos: [
      { id: 1, title: "Sound", url: "https://www.youtube.com/embed/qV4lR9EWGlY" },
      { id: 2, title: "Physics of Music", url: "https://www.youtube.com/embed/xdZ6it5Yf_s" },
      { id: 3, title: "Temperature", url: "https://www.youtube.com/embed/yYv5TPl2EVI" },
      { id: 4, title: "Kinetic Theory & Phase Changes", url: "https://www.youtube.com/embed/9f_89Ksyv9g" },
      { id: 5, title: "Kinetic Theory (Review)", url: "https://www.youtube.com/embed/9f_89Ksyv9g" }
    ]
  },
  {
    lesson_number: 26,
    title: "Thermodynamics & Electrostatics",
    videos: [
      { id: 1, title: "First Law of Thermodynamics", url: "https://www.youtube.com/embed/46vS_0p0pYw" },
      { id: 2, title: "Thermodynamics", url: "https://www.youtube.com/embed/GS_68rO_7Lg" },
      { id: 3, title: "Engines", url: "https://www.youtube.com/embed/m7H0uTscb_8" },
      { id: 4, title: "Electric Charge", url: "https://www.youtube.com/embed/TFlRWlvW6sk" },
      { id: 5, title: "Electric Fields", url: "https://www.youtube.com/embed/mddu99gn8Gg" }
    ]
  },
  {
    lesson_number: 27,
    title: "Voltage & DC Circuits",
    videos: [
      { id: 1, title: "Voltage & Capacitors", url: "https://www.youtube.com/embed/8XW9VreS_f8" },
      { id: 2, title: "Electric Current", url: "https://www.youtube.com/embed/HXOok3mfMLM" },
      { id: 3, title: "DC Resistors and Batteries", url: "https://www.youtube.com/embed/fK6XvR7S-7w" },
      { id: 4, title: "Circuit Analysis", url: "https://www.youtube.com/embed/-w-VTw0339M" },
      { id: 5, title: "Capacitors and Kirchhoff's Rules", url: "https://www.youtube.com/embed/33390z-X2A4" }
    ]
  },
  {
    lesson_number: 28,
    title: "Magnetism & Induction",
    videos: [
      { id: 1, title: "Magnetism", url: "https://www.youtube.com/embed/s94z27L2YTM" },
      { id: 2, title: "Ampere's Law", url: "https://www.youtube.com/embed/KtgR_06H2Hw" },
      { id: 3, title: "Induction and Lenz's Law", url: "https://www.youtube.com/embed/pQ6zOatidMM" },
      { id: 4, title: "Self-Inductance", url: "https://www.youtube.com/embed/vV99jS2Xy8o" },
      { id: 5, title: "Maxwell's Equations", url: "https://www.youtube.com/embed/KIsZ2D7KWRE" }
    ]
  },
  {
    lesson_number: 29,
    title: "Optics & Light Behavior",
    videos: [
      { id: 1, title: "Light", url: "https://www.youtube.com/embed/9_XG6XmC34I" },
      { id: 2, title: "Geometric Optics", url: "https://www.youtube.com/embed/Oh4m8Ees-3Q" },
      { id: 3, title: "Lenses and Mirrors", url: "https://www.youtube.com/embed/8p_S-mE_5t8" },
      { id: 4, title: "Optical Instruments", url: "https://www.youtube.com/embed/D_9t98fHhC0" },
      { id: 5, title: "Thin Films and Interference", url: "https://www.youtube.com/embed/AIsZf_FmX_A" }
    ]
  },
  {
    lesson_number: 30,
    title: "Modern Physics & Cosmology",
    videos: [
      { id: 1, title: "Special Relativity", url: "https://www.youtube.com/embed/AInCqm5nCzw" },
      { id: 2, title: "Quantum Mechanics - Part 1", url: "https://www.youtube.com/embed/7kb1VT0J3DE" },
      { id: 3, title: "Quantum Mechanics - Part 2", url: "https://www.youtube.com/embed/qO_W70VegbQ" },
      { id: 4, title: "Nuclear Physics", url: "https://www.youtube.com/embed/lUhJL7o6_cA" },
      { id: 5, title: "Astrophysics and Cosmology", url: "https://www.youtube.com/embed/VYxYuaDvdM0" }
    ]
  }
];

export default function Physics() {
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
    const watched = isIntroVideoWatched(user.id, "natural", "physics");
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

    // Create lessons from PHYSICS_LESSONS data
    const pad = PHYSICS_LESSONS.map((lesson) => {
      // Check if this lesson was unlocked by completing the previous lesson (organized by subject)
      const isUnlocked = userId ? getUserData(userId, `lesson_Physics_unlocked_local-${lesson.lesson_number}`) !== null : false;
      
      // Check if this lesson was completed (organized by subject)
      const isCompleted = userId ? getUserData(userId, `lesson_Physics_completed_local-${lesson.lesson_number}`) !== null : false;
      
      return {
        id: `local-${lesson.lesson_number}`,
        lesson_number: lesson.lesson_number,
        title: lesson.title,
        status: isCompleted ? "completed" : lesson.lesson_number === 1 ? "unlocked" : isUnlocked ? "unlocked" : "locked",
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
      markIntroVideoWatched(user.id, "natural", "physics", "Physics");
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
    navigate(`/lesson/${lesson.id}`, { state: { lesson, lessons, subId: sub?.id, subjectName: "Physics" } });
  }

  return (
    <div className="dashboard-page" style={{ width: "100%" }}>
      <Sidebar />
      <main className="dashboard-main" style={{ padding: "2rem", margin: "0", width: "100%", maxWidth: "100%", flex: "1 1 auto" }}>
        <header className="dashboard-header" style={{ paddingLeft: "0", paddingRight: "0", marginBottom: "2rem", display: "block" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "1rem", marginBottom: "1rem" }}>
            <div>
              <h1 style={{ color: "#f5f7ff", margin: "0 0 0.5rem 0" }}>Physics</h1>
              <p className="dashboard-subtitle" style={{ margin: "0" }}>Explore forces, energy, waves, and the fabric of the universe.</p>
            </div>
            {!loading && (
              <div style={{ 
                background: "linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(0, 240, 255, 0.1))",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                borderRadius: "12px",
                padding: "1rem",
                minWidth: "200px",
                textAlign: "center"
              }}>
                <div style={{ fontSize: "2rem", fontWeight: "800", background: "linear-gradient(135deg, #10b981, #00f0ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", margin: "0 0 0.5rem 0" }}>
                  {lessons.filter(l => l.status === "completed").length}/{lessons.length}
                </div>
                <div style={{ fontSize: "0.85rem", color: "#9ca3af", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Lessons Completed</div>
                <div style={{ marginTop: "0.75rem", height: "6px", background: "rgba(148, 163, 184, 0.2)", borderRadius: "3px", overflow: "hidden" }}>
                  <div style={{ 
                    height: "100%", 
                    background: "linear-gradient(90deg, #10b981, #00f0ff)",
                    width: `${lessons.length > 0 ? (lessons.filter(l => l.status === "completed").length / lessons.length) * 100 : 0}%`,
                    transition: "width 0.5s ease"
                  }}></div>
                </div>
              </div>
            )}
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
              <h2 style={{ fontSize: "1.4rem", margin: "0 0 1.5rem 0", color: "#f5f7ff", fontWeight: "700" }}>Intro to Physics {introWatched && "✓"}</h2>
              <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, marginBottom: "1.5rem", borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(148, 163, 184, 0.2)" }}>
                <iframe
                  title="Physics Intro"
                  src="https://www.youtube.com/embed/sJG-A7MwVzc?rel=0"
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
