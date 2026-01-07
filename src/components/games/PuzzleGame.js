import React, { useState, useEffect } from "react";

function PuzzleGame({ gameData, onComplete, onExit }) {
  const [sequence, setSequence] = useState([]);
  const [selectedIndices, setSelectedIndices] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [startTime] = useState(Date.now());

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

      if (selectedIndices.length + 1 === gameData.items.length) {
        setGameOver(true);
      }
    } else {
      // Wrong! Reset
      alert("❌ Wrong order! Try again from the beginning.");
      setSelectedIndices([]);
      setScore(Math.max(0, score - 5));
    }
  };

  const handleComplete = () => {
    const timeTaken = (Date.now() - startTime) / 1000;
    const finalScore = Math.max(50, Math.min(100, score + Math.floor(50 - timeTaken / 10)));
    onComplete(finalScore);
  };

  if (!sequence.length) return <div>Loading game...</div>;

  return (
    <div style={{
      padding: "40px",
      background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      borderRadius: "12px",
      minHeight: "400px",
      color: "white",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h2 style={{ margin: 0 }}>{gameData.title}</h2>
        <div style={{ display: "flex", gap: "20px", fontSize: "18px", fontWeight: "600" }}>
          <div>Score: {score}</div>
          <div>Progress: {selectedIndices.length}/{gameData.items.length}</div>
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

      <p style={{ marginBottom: "30px", fontSize: "16px" }}>{gameData.description}</p>

      {/* Correct Sequence Display */}
      {selectedIndices.length > 0 && (
        <div style={{
          background: "rgba(0,0,0,0.2)",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "30px",
        }}>
          <p style={{ margin: "0 0 15px 0", fontSize: "14px", opacity: 0.9 }}>Correct so far:</p>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {selectedIndices.map((idx, order) => (
              <div
                key={order}
                style={{
                  padding: "10px 16px",
                  background: "#10b981",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                {order + 1}. {sequence[idx].label}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Items to Sort */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
        gap: "12px",
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
                borderRadius: "8px",
                border: isNextCorrect && !isSelected ? "3px solid #fbbf24" : "2px solid rgba(255,255,255,0.3)",
                background: isSelected ? "#10b981" : isNextCorrect && !gameOver ? "rgba(251, 191, 36, 0.2)" : "rgba(255,255,255,0.1)",
                color: "white",
                cursor: isSelected || gameOver ? "default" : "pointer",
                fontSize: "14px",
                fontWeight: "500",
                textAlign: "center",
                transition: "all 0.3s ease",
                opacity: isSelected ? 0.6 : 1,
                minHeight: "60px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {isSelected && "✓ "}
              {item.label}
            </button>
          );
        })}
      </div>

      {gameOver && (
        <div style={{
          background: "rgba(0,0,0,0.3)",
          padding: "30px",
          borderRadius: "12px",
          textAlign: "center",
        }}>
          <h3 style={{ fontSize: "24px", marginTop: 0 }}>🎉 Level Complete!</h3>
          <p style={{ fontSize: "18px", marginBottom: "20px" }}>Final Score: {score}/100</p>
          <button
            onClick={handleComplete}
            style={{
              padding: "12px 30px",
              borderRadius: "8px",
              border: "none",
              background: "#10b981",
              color: "white",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600",
            }}
          >
            Collect Coins & Continue
          </button>
        </div>
      )}
    </div>
  );
}

export default PuzzleGame;
