import React, { useState } from "react";

function QuizGame({ gameData, onComplete, onExit }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [startTime] = useState(Date.now());

  const questions = gameData.questions || [];

  if (!questions.length) {
    return <div style={{ color: "white" }}>No questions available</div>;
  }

  const question = questions[currentQuestion];

  const handleAnswerSelect = (answer) => {
    if (answered) return;

    const correct = answer === question.correct;
    setSelectedAnswer(answer);
    setIsCorrect(correct);
    setAnswered(true);

    if (correct) {
      setScore(score + 10);
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
      const finalScore = Math.max(50, Math.min(100, score + Math.floor(50 - timeTaken / 60)));
      onComplete(finalScore);
    }
  };

  return (
    <div style={{
      padding: "40px",
      background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      borderRadius: "12px",
      minHeight: "400px",
      color: "white",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h2 style={{ margin: 0 }}>{gameData.title}</h2>
        <div style={{ display: "flex", gap: "20px", fontSize: "18px", fontWeight: "600" }}>
          <div>Score: {score}</div>
          <div>Question {currentQuestion + 1}/{questions.length}</div>
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
            }}
          >
            Exit Game
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{
        width: "100%",
        height: "8px",
        background: "rgba(255,255,255,0.2)",
        borderRadius: "4px",
        marginBottom: "30px",
        overflow: "hidden",
      }}>
        <div style={{
          width: `${((currentQuestion + 1) / questions.length) * 100}%`,
          height: "100%",
          background: "#10b981",
          transition: "width 0.3s ease",
        }}></div>
      </div>

      {/* Question */}
      <div style={{ marginBottom: "30px" }}>
        <h3 style={{ fontSize: "20px", marginTop: 0, marginBottom: "20px" }}>{question.question}</h3>

        {/* Answer Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {question.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswerSelect(option)}
              disabled={answered}
              style={{
                padding: "16px 20px",
                borderRadius: "8px",
                border: selectedAnswer === option ? "3px solid #fbbf24" : "2px solid rgba(255,255,255,0.3)",
                background:
                  selectedAnswer === option
                    ? isCorrect
                      ? "#10b981"
                      : "#ef4444"
                    : answered && option === question.correct
                    ? "#10b981"
                    : "rgba(255,255,255,0.1)",
                color: "white",
                cursor: answered ? "default" : "pointer",
                fontSize: "16px",
                fontWeight: "500",
                textAlign: "left",
                transition: "all 0.3s ease",
                opacity: answered && selectedAnswer !== option && option !== question.correct ? 0.5 : 1,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  border: "2px solid currentColor",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  {selectedAnswer === option && isCorrect && "✓"}
                  {selectedAnswer === option && !isCorrect && "✗"}
                  {answered && option === question.correct && selectedAnswer !== option && "✓"}
                </div>
                {option}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Feedback */}
      {answered && (
        <div style={{
          background: isCorrect ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)",
          border: `2px solid ${isCorrect ? "#10b981" : "#ef4444"}`,
          padding: "16px",
          borderRadius: "8px",
          marginBottom: "20px",
          fontSize: "16px",
          fontWeight: "500",
        }}>
          {isCorrect ? "🎉 Correct!" : "❌ Incorrect!"}
          {question.explanation && (
            <p style={{ marginTop: "10px", marginBottom: 0, fontSize: "14px" }}>
              {question.explanation}
            </p>
          )}
        </div>
      )}

      {answered && (
        <button
          onClick={handleNextQuestion}
          style={{
            padding: "12px 30px",
            borderRadius: "8px",
            border: "none",
            background: "#10b981",
            color: "white",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "600",
            width: "100%",
          }}
        >
          {currentQuestion < questions.length - 1 ? "Next Question" : "Finish Game"}
        </button>
      )}
    </div>
  );
}

export default QuizGame;
