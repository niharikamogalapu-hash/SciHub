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
      // Retrieve all registered users from localStorage
      const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
      
      // Find user with matching email and password
      const user = registeredUsers.find(u => u.email === email && u.password === password);
      
      if (user) {
        // Save current logged-in user to localStorage
        localStorage.setItem("user", JSON.stringify(user));

        // Call parent login handler
        onLogin(user);

        // Redirect to dashboard
        navigate("/dashboard");
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again.");
    }
  }

  return (
    <section className="page auth-page fade-in">
      <h1 className="slide-up">Log in</h1>

      <form className="auth-form slide-up" onSubmit={handleSubmit}>
        {error && <p className="error-msg">{error}</p>}

        <label>
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label>
          Password
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ paddingRight: "2.5rem" }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "0.5rem",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "var(--text-muted)",
                cursor: "pointer",
              }}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </label>

        <button type="submit" className="primary-btn">
          Log in
        </button>
      </form>

      <p className="slide-up">
        Don’t have an account?{" "}
        <Link className="link-btn" to="/signup">
          Sign up
        </Link>
      </p>
    </section>
  );
}

export default Login;
