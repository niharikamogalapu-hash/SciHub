import React, { useState, useEffect } from "react";

const teamMembers = [
  { name: "Niharika", role: "Founder & Lead Developer", emoji: "💻", desc: "Built the entire SciHub platform from scratch with brilliant technical expertise.", color: "#38bdf8" },
  { name: "Parimita", role: "Founder & Creative Director", emoji: "🎨", desc: "Shaped SciHub's vision, curriculum, and creative direction with innovative ideas.", color: "#a855f7" },
  { name: "Karthikashree", role: "Quality Assurance & Testing Specialist", emoji: "🐛", desc: "Dedicated QA specialist who found critical bugs and helped refine the platform, ensuring quality and reliability.", color: "#10b981" },
  { name: "Mr. Patel", role: "Biology Specialist", emoji: "🧬", desc: "Expert in cellular biology, genetics, and ecology with 15+ years of teaching experience.", color: "#22c55e" },
  { name: "Ms. Chen", role: "Chemistry & Physics Specialist", emoji: "⚛️", desc: "Passionate about making complex chemistry and physics concepts clear and engaging.", color: "#ec4899" },
  { name: "Dr. Alex Rivers", role: "Environmental Science Specialist", emoji: "🌍", desc: "Specialist in Earth Systems and sustainability with focus on real-world applications.", color: "#06b6d4" },
  { name: "Prof. Emma Rodriguez", role: "Social Sciences Specialist", emoji: "🌐", desc: "Expert in Economics, History, Geography, and Psychology with 12+ years of experience.", color: "#f59e0b" },
  { name: "Sarah", role: "Peer Tutor", emoji: "📚", desc: "High school student and science enthusiast who understands student challenges firsthand.", color: "#fbbf24" },
  { name: "Alex", role: "Peer Tutor", emoji: "✨", desc: "College freshman passionate about science education and helping peers succeed.", color: "#8b5cf6" },
];

function AboutTutors() {
  const [hoveredMember, setHoveredMember] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="page fade-in">
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
        {/* Header */}
        <div className="slide-up" style={{ marginBottom: "4rem", textAlign: "center" }}>
          <h1 style={{ fontSize: "3.5rem", fontWeight: "700", marginBottom: "1rem", marginTop: "0", background: "linear-gradient(135deg, #38bdf8 0%, #a855f7 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            Meet the Team
          </h1>
          <p style={{ fontSize: "1.1rem", color: "#9ca3af", maxWidth: "700px", margin: "0 auto", lineHeight: "1.8" }}>
            The passionate educators and developers behind SciHub, dedicated to making science learning engaging and accessible for every student.
          </p>
        </div>

        {/* Team Members Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem", marginBottom: "4rem" }}>
          {teamMembers.map((member, i) => (
            <div
              key={i}
              className="card"
              onMouseEnter={() => setHoveredMember(i)}
              onMouseLeave={() => setHoveredMember(null)}
              style={{
                padding: "2.5rem",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                transform: hoveredMember === i ? "translateY(-12px) scale(1.02)" : "translateY(0) scale(1)",
                boxShadow: hoveredMember === i 
                  ? `0 25px 70px ${member.color}40, 0 0 40px ${member.color}20` 
                  : "0 10px 30px rgba(15, 23, 42, 0.5)",
                border: hoveredMember === i 
                  ? `2px solid ${member.color}` 
                  : "1px solid rgba(56, 189, 248, 0.2)",
                background: hoveredMember === i
                  ? `radial-gradient(circle at top left, ${member.color}15 0%, transparent 60%)`
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
                transform: hoveredMember === i ? "scale(1.3) rotate(15deg)" : "scale(1) rotate(0deg)", 
                transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                textShadow: hoveredMember === i ? `0 0 20px ${member.color}60` : "none",
              }}>
                {member.emoji}
              </div>
              <h3 style={{ fontSize: "1.4rem", marginTop: "0", marginBottom: "0.5rem", color: member.color, fontWeight: "700" }}>
                {member.name}
              </h3>
              <p style={{ color: member.color, fontWeight: "600", marginTop: "0", marginBottom: "1rem", fontSize: "0.9rem", opacity: "0.9" }}>
                {member.role}
              </p>
              <p style={{ color: "#9ca3af", marginBottom: "0", lineHeight: "1.7", fontSize: "0.95rem" }}>
                {member.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Impact CTA Banner */}
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
            Ready to Learn from the Best?
          </h2>
          <p style={{ fontSize: "1.1rem", color: "rgba(255, 255, 255, 0.9)", marginBottom: "0", maxWidth: "600px", margin: "0 auto" }}>
            Join our community and experience science education guided by passionate tutors and built on cutting-edge technology.
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

export default AboutTutors;
