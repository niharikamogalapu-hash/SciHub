import React, { useState, useEffect } from "react";

function DragDropGame({ gameData, onComplete, onExit }) {
  const [items, setItems] = useState([]);
  const [slots, setSlots] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [startTime] = useState(Date.now());

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
      setFeedback("✅ Perfect!");

      // Check if complete
      if (newSlots.filter((s) => s !== null).length === gameData.items.length) {
        setTimeout(() => handleGameComplete(), 600);
      }

      setTimeout(() => setFeedback(""), 1000);
    } else {
      setFeedback("❌ Try another slot");
      setTimeout(() => setFeedback(""), 1000);
    }

    setDraggedItem(null);
  };

  const handleGameComplete = () => {
    const timeTaken = (Date.now() - startTime) / 1000;
    const finalScore = Math.max(50, Math.min(100, score + Math.floor(50 - timeTaken / 10)));
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
          <div>
            Placed: {placedCount}/{items.length}
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

      <p style={{ marginBottom: "30px", fontSize: "16px" }}>
        {gameData.description || "Drag items to the correct slots"}
      </p>

      {feedback && (
        <div
          style={{
            textAlign: "center",
            marginBottom: "20px",
            fontSize: "18px",
            fontWeight: "600",
            minHeight: "30px",
          }}
        >
          {feedback}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
        {/* Items to drag */}
        <div>
          <h3 style={{ marginTop: 0, marginBottom: "20px", color: "#fbbf24" }}>
            Items
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {items.map((item, idx) => {
              const isPlaced = slots.includes(idx);
              return (
                <div
                  key={idx}
                  draggable={!isPlaced}
                  onDragStart={() => handleDragStart(idx)}
                  style={{
                    padding: "16px 20px",
                    borderRadius: "8px",
                    background: isPlaced
                      ? "#10b98144"
                      : draggedItem === idx
                      ? "#fbbf24"
                      : "rgba(255,255,255,0.2)",
                    color: "white",
                    cursor: isPlaced ? "default" : "grab",
                    fontSize: "16px",
                    fontWeight: "500",
                    border: "2px solid rgba(255,255,255,0.3)",
                    transition: "all 0.3s ease",
                    opacity: isPlaced ? 0.5 : 1,
                  }}
                >
                  {isPlaced && "✓ "}
                  {item.label}
                </div>
              );
            })}
          </div>
        </div>

        {/* Drop slots */}
        <div>
          <h3 style={{ marginTop: 0, marginBottom: "20px", color: "#fbbf24" }}>
            Slots
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
                    borderRadius: "8px",
                    background: item
                      ? "rgba(16, 185, 129, 0.3)"
                      : "rgba(255,255,255,0.1)",
                    color: "white",
                    cursor: "drop",
                    fontSize: "16px",
                    fontWeight: "500",
                    border: draggedItem !== null ? "3px dashed #fbbf24" : "2px solid rgba(255,255,255,0.3)",
                    minHeight: "55px",
                    display: "flex",
                    alignItems: "center",
                    transition: "all 0.3s ease",
                  }}
                >
                  {item ? (
                    <>
                      ✓ {item.label}
                    </>
                  ) : (
                    <span style={{ opacity: 0.6 }}>
                      {gameData.slotLabels?.[idx] || `Slot ${idx + 1}`}
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
            padding: "30px",
            borderRadius: "12px",
            textAlign: "center",
            marginTop: "30px",
          }}
        >
          <h3 style={{ fontSize: "24px", marginTop: 0 }}>🎉 Level Complete!</h3>
          <p style={{ fontSize: "18px", marginBottom: "20px" }}>
            Perfect! Score: {score}/100
          </p>
          <button
            onClick={handleGameComplete}
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
            Collect Coins
          </button>
        </div>
      )}
    </div>
  );
}

export default DragDropGame;
