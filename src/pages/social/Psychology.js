import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { getUserData, markIntroVideoWatched, isIntroVideoWatched } from "../../utils/storageManager";
import "../../styles/Lesson.css";

// Psychology lessons with videos
const PSYCHOLOGY_LESSONS = [
  {
    lesson_number: 1,
    title: "Intro & Research Methods",
    videos: [
      { id: 1, title: "Intro to Psychology", url: "https://www.youtube.com/embed/vo4pMVb0R6M" },
      { id: 2, title: "Psychology & Research", url: "https://www.youtube.com/embed/hFV71QPvX2I" },
      { id: 3, title: "The Chemical Mind", url: "https://www.youtube.com/embed/W4N-7AlzK7s" },
      { id: 4, title: "Meet Your Master: Getting to Know Your Brain", url: "https://www.youtube.com/embed/vHrmiy4W9C0" },
      { id: 5, title: "Meet Your Master (Review)", url: "https://www.youtube.com/embed/vHrmiy4W9C0" }
    ]
  },
  {
    lesson_number: 2,
    title: "Sensation & Perception",
    videos: [
      { id: 1, title: "Sensation & Perception", url: "https://www.youtube.com/embed/unWnZvXJH2o" },
      { id: 2, title: "Homunculus", url: "https://www.youtube.com/embed/FX9Xp02086M" },
      { id: 3, title: "Perceiving Is Believing", url: "https://www.youtube.com/embed/n46umYA_4dM" },
      { id: 4, title: "Consciousness", url: "https://www.youtube.com/embed/jReX7qKU2yc" },
      { id: 5, title: "Consciousness (Review)", url: "https://www.youtube.com/embed/jReX7qKU2yc" }
    ]
  },
  {
    lesson_number: 3,
    title: "Sleep, Altered States & Genetics",
    videos: [
      { id: 1, title: "To Sleep, Perchance to Dream", url: "https://www.youtube.com/embed/rMHus-0wFSo" },
      { id: 2, title: "Altered States", url: "https://www.youtube.com/embed/9PW1fwKjo-Y" },
      { id: 3, title: "The Power of Motivation", url: "https://www.youtube.com/embed/9hdSLiHaJz8" },
      { id: 4, title: "Is Entirely Genetic? (Epigenetics)", url: "https://www.youtube.com/embed/uPB8mXq2C5Q" },
      { id: 5, title: "Epigenetics (Review)", url: "https://www.youtube.com/embed/uPB8mXq2C5Q" }
    ]
  },
  {
    lesson_number: 4,
    title: "Development & Growth",
    videos: [
      { id: 1, title: "The Developing Child", url: "https://www.youtube.com/embed/8nz2dtv--ok" },
      { id: 2, title: "Adolescence", url: "https://www.youtube.com/embed/PzyXGUCngoU" },
      { id: 3, title: "Monkeys and Morality", url: "https://www.youtube.com/embed/YcQg1EshfIE" },
      { id: 4, title: "The Grown-Up Mind", url: "https://www.youtube.com/embed/vHrmiy4W9C0" },
      { id: 5, title: "The Grown-Up Mind (Review)", url: "https://www.youtube.com/embed/vHrmiy4W9C0" }
    ]
  },
  {
    lesson_number: 5,
    title: "Learning & Memory",
    videos: [
      { id: 1, title: "How We Learn", url: "https://www.youtube.com/embed/qG2SwE_6uVM" },
      { id: 2, title: "How We Make Memories", url: "https://www.youtube.com/embed/bSycdIx-C48" },
      { id: 3, title: "Remembering and Forgetting", url: "https://www.youtube.com/embed/HVWbrNls-Kw" },
      { id: 4, title: "Cognition", url: "https://www.youtube.com/embed/R-sVnmmw6WY" },
      { id: 5, title: "Cognition (Review)", url: "https://www.youtube.com/embed/R-sVnmmw6WY" }
    ]
  },
  {
    lesson_number: 6,
    title: "Language, Intelligence & Emotion",
    videos: [
      { id: 1, title: "Language", url: "https://www.youtube.com/embed/s9shPouRWCs" },
      { id: 2, title: "Intelligence", url: "https://www.youtube.com/embed/9xTz3QjcloI" },
      { id: 3, title: "Brain vs. Bias", url: "https://www.youtube.com/embed/7u_XN_A0vEY" },
      { id: 4, title: "Feeling All the Feels (Emotion)", url: "https://www.youtube.com/embed/gAMbkJk6leE" },
      { id: 5, title: "Emotion (Review)", url: "https://www.youtube.com/embed/gAMbkJk6leE" }
    ]
  },
  {
    lesson_number: 7,
    title: "Stress & Personality",
    videos: [
      { id: 1, title: "The Direct & Indirect Effects of Stress", url: "https://www.youtube.com/embed/4KbSRXP0paY" },
      { id: 2, title: "Measuring Personality", url: "https://www.youtube.com/embed/sUrV6oZ3zsk" },
      { id: 3, title: "Rorschach & Freudians", url: "https://www.youtube.com/embed/mUEN6VnKnP8" },
      { id: 4, title: "The Self and Masculinity", url: "https://www.youtube.com/embed/vxyueBvSIsc" },
      { id: 5, title: "Personality (Review)", url: "https://www.youtube.com/embed/sUrV6oZ3zsk" }
    ]
  },
  {
    lesson_number: 8,
    title: "Disorders & Treatment Part 1",
    videos: [
      { id: 1, title: "Psychological Disorders", url: "https://www.youtube.com/embed/wuhJ-GkRRQc" },
      { id: 2, title: "OCD & Anxiety Disorders", url: "https://www.youtube.com/embed/aX7jnVXXG5o" },
      { id: 3, title: "Depressive & Bipolar Disorders", url: "https://www.youtube.com/embed/ZwMlHkWKDwM" },
      { id: 4, title: "Trauma & Addiction", url: "https://www.youtube.com/embed/343ORggvE_E" },
      { id: 5, title: "Disorders (Review)", url: "https://www.youtube.com/embed/wuhJ-GkRRQc" }
    ]
  },
  {
    lesson_number: 9,
    title: "Disorders & Treatment Part 2",
    videos: [
      { id: 1, title: "Schizophrenia", url: "https://www.youtube.com/embed/uxktavpRdzU" },
      { id: 2, title: "Eating & Body Dysmorphic Disorders", url: "https://www.youtube.com/embed/aX7jnVXXG5o" },
      { id: 3, title: "Personality Disorders", url: "https://www.youtube.com/embed/4E1JiVMkr_4" },
      { id: 4, title: "Getting Help (Psychotherapy)", url: "https://www.youtube.com/embed/6nEL44QkL9w" },
      { id: 5, title: "Treatment (Review)", url: "https://www.youtube.com/embed/6nEL44QkL9w" }
    ]
  },
  {
    lesson_number: 10,
    title: "Social Psychology & Influence",
    videos: [
      { id: 1, title: "Biomedical Treatments", url: "https://www.youtube.com/embed/w26S_fOqS8A" },
      { id: 2, title: "Social Thinking", url: "https://www.youtube.com/embed/h6HLDV0T5Q8" },
      { id: 3, title: "Social Influence", url: "https://www.youtube.com/embed/UGxGDqunC1Y" },
      { id: 4, title: "Prejudice & Discrimination", url: "https://www.youtube.com/embed/7P0iP2Zm6a4" },
      { id: 5, title: "Social Psychology (Review)", url: "https://www.youtube.com/embed/h6HLDV0T5Q8" }
    ]
  }
];

