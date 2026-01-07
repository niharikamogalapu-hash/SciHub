
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
    // TEMPORARILY DISABLED - Using mock data instead of database fetch
    // Uncomment the fetchResources() call below to re-enable database fetch
    
    // Mock data for temporary offline development
    const mockSciences = [
      { id: 1, name: 'Natural Sciences', code: 'natural', description: 'Study of the natural world and living systems' },
      { id: 2, name: 'Social Sciences', code: 'social', description: 'Study of human society, culture, and behavior' }
    ];

    const mockSubsciences = [
      { id: 1, science_id: 1, name: 'Biology', code: 'biology', description: 'Study of living organisms and life processes' },
      { id: 2, science_id: 1, name: 'Chemistry', code: 'chemistry', description: 'Study of matter and chemical reactions' },
      { id: 3, science_id: 1, name: 'Physics', code: 'physics', description: 'Study of matter, energy, and forces' },
      { id: 4, science_id: 2, name: 'History', code: 'history', description: 'Study of past events and civilizations' },
      { id: 5, science_id: 2, name: 'Psychology', code: 'psychology', description: 'Study of human behavior and mind' },
      { id: 6, science_id: 2, name: 'Economics', code: 'economics', description: 'Study of production, consumption, and resources' }
    ];

    setSciences(mockSciences);
    setSubsciences(mockSubsciences);
    setLoading(false);

    /* UNCOMMENT THIS TO RE-ENABLE DATABASE FETCH:
    async function fetchResources() {
      try {
        const res = await fetch("http://localhost:8080/resources");
        const data = await res.json();
        setSciences(data.sciences || []);
        setSubsciences(data.subsciences || []);
        setLoading(false);
      } catch (err) {
        console.error("Resources error:", err);
        setLoading(false);
      }
    }

    fetchResources();
    */
  }, []);

  function getSubsciencesForScience(scienceId) {
    return subsciences.filter((s) => s.science_id === scienceId);
  }

  if (!user) {
    return <h1 style={{ color: "white" }}>Please log in</h1>;
  }

  return (
    <div className="dashboard-page">
      <Sidebar />

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h1>{branch ? `${branch.charAt(0).toUpperCase() + branch.slice(1)} Science` : "Start Learning"}</h1>
            <p className="dashboard-subtitle">
              {branch
                ? "Pick a subscience and begin your unit."
                : "Choose a science, pick a subscience, and begin your personalized unit."}
            </p>
            {branch && (
              <p style={{ marginTop: 8 }}>
                <Link to="/resources">← Back to all resources</Link>
              </p>
            )}
          </div>
        </header>

        {loading ? (
          <p className="dashboard-loading">Loading resources...</p>
        ) : !branch ? (
          <div className="resources-layout">
            {/* Hero sections for the two main sciences */}
            <div className="resources-hero-grid" style={{ display: "flex", gap: 16, marginBottom: 40 }}>
              <div
                className="resources-hero-card resources-natural"
                style={{ flex: 1, padding: 20, borderRadius: 12, cursor: "pointer", background: "linear-gradient(135deg,#0ea5e9,#22c1c3)", color: "white" }}
                onClick={() => navigate('/resources/natural')}
              >
                <h2 style={{ margin: 0, fontSize: 28 }}>Natural Science</h2>
                <p style={{ marginTop: 8, opacity: 0.95 }}>Biology, Chemistry, Physics, Environmental Science — explore the natural world.</p>
              </div>

              <div
                className="resources-hero-card resources-social"
                style={{ flex: 1, padding: 20, borderRadius: 12, cursor: "pointer", background: "linear-gradient(135deg,#7c3aed,#ec4899)", color: "white" }}
                onClick={() => navigate('/resources/social')}
              >
                <h2 style={{ margin: 0, fontSize: 28 }}>Social Science</h2>
                <p style={{ marginTop: 8, opacity: 0.95 }}>Human Geography, Psychology, Economics, History — study people and societies.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="subscience-grid">
            {getSubsciencesForScience(branch === 'natural' ? 1 : 2).map((sub, idx) => (
              <div
                key={sub.id}
                className="subscience-card"
                style={{ animationDelay: `${idx * 0.1}s` }}
                onClick={() => navigate(`/resources/${branch}/${sub.id}`)}
              >
                <h3>{sub.name}</h3>
                <p>{sub.description}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Resources;
