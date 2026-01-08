import React from "react";
import { Link } from "react-router-dom";

function Navbar({ user, onLogout }) {
  return (
    <header className="navbar">
      {/* Logo */}
      <div className="logo">
        <span className="logo-icon">🔬</span>
        <Link to="/" className="logo-text">
          SciHub
        </Link>
      </div>

      {/* Navigation */}
      <nav aria-label="Main navigation">
        <Link className="nav-link" to="/">Home</Link>
        <Link className="nav-link" to="/about">About</Link>
        <Link className="nav-link" to="/mission">Mission</Link>
        <Link className="nav-link" to="/features">Features</Link>
        <Link className="nav-link" to="/about-tutors">Meet the Team</Link>

        {user && (
          <>
            <Link className="nav-link" to="/dashboard">Dashboard</Link>
            <Link className="nav-link" to="/tutoring">Tutoring</Link>
            <Link className="nav-link" to="/schedule">Schedule</Link>
            <Link className="nav-link" to="/resources">Resources</Link>
            <Link className="nav-link" to="/games">Games</Link>
            <Link className="nav-link" to="/chat">Study Chat</Link>
            <Link className="nav-link" to="/ai-quiz">AI Quiz</Link>
            <Link className="nav-link" to="/profile">Profile</Link>
          </>
        )}
      </nav>

      {/* Auth */}
      <div className="nav-auth">
        {user ? (
          <>
            <span className="nav-user">{user.name}</span>
            <button className="primary-btn small" onClick={onLogout}>
              Log out
            </button>
          </>
        ) : (
          <>
            <Link className="ghost-btn small" to="/login">
              Log in
            </Link>
            <Link className="primary-btn small" to="/signup">
              Sign up
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Navbar;

