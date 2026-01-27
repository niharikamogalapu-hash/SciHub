// src/pages/Login.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
// Database disabled - using localStorage instead
// import axios from "axios";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      // LOCAL STORAGE MODE - Database disabled
      // Trim and validate inputs
      const trimmedEmail = email.trim().toLowerCase();
      const trimmedPassword = password.trim();

      if (!trimmedEmail || !trimmedPassword) {
        setError("Please enter both email and password");
        return;
      }

      // Retrieve all registered users from localStorage
      const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
      
      console.log("🔍 Login attempt with email:", trimmedEmail);
      console.log("📝 Registered users count:", registeredUsers.length);
      
      // Find user with matching email and password (case-insensitive email)
      const user = registeredUsers.find(u => {
        const userEmail = (u.email || "").trim().toLowerCase();
        const userPassword = (u.password || "").trim();
        return userEmail === trimmedEmail && userPassword === trimmedPassword;
      });
      
      if (user) {
        console.log("✅ Login successful for user:", user.email);
        // Save current logged-in user to localStorage
        localStorage.setItem("user", JSON.stringify(user));

        // Call parent login handler
        onLogin(user);

        // Redirect to dashboard
        navigate("/dashboard");
      } else {
        console.log("❌ No matching user found for email:", trimmedEmail);
        setError("Invalid email or password");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again.");
    }
  }

  return (
    <section
      className="page fade-in"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "85vh",
        background: "radial-gradient(circle at top, #0b1120 0, #020617 50%, #020617 100%)",
      }}
    >
      <div style={{ width: "100%", maxWidth: "420px" }}>
        {/* Heading with Gradient */}
        <h1
          className="slide-up"
          style={{
            fontSize: "2.5rem",
            fontWeight: "700",
            textAlign: "center",
            marginBottom: "0.5rem",
            background: "linear-gradient(135deg, #38bdf8 0%, #a855f7 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Welcome Back
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#9ca3af",
            marginBottom: "2.5rem",
            fontSize: "0.95rem",
            animation: "slideUp 0.7s ease forwards 0.1s",
            opacity: 0,
          }}
        >
          Sign in to continue your learning journey
        </p>

        {/* Card with Gradient Background */}
        <div
          style={{
            background: "linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(31, 41, 55, 0.6) 100%)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(56, 189, 248, 0.2)",
            borderRadius: "16px",
            padding: "2.5rem",
            boxShadow: "0 20px 60px rgba(15, 23, 42, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
            animation: "slideUp 0.7s ease forwards 0.2s",
            opacity: 0,
          }}
        >
          <form onSubmit={handleSubmit}>
            {/* Error Message */}
            {error && (
              <div
                style={{
                  background: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  color: "#fca5a5",
                  padding: "0.75rem 1rem",
                  borderRadius: "8px",
                  marginBottom: "1.5rem",
                  fontSize: "0.9rem",
                  animation: "slideUp 0.5s ease",
                }}
              >
                {error}
              </div>
            )}

            {/* Email Input */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: "#f9fafb",
                  fontSize: "0.95rem",
                  fontWeight: "500",
                }}
              >
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  background: "rgba(15, 23, 42, 0.6)",
                  border: "1px solid rgba(56, 189, 248, 0.3)",
                  borderRadius: "10px",
                  color: "#f9fafb",
                  fontSize: "0.95rem",
                  transition: "all 0.3s ease",
                  outline: "none",
                }}
                onFocus={(e) => {
                  e.target.style.border = "1px solid rgba(56, 189, 248, 0.8)";
                  e.target.style.background = "rgba(15, 23, 42, 0.9)";
                  e.target.style.boxShadow = "0 0 20px rgba(56, 189, 248, 0.2)";
                }}
                onBlur={(e) => {
                  e.target.style.border = "1px solid rgba(56, 189, 248, 0.3)";
                  e.target.style.background = "rgba(15, 23, 42, 0.6)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Password Input */}
            <div style={{ marginBottom: "2rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: "#f9fafb",
                  fontSize: "0.95rem",
                  fontWeight: "500",
                }}
              >
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    paddingRight: "2.75rem",
                    background: "rgba(15, 23, 42, 0.6)",
                    border: "1px solid rgba(56, 189, 248, 0.3)",
                    borderRadius: "10px",
                    color: "#f9fafb",
                    fontSize: "0.95rem",
                    transition: "all 0.3s ease",
                    outline: "none",
                  }}
                  onFocus={(e) => {
                    e.target.style.border = "1px solid rgba(56, 189, 248, 0.8)";
                    e.target.style.background = "rgba(15, 23, 42, 0.9)";
                    e.target.style.boxShadow = "0 0 20px rgba(56, 189, 248, 0.2)";
                  }}
                  onBlur={(e) => {
                    e.target.style.border = "1px solid rgba(56, 189, 248, 0.3)";
                    e.target.style.background = "rgba(15, 23, 42, 0.6)";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "#9ca3af",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    fontWeight: "500",
                    transition: "color 0.2s ease",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "#38bdf8")}
                  onMouseLeave={(e) => (e.target.style.color = "#9ca3af")}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "0.9rem 1.5rem",
                background: "linear-gradient(135deg, #38bdf8, #a855f7)",
                color: "#020617",
                border: "none",
                borderRadius: "10px",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 14px 30px rgba(56, 189, 248, 0.35)",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 18px 40px rgba(56, 189, 248, 0.5)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 14px 30px rgba(56, 189, 248, 0.35)";
              }}
            >
              Sign In
            </button>
          </form>
        </div>

        {/* Signup Link */}
        <p
          style={{
            textAlign: "center",
            color: "#9ca3af",
            marginTop: "2rem",
            fontSize: "0.95rem",
            animation: "slideUp 0.7s ease forwards 0.3s",
            opacity: 0,
          }}
        >
          Don't have an account?{" "}
          <Link
            to="/signup"
            style={{
              color: "#38bdf8",
              textDecoration: "none",
              fontWeight: "600",
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => (e.target.style.color = "#a855f7")}
            onMouseLeave={(e) => (e.target.style.color = "#38bdf8")}
          >
            Create account
          </Link>
        </p>
      </div>
    </section>
  );
}

export default Login;
