import React, { useState, useEffect } from "react";
import { bookTutoringSession, logActivity, checkAndUnlockAchievements } from "../utils/storageManager";

const mockTutors = [
  // Biology Tutors
  {
    id: 1,
    name: "Sarah (Student Tutor)",
    specialty: "AP Biology – cells, genetics",
    subject: "AP Biology",
    bio: "Student tutor who knows what it feels like to struggle at first. Peer-to-peer support!",
  },
  {
    id: 2,
    name: "James Wilson (Student Tutor)",
    specialty: "AP Biology – ecology, evolution",
    subject: "AP Biology",
    bio: "Student tutor passionate about evolutionary biology and helping fellow students succeed.",
  },

  // Chemistry Tutors
  {
    id: 3,
    name: "Chen (Student Tutor)",
    specialty: "AP Chemistry – reactions, atoms",
    subject: "AP Chemistry",
    bio: "Makes chemistry feel like solving puzzles instead of memorizing formulas.",
  },
  {
    id: 4,
    name: "Ahmed Hassan (Student Tutor)",
    specialty: "AP Chemistry – organic, molecular structure",
    subject: "AP Chemistry",
    bio: "Specializes in breaking down complex organic reactions into simple steps.",
  },

  // Physics Tutors
  {
    id: 5,
    name: "Patel (Student Tutor)",
    specialty: "AP Physics – forces, motion",
    subject: "AP Physics",
    bio: "Uses real-life examples to explain physics step-by-step.",
  },
  {
    id: 6,
    name: "Elena Rodriguez (Student Tutor)",
    specialty: "AP Physics – electricity, magnetism, optics",
    subject: "AP Physics",
    bio: "Passionate about making physics intuitive through demonstrations.",
  },

  // Environmental Science Tutors
  {
    id: 7,
    name: "Marcus Green (Student Tutor)",
    specialty: "AP Environmental Science – ecosystems, climate",
    subject: "AP Environmental Science",
    bio: "Combines field experience with classroom teaching for deep understanding.",
  },
  {
    id: 8,
    name: "Lisa Park (Student Tutor)",
    specialty: "AP Environmental Science – sustainability, conservation",
    subject: "AP Environmental Science",
    bio: "Advocates for practical solutions to real environmental challenges.",
  },

  // History Tutors
  {
    id: 9,
    name: "David Thompson (Student Tutor)",
    specialty: "History – world history, civilizations",
    subject: "History",
    bio: "Brings history to life through engaging narratives and primary sources.",
  },
  {
    id: 10,
    name: "Margaret Flynn (Student Tutor)",
    specialty: "History – American history, social movements",
    subject: "History",
    bio: "Expert in connecting historical events to modern-day relevance.",
  },

  // Human Geography Tutors
  {
    id: 11,
    name: "Carlos Mendez (Student Tutor)",
    specialty: "AP Human Geography – culture, societies",
    subject: "AP Human Geography",
    bio: "Explores the fascinating connections between people and places worldwide.",
  },
  {
    id: 12,
    name: "Sophie Laurent (Student Tutor)",
    specialty: "AP Human Geography – urban systems, migration",
    subject: "AP Human Geography",
    bio: "Makes geography concepts accessible and relevant to daily life.",
  },

  // Economics Tutors
  {
    id: 13,
    name: "Robert Kim (Student Tutor)",
    specialty: "Economics – microeconomics, markets",
    subject: "Economics",
    bio: "Demystifies economics with real-world examples and case studies.",
  },
  {
    id: 14,
    name: "Patricia Garcia (Student Tutor)",
    specialty: "Economics – macroeconomics, policy",
    subject: "Economics",
    bio: "Explains global economics in a way that makes sense to everyone.",
  },

  // Psychology Tutors
  {
    id: 15,
    name: "Nathan Cohen (Student Tutor)",
    specialty: "AP Psychology – cognitive science, behavior",
    subject: "AP Psychology",
    bio: "Helps students understand themselves and others through psychology.",
  },
  {
    id: 16,
    name: "Amanda Walsh (Student Tutor)",
    specialty: "AP Psychology – development, mental health",
    subject: "AP Psychology",
    bio: "Compassionate tutor who connects psychology theory to real-world applications.",
  },
];

