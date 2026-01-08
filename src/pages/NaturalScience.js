import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function NaturalScience() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("✅ Natural Science page loaded");
    setLoading(false);
  }, []);

  const sciences = [
    {
      id: "biology",
      title: "Biology",
      icon: "🧬",
      emoji: "🧬",
      color: "from-green-500 to-emerald-600",
      borderColor: "#10b981",
      lightColor: "rgba(16, 185, 129, 0.1)",
      description: "Cells, organisms and ecosystems — 10-lesson unit.",
      longDesc: "Explore the living world from microscopic cells to complex ecosystems. Learn about genetics, evolution, and the interconnected web of life.",
      topics: ["Cell Structure", "Genetics", "Evolution", "Ecosystems"]
    },
    {
      id: "chemistry",
      title: "Chemistry",
      icon: "⚗️",
      emoji: "⚗️",
      color: "from-blue-500 to-cyan-600",
      borderColor: "#0ea5e9",
      lightColor: "rgba(6, 182, 212, 0.1)",
      description: "Atoms, reactions and materials.",
      longDesc: "Dive into the world of atoms and molecules. Understand chemical reactions, bonding, and how matter transforms.",
      topics: ["Atomic Structure", "Chemical Bonding", "Reactions", "Periodic Table"]
    },
    {
      id: "physics",
      title: "Physics",
      icon: "⚡",
      emoji: "⚡",
      color: "from-yellow-500 to-orange-600",
      borderColor: "#f59e0b",
      lightColor: "rgba(245, 158, 11, 0.1)",
      description: "Motion, forces and energy.",
      longDesc: "Discover the fundamental laws governing motion, force, energy, and the universe. From Newton to Einstein.",
      topics: ["Motion", "Forces", "Energy", "Waves"]
    },
    {
      id: "environmental-science",
      title: "Environmental Science",
      icon: "🌍",
      emoji: "🌍",
      color: "from-teal-500 to-green-600",
      borderColor: "#14b8a6",
      lightColor: "rgba(20, 184, 166, 0.1)",
      description: "Ecosystems, conservation and human impact.",
      longDesc: "Understand Earth's systems, climate, biodiversity, and sustainable practices for a healthy planet.",
      topics: ["Climate", "Ecosystems", "Conservation", "Sustainability"]
    }
  ];

  return (
    <div className="dashboard-page">
      <Sidebar />

      <main className="dashboard-main">
        {/* Hero Section */}
        <header style={{
          background: "linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)",
          padding: "60px 40px",
          borderRadius: "16px",
          marginBottom: "40px",
          color: "white",
          boxShadow: "0 20px 40px rgba(16, 185, 129, 0.2)"
        }}>
          <h1 style={{ fontSize: "3.5rem", margin: "0 0 20px 0", fontWeight: "800" }}>🌿 Natural Science</h1>
          <p style={{ fontSize: "1.2rem", margin: 0, opacity: 0.95, maxWidth: "600px" }}>
            Explore Biology, Chemistry, Physics and Environmental Science. Build knowledge of the natural world with engaging lessons and interactive learning.
          </p>
        </header>

        {loading ? (
          <p style={{ textAlign: "center", color: "#9ca3af", fontSize: "1.1rem" }}>Loading...</p>
        ) : (
          <div>
            {/* Introduction */}
            <div style={{
              background: "rgba(16, 185, 129, 0.08)",
              border: "2px solid rgba(16, 185, 129, 0.2)",
              padding: "30px",
              borderRadius: "12px",
              marginBottom: "40px",
              color: "#d1fae5"
            }}>
              <p style={{ margin: 0, fontSize: "1.05rem", lineHeight: "1.6" }}>
                Start with <strong>Biology</strong> as your foundation — it's the key to understanding everything! From there, we'll guide you through Chemistry, Physics, and Environmental Science in a logical progression that builds on what you've learned.
              </p>
            </div>

            {/* Science Grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "30px",
              marginBottom: "40px"
            }}>
              {sciences.map((science) => (
                <div
                  key={science.id}
                  onClick={() => navigate(`/natural/${science.id}`)}
                  style={{
                    background: `linear-gradient(135deg, ${science.lightColor}, ${science.lightColor}dd)`,
                    border: `2px solid ${science.borderColor}`,
                    borderRadius: "16px",
                    padding: "30px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    transform: "scale(1)",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
                    e.currentTarget.style.boxShadow = `0 16px 32px ${science.borderColor}30`;
                    e.currentTarget.style.borderColor = science.borderColor;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
                  }}
                >
                  {/* Icon */}
                  <div style={{
                    fontSize: "4rem",
                    marginBottom: "16px",
                    filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))"
                  }}>
                    {science.emoji}
                  </div>

                  {/* Title */}
                  <h3 style={{
                    fontSize: "1.8rem",
                    fontWeight: "700",
                    margin: "0 0 12px 0",
                    color: "#f0fdf4"
                  }}>
                    {science.title}
                  </h3>

                  {/* Description */}
                  <p style={{
                    fontSize: "0.95rem",
                    color: "#d1fae5",
                    margin: "0 0 16px 0",
                    minHeight: "40px",
                    lineHeight: "1.5"
                  }}>
                    {science.description}
                  </p>

                  {/* Topics */}
                  <div style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                    marginTop: "16px"
                  }}>
                    {science.topics.map((topic) => (
                      <span
                        key={topic}
                        style={{
                          background: "rgba(255, 255, 255, 0.1)",
                          color: "#a7f3d0",
                          padding: "4px 12px",
                          borderRadius: "6px",
                          fontSize: "0.75rem",
                          fontWeight: "600",
                          border: `1px solid ${science.borderColor}40`
                        }}
                      >
                        {topic}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <div style={{
                    marginTop: "20px",
                    paddingTop: "16px",
                    borderTop: `1px solid ${science.borderColor}40`,
                    color: "#a7f3d0",
                    fontSize: "0.9rem",
                    fontWeight: "600"
                  }}>
                    Click to explore →
                  </div>
                </div>
              ))}
            </div>

            {/* Info Box */}
            <div style={{
              background: "rgba(51, 65, 85, 0.3)",
              border: "1px solid rgba(100, 116, 139, 0.3)",
              padding: "30px",
              borderRadius: "12px",
              color: "#cbd5e1",
              textAlign: "center"
            }}>
              <p style={{ margin: 0, fontSize: "1rem", lineHeight: "1.6" }}>
                💡 <strong>Tip:</strong> Each subject includes video lessons, interactive quizzes, tutoring sessions, and hands-on activities. 
                <br />Complete lessons to earn XP and unlock achievements! 🏆
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default NaturalScience;
