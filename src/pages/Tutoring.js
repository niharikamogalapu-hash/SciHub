import React, { useState, useEffect } from "react";

const mockTutors = [
  // Biology Tutors
  {
    id: 1,
    name: "Sarah (Peer Tutor)",
    specialty: "Biology – cells, genetics",
    subject: "Biology",
    bio: "Student tutor who knows what it feels like to struggle at first.",
  },
  {
    id: 2,
    name: "Dr. James Wilson",
    specialty: "Biology – ecology, evolution",
    subject: "Biology",
    bio: "PhD in evolutionary biology with 8 years of teaching experience.",
  },

  // Chemistry Tutors
  {
    id: 3,
    name: "Ms. Chen",
    specialty: "Chemistry – reactions, atoms",
    subject: "Chemistry",
    bio: "Makes chemistry feel like solving puzzles instead of memorizing formulas.",
  },
  {
    id: 4,
    name: "Prof. Ahmed Hassan",
    specialty: "Chemistry – organic, molecular structure",
    subject: "Chemistry",
    bio: "Specializes in breaking down complex organic reactions into simple steps.",
  },

  // Physics Tutors
  {
    id: 5,
    name: "Mr. Patel",
    specialty: "Physics – forces, motion",
    subject: "Physics",
    bio: "Uses real-life examples to explain physics step-by-step.",
  },
  {
    id: 6,
    name: "Elena Rodriguez",
    specialty: "Physics – electricity, magnetism, optics",
    subject: "Physics",
    bio: "Passionate about making physics intuitive through demonstrations.",
  },

  // Environmental Science Tutors
  {
    id: 7,
    name: "Marcus Green",
    specialty: "Environmental Science – ecosystems, climate",
    subject: "Environmental Science",
    bio: "Combines field experience with classroom teaching for deep understanding.",
  },
  {
    id: 8,
    name: "Dr. Lisa Park",
    specialty: "Environmental Science – sustainability, conservation",
    subject: "Environmental Science",
    bio: "Advocates for practical solutions to real environmental challenges.",
  },

  // History Tutors
  {
    id: 9,
    name: "Mr. David Thompson",
    specialty: "History – world history, civilizations",
    subject: "History",
    bio: "Brings history to life through engaging narratives and primary sources.",
  },
  {
    id: 10,
    name: "Professor Margaret Flynn",
    specialty: "History – American history, social movements",
    subject: "History",
    bio: "Expert in connecting historical events to modern-day relevance.",
  },

  // Human Geography Tutors
  {
    id: 11,
    name: "Carlos Mendez",
    specialty: "Human Geography – culture, societies",
    subject: "Human Geography",
    bio: "Explores the fascinating connections between people and places worldwide.",
  },
  {
    id: 12,
    name: "Sophie Laurent",
    specialty: "Human Geography – urban systems, migration",
    subject: "Human Geography",
    bio: "Makes geography concepts accessible and relevant to daily life.",
  },

  // Economics Tutors
  {
    id: 13,
    name: "Mr. Robert Kim",
    specialty: "Economics – microeconomics, markets",
    subject: "Economics",
    bio: "Demystifies economics with real-world examples and case studies.",
  },
  {
    id: 14,
    name: "Dr. Patricia Garcia",
    specialty: "Economics – macroeconomics, policy",
    subject: "Economics",
    bio: "Explains global economics in a way that makes sense to everyone.",
  },

  // Psychology Tutors
  {
    id: 15,
    name: "Dr. Nathan Cohen",
    specialty: "Psychology – cognitive science, behavior",
    subject: "Psychology",
    bio: "Helps students understand themselves and others through psychology.",
  },
  {
    id: 16,
    name: "Dr. Amanda Walsh",
    specialty: "Psychology – development, mental health",
    subject: "Psychology",
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
        
        onBookSession({
          teacher: selectedTutor.name,
          topic: selectedTutor.specialty,
          date: new Date(session.session_time).toLocaleDateString(),
          time: new Date(session.session_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          link: "booked",
        });

        // Dispatch dashboard update event
        const sessionData = {
          id: bookedData.id || Date.now(),
          subject: selectedTutor.specialty.split("–")[0].trim(),
          tutorName: selectedTutor.name,
          session_time: session.session_time,
        };

        const activity = {
          id: Date.now(),
          type: "Tutoring Booked",
          description: `Scheduled session with ${selectedTutor.name}`,
          subject: selectedTutor.specialty.split("–")[0].trim(),
          created_at: new Date(),
        };

        window.dispatchEvent(new CustomEvent("dashboardUpdate", {
          detail: {
            type: "tutoringBooked",
            activity,
            session: sessionData,
          }
        }));
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
      <h1 className="slide-up">Choose Your Tutor & Book a Session</h1>
      <p className="slide-up" style={{ maxWidth: "700px" }}>
        Pick the teacher or tutor whose style fits you best, then select an available time slot.
      </p>

      <div className="tutoring-container-main slide-up">
        {/* Tutors Selection */}
        <div className="tutors-list-main">
          <h3>Available Tutors</h3>
          {tutors.length === 0 ? (
            <p className="muted">Loading tutors...</p>
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
                <p className="booked-tutor">Tutor: {selectedTutor.name}</p>
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

