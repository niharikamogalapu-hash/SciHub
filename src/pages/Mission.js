import React, { useState, useEffect } from "react";

function Mission() {
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const pillars = [
    { emoji: "♿", title: "Accessible for Everyone", desc: "SciHub is designed to work beautifully on laptops, tablets, and phones. High‑contrast visuals, readable fonts, and clean layouts ensure every student can learn comfortably.", color: "#38bdf8" },
    { emoji: "🤝", title: "Powered by Community", desc: "Students, peer tutors, and teachers come together to support one another. Learning becomes a shared journey — not something you do alone.", color: "#a855f7" },
    { emoji: "🎯", title: "Motivation Built In", desc: "Games, progress tracking, AI encouragement, and personalized feedback help students stay engaged and excited about science.", color: "#38bdf8" },
    { emoji: "🤖", title: "AI‑Enhanced Learning", desc: "SciPet, your AI study companion, helps you understand concepts, find resources, and stay on track with your goals.", color: "#a855f7" },
  ];

  return (
    <section className="page fade-in">
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* Header Section */}
        <div className="slide-up" style={{ marginBottom: "4rem", textAlign: "center" }}>
          <h1 style={{ fontSize: "3.5rem", fontWeight: "700", marginBottom: "1rem", marginTop: "0", background: "linear-gradient(135deg, #38bdf8 0%, #a855f7 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            Our Mission
          </h1>
          <p style={{ fontSize: "1.1rem", color: "#9ca3af", marginBottom: "0", maxWidth: "750px", margin: "0 auto", lineHeight: "1.8" }}>
            SciHub exists to make science learning engaging, collaborative, and accessible for 
            every student. We combine AI support, interactive tools, and live tutoring to help 
            learners build confidence, curiosity, and mastery — one concept at a time.
          </p>
        </div>

        {/* Mission Pillars */}
        <div style={{ marginBottom: "4rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem" }}>
            {pillars.map((pillar, i) => (
              <div
                key={i}
                style={{
                  background: `linear-gradient(135deg, rgba(56, 189, 248, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)`,
                  border: `2px solid ${pillar.color}`,
                  borderRadius: "16px",
                  padding: "2rem",
                  cursor: "pointer",
                  animation: `slideUp 0.7s ease forwards`,
                  animationDelay: `${i * 0.15}s`,
                  opacity: 0,
                  transition: "all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  transform: hoveredCard === `pillar-${i}` ? "scale(1.05) translateY(-12px)" : "scale(1) translateY(0)",
                  boxShadow: hoveredCard === `pillar-${i}` ? `0 25px 70px ${pillar.color}35` : "0 10px 30px rgba(15, 23, 42, 0.5)",
                }}
                onMouseEnter={() => setHoveredCard(`pillar-${i}`)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div style={{ 
                  fontSize: "2.8rem", 
                  marginBottom: "1rem",
                  display: "inline-block",
                  transition: "transform 0.3s ease",
                  transform: hoveredCard === `pillar-${i}` ? "rotate(12deg) scale(1.15)" : "rotate(0deg) scale(1)",
                }}>
                  {pillar.emoji}
                </div>
                <h3 style={{ fontSize: "1.3rem", marginTop: "0", marginBottom: "0.8rem", color: pillar.color }}>{pillar.title}</h3>
                <p style={{ color: "#f9fafb", marginBottom: "0", fontSize: "0.95rem", lineHeight: "1.6" }}>{pillar.desc}</p>
              </div>
            ))}
          </div>
          <style>{`
            @keyframes slideUp {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </div>

        {/* Vision Section */}
        <div>
          <div
            className="card"
            style={{
              textAlign: "center",
              padding: "3rem 2.5rem",
              background: "linear-gradient(135deg, rgba(56, 189, 248, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)",
              border: "1px solid rgba(56, 189, 248, 0.3)",
              borderRadius: "20px",
              cursor: "pointer",
              transition: "all 0.3s ease",
              animation: "slideUp 0.8s ease forwards",
              animationDelay: "0.6s",
              opacity: 0,
              transform: hoveredCard === "vision" ? "translateY(-8px)" : "translateY(0)",
              boxShadow: hoveredCard === "vision" ? "0 30px 80px rgba(56, 189, 248, 0.2)" : "0 10px 30px rgba(15, 23, 42, 0.5)",
            }}
            onMouseEnter={() => setHoveredCard("vision")}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <h2 style={{ fontSize: "2.2rem", marginTop: "0", marginBottom: "1.5rem", background: "linear-gradient(135deg, #38bdf8 0%, #a855f7 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              ✨ Our Vision
            </h2>
            <p style={{ maxWidth: "720px", margin: "0 auto", color: "#f9fafb", fontSize: "1.05rem", lineHeight: "1.8" }}>
              We imagine a world where every student feels confident exploring science — 
              where learning is interactive, personalized, and inspiring. SciHub is built 
              to help students discover their potential and unlock a lifelong love of learning.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Mission;

