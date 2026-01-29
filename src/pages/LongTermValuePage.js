import React from "react";
import Sidebar from "../components/Sidebar";
import LongTermValue from "../components/LongTermValue";
import "./LongTermValuePage.css";

function LongTermValuePage() {
  const user = JSON.parse(localStorage.getItem("user") || "null") || null;

  if (!user) {
    return (
      <div style={{ display: "flex", minHeight: "100vh", background: "#0f172a" }}>
        <Sidebar />
        <main className="ltv-page-main">
          <h1 style={{ color: "#60a5fa", textAlign: "center" }}>Please log in to view your learning journey</h1>
        </main>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0f172a" }}>
      <Sidebar />
      
      <main className="ltv-page-main">
        {/* Hero Section */}
        <header className="ltv-page-hero">
          <div>
            <h1>📈 Your Learning Journey</h1>
            <p>Track your AP exam readiness, explore career paths, and celebrate your progress</p>
          </div>
        </header>

        {/* Long-Term Value Component */}
        <section className="ltv-page-content">
          <LongTermValue userId={user?.id} userName={user?.firstName} />
        </section>

        {/* Footer Section */}
        <footer className="ltv-page-footer">
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
