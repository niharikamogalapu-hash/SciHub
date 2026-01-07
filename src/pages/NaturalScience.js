import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function NaturalScience() {
  const [sciences, setSciences] = useState([]);
  const [subsciences, setSubsciences] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Backend API disabled - using local data instead
    console.log("✅ Backend API disabled - using localStorage/local data for NaturalScience");
    
    // Set local data without fetching from backend
    setSciences([{ code: "natural", name: "Natural Science" }]);
    setSubsciences([]);
    setLoading(false);
  }, []);

  function getSubsciencesForScience(scienceId) {
    return subsciences.filter((s) => s.science_id === scienceId);
  }

  const science = sciences.find((s) => s.code && s.code.toLowerCase() === "natural");

  return (
    <div className="dashboard-page">
      <Sidebar />

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h1>Natural Science</h1>
            <p className="dashboard-subtitle">Explore Biology, Chemistry, Physics and Environmental Science.</p>
          </div>
        </header>

        {loading ? (
          <p className="dashboard-loading">Loading...</p>
        ) : (
          <div className="resources-layout">
            <section className={`resources-section resources-natural`}>
              <div className="resources-section-header">
                <h2>Natural Science</h2>
                <p>Build knowledge of the natural world with lessons, tutors and games. First start with Biology! It is the basic for everything. From there we will guide you to the other topics in a order. </p>
              </div>

              <div className="resources-subscience-grid">
                {/* Explicit topic cards linking to dedicated Natural pages */}
                <div className="resources-subscience-card" onClick={() => navigate('/natural/biology')}>
                  <h3>Biology</h3>
                  <p className="resources-subscience-desc">Cells, organisms and ecosystems — 10-lesson unit.</p>
                </div>

                <div className="resources-subscience-card" onClick={() => navigate('/natural/chemistry')}>
                  <h3>Chemistry</h3>
                  <p className="resources-subscience-desc">Atoms, reactions and materials.</p>
                </div>

                <div className="resources-subscience-card" onClick={() => navigate('/natural/physics')}>
                  <h3>Physics</h3>
                  <p className="resources-subscience-desc">Motion, forces and energy.</p>
                </div>

                <div className="resources-subscience-card" onClick={() => navigate('/natural/environmental-science')}>
                  <h3>Environmental Science</h3>
                  <p className="resources-subscience-desc">Ecosystems, conservation and human impact.</p>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

export default NaturalScience;
