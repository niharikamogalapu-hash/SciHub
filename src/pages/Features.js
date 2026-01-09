import React, { useState, useEffect } from "react";

function Features() {
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [hoveredWhy, setHoveredWhy] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const features = [
    {
      icon: "📊",
      title: "Student Dashboard",
      desc: "Track your progress, sessions, worksheets, and achievements all in one place. See your learning journey at a glance.",
      color: "#38bdf8"
    },
    {
      icon: "👨‍🏫",
      title: "Live Tutoring",
      desc: "Choose your tutor and join live sessions with reminders. Get personalized help when you need it most.",
      color: "#a855f7"
    },
    {
      icon: "📚",
      title: "Science Resources",
      desc: "Videos, downloads, and interactive tools to deepen your understanding of complex science concepts.",
      color: "#ec4899"
    },
    {
      icon: "📝",
      title: "Smart Worksheets",
      desc: "Practice with instant AI-powered analysis and personalized study suggestions tailored to your level.",
      color: "#38bdf8"
    },
    {
      icon: "🎮",
      title: "Science Games",
      desc: "Quick challenges that make learning fun and memorable. Compete with friends and earn achievements.",
      color: "#fbbf24"
    },
    {
      icon: "💬",
      title: "Q&A",
      desc: "Ask questions and get answers from tutors and peers. Find solutions to your science problems instantly.",
      color: "#22c55e"
    },
    {
      icon: "🎯",
      title: "Personalized Learning Paths",
      desc: "Get customized lesson recommendations based on your strengths, weaknesses, and learning goals.",
      color: "#38bdf8"
    },
  ];

  const whyFeatures = [
    { title: "🎯 Comprehensive", desc: "From dashboards to games to AI companions, we cover every aspect of modern science learning." },
    { title: "🤖 AI-Powered", desc: "Smart worksheets and personalized paths adapt to your learning style and pace." },
    { title: "👥 Community-Driven", desc: "Learn together with peers through chat communities and collaborative study sessions." },
    { title: "📈 Progress Tracking", desc: "See real data about your improvement and get insights to guide your studies." },
  ];

  const differences = [
    "Built by students, for students — we understand your challenges",

    "Gamification keeps learning fun and motivating",
    "Real tutors paired with AI for the best of both worlds",
    "Community learning — study together, not alone",
    "Instant feedback on worksheets to accelerate improvement",
  ];

  return (
    <section className="page fade-in">
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
        {/* Header */}
        <div className="slide-up" style={{ marginBottom: "4rem", textAlign: "center" }}>
          <h1 style={{ fontSize: "3.5rem", fontWeight: "700", marginBottom: "1rem", marginTop: "0", background: "linear-gradient(135deg, #38bdf8 0%, #a855f7 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            Our Powerful Features
          </h1>
          <p style={{ fontSize: "1.1rem", color: "#9ca3af", maxWidth: "700px", margin: "0 auto", lineHeight: "1.8" }}>
            SciHub is packed with tools designed to make your science learning journey engaging, effective, and fun. Explore all the features we offer to help you succeed.
          </p>
        </div>

        {/* Features Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem", marginBottom: "4rem" }}>
          {features.map((feature, i) => (
            <div
              key={i}
              className="card"
              onMouseEnter={() => setHoveredFeature(i)}
              onMouseLeave={() => setHoveredFeature(null)}
              style={{
                padding: "2.5rem",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                transform: hoveredFeature === i ? "translateY(-12px) scale(1.02)" : "translateY(0) scale(1)",
                boxShadow: hoveredFeature === i 
                  ? `0 25px 70px ${feature.color}40, 0 0 40px ${feature.color}20` 
                  : "0 10px 30px rgba(15, 23, 42, 0.5)",
                border: hoveredFeature === i 
                  ? `2px solid ${feature.color}` 
                  : "1px solid rgba(56, 189, 248, 0.2)",
                background: hoveredFeature === i
                  ? `radial-gradient(circle at top left, ${feature.color}15 0%, transparent 60%)`
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
                transform: hoveredFeature === i ? "scale(1.3) rotate(15deg)" : "scale(1) rotate(0deg)", 
                transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                textShadow: hoveredFeature === i ? `0 0 20px ${feature.color}60` : "none",
              }}>
                {feature.icon}
              </div>
              <h3 style={{ fontSize: "1.4rem", marginTop: "0", marginBottom: "0.8rem", color: feature.color, fontWeight: "700" }}>
                {feature.title}
              </h3>
              <p style={{ color: "#9ca3af", marginBottom: "0", lineHeight: "1.7", fontSize: "0.95rem" }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Why These Features Section */}
        <div className="slide-up" style={{
          background: "linear-gradient(135deg, rgba(56, 189, 248, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)",
          border: "2px solid rgba(56, 189, 248, 0.4)",
          borderRadius: "20px",
          padding: "3rem 2rem",
          marginBottom: "4rem",
          backdropFilter: "blur(10px)",
        }}>
          <h2 style={{ fontSize: "2.2rem", color: "#f9fafb", marginTop: "0", marginBottom: "2.5rem", textAlign: "center", fontWeight: "700" }}>
            Why These Features?
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "2rem" }}>
            {whyFeatures.map((item, i) => (
              <div
                key={i}
                onMouseEnter={() => setHoveredWhy(i)}
                onMouseLeave={() => setHoveredWhy(null)}
                style={{
                  padding: "1.8rem",
                  borderRadius: "12px",
                  background: hoveredWhy === i
                    ? "rgba(56, 189, 248, 0.15)"
                    : "rgba(56, 189, 248, 0.05)",
                  border: hoveredWhy === i
                    ? "1px solid rgba(56, 189, 248, 0.6)"
                    : "1px solid rgba(56, 189, 248, 0.2)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  transform: hoveredWhy === i ? "translateY(-6px)" : "translateY(0)",
                  animation: `slideUp 0.6s ease forwards`,
                  animationDelay: `${i * 0.1}s`,
                  opacity: 0,
                }}
              >
                <h3 style={{ color: "#38bdf8", fontSize: "1.25rem", marginTop: "0", marginBottom: "0.8rem", fontWeight: "700" }}>{item.title}</h3>
                <p style={{ color: "#9ca3af", lineHeight: "1.7", marginBottom: "0", fontSize: "0.95rem" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="slide-up" style={{
          background: "radial-gradient(circle at 60% 40%, rgba(168, 85, 247, 0.2) 0%, transparent 70%)",
          borderRadius: "20px",
          padding: "3.5rem 2.5rem",
          marginBottom: "3rem",
          border: "1px solid rgba(168, 85, 247, 0.3)",
        }}>
          <h2 style={{ fontSize: "2.2rem", color: "#f9fafb", marginTop: "0", marginBottom: "3rem", textAlign: "center", fontWeight: "700" }}>
            ✨ What Makes Us Different
          </h2>
          <div style={{ maxWidth: "850px", margin: "0 auto" }}>
            {differences.map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  marginBottom: "2rem",
                  padding: "1.5rem",
                  borderRadius: "12px",
                  background: "rgba(56, 189, 248, 0.05)",
                  border: "1px solid rgba(56, 189, 248, 0.15)",
                  transition: "all 0.3s ease",
                  animation: `slideUp 0.6s ease forwards`,
                  animationDelay: `${i * 0.08}s`,
                  opacity: 0,
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(56, 189, 248, 0.12)";
                  e.currentTarget.style.borderColor = "rgba(56, 189, 248, 0.4)";
                  e.currentTarget.style.transform = "translateX(8px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(56, 189, 248, 0.05)";
                  e.currentTarget.style.borderColor = "rgba(56, 189, 248, 0.15)";
                  e.currentTarget.style.transform = "translateX(0)";
                }}
              >
                <div style={{ 
                  fontSize: "1.8rem", 
                  marginRight: "1.2rem", 
                  minWidth: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  animation: "float 3s ease-in-out infinite",
                  animationDelay: `${i * 0.15}s`,
                }}>
                  ✨
                </div>
                <p style={{ color: "#f9fafb", fontSize: "1rem", lineHeight: "1.7", marginBottom: "0", fontWeight: "500" }}>
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
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
            Ready to Experience the Difference?
          </h2>
          <p style={{ fontSize: "1.1rem", color: "rgba(255, 255, 255, 0.9)", marginBottom: "0", maxWidth: "600px", margin: "0 auto" }}>
            Join thousands of students transforming their science learning with SciHub's powerful feature suite.
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

export default Features;
