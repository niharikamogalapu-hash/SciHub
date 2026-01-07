import React, { useState, useEffect } from "react";

function MatchingGame({ gameData, onComplete, onExit }) {
  const [matches, setMatches] = useState(new Map());
  const [selected, setSelected] = useState(null);
  const [items, setItems] = useState([]);
  const [definitions, setDefinitions] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [startTime] = useState(Date.now());

  // Initialize game
  useEffect(() => {
    if (gameData.matchPairs) {
      // Shuffle definitions
      const shuffledDefs = [...gameData.matchPairs].sort(() => Math.random() - 0.5);
      setItems(gameData.matchPairs);
      setDefinitions(shuffledDefs);
    }
  }, [gameData]);

  const handleSelectItem = (index, type) => {
    if (gameOver) return;

    if (type === "term") {
      setSelected({ type: "term", index });
    } else if (type === "def") {
      if (selected?.type === "term") {
        const termIndex = selected.index;
        const term = items[termIndex];
        const def = definitions[index];

        if (term.answer === def.answer) {
          // Correct match!
          const newMatches = new Map(matches);
          newMatches.set(termIndex, index);
          setMatches(newMatches);
          const newScore = score + 10;
          setScore(newScore);
          setSelected(null);

          // Check if game is complete
          if (newMatches.size === items.length) {
            setGameOver(true);
          }
        } else {
          // Wrong match
          setSelected(null);
          setTimeout(() => {
            alert("❌ Not a match! Try again.");
          }, 300);
        }
      }
    }
  };

  const handleComplete = () => {
    const timeTaken = (Date.now() - startTime) / 1000;
    const finalScore = Math.max(50, Math.min(100, score + Math.floor(50 - timeTaken / 10)));
    onComplete(finalScore);
  };

  if (!items.length) return <div>Loading game...</div>;

  return (
    <div style={{
      padding: "40px",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      borderRadius: "12px",
      minHeight: "400px",
      color: "white",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h2 style={{ margin: 0 }}>{gameData.title}</h2>
        <div style={{ display: "flex", gap: "20px", fontSize: "18px", fontWeight: "600" }}>
          <div>Score: {score}</div>
          <div>Matched: {matches.size}/{items.length}</div>
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

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", marginBottom: "30px" }}>
        {/* Terms Column */}
        <div>
          <h3 style={{ marginTop: 0, marginBottom: "20px", color: "#fbbf24" }}>Concepts</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {items.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectItem(idx, "term")}
                disabled={matches.has(idx)}
                style={{
                  padding: "16px 20px",
                  borderRadius: "8px",
                  border: selected?.type === "term" && selected?.index === idx ? "3px solid #fbbf24" : "2px solid rgba(255,255,255,0.3)",
                  background: matches.has(idx) ? "#10b981" : "rgba(255,255,255,0.1)",
                  color: "white",
                  cursor: matches.has(idx) ? "default" : "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  textAlign: "left",
                  transition: "all 0.3s ease",
                  opacity: matches.has(idx) ? 0.6 : 1,
                }}
              >
                {matches.has(idx) ? "✓ " : ""}{item.term}
              </button>
            ))}
          </div>
        </div>

        {/* Definitions Column */}
        <div>
          <h3 style={{ marginTop: 0, marginBottom: "20px", color: "#fbbf24" }}>Definitions</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {definitions.map((def, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectItem(idx, "def")}
                disabled={matches.has(items.findIndex((i) => i.answer === def.answer))}
                style={{
                  padding: "16px 20px",
                  borderRadius: "8px",
                  border: selected?.type === "def" && selected?.index === idx ? "3px solid #fbbf24" : "2px solid rgba(255,255,255,0.3)",
                  background: matches.has(items.findIndex((i) => i.answer === def.answer)) ? "#10b981" : "rgba(255,255,255,0.1)",
                  color: "white",
                  cursor: matches.has(items.findIndex((i) => i.answer === def.answer)) ? "default" : "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  textAlign: "left",
                  transition: "all 0.3s ease",
                  opacity: matches.has(items.findIndex((i) => i.answer === def.answer)) ? 0.6 : 1,
                }}
              >
                {matches.has(items.findIndex((i) => i.answer === def.answer)) ? "✓ " : ""}{def.definition}
              </button>
            ))}
          </div>
        </div>
      </div>

      {gameOver && (
        <div style={{
          background: "rgba(0,0,0,0.3)",
          padding: "30px",
          borderRadius: "12px",
          textAlign: "center",
          marginTop: "30px",
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

export default MatchingGame;
