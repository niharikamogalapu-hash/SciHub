import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { getUserData, markIntroVideoWatched, isIntroVideoWatched } from "../../utils/storageManager";
import "../../styles/Lesson.css";

// Human Geography lessons with videos
const HUMAN_GEOGRAPHY_LESSONS = [
  {
    lesson_number: 1,
    title: "Tools of the Geographer",
    videos: [
      { id: 1, title: "What is Geography?", url: "https://www.youtube.com/embed/9I_-ADGrKQo" },
      { id: 2, title: "What is Physical Geography?", url: "https://www.youtube.com/embed/mYpS3fGv_u0" },
      { id: 3, title: "Maps and Direction", url: "https://www.youtube.com/embed/kIID5FDi2As" },
      { id: 4, title: "Geography Information Systems (GIS)", url: "https://www.youtube.com/embed/f-S8T_K5LwI" },
      { id: 5, title: "Scale and Projection", url: "https://www.youtube.com/embed/W_XshS_x0-o" }
    ]
  },
  {
    lesson_number: 2,
    title: "Earth's Tectonic & Surface Systems",
    videos: [
      { id: 1, title: "Plate Tectonics", url: "https://www.youtube.com/embed/X9vYmGzUqS0" },
      { id: 2, title: "The Rock Cycle", url: "https://www.youtube.com/embed/X_vD_fXmS_0" },
      { id: 3, title: "Weathering and Erosion", url: "https://www.youtube.com/embed/R-Iak3Wvh9c" },
      { id: 4, title: "Landforms", url: "https://www.youtube.com/embed/XhS6_3mN9hA" },
      { id: 5, title: "Soils", url: "https://www.youtube.com/embed/yYv5TPl2EVI" }
    ]
  },
  {
    lesson_number: 3,
    title: "Atmosphere, Climate & Change",
    videos: [
      { id: 1, title: "The Atmosphere", url: "https://www.youtube.com/embed/X6b17PVsYBQ" },
      { id: 2, title: "Climate & Weather", url: "https://www.youtube.com/embed/fA_mXN9hY6I" },
      { id: 3, title: "Atmospheric Circulation", url: "https://www.youtube.com/embed/p2p4fG5E-g8" },
      { id: 4, title: "Climate Change", url: "https://www.youtube.com/embed/yYv5TPl2EVI" },
      { id: 5, title: "Global Biomes", url: "https://www.youtube.com/embed/izRvPaAWgyw" }
    ]
  },
  {
    lesson_number: 4,
    title: "The Hydrosphere & Moving Water",
    videos: [
      { id: 1, title: "The Water Cycle", url: "https://www.youtube.com/embed/y5N3fKz8L7E" },
      { id: 2, title: "Rivers & Floods", url: "https://www.youtube.com/embed/8mG_7Yy-S90" },
      { id: 3, title: "Glaciers", url: "https://www.youtube.com/embed/lUuSlsT9Z9M" },
      { id: 4, title: "Groundwater", url: "https://www.youtube.com/embed/7u_XN_A0vEY" },
      { id: 5, title: "Oceans and Coasts", url: "https://www.youtube.com/embed/6YhYp8XmB-A" }
    ]
  },
  {
    lesson_number: 5,
    title: "Biogeography & Land Use",
    videos: [
      { id: 1, title: "Ecosystems & Biodiversity", url: "https://www.youtube.com/embed/Z3un3m_f4Is" },
      { id: 2, title: "Conservation & Restoration", url: "https://www.youtube.com/embed/9v6y0GvP_vM" },
      { id: 3, title: "Agriculture & Food", url: "https://www.youtube.com/embed/m7H0uTscb_8" },
      { id: 4, title: "Industrial Agriculture", url: "https://www.youtube.com/embed/ZM8ECpBuQYE" },
      { id: 5, title: "Sustainable Farming", url: "https://www.youtube.com/embed/ObO_X_R_6Ww" }
    ]
  },
  {
    lesson_number: 6,
    title: "Human Population & Movement",
    videos: [
      { id: 1, title: "Population Geography", url: "https://www.youtube.com/embed/w3BhzYI6zXU" },
      { id: 2, title: "The Demographic Transition", url: "https://www.youtube.com/embed/kKKM8Y-u7ds" },
      { id: 3, title: "Migration & Displacement", url: "https://www.youtube.com/embed/fo_pmp5rtzo" },
      { id: 4, title: "Immigration Policy", url: "https://www.youtube.com/embed/9S_pX8584mE" },
      { id: 5, title: "Urbanization", url: "https://www.youtube.com/embed/7gf6YpdvtE0" }
    ]
  },
  {
    lesson_number: 7,
    title: "Cultural & Social Geography",
    videos: [
      { id: 1, title: "Cultural Landscapes", url: "https://www.youtube.com/embed/w4QFJba9qhA" },
      { id: 2, title: "Language & Dialect", url: "https://www.youtube.com/embed/mXo70VEn0-8" },
      { id: 3, title: "Geography of Religion", url: "https://www.youtube.com/embed/Y-QD3782-Yw" },
      { id: 4, title: "Race, Ethnicity & Space", url: "https://www.youtube.com/embed/XhS6_3mN9hA" },
      { id: 5, title: "Gendered Spaces", url: "https://www.youtube.com/embed/b-mWssS7v8g" }
    ]
  },
  {
    lesson_number: 8,
    title: "Political Geography & Power",
    videos: [
      { id: 1, title: "States, Nations & Borders", url: "https://www.youtube.com/embed/vVfT9fW9xK8" },
      { id: 2, title: "Geopolitics", url: "https://www.youtube.com/embed/b5SqYuMA9E0" },
      { id: 3, title: "Supranationalism", url: "https://www.youtube.com/embed/fJpf0_Ush_8" },
      { id: 4, title: "Internal Boundaries", url: "https://www.youtube.com/embed/jxstE6A_GYQ" },
      { id: 5, title: "Colonialism & Decolonization", url: "https://www.youtube.com/embed/TfYCnOvNnFU" }
    ]
  },
  {
    lesson_number: 9,
    title: "Economic Geography & Development",
    videos: [
      { id: 1, title: "Economic Sectors", url: "https://www.youtube.com/embed/qV4lR9EWGlY" },
      { id: 2, title: "Global Supply Chains", url: "https://www.youtube.com/embed/xdZ6it5Yf_s" },
      { id: 3, title: "Measuring Development", url: "https://www.youtube.com/embed/yYv5TPl2EVI" },
      { id: 4, title: "Sustainable Development Goals", url: "https://www.youtube.com/embed/9f_89Ksyv9g" },
      { id: 5, title: "The Digital Divide", url: "https://www.youtube.com/embed/46vS_0p0pYw" }
    ]
  },
  {
    lesson_number: 10,
    title: "Urban Environments & The Future",
    videos: [
      { id: 1, title: "City Systems & Networks", url: "https://www.youtube.com/embed/GS_68rO_7Lg" },
      { id: 2, title: "Urban Planning", url: "https://www.youtube.com/embed/m7H0uTscb_8" },
      { id: 3, title: "How Are Cities Organized?", url: "https://www.youtube.com/embed/hDaW8KIeTNw" },
      { id: 4, title: "Smart Cities & Technology", url: "https://www.youtube.com/embed/TFlRWlvW6sk" },
      { id: 5, title: "The Future of Cities", url: "https://www.youtube.com/embed/mddu99gn8Gg" }
    ]
  }
];

