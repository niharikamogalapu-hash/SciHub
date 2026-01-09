import React, { useState, useEffect } from "react";

function Mission() {
  const [hoveredPillar, setHoveredPillar] = useState(null);
  const [hoveredWhy, setHoveredWhy] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const pillars = [
    { emoji: "♿", title: "Accessible for Everyone", desc: "SciHub is designed to work beautifully on laptops, tablets, and phones. High‑contrast visuals, readable fonts, and clean layouts ensure every student can learn comfortably.", color: "#38bdf8" },
    { emoji: "🤝", title: "Powered by Community", desc: "Students, peer tutors, and teachers come together to support one another. Learning becomes a shared journey — not something you do alone.", color: "#a855f7" },
    { emoji: "🎯", title: "Motivation Built In", desc: "Games, progress tracking, AI encouragement, and personalized feedback help students stay engaged and excited about science.", color: "#fbbf24" },
  ];



  return (
    <section className="page fade-in">
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
        {/* Header */}
        <div className="slide-up" style={{ marginBottom: "4rem", textAlign: "center" }}>
          <h1 style={{ fontSize: "3.5rem", fontWeight: "700", marginBottom: "1rem", marginTop: "0", background: "linear-gradient(135deg, #38bdf8 0%, #a855f7 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            Our Mission
          </h1>
          <p style={{ fontSize: "1.1rem", color: "#9ca3af", maxWidth: "700px", margin: "0 auto", lineHeight: "1.8" }}>
            SciHub exists to make science learning engaging, collaborative, and accessible for every student. We combine AI support, interactive tools, and live tutoring to help learners build confidence, curiosity, and mastery — one concept at a time.
          </p>
        </div>

        {/* Mission Pillars Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem", marginBottom: "4rem" }}>
          {pillars.map((pillar, i) => (
            <div
              key={i}
              className="card"
              onMouseEnter={() => setHoveredPillar(i)}
              onMouseLeave={() => setHoveredPillar(null)}
              style={{
                padding: "2.5rem",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                transform: hoveredPillar === i ? "translateY(-12px) scale(1.02)" : "translateY(0) scale(1)",
                boxShadow: hoveredPillar === i 
                  ? `0 25px 70px ${pillar.color}40, 0 0 40px ${pillar.color}20` 
                  : "0 10px 30px rgba(15, 23, 42, 0.5)",
                border: hoveredPillar === i 
                  ? `2px solid ${pillar.color}` 
                  : "1px solid rgba(56, 189, 248, 0.2)",
                background: hoveredPillar === i
                  ? `radial-gradient(circle at top left, ${pillar.color}15 0%, transparent 60%)`
                  : "transparent",
                animation: `slideUp 0.6s ease forwards`,
                animationDelay: `${i * 0.08}s`,
                opacity: 0,
                borderRadius: "16px",
              }}
            >
              <div style={{ 
                fontSize: "3.2rem", 
                marginBottom: "1.2rem", 
                display: "inline-block", 
                transform: hoveredPillar === i ? "scale(1.3) rotate(15deg)" : "scale(1) rotate(0deg)", 
                transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                textShadow: hoveredPillar === i ? `0 0 20px ${pillar.color}60` : "none",
              }}>
                {pillar.emoji}
              </div>
              <h3 style={{ fontSize: "1.4rem", marginTop: "0", marginBottom: "0.8rem", color: pillar.color, fontWeight: "700" }}>
                {pillar.title}
              </h3>
              <p style={{ color: "#9ca3af", marginBottom: "0", lineHeight: "1.7", fontSize: "0.95rem" }}>
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Vision Section */}
        <div className="slide-up" style={{
          background: "linear-gradient(135deg, #38bdf8 0%, #a855f7 100%)",
          borderRadius: "20px",
          padding: "3rem 2.5rem",
          textAlign: "center",
          cursor: "pointer",
          transition: "all 0.3s ease",
          animation: `slideUp 0.6s ease forwards`,
          animationDelay: "0.6s",
          opacity: 0,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-8px)";
          e.currentTarget.style.boxShadow = "0 20px 60px rgba(56, 189, 248, 0.4)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 10px 30px rgba(56, 189, 248, 0.2)";
        }}
        >
          <h2 style={{ fontSize: "2rem", color: "#fff", marginTop: "0", marginBottom: "1rem", fontWeight: "700" }}>
            ✨ Our Vision
          </h2>
          <p style={{ fontSize: "1.1rem", color: "rgba(255, 255, 255, 0.9)", marginBottom: "0", maxWidth: "600px", margin: "0 auto" }}>
            We imagine a world where every student feels confident exploring science — where learning is interactive, personalized, and inspiring. SciHub is built to help students discover their potential and unlock a lifelong love of learning.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </section>
  );
}

export default Mission;

