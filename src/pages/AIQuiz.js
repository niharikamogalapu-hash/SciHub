import React, { useState } from "react";

const topics = {
  chemistry: [
    { q: "What is the charge of an electron?", a: "Negative" },
    { q: "What is H2O?", a: "Water" },
  ],
  physics: [
    { q: "What force pulls objects to Earth?", a: "Gravity" },
    { q: "What is the speed of light?", a: "3×10^8 m/s" },
  ],
  biology: [
    { q: "What organ pumps blood?", a: "Heart" },
    { q: "What is DNA?", a: "Genetic material" },
  ],
};

function AIQuiz() {
  const [topic, setTopic] = useState("");
  const [quiz, setQuiz] = useState([]);

  function generateQuiz() {
    if (!topic) return;
    const selected = topics[topic];
    const random = selected.sort(() => 0.5 - Math.random()).slice(0, 2);
    setQuiz(random);
  }

  return (
    <section className="page fade-in">
      <h1 className="slide-up">AI‑Powered Quiz Generator</h1>

      <div className="card slide-up">
        <label>
          Choose a topic:
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            style={{ marginTop: "0.5rem" }}
          >
            <option value="">Select…</option>
            <option value="chemistry">Chemistry</option>
            <option value="physics">Physics</option>
            <option value="biology">Biology</option>
          </select>
        </label>

        <button className="primary-btn" onClick={generateQuiz} style={{ marginTop: "1rem" }}>
          Generate Quiz
        </button>
      </div>

      {quiz.length > 0 && (
        <div className="card slide-up" style={{ marginTop: "1.5rem" }}>
          <h2>Your Quiz</h2>
          {quiz.map((q, i) => (
            <p key={i}>
              <strong>Q:</strong> {q.q} <br />
              <strong>A:</strong> {q.a}
            </p>
          ))}
        </div>
      )}
    </section>
  );
}

export default AIQuiz;
