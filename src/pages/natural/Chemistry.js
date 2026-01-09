import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { getUserData, markIntroVideoWatched, isIntroVideoWatched, isLessonCompleted } from "../../utils/storageManager";
import "../../styles/Lesson.css";

// Map Chemistry lesson numbers to global lesson IDs
const CHEMISTRY_LESSON_ID_MAP = {
  1: 4,  // Atomic Structure
  2: 5,  // Chemical Bonding
  3: 6,  // Reactions & Equations
};

// Source: All videos from CrashCourse Chemistry (https://www.youtube.com/@crashcourse)
const VIDEO_SOURCE = {
  name: "CrashCourse Chemistry",
  channel: "CrashCourse",
  url: "https://www.youtube.com/@crashcourse"
};

const CHEMISTRY_LESSONS = [
  {
    id: 4,
    lesson_number: 1,
    title: "The Foundations of Matter",
    source: VIDEO_SOURCE,
    videos: [
      { id: 1, title: "The Nucleus: Crash Course Chemistry #1", url: "https://www.youtube.com/embed/FSyAehMdpyI", source: "CrashCourse" },
      { id: 2, title: "Atoms & Atomic Structure: Crash Course Chemistry #2", url: "https://www.youtube.com/embed/hQpQ0hxVNTg", source: "CrashCourse" },
      { id: 3, title: "The Creation of Chemistry: Crash Course Chemistry #3", url: "https://www.youtube.com/embed/QiiyvzZBKT8", source: "CrashCourse" },
      { id: 4, title: "The Periodic Table: Crash Course Chemistry #4", url: "https://www.youtube.com/embed/0RRVV4Diomg", source: "CrashCourse" },
      { id: 5, title: "Electrons in Atoms: Crash Course Chemistry #5", url: "https://www.youtube.com/embed/rcKilE9CdaA", source: "CrashCourse" },
    ]
  },
  {
    id: 5,
    lesson_number: 2,
    title: "Chemical Math & Reactions",
    videos: [
      { id: 1, title: "Stoichiometry", url: "https://www.youtube.com/embed/UL1jmJaUkaQ" },
      { id: 2, title: "Water & Solutions", url: "https://www.youtube.com/embed/AN4KifV12DA" },
      { id: 3, title: "Acid-Base Reactions", url: "https://www.youtube.com/embed/ANi709MYnWg" },
      { id: 4, title: "Precipitation Reactions", url: "https://www.youtube.com/embed/IIu16dy3ThI" },
      { id: 5, title: "Redox Reactions", url: "https://www.youtube.com/embed/lQ6FBA1HM3s" },
    ]
  },
  {
    id: 6,
    lesson_number: 3,
    title: "The Language of Gases",
    videos: [
      { id: 1, title: "How to Speak Chemistrian", url: "https://www.youtube.com/embed/mlRhLicNo8Q" },
      { id: 2, title: "The Ideal Gas Law", url: "https://www.youtube.com/embed/BxUS1K7xu30" },
      { id: 3, title: "Ideal Gas Problems", url: "https://www.youtube.com/embed/8SRAkXMu3d0" },
      { id: 4, title: "Real Gases", url: "https://www.youtube.com/embed/GIPrsWuSkQc" },
      { id: 5, title: "Partial Pressures", url: "https://www.youtube.com/embed/JbqtqCunYzA" },
    ]
  },
  {
    id: 7,
    lesson_number: 4,
    title: "Energy & Thermodynamics",
    videos: [
      { id: 1, title: "Passing Gases", url: "https://www.youtube.com/embed/TLRZAFU_9Kg" },
      { id: 2, title: "Energy & Chemistry", url: "https://www.youtube.com/embed/GqtUWyDR1fg" },
      { id: 3, title: "Enthalpy", url: "https://www.youtube.com/embed/SV7U4yAXL5I" },
      { id: 4, title: "Calorimetry", url: "https://www.youtube.com/embed/JuWtBR-rDQk" },
      { id: 5, title: "Entropy", url: "https://www.youtube.com/embed/ZsY4WcQOrfk" },
    ]
  },
  {
    id: 8,
    lesson_number: 5,
    title: "Bonding & Molecular Structure",
    videos: [
      { id: 1, title: "Lab Techniques & Safety", url: "https://www.youtube.com/embed/VRWRmIEHr3A" },
      { id: 2, title: "Types of Chemical Bonds", url: "https://www.youtube.com/embed/QXT4OVM4vXI" },
      { id: 3, title: "Polar & Non-Polar Molecules", url: "https://www.youtube.com/embed/PVL24HAesnc" },
      { id: 4, title: "Bonding Models & Lewis Structures", url: "https://www.youtube.com/embed/a8LF7JEb0IA" },
      { id: 5, title: "Orbitals", url: "https://www.youtube.com/embed/cPDptc0wUYI" },
    ]
  },
  {
    id: 9,
    lesson_number: 6,
    title: "Phases of Matter",
    videos: [
      { id: 1, title: "Liquids", url: "https://www.youtube.com/embed/BqQJPCdmIp8" },
      { id: 2, title: "Solutions", url: "https://www.youtube.com/embed/9h2f1Bjr0p4" },
      { id: 3, title: "Equilibrium", url: "https://www.youtube.com/embed/g5wNg_dKsYY" },
      { id: 4, title: "Equilibrium Equations", url: "https://www.youtube.com/embed/DP-vWN1yXrY" },
      { id: 5, title: "Solids Review", url: "https://www.youtube.com/embed/BqQJPCdmIp8" },
    ]
  },
  {
    id: 10,
    lesson_number: 7,
    title: "Acids, Bases, & Kinetics",
    videos: [
      { id: 1, title: "pH and pOH", url: "https://www.youtube.com/embed/LS67vS10O5Y" },
      { id: 2, title: "Buffers", url: "https://www.youtube.com/embed/8Fdt5WnYn1k" },
      { id: 3, title: "Kinetics", url: "https://www.youtube.com/embed/7qOFtL3VEBc" },
      { id: 4, title: "Doing Solids", url: "https://www.youtube.com/embed/bzr-byiSXlA" },
      { id: 5, title: "Reaction Rates", url: "https://www.youtube.com/embed/7qOFtL3VEBc" },
    ]
  },
  {
    id: 11,
    lesson_number: 8,
    title: "Advanced Atomic Theory & Electricity",
    videos: [
      { id: 1, title: "Network Solids & Carbon", url: "https://www.youtube.com/embed/b_SXwfHQ774" },
      { id: 2, title: "Silicon", url: "https://www.youtube.com/embed/kdy3RsZk7As" },
      { id: 3, title: "Electrochemistry", url: "https://www.youtube.com/embed/IV4IUsholjg" },
      { id: 4, title: "History of Atomic Chemistry", url: "https://www.youtube.com/embed/thnDxFdkzZs" },
      { id: 5, title: "Periodic Trends", url: "https://www.youtube.com/embed/b_SXwfHQ774" },
    ]
  },
  {
    id: 12,
    lesson_number: 9,
    title: "Nuclear Chemistry & Organic Intro",
    videos: [
      { id: 1, title: "Nuclear Chemistry", url: "https://www.youtube.com/embed/FSyAehMdpyI" },
      { id: 2, title: "Nuclear Chemistry Part 2", url: "https://www.youtube.com/embed/FU6y1XIADdg" },
      { id: 3, title: "Hydrocarbon Power!", url: "https://www.youtube.com/embed/UloIw7dhnlQ" },
      { id: 4, title: "Alkenes & Alkynes", url: "https://www.youtube.com/embed/CEH3O6l1pbw" },
      { id: 5, title: "Aromatics & Cyclic Compounds", url: "https://www.youtube.com/embed/kXFEex-dABU" },
    ]
  },
  {
    id: 13,
    lesson_number: 10,
    title: "Organic Chemistry & Global Cycles",
    videos: [
      { id: 1, title: "Hydrocarbon Derivatives", url: "https://www.youtube.com/embed/hlXc_eEtBHA" },
      { id: 2, title: "Nomenclature", url: "https://www.youtube.com/embed/U7wavimfNFE" },
      { id: 3, title: "Polymers", url: "https://www.youtube.com/embed/rHxxLYzJ8Sw" },
      { id: 4, title: "The Global Carbon Cycle", url: "https://www.youtube.com/embed/aLuSi_6Ol8M" },
      { id: 5, title: "Organic Synthesis", url: "https://www.youtube.com/embed/hlXc_eEtBHA" },
    ]
  },
];

