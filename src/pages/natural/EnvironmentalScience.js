import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { getUserData, markIntroVideoWatched, isIntroVideoWatched } from "../../utils/storageManager";
import "../../styles/Lesson.css";

// Environmental Science lessons with videos
const ENVIRONMENTAL_SCIENCE_LESSONS = [
  {
    lesson_number: 31,
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
    lesson_number: 32,
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
    lesson_number: 33,
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
    lesson_number: 34,
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
    lesson_number: 35,
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
    lesson_number: 36,
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
    lesson_number: 37,
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
    lesson_number: 38,
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
    lesson_number: 39,
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
    lesson_number: 40,
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
  }, [user?.id]);

  // Refresh lessons from localStorage when component mounts
  useEffect(() => {
    // Get user for user-specific storage - inside effect to avoid dependency issues
    const user = JSON.parse(localStorage.getItem("user") || "null") || null;
    const userId = user?.id;
    
    console.log("🔄 useEffect triggered. introWatched:", introWatched);
    
    const found = null;
    setSub(found);

    const pad = ENVIRONMENTAL_SCIENCE_LESSONS.map((lesson) => {
      // Check if this lesson was unlocked by completing the previous lesson (organized by subject)
      const isUnlocked = userId ? getUserData(userId, `lesson_Environmental Science_unlocked_local-${lesson.lesson_number}`) !== null : false;
      
      // Check if this lesson was completed (organized by subject)
      const isCompleted = userId ? getUserData(userId, `lesson_Environmental Science_completed_local-${lesson.lesson_number}`) !== null : false;
      
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
    
    if (user && user.id) {
      console.log("✅ Saving intro video to localStorage");
      markIntroVideoWatched(user.id, "natural", "environmentalscience", "Environmental Science");
    } else {
      console.warn("⚠️ User not logged in - cannot save video progress");
    }
    
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
    navigate(`/lesson/${lesson.id}`, { state: { lesson, lessons, subId: sub?.id, subjectName: "Environmental Science" } });
  }

  return (
    <div className="dashboard-page" style={{ width: "100%" }}>
      <Sidebar />
      <main className="dashboard-main" style={{ padding: "2rem", margin: "0", width: "100%", maxWidth: "100%", flex: "1 1 auto" }}>
        <header className="dashboard-header" style={{ paddingLeft: "0", paddingRight: "0", marginBottom: "2rem", display: "block" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "1rem", marginBottom: "1rem" }}>
            <div>
              <h1 style={{ color: "#f5f7ff", margin: "0 0 0.5rem 0" }}>Environmental Science</h1>
              <p className="dashboard-subtitle" style={{ margin: "0" }}>Understand ecosystems, sustainability, and environmental challenges.</p>
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
