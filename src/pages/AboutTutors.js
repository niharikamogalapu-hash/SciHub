import React, { useState, useEffect } from "react";

export const teamMembers = [
  { name: "Sarah Mitchell", role: "Student Tutor - AP Biology", emoji: "🧬", desc: "Student tutor who knows what it feels like to struggle at first. Peer-to-peer support!", color: "#38bdf8" },
  { name: "James Wilson ", role: "Student Tutor - AP Biology", emoji: "🧬", desc: "Student tutor passionate about evolutionary biology and helping fellow students succeed.", color: "#22c55e" },
  { name: "Chen ", role: "Student Tutor - AP Chemistry", emoji: "⚛️", desc: "Makes chemistry feel like solving puzzles instead of memorizing formulas.", color: "#ec4899" },
  { name: "Ahmed Hassan ", role: "Student Tutor - AP Chemistry", emoji: "⚛️", desc: "Specializes in breaking down complex organic reactions into simple steps.", color: "#a855f7" },
  { name: "Patel ", role: "Student Tutor - AP Physics", emoji: "🧲", desc: "Uses real-life examples to explain physics step-by-step.", color: "#fbbf24" },
  { name: "Elena Rodriguez ", role: "Student Tutor - AP Physics", emoji: "🧲", desc: "Passionate about making physics intuitive through demonstrations.", color: "#8b5cf6" },
  { name: "Marcus Green ", role: "Student Tutor - AP Environmental Science", emoji: "🌍", desc: "Combines field experience with classroom teaching for deep understanding.", color: "#06b6d4" },
  { name: "Lisa Park ", role: "Student Tutor - AP Environmental Science", emoji: "🌱", desc: "Advocates for practical solutions to real environmental challenges.", color: "#10b981" },
  { name: "David Thompson ", role: "Student Tutor - History", emoji: "📜", desc: "Brings history to life through engaging narratives and primary sources.", color: "#f59e0b" },
  { name: "Margaret Flynn ", role: "Student Tutor - History", emoji: "📜", desc: "Expert in connecting historical events to modern-day relevance.", color: "#a855f7" },
  { name: "Carlos Mendez ", role: "Student Tutor - AP Human Geography", emoji: "🌐", desc: "Explores the fascinating connections between people and places worldwide.", color: "#38bdf8" },
  { name: "Sophie Laurent ", role: "Student Tutor - AP Human Geography", emoji: "🌐", desc: "Makes geography concepts accessible and relevant to daily life.", color: "#22c55e" },
  { name: "Robert Kim ", role: "Student Tutor - Economics", emoji: "💸", desc: "Demystifies economics with real-world examples and case studies.", color: "#fbbf24" },
  { name: "Patricia Garcia ", role: "Student Tutor - Economics", emoji: "💸", desc: "Explains global economics in a way that makes sense to everyone.", color: "#ec4899" },
  { name: "Nathan Cohen ", role: "Student Tutor - AP Psychology", emoji: "🧠", desc: "Helps students understand themselves and others through psychology.", color: "#06b6d4" },
  { name: "Amanda Walsh ", role: "Student Tutor - AP Psychology", emoji: "🧠", desc: "Compassionate tutor who connects psychology theory to real-world applications.", color: "#a855f7" },
];

// ...existing code...
export function getTutorsBySubject(subject) {
  // Extract subject from role and match
  return teamMembers.filter(member => {
    const match = member.role.match(/-\s*(.+)$/);
    const memberSubject = match ? match[1].trim().toLowerCase() : "other";
    return memberSubject === subject.trim().toLowerCase();
  });
}

