// src/pages/WorksheetAnalysis.js
import React from "react";
import { useNavigate } from "react-router-dom";

function WorksheetAnalysis({ result, onLessonFromWorksheet }) {
  const navigate = useNavigate();

  if (!result) {
    return (
      <section className="worksheet-analysis-page fade-in">
        <p className="muted">
          No worksheet submitted yet. Complete a worksheet to see your analysis.
        </p>
      </section>
    );
  }

  function handleBook() {
    navigate(`/schedule?subject=${result.recommendedTutorSubject}`);
  }

  function handleStartLesson() {
    if (onLessonFromWorksheet) {
      onLessonFromWorksheet({
        subject: result.topic,
        title: `Worksheet follow-up lesson (${result.topic})`,
      });
    }
    navigate("/resources");
  }

  return (
    <section className="worksheet-analysis-page fade-in">
      <h1>Worksheet Analysis</h1>
      <p className="subtitle">
        Here’s what you did well and what you can review with a tutor.
      </p>

      <div className="card">
        <h2>Score: {result.score}%</h2>

        <h3>Strengths</h3>
        <ul>
          {result.strengths.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>

        <h3>Areas to improve</h3>
        <ul>
          {result.improvements.map((i, idx) => (
            <li key={idx}>{i}</li>
          ))}
        </ul>

        <div className="analysis-actions">
          <button className="btn primary" onClick={handleBook}>
            Book a session with a tutor →
          </button>
          <button className="btn" onClick={handleStartLesson}>
            Start a follow-up lesson
          </button>
        </div>
      </div>
    </section>
  );
}

export default WorksheetAnalysis;

