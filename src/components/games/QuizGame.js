import React, { useState } from "react";

function QuizGame({ gameData, onComplete, onExit }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [startTime] = useState(Date.now());
  const [answerHistory, setAnswerHistory] = useState([]);

  const questions = gameData.questions || [];

  if (!questions.length) {
    return <div style={{ color: "white", textAlign: "center", padding: "40px" }}>No questions available</div>;
  }

  const question = questions[currentQuestion];

  const handleAnswerSelect = (answer, answerIndex) => {
    if (answered) return;

    const correct = answerIndex === question.correct;
    setSelectedAnswer(answer);
    setIsCorrect(correct);
    setAnswered(true);

    if (correct) {
      setScore(score + 10);
      setAnswerHistory([...answerHistory, true]);
    } else {
      setAnswerHistory([...answerHistory, false]);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setAnswered(false);
      setSelectedAnswer(null);
      setIsCorrect(null);
    } else {
      // Game over
      const timeTaken = (Date.now() - startTime) / 1000;
      const timeBonus = Math.max(0, Math.floor(30 - timeTaken / 30));
      const finalScore = Math.max(50, Math.min(100, score + timeBonus));
      onComplete(finalScore);
    }
  };

  const correctCount = answerHistory.filter(Boolean).length;
  const accuracy = answerHistory.length > 0 ? Math.round((correctCount / answerHistory.length) * 100) : 0;

  return (
    <div style={{
      padding: "40px",
      background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      borderRadius: "12px",
      minHeight: "500px",
      color: "white",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", flexWrap: "wrap", gap: "20px" }}>
        <div>
          <h2 style={{ margin: "0 0 8px 0", fontSize: "24px" }}>{gameData.title}</h2>
          <p style={{ margin: 0, fontSize: "14px", opacity: 0.9 }}>Test your knowledge on this topic!</p>
        </div>
        <div style={{ display: "flex", gap: "20px", fontSize: "16px", fontWeight: "600" }}>
          <div style={{ background: "rgba(0,0,0,0.2)", padding: "12px 16px", borderRadius: "8px" }}>
            <div style={{ fontSize: "12px", opacity: 0.8 }}>Score</div>
            <div style={{ fontSize: "20px" }}>{score}</div>
          </div>
          <div style={{ background: "rgba(0,0,0,0.2)", padding: "12px 16px", borderRadius: "8px" }}>
            <div style={{ fontSize: "12px", opacity: 0.8 }}>Question</div>
            <div style={{ fontSize: "20px" }}>{currentQuestion + 1}/{questions.length}</div>
          </div>
          {answerHistory.length > 0 && (
            <div style={{ background: "rgba(0,0,0,0.2)", padding: "12px 16px", borderRadius: "8px" }}>
              <div style={{ fontSize: "12px", opacity: 0.8 }}>Accuracy</div>
              <div style={{ fontSize: "20px" }}>{accuracy}%</div>
            </div>
          )}
          <button
            onClick={onExit}
            style={{
              padding: "8px 16px",
              borderRadius: "6px",
              border: "none",
              background: "#ef4444",
              color: "white",
              cursor: "pointer",
              fontWeight: "600",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => e.target.style.background = "#dc2626"}
            onMouseLeave={(e) => e.target.style.background = "#ef4444"}
          >
            Exit
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{
        width: "100%",
        height: "10px",
        background: "rgba(255,255,255,0.15)",
        borderRadius: "6px",
        marginBottom: "30px",
        overflow: "hidden",
      }}>
        <div style={{
          width: `${((currentQuestion + 1) / questions.length) * 100}%`,
          height: "100%",
          background: "linear-gradient(90deg, #10b981 0%, #38bdf8 100%)",
          transition: "width 0.4s ease",
        }}></div>
      </div>

      {/* Question */}
      <div style={{ marginBottom: "30px", animation: "slideUp 0.3s ease-out" }}>
        <h3 style={{ fontSize: "22px", marginTop: 0, marginBottom: "25px", fontWeight: "600" }}>
          {question.question}
        </h3>

        {/* Answer Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {question.options.map((option, idx) => {
            const isSelected = selectedAnswer === option;
            const isCorrectOption = option === question.correct;
            const shouldShowCorrect = answered && isCorrectOption && !isSelected;

            return (
              <button
                key={idx}
                onClick={() => handleAnswerSelect(option, idx)}
                disabled={answered}
                style={{
                  padding: "16px 20px",
                  borderRadius: "10px",
                  border: isSelected ? "3px solid #fbbf24" : "2px solid rgba(255,255,255,0.3)",
                  background:
                    isSelected
                      ? isCorrect
                        ? "rgba(16, 185, 129, 0.3)"
                        : "rgba(239, 68, 68, 0.3)"
                      : shouldShowCorrect
                      ? "rgba(16, 185, 129, 0.3)"
                      : "rgba(255,255,255,0.08)",
                  color: "white",
                  cursor: answered ? "default" : "pointer",
                  fontSize: "16px",
                  fontWeight: "500",
                  textAlign: "left",
                  transition: "all 0.3s ease",
                  opacity: answered && !isSelected && !isCorrectOption ? 0.5 : 1,
                  transform: isSelected ? "translateX(8px)" : "translateX(0)",
                }}
                onMouseEnter={(e) => {
                  if (!answered) {
                    e.target.style.background = "rgba(255,255,255,0.15)";
                    e.target.style.transform = "translateX(8px)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!answered) {
                    e.target.style.background = "rgba(255,255,255,0.08)";
                    e.target.style.transform = "translateX(0)";
                  }
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    border: "2px solid currentColor",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "14px",
                    fontWeight: "bold",
                    flexShrink: 0,
                  }}>
                    {isSelected && isCorrect && "✓"}
                    {isSelected && !isCorrect && "✗"}
                    {shouldShowCorrect && "✓"}
                    {!isSelected && !shouldShowCorrect && String.fromCharCode(65 + idx)}
                  </div>
                  <span>{option}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback */}
      {answered && (
        <div style={{
          background: isCorrect ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)",
          border: `2px solid ${isCorrect ? "#10b981" : "#ef4444"}`,
          padding: "18px",
          borderRadius: "10px",
          marginBottom: "20px",
          fontSize: "16px",
          fontWeight: "500",
          animation: "slideUp 0.3s ease-out",
        }}>
          <div style={{ marginBottom: "12px" }}>
            {isCorrect ? "🎉 Correct Answer!" : "❌ Incorrect!"}
          </div>
          {question.explanation && (
            <p style={{ marginTop: "0", marginBottom: 0, fontSize: "14px", lineHeight: "1.5", opacity: 0.95 }}>
              <strong>Explanation:</strong> {question.explanation}
            </p>
          )}
        </div>
      )}

      {answered && (
        <button
          onClick={handleNextQuestion}
          style={{
            padding: "14px 40px",
            borderRadius: "10px",
            border: "none",
            background: "#10b981",
            color: "white",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "600",
            width: "100%",
            transition: "background 0.2s",
            animation: "slideUp 0.3s ease-out",
          }}
          onMouseEnter={(e) => e.target.style.background = "#059669"}
          onMouseLeave={(e) => e.target.style.background = "#10b981"}
        >
          {currentQuestion < questions.length - 1 ? "Next Question →" : "🏆 Finish Quiz"}
        </button>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default QuizGame;
