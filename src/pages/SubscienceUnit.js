// src/pages/SubscienceUnit.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function SubscienceUnit() {
  const { subId } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null") || null;

  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unitName, setUnitName] = useState("");

  // Lesson details modal / sessions (hooks must be declared before any early returns)
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [lessonTutors, setLessonTutors] = useState([]);
  const [lessonSessions, setLessonSessions] = useState([]);
  const [signupProcessing, setSignupProcessing] = useState(false);

  useEffect(() => {
    async function fetchLessons() {
      try {
        const res = await fetch(
          `http://localhost:8080/subsciences/${subId}/lessons/${user.id}`
        );
        const data = await res.json();
        setLessons(data.lessons || []);
        setUnitName(data.lessons?.[0]?.subscienceName || "Unit");
      } catch (err) {
        console.error("Subscience lessons error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchLessons();
  }, [subId, user.id]);

  if (!user) {
    return <h1 style={{ color: "white" }}>Please log in</h1>;
  }

  const totalLessons = lessons.length;
  const completedCount = lessons.filter((l) => l.status === "completed").length;
  const progressPercent =
    totalLessons === 0 ? 0 : Math.round((completedCount / totalLessons) * 100);

  const allLessonsCompleted = completedCount === 10;

  async function openLessonDetails(lesson) {
    setSelectedLesson(lesson);
    setShowLessonModal(true);
    setLessonTutors([]);
    setLessonSessions([]);

    try {
      const tRes = await fetch(`http://localhost:8080/lessons/${lesson.id}/tutors`);
      const tData = await tRes.json();
      setLessonTutors(tData.tutors || []);
    } catch (err) {
      console.error("Failed to load tutors", err);
    }

    try {
      const sRes = await fetch(`http://localhost:8080/lessons/${lesson.id}/sessions`);
      const sData = await sRes.json();
      const normalized = (sData.sessions || []).map((ss) => ({
        ...ss,
        spots_left: ss.max_spots - (ss.signed_up_count || ss.signed_up || 0),
      }));
      setLessonSessions(normalized);
    } catch (err) {
      console.error("Failed to load sessions", err);
    }
  }

  async function handleSignupToSession(session) {
    const user = JSON.parse(localStorage.getItem("user") || "null") || null;
    if (!user) {
      alert("Please log in to join a session");
      return;
    }

    if (session.spots_left === 0) {
      alert("This session is full");
      return;
    }

    setSignupProcessing(true);
    try {
      const res = await fetch(`http://localhost:8080/sessions/${session.id}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id, name: user.firstName, email: user.email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup failed");

      alert(data.message || "Signed up for session");
      setLessonSessions((prev) => prev.map((p) => (p.id === session.id ? { ...p, spots_left: Math.max(0, (p.spots_left || p.max_spots) - 1) } : p)));
    } catch (err) {
      console.error(err);
      alert(err.message || "Signup error");
    } finally {
      setSignupProcessing(false);
    }
  }
  return (
    <div className="dashboard-page">
      <Sidebar />

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h1>{unitName} Unit</h1>
            <p className="dashboard-subtitle">
              Complete lessons, play games, ask questions, and finish the Unit Test.
            </p>
          </div>

          <div className="dashboard-header-actions">
            <button
              className="primary-btn"
              onClick={() => navigate(`/qna/${subId}`)}
            >
              Q & A
            </button>

            <button
              className="ghost-btn"
              onClick={() => navigate(`/games/${subId}`)}
            >
              Games
            </button>
          </div>
        </header>

        {loading ? (
          <p className="dashboard-loading">Loading lessons...</p>
        ) : (
          <div className="subscience-layout">
            {/* Progress */}
            <section className="dashboard-panel subscience-progress-panel">
              <h2>Unit Progress</h2>
              <p className="subscience-progress-text">
                {completedCount} of 10 lessons completed
              </p>
              <div className="subscience-progress-bar">
                <div
                  className="subscience-progress-fill"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="subscience-progress-percent">{progressPercent}% complete</p>
            </section>

            {/* Lessons */}
            <section className="dashboard-panel subscience-lessons-panel">
              <h2>Lessons</h2>
              <ul className="subscience-lessons-list">
                {lessons.map((lesson) => (
                  <li key={lesson.id} className={`subscience-lesson ${lesson.status}`}>
                    <div className="subscience-lesson-main">
                      <div>
                        <p className="subscience-lesson-number">
                          Lesson {lesson.lesson_number}
                        </p>
                        <p className="subscience-lesson-title">{lesson.title}</p>
                        <p className="subscience-lesson-status">
                          Status: {lesson.status}
                        </p>
                      </div>

                      <div className="subscience-lesson-tags">
                        {lesson.status === "completed" && (
                          <span className="tag tag-completed">Completed</span>
                        )}
                        {lesson.status === "unlocked" && (
                          <span className="tag tag-unlocked">Ready</span>
                        )}
                        {lesson.status === "locked" && (
                          <span className="tag tag-locked">Locked</span>
                        )}
                      </div>
                    </div>

                    <div className="subscience-lesson-actions">
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          className="lesson-action-btn"
                          disabled={lesson.status === "locked"}
                          onClick={() =>
                            navigate(`/lesson/${lesson.id}`, {
                              state: { lesson, subId },
                            })
                          }
                        >
                          View Lesson
                        </button>

                        <button
                          className="secondary-btn"
                          disabled={lesson.status === "locked"}
                          onClick={() => openLessonDetails(lesson)}
                        >
                          Tutors & Sessions
                        </button>
                      </div>
                    </div>
                  </li>
                ))}

                {/* UNIT TEST */}
                <li
                  className={`subscience-lesson ${
                    allLessonsCompleted ? "unlocked" : "locked"
                  }`}
                >
                  <div className="subscience-lesson-main">
                    <div>
                      <p className="subscience-lesson-number">Final Test</p>
                      <p className="subscience-lesson-title">Unit Test</p>
                      <p className="subscience-lesson-status">
                        {allLessonsCompleted ? "Unlocked" : "Complete all lessons first"}
                      </p>
                    </div>

                    <div className="subscience-lesson-tags">
                      {allLessonsCompleted ? (
                        <span className="tag tag-unlocked">Ready</span>
                      ) : (
                        <span className="tag tag-locked">Locked</span>
                      )}
                    </div>
                  </div>

                    <div className="subscience-lesson-actions">
                    <button
                      className="lesson-action-btn"
                      disabled={!allLessonsCompleted}
                      onClick={() => navigate(`/unit-test/${subId}`)}
                    >
                      Start Unit Test
                    </button>
                  </div>
                </li>
              </ul>
            </section>
          </div>
        )}
        {/* Lesson details modal */}
        {showLessonModal && selectedLesson && (
          <div className="modal-overlay" onClick={() => setShowLessonModal(false)}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
              <h2>Lesson {selectedLesson.lesson_number}: {selectedLesson.title}</h2>
              <p className="muted">Pick a tutor or join an upcoming session.</p>

              <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
                <div style={{ flex: 1 }}>
                  <h3>Tutors</h3>
                  {lessonTutors.length === 0 ? (
                    <p className="muted">No tutors listed for this lesson.</p>
                  ) : (
                    <ul>
                      {lessonTutors.map((t) => (
                        <li key={t.id} style={{ marginBottom: 8 }}>
                          <strong>{t.name}</strong>
                          <p className="muted">{t.bio}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <h3>Upcoming Sessions</h3>
                  {lessonSessions.length === 0 ? (
                    <p className="muted">No sessions scheduled yet.</p>
                  ) : (
                    <ul>
                      {lessonSessions.map((s) => (
                        <li key={s.id} style={{ marginBottom: 10 }}>
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div>
                              <p><strong>{new Date(s.session_time).toLocaleString()}</strong></p>
                              <p className="muted">Tutor: {s.tutor_name || s.tutorName}</p>
                              <p className="muted">Spots: {s.spots_left ?? (s.max_spots - (s.signed_up || 0))} / {s.max_spots}</p>
                            </div>

                            <div style={{ alignSelf: "center" }}>
                              <button
                                className="primary-btn"
                                disabled={signupProcessing || (s.spots_left === 0)}
                                onClick={() => handleSignupToSession(s)}
                              >
                                Join
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div style={{ marginTop: 16, textAlign: "right" }}>
                <button className="btn" onClick={() => setShowLessonModal(false)}>Close</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default SubscienceUnit;