function AboutTutors() {
  const [hoveredMember, setHoveredMember] = useState(null);
  const [hoveredFounder, setHoveredFounder] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Founders data in same format as tutors
  const founders = [
    {
      name: "Niharika",
      role: "Founder & Lead Developer",
      emoji: "💻",
      desc: "Built the entire SciHub platform from scratch with brilliant technical expertise.",
      color: "#38bdf8"
    },
    {
      name: "Parimita",
      role: "Founder & Creative Director",
      emoji: "🎨",
      desc: "Shaped SciHub's vision, curriculum, and creative direction with innovative ideas.",
      color: "#a855f7"
    },
    {
      name: "Karthikashree",
      role: "Quality Assurance & Testing Specialist",
      emoji: "🐛",
      desc: "Dedicated QA specialist who found critical bugs and helped refine the platform, ensuring quality and reliability.",
      color: "#22c55e"
    }
  ];

  // Group tutors by subject
  const subjectMap = {};
  teamMembers.forEach((member) => {
    // Extract subject from role (e.g., "Student Tutor - AP Biology" => "AP Biology")
    const match = member.role.match(/-\s*(.+)$/);
    const subject = match ? match[1].trim() : "Other";
    if (!subjectMap[subject]) subjectMap[subject] = [];
    subjectMap[subject].push(member);
  });

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

        {/* Founders Grid - visually matches tutors */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem", marginBottom: "4rem" }}>
          {founders.map((founder, i) => (
            <div
              key={i}
              className="card"
              onMouseEnter={() => setHoveredFounder(i)}
              onMouseLeave={() => setHoveredFounder(null)}
              style={{
                padding: "2.5rem",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                transform: hoveredFounder === i ? "translateY(-12px) scale(1.02)" : "translateY(0) scale(1)",
                boxShadow: hoveredFounder === i 
                  ? `0 25px 70px ${founder.color}40, 0 0 40px ${founder.color}20` 
                  : "0 10px 30px rgba(15, 23, 42, 0.5)",
                border: hoveredFounder === i 
                  ? `2px solid ${founder.color}` 
                  : "1px solid rgba(56, 189, 248, 0.2)",
                background: hoveredFounder === i
                  ? `radial-gradient(circle at top left, ${founder.color}15 0%, transparent 60%)`
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
                transform: hoveredFounder === i ? "scale(1.3) rotate(15deg)" : "scale(1) rotate(0deg)", 
                transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                textShadow: hoveredFounder === i ? `0 0 20px ${founder.color}60` : "none",
              }}>
                {founder.emoji}
              </div>
              <h3 style={{ fontSize: "1.4rem", marginTop: "0", marginBottom: "0.5rem", color: founder.color, fontWeight: "700" }}>
                {founder.name}
              </h3>
              <p style={{ color: founder.color, fontWeight: "600", marginTop: "0", marginBottom: "1rem", fontSize: "0.9rem", opacity: "0.9" }}>
                {founder.role}
              </p>
              <p style={{ color: "#9ca3af", marginBottom: "0", lineHeight: "1.7", fontSize: "0.95rem" }}>
                {founder.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Tutors grouped by subject */}
        <div className="slide-up" style={{ marginBottom: "4rem", textAlign: "center" }}>
          <h1 style={{ fontSize: "3.5rem", fontWeight: "700", marginBottom: "1rem", marginTop: "0", background: "linear-gradient(135deg, #38bdf8 0%, #a855f7 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            Meet the Tutors
          </h1>
          <p style={{ fontSize: "1.1rem", color: "#9ca3af", maxWidth: "700px", margin: "0 auto", lineHeight: "1.8" }}>
            The educators behind SciHub, they love to include all student and make them understand the core concepts of AP.
          </p>
        </div>

        {/* Render tutors by subject */}
        {Object.keys(subjectMap).map((subject, idx) => (
          <div key={subject} style={{ marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "1.5rem", color: "#38bdf8", textAlign: "left" }}>
              {subject}
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
              {subjectMap[subject].map((member, i) => (
                <div
                  key={i}
                  className="card"
                  onMouseEnter={() => setHoveredMember(`${subject}-${i}`)}
                  onMouseLeave={() => setHoveredMember(null)}
                  style={{
                    padding: "2.5rem",
                    cursor: "pointer",
                    transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    transform: hoveredMember === `${subject}-${i}` ? "translateY(-12px) scale(1.02)" : "translateY(0) scale(1)",
                    boxShadow: hoveredMember === `${subject}-${i}` 
                      ? `0 25px 70px ${member.color}40, 0 0 40px ${member.color}20` 
                      : "0 10px 30px rgba(15, 23, 42, 0.5)",
                    border: hoveredMember === `${subject}-${i}` 
                      ? `2px solid ${member.color}` 
                      : "1px solid rgba(56, 189, 248, 0.2)",
                    background: hoveredMember === `${subject}-${i}`
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
                    transform: hoveredMember === `${subject}-${i}` ? "scale(1.3) rotate(15deg)" : "scale(1) rotate(0deg)", 
                    transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    textShadow: hoveredMember === `${subject}-${i}` ? `0 0 20px ${member.color}60` : "none",
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
          </div>
        ))}

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
