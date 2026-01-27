// src/App.js
import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { clearUserData } from "./utils/storageManager";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";

// Public pages
import Home from "./pages/Home";
import About from "./pages/About";
import Mission from "./pages/Mission";
import Features from "./pages/Features";
import AboutTutors from "./pages/AboutTutors";

// Auth
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// Core logged-in pages
import Dashboard from "./pages/Dashboard";
import Resources from "./pages/Resources";
// You can keep ScienceDetail if you still use it for older lessons:
import ScienceDetail from "./pages/ScienceDetail";



// Tutoring + games
import Schedule from "./pages/Schedule";
import Games from "./pages/Games";

// Profile
import Profile from "./pages/Profile";

// NEW pages you’ll add:
import QnA from "./pages/QnA.js";         // Q & A per unit/lesson
import UnitTest from "./pages/UnitTest.js"; // Unit test per subscience
import NaturalScience from "./pages/NaturalScience";
import SocialScience from "./pages/SocialScience";
import Psychology from "./pages/social/Psychology";
import HumanGeography from "./pages/social/HumanGeography";
import History from "./pages/social/History";
import Economics from "./pages/social/Economics";
import Biology from "./pages/natural/Biology";
import Chemistry from "./pages/natural/Chemistry";
import Physics from "./pages/natural/Physics";
import EnvironmentalScience from "./pages/natural/EnvironmentalScience";
import Lesson from "./pages/Lesson";

