// Mock sessions for each tutor (at least one per tutor in current month)
const mockSessions = Array.from({ length: 16 }, (_, i) => {
  const tutorId = i + 1;
  const today = new Date();
  const sessionDate = new Date(today.getFullYear(), today.getMonth(), Math.max(2, i + 1));
  return {
    id: 100 + tutorId,
    tutor_id: tutorId,
    session_time: sessionDate.toISOString(),
    max_spots: 5,
    signed_up_count: 0,
    spots_left: 5,
  };
});
import React, { useState, useEffect } from "react";
import { bookTutoringSession, logActivity, checkAndUnlockAchievements } from "../utils/storageManager";

const mockTutors = [
  {
    id: 1,
    name: "Sarah Kim",
    specialty: "AP Biology – Genetics, Cells",
    subject: "AP Biology",
    bio: "Sarah is a senior who loves helping students master biology concepts. She’s patient and explains things step-by-step.",
  },
  {
    id: 2,
    name: "James Wilson",
    specialty: "AP Biology – Ecology, Evolution",
    subject: "AP Biology",
    bio: "James is passionate about evolutionary biology and enjoys making learning fun with real-world examples.",
  },
  {
    id: 3,
    name: "Chen Liu",
    specialty: "AP Chemistry – Reactions, Atoms",
    subject: "AP Chemistry",
    bio: "Chen makes chemistry feel like solving puzzles and helps students build strong foundations.",
  },
  {
    id: 4,
    name: "Ahmed Hassan",
    specialty: "AP Chemistry – Organic, Molecular Structure",
    subject: "AP Chemistry",
    bio: "Ahmed specializes in breaking down complex organic reactions into simple steps for easy understanding.",
  },
  {
    id: 5,
    name: "Priya Patel",
    specialty: "AP Physics – Forces, Motion",
    subject: "AP Physics",
    bio: "Priya uses real-life examples to explain physics and helps students see the connections to everyday life.",
  },
  {
    id: 6,
    name: "Elena Rodriguez",
    specialty: "AP Physics – Electricity, Magnetism, Optics",
    subject: "AP Physics",
    bio: "Elena is passionate about making physics intuitive through hands-on demonstrations and clear explanations.",
  },
  {
    id: 7,
    name: "Marcus Green",
    specialty: "AP Environmental Science – Ecosystems, Climate",
    subject: "AP Environmental Science",
    bio: "Marcus combines field experience with classroom teaching for a deep understanding of environmental science.",
  },
  {
    id: 8,
    name: "Lisa Park",
    specialty: "AP Environmental Science – Sustainability, Conservation",
    subject: "AP Environmental Science",
    bio: "Lisa advocates for practical solutions to real environmental challenges and inspires students to take action.",
  },
  {
    id: 9,
    name: "David Thompson",
    specialty: "History – World History, Civilizations",
    subject: "History",
    bio: "David brings history to life through engaging stories and primary sources, making the past relevant today.",
  },
  {
    id: 10,
    name: "Margaret Flynn",
    specialty: "History – American History, Social Movements",
    subject: "History",
    bio: "Margaret connects historical events to modern-day issues and encourages critical thinking.",
  },
  {
    id: 11,
    name: "Carlos Mendez",
    specialty: "AP Human Geography – Culture, Societies",
    subject: "AP Human Geography",
    bio: "Carlos explores the connections between people and places, making geography concepts accessible.",
  },
  {
    id: 12,
    name: "Sophie Laurent",
    specialty: "AP Human Geography – Urban Systems, Migration",
    subject: "AP Human Geography",
    bio: "Sophie makes geography relevant to daily life and helps students understand global patterns.",
  },
  {
    id: 13,
    name: "Robert Kim",
    specialty: "Economics – Microeconomics, Markets",
    subject: "Economics",
    bio: "Robert demystifies economics with real-world examples and case studies for practical understanding.",
  },
  {
    id: 14,
    name: "Patricia Garcia",
    specialty: "Economics – Macroeconomics, Policy",
    subject: "Economics",
    bio: "Patricia explains global economics in a way that makes sense to everyone and encourages curiosity.",
  },
  {
    id: 15,
    name: "Nathan Cohen",
    specialty: "AP Psychology – Cognitive Science, Behavior",
    subject: "AP Psychology",
    bio: "Nathan helps students understand themselves and others through psychology and interactive activities.",
  },
  {
    id: 16,
    name: "Amanda Walsh",
    specialty: "AP Psychology – Development, Mental Health",
    subject: "AP Psychology",
    bio: "Amanda connects psychology theory to real-world applications and supports students’ well-being.",
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
        let normalized = (sessData.sessions || []).map((ss) => ({
          ...ss,
          spots_left: ss.max_spots - (ss.signed_up_count || ss.signed_up || 0),
        }));
        // If no sessions from backend, use mockSessions
        if (!normalized || normalized.length === 0) {
          normalized = mockSessions;
        }
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

