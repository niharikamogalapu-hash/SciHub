import React, { useState, useEffect } from "react";

function DragDropGame({ gameData, onComplete, onExit }) {
  const [items, setItems] = useState([]);
  const [slots, setSlots] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [startTime] = useState(Date.now());
  const [isGameComplete, setIsGameComplete] = useState(false);

  useEffect(() => {
    if (gameData.items) {
      const shuffledItems = [...gameData.items].sort(() => Math.random() - 0.5);
      setItems(shuffledItems);
      setSlots(new Array(gameData.items.length).fill(null));
    }
  }, [gameData]);

  const handleDragStart = (index) => {
    setDraggedItem(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDropOnSlot = (slotIndex) => {
    if (draggedItem === null) return;

    const item = items[draggedItem];
    const correctSlot = gameData.items.findIndex((it) => it.answer === item.answer);

    if (correctSlot === slotIndex) {
      // Correct placement!
      const newSlots = [...slots];
      newSlots[slotIndex] = draggedItem;
      setSlots(newSlots);
      setScore(score + 15);
      setFeedback("✅ Perfect placement!");

      // Check if complete
      if (newSlots.filter((s) => s !== null).length === gameData.items.length) {
        setIsGameComplete(true);
        setTimeout(() => handleGameComplete(), 800);
      }

      setTimeout(() => setFeedback(""), 1200);
    } else {
      setFeedback("❌ Try another slot!");
      setTimeout(() => setFeedback(""), 1200);
    }

    setDraggedItem(null);
  };

  const handleGameComplete = () => {
    const timeTaken = (Date.now() - startTime) / 1000;
    const timeBonus = Math.max(0, Math.floor(30 - timeTaken / 10));
    const finalScore = Math.max(50, Math.min(100, score + timeBonus));
    onComplete(finalScore);
  };

  const placedCount = slots.filter((s) => s !== null).length;
  const isComplete = placedCount === items.length;

  return (
    <div
      style={{
        padding: "40px",
        background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
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
          <p style={{ margin: 0, fontSize: "14px", opacity: 0.9 }}>Drag items to their correct slots!</p>
        </div>
        <div style={{ display: "flex", gap: "20px", fontSize: "16px", fontWeight: "600" }}>
          <div style={{ background: "rgba(0,0,0,0.2)", padding: "12px 16px", borderRadius: "8px" }}>
            <div style={{ fontSize: "12px", opacity: 0.8 }}>Score</div>
            <div style={{ fontSize: "20px" }}>{score}</div>
          </div>
          <div style={{ background: "rgba(0,0,0,0.2)", padding: "12px 16px", borderRadius: "8px" }}>
            <div style={{ fontSize: "12px", opacity: 0.8 }}>Placed</div>
            <div style={{ fontSize: "20px" }}>{placedCount}/{items.length}</div>
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
            animation: "fadeInOut 1.2s ease-in-out",
          }}
        >
          {feedback}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", marginBottom: "30px" }}>
        {/* Items to drag */}
        <div>
          <h3 style={{ marginTop: 0, marginBottom: "20px", color: "#fbbf24", fontSize: "18px", fontWeight: "600" }}>
            📦 Items to Drag
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {items.map((item, idx) => {
              const isPlaced = slots.includes(idx);
              return (
                <div
                  key={idx}
                  draggable={!isPlaced}
                  onDragStart={() => handleDragStart(idx)}
                  onDragEnd={() => setDraggedItem(null)}
                  style={{
                    padding: "16px 20px",
                    borderRadius: "10px",
                    background: isPlaced
                      ? "rgba(16, 185, 129, 0.2)"
                      : draggedItem === idx
                      ? "#fbbf24"
                      : "rgba(255,255,255,0.1)",
                    color: "white",
                    cursor: isPlaced ? "default" : "grab",
                    fontSize: "16px",
                    fontWeight: "500",
                    border: "2px solid rgba(255,255,255,0.3)",
                    transition: "all 0.3s ease",
                    opacity: isPlaced ? 0.6 : 1,
                    userSelect: "none",
                    transform: draggedItem === idx ? "scale(0.95) rotate(2deg)" : "scale(1) rotate(0deg)",
                  }}
                >
                  {isPlaced ? "✓ " : "🖱️ "}{item.label}
                </div>
              );
            })}
          </div>
        </div>

        {/* Drop slots */}
        <div>
          <h3 style={{ marginTop: 0, marginBottom: "20px", color: "#fbbf24", fontSize: "18px", fontWeight: "600" }}>
            🎯 Drop Slots
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {slots.map((slotItem, idx) => {
              const itemIndex = slotItem;
              const item = itemIndex !== null ? items[itemIndex] : null;
              return (
                <div
                  key={idx}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDropOnSlot(idx)}
                  style={{
                    padding: "16px 20px",
                    borderRadius: "10px",
                    background: item
                      ? "rgba(16, 185, 129, 0.25)"
                      : draggedItem !== null
                      ? "rgba(251, 191, 36, 0.15)"
                      : "rgba(255,255,255,0.08)",
                    color: "white",
                    cursor: "drop",
                    fontSize: "16px",
                    fontWeight: "500",
                    border: draggedItem !== null ? "3px dashed #fbbf24" : "2px solid rgba(255,255,255,0.3)",
                    minHeight: "60px",
                    display: "flex",
                    alignItems: "center",
                    transition: "all 0.3s ease",
                  }}
                >
                  {item ? (
                    <>
                      ✅ {item.label}
                    </>
                  ) : (
                    <span style={{ opacity: 0.6 }}>
                      {gameData.slotLabels?.[idx] || `📍 Slot ${idx + 1}`}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {isComplete && (
        <div
          style={{
            background: "rgba(0,0,0,0.3)",
            padding: "40px 30px",
            borderRadius: "12px",
            textAlign: "center",
            marginTop: "30px",
            animation: "slideUp 0.5s ease-out",
          }}
        >
          <h3 style={{ fontSize: "32px", marginTop: 0, marginBottom: "10px" }}>🎉 Perfect!</h3>
          <p style={{ fontSize: "18px", marginBottom: "8px", opacity: 0.9 }}>All items correctly placed!</p>
          <p style={{ fontSize: "16px", marginBottom: "20px", opacity: 0.8 }}>Final Score: {score}/100</p>
          <button
            onClick={handleGameComplete}
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

export default DragDropGame;