function App() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("dark");
  const [notifications, setNotifications] = useState([]);

  const [stats, setStats] = useState({
    xp: 0,
    coins: 0,
    streak: 0,
    lessonsCompleted: 0,
    lessonsInProgress: 0,
    totalGameScore: 0,
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [bookedSessions, setBookedSessions] = useState([]);

  const navigate = useNavigate();

  // Restore user from localStorage so you don’t get logged out on navigation/refresh
  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (error) {
        console.error("❌ Error parsing user from localStorage:", error);
        localStorage.removeItem("user");
        setUser(null);
      }
    }
  }, []);

  function toggleTheme() {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }

  function addNotification(text) {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, text }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  }

  function handleLogin(userData) {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    addNotification("Logged in successfully");
    navigate("/dashboard");
  }

  function handleSignup(userData) {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    addNotification("Account created successfully");
    navigate("/dashboard");
  }

  function handleLogout() {
    try {
      // Clear all user-specific data from localStorage
      if (user && user.id) {
        clearUserData(user.id);
      }
      
      // Clear user from global storage
      localStorage.removeItem("user");
      
      // Reset app state
      setUser(null);
      setStats({
        xp: 0,
        coins: 0,
        streak: 0,
        lessonsCompleted: 0,
        lessonsInProgress: 0,
        totalGameScore: 0,
      });
      setRecentActivity([]);
      addNotification("Logged out successfully!");
      console.log("✅ Logout successful, navigating to home...");
      
      // Navigate after a short delay to ensure state clears
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 100);
    } catch (error) {
      console.error("❌ Logout error:", error);
      addNotification("Error logging out");
    }
  }

  // Dashboard helpers
  function addActivity(activity) {
    setRecentActivity((prev) => [
      { id: Date.now(), ...activity },
      ...prev,
    ]);
  }

  function addBookedSession(session) {
    setBookedSessions((prev) => [...prev, { id: Date.now(), ...session }]);
    addNotification("Session booked and saved on your dashboard");
    addActivity({
      title: `Booked session with ${session.tutorName}`,
      type: "Tutoring",
      subject: session.subject,
      status: "Upcoming",
      date: new Date().toLocaleDateString(),
    });
    // You can also give a little XP here later
  }

  // LESSON COMPLETION: XP + coins + activity
  function handleLessonCompleted({ subject, title }) {
    setStats((prev) => ({
      ...prev,
      xp: prev.xp + 50,
      coins: prev.coins + 5,
      lessonsCompleted: prev.lessonsCompleted + 1,
    }));
    addActivity({
      title: `Completed: ${title}`,
      type: "Lesson",
      subject,
      status: "Completed",
      date: new Date().toLocaleDateString(),
    });
  }

  // GAME WIN: XP + coins + total score
  function handleGameWin(score, subject) {
    setStats((prev) => ({
      ...prev,
      xp: prev.xp + 20,
      coins: prev.coins + 2,
      totalGameScore: prev.totalGameScore + score,
    }));
    addActivity({
      title: `Game played in ${subject}`,
      type: "Game",
      subject,
      status: `+${score} pts`,
      date: new Date().toLocaleDateString(),
    });
  }

  // Q&A HELP: XP for helping
  function handleHelpInQnA(subject) {
    setStats((prev) => ({
      ...prev,
      xp: prev.xp + 10,
    }));
    addActivity({
      title: `Helped in Q & A`,
      type: "Q&A",
      subject,
      status: "Helpful answer",
      date: new Date().toLocaleDateString(),
    });
  }

  function handleGoToResources() {
    navigate("/resources");
  }

  return (
    <div className={`app ${theme}`}>
      {/* Notifications */}
      <div className="notifications">
        {notifications.map((n) => (
          <div key={n.id} className="notification-card slide-up">
            {n.text}
          </div>
        ))}
      </div>

      {/* Public navbar only when not logged in */}
      {!user && (
        <Navbar
          user={user}
          onLogout={handleLogout}
          toggleTheme={toggleTheme}
          theme={theme}
        />
      )}

      {/* Sidebar when logged in */}
      {user && <Sidebar user={user} onLogout={handleLogout} />}

      <main className={`main-content ${user ? "with-sidebar" : ""}`}>
        <Routes>
          {/* PUBLIC ROUTES */}
          {!user && (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/mission" element={<Mission />} />
              <Route path="/features" element={<Features />} />
              <Route path="/about-tutors" element={<AboutTutors />} />
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              <Route path="/signup" element={<Signup onSignup={handleSignup} />} />
            </>
          )}

          {/* PRIVATE ROUTES */}
          {user && (
            <>
              <Route
                path="/"
                element={
                  <Dashboard
                    user={user}
                    stats={stats}
                    recentActivity={recentActivity}
                    bookedSessions={bookedSessions}
                    onGoToResources={handleGoToResources}
                  />
                }
              />

              <Route
                path="/dashboard"
                element={
                  <Dashboard
                    user={user}
                    stats={stats}
                    recentActivity={recentActivity}
                    bookedSessions={bookedSessions}
                    onGoToResources={handleGoToResources}
                  />
                }
              />

              {/* Units and lessons */}
              <Route path="/resources" element={<Resources />} />
              <Route path="/resources/natural" element={<NaturalScience />} />
              <Route path="/resources/social" element={<SocialScience />} />
              <Route path="/natural/biology" element={<Biology />} />
              <Route path="/natural/chemistry" element={<Chemistry />} />
              <Route path="/natural/physics" element={<Physics />} />
              <Route path="/natural/environmental-science" element={<EnvironmentalScience />} />
              <Route path="/social/psychology" element={<Psychology />} />
              <Route path="/social/human-geography" element={<HumanGeography />} />
              <Route path="/social/history" element={<History />} />
              <Route path="/social/economics" element={<Economics />} />
              {/* If you still use ScienceDetail for specific lessons */}
              <Route
                path="/resources/:branch/:scienceId"
                element={
                  <ScienceDetail onLessonCompleted={handleLessonCompleted} />
                }
              />

             
              {/* Lesson Detail Page */}
              <Route path="/lesson/:lessonId" element={<Lesson />} />

              {/* Tutoring */}
              <Route
                path="/schedule"
                element={<Schedule onBookSession={addBookedSession} />}
              />

              {/* Games (global + per unit) */}
              <Route
                path="/games"
                element={<Games onGameWin={handleGameWin} />}
              />
              <Route
                path="/games/:subId"
                element={<Games onGameWin={handleGameWin} />}
              />

              {/* Q & A */}
              <Route
                path="/qna"
                element={<QnA onHelp={handleHelpInQnA} />}
              />
              <Route
                path="/qna/:subId"
                element={<QnA onHelp={handleHelpInQnA} />}
              />

              {/* Unit test per subscience */}
              <Route
                path="/unit-test/:subId"
                element={<UnitTest onComplete={handleLessonCompleted} />}
              />

              {/* Profile */}
              <Route
                path="/profile"
                element={<Profile user={user} onUpdate={setUser} onLogout={handleLogout} />}
              />
            </>
          )}

          {/* CATCH-ALL */}
          <Route
            path="*"
            element={<Navigate to={user ? "/dashboard" : "/"} replace />}
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
