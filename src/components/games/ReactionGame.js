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
      setFeedback("✅ Perfect!");

      if (currentTarget < targets.length - 1) {
        setCurrentTarget(currentTarget + 1);
      } else {
        // Game complete
        const timeTaken = (Date.now() - gameStartClock) / 1000;
        const timeBonus = Math.max(0, Math.floor(30 - timeTaken / 2));
        const finalScore = Math.max(50, Math.min(100, score + 10 + timeBonus));
        setTimeout(() => onComplete(finalScore), 800);
      }
    } else {
      setScore(Math.max(0, score - 5));
      setFeedback("❌ Wrong target!");
    }

    setTimeout(() => setFeedback(""), 800);
  };

  if (!gameStarted) {
    return (
      <div
        style={{
          padding: "40px",
          background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
          borderRadius: "12px",
          minHeight: "500px",
          color: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: "40px", marginBottom: "20px" }}>{gameData.title}</h2>
        <p style={{ fontSize: "18px", marginBottom: "30px", maxWidth: "600px", lineHeight: "1.6" }}>
          {gameData.description}
        </p>

        <div
          style={{
            background: "rgba(0,0,0,0.2)",
            padding: "30px",
            borderRadius: "12px",
            marginBottom: "40px",
          }}
        >
          <p style={{ fontSize: "16px", marginBottom: "10px", fontWeight: "600" }}>
            How to Play:
          </p>
          <p style={{ fontSize: "14px", opacity: 0.95, margin: "10px 0" }}>
            🎯 Click the highlighted targets in order as fast as you can
          </p>
          <p style={{ fontSize: "14px", opacity: 0.95, margin: "10px 0" }}>
            ⚡ Total targets to click: {targets.length}
          </p>
          <p style={{ fontSize: "14px", opacity: 0.95, margin: "10px 0" }}>
            ⏱️ Complete it as quickly as possible for bonus points!
          </p>
        </div>

        <div style={{ display: "flex", gap: "20px" }}>
          <button
            onClick={handleStartGame}
            style={{
              padding: "18px 50px",
              borderRadius: "10px",
              border: "none",
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              color: "white",
              cursor: "pointer",
              fontSize: "18px",
              fontWeight: "700",
              transition: "all 0.3s ease",
              boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "scale(1.05)";
              e.target.style.boxShadow = "0 12px 24px rgba(0,0,0,0.3)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "scale(1)";
              e.target.style.boxShadow = "0 8px 20px rgba(0,0,0,0.2)";
            }}
          >
            🚀 Start Game
          </button>
          <button
            onClick={onExit}
            style={{
              padding: "18px 50px",
              borderRadius: "10px",
              border: "2px solid white",
              background: "transparent",
              color: "white",
              cursor: "pointer",
              fontSize: "18px",
              fontWeight: "700",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "rgba(255,255,255,0.1)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "transparent";
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
  const progress = Math.round(((currentTarget + 1) / targets.length) * 100);

  return (
    <div
      style={{
        padding: "40px",
        background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
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
          <p style={{ margin: 0, fontSize: "14px", opacity: 0.9 }}>Click targets in order - fast as you can!</p>
        </div>
        <div style={{ display: "flex", gap: "20px", fontSize: "16px", fontWeight: "600" }}>
          <div style={{ background: "rgba(0,0,0,0.2)", padding: "12px 16px", borderRadius: "8px" }}>
            <div style={{ fontSize: "12px", opacity: 0.8 }}>Score</div>
            <div style={{ fontSize: "20px" }}>{score}</div>
          </div>
          <div style={{ background: "rgba(0,0,0,0.2)", padding: "12px 16px", borderRadius: "8px" }}>
            <div style={{ fontSize: "12px", opacity: 0.8 }}>Progress</div>
            <div style={{ fontSize: "20px" }}>{currentTarget}/{targets.length}</div>
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
            fontSize: "24px",
            fontWeight: "600",
            minHeight: "40px",
            animation: "fadeInOut 0.8s ease-in-out",
          }}
        >
          {feedback}
        </div>
      )}

      {/* Progress Bar */}
      <div style={{ marginBottom: "30px" }}>
        <div style={{
          width: "100%",
          height: "10px",
          background: "rgba(0,0,0,0.2)",
          borderRadius: "6px",
          overflow: "hidden",
        }}>
          <div style={{
            width: `${progress}%`,
            height: "100%",
            background: "linear-gradient(90deg, #10b981 0%, #06b6d4 100%)",
            transition: "width 0.4s ease",
          }}></div>
        </div>
      </div>

      <div
        style={{
          marginBottom: "30px",
          padding: "20px",
          background: "rgba(0,0,0,0.2)",
          borderRadius: "10px",
          textAlign: "center",
          fontSize: "16px",
          fontWeight: "600",
        }}
      >
        <div style={{ fontSize: "12px", opacity: 0.9, marginBottom: "10px" }}>CLICK THIS TARGET:</div>
        <div style={{ fontSize: "32px", marginBottom: "8px" }}>
          {target.emoji}
        </div>
        <div style={{ fontSize: "18px" }}>{target.label}</div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
          gap: "16px",
          marginBottom: "30px",
          maxWidth: "600px",
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
              disabled={isCompleted}
              style={{
                padding: "20px",
                borderRadius: "12px",
                fontSize: "40px",
                cursor: isCurrentTarget ? "pointer" : isCompleted ? "default" : "not-allowed",
                background: isCurrentTarget
                  ? "rgba(16, 185, 129, 0.5)"
                  : isCompleted
                  ? "rgba(16, 185, 129, 0.2)"
                  : "rgba(255,255,255,0.1)",
                transform: isCurrentTarget ? "scale(1.1)" : "scale(1)",
                transition: "all 0.2s ease",
                border: isCurrentTarget ? "3px solid #fbbf24" : "2px solid rgba(255,255,255,0.3)",
                aspectRatio: "1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: isCompleted ? 0.5 : 1,
                boxShadow: isCurrentTarget ? "0 8px 24px rgba(251, 191, 36, 0.3)" : "none",
              }}
              onMouseEnter={(e) => {
                if (isCurrentTarget) {
                  e.target.style.transform = "scale(1.18)";
                }
              }}
              onMouseLeave={(e) => {
                if (isCurrentTarget) {
                  e.target.style.transform = "scale(1.1)";
                }
              }}
            >
              {targets.find((t) => t.id === targetId).emoji}
              {isCompleted && (
                <div style={{
                  position: "absolute",
                  fontSize: "24px",
                  background: "#10b981",
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  ✓
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div
        style={{
          background: "rgba(0,0,0,0.2)",
          padding: "20px",
          borderRadius: "10px",
          textAlign: "center",
          fontSize: "14px",
        }}
      >
        <p style={{ margin: "0 0 8px 0", fontWeight: "600" }}>
          ⚡ {targets.length - currentTarget} targets remaining
        </p>
        <p style={{ margin: 0, opacity: 0.9 }}>
          {currentTarget === 0 ? "Get ready! Click the first target to begin." : "Keep going!"}
        </p>
      </div>

      <style>{`
        @keyframes fadeInOut {
          0% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default ReactionGame;
