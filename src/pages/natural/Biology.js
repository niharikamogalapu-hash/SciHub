import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { getUserData, markIntroVideoWatched, isIntroVideoWatched, isLessonCompleted } from "../../utils/storageManager";
import "../../styles/Lesson.css";

// Map Biology lesson numbers to global lesson IDs
const BIOLOGY_LESSON_ID_MAP = {
  1: 1,  // Cell Structure & Function
  2: 2,  // Photosynthesis
  3: 3,  // Genetics & Evolution
};

// Source: All videos from CrashCourse Biology (https://www.youtube.com/@crashcourse)
const VIDEO_SOURCE = {
  name: "CrashCourse Biology",
  channel: "CrashCourse",
  url: "https://www.youtube.com/@crashcourse"
};

// Biology lessons with videos
const BIOLOGY_LESSONS = [
  {
    lesson_number: 1,
    title: "Introduction to Biology",
    videos: [
      { id: 1, title: "What is Biology?", url: "https://www.youtube.com/embed/tZE_fQFK8EY" },
      { id: 2, title: "Scientific Method", url: "https://www.youtube.com/embed/xOLcZMw0hd4" },
      { id: 3, title: "What do Biologists Do?", url: "https://www.youtube.com/embed/rgZhDoPgzK8" },
      { id: 4, title: "Organized Life", url: "https://www.youtube.com/embed/cjR5zPrVjTc" },
      { id: 5, title: "Introduction to Ecology", url: "https://www.youtube.com/embed/aO3Yp45zmw8" }
    ]
  },
  {
    lesson_number: 2,
    title: "Ecology",
    videos: [
      { id: 1, title: "Community Ecology", url: "https://www.youtube.com/embed/0_u6_K7_iYg" },
      { id: 2, title: "Population Ecology", url: "https://www.youtube.com/embed/ZfXk7C3K5Xk" },
      { id: 3, title: "What is Climate Change?", url: "https://www.youtube.com/embed/Y3gKOv8En7k" },
      { id: 4, title: "The Effects of Climate Change", url: "https://www.youtube.com/embed/4sW_hUuT_6Y" },
      { id: 5, title: "Conservation Biology", url: "https://www.youtube.com/embed/mD_L7Y5XN0E" }
    ]
  },
  {
    lesson_number: 3,
    title: "Evolution",
    videos: [
      { id: 1, title: "Intro to Evolution", url: "https://www.youtube.com/embed/3S1t9mI-jXY" },
      { id: 2, title: "Microevolution", url: "https://www.youtube.com/embed/Kz69x6xW_uY" },
      { id: 3, title: "Natural Selection", url: "https://www.youtube.com/embed/7X5_vL7Lp6U" },
      { id: 4, title: "Population Genetics", url: "https://www.youtube.com/embed/rXfW5o283xI" },
      { id: 5, title: "Speciation", url: "https://www.youtube.com/embed/8yvV6X_X_6Y" }
    ]
  },
  {
    lesson_number: 4,
    title: "Evolutionary History",
    videos: [
      { id: 1, title: "Evolutionary History", url: "https://www.youtube.com/embed/9_XInW6EIsE" },
      { id: 2, title: "Phylogeny", url: "https://www.youtube.com/embed/F_f4X6kS75o" },
      { id: 3, title: "Biological Diversity", url: "https://www.youtube.com/embed/rXfW5o283xI" },
      { id: 4, title: "Human Evolution", url: "https://www.youtube.com/embed/S0uX6Xm7t_U" },
      { id: 5, title: "Carbon & Biological Molecules", url: "https://www.youtube.com/embed/y7raEBOvLwU" }
    ]
  },
  {
    lesson_number: 5,
    title: "Cell Structure",
    videos: [
      { id: 1, title: "The Unexpected Truth About Water", url: "https://www.youtube.com/embed/kY89A8u03vE" },
      { id: 2, title: "Microscopes", url: "https://www.youtube.com/embed/vV_Xshb-G5U" },
      { id: 3, title: "A Tour of the Cell", url: "https://www.youtube.com/embed/jsDxw63QqK0" },
      { id: 4, title: "Cell Membranes", url: "https://www.youtube.com/embed/L9L72vK_pAc" },
      { id: 5, title: "Why Do Cells Need to Communicate?", url: "https://www.youtube.com/embed/4vVvVz6t-O0" }
    ]
  },
  {
    lesson_number: 6,
    title: "Cell Division & Energy",
    videos: [
      { id: 1, title: "Chemical Reactions in Biology", url: "https://www.youtube.com/embed/vV_Xshb-G5U" },
      { id: 2, title: "Cellular Respiration", url: "https://www.youtube.com/embed/vV_Xshb-G5U" },
      { id: 3, title: "Photosynthesis", url: "https://www.youtube.com/embed/vV_Xshb-G5U" },
      { id: 4, title: "Mitosis & the Cell Cycle", url: "https://www.youtube.com/embed/vV_Xshb-G5U" },
      { id: 5, title: "Meiosis", url: "https://www.youtube.com/embed/vV_Xshb-G5U" }
    ]
  },
  {
    lesson_number: 7,
    title: "Genetics Basics",
    videos: [
      { id: 1, title: "Intro to Genetics", url: "https://www.youtube.com/embed/vV_Xshb-G5U" },
      { id: 2, title: "Genetic Traits", url: "https://www.youtube.com/embed/vV_Xshb-G5U" },
      { id: 3, title: "DNA Structure & Replication", url: "https://www.youtube.com/embed/4YNDB_zSzfE" },
      { id: 4, title: "Transcription", url: "https://www.youtube.com/embed/vV_Xshb-G5U" },
      { id: 5, title: "Translation", url: "https://www.youtube.com/embed/vV_Xshb-G5U" }
    ]
  },
  {
    lesson_number: 8,
    title: "Gene Expression",
    videos: [
      { id: 1, title: "How Genes Express Themselves", url: "https://www.youtube.com/embed/vV_Xshb-G5U" },
      { id: 2, title: "Genetic Mutations", url: "https://www.youtube.com/embed/vV_Xshb-G5U" },
      { id: 3, title: "Bacterial DNA & Genetics", url: "https://www.youtube.com/embed/vV_Xshb-G5U" },
      { id: 4, title: "Viruses & Vaccines", url: "https://www.youtube.com/embed/vV_Xshb-G5U" },
      { id: 5, title: "Bioinformatics", url: "https://www.youtube.com/embed/vV_Xshb-G5U" }
    ]
  },
  {
    lesson_number: 9,
    title: "Multicellular Organisms",
    videos: [
      { id: 1, title: "Multicellular Function", url: "https://www.youtube.com/embed/vV_Xshb-G5U" },
      { id: 2, title: "Plant Anatomy & Physiology", url: "https://www.youtube.com/embed/vV_Xshb-G5U" },
      { id: 3, title: "The Poop Episode (Waste)", url: "https://www.youtube.com/embed/vV_Xshb-G5U" },
      { id: 4, title: "Animal Infrastructure", url: "https://www.youtube.com/embed/vV_Xshb-G5U" },
      { id: 5, title: "Animal Defense Systems", url: "https://www.youtube.com/embed/vV_Xshb-G5U" }
    ]
  },
  {
    lesson_number: 10,
    title: "Animal Systems & Behavior",
    videos: [
      { id: 1, title: "Nervous & Endocrine Systems", url: "https://www.youtube.com/embed/vV_Xshb-G5U" },
      { id: 2, title: "Sexual & Asexual Reproduction", url: "https://www.youtube.com/embed/vV_Xshb-G5U" },
      { id: 3, title: "Gender, Sex, & Sexuality", url: "https://www.youtube.com/embed/vV_Xshb-G5U" },
      { id: 4, title: "Animal Behavior", url: "https://www.youtube.com/embed/vV_Xshb-G5U" },
      { id: 5, title: "Biology and You", url: "https://www.youtube.com/embed/SyHM1gFyP8Y" }
    ]
  }
];

