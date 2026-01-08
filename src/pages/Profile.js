import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";

function Profile({ user, onUpdate }) {
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setCurrentUser(parsedUser);
      setFirstName(parsedUser.firstName || "");
      setLastName(parsedUser.lastName || "");
      setEmail(parsedUser.email || "");
    }
  }, []);

  function handleSave(e) {
    e.preventDefault();
    if (onUpdate) {
      onUpdate({ firstName, lastName, email, notifications });
    }
    // Update localStorage
    const updatedUser = { ...currentUser, firstName, lastName, email, notifications };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    alert("Profile updated!");
  }

  function handleLogout() {
    localStorage.removeItem("user");
    window.location.href = "/login";
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0f172a" }}>
      <Sidebar user={currentUser} onLogout={handleLogout} />

      <main style={{ flex: 1, padding: "40px", background: "#0f172a", animation: "fadeInScale 0.5s ease-out" }}>
        {/* Hero Section */}
        <header style={{
          background: "linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #f43f5e 100%)",
          padding: "50px 40px",
          borderRadius: "16px",
          marginBottom: "40px",
          color: "white",
          boxShadow: "0 20px 40px rgba(168, 85, 247, 0.2)"
        }}>
          <div style={{ fontSize: "3rem", marginBottom: "16px" }}>👤</div>
          <h1 style={{ fontSize: "2.8rem", margin: "0 0 12px 0", fontWeight: "800" }}>Your Profile</h1>
          <p style={{ fontSize: "1.1rem", margin: 0, opacity: 0.95 }}>Manage your account settings and preferences</p>
        </header>

        {/* Profile Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", marginBottom: "40px" }}>
          {/* User Info Section */}
          <div style={{
            background: "rgba(51, 65, 85, 0.3)",
            border: "1px solid rgba(168, 85, 247, 0.2)",
            borderRadius: "14px",
            padding: "30px",
            animation: "slideUp 0.8s ease-out 0.1s both"
          }}>
            <h2 style={{ fontSize: "1.5rem", margin: "0 0 24px 0", color: "#f9fafb", fontWeight: "700" }}>Account Information</h2>
            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <label style={{
                  display: "block",
                  color: "#cbd5e1",
                  marginBottom: "10px",
                  fontWeight: "600",
                  fontSize: "0.95rem"
                }}>
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    background: "rgba(15, 23, 42, 0.8)",
                    border: "1px solid rgba(148, 163, 184, 0.3)",
                    borderRadius: "8px",
                    color: "#f9fafb",
                    fontSize: "1rem",
                    boxSizing: "border-box",
                    transition: "all 0.2s"
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(168, 85, 247, 0.5)";
                    e.target.style.background = "rgba(15, 23, 42, 1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(148, 163, 184, 0.3)";
                    e.target.style.background = "rgba(15, 23, 42, 0.8)";
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: "block",
                  color: "#cbd5e1",
                  marginBottom: "10px",
                  fontWeight: "600",
                  fontSize: "0.95rem"
                }}>
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    background: "rgba(15, 23, 42, 0.8)",
                    border: "1px solid rgba(148, 163, 184, 0.3)",
                    borderRadius: "8px",
                    color: "#f9fafb",
                    fontSize: "1rem",
                    boxSizing: "border-box",
                    transition: "all 0.2s"
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(168, 85, 247, 0.5)";
                    e.target.style.background = "rgba(15, 23, 42, 1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(148, 163, 184, 0.3)";
                    e.target.style.background = "rgba(15, 23, 42, 0.8)";
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: "block",
                  color: "#cbd5e1",
                  marginBottom: "10px",
                  fontWeight: "600",
                  fontSize: "0.95rem"
                }}>
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    background: "rgba(15, 23, 42, 0.8)",
                    border: "1px solid rgba(148, 163, 184, 0.3)",
                    borderRadius: "8px",
                    color: "#f9fafb",
                    fontSize: "1rem",
                    boxSizing: "border-box",
                    transition: "all 0.2s"
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(168, 85, 247, 0.5)";
                    e.target.style.background = "rgba(15, 23, 42, 1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(148, 163, 184, 0.3)";
                    e.target.style.background = "rgba(15, 23, 42, 0.8)";
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: "block",
                  color: "#cbd5e1",
                  marginBottom: "10px",
                  fontWeight: "600",
                  fontSize: "0.95rem"
                }}>
                  New Password (Leave blank to keep current)
                </label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    background: "rgba(15, 23, 42, 0.8)",
                    border: "1px solid rgba(148, 163, 184, 0.3)",
                    borderRadius: "8px",
                    color: "#f9fafb",
                    fontSize: "1rem",
                    boxSizing: "border-box",
                    transition: "all 0.2s"
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(168, 85, 247, 0.5)";
                    e.target.style.background = "rgba(15, 23, 42, 1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(148, 163, 184, 0.3)";
                    e.target.style.background = "rgba(15, 23, 42, 0.8)";
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  background: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
                  border: "none",
                  color: "white",
                  padding: "12px 28px",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s",
                  marginTop: "10px"
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 8px 20px rgba(168, 85, 247, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "none";
                }}
              >
                Save Changes
              </button>
            </form>
          </div>

          {/* Preferences Section */}
          <div style={{
            background: "rgba(51, 65, 85, 0.3)",
            border: "1px solid rgba(168, 85, 247, 0.2)",
            borderRadius: "14px",
            padding: "30px",
            animation: "slideUp 0.8s ease-out 0.2s both"
          }}>
            <h2 style={{ fontSize: "1.5rem", margin: "0 0 24px 0", color: "#f9fafb", fontWeight: "700" }}>Preferences</h2>
            
            <div style={{
              background: "rgba(168, 85, 247, 0.1)",
              border: "1px solid rgba(168, 85, 247, 0.2)",
              borderRadius: "10px",
              padding: "20px",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "16px"
            }}>
              <input
                type="checkbox"
                checked={notifications}
                onChange={() => setNotifications(!notifications)}
                style={{
                  width: "20px",
                  height: "20px",
                  cursor: "pointer",
                  accentColor: "#a855f7"
                }}
              />
              <div>
                <label style={{ color: "#f9fafb", fontWeight: "600", cursor: "pointer", display: "block" }}>
                  Enable Notifications
                </label>
                <p style={{ color: "#cbd5e1", fontSize: "0.9rem", margin: "6px 0 0 0" }}>
                  Receive updates about your learning progress
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div style={{ marginTop: "40px" }}>
              <h3 style={{ fontSize: "1.2rem", margin: "0 0 20px 0", color: "#f9fafb", fontWeight: "700" }}>📊 Quick Stats</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{
                  background: "rgba(6, 182, 212, 0.1)",
                  border: "1px solid rgba(6, 182, 212, 0.3)",
                  borderRadius: "8px",
                  padding: "16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <span style={{ color: "#cbd5e1", fontWeight: "600" }}>XP</span>
                  <span style={{ color: "#06b6d4", fontSize: "1.3rem", fontWeight: "700" }}>{currentUser?.xp || 0}</span>
                </div>
                <div style={{
                  background: "rgba(16, 185, 129, 0.1)",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  borderRadius: "8px",
                  padding: "16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <span style={{ color: "#cbd5e1", fontWeight: "600" }}>Coins</span>
                  <span style={{ color: "#10b981", fontSize: "1.3rem", fontWeight: "700" }}>{currentUser?.coins || 0}</span>
                </div>
                <div style={{
                  background: "rgba(245, 158, 11, 0.1)",
                  border: "1px solid rgba(245, 158, 11, 0.3)",
                  borderRadius: "8px",
                  padding: "16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <span style={{ color: "#cbd5e1", fontWeight: "600" }}>Level</span>
                  <span style={{ color: "#f59e0b", fontSize: "1.3rem", fontWeight: "700" }}>{currentUser?.level || 1}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div style={{
          background: "rgba(239, 68, 68, 0.1)",
          border: "1px solid rgba(239, 68, 68, 0.3)",
          borderRadius: "14px",
          padding: "30px",
          animation: "slideUp 0.8s ease-out 0.3s both"
        }}>
          <h2 style={{ fontSize: "1.3rem", margin: "0 0 16px 0", color: "#ef4444", fontWeight: "700" }}>⚠️ Danger Zone</h2>
          <p style={{ color: "#cbd5e1", marginBottom: "20px" }}>This action is permanent and cannot be undone.</p>
          <button
            onClick={handleLogout}
            style={{
              background: "rgba(239, 68, 68, 0.2)",
              border: "1px solid rgba(239, 68, 68, 0.5)",
              color: "#ef4444",
              padding: "12px 28px",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s"
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "rgba(239, 68, 68, 0.3)";
              e.target.style.borderColor = "rgba(239, 68, 68, 0.7)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "rgba(239, 68, 68, 0.2)";
              e.target.style.borderColor = "rgba(239, 68, 68, 0.5)";
            }}
          >
            Logout
          </button>
        </div>
      </main>
    </div>
  );
}

export default Profile;
