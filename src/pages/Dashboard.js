import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "./Dashboard.css";
import {
  getDashboardStats,
  getBookedSessions,
  getActivityLog,
  getUserAchievementProgress,
  checkAndUnlockAchievements,
} from "../utils/storageManager";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const user = JSON.parse(localStorage.getItem("user") || "null") || null;

  // Function to load data from localStorage
  const loadDashboardData = () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Load stats from localStorage using storageManager
      const userStats = getDashboardStats(user.id);
      setStats(userStats);

      // Check and unlock any new achievements
      const newlyUnlocked = checkAndUnlockAchievements(user.id);
      if (newlyUnlocked.length > 0) {
        console.log(`🏆 New achievements unlocked: ${newlyUnlocked.length}`);
      }

      // Load user achievement progress
      const achievementProgress = getUserAchievementProgress(user.id);
      setAchievements(achievementProgress);

      // Load booked sessions
      const sessions = getBookedSessions(user.id);
      // Convert session times to Date objects and sort by date
      const upcomingSessions = sessions
        .map(session => ({
          ...session,
          session_time: new Date(session.sessionTime || session.session_time),
        }))
        .filter(session => new Date(session.session_time) > new Date())
        .sort((a, b) => new Date(a.session_time) - new Date(b.session_time))
        .slice(0, 5);

      setUpcomingSessions(upcomingSessions);

      // Load activity log
      const activities = getActivityLog(user.id, 10);
      const formattedActivities = activities.map(activity => ({
        ...activity,
        created_at: new Date(activity.created_at),
      }));
      setRecentActivity(formattedActivities);

      console.log("✅ Dashboard data loaded from localStorage");
      setLoading(false);
    } catch (error) {
      console.error("❌ Error loading dashboard data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();

    // Listen for dashboard updates from other pages
    const handleDashboardUpdate = (event) => {
      console.log("📊 Dashboard update received:", event.detail);
      // Reload data when update event is received
      loadDashboardData();
    };

    // Also listen for custom storage change event
    const handleStorageChange = () => {
      console.log("🔄 Storage changed - refreshing dashboard");
      loadDashboardData();
    };

    window.addEventListener("dashboardUpdate", handleDashboardUpdate);
    window.addEventListener("dashboardStorageChange", handleStorageChange);

    // Set up interval to refresh stats every 10 seconds to catch changes from other tabs
    const refreshInterval = setInterval(() => {
      loadDashboardData();
    }, 10000);

    return () => {
      window.removeEventListener("dashboardUpdate", handleDashboardUpdate);
      window.removeEventListener("dashboardStorageChange", handleStorageChange);
      clearInterval(refreshInterval);
    };
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

  // Calculate lesson progress safely (handle division by zero)
  const totalLessons = (stats?.lessonsCompleted || 0) + (stats?.lessonsInProgress || 0);
  const lessonProgress = totalLessons > 0 ? ((stats?.lessonsCompleted || 0) / totalLessons) * 100 : 0;
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
                  {stats?.lessonsCompleted || 0}/{totalLessons}
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
                  {achievements.length === 0 ? (
                    <p className="empty-state">Loading achievements...</p>
                  ) : (
                    achievements.map((achievement) => {
                      const colorMap = {
                        green: "#10b981",
                        orange: "#f97316",
                        blue: "#3b82f6",
                        purple: "#a855f7",
                        cyan: "#06b6d4",
                        yellow: "#eab308",
                        red: "#ef4444",
                        indigo: "#6366f1",
                      };
                      const bgColor = colorMap[achievement.color] || "#3b82f6";
                      
                      return (
                        <div 
                          key={achievement.id} 
                          style={{
                            padding: "20px",
                            borderRadius: "12px",
                            textAlign: "center",
                            background: achievement.unlocked 
                              ? `linear-gradient(135deg, ${bgColor}, ${bgColor}dd)`
                              : "rgba(100, 116, 139, 0.2)",
                            border: `2px solid ${achievement.unlocked ? bgColor : "rgba(148, 163, 184, 0.3)"}`,
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            transform: "scale(1)",
                            opacity: achievement.unlocked ? 1 : 0.6,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "scale(1.05)";
                            e.currentTarget.style.boxShadow = achievement.unlocked 
                              ? `0 8px 16px ${bgColor}40`
                              : "0 4px 8px rgba(0, 0, 0, 0.2)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "scale(1)";
                            e.currentTarget.style.boxShadow = "none";
                          }}
                          title={achievement.unlocked ? `Unlocked: ${new Date(achievement.unlockedAt).toLocaleDateString()}` : "Locked"}
                        >
                          <div style={{
                            fontSize: "32px",
                            marginBottom: "8px",
                            filter: achievement.unlocked ? "none" : "grayscale(100%)",
                          }}>
                            {achievement.icon}
                          </div>
                          <div style={{
                            fontSize: "14px",
                            fontWeight: "600",
                            marginBottom: "6px",
                            color: "#f9fafb",
                          }}>
                            {achievement.title}
                          </div>
                          <div style={{
                            fontSize: "12px",
                            color: achievement.unlocked ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 255, 255, 0.6)",
                            marginBottom: "8px",
                            minHeight: "32px",
                          }}>
                            {achievement.description}
                          </div>
                          {achievement.unlocked && (
                            <div style={{
                              fontSize: "11px",
                              marginTop: "8px",
                              padding: "4px 8px",
                              background: "rgba(0, 0, 0, 0.2)",
                              borderRadius: "6px",
                              color: "rgba(255, 255, 255, 0.8)",
                            }}>
                              ✓ Unlocked
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
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
