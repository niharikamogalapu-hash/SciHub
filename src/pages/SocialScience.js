import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function SocialScience() {
  const [sciences, setSciences] = useState([]);
  const [subsciences, setSubsciences] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Backend API disabled - using local data instead
    console.log("✅ Backend API disabled - using localStorage/local data for SocialScience");
    
    // Set local data without fetching from backend
    setSciences([{ code: "social", name: "Social Science" }]);
    setSubsciences([]);
    setLoading(false);
  }, []);

  function getSubsciencesForScience(scienceId) {
    return subsciences.filter((s) => s.science_id === scienceId);
  }

  const science = sciences.find((s) => s.code && s.code.toLowerCase() === "social");

  return (
    <div className="dashboard-page">
      <Sidebar />

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h1>Social Science</h1>
            <p className="dashboard-subtitle">Explore Human Geography, Psychology, Economics and History.</p>
          </div>
        </header>

        {loading ? (
          <p className="dashboard-loading">Loading...</p>
        ) : (
          <div className="resources-layout">
            <section className={`resources-section resources-social`}>
              <div className="resources-section-header">
                <h2>Social Science</h2>
                <p>Understand people, societies and the forces that shape them.</p>
              </div>

              <div className="resources-subscience-grid">
                {/* Explicit topic cards linking to dedicated pages */}
                <div className="resources-subscience-card" onClick={() => navigate('/social/psychology')}>
                  <h3>Psychology</h3>
                  <p className="resources-subscience-desc">Behavior, cognition and mental processes — 10-lesson unit.</p>
                </div>

                <div className="resources-subscience-card" onClick={() => navigate('/social/human-geography')}>
                  <h3>Human Geography</h3>
                  <p className="resources-subscience-desc">How people interact with places and environments.</p>
                </div>

                <div className="resources-subscience-card" onClick={() => navigate('/social/history')}>
                  <h3>History</h3>
                  <p className="resources-subscience-desc">Events and movements shaping the world.</p>
                </div>

                <div className="resources-subscience-card" onClick={() => navigate('/social/economics')}>
                  <h3>Economics</h3>
                  <p className="resources-subscience-desc">Markets, choices and economic systems.</p>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

export default SocialScience;