export default function Biology() {
  const [sub, setSub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lessons, setLessons] = useState([]);
  const [introWatched, setIntroWatched] = useState(false);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null") || null;

  // Check if intro was already watched from localStorage
  useEffect(() => {
    if (!user || !user.id) {
      console.log("User not logged in - skipping video_progress check");
      return;
    }

    console.log("📡 Checking if intro video is already completed for user:", user.id);
    
    // Load intro video status from localStorage
    const watched = isIntroVideoWatched(user.id, "natural", "biology");
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
    console.log("👤 Current user ID:", userId);
    
    // Skip fetching resources - use fallback
    const found = null; // No resource found
    setSub(found);

    // Create lessons from BIOLOGY_LESSONS data
    const pad = BIOLOGY_LESSONS.map((lesson) => {
      // Get the global lesson ID for this Biology lesson
      const globalLessonId = BIOLOGY_LESSON_ID_MAP[lesson.lesson_number];
      
      // Check if this lesson was completed using the global lesson ID
      const isCompleted = userId && globalLessonId ? isLessonCompleted(userId, globalLessonId) : false;
      
      // For unlocking: check if previous lesson was completed
      let isUnlocked = lesson.lesson_number === 1; // First lesson is always unlocked
      if (lesson.lesson_number > 1) {
        const previousGlobalId = BIOLOGY_LESSON_ID_MAP[lesson.lesson_number - 1];
        isUnlocked = userId && previousGlobalId ? isLessonCompleted(userId, previousGlobalId) : false;
      }
      
      console.log(`📖 Biology Lesson ${lesson.lesson_number} (ID ${globalLessonId}): completed=${isCompleted}, unlocked=${isUnlocked}`);
      
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
    
    // Backend API disabled - using localStorage instead
    if (user && user.id) {
      console.log("✅ Saving intro video to localStorage");
      markIntroVideoWatched(user.id, "natural", "biology", "Biology");
    } else {
      console.warn("⚠️ User not logged in - cannot save video progress");
    }
    
    // Set intro watched state
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
  */

  function viewLesson(lesson) {
    console.log("🔘 View Lesson button clicked. Lesson object:", lesson);
    console.log("📦 Lesson ID:", lesson?.id);
    console.log("📦 Lesson title:", lesson?.title);
    console.log("🔗 Navigating to /lesson/" + lesson.id);
    console.log("📤 Sending state with lesson:", { lesson, subId: sub?.id, subjectName: "Biology" });
    navigate(`/lesson/${lesson.id}`, { state: { lesson, lessons, subId: sub?.id, subjectName: "Biology" } });
  }

  return (
    <div className="dashboard-page" style={{ width: "100%" }}>
      <Sidebar />
      <main className="dashboard-main" style={{ padding: "2rem", margin: "0", width: "100%", maxWidth: "100%", flex: "1 1 auto" }}>
        <header className="dashboard-header" style={{ paddingLeft: "0", paddingRight: "0", marginBottom: "3rem", display: "block" }}>
          <div style={{
            background: "linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(168, 85, 247, 0.1) 100%)",
            border: "1px solid rgba(236, 72, 153, 0.3)",
            borderRadius: "20px",
            padding: "3rem",
            position: "relative",
            overflow: "hidden",
            backdropFilter: "blur(20px)",
            boxShadow: "0 20px 60px rgba(236, 72, 153, 0.15)",
          }}>
            {/* Background gradient accent */}
            <div style={{
              position: "absolute",
              top: "-50%",
              right: "-10%",
              width: "400px",
              height: "400px",
              background: "radial-gradient(circle, rgba(236, 72, 153, 0.2), transparent)",
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
                  }}>🔬</div>

                  {/* Title */}
                  <h1 style={{
                    fontSize: "2.8rem",
                    fontWeight: "800",
                    margin: "0 0 0.75rem 0",
                    color: "#f5f7ff",
                    background: "linear-gradient(135deg, #ec4899 0%, #a855f7 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text"
                  }}>
                    Biology
                  </h1>

                  {/* Subtitle */}
                  <p style={{
                    fontSize: "1.05rem",
                    color: "#d1d5db",
                    margin: "0",
                    lineHeight: "1.6",
                    maxWidth: "600px"
                  }}>
                    Discover living systems, cells, genetics and ecology through hands-on learning.
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
                        background: "linear-gradient(135deg, #ec4899, #f472b6)",
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
                        background: "linear-gradient(135deg, #a855f7, #d946ef)",
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
                    background: "linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(168, 85, 247, 0.15))",
                    border: "1px solid rgba(236, 72, 153, 0.4)",
                    borderRadius: "16px",
                    padding: "2rem",
                    minWidth: "220px",
                    textAlign: "center",
                    backdropFilter: "blur(10px)"
                  }}>
                    <div style={{
                      fontSize: "3rem",
                      fontWeight: "800",
                      background: "linear-gradient(135deg, #ec4899, #a855f7)",
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
                        background: "linear-gradient(90deg, #ec4899, #a855f7)",
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
              <h2 style={{ fontSize: "1.4rem", margin: "0 0 1.5rem 0", color: "#f5f7ff", fontWeight: "700" }}>Intro to Biology {introWatched && "✓"}</h2>
              <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, marginBottom: "1.5rem", borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(148, 163, 184, 0.2)" }}>
                <iframe
                  title="Biology Intro"
                  src="https://www.youtube.com/embed/PWGBqskV1UQ?rel=0"
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
