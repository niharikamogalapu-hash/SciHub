import React, { useEffect } from "react";

function About() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="page fade-in">
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "2rem" }}>
        {/* Header */}
        <div className="slide-up" style={{ marginBottom: "4rem", textAlign: "center" }}>
          <h1 style={{ fontSize: "3.5rem", fontWeight: "700", marginBottom: "1rem", marginTop: "0", background: "linear-gradient(135deg, #38bdf8 0%, #a855f7 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            About SciHub
          </h1>
          <p style={{ fontSize: "1.1rem", color: "#9ca3af", maxWidth: "700px", margin: "0 auto", lineHeight: "1.8" }}>
            The passionate teens behind SciHub
          </p>
        </div>

        {/* Why We Built This */}
        <div className="card slide-up" style={{ marginBottom: "2rem", padding: "2rem" }}>
          <h2 style={{ fontSize: "1.8rem", marginTop: "0", marginBottom: "1rem", color: "#38bdf8" }}>Why We Built This</h2>
          <p style={{ lineHeight: "1.8", marginBottom: "0", fontSize: "1.02rem", color: "#f9fafb" }}>
            We built SciHub because science education needed a change. We noticed that AP classes—AP Biology, AP Chemistry, AP Physics, AP Environmental Science, AP Human Geography, and AP Psychology—have some of the highest failure rates among high school students. Too many students find these courses intimidating or feel unprepared for the AP exam. We wanted to create a platform where learning feels like an adventure, not a chore—where complex AP concepts become clear, students get targeted practice, and every learner feels confident and supported.
          </p>
        </div>

        {/* Our Story */}
        <h2 style={{ fontSize: "2rem", marginTop: "3rem", marginBottom: "2rem", color: "#f9fafb" }}>Our Journey</h2>
        
        {/* Key Highlight */}
        <div className="card slide-up" style={{ marginBottom: "2rem", borderLeft: "3px solid #a855f7", background: "radial-gradient(circle at top left, #1f2937 0, #020617 60%)", padding: "2rem" }}>
          <p style={{ margin: "0", fontSize: "1.1rem", fontWeight: "600", color: "#f9fafb" }}>
            ⭐ We're only 15 years old, and we built this entire platform from scratch. This is what happens when young minds are passionate about making a difference.
          </p>
        </div>

        {/* Niharika's Section */}
        <div className="card slide-up" style={{ marginBottom: "2rem", padding: "2rem" }}>
          <h3 style={{ color: "#38bdf8", marginTop: "0", fontSize: "1.5rem", marginBottom: "1rem" }}>🚀 Niharika's Technical Excellence</h3>
          <p style={{ lineHeight: "1.8", marginBottom: "0", fontSize: "1.02rem", color: "#f9fafb" }}>
            Niharika built the entire platform from scratch—hundreds of hours of coding, debugging, and design. Every game, lesson, and feature came from her technical expertise. She faced countless challenges: frustrating bugs, performance issues, and moments of doubt. But she pushed through, researched solutions, tested relentlessly, and never settled for less than perfect. All at just 15 years old while managing school and everything else.
          </p>
        </div>

        {/* Parimita's Section */}
        <div className="card slide-up" style={{ marginBottom: "2rem", padding: "2rem" }}>
          <h3 style={{ color: "#a855f7", marginTop: "0", fontSize: "1.5rem", marginBottom: "1rem" }}>💡 Parimita's Creative Vision</h3>
          <p style={{ lineHeight: "1.8", marginBottom: "0", fontSize: "1.02rem", color: "#f9fafb" }}>
            Parimita shaped the platform's vision and curriculum structure, always asking "what would students really want?" She supported Niharika through coding challenges while ensuring the platform was designed with students' needs in mind. Their partnership—brainstorming together, challenging each other's thinking, and building something neither could have created alone—made SciHub truly special.
          </p>
        </div>

        {/* Karthikashree's Section */}
        <div className="card slide-up" style={{ marginBottom: "2rem", padding: "2rem" }}>
          <h3 style={{ color: "#10b981", marginTop: "0", fontSize: "1.5rem", marginBottom: "1rem" }}>🐛 Karthikashree's Quality Assurance</h3>
          <p style={{ lineHeight: "1.8", marginBottom: "0", fontSize: "1.02rem", color: "#f9fafb" }}>
            Karthikashree meticulously tested every aspect of SciHub, finding bugs and edge cases others missed. Her attention to detail ensured every game works perfectly and every feature functions as intended. She was crucial in making SciHub not just functional, but reliable and trustworthy for all users.
          </p>
        </div>

        {/* The Struggle & Victory */}
        <div className="card slide-up" style={{ marginBottom: "2rem", padding: "2rem" }}>
          <h3 style={{ color: "#38bdf8", marginTop: "0", fontSize: "1.5rem", marginBottom: "1rem" }}>🤝 The Struggle & The Victory</h3>
          <p style={{ lineHeight: "1.8", marginBottom: "0", fontSize: "1.02rem", color: "#f9fafb" }}>
            Building SciHub wasn't easy. There were long nights, frustrating bugs, and moments of doubt. We had to learn database management, API integration, and responsive design while balancing school and other responsibilities. But we pushed through because we believed in the mission. We proved that age is just a number—and that two determined 15-year-olds can build something that truly helps people.
          </p>
        </div>

        {/* Closing Message */}
        <div style={{ textAlign: "center", marginTop: "3rem", marginBottom: "2rem" }}>
          <p style={{ lineHeight: "1.8", fontSize: "1.05rem", fontStyle: "italic", color: "#9ca3af", marginBottom: "0" }}>
            SciHub is our hard work, our passion, and our gift to students everywhere. Welcome to something special.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}

export default About;


