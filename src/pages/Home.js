import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const typingLines = [
  "Built by students, for students.",
  "Turn science into something you actually enjoy.",
  "Study smarter with AI worksheets and live help.",
];

function Home() {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [stats, setStats] = useState([0, 0, 0, 0]);
  const [hoveredFeature, setHoveredFeature] = useState(null);

  useEffect(() => {
    const text = typingLines[currentLineIndex];
    setDisplayedText("");

    let charIndex = 0;
    const speed = 45;

    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, charIndex + 1));
      charIndex++;
      if (charIndex === text.length) {
        clearInterval(interval);
        setTimeout(() => {
          setCurrentLineIndex((prev) => (prev + 1) % typingLines.length);
        }, 1500);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [currentLineIndex]);

  // Animate stats on mount
  useEffect(() => {
    const targetStats = [95, 87, 92, 78];
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      setStats(targetStats.map(target => Math.floor(target * progress)));
      if (currentStep === steps) clearInterval(interval);
    }, stepDuration);

    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: "🎮",
      title: "Interactive Games",
      desc: "Master science concepts through engaging games and challenges",
      color: "#38bdf8"
    },
    {
      icon: "👨‍🏫",
      title: "Live Tutors",
      desc: "Connect with real tutors for personalized help anytime",
      color: "#a855f7"
    },
    {
      icon: "📝",
      title: "AI Worksheets",
      desc: "Generate custom worksheets with instant feedback",
      color: "#ec4899"
    },
    {
      icon: "📊",
      title: "Progress Tracking",
      desc: "Watch your growth with detailed analytics and insights",
      color: "#38bdf8"
    },
  ];

  return (
    <section className="page home-page fade-in">
      {/* Hero Section */}
      <div className="hero">
        <div className="hero-text slide-up">
          <h1>SciHub: Your Science Learning Hub</h1>
          <p className="typing-line">{displayedText}</p>
          <p>
            Interactive games, live tutoring, AI worksheets, and progress tracking — all 
            designed to make learning science engaging, fun, and effective.
          </p>

          <div className="hero-actions">
            <Link to="/signup" className="primary-btn">
              CLICK HERE TO SEE YOUR PERSONALIZED LEARNING HUB
            </Link>
            <Link to="/features" className="secondary-btn">
              Explore features
            </Link>
          </div>
        </div>

        <div className="hero-visual fade-in" aria-hidden="true">
          <div className="orbit" />
          <div className="orbit-small" />
          <div className="atom-core" />
        </div>
      </div>

      {/* Animated Stats Section */}
      <div style={{ marginTop: "4rem", marginBottom: "4rem" }}>
        <h2 style={{ fontSize: "2rem", textAlign: "center", color: "#f9fafb", marginBottom: "3rem" }}>Why Students Love SciHub</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2rem" }}>
          {[
            { stat: stats[0], label: "Student Satisfaction", icon: "😊" },
            { stat: stats[1], label: "Score Improvement", icon: "📈" },
            { stat: stats[2], label: "Learning Retention", icon: "🧠" },
            { stat: stats[3], label: "Problem Solved", icon: "✅" },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                background: "radial-gradient(circle at top left, #1f2937 0, #020617 60%)",
                border: "1px solid rgba(56, 189, 248, 0.3)",
                borderRadius: "16px",
                padding: "2rem",
                textAlign: "center",
                animation: `slideUp 0.6s ease forwards`,
                animationDelay: `${i * 0.1}s`,
                opacity: 0,
              }}
            >
              <div style={{ fontSize: "2.5rem", marginBottom: "0.8rem" }}>{item.icon}</div>
              <h3 style={{ fontSize: "2.5rem", fontWeight: "700", marginBottom: "0.5rem", color: "#38bdf8" }}>
                {item.stat}%
              </h3>
              <p style={{ color: "#9ca3af", marginBottom: "0", fontSize: "0.95rem" }}>{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div style={{ marginTop: "4rem", marginBottom: "4rem" }}>
        <h2 style={{ fontSize: "2rem", textAlign: "center", color: "#f9fafb", marginBottom: "3rem" }}>What You Get</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
          {features.map((feature, i) => (
            <div
              key={i}
              className="card"
              onMouseEnter={() => setHoveredFeature(i)}
              onMouseLeave={() => setHoveredFeature(null)}
              style={{
                padding: "2.5rem",
                cursor: "pointer",
                transition: "all 0.3s ease",
                transform: hoveredFeature === i ? "translateY(-8px)" : "translateY(0)",
                boxShadow: hoveredFeature === i 
                  ? `0 20px 60px ${feature.color}30` 
                  : "0 10px 30px rgba(15, 23, 42, 0.5)",
                border: hoveredFeature === i 
                  ? `1px solid ${feature.color}` 
                  : "1px solid rgba(56, 189, 248, 0.3)",
                animation: `slideUp 0.6s ease forwards`,
                animationDelay: `${i * 0.1}s`,
                opacity: 0,
              }}
            >
              <div style={{ fontSize: "2.8rem", marginBottom: "1rem", display: "inline-block", transform: hoveredFeature === i ? "scale(1.2) rotate(10deg)" : "scale(1) rotate(0deg)", transition: "transform 0.3s ease" }}>
                {feature.icon}
              </div>
              <h3 style={{ fontSize: "1.4rem", marginTop: "0", marginBottom: "0.8rem", color: feature.color }}>
                {feature.title}
              </h3>
              <p style={{ color: "#9ca3af", marginBottom: "1.5rem", lineHeight: "1.6", fontSize: "0.95rem" }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <div style={{
        background: "linear-gradient(135deg, rgba(56, 189, 248, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)",
        border: "1px solid rgba(56, 189, 248, 0.3)",
        borderRadius: "20px",
        padding: "3rem 2rem",
        marginTop: "4rem",
        marginBottom: "4rem",
      }}>
        <h2 style={{ fontSize: "2rem", textAlign: "center", color: "#f9fafb", marginBottom: "3rem" }}>How It Works</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "2rem" }}>
          {[
            { number: "1", title: "Sign Up", desc: "Create your free account in seconds" },
            { number: "2", title: "Choose Your Path", desc: "Pick games, worksheets, or tutoring sessions" },
            { number: "3", title: "Learn & Grow", desc: "Master concepts with interactive content" },
            { number: "4", title: "Track Progress", desc: "Watch your improvement with detailed analytics" },
          ].map((step, i) => (
            <div key={i} style={{ textAlign: "center", animation: `slideUp 0.6s ease forwards`, animationDelay: `${i * 0.1}s`, opacity: 0 }}>
              <div style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                background: `linear-gradient(135deg, #38bdf8, #a855f7)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.8rem",
                fontWeight: "700",
                color: "#fff",
                margin: "0 auto 1rem",
              }}>
                {step.number}
              </div>
              <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem", color: "#f9fafb" }}>{step.title}</h3>
              <p style={{ color: "#9ca3af", fontSize: "0.95rem" }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div style={{ marginTop: "4rem", marginBottom: "4rem" }}>
        <h2 style={{ fontSize: "2rem", textAlign: "center", color: "#f9fafb", marginBottom: "3rem" }}>What Students Say</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
          {[
            { name: "Sarah Chen", quote: "SciHub made science fun! My grades went up 2 letters in just a month.", avatar: "👩" },
            { name: "Marcus Johnson", quote: "The live tutors are amazing. They explain things in a way that actually makes sense.", avatar: "👨" },
            { name: "Aisha Patel", quote: "Games are so addictive! I didn't realize I was learning until my test scores showed it.", avatar: "👩" },
          ].map((testimonial, i) => (
            <div
              key={i}
              className="card"
              style={{
                padding: "2rem",
                border: "1px solid rgba(56, 189, 248, 0.3)",
                borderRadius: "16px",
                animation: `slideUp 0.6s ease forwards`,
                animationDelay: `${i * 0.1}s`,
                opacity: 0,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", marginBottom: "1.5rem" }}>
                <div style={{ fontSize: "2.5rem", marginRight: "1rem" }}>{testimonial.avatar}</div>
                <div>
                  <h4 style={{ marginBottom: "0.2rem", color: "#f9fafb" }}>{testimonial.name}</h4>
                  <div style={{ fontSize: "1.2rem", color: "#fbbf24" }}>⭐⭐⭐⭐⭐</div>
                </div>
              </div>
              <p style={{ color: "#9ca3af", lineHeight: "1.7", fontStyle: "italic", marginBottom: "0" }}>
                "{testimonial.quote}"
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Subjects Coverage - Horizontal Scroll */}
      <div style={{
        background: "radial-gradient(circle at top right, rgba(56, 189, 248, 0.1) 0%, transparent 60%)",
        borderRadius: "20px",
        padding: "3rem 2rem",
        marginTop: "4rem",
        marginBottom: "4rem",
      }}>
        <h2 style={{ fontSize: "2rem", color: "#f9fafb", marginBottom: "1.5rem", marginTop: "0" }}>Science & Social Studies Subjects</h2>
        <p style={{ color: "#9ca3af", marginBottom: "2rem", fontSize: "0.95rem" }}>Master topics across multiple disciplines</p>
        <div style={{
          display: "flex",
          overflowX: "auto",
          gap: "1.5rem",
          paddingBottom: "1rem",
          scrollBehavior: "smooth",
        }}>
          {[
            { icon: "⚛️", subject: "AP Physics" },
            { icon: "🧪", subject: "AP Chemistry" },
            { icon: "🧬", subject: "AP Biology" },
            { icon: "🌍", subject: "AP Environmental Science" },
            { icon: "💰", subject: "Economics" },
            { icon: "📜", subject: "History" },
            { icon: "🗺️", subject: "AP Human Geography" },
            { icon: "🧠", subject: "AP Psychology" },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                minWidth: "150px",
                padding: "1.5rem",
                borderRadius: "12px",
                background: "rgba(56, 189, 248, 0.1)",
                border: "1px solid rgba(56, 189, 248, 0.3)",
                textAlign: "center",
                flexShrink: 0,
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 10px 30px rgba(56, 189, 248, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{ fontSize: "2.5rem", marginBottom: "0.8rem" }}>{item.icon}</div>
              <p style={{ color: "#f9fafb", fontWeight: "600", marginBottom: "0" }}>{item.subject}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Lessons Section */}
      <div style={{
        background: "linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(56, 189, 248, 0.1) 100%)",
        borderRadius: "20px",
        padding: "3rem 2rem",
        marginTop: "4rem",
        marginBottom: "4rem",
      }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center" }}>
          <div>
            <h2 style={{ fontSize: "2rem", color: "#f9fafb", marginTop: "0", marginBottom: "1rem" }}>🎯 Features</h2>
            <p style={{ color: "#9ca3af", marginBottom: "1.5rem", lineHeight: "1.7", fontSize: "0.95rem" }}>
              Discover all the tools and features SciHub offers to make your science learning journey engaging and effective. From interactive games to AI-powered worksheets, we have everything you need to succeed.
            </p>
            <ul style={{ color: "#9ca3af", marginBottom: "2rem" }}>
              <li style={{ marginBottom: "0.8rem" }}>✨ Multiple learning methods for different styles</li>
              <li style={{ marginBottom: "0.8rem" }}>🎯 Tools designed for real improvement</li>
              <li style={{ marginBottom: "0.8rem" }}>📊 Track your progress every step of the way</li>
              <li>🚀 Continuously updated with new features</li>
            </ul>
            <Link to="/features" className="primary-btn">
              Explore Features →
            </Link>
          </div>
          <div style={{ fontSize: "4rem", textAlign: "center", animation: "float 3s ease-in-out infinite" }}>⚙️</div>
        </div>
      </div>

      {/* Games Section */}
      <div style={{
        background: "linear-gradient(135deg, rgba(56, 189, 248, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)",
        borderRadius: "20px",
        padding: "3rem 2rem",
        marginTop: "4rem",
        marginBottom: "4rem",
      }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center" }}>
          <div style={{ fontSize: "4rem", textAlign: "center", animation: "float 3s ease-in-out infinite", order: "-1" }}>🎨</div>
          <div>
            <h2 style={{ fontSize: "2rem", color: "#f9fafb", marginTop: "0", marginBottom: "1rem" }}>✨ About Us</h2>
            <p style={{ color: "#9ca3af", marginBottom: "1.5rem", lineHeight: "1.7", fontSize: "0.95rem" }}>
              Learn about SciHub's story, our values, and what drives us to create the best science learning platform. We believe every student deserves access to quality education that makes learning fun and engaging.
            </p>
            <ul style={{ color: "#9ca3af", marginBottom: "2rem" }}>
              <li style={{ marginBottom: "0.8rem" }}>🌟 Student-driven platform built with passion</li>
              <li style={{ marginBottom: "0.8rem" }}>🤝 Community-focused approach to learning</li>
              <li style={{ marginBottom: "0.8rem" }}>💡 Innovative solutions for education</li>
              <li>🎓 Commitment to accessibility for all</li>
            </ul>
            <Link to="/about" className="primary-btn">
              Learn Our Story →
            </Link>
          </div>
        </div>
      </div>

      {/* Tutoring Section */}
      <div style={{
        background: "linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)",
        borderRadius: "20px",
        padding: "3rem 2rem",
        marginTop: "4rem",
        marginBottom: "4rem",
      }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center" }}>
          <div>
            <h2 style={{ fontSize: "2rem", color: "#f9fafb", marginTop: "0", marginBottom: "1rem" }}>🚀 Our Mission</h2>
            <p style={{ color: "#9ca3af", marginBottom: "1.5rem", lineHeight: "1.7", fontSize: "0.95rem" }}>
              Discover why we built SciHub and what we're working towards. Our mission is to transform science education by making it accessible, engaging, and effective for every student around the world.
            </p>
            <ul style={{ color: "#9ca3af", marginBottom: "2rem" }}>
              <li style={{ marginBottom: "0.8rem" }}>🎯 Accessible learning for everyone</li>
              <li style={{ marginBottom: "0.8rem" }}>💪 Powered by community and collaboration</li>
              <li style={{ marginBottom: "0.8rem" }}>🌱 Sustainable growth in science education</li>
              <li>🤖 Leveraging AI to enhance learning</li>
            </ul>
            <Link to="/mission" className="primary-btn">
              Read Our Mission →
            </Link>
          </div>
          <div style={{ fontSize: "4rem", textAlign: "center", animation: "float 3s ease-in-out infinite" }}>🎯</div>
        </div>
      </div>

      {/* QnA Section */}
      <div style={{
        background: "linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(56, 189, 248, 0.1) 100%)",
        borderRadius: "20px",
        padding: "3rem 2rem",
        marginTop: "4rem",
        marginBottom: "4rem",
      }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center" }}>
          <div style={{ fontSize: "4rem", textAlign: "center", animation: "float 3s ease-in-out infinite", order: "-1" }}>👥</div>
          <div>
            <h2 style={{ fontSize: "2rem", color: "#f9fafb", marginTop: "0", marginBottom: "1rem" }}>� Meet the Team</h2>
            <p style={{ color: "#9ca3af", marginBottom: "1.5rem", lineHeight: "1.7", fontSize: "0.95rem" }}>
              Get to know the talented team behind SciHub. Built by passionate students and educators, our team is dedicated to transforming science education and making learning accessible to everyone.
            </p>
            <ul style={{ color: "#9ca3af", marginBottom: "2rem" }}>
              <li style={{ marginBottom: "0.8rem" }}>🌟 Student creators with a mission</li>
              <li style={{ marginBottom: "0.8rem" }}>💡 Diverse expertise across science and tech</li>
              <li style={{ marginBottom: "0.8rem" }}>🤝 Passionate about helping students succeed</li>
              <li>🚀 Committed to continuous innovation</li>
            </ul>
            <Link to="/about-tutors" className="primary-btn">
              Meet the Team →
            </Link>
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div style={{
        background: "linear-gradient(135deg, rgba(56, 189, 248, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)",
        border: "2px solid rgba(56, 189, 248, 0.4)",
        borderRadius: "20px",
        padding: "3rem 2rem",
        textAlign: "center",
        marginBottom: "4rem",
      }}>
        <h2 style={{ fontSize: "2rem", marginTop: "0", marginBottom: "1rem", color: "#f9fafb" }}>🚀 Ready to Transform Your Science Learning?</h2>
        <p style={{ fontSize: "1.05rem", color: "#9ca3af", marginBottom: "2rem", maxWidth: "600px", margin: "0 auto 2rem" }}>
          Join thousands of students who are improving their grades and falling in love with science. Start your journey today!
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/signup" className="primary-btn">
            Get Started Now
          </Link>
          <Link to="/features" className="primary-btn" style={{ background: "linear-gradient(135deg, #a855f7, #667eea)" }}>
            Learn More
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </section>
  );
}

export default Home;
