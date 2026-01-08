import React, { useState, useEffect } from "react";

function PuzzleGame({ gameData, onComplete, onExit }) {
  const [sequence, setSequence] = useState([]);
  const [selectedIndices, setSelectedIndices] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [startTime] = useState(Date.now());
  const [feedback, setFeedback] = useState("");
  const [mistakes, setMistakes] = useState(0);

  useEffect(() => {
    if (gameData.items) {
      // Shuffle items
      const shuffled = [...gameData.items].sort(() => Math.random() - 0.5);
      setSequence(shuffled);
    }
  }, [gameData]);

  const handleSelectItem = (index) => {
    if (gameOver) return;

    // Check if this is the correct next item
    const clickedItem = sequence[index];

    if (clickedItem.order === selectedIndices.length + 1) {
      // Correct!
      setSelectedIndices([...selectedIndices, index]);
      setScore(score + 10);
      setFeedback("✅ Correct!");

      if (selectedIndices.length + 1 === gameData.items.length) {
        setTimeout(() => setGameOver(true), 600);
      }

      setTimeout(() => setFeedback(""), 800);
    } else {
      // Wrong! Reset
      setMistakes(mistakes + 1);
      setSelectedIndices([]);
      setScore(Math.max(0, score - 5));
      setFeedback("❌ Wrong order! Try again from the beginning.");
      setTimeout(() => setFeedback(""), 1500);
    }
  };

  const handleComplete = () => {
    const timeTaken = (Date.now() - startTime) / 1000;
    const timeBonus = Math.max(0, Math.floor(30 - timeTaken / 10));
    const mistakeDeduction = Math.max(0, mistakes * 2);
    const finalScore = Math.max(50, Math.min(100, score + timeBonus - mistakeDeduction));
    onComplete(finalScore);
  };

  if (!sequence.length) return <div style={{ color: "white", textAlign: "center", padding: "40px" }}>Loading game...</div>;

  return (
    <div style={{
      padding: "40px",
      background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      borderRadius: "12px",
      minHeight: "600px",
      color: "white",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", flexWrap: "wrap", gap: "20px" }}>
        <div>
          <h2 style={{ margin: "0 0 8px 0", fontSize: "24px" }}>{gameData.title}</h2>
          <p style={{ margin: 0, fontSize: "14px", opacity: 0.9 }}>Click items in the correct order!</p>
        </div>
        <div style={{ display: "flex", gap: "20px", fontSize: "16px", fontWeight: "600" }}>
          <div style={{ background: "rgba(0,0,0,0.2)", padding: "12px 16px", borderRadius: "8px" }}>
            <div style={{ fontSize: "12px", opacity: 0.8 }}>Score</div>
            <div style={{ fontSize: "20px" }}>{score}</div>
          </div>
          <div style={{ background: "rgba(0,0,0,0.2)", padding: "12px 16px", borderRadius: "8px" }}>
            <div style={{ fontSize: "12px", opacity: 0.8 }}>Progress</div>
            <div style={{ fontSize: "20px" }}>{selectedIndices.length}/{gameData.items.length}</div>
          </div>
          <div style={{ background: "rgba(0,0,0,0.2)", padding: "12px 16px", borderRadius: "8px" }}>
            <div style={{ fontSize: "12px", opacity: 0.8 }}>Mistakes</div>
            <div style={{ fontSize: "20px" }}>{mistakes}</div>
          </div>
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

      {feedback && (
        <div style={{
          textAlign: "center",
          fontSize: "18px",
          fontWeight: "600",
          marginBottom: "20px",
          animation: "fadeInOut 1.5s ease-in-out",
        }}>
          {feedback}
        </div>
      )}

      {/* Correct Sequence Display */}
      {selectedIndices.length > 0 && (
        <div style={{
          background: "rgba(0,0,0,0.2)",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "30px",
          animation: "slideUp 0.3s ease-out",
        }}>
          <p style={{ margin: "0 0 15px 0", fontSize: "14px", opacity: 0.9, fontWeight: "600" }}>✅ Correct Sequence So Far:</p>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {selectedIndices.map((idx, order) => (
              <div
                key={order}
                style={{
                  padding: "12px 16px",
                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                }}
              >
                <span style={{ background: "rgba(0,0,0,0.3)", borderRadius: "50%", width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {order + 1}
                </span>
                {sequence[idx].label}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Items to Sort */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: "14px",
        marginBottom: "30px",
      }}>
        {sequence.map((item, idx) => {
          const isSelected = selectedIndices.includes(idx);
          const isNextCorrect = item.order === selectedIndices.length + 1;

          return (
            <button
              key={idx}
              onClick={() => handleSelectItem(idx)}
              disabled={isSelected || gameOver}
              style={{
                padding: "20px",
                borderRadius: "10px",
                border: isNextCorrect && !isSelected ? "3px solid #fbbf24" : "2px solid rgba(255,255,255,0.3)",
                background: isSelected ? "rgba(16, 185, 129, 0.3)" : isNextCorrect && !gameOver ? "rgba(251, 191, 36, 0.15)" : "rgba(255,255,255,0.08)",
                color: "white",
                cursor: isSelected || gameOver ? "default" : "pointer",
                fontSize: "15px",
                fontWeight: "600",
                textAlign: "center",
                transition: "all 0.3s ease",
                opacity: isSelected ? 0.6 : 1,
                minHeight: "70px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: "8px",
                transform: isNextCorrect && !isSelected ? "scale(1.02)" : "scale(1)",
                boxShadow: isNextCorrect && !isSelected ? "0 6px 20px rgba(251, 191, 36, 0.3)" : "none",
              }}
              onMouseEnter={(e) => {
                if (!isSelected && !gameOver) {
                  e.target.style.transform = isNextCorrect ? "scale(1.08)" : "scale(1.05)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.target.style.transform = isNextCorrect ? "scale(1.02)" : "scale(1)";
                }
              }}
            >
              <div style={{ fontSize: "24px" }}>
                {isSelected ? "✅" : isNextCorrect ? "👆" : ""}
              </div>
              {item.label}
            </button>
          );
        })}
      </div>

      {gameOver && (
        <div style={{
          background: "rgba(0,0,0,0.3)",
          padding: "40px 30px",
          borderRadius: "12px",
          textAlign: "center",
          animation: "slideUp 0.5s ease-out",
        }}>
          <h3 style={{ fontSize: "32px", marginTop: 0, marginBottom: "10px" }}>🎉 Perfect!</h3>
          <p style={{ fontSize: "18px", marginBottom: "8px", opacity: 0.9 }}>You completed the puzzle in the correct order!</p>
          <p style={{ fontSize: "16px", marginBottom: "8px", opacity: 0.8 }}>Final Score: {score}/100</p>
          {mistakes > 0 && (
            <p style={{ fontSize: "14px", marginBottom: "20px", opacity: 0.8 }}>Mistakes: {mistakes}</p>
          )}
          <button
            onClick={handleComplete}
            style={{
              padding: "12px 40px",
              borderRadius: "8px",
              border: "none",
              background: "#10b981",
              color: "white",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => e.target.style.background = "#059669"}
            onMouseLeave={(e) => e.target.style.background = "#10b981"}
          >
            Claim Reward
          </button>
        </div>
      )}

      <style>{`
        @keyframes fadeInOut {
          0% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default PuzzleGame;
