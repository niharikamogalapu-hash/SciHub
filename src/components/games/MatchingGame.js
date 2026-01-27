import React, { useState, useEffect } from "react";
import { saveGameProgress, loadGameProgress, clearGameProgress } from "../../utils/storageManager";

function MatchingGame({ gameData, onComplete, onExit, userId }) {
  const [matches, setMatches] = useState(new Map());
  const [selected, setSelected] = useState(null);
  const [items, setItems] = useState([]);
  const [definitions, setDefinitions] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [startTime] = useState(Date.now());
  const [feedback, setFeedback] = useState("");

  // Initialize game
  useEffect(() => {
    if (gameData.matchPairs) {
      // Shuffle definitions
      const shuffledDefs = [...gameData.matchPairs].sort(() => Math.random() - 0.5);
      setItems(gameData.matchPairs);
      setDefinitions(shuffledDefs);
    }
  }, [gameData]);

  // Load saved progress on mount
  useEffect(() => {
    if (userId && gameData.id && items.length > 0) {
      const savedProgress = loadGameProgress(userId, gameData.id);
      if (savedProgress && savedProgress.matches) {
        const matchesMap = new Map(savedProgress.matches);
        setMatches(matchesMap);
        setScore(savedProgress.score || 0);
      }
    }
  }, [userId, gameData.id, items.length]);

  // Save progress whenever it changes
  useEffect(() => {
    if (userId && gameData.id && items.length > 0) {
      saveGameProgress(userId, gameData.id, {
        matches: Array.from(matches.entries()),
        score,
      });
    }
  }, [matches, score, userId, gameData.id, items.length]);

  const handleSelectItem = (index, type) => {
    if (gameOver) return;

    if (type === "term") {
      setSelected({ type: "term", index });
      setFeedback("");
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
          setFeedback("✅ Perfect match!");

          // Check if game is complete
          if (newMatches.size === items.length) {
            setTimeout(() => setGameOver(true), 600);
          }

          setTimeout(() => setFeedback(""), 1000);
        } else {
          // Wrong match
          setFeedback("❌ Not a match! Try again.");
          setSelected(null);
          setTimeout(() => setFeedback(""), 1500);
        }
      }
    }
  };

  const handleComplete = () => {
    // Clear saved progress when game is completed
    if (userId && gameData.id) {
      clearGameProgress(userId, gameData.id);
    }
    const timeTaken = (Date.now() - startTime) / 1000;
    const timeBonus = Math.max(0, Math.floor(30 - timeTaken / 10));
    const finalScore = Math.max(50, Math.min(100, score + timeBonus));
    onComplete(finalScore);
  };

  if (!items.length) return <div style={{ color: "white", textAlign: "center", padding: "40px" }}>Loading game...</div>;

  const matchedCount = matches.size;

  return (
    <div style={{
      padding: "40px",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      borderRadius: "12px",
      minHeight: "500px",
      color: "white",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", flexWrap: "wrap", gap: "20px" }}>
        <div>
          <h2 style={{ margin: "0 0 8px 0", fontSize: "24px" }}>{gameData.title}</h2>
          <p style={{ margin: 0, fontSize: "14px", opacity: 0.9 }}>Match each concept with its definition!</p>
        </div>
        <div style={{ display: "flex", gap: "20px", fontSize: "16px", fontWeight: "600" }}>
          <div style={{ background: "rgba(0,0,0,0.2)", padding: "12px 16px", borderRadius: "8px" }}>
            <div style={{ fontSize: "12px", opacity: 0.8 }}>Score</div>
            <div style={{ fontSize: "20px" }}>{score}</div>
          </div>
          <div style={{ background: "rgba(0,0,0,0.2)", padding: "12px 16px", borderRadius: "8px" }}>
            <div style={{ fontSize: "12px", opacity: 0.8 }}>Matched</div>
            <div style={{ fontSize: "20px" }}>{matchedCount}/{items.length}</div>
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

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", marginBottom: "30px" }}>
        {/* Concepts Column */}
        <div>
          <h3 style={{ marginTop: 0, marginBottom: "20px", color: "#fbbf24", fontSize: "18px", fontWeight: "600" }}>📚 Concepts</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {items.map((item, idx) => {
              const isMatched = matches.has(idx);
              const isSelected = selected?.type === "term" && selected?.index === idx;

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectItem(idx, "term")}
                  disabled={isMatched}
                  style={{
                    padding: "16px 20px",
                    borderRadius: "10px",
                    border: isSelected ? "3px solid #fbbf24" : "2px solid rgba(255,255,255,0.3)",
                    background: isMatched ? "rgba(16, 185, 129, 0.2)" : "rgba(255,255,255,0.08)",
                    color: "white",
                    cursor: isMatched ? "default" : "pointer",
                    fontSize: "15px",
                    fontWeight: "500",
                    textAlign: "left",
                    transition: "all 0.3s ease",
                    opacity: isMatched ? 0.6 : 1,
                    transform: isSelected ? "translateX(8px)" : "translateX(0)",
                  }}
                  onMouseEnter={(e) => {
                    if (!isMatched && !isSelected) {
                      e.target.style.background = "rgba(255,255,255,0.15)";
                      e.target.style.transform = "translateX(8px)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isMatched) {
                      e.target.style.background = "rgba(255,255,255,0.08)";
                      e.target.style.transform = "translateX(0)";
                    }
                  }}
                >
                  {isMatched ? "✅ " : ""}{item.term}
                </button>
              );
            })}
          </div>
        </div>

        {/* Definitions Column */}
        <div>
          <h3 style={{ marginTop: 0, marginBottom: "20px", color: "#fbbf24", fontSize: "18px", fontWeight: "600" }}>📖 Definitions</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {definitions.map((def, idx) => {
              const matchedTermIndex = items.findIndex((i) => i.answer === def.answer);
              const isMatched = matches.has(matchedTermIndex);
              const isSelected = selected?.type === "def" && selected?.index === idx;

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectItem(idx, "def")}
                  disabled={isMatched}
                  style={{
                    padding: "16px 20px",
                    borderRadius: "10px",
                    border: isSelected ? "3px solid #fbbf24" : "2px solid rgba(255,255,255,0.3)",
                    background: isMatched ? "rgba(16, 185, 129, 0.2)" : "rgba(255,255,255,0.08)",
                    color: "white",
                    cursor: isMatched ? "default" : "pointer",
                    fontSize: "15px",
                    fontWeight: "500",
                    textAlign: "left",
                    transition: "all 0.3s ease",
                    opacity: isMatched ? 0.6 : 1,
                    transform: isSelected ? "translateX(-8px)" : "translateX(0)",
                  }}
                  onMouseEnter={(e) => {
                    if (!isMatched && !isSelected) {
                      e.target.style.background = "rgba(255,255,255,0.15)";
                      e.target.style.transform = "translateX(-8px)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isMatched) {
                      e.target.style.background = "rgba(255,255,255,0.08)";
                      e.target.style.transform = "translateX(0)";
                    }
                  }}
                >
                  {isMatched ? "✅ " : ""}{def.definition}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {gameOver && (
        <div style={{
          background: "rgba(0,0,0,0.3)",
          padding: "40px 30px",
          borderRadius: "12px",
          textAlign: "center",
          marginTop: "30px",
          animation: "slideUp 0.5s ease-out",
        }}>
          <h3 style={{ fontSize: "32px", marginTop: 0, marginBottom: "10px" }}>🎉 Perfect!</h3>
          <p style={{ fontSize: "18px", marginBottom: "8px", opacity: 0.9 }}>You matched all pairs!</p>
          <p style={{ fontSize: "16px", marginBottom: "20px", opacity: 0.8 }}>Final Score: {score}/100</p>
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
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default MatchingGame;
