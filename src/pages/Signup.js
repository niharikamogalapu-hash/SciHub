import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
// Database disabled - using localStorage instead
// import axios from "axios";

function Signup({ onSignup }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      // LOCAL STORAGE MODE - Database disabled
      // Retrieve existing registered users
      const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
      
      // Check if email already exists
      if (registeredUsers.some(u => u.email === email)) {
        setError("Email already registered. Please log in or use a different email.");
        return;
      }

      // Create new user object with a simple ID
      const newUser = {
        id: Date.now().toString(), // Simple unique ID based on timestamp
        firstName,
        lastName,
        email,
        password, // Note: In production, this should be hashed!
        createdAt: new Date().toISOString(),
      };

      // Add new user to the registered users list
      registeredUsers.push(newUser);
      
      // Save updated users list to localStorage
      localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));
      
      // Save current logged-in user to localStorage
      localStorage.setItem("user", JSON.stringify(newUser));
      
      console.log("✅ Signup successful:", newUser);
      
      // Call parent signup handler
      onSignup(newUser);
      
      // Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error("❌ Signup error:", err);
      setError("Signup failed. Please try again.");
    }
  }

  return (
    <section className="page auth-page fade-in">
      <h1 className="slide-up">Create your SciHub account</h1>

      <form className="auth-form slide-up" onSubmit={handleSubmit}>
        {error && <p className="error-msg">{error}</p>}

        <label>
          First Name
          <input
            type="text"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </label>

        <label>
          Last Name
          <input
            type="text"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </label>

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
          Sign up
        </button>
      </form>

      <p className="slide-up">
        Already have an account?{" "}
        <Link className="link-btn" to="/login">
          Log in
        </Link>
      </p>
    </section>
  );
}

export default Signup;








