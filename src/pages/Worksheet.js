import React, { useState, useEffect } from "react";

function Worksheet() {
  const user = JSON.parse(localStorage.getItem("user") || "null") || null;

  const [lessonId, setLessonId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  // Load worksheet questions from backend
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const lesson = params.get("lessonId");
    setLessonId(lesson);

    fetch(`http://localhost:8080/worksheets/questions/${lesson}`)
      .then((res) => res.json())
      .then((data) => setQuestions(data.questions));
  }, []);

  function handleAnswerChange(qId, value) {
    setAnswers((prev) => ({ ...prev, [qId]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("http://localhost:8080/worksheets/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        lessonId,
        answers,
      }),
    });

    const data = await res.json();
    setAnalysis(data.analysis);
    setSubmitted(true);
    setLoading(false);
  }

  if (submitted) {
    return (
      <section className="worksheet-analysis fade-in">
        <h1>Worksheet Analysis</h1>

        <div className="analysis-card">
          <h2>Score: {analysis.score}%</h2>

          <h3>Strengths</h3>
          <ul>
            {analysis.strengths.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>

          <h3>Areas to Improve</h3>
          <ul>
            {analysis.improvements.map((i, idx) => (
              <li key={idx}>{i}</li>
            ))}
          </ul>

          <button
            className="primary-btn"
            onClick={() =>
              window.location.href = `/schedule?lessonId=${lessonId}`
            }
          >
            Book a Tutor Session →
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="worksheet-page fade-in">
      <h1>Worksheet</h1>
      <p className="subtitle">Answer the questions below.</p>

      <form className="worksheet-form card" onSubmit={handleSubmit}>
        {questions.map((q) => (
          <label key={q.id} className="field">
            <span>{q.question}</span>
            <textarea
              rows={4}
              value={answers[q.id] || ""}
              onChange={(e) => handleAnswerChange(q.id, e.target.value)}
            />
          </label>
        ))}

        <button className="btn primary" type="submit" disabled={loading}>
          {loading ? "Analyzing..." : "Submit Worksheet"}
        </button>
      </form>
    </section>
  );
}

export default Worksheet;