function Tutoring({ onBookSession }) {
  const [tutors, setTutors] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [signupProcessing, setSignupProcessing] = useState(false);
  const [bookedSession, setBookedSession] = useState(null);

  useEffect(() => {
    // Load tutors and sessions from backend
    async function loadData() {
      try {
        // Fetch tutors
        const tutRes = await fetch("http://localhost:8080/tutors");
        const tutData = await tutRes.json();
        setTutors(tutData.tutors || mockTutors);

        // Fetch all sessions
        const sessRes = await fetch("http://localhost:8080/sessions");
        const sessData = await sessRes.json();
        const normalized = (sessData.sessions || []).map((ss) => ({
          ...ss,
          spots_left: ss.max_spots - (ss.signed_up_count || ss.signed_up || 0),
        }));
        setSessions(normalized);
      } catch (err) {
        console.error("Failed to load data:", err);
        setTutors(mockTutors);
      }
    }

    loadData();
  }, []);

  // Calendar helper functions
  function getDaysInMonth(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  }

  function getFirstDayOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  }

  function hasSessionOnDate(date) {
    if (!selectedTutor) return false;
    const tutorSess = sessions.filter(s => s.tutor_id === selectedTutor.id || s.tutorId === selectedTutor.id);
    return tutorSess.some(session => {
      const sessionDate = new Date(session.session_time);
      return sessionDate.getDate() === date.getDate() &&
             sessionDate.getMonth() === date.getMonth() &&
             sessionDate.getFullYear() === date.getFullYear();
    });
  }

  function getSessionsForDate(date) {
    if (!selectedTutor) return [];
    const tutorSess = sessions.filter(s => s.tutor_id === selectedTutor.id || s.tutorId === selectedTutor.id);
    return tutorSess.filter(session => {
      const sessionDate = new Date(session.session_time);
      return sessionDate.getDate() === date.getDate() &&
             sessionDate.getMonth() === date.getMonth() &&
             sessionDate.getFullYear() === date.getFullYear();
    });
  }

  async function handleSignupToSession(session) {
    const user = JSON.parse(localStorage.getItem("user") || "null") || null;
    
    if (!user) {
      alert("Please log in to book a session");
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
        body: JSON.stringify({ user_id: user.id }),
      });

      if (res.ok) {
        const data = await res.json();
        const bookedData = data.session || session;
        setBookedSession(bookedData);
        
        const subject = selectedTutor.specialty.split("–")[0].trim();
        
        try {
          // Save to localStorage using storageManager
          bookTutoringSession(user.id, {
            tutorId: selectedTutor.id,
            tutorName: selectedTutor.name,
            subject: subject,
            sessionTime: new Date(session.session_time).toISOString(),
            date: new Date(session.session_time).toLocaleDateString(),
            time: new Date(session.session_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            sessionId: bookedData.id || Date.now(),
          });

          // Log activity
          logActivity(user.id, {
            type: "Tutoring Session Booked",
            description: `Scheduled session with ${selectedTutor.name}`,
            subject: subject,
          });

          // Check for achievement unlocks
          const newlyUnlocked = checkAndUnlockAchievements(user.id);
          if (newlyUnlocked.length > 0) {
            console.log(`🏆 ${newlyUnlocked.length} achievement(s) unlocked!`);
          }

          // Dispatch event for dashboard update
          window.dispatchEvent(new CustomEvent("dashboardStorageChange"));
        } catch (error) {
          console.error("❌ Error saving tutoring session:", error);
        }

        // Call parent callback if provided
        onBookSession({
          teacher: selectedTutor.name,
          topic: selectedTutor.specialty,
          date: new Date(session.session_time).toLocaleDateString(),
          time: new Date(session.session_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          link: "booked",
        });
      } else {
        alert("Failed to book session");
      }
    } catch (err) {
      console.error("Signup error:", err);
      alert("Error booking session");
    } finally {
      setSignupProcessing(false);
    }
  }

  return (
    <section className="page fade-in">
      <h1 className="slide-up">Choose Your Student Tutor & Book a Session</h1>
      <p className="slide-up" style={{ maxWidth: "700px" }}>
        Pick the student tutor whose style fits you best, then select an available time slot. All tutors are fellow students ready to help you succeed!
      </p>

      <div className="tutoring-container-main slide-up">
        {/* Tutors Selection */}
        <div className="tutors-list-main">
          <h3>Available Student Tutors</h3>
          {tutors.length === 0 ? (
            <p className="muted">Loading student tutors...</p>
          ) : (
            tutors.map((tutor) => {
              const isSelected = selectedTutor?.id === tutor.id;
              return (
                <div
                  key={tutor.id}
                  className={`tutor-card-main ${isSelected ? "selected" : ""}`}
                  onClick={() => setSelectedTutor(isSelected ? null : tutor)}
                >
                  <div className="tutor-header">
                    <div className="tutor-avatar-main">{tutor.name.charAt(0).toUpperCase()}</div>
                    <div className="tutor-info-main">
                      <h3>{tutor.name}</h3>
                      <p className="tutor-specialty">{tutor.specialty}</p>
                      <p className="tutor-bio-main">{tutor.bio}</p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Calendar View */}
        {selectedTutor && (
          <div className="calendar-section-main">
            <div className="calendar-header">
              <button 
                className="calendar-nav-btn"
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
              >
                ← Prev
              </button>
              <h3>{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
              <button 
                className="calendar-nav-btn"
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
              >
                Next →
              </button>
            </div>

            <div className="calendar-grid">
              <div className="weekdays">
                <div className="weekday">Sun</div>
                <div className="weekday">Mon</div>
                <div className="weekday">Tue</div>
                <div className="weekday">Wed</div>
                <div className="weekday">Thu</div>
                <div className="weekday">Fri</div>
                <div className="weekday">Sat</div>
              </div>
              <div className="days">
                {Array(getFirstDayOfMonth(currentMonth)).fill(null).map((_, i) => (
                  <div key={`empty-${i}`} className="day empty"></div>
                ))}
                {Array(getDaysInMonth(currentMonth)).fill(null).map((_, i) => {
                  const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i + 1);
                  const hasSession = hasSessionOnDate(date);
                  const isToday = date.toDateString() === new Date().toDateString();
                  const isSelected = selectedDate?.toDateString() === date.toDateString();

                  return (
                    <div
                      key={i + 1}
                      className={`day ${hasSession ? "has-session" : ""} ${isToday ? "today" : ""} ${isSelected ? "selected" : ""}`}
                      onClick={() => hasSession && setSelectedDate(isSelected ? null : date)}
                      style={{ cursor: hasSession ? 'pointer' : 'default' }}
                    >
                      {i + 1}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sessions for Selected Date */}
            {selectedDate && (
              <div className="sessions-for-date">
                <h4>Available Times - {selectedDate.toLocaleDateString()}</h4>
                {getSessionsForDate(selectedDate).length === 0 ? (
                  <p className="muted">No sessions on this date.</p>
                ) : (
                  <div className="sessions-grid">
                    {getSessionsForDate(selectedDate).map((session) => (
                      <div key={session.id} className="session-card">
                        <div className="session-time">
                          <strong>{new Date(session.session_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</strong>
                        </div>
                        <div className="session-info">
                          <span className="spots-badge">
                            {session.spots_left > 0 ? `${session.spots_left} spots left` : "Full"}
                          </span>
                        </div>
                        <button
                          className="book-btn"
                          disabled={signupProcessing || session.spots_left === 0 || bookedSession}
                          onClick={() => handleSignupToSession(session)}
                        >
                          {signupProcessing ? "Booking..." : bookedSession ? "Booked" : "Book Now"}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {bookedSession && (
              <div className="booked-confirmation">
                <h3>✓ Session Booked!</h3>
                <p className="booked-tutor">Student Tutor: {selectedTutor.name}</p>
                <p className="booked-time">Time: {new Date(bookedSession.session_time).toLocaleString()}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default Tutoring;