export default function Chemistry() {
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
    const watched = isIntroVideoWatched(user.id, "natural", "chemistry");
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
    
    // Skip fetching resources - use fallback
    const found = null; // No resource found
    setSub(found);

    // Create lessons from CHEMISTRY_LESSONS with video data
    const pad = CHEMISTRY_LESSONS.map((lesson, index) => {
      // Get the global lesson ID for this Chemistry lesson
      const globalLessonId = CHEMISTRY_LESSON_ID_MAP[lesson.lesson_number];
      
      // Check if this lesson was completed using the global lesson ID
      const isCompleted = userId && globalLessonId ? isLessonCompleted(userId, globalLessonId) : false;
      
      // For unlocking: check if previous lesson was completed
      let isUnlocked = lesson.lesson_number === 1; // First lesson is always unlocked
      if (lesson.lesson_number > 1) {
        const previousGlobalId = CHEMISTRY_LESSON_ID_MAP[lesson.lesson_number - 1];
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

  // Unlock lesson 1 when intro is watched
  useEffect(() => {
    if (!introWatched) return;
    
    console.log("✅ Intro watched - unlocking lesson 1");
    setLessons((prev) => {
      if (prev.length > 0 && prev[0].status === "locked") {
        const updated = [...prev];
        updated[0] = { ...updated[0], status: "unlocked" };
        return updated;
      }
      return prev;
    });
  }, [introWatched]);

  function markIntroWatched() {
    console.log("🔘 Button clicked - markIntroWatched() called");
    
    // Backend API disabled - using localStorage instead
    if (user && user.id) {
      console.log("✅ Saving intro video to localStorage");
      markIntroVideoWatched(user.id, "natural", "chemistry", "Chemistry");
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
    console.log("🔘 View Lesson button clicked. Lesson:", lesson);
    console.log("🔗 Navigating to /lesson/" + lesson.id);
    console.log("📚 Passing lessons array:", lessons);
    console.log("📝 Passing lesson object:", lesson);
    navigate(`/lesson/${lesson.id}`, { state: { lesson, lessons, subId: sub?.id, subjectName: "Chemistry" } });
  }

  return (
    <div className="dashboard-page" style={{ width: "100%" }}>
      <Sidebar />
      <main className="dashboard-main" style={{ padding: "2rem", margin: "0", width: "100%", maxWidth: "100%", flex: "1 1 auto" }}>
        <header className="dashboard-header" style={{ paddingLeft: "0", paddingRight: "0", marginBottom: "3rem", display: "block" }}>
          <div style={{
            background: "linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(251, 146, 60, 0.1) 100%)",
            border: "1px solid rgba(245, 158, 11, 0.3)",
            borderRadius: "20px",
            padding: "3rem",
            position: "relative",
            overflow: "hidden",
            backdropFilter: "blur(20px)",
            boxShadow: "0 20px 60px rgba(245, 158, 11, 0.15)",
          }}>
            {/* Background gradient accent */}
            <div style={{
              position: "absolute",
              top: "-50%",
              right: "-10%",
              width: "400px",
              height: "400px",
              background: "radial-gradient(circle, rgba(245, 158, 11, 0.2), transparent)",
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
                  }}>⚛️</div>

                  {/* Title */}
                  <h1 style={{
                    fontSize: "2.8rem",
                    fontWeight: "800",
                    margin: "0 0 0.75rem 0",
                    color: "#f5f7ff",
                    background: "linear-gradient(135deg, #f59e0b 0%, #fb923c 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text"
                  }}>
                    Chemistry
                  </h1>

                  {/* Subtitle */}
                  <p style={{
                    fontSize: "1.05rem",
                    color: "#d1d5db",
                    margin: "0",
                    lineHeight: "1.6",
                    maxWidth: "600px"
                  }}>
                    Learn about atoms, reactions, and the properties of matter through interactive lessons.
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
                        background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
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
                        background: "linear-gradient(135deg, #fb923c, #fdba74)",
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
                    background: "linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(251, 146, 60, 0.15))",
                    border: "1px solid rgba(245, 158, 11, 0.4)",
                    borderRadius: "16px",
                    padding: "2rem",
                    minWidth: "220px",
                    textAlign: "center",
                    backdropFilter: "blur(10px)"
                  }}>
                    <div style={{
                      fontSize: "3rem",
                      fontWeight: "800",
                      background: "linear-gradient(135deg, #f59e0b, #fb923c)",
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
                        background: "linear-gradient(90deg, #f59e0b, #fb923c)",
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
              <h2 style={{ fontSize: "1.4rem", margin: "0 0 1.5rem 0", color: "#f5f7ff", fontWeight: "700" }}>Intro to Chemistry {introWatched && "✓"}</h2>
              <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, marginBottom: "1.5rem", borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(148, 163, 184, 0.2)" }}>
                <iframe
                  title="Chemistry Intro"
                  src="https://www.youtube.com/embed/uVFCOfSuPTo?rel=0"
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
                  {lessons.map((lesson, index) => (
                    <li key={lesson.id} className={`lesson-card ${lesson.status}`}>
                      <div className="lesson-card-number">{index + 1}</div>
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
