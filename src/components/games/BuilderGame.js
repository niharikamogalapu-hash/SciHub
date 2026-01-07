import React, { useState } from "react";

function BuilderGame({ gameData, onComplete, onExit }) {
  const [selectedParts, setSelectedParts] = useState([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [buildComplete, setBuildComplete] = useState(false);
  const [startTime] = useState(Date.now());

  const handleSelectPart = (part) => {
    if (selectedParts.find((p) => p.id === part.id)) {
      // Already selected, deselect
      setSelectedParts(selectedParts.filter((p) => p.id !== part.id));
      setScore(Math.max(0, score - 5));
    } else {
      // Add to build
      setSelectedParts([...selectedParts, part]);
      setScore(score + 10);
      setFeedback(`Added: ${part.name}`);
      setTimeout(() => setFeedback(""), 1000);
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
        setFeedback("❌ Missing or wrong parts!");
        setTimeout(() => setFeedback(""), 1500);
      }
    } else {
      setFeedback(
        `Select ${gameData.requiredParts.length - selectedParts.length} more parts`
      );
      setTimeout(() => setFeedback(""), 1500);
    }
  };

  const handleComplete = () => {
    const timeTaken = (Date.now() - startTime) / 1000;
    const finalScore = Math.max(50, Math.min(100, score + Math.floor(30 - timeTaken / 30)));
    onComplete(finalScore);
  };

  return (
    <div
      style={{
        padding: "40px",
        background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        borderRadius: "12px",
        minHeight: "500px",
        color: "white",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <h2 style={{ margin: 0 }}>{gameData.title}</h2>
        <div style={{ display: "flex", gap: "20px", fontSize: "16px", fontWeight: "600" }}>
          <div>Score: {score}</div>
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
            Exit
          </button>
        </div>
      </div>

      <p style={{ marginBottom: "20px", fontSize: "16px" }}>
        {gameData.description}
      </p>

      {feedback && (
        <div
          style={{
            textAlign: "center",
            marginBottom: "20px",
            fontSize: "18px",
            fontWeight: "600",
            minHeight: "30px",
            padding: "10px",
            background: feedback.includes("❌")
              ? "rgba(239, 68, 68, 0.3)"
              : "rgba(16, 185, 129, 0.3)",
            borderRadius: "8px",
          }}
        >
          {feedback}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
        {/* Available parts */}
        <div>
          <h3 style={{ marginTop: 0, marginBottom: "20px", color: "#fbbf24" }}>
            Available Parts
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {gameData.parts.map((part) => {
              const isSelected = selectedParts.find((p) => p.id === part.id);
              return (
                <button
                  key={part.id}
                  onClick={() => handleSelectPart(part)}
                  style={{
                    padding: "16px 20px",
                    borderRadius: "8px",
                    background: isSelected
                      ? "rgba(251, 191, 36, 0.3)"
                      : "rgba(255,255,255,0.1)",
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
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "20px" }}>{part.emoji || "🔧"}</span>
                    <div>
                      <div style={{ fontWeight: "600" }}>{part.name}</div>
                      <div style={{ fontSize: "12px", opacity: 0.8 }}>
                        {part.description}
                      </div>
                    </div>
                    {isSelected && (
                      <span style={{ marginLeft: "auto", fontSize: "18px" }}>✓</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Build preview */}
        <div>
          <h3 style={{ marginTop: 0, marginBottom: "20px", color: "#fbbf24" }}>
            Your Build
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
                <div style={{ fontSize: "40px", marginBottom: "10px" }}>🏗️</div>
                <div>Select parts to start building</div>
              </div>
            ) : (
              <>
                <div style={{ fontSize: "60px", marginBottom: "20px" }}>
                  {gameData.buildEmoji || "⚙️"}
                </div>
                <div style={{ textAlign: "center" }}>
                  {selectedParts.map((part, idx) => (
                    <div key={idx} style={{ fontSize: "16px", marginBottom: "8px" }}>
                      {part.emoji || "✓"} {part.name}
                    </div>
                  ))}
                </div>
              </>
            )}
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
          >
            {buildComplete
              ? "✓ Build Complete!"
              : `Build ${selectedParts.length}/${gameData.requiredParts.length}`}
          </button>
        </div>
      </div>

      {buildComplete && (
        <div
          style={{
            background: "rgba(0,0,0,0.3)",
            padding: "30px",
            borderRadius: "12px",
            textAlign: "center",
            marginTop: "30px",
          }}
        >
          <h3 style={{ fontSize: "24px", marginTop: 0 }}>🎉 Excellent Build!</h3>
          <p style={{ fontSize: "18px", marginBottom: "20px" }}>
            You successfully completed the build! Score: {score}/100
          </p>
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
            Claim Reward
          </button>
        </div>
      )}
    </div>
  );
}

export default BuilderGame;
