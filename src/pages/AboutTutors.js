import React, { useState, useEffect } from "react";

const teamMembers = [
  { name: "Niharika", role: "Founder & Lead Developer", emoji: "💻", desc: "Built the entire SciHub platform from scratch with brilliant technical expertise." },
  { name: "Parimita", role: "Founder & Creative Director", emoji: "🎨", desc: "Shaped SciHub's vision, curriculum, and creative direction with innovative ideas." },
  { name: "Ms. Chen", role: "Physics & Chemistry Tutor", emoji: "⚛️", desc: "Expert educator with 15+ years of experience making complex concepts clear." },
  { name: "Mr. Patel", role: "Biology Tutor", emoji: "🧬", desc: "Passionate about making science accessible and helping students understand life sciences." },
  { name: "Sarah", role: "Peer Tutor", emoji: "📚", desc: "High school student and science enthusiast who gets what students need." },
];

function AboutTutors() {
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="page fade-in">
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "2rem" }}>
        {/* Header */}
        <div className="slide-up" style={{ marginBottom: "4rem", textAlign: "center" }}>
          <h1 style={{ fontSize: "3.5rem", fontWeight: "700", marginBottom: "1rem", marginTop: "0", background: "linear-gradient(135deg, #38bdf8 0%, #a855f7 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            Meet the Team
          </h1>
          <p style={{ fontSize: "1.1rem", color: "#9ca3af", maxWidth: "700px", margin: "0 auto", lineHeight: "1.8" }}>
            The people who make SciHub possible
          </p>
        </div>

        {/* Team Members Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
          {teamMembers.map((member, i) => (
            <div
              key={i}
              className="card"
              style={{
                padding: "2rem",
                animation: `slideUp 0.7s ease forwards`,
                animationDelay: `${i * 0.1}s`,
                opacity: 0,
                borderLeft: "3px solid #38bdf8",
                background: "radial-gradient(circle at top left, #1f2937 0, #020617 60%)",
                cursor: "pointer",
                transition: "all 0.3s ease",
                transform: hoveredCard === i ? "translateY(-8px)" : "translateY(0)",
                boxShadow: hoveredCard === i ? "0 20px 60px rgba(56, 189, 248, 0.3)" : "0 10px 30px rgba(15, 23, 42, 0.5)",
              }}
              onMouseEnter={() => setHoveredCard(i)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>{member.emoji}</div>
              <h3 style={{ fontSize: "1.4rem", color: "#38bdf8", marginTop: "0", marginBottom: "0.5rem" }}>{member.name}</h3>
              <p style={{ color: "#a855f7", fontWeight: "600", marginTop: "0", marginBottom: "1rem", fontSize: "0.9rem" }}>{member.role}</p>
              <p style={{ color: "#f9fafb", marginBottom: "0", fontSize: "0.95rem", lineHeight: "1.6" }}>{member.desc}</p>
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
    </section>
  );
}

export default AboutTutors;
