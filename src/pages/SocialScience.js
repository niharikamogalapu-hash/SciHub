import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function SocialScience() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("✅ Social Science page loaded");
    setLoading(false);
  }, []);

  const sciences = [
    {
      id: "psychology",
      title: "AP Psychology",
      icon: "🧠",
      emoji: "🧠",
      color: "from-purple-500 to-pink-600",
      borderColor: "#a855f7",
      lightColor: "rgba(168, 85, 247, 0.1)",
      description: "Behavior, cognition and mental processes — 10-lesson unit.",
      longDesc: "Understand human behavior, thinking, emotions, and mental health. Explore how minds work and why people act the way they do.",
      topics: ["Cognition", "Behavior", "Mental Health", "Development"]
    },
    {
      id: "human-geography",
      title: "AP Human Geography",
      icon: "🌎",
      emoji: "🌎",
      color: "from-red-500 to-orange-600",
      borderColor: "#ef4444",
      lightColor: "rgba(239, 68, 68, 0.1)",
      description: "How people interact with places and environments.",
      longDesc: "Explore cultures, societies, and how geography shapes human experience. Study migration, urbanization, and global systems.",
      topics: ["Culture", "Migration", "Urban Systems", "Globalization"]
    },
    {
      id: "history",
      title: "History",
      icon: "📜",
      emoji: "📜",
      color: "from-amber-500 to-yellow-600",
      borderColor: "#f59e0b",
      lightColor: "rgba(245, 158, 11, 0.1)",
      description: "Events and movements shaping the world.",
      longDesc: "Discover pivotal moments, civilizations, and social movements that shaped our modern world. Learn from the past.",
      topics: ["Civilizations", "Revolutions", "Wars", "Movements"]
    },
    {
      id: "economics",
      title: "Economics",
      icon: "💹",
      emoji: "💹",
      color: "from-green-500 to-teal-600",
      borderColor: "#14b8a6",
      lightColor: "rgba(20, 184, 166, 0.1)",
      description: "Markets, choices and economic systems.",
      longDesc: "Learn how economies work, from personal finance to global markets. Understand supply, demand, and economic policy.",
      topics: ["Markets", "Supply & Demand", "Macroeconomics", "Policy"]
    }
  ];

  return (
    <div className="dashboard-page">
      <Sidebar />

      <main className="dashboard-main">
        {/* Hero Section */}
        <header style={{
          background: "linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #f43f5e 100%)",
          padding: "60px 40px",
          borderRadius: "16px",
          marginBottom: "40px",
          color: "white",
          boxShadow: "0 20px 40px rgba(168, 85, 247, 0.2)"
        }}>
          <h1 style={{ fontSize: "3.5rem", margin: "0 0 20px 0", fontWeight: "800" }}>🌐 Social Science</h1>
          <p style={{ fontSize: "1.2rem", margin: 0, opacity: 0.95, maxWidth: "600px" }}>
            Explore AP Psychology, History, AP Human Geography and Economics. Understand people, societies and the forces that shape our world.
          </p>
        </header>

        {loading ? (
          <p style={{ textAlign: "center", color: "#9ca3af", fontSize: "1.1rem" }}>Loading...</p>
        ) : (
          <div>
            {/* Introduction */}
            <div style={{
              background: "rgba(168, 85, 247, 0.08)",
              border: "2px solid rgba(168, 85, 247, 0.2)",
              padding: "30px",
              borderRadius: "12px",
              marginBottom: "40px",
              color: "#e9d5ff"
            }}>
              <p style={{ margin: 0, fontSize: "1.05rem", lineHeight: "1.6" }}>
                Dive into the complexities of human societies, cultures, and history. Whether you're interested in understanding why people behave the way they do, 
                how economies function, or how civilizations evolved, our Social Science courses provide insights into the human experience.
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
                  onClick={() => navigate(`/social/${science.id}`)}
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
                    color: "#faf5ff"
                  }}>
                    {science.title}
                  </h3>

                  {/* Description */}
                  <p style={{
                    fontSize: "0.95rem",
                    color: "#e9d5ff",
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
                          color: "#f3e8ff",
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
                    color: "#f3e8ff",
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

export default SocialScience;