export default function Psychology() {
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
    const watched = isIntroVideoWatched(user.id, "social", "psychology");
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

    // Create lessons from PSYCHOLOGY_LESSONS data
    const pad = PSYCHOLOGY_LESSONS.map((lesson) => {
      // Check if this lesson was unlocked by completing the previous lesson (organized by subject)
      const isUnlocked = userId ? getUserData(userId, `lesson_Psychology_unlocked_local-${lesson.lesson_number}`) !== null : false;
      
      // Check if this lesson was completed (organized by subject)
      const isCompleted = userId ? getUserData(userId, `lesson_Psychology_completed_local-${lesson.lesson_number}`) !== null : false;
      
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
      markIntroVideoWatched(user.id, "social", "psychology", "Psychology");
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
    navigate(`/lesson/${lesson.id}`, { state: { lesson, lessons, subId: sub?.id, subjectName: "Psychology" } });
  }

  return (
    <div className="dashboard-page" style={{ width: "100%" }}>
      <Sidebar />
      <main className="dashboard-main" style={{ padding: "2rem", margin: "0", width: "100%", maxWidth: "100%", flex: "1 1 auto" }}>
        <header className="dashboard-header" style={{ paddingLeft: "0", paddingRight: "0", marginBottom: "3rem", display: "block" }}>
          <div style={{
            background: "linear-gradient(135deg, rgba(244, 63, 94, 0.15) 0%, rgba(219, 39, 119, 0.1) 100%)",
            border: "1px solid rgba(244, 63, 94, 0.3)",
            borderRadius: "20px",
            padding: "3rem",
            position: "relative",
            overflow: "hidden",
            backdropFilter: "blur(20px)",
            boxShadow: "0 20px 60px rgba(244, 63, 94, 0.15)",
          }}>
            {/* Background gradient accent */}
            <div style={{
              position: "absolute",
              top: "-50%",
              right: "-10%",
              width: "400px",
              height: "400px",
              background: "radial-gradient(circle, rgba(244, 63, 94, 0.2), transparent)",
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
                  }}>🧠</div>

                  {/* Title */}
                  <h1 style={{
                    fontSize: "2.8rem",
                    fontWeight: "800",
                    margin: "0 0 0.75rem 0",
                    color: "#f5f7ff",
                    background: "linear-gradient(135deg, #f43f5e 0%, #db2777 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text"
                  }}>
                    Psychology
                  </h1>

                  {/* Subtitle */}
                  <p style={{
                    fontSize: "1.05rem",
                    color: "#d1d5db",
                    margin: "0",
                    lineHeight: "1.6",
                    maxWidth: "600px"
                  }}>
                    Explore behavior, cognition, and the human mind.
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
                        background: "linear-gradient(135deg, #f43f5e, #e11d48)",
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
                        background: "linear-gradient(135deg, #db2777, #ec4899)",
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
                    background: "linear-gradient(135deg, rgba(244, 63, 94, 0.2), rgba(219, 39, 119, 0.15))",
                    border: "1px solid rgba(244, 63, 94, 0.4)",
                    borderRadius: "16px",
                    padding: "2rem",
                    minWidth: "220px",
                    textAlign: "center",
                    backdropFilter: "blur(10px)"
                  }}>
                    <div style={{
                      fontSize: "3rem",
                      fontWeight: "800",
                      background: "linear-gradient(135deg, #f43f5e, #db2777)",
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
                        background: "linear-gradient(90deg, #f43f5e, #db2777)",
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
              <h2 style={{ fontSize: "1.4rem", margin: "0 0 1.5rem 0", color: "#f5f7ff", fontWeight: "700" }}>Intro to Psychology {introWatched && "✓"}</h2>
              <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, marginBottom: "1.5rem", borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(148, 163, 184, 0.2)" }}>
                <iframe
                  title="Psychology Intro"
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
