import React, { useState, useEffect } from "react";

function MemoryGame({ gameData, onComplete, onExit }) {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState(new Set());
  const [matched, setMatched] = useState(new Set());
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(100);
  const [firstCard, setFirstCard] = useState(null);
  const [canFlip, setCanFlip] = useState(true);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [startTime] = useState(Date.now());

  useEffect(() => {
    if (gameData.pairs) {
      const shuffled = [...gameData.pairs, ...gameData.pairs]
        .map((item, idx) => ({ ...item, id: idx }))
        .sort(() => Math.random() - 0.5);
      setCards(shuffled);
    }
  }, [gameData]);

  const handleCardFlip = (index) => {
    if (!canFlip || flipped.has(index) || matched.has(index)) return;

    const newFlipped = new Set(flipped);
    newFlipped.add(index);
    setFlipped(newFlipped);

    if (!firstCard) {
      setFirstCard(index);
    } else {
      setCanFlip(false);
      const firstCardObj = cards[firstCard];
      const secondCardObj = cards[index];

      if (firstCardObj.answer === secondCardObj.answer) {
        // Match found!
        const newMatched = new Set(matched);
        newMatched.add(firstCard);
        newMatched.add(index);
        setMatched(newMatched);
        setScore(score + 10);
        setFeedbackMessage("✅ Perfect match!");

        // Check if game is complete
        if (newMatched.size === cards.length) {
          setTimeout(() => handleGameComplete(), 800);
        }
      } else {
        setScore(Math.max(0, score - 2));
        setFeedbackMessage("❌ Not a match, try again!");
      }

      setMoves(moves + 1);
      setFirstCard(null);

      setTimeout(() => {
        if (firstCardObj.answer !== secondCardObj.answer) {
          const resetFlipped = new Set(flipped);
          resetFlipped.delete(firstCard);
          resetFlipped.delete(index);
          setFlipped(resetFlipped);
        }
        setCanFlip(true);
        setFeedbackMessage("");
      }, 800);
    }
  };

  const handleGameComplete = () => {
    const timeTaken = (Date.now() - startTime) / 1000;
    const timeBonus = Math.max(0, Math.floor(20 - timeTaken / 10));
    const finalScore = Math.max(50, Math.min(100, score + timeBonus));
    onComplete(finalScore);
  };

  if (!cards.length) return <div style={{ color: "white", textAlign: "center", padding: "40px" }}>Loading...</div>;

  const cardsPerRow = cards.length <= 8 ? 4 : 6;

  return (
    <div
      style={{
        padding: "40px",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
          <p style={{ margin: 0, fontSize: "14px", opacity: 0.9 }}>Match pairs to complete the game!</p>
        </div>
        <div style={{ display: "flex", gap: "30px", fontSize: "16px", fontWeight: "600" }}>
          <div style={{ background: "rgba(0,0,0,0.2)", padding: "12px 16px", borderRadius: "8px" }}>
            <div style={{ fontSize: "12px", opacity: 0.8 }}>Moves</div>
            <div style={{ fontSize: "20px" }}>{moves}</div>
          </div>
          <div style={{ background: "rgba(0,0,0,0.2)", padding: "12px 16px", borderRadius: "8px" }}>
            <div style={{ fontSize: "12px", opacity: 0.8 }}>Score</div>
            <div style={{ fontSize: "20px" }}>{score}</div>
          </div>
          <div style={{ background: "rgba(0,0,0,0.2)", padding: "12px 16px", borderRadius: "8px" }}>
            <div style={{ fontSize: "12px", opacity: 0.8 }}>Matched</div>
            <div style={{ fontSize: "20px" }}>{matched.size / 2}/{cards.length / 2}</div>
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

      {feedbackMessage && (
        <div
          style={{
            textAlign: "center",
            fontSize: "18px",
            fontWeight: "600",
            marginBottom: "20px",
            animation: "fadeInOut 1s ease-in-out",
          }}
        >
          {feedbackMessage}
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cardsPerRow}, 1fr)`,
          gap: "12px",
          marginBottom: "30px",
          maxWidth: "700px",
          margin: "0 auto 30px",
        }}
      >
        {cards.map((card, idx) => (
          <button
            key={idx}
            onClick={() => handleCardFlip(idx)}
            style={{
              aspectRatio: "1",
              borderRadius: "8px",
              border: "2px solid rgba(255,255,255,0.3)",
              fontSize: "14px",
              fontWeight: "600",
              cursor: matched.has(idx) ? "default" : "pointer",
              padding: "16px",
              textAlign: "center",
              transition: "all 0.3s ease",
              background: matched.has(idx)
                ? "rgba(16, 185, 129, 0.3)"
                : flipped.has(idx)
                ? "#fbbf24"
                : "rgba(255,255,255,0.15)",
              color: "white",
              opacity: matched.has(idx) ? 0.6 : 1,
              transform: flipped.has(idx) || matched.has(idx) ? "scale(1)" : "scale(0.95)",
              boxShadow: flipped.has(idx) ? "0 4px 15px rgba(0,0,0,0.3)" : "none",
            }}
            onMouseEnter={(e) => {
              if (!matched.has(idx)) {
                e.target.style.transform = "scale(1.05)";
              }
            }}
            onMouseLeave={(e) => {
              if (!matched.has(idx)) {
                e.target.style.transform = flipped.has(idx) ? "scale(1)" : "scale(0.95)";
              }
            }}
          >
            {flipped.has(idx) || matched.has(idx) ? (
              <div>
                <div style={{ fontSize: "28px", marginBottom: "4px" }}>
                  {card.emoji || "🎯"}
                </div>
                <div style={{ fontSize: "11px", lineHeight: "1.2" }}>{card.label}</div>
              </div>
            ) : (
              <div style={{ fontSize: "32px" }}>?</div>
            )}
          </button>
        ))}
      </div>

      {matched.size === cards.length && (
        <div
          style={{
            background: "rgba(0,0,0,0.4)",
            padding: "40px 30px",
            borderRadius: "12px",
            textAlign: "center",
            marginTop: "30px",
            animation: "slideUp 0.5s ease-out",
          }}
        >
          <h3 style={{ fontSize: "32px", marginTop: 0, marginBottom: "10px" }}>🎉 Excellent!</h3>
          <p style={{ fontSize: "18px", marginBottom: "8px", opacity: 0.9 }}>
            You completed the Memory Game!
          </p>
          <p style={{ fontSize: "16px", marginBottom: "20px", opacity: 0.8 }}>
            Completed in {moves} moves with a score of {score}/100
          </p>
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

export default MemoryGame;
