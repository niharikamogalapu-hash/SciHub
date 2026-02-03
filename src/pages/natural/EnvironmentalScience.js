import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { getUserData, markIntroVideoWatched, isIntroVideoWatched, isLessonCompleted } from "../../utils/storageManager";
import "../../styles/Lesson.css";

// Map Environmental Science lesson numbers to global lesson IDs
const ENVIRONMENTAL_LESSON_ID_MAP = {
  1: 31,
  2: 32,
  3: 33,
  4: 34,
  5: 35,
  6: 36,
  7: 37,
  8: 38,
  9: 39,
  10: 40,
};

// Source: All videos from CrashCourse Ecology (https://www.youtube.com/@crashcourse)
const VIDEO_SOURCE = {
  name: "CrashCourse Ecology",
  channel: "CrashCourse",
  url: "https://www.youtube.com/@crashcourse"
};

// Environmental Science lessons with videos
const ENVIRONMENTAL_SCIENCE_LESSONS = [
  {
    id: 10,
    lesson_number: 1,
    title: "Foundations & The History of Life",
    videos: [
      { id: 1, title: "The Secret World of Plants", url: "https://www.youtube.com/embed/WACSnwKby2Y" },
      { id: 2, title: "What is an Animal?", url: "https://www.youtube.com/embed/zgM0F6UmC70" },
      { id: 3, title: "History of Life on Earth", url: "https://www.youtube.com/embed/sjE-Pkjp3u4" },
      { id: 4, title: "The First Animals", url: "https://www.youtube.com/embed/TrS6_I8SQuU" },
      { id: 5, title: "Comparative Anatomy", url: "https://www.youtube.com/embed/7ABSjKS0hic" }
    ]
  },
  {
    id: 11,
    lesson_number: 2,
    title: "Plant Biology & Evolution",
    videos: [
      { id: 1, title: "Photosynthesis", url: "https://www.youtube.com/embed/2th5lAd-77A" },
      { id: 2, title: "Plant Cells", url: "https://www.youtube.com/embed/9UvlqAVCoqY" },
      { id: 3, title: "Plant Evolution", url: "https://www.youtube.com/embed/sQK3Yr4Sc_k" },
      { id: 4, title: "Plant Tissues", url: "https://www.youtube.com/embed/h9oDTMXM7M8" },
      { id: 5, title: "Vascular Plants", url: "https://www.youtube.com/embed/S0id12O1Xk4" }
    ]
  },
  {
    lesson_number: 3,
    title: "Botany - Reproduction & Senses",
    videos: [
      { id: 1, title: "Flowers & Reproduction", url: "https://www.youtube.com/embed/uK48U64zS7A" },
      { id: 2, title: "Fruits & Seeds", url: "https://www.youtube.com/embed/mC6x5q0fS-Q" },
      { id: 3, title: "Plant Senses", url: "https://www.youtube.com/embed/U0rGzM79iX0" },
      { id: 4, title: "Plant Stress", url: "https://www.youtube.com/embed/J-id9W0sh_M" },
      { id: 5, title: "Plants & Fungi", url: "https://www.youtube.com/embed/m9_L_rO3mTo" }
    ]
  },
  {
    lesson_number: 4,
    title: "Zoology - Insects to Reptiles",
    videos: [
      { id: 1, title: "Insects & Arthropods", url: "https://www.youtube.com/embed/8p_S-mE_5t8" },
      { id: 2, title: "Fish & Amphibians", url: "https://www.youtube.com/embed/mS_D_L2XstU" },
      { id: 3, title: "Reptiles & Birds", url: "https://www.youtube.com/embed/ZSc8U67G020" },
      { id: 4, title: "Mammals", url: "https://www.youtube.com/embed/ipOoEmrm4pI" },
      { id: 5, title: "The Human Animal", url: "https://www.youtube.com/embed/t-8ctiL6_Ek" }
    ]
  },
  {
    lesson_number: 5,
    title: "Zoology - Behavior & Interaction",
    videos: [
      { id: 1, title: "Domestication", url: "https://www.youtube.com/embed/vV99jS2Xy8o" },
      { id: 2, title: "Behavioral Ecology", url: "https://www.youtube.com/embed/v6ubvEJ3KGM" },
      { id: 3, title: "Communication", url: "https://www.youtube.com/embed/P3wP8v84uqs" },
      { id: 4, title: "Migration", url: "https://www.youtube.com/embed/H7Z6Q0k2u_Y" },
      { id: 5, title: "Extreme Survival", url: "https://www.youtube.com/embed/V9X7699n9_k" }
    ]
  },
  {
    lesson_number: 6,
    title: "Ecology - Populations & Growth",
    videos: [
      { id: 1, title: "Population Ecology", url: "https://www.youtube.com/embed/RBOsqmBQBQk" },
      { id: 2, title: "Human Population Growth", url: "https://www.youtube.com/embed/E8dkWQVFAoA" },
      { id: 3, title: "Community Ecology", url: "https://www.youtube.com/embed/GxE1SSqbSnw" },
      { id: 4, title: "Predation & Herbivory", url: "https://www.youtube.com/embed/mFDiiSprONw" },
      { id: 5, title: "Ecological Succession", url: "https://www.youtube.com/embed/jZKIHe2LDP8" }
    ]
  },
  {
    lesson_number: 7,
    title: "Ecology - Ecosystems & Cycles",
    videos: [
      { id: 1, title: "Ecosystem Ecology", url: "https://www.youtube.com/embed/v6ubvEJ3KGM" },
      { id: 2, title: "Hydrologic & Carbon Cycles", url: "https://www.youtube.com/embed/2D7hZpIYlCA" },
      { id: 3, title: "Nitrogen & Phosphorus Cycles", url: "https://www.youtube.com/embed/leHy-Y_8nRs" },
      { id: 4, title: "Plants & Carbon", url: "https://www.youtube.com/embed/H7m9_k2p9pU" },
      { id: 5, title: "Plants & Agriculture", url: "https://www.youtube.com/embed/q6E0k7X_Y_M" }
    ]
  },
  {
    lesson_number: 8,
    title: "Biomes & Biodiversity",
    videos: [
      { id: 1, title: "Global Biomes", url: "https://www.youtube.com/embed/izRvPaAWgyw" },
      { id: 2, title: "Plant Biomes", url: "https://www.youtube.com/embed/48SPlL7JOnY" },
      { id: 3, title: "Conservation Zoology", url: "https://www.youtube.com/embed/Yp9zGvN-hYk" },
      { id: 4, title: "Pollution", url: "https://www.youtube.com/embed/5eTCZ9L834s" },
      { id: 5, title: "Conservation Biology", url: "https://www.youtube.com/embed/Kaeyr5-O2eU" }
    ]
  },
  {
    lesson_number: 9,
    title: "The Future of Life",
    videos: [
      { id: 1, title: "The Future of Plants", url: "https://www.youtube.com/embed/A8vG_uN_8hE" },
      { id: 2, title: "Zoology and You", url: "https://www.youtube.com/embed/9_6hD0_R68c" },
      { id: 3, title: "Evolutionary Development", url: "https://www.youtube.com/embed/90XvV8S7_Xk" },
      { id: 4, title: "Speciation", url: "https://www.youtube.com/embed/2o_fGfFf8_A" },
      { id: 5, title: "Taxonomy", url: "https://www.youtube.com/embed/F38BmgPcZ_I" }
    ]
  },
  {
    lesson_number: 10,
    title: "Capstone: Synthesis & Review",
    videos: [
      { id: 1, title: "History of Life on Earth (Review)", url: "https://www.youtube.com/embed/sjE-Pkjp3u4" },
      { id: 2, title: "Comparative Anatomy (Review)", url: "https://www.youtube.com/embed/7ABSjKS0hic" },
      { id: 3, title: "Evolution & Speciation (Review)", url: "https://www.youtube.com/embed/2o_fGfFf8_A" },
      { id: 4, title: "Ecology Synthesis (Review)", url: "https://www.youtube.com/embed/GxE1SSqbSnw" },
      { id: 5, title: "The Future of Life (Review)", url: "https://www.youtube.com/embed/A8vG_uN_8hE" }
    ]
  }
];

