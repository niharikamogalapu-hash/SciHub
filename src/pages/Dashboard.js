import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "./Dashboard.css";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const user = JSON.parse(localStorage.getItem("user") || "null") || null;

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    // Set default mock data
    const mockStats = {
      xp: 2450,
      coins: 125,
      streak: 7,
      lessonsCompleted: 12,
      lessonsInProgress: 8,
      totalGameScore: 3540,
    };

    const mockSessions = [
      { id: 1, subject: "Biology", tutorName: "Ms. Johnson", session_time: new Date(Date.now() + 86400000) },
      { id: 2, subject: "Chemistry", tutorName: "Mr. Smith", session_time: new Date(Date.now() + 172800000) },
    ];

    const mockActivity = [
      { id: 1, type: "Game Won", description: "Completed Cell Structure Master", subject: "Biology", created_at: new Date() },
      { id: 2, type: "Lesson Completed", description: "Finished Photosynthesis lesson", subject: "Biology", created_at: new Date(Date.now() - 3600000) },
      { id: 3, type: "Quiz Passed", description: "Aced Chemistry Basics", subject: "Chemistry", created_at: new Date(Date.now() - 7200000) },
    ];

    // Backend API disabled - using mock data instead
    console.log("✅ Backend API disabled - using mock data for Dashboard");
    setStats(mockStats);
    setUpcomingSessions(mockSessions);
    setRecentActivity(mockActivity);
    setLoading(false);

    // Listen for dashboard updates from other pages
    const handleDashboardUpdate = (event) => {
      console.log("📊 Dashboard update received:", event.detail);
      const { type, activity, session, stats: newStats } = event.detail;

      // Update stats if provided
      if (newStats) {
        setStats(prev => ({ ...prev, ...newStats }));
      }

      // Add new activity
      if (activity) {
        setRecentActivity(prev => [activity, ...prev.slice(0, 4)]);
      }

      // Add new session
      if (session) {
        setUpcomingSessions(prev => [session, ...prev]);
      }

      console.log(`✅ Dashboard updated: ${type}`);
    };

    window.addEventListener("dashboardUpdate", handleDashboardUpdate);

    return () => window.removeEventListener("dashboardUpdate", handleDashboardUpdate);
  }, [user?.id]);

  // Calendar helper functions
  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} style={{
          background: "transparent",
          cursor: "default",
        }}></div>
      );
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const isToday = i === new Date().getDate() && currentMonth.getMonth() === new Date().getMonth();
      days.push(
        <div key={i} style={{
          padding: "10px",
          background: isToday 
            ? "linear-gradient(135deg, #38bdf8, #0ea5e9)"
            : "rgba(148, 163, 184, 0.08)",
          border: isToday 
            ? "1px solid rgba(56, 189, 248, 0.4)"
            : "1px solid rgba(148, 163, 184, 0.15)",
          borderRadius: "8px",
          color: isToday ? "white" : "#9ca3af",
          textAlign: "center",
          fontSize: "0.9rem",
          fontWeight: isToday ? "700" : "500",
          cursor: "pointer",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          if (!isToday) {
            e.target.style.background = "rgba(56, 189, 248, 0.15)";
            e.target.style.color = "#38bdf8";
            e.target.style.borderColor = "rgba(56, 189, 248, 0.3)";
          }
        }}
        onMouseLeave={(e) => {
          if (!isToday) {
            e.target.style.background = "rgba(148, 163, 184, 0.08)";
            e.target.style.color = "#9ca3af";
            e.target.style.borderColor = "rgba(148, 163, 184, 0.15)";
          }
        }}>
          {i}
        </div>
      );
    }

    return days;
  };

  if (!user) {
    return <h1 style={{ color: "white" }}>Please log in</h1>;
  }

  const lessonProgress = stats ? (stats.lessonsCompleted / (stats.lessonsCompleted + stats.lessonsInProgress)) * 100 : 0;
  const xpProgress = stats ? (stats.xp % 1000) / 10 : 0;

  return (
    <div className="dashboard-page">
      <Sidebar />

      <main className="dashboard-main">
        {/* HERO SECTION */}
        <header className="dashboard-hero">
          <div>
            <h1>Welcome back, {user.firstName}! 👋</h1>
            <p>Keep up your streak and continue mastering new subjects</p>
          </div>
          <div className="dashboard-streak">
            <div className="dashboard-streak-number">🔥 {stats?.streak || 0}</div>
            <div className="dashboard-streak-label">Day Streak</div>
          </div>
        </header>

        {loading ? (
          <div className="loading-indicator">
            <div className="loading-emoji">⏳</div>
            <p>Loading your dashboard...</p>
          </div>
        ) : stats ? (
          <>
            {/* TOP STATS ROW */}
            <div className="dashboard-stats-grid">
              {/* XP Card */}
              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-label">Total XP</div>
                <div className="stat-value">{stats.xp || 0}</div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${xpProgress}%` }}></div>
                </div>
                <div className="progress-text">
                  <span>Next Level</span>
                  <span>{Math.floor(stats.xp % 1000)} / 1000</span>
                </div>
              </div>

              {/* Coins Card */}
              <div className="stat-card coins-card">
                <div className="stat-icon">💰</div>
                <div className="stat-label">Coins</div>
                <div className="stat-value">{stats.coins}</div>
                <div style={{ color: "#6b7280", fontSize: "0.85rem", padding: "0.5rem 0.75rem", background: "rgba(252, 211, 77, 0.1)", borderRadius: "8px" }}>
                  🎁 Earn from games & lessons
                </div>
              </div>

              {/* Lessons Card */}
              <div className="stat-card lessons-card">
                <div className="stat-icon">📚</div>
                <div className="stat-label">Lessons</div>
                <div className="stat-value">
                  {stats.lessonsCompleted}/{stats.lessonsCompleted + stats.lessonsInProgress}
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ background: "linear-gradient(90deg, #60a5fa 0%, #3b82f6 100%)", width: `${lessonProgress}%` }}></div>
                </div>
                <div className="progress-text">
                  <span>Progress</span>
                  <span>{Math.floor(lessonProgress)}%</span>
                </div>
              </div>

              {/* Game Score Card */}
              <div className="stat-card games-card">
                <div className="stat-icon">🎮</div>
                <div className="stat-label">Game Score</div>
                <div className="stat-value">{stats.totalGameScore || 0}</div>
                <div style={{ color: "#6b7280", fontSize: "0.85rem", padding: "0.5rem 0.75rem", background: "rgba(168, 85, 247, 0.1)", borderRadius: "8px" }}>
                  📈 +250 this week
                </div>
              </div>
            </div>

            {/* MIDDLE SECTION - CALENDAR & ACHIEVEMENTS */}
            <div className="dashboard-content-grid">
              {/* CALENDAR */}
              <div className="dashboard-section">
                <div className="calendar-header">
                  <h3>📅 Calendar</h3>
                  <div style={{ display: "flex", gap: "0.75rem" }}>
                    <button 
                      className="calendar-nav-button"
                      onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}>
                      ←
                    </button>
                    <button 
                      className="calendar-nav-button"
                      onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}>
                      →
                    </button>
                  </div>
                </div>
                <div className="calendar-month">
                  {currentMonth.toLocaleString("default", { month: "long", year: "numeric" })}
                </div>
                <div className="calendar-grid">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="calendar-day-header">{day}</div>
                  ))}
                  {renderCalendar()}
                </div>
              </div>

              {/* ACHIEVEMENT BADGES */}
              <div className="dashboard-section">
                <h3>🏆 Achievements</h3>
                <div className="achievements-grid">
                  <div className="achievement-badge green">
                    <div className="achievement-icon">🌟</div>
                    <div className="achievement-title">Rising Star</div>
                    <div className="achievement-stat">2000+ XP</div>
                  </div>
                  <div className="achievement-badge orange">
                    <div className="achievement-icon">🔥</div>
                    <div className="achievement-title">On Fire</div>
                    <div className="achievement-stat">7 Day Streak</div>
                  </div>
                  <div className="achievement-badge blue">
                    <div className="achievement-icon">🎮</div>
                    <div className="achievement-title">Game Master</div>
                    <div className="achievement-stat">3000+ Score</div>
                  </div>
                  <div className="achievement-badge purple">
                    <div className="achievement-icon">📚</div>
                    <div className="achievement-title">Scholar</div>
                    <div className="achievement-stat">10 Lessons</div>
                  </div>
                </div>
              </div>
            </div>

            {/* BOTTOM SECTION - ACTIVITY & UPCOMING */}
            <div className="dashboard-content-grid">
              {/* RECENT ACTIVITY */}
              <div className="dashboard-section">
                <h3>📈 Recent Activity</h3>
                {recentActivity.length === 0 ? (
                  <p className="empty-state">No activity yet. Start learning!</p>
                ) : (
                  <div>
                    {recentActivity.slice(0, 5).map((item) => (
                      <div key={item.id} className="activity-item">
                        <div className="activity-header">
                          <div className="activity-type">{item.type}</div>
                          <div className="timestamp">
                            {new Date(item.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                        <p className="activity-description">{item.description}</p>
                        <p className="activity-subject">📌 {item.subject}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* UPCOMING SESSIONS */}
              <div className="dashboard-section">
                <h3>📅 Upcoming Sessions</h3>
                {upcomingSessions.length === 0 ? (
                  <p className="empty-state">No upcoming sessions. Book one now!</p>
                ) : (
                  <div>
                    {upcomingSessions.slice(0, 5).map((session) => (
                      <div key={session.id} className="session-item">
                        <div className="session-header">
                          <div className="session-subject">{session.subject}</div>
                          <div className="timestamp">
                            {new Date(session.session_time).toLocaleDateString()}
                          </div>
                        </div>
                        <p className="session-tutor">👨‍🏫 {session.tutorName}</p>
                        <p className="session-time">
                          ⏰ {new Date(session.session_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <p style={{ color: "#9ca3af", textAlign: "center" }}>No stats available. Please refresh.</p>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
