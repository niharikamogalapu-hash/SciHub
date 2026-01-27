import React, { useState, useEffect } from "react";
import { saveGameProgress, loadGameProgress, clearGameProgress } from "../../utils/storageManager";

function BuilderGame({ gameData, onComplete, onExit, userId }) {
  const [selectedParts, setSelectedParts] = useState([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [buildComplete, setBuildComplete] = useState(false);
  const [startTime] = useState(Date.now());

  // Load saved progress on mount
  useEffect(() => {
    if (userId && gameData.id) {
      const savedProgress = loadGameProgress(userId, gameData.id);
      if (savedProgress) {
        setSelectedParts(savedProgress.selectedParts || []);
        setScore(savedProgress.score || 0);
      }
    }
  }, [userId, gameData.id]);

  // Save progress whenever it changes
  useEffect(() => {
    if (userId && gameData.id) {
      saveGameProgress(userId, gameData.id, {
        selectedParts,
        score,
      });
    }
  }, [selectedParts, score, userId, gameData.id]);

  const handleSelectPart = (part) => {
    if (selectedParts.find((p) => p.id === part.id)) {
      // Already selected, deselect
      setSelectedParts(selectedParts.filter((p) => p.id !== part.id));
      setScore(Math.max(0, score - 5));
    } else {
      // Add to build
      setSelectedParts([...selectedParts, part]);
      setScore(score + 10);
      setFeedback(`✅ Added: ${part.name}`);
      setTimeout(() => setFeedback(""), 1200);
    }
  };

  const handleBuild = () => {
    if (selectedParts.length === gameData.requiredParts.length) {
      const correctParts = gameData.requiredParts.every((req) =>
        selectedParts.some((p) => p.id === req)
      );

      if (correctParts) {
        setBuildComplete(true);
        setScore(score + 30);
        setFeedback("🎉 Perfect build!");
      } else {
        setFeedback("❌ Some parts are incorrect!");
        setTimeout(() => setFeedback(""), 1500);
      }
    } else {
      const remaining = gameData.requiredParts.length - selectedParts.length;
      setFeedback(
        `Select ${remaining} more part${remaining === 1 ? "" : "s"}`
      );
      setTimeout(() => setFeedback(""), 1500);
    }
  };

  const handleComplete = () => {
    // Clear saved progress when game is completed
    if (userId && gameData.id) {
      clearGameProgress(userId, gameData.id);
    }
    const timeTaken = (Date.now() - startTime) / 1000;
    const timeBonus = Math.max(0, Math.floor(30 - timeTaken / 30));
    const finalScore = Math.max(50, Math.min(100, score + timeBonus));
    onComplete(finalScore);
  };

  const requiredCount = gameData.requiredParts.length;
  const selectedCount = selectedParts.length;
  const progress = Math.round((selectedCount / requiredCount) * 100);

  return (
    <div
      style={{
        padding: "40px",
        background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        borderRadius: "12px",
        minHeight: "600px",
        color: "white",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        <div>
          <h2 style={{ margin: "0 0 8px 0", fontSize: "24px" }}>{gameData.title}</h2>
          <p style={{ margin: 0, fontSize: "14px", opacity: 0.9 }}>Select the correct parts to build!</p>
        </div>
        <div style={{ display: "flex", gap: "20px", fontSize: "16px", fontWeight: "600" }}>
          <div style={{ background: "rgba(0,0,0,0.2)", padding: "12px 16px", borderRadius: "8px" }}>
            <div style={{ fontSize: "12px", opacity: 0.8 }}>Score</div>
            <div style={{ fontSize: "20px" }}>{score}</div>
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
        <div
          style={{
            textAlign: "center",
            marginBottom: "20px",
            fontSize: "18px",
            fontWeight: "600",
            minHeight: "30px",
            padding: "12px",
            background: feedback.includes("❌")
              ? "rgba(239, 68, 68, 0.2)"
              : "rgba(16, 185, 129, 0.2)",
            borderRadius: "8px",
            animation: "fadeInOut 1.2s ease-in-out",
          }}
        >
          {feedback}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", marginBottom: "30px" }}>
        {/* Available parts */}
        <div>
          <h3 style={{ marginTop: 0, marginBottom: "20px", color: "#fbbf24", fontSize: "18px", fontWeight: "600" }}>
            📦 Available Parts
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {gameData.parts.map((part) => {
              const isSelected = selectedParts.find((p) => p.id === part.id);
              return (
                <button
                  key={part.id}
                  onClick={() => handleSelectPart(part)}
                  style={{
                    padding: "16px 20px",
                    borderRadius: "10px",
                    background: isSelected
                      ? "rgba(251, 191, 36, 0.2)"
                      : "rgba(255,255,255,0.08)",
                    color: "white",
                    cursor: "pointer",
                    fontSize: "16px",
                    fontWeight: "500",
                    border: isSelected
                      ? "2px solid #fbbf24"
                      : "2px solid rgba(255,255,255,0.3)",
                    transition: "all 0.3s ease",
                    textAlign: "left",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.background = "rgba(255,255,255,0.15)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                    }
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "24px", flexShrink: 0 }}>{part.emoji || "🔧"}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: "600", marginBottom: "4px" }}>{part.name}</div>
                      <div style={{ fontSize: "12px", opacity: 0.8 }}>
                        {part.description}
                      </div>
                    </div>
                    {isSelected && (
                      <span style={{ fontSize: "20px", flexShrink: 0 }}>✅</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Build preview */}
        <div>
          <h3 style={{ marginTop: 0, marginBottom: "20px", color: "#fbbf24", fontSize: "18px", fontWeight: "600" }}>
            🎯 Your Build
          </h3>
          <div
            style={{
              background: "rgba(0,0,0,0.2)",
              borderRadius: "12px",
              padding: "30px 20px",
              minHeight: "300px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "20px",
            }}
          >
            {selectedParts.length === 0 ? (
              <div style={{ textAlign: "center", opacity: 0.7 }}>
                <div style={{ fontSize: "48px", marginBottom: "10px" }}>🏗️</div>
                <div style={{ fontSize: "16px" }}>Select parts to start building</div>
              </div>
            ) : (
              <>
                <div style={{ fontSize: "60px", marginBottom: "20px", animation: "bounce 2s infinite" }}>
                  {gameData.buildEmoji || "⚙️"}
                </div>
                <div style={{ textAlign: "center", flex: 1 }}>
                  <div style={{ marginBottom: "15px", fontSize: "14px", opacity: 0.9 }}>Parts Added:</div>
                  {selectedParts.map((part, idx) => (
                    <div key={idx} style={{ fontSize: "16px", marginBottom: "8px", fontWeight: "500" }}>
                      {part.emoji || "✓"} {part.name}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Progress Bar */}
          <div style={{ marginBottom: "15px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "12px", opacity: 0.9 }}>
              <span>Progress</span>
              <span>{selectedCount}/{requiredCount}</span>
            </div>
            <div style={{
              width: "100%",
              height: "8px",
              background: "rgba(255,255,255,0.2)",
              borderRadius: "4px",
              overflow: "hidden",
            }}>
              <div style={{
                width: `${progress}%`,
                height: "100%",
                background: "linear-gradient(90deg, #10b981 0%, #06b6d4 100%)",
                transition: "width 0.3s ease",
              }}></div>
            </div>
          </div>

          <button
            onClick={handleBuild}
            disabled={buildComplete}
            style={{
              width: "100%",
              padding: "16px 20px",
              borderRadius: "8px",
              border: "none",
              background: buildComplete ? "#6b7280" : "#10b981",
              color: "white",
              cursor: buildComplete ? "default" : "pointer",
              fontSize: "16px",
              fontWeight: "600",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              if (!buildComplete) {
                e.target.style.background = "#059669";
              }
            }}
            onMouseLeave={(e) => {
              if (!buildComplete) {
                e.target.style.background = "#10b981";
              }
            }}
          >
            {buildComplete
              ? "✅ Build Complete!"
              : `Build [${selectedCount}/${requiredCount}]`}
          </button>
        </div>
      </div>

      {buildComplete && (
        <div
          style={{
            background: "rgba(0,0,0,0.3)",
            padding: "40px 30px",
            borderRadius: "12px",
            textAlign: "center",
            animation: "slideUp 0.5s ease-out",
          }}
        >
          <h3 style={{ fontSize: "32px", marginTop: 0, marginBottom: "10px" }}>🎉 Excellent Build!</h3>
          <p style={{ fontSize: "18px", marginBottom: "8px", opacity: 0.9 }}>You successfully completed the build!</p>
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
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}

export default BuilderGame;
