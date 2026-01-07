import React, { useState } from "react";

function ReactionGame({ gameData, onComplete, onExit }) {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentTarget, setCurrentTarget] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [gameStartClock] = useState(Date.now());

  const targets = gameData.targets || [];

  const handleStartGame = () => {
    setGameStarted(true);
  };

  const handleClickTarget = (targetId) => {
    if (!gameStarted) return;

    const target = targets[currentTarget];
    if (targetId === target.id) {
      setScore(score + 10);
      setFeedback("✅ Hit!");

      if (currentTarget < targets.length - 1) {
        setCurrentTarget(currentTarget + 1);
      } else {
        // Game complete
        const timeTaken = (Date.now() - gameStartClock) / 1000;
        const finalScore = Math.max(50, Math.min(100, score + 30 + Math.floor(20 - timeTaken / 2)));
        setTimeout(() => onComplete(finalScore), 500);
      }
    } else {
      setScore(Math.max(0, score - 5));
      setFeedback("❌ Wrong target!");
    }

    setTimeout(() => setFeedback(""), 700);
  };

  if (!gameStarted) {
    return (
      <div
        style={{
          padding: "40px",
          background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
          borderRadius: "12px",
          minHeight: "400px",
          color: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: "36px", marginBottom: "20px" }}>{gameData.title}</h2>
        <p style={{ fontSize: "18px", marginBottom: "30px", maxWidth: "600px" }}>
          {gameData.description}
        </p>

        <div
          style={{
            background: "rgba(0,0,0,0.2)",
            padding: "30px",
            borderRadius: "12px",
            marginBottom: "30px",
          }}
        >
          <p style={{ fontSize: "16px", marginBottom: "10px" }}>
            Click the highlighted targets in order
          </p>
          <p style={{ fontSize: "14px", opacity: 0.9 }}>
            Total targets: {targets.length}
          </p>
        </div>

        <div style={{ display: "flex", gap: "20px" }}>
          <button
            onClick={handleStartGame}
            style={{
              padding: "16px 40px",
              borderRadius: "8px",
              border: "none",
              background: "#10b981",
              color: "white",
              cursor: "pointer",
              fontSize: "18px",
              fontWeight: "700",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.background = "#059669")}
            onMouseLeave={(e) => (e.target.style.background = "#10b981")}
          >
            Start Game
          </button>
          <button
            onClick={onExit}
            style={{
              padding: "16px 40px",
              borderRadius: "8px",
              border: "2px solid white",
              background: "transparent",
              color: "white",
              cursor: "pointer",
              fontSize: "18px",
              fontWeight: "700",
            }}
          >
            Exit
          </button>
        </div>
      </div>
    );
  }

  const target = targets[currentTarget];
  const allTargets = gameData.allTargets || targets.map((t) => t.id);

  return (
    <div
      style={{
        padding: "40px",
        background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
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
        <div style={{ display: "flex", gap: "20px", fontSize: "18px", fontWeight: "600" }}>
          <div>
            Score: {score}
          </div>
          <div>
            {currentTarget + 1}/{targets.length}
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
            }}
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
            fontSize: "24px",
            fontWeight: "600",
            minHeight: "40px",
          }}
        >
          {feedback}
        </div>
      )}

      <div
        style={{
          marginBottom: "30px",
          padding: "20px",
          background: "rgba(0,0,0,0.2)",
          borderRadius: "8px",
          textAlign: "center",
          fontSize: "18px",
          fontWeight: "600",
        }}
      >
        Click the{" "}
        <span style={{ fontSize: "20px", display: "inline-block", marginX: "8px" }}>
          {target.emoji}
        </span>{" "}
        ({target.label})
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
          gap: "16px",
          marginBottom: "30px",
          maxWidth: "700px",
          margin: "0 auto 30px",
        }}
      >
        {allTargets.map((targetId, idx) => {
          const isCurrentTarget = target.id === targetId;
          const isCompleted = idx < currentTarget;

          return (
            <button
              key={idx}
              onClick={() => handleClickTarget(targetId)}
              style={{
                padding: "20px",
                borderRadius: "12px",
                fontSize: "40px",
                cursor: "pointer",
                background: isCurrentTarget
                  ? "rgba(16, 185, 129, 0.6)"
                  : isCompleted
                  ? "rgba(16, 185, 129, 0.3)"
                  : "rgba(255,255,255,0.2)",
                transform: isCurrentTarget ? "scale(1.1)" : "scale(1)",
                transition: "all 0.2s ease",
                border: isCurrentTarget ? "3px solid #fbbf24" : "2px solid transparent",
                aspectRatio: "1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onMouseEnter={(e) => {
                if (isCurrentTarget) {
                  e.target.style.transform = "scale(1.15)";
                }
              }}
              onMouseLeave={(e) => {
                if (isCurrentTarget) {
                  e.target.style.transform = "scale(1.1)";
                }
              }}
            >
              {targets.find((t) => t.id === targetId).emoji}
            </button>
          );
        })}
      </div>

      <div
        style={{
          background: "rgba(0,0,0,0.2)",
          padding: "20px",
          borderRadius: "8px",
          textAlign: "center",
          fontSize: "14px",
        }}
      >
        <p style={{ margin: 0 }}>
          Progress: {currentTarget}/{targets.length} targets hit
        </p>
      </div>
    </div>
  );
}

export default ReactionGame;