export default function EnvironmentalScience() {
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
    const watched = isIntroVideoWatched(user.id, "natural", "environmentalscience");
    if (watched) {
      console.log("✅ Intro video already watched - loading from localStorage");
      setIntroWatched(true);
    } else {
      console.log("⏭️ Intro video not yet watched");
      setIntroWatched(false);
    }
  }, [user]);

  // Refresh lessons from localStorage when component mounts
  useEffect(() => {
    // Get user for user-specific storage - inside effect to avoid dependency issues
    const user = JSON.parse(localStorage.getItem("user") || "null") || null;
    const userId = user?.id;
    
    console.log("🔄 useEffect triggered. introWatched:", introWatched);
    
    const found = null;
    setSub(found);

    const pad = ENVIRONMENTAL_SCIENCE_LESSONS.map((lesson) => {
      // Get the global lesson ID for this Environmental Science lesson
      const globalLessonId = ENVIRONMENTAL_LESSON_ID_MAP[lesson.lesson_number];
      
      // Check if this lesson was completed using the global lesson ID
      const isCompleted = userId && globalLessonId ? isLessonCompleted(userId, globalLessonId) : false;
      
      // For unlocking: check if previous lesson was completed
      let isUnlocked = lesson.lesson_number === 1; // First lesson is always unlocked
      if (lesson.lesson_number > 1) {
        const previousGlobalId = ENVIRONMENTAL_LESSON_ID_MAP[lesson.lesson_number - 1];
        isUnlocked = userId && previousGlobalId ? isLessonCompleted(userId, previousGlobalId) : false;
      }
      
      return {
        id: globalLessonId,
        lesson_number: lesson.lesson_number,
        title: lesson.title,
        status: isCompleted ? "completed" : isUnlocked ? "unlocked" : "locked",
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
    
    if (user && user.id) {
      console.log("✅ Saving intro video to localStorage");
      markIntroVideoWatched(user.id, "natural", "environmentalscience", "Environmental Science");
    } else {
      console.warn("⚠️ User not logged in - cannot save video progress");
    }
    
    setIntroWatched(true);
  }

  // Mark lesson as completed in the state
  // (Currently unused - lesson completion is handled in Lesson.js)
  /*
  function markLessonCompleted(lessonId) {
    setLessons((prev) => {
      const updated = prev.map((ls) => {
        if (ls.id === lessonId) {
          return { ...ls, status: "completed" };
        }
        return ls;
      });

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
  */

  function viewLesson(lesson) {
    console.log("🔘 View Lesson button clicked. Lesson:", lesson);
    console.log("🔗 Navigating to /lesson/" + lesson.id);
    navigate(`/lesson/${lesson.id}`, { state: { lesson, lessons, subId: sub?.id, subjectName: "Environmental Science" } });
  }

  return (
    <div className="dashboard-page" style={{ width: "100%" }}>
      <Sidebar />
      <main className="dashboard-main" style={{ padding: "2rem", margin: "0", width: "100%", maxWidth: "100%", flex: "1 1 auto" }}>
        <header className="dashboard-header" style={{ paddingLeft: "0", paddingRight: "0", marginBottom: "3rem", display: "block" }}>
          <div style={{
            background: "linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(0, 240, 255, 0.1) 100%)",
            border: "1px solid rgba(34, 197, 94, 0.3)",
            borderRadius: "20px",
            padding: "3rem",
            position: "relative",
            overflow: "hidden",
            backdropFilter: "blur(20px)",
            boxShadow: "0 20px 60px rgba(34, 197, 94, 0.15)",
          }}>
            {/* Background gradient accent */}
            <div style={{
              position: "absolute",
              top: "-50%",
              right: "-10%",
              width: "400px",
              height: "400px",
              background: "radial-gradient(circle, rgba(34, 197, 94, 0.2), transparent)",
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
                  }}>🌍</div>

                  {/* Title */}
                  <h1 style={{
                    fontSize: "2.8rem",
                    fontWeight: "800",
                    margin: "0 0 0.75rem 0",
                    color: "#f5f7ff",
                    background: "linear-gradient(135deg, #22c55e 0%, #00f0ff 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text"
                  }}>
                    Environmental Science
                  </h1>

                  {/* Subtitle */}
                  <p style={{
                    fontSize: "1.05rem",
                    color: "#d1d5db",
                    margin: "0",
                    lineHeight: "1.6",
                    maxWidth: "600px"
                  }}>
                    Understand ecosystems, sustainability, and environmental challenges through hands-on learning.
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
                        background: "linear-gradient(135deg, #22c55e, #10b981)",
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
                        background: "linear-gradient(135deg, #00f0ff, #06b6d4)",
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
                    background: "linear-gradient(135deg, rgba(22, 197, 94, 0.2), rgba(0, 240, 255, 0.15))",
                    border: "1px solid rgba(34, 197, 94, 0.4)",
                    borderRadius: "16px",
                    padding: "2rem",
                    minWidth: "220px",
                    textAlign: "center",
                    backdropFilter: "blur(10px)"
                  }}>
                    <div style={{
                      fontSize: "3rem",
                      fontWeight: "800",
                      background: "linear-gradient(135deg, #22c55e, #00f0ff)",
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
                        background: "linear-gradient(90deg, #22c55e, #00f0ff)",
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
              <h2 style={{ fontSize: "1.4rem", margin: "0 0 1.5rem 0", color: "#f5f7ff", fontWeight: "700" }}>Intro to Environmental Science {introWatched && "✓"}</h2>
              <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, marginBottom: "1.5rem", borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(148, 163, 184, 0.2)" }}>
                <iframe
                  title="Environmental Science Intro"
                  src="https://www.youtube.com/embed/bBjbhHXPMww?rel=0"
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
