
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./Resources.css";

function Resources({ branch }) {
  const [sciences, setSciences] = useState([]);
  const [subsciences, setSubsciences] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null") || null;

  useEffect(() => {
    // Mock data for offline development
    const mockSciences = [
      { id: 1, name: 'Natural Sciences', code: 'natural', description: 'Study of the natural world and living systems' },
      { id: 2, name: 'Social Sciences', code: 'social', description: 'Study of human society, culture, and behavior' }
    ];

    const mockSubsciences = [
      { id: 1, science_id: 1, name: 'AP Biology', code: 'biology', emoji: '🧬', color: '#10b981', lightColor: 'rgba(16, 185, 129, 0.1)', description: 'Study of living organisms and life processes' },
      { id: 2, science_id: 1, name: 'AP Chemistry', code: 'chemistry', emoji: '⚗️', color: '#0ea5e9', lightColor: 'rgba(6, 182, 212, 0.1)', description: 'Study of matter and chemical reactions' },
      { id: 3, science_id: 1, name: 'AP Physics', code: 'physics', emoji: '⚡', color: '#f59e0b', lightColor: 'rgba(245, 158, 11, 0.1)', description: 'Study of matter, energy, and forces' },
      { id: 4, science_id: 1, name: 'AP Environmental Science', code: 'environmental-science', emoji: '🌍', color: '#14b8a6', lightColor: 'rgba(20, 184, 166, 0.1)', description: 'Study of ecosystems and sustainability' },
      { id: 5, science_id: 2, name: 'AP Psychology', code: 'psychology', emoji: '🧠', color: '#a855f7', lightColor: 'rgba(168, 85, 247, 0.1)', description: 'Study of human behavior and mind' },
      { id: 6, science_id: 2, name: 'AP Human Geography', code: 'human-geography', emoji: '🌎', color: '#ef4444', lightColor: 'rgba(239, 68, 68, 0.1)', description: 'How people interact with places and environments' },
      { id: 7, science_id: 2, name: 'History', code: 'history', emoji: '📜', color: '#f59e0b', lightColor: 'rgba(245, 158, 11, 0.1)', description: 'Study of past events and civilizations' },
      { id: 8, science_id: 2, name: 'Economics', code: 'economics', emoji: '💹', color: '#14b8a6', lightColor: 'rgba(20, 184, 166, 0.1)', description: 'Study of production, consumption, and resources' }
    ];

    setSciences(mockSciences);
    setSubsciences(mockSubsciences);
    setLoading(false);
  }, []);

  function getSubsciencesForScience(scienceId) {
    return subsciences.filter((s) => s.science_id === scienceId);
  }

  if (!user) {
    return <h1 style={{ color: "white" }}>Please log in</h1>;
  }

  const mainResourceCard = {
    natural: {
      emoji: '🌿',
      title: 'Natural Science',
      gradient: 'linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)',
      description: 'Biology, Chemistry, Physics, Environmental Science — explore the natural world.',
      color: '#10b981'
    },
    social: {
      emoji: '🌐',
      title: 'Social Science',
      gradient: 'linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #f43f5e 100%)',
      description: 'Psychology, History, Human Geography, Economics — study people and societies.',
      color: '#a855f7'
    }
  };

  const branchData = branch ? mainResourceCard[branch] : null;

  return (
    <div className="dashboard-page">
      <Sidebar />

      <main className="dashboard-main">
        {/* Back Button */}
        {branch && (
          <div style={{ marginBottom: '20px' }}>
            <button
              onClick={() => navigate('/resources')}
              style={{
                background: 'rgba(100, 116, 139, 0.2)',
                border: '1px solid rgba(148, 163, 184, 0.3)',
                color: '#cbd5e1',
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.95rem',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(100, 116, 139, 0.3)';
                e.target.style.borderColor = 'rgba(148, 163, 184, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(100, 116, 139, 0.2)';
                e.target.style.borderColor = 'rgba(148, 163, 184, 0.3)';
              }}
            >
              ← Back to Resources
            </button>
          </div>
        )}

        {loading ? (
          <p style={{ textAlign: "center", color: "#9ca3af", fontSize: "1.1rem" }}>Loading resources...</p>
        ) : !branch ? (
          <div>
            {/* Hero Section */}
            <header style={{
              background: "linear-gradient(135deg, #3b82f6 0%, #0ea5e9 50%, #06b6d4 100%)",
              padding: "60px 40px",
              borderRadius: "16px",
              marginBottom: "40px",
              color: "white",
              boxShadow: "0 20px 40px rgba(3, 102, 214, 0.2)"
            }}>
              <h1 style={{ fontSize: "3.5rem", margin: "0 0 20px 0", fontWeight: "800" }}>📚 Learning Resources</h1>
              <p style={{ fontSize: "1.2rem", margin: 0, opacity: 0.95, maxWidth: "600px" }}>
                Choose a science path and explore engaging lessons, interactive quizzes, and expert tutoring across all subjects.
              </p>
            </header>

            {/* Main Science Cards */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
              gap: "30px",
              marginBottom: "40px"
            }}>
              {sciences.map((science) => {
                const data = mainResourceCard[science.code];
                return (
                  <div
                    key={science.id}
                    onClick={() => navigate(`/resources/${science.code}`)}
                    style={{
                      background: data.gradient,
                      borderRadius: "16px",
                      padding: "40px 30px",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      transform: "scale(1)",
                      boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
                      color: "white",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-10px) scale(1.02)";
                      e.currentTarget.style.boxShadow = `0 20px 40px ${data.color}40`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.2)";
                    }}
                  >
                    <div style={{ fontSize: "4rem", marginBottom: "16px" }}>{data.emoji}</div>
                    <h2 style={{ fontSize: "2.2rem", fontWeight: "800", margin: "0 0 12px 0" }}>{data.title}</h2>
                    <p style={{ fontSize: "1.05rem", margin: 0, opacity: 0.95, lineHeight: "1.5" }}>
                      {data.description}
                    </p>
                    <div style={{
                      marginTop: "24px",
                      paddingTop: "24px",
                      borderTop: "1px solid rgba(255, 255, 255, 0.2)",
                      fontSize: "0.95rem",
                      fontWeight: "600"
                    }}>
                      Explore →
                    </div>
                  </div>
                );
              })}
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
                💡 <strong>Tip:</strong> Each subject offers comprehensive lessons with videos, quizzes, tutoring sessions, and games. 
                <br />Start learning today to earn XP and unlock achievements! 🏆
              </p>
            </div>
          </div>
        ) : (
          <div>
            {/* Branch Header */}
            <header style={{
              background: branchData.gradient,
              padding: "50px 40px",
              borderRadius: "16px",
              marginBottom: "40px",
              color: "white",
              boxShadow: `0 20px 40px ${branchData.color}30`
            }}>
              <div style={{ fontSize: "3rem", marginBottom: "16px" }}>{branchData.emoji}</div>
              <h1 style={{ fontSize: "3rem", margin: "0 0 12px 0", fontWeight: "800" }}>{branchData.title}</h1>
              <p style={{ fontSize: "1.1rem", margin: 0, opacity: 0.95 }}>{branchData.description}</p>
            </header>

            {/* Subsciences Grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "25px",
              marginBottom: "40px"
            }}>
              {getSubsciencesForScience(branch === 'natural' ? 1 : 2).map((sub) => (
                <div
                  key={sub.id}
                  onClick={() => navigate(`/resources/${branch}/${sub.id}`)}
                  style={{
                    background: `linear-gradient(135deg, ${sub.lightColor}, ${sub.lightColor}dd)`,
                    border: `2px solid ${sub.color}`,
                    borderRadius: "14px",
                    padding: "28px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    transform: "scale(1)",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
                    e.currentTarget.style.boxShadow = `0 16px 32px ${sub.color}30`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
                  }}
                >
                  <div style={{
                    fontSize: "3.5rem",
                    marginBottom: "12px",
                  }}>
                    {sub.emoji}
                  </div>
                  <h3 style={{
                    fontSize: "1.5rem",
                    fontWeight: "700",
                    margin: "0 0 10px 0",
                    color: "#f9fafb"
                  }}>
                    {sub.name}
                  </h3>
                  <p style={{
                    fontSize: "0.95rem",
                    color: "rgba(255, 255, 255, 0.8)",
                    margin: "0 0 16px 0",
                    lineHeight: "1.5"
                  }}>
                    {sub.description}
                  </p>
                  <div style={{
                    marginTop: "16px",
                    paddingTop: "16px",
                    borderTop: `1px solid ${sub.color}40`,
                    color: "rgba(255, 255, 255, 0.7)",
                    fontSize: "0.9rem",
                    fontWeight: "600"
                  }}>
                    Start learning →
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
                📚 <strong>Each subject includes:</strong> Video lessons, quizzes, tutoring sessions, and interactive games. 
                <br />Complete lessons to earn XP and unlock achievements! 🏆
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Resources;
