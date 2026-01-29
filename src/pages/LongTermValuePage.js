
import React from "react";
import Sidebar from "../components/Sidebar";
import LongTermValue from "../components/LongTermValue";
import "../pages/Dashboard.css";

function LongTermValuePage() {
  const user = JSON.parse(localStorage.getItem("user") || "null") || null;

  if (!user) {
    return (
      <div className="dashboard-page">
        <Sidebar />
        <main className="dashboard-main">
          <h1 style={{ color: "#60a5fa", textAlign: "center" }}>Please log in to view your learning journey</h1>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <Sidebar />
      <main className="dashboard-main">
        {/* Hero Section */}
        <header className="dashboard-hero">
          <div>
            <h1>📈 Your Learning Journey</h1>
            <p>Track your AP exam readiness, explore career paths, and celebrate your progress</p>
          </div>
        </header>

        {/* Long-Term Value Component */}
        <section className="dashboard-section">
          <LongTermValue userId={user?.id} userName={user?.firstName} />
        </section>

        {/* Footer Section */}
        <footer className="dashboard-section" style={{ marginTop: '2rem' }}>
          <div className="footer-message">
            <h3>🎯 Your Dedication Matters</h3>
            <p>Every lesson completed, every game played, and every hour studied brings you closer to AP exam success. Keep pushing forward!</p>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default LongTermValuePage;
