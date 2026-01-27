// src/pages/Schedule.js
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { bookTutoringSession, logActivity, checkAndUnlockAchievements } from "../utils/storageManager";

const tutors = [
  {
    id: "t1",
    name: "Dr. Rivera",
    subject: "Biology",
    description: "Cell biology and genetics, great for visual learners.",
  },
  {
    id: "t2",
    name: "Mr. Chen",
    subject: "Physics",
    description: "Mechanics, forces, and problem-solving strategies.",
  },
  {
    id: "t3",
    name: "Ms. Lopez",
    subject: "Economics",
    description: "Micro & macro foundations made simple.",
  },
];

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Schedule({ onBookSession }) {
  const query = useQuery();
  const preselectedSubject = query.get("subject");

  const [selectedTutor, setSelectedTutor] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const filteredTutors = preselectedSubject
    ? tutors.filter(
        (t) => t.subject.toLowerCase() === preselectedSubject.toLowerCase()
      )
    : tutors;

  function handleSubmit(e) {
    e.preventDefault();
    
    // Get current user from localStorage
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user || !user.id) {
      setErrorMessage("Please log in to book a session");
      return;
    }

    const tutor = tutors.find((t) => t.id === selectedTutor);
    if (!tutor || !date || !time) {
      setErrorMessage("Please fill in all fields");
      return;
    }

    const session = {
      tutorId: tutor.id,
      tutorName: tutor.name,
      subject: tutor.subject,
      date,
      time,
      sessionTime: new Date(`${date}T${time}`).toISOString(),
      meetLink: "https://meet.google.com/kgc-xqnu-dym",
    };

    try {
      // Save session to localStorage using storageManager
      bookTutoringSession(user.id, session);
      
      // Log activity
      logActivity(user.id, {
        type: "Session Booked",
        description: `Booked a ${session.subject} session with ${session.tutorName}`,
        subject: session.subject,
      });

      // Check for achievement unlocks
      const newlyUnlocked = checkAndUnlockAchievements(user.id);
      if (newlyUnlocked.length > 0) {
        console.log(`🏆 ${newlyUnlocked.length} achievement(s) unlocked!`);
      }

      // Show success message
      setSuccessMessage(`✅ Session booked with ${tutor.name} on ${date} at ${time}!`);
      setErrorMessage("");
      
      // Reset form
      setSelectedTutor("");
      setDate("");
      setTime("");
      
      // Dispatch event to update dashboard
      window.dispatchEvent(new CustomEvent("dashboardStorageChange"));
      
      // Call parent callback if provided
      if (onBookSession) {
        onBookSession(session);
      }

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("❌ Error booking session:", error);
      setErrorMessage("Error booking session. Please try again.");
    }
  }

  return (
    <section className="schedule-page fade-in">
      <h1>Book a Tutoring Session</h1>
      <p className="subtitle">
        Choose a tutor, pick a time, and your Zoom session will be saved on your dashboard.
      </p>

      {successMessage && (
        <div style={{
          background: "rgba(34, 197, 94, 0.1)",
          border: "1px solid rgba(34, 197, 94, 0.3)",
          color: "#22c55e",
          padding: "1rem",
          borderRadius: "8px",
          marginBottom: "1rem",
          textAlign: "center"
        }}>
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div style={{
          background: "rgba(239, 68, 68, 0.1)",
          border: "1px solid rgba(239, 68, 68, 0.3)",
          color: "#ef4444",
          padding: "1rem",
          borderRadius: "8px",
          marginBottom: "1rem",
          textAlign: "center"
        }}>
          {errorMessage}
        </div>
      )}

      <div className="schedule-layout">
        <div className="card">
          <h2>Our Tutors</h2>
          <ul className="tutor-list">
            {filteredTutors.map((t) => (
              <li key={t.id} className="tutor-item">
                <h3>{t.name}</h3>
                <p className="tutor-subject">{t.subject}</p>
                <p className="tutor-description">{t.description}</p>
              </li>
            ))}
          </ul>
        </div>

        <form className="card" onSubmit={handleSubmit}>
          <h2>Schedule your session</h2>

          <label className="field">
            <span>Select a tutor</span>
            <select
              value={selectedTutor}
              onChange={(e) => setSelectedTutor(e.target.value)}
            >
              <option value="">Choose...</option>
              {filteredTutors.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} · {t.subject}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Date</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>

          <label className="field">
            <span>Time</span>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </label>

          <button className="btn primary" type="submit">
            Save session
          </button>
        </form>
      </div>
    </section>
  );
}

export default Schedule;
