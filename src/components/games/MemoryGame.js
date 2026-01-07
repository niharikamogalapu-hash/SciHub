import React, { useState, useEffect } from "react";

function MemoryGame({ gameData, onComplete, onExit }) {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState(new Set());
  const [matched, setMatched] = useState(new Set());
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(100);
  const [firstCard, setFirstCard] = useState(null);
  const [canFlip, setCanFlip] = useState(true);

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

        // Check if game is complete
        if (newMatched.size === cards.length) {
          setTimeout(() => handleGameComplete(), 500);
        }
      } else {
        setScore(Math.max(0, score - 2));
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
      }, 600);
    }
  };

  const handleGameComplete = () => {
    const finalScore = Math.max(50, Math.min(100, score + Math.floor(30 - moves / 2)));
    onComplete(finalScore);
  };

  if (!cards.length) return <div>Loading...</div>;

  return (
    <div
      style={{
        padding: "40px",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
          <div>Moves: {moves}</div>
          <div>Score: {score}</div>
          <div>Matched: {matched.size / 2}/{cards.length / 2}</div>
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
        {gameData.description}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
          gap: "12px",
          marginBottom: "30px",
          maxWidth: "600px",
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
              border: "none",
              fontSize: "14px",
              fontWeight: "600",
              cursor: matched.has(idx) ? "default" : "pointer",
              padding: "16px",
              textAlign: "center",
              transition: "all 0.3s ease",
              background: matched.has(idx)
                ? "#10b981"
                : flipped.has(idx)
                ? "#fbbf24"
                : "rgba(255,255,255,0.2)",
              color: "white",
              transform: flipped.has(idx) ? "rotateY(0deg)" : "rotateY(90deg)",
              opacity: matched.has(idx) ? 0.6 : 1,
            }}
          >
            {flipped.has(idx) || matched.has(idx) ? (
              <div>
                <div style={{ fontSize: "20px", marginBottom: "4px" }}>
                  {card.emoji || "🎯"}
                </div>
                <div style={{ fontSize: "12px" }}>{card.label}</div>
              </div>
            ) : (
              "?"
            )}
          </button>
        ))}
      </div>

      {matched.size === cards.length && (
        <div
          style={{
            background: "rgba(0,0,0,0.3)",
            padding: "30px",
            borderRadius: "12px",
            textAlign: "center",
            marginTop: "30px",
          }}
        >
          <h3 style={{ fontSize: "24px", marginTop: 0 }}>🎉 Perfect!</h3>
          <p style={{ fontSize: "18px", marginBottom: "20px" }}>
            Completed in {moves} moves! Score: {score}/100
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
            Claim Reward
          </button>
        </div>
      )}
    </div>
  );
}

export default MemoryGame;