export default function HumanGeography() {
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
    const watched = isIntroVideoWatched(user.id, "social", "humangeography");
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

    // Create lessons from HUMAN_GEOGRAPHY_LESSONS data
    const pad = HUMAN_GEOGRAPHY_LESSONS.map((lesson) => {
      // Check if this lesson was unlocked by completing the previous lesson (organized by subject)
      const isUnlocked = userId ? getUserData(userId, `lesson_Human Geography_unlocked_local-${lesson.lesson_number}`) !== null : false;
      
      // Check if this lesson was completed (organized by subject)
      const isCompleted = userId ? getUserData(userId, `lesson_Human Geography_completed_local-${lesson.lesson_number}`) !== null : false;
      
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
      markIntroVideoWatched(user.id, "social", "humangeography", "Human Geography");
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
    navigate(`/lesson/${lesson.id}`, { state: { lesson, lessons, subId: sub?.id, subjectName: "Human Geography" } });
  }

  return (
    <div className="dashboard-page" style={{ width: "100%" }}>
      <Sidebar />
      <main className="dashboard-main" style={{ padding: "2rem", margin: "0", width: "100%", maxWidth: "100%", flex: "1 1 auto" }}>
        <header className="dashboard-header" style={{ paddingLeft: "0", paddingRight: "0", marginBottom: "2rem", display: "block" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "1rem", marginBottom: "1rem" }}>
            <div>
              <h1 style={{ color: "#f5f7ff", margin: "0 0 0.5rem 0" }}>Human Geography</h1>
              <p className="dashboard-subtitle" style={{ margin: "0" }}>Discover how people, places, and cultures shape our world.</p>
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
              <h2 style={{ fontSize: "1.4rem", margin: "0 0 1.5rem 0", color: "#f5f7ff", fontWeight: "700" }}>Intro to Human Geography {introWatched && "✓"}</h2>
              <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, marginBottom: "1.5rem", borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(148, 163, 184, 0.2)" }}>
                <iframe
                  title="Human Geography Intro"
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
