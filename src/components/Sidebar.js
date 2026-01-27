
// src/components/Sidebar.js
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";

function Sidebar({ user, onLogout }) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const [hoveredDropdown, setHoveredDropdown] = useState(null);

  function handleLogoClick() {
    navigate("/dashboard");
  }

  return (
    <aside style={{
      position: "fixed",
      left: 0,
      top: 0,
      height: "100vh",
      width: collapsed ? "80px" : "260px",
      background: "linear-gradient(180deg, #0f172a 0%, #1a1f35 100%)",
      borderRight: "1px solid rgba(148, 163, 184, 0.15)",
      display: "flex",
      flexDirection: "column",
      padding: "20px 0",
      zIndex: 1200,
      transition: "width 300ms ease",
      overflowY: "auto",
      overflowX: "hidden",
      boxShadow: "0 8px 32px rgba(139, 92, 246, 0.1)"
    }}>
      {/* Logo Section */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: collapsed ? "center" : "space-between",
        padding: collapsed ? "16px 12px" : "16px 20px",
        marginBottom: "30px",
        gap: "12px"
      }}>
        {collapsed ? (
          <button
            onClick={() => setCollapsed(false)}
            aria-label="Expand sidebar"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "40px",
              height: "40px",
              background: "linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)",
              border: "none",
              borderRadius: "10px",
              color: "white",
              cursor: "pointer",
              fontSize: "1.2rem",
              transition: "all 200ms ease",
              padding: 0,
              boxShadow: "0 6px 20px rgba(139, 92, 246, 0.3)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            ›
          </button>
        ) : (
          <>
            <button
              onClick={handleLogoClick}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background: "none",
                border: "none",
                color: "#fff",
                cursor: "pointer",
                fontWeight: "700",
                fontSize: "1rem",
                transition: "all 200ms ease",
                padding: 0,
                flexShrink: 0
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <div style={{
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)",
                borderRadius: "10px",
                fontSize: "1.4rem",
                flexShrink: 0,
                boxShadow: "0 6px 20px rgba(139, 92, 246, 0.3)"
              }}>
                🔬
              </div>
              <span style={{ fontSize: "0.95rem" }}>SciHub</span>
            </button>
            <button
              onClick={() => setCollapsed(true)}
              aria-label="Collapse sidebar"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "38px",
                height: "38px",
                background: "rgba(139, 92, 246, 0.1)",
                border: "1px solid rgba(139, 92, 246, 0.3)",
                borderRadius: "8px",
                color: "#8b5cf6",
                cursor: "pointer",
                fontSize: "1rem",
                transition: "all 200ms ease",
                padding: 0
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(139, 92, 246, 0.2)";
                e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(139, 92, 246, 0.1)";
                e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.3)";
              }}
            >
              ‹
            </button>
          </>
        )}
      </div>

      {/* Navigation */}
      <nav style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        flex: 1,
        width: "100%",
        padding: "0 12px"
      }}>
        {/* Dashboard */}
        <NavLink
          to="/dashboard"
          className={({ isActive }) => isActive ? "active" : ""}
          style={({ isActive }) => ({
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: collapsed ? "10px" : "10px 14px",
            color: isActive ? "#06b6d4" : "#cbd5e1",
            textDecoration: "none",
            fontWeight: "500",
            fontSize: "0.9rem",
            transition: "all 200ms ease",
            borderRadius: "8px",
            background: isActive ? "rgba(6, 182, 212, 0.15)" : "transparent",
            borderLeft: isActive ? "3px solid #06b6d4" : "3px solid transparent",
            minHeight: "44px",
            justifyContent: collapsed ? "center" : "flex-start"
          })}
          onMouseEnter={(e) => {
            if (!e.currentTarget.classList.contains("active")) {
              e.currentTarget.style.background = "rgba(6, 182, 212, 0.08)";
            }
          }}
          onMouseLeave={(e) => {
            if (!e.currentTarget.classList.contains("active")) {
              e.currentTarget.style.background = "transparent";
            }
          }}
        >
          <span style={{ fontSize: "1.3rem" }}>📊</span>
          {!collapsed && <span>Dashboard</span>}
        </NavLink>

        {/* Resources */}
        <NavLink
          to="/resources"
          className={({ isActive }) => isActive ? "active" : ""}
          style={({ isActive }) => ({
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: collapsed ? "10px" : "10px 14px",
            color: isActive ? "#8b5cf6" : "#cbd5e1",
            textDecoration: "none",
            fontWeight: "500",
            fontSize: "0.9rem",
            transition: "all 200ms ease",
            borderRadius: "8px",
            background: isActive ? "rgba(139, 92, 246, 0.15)" : "transparent",
            borderLeft: isActive ? "3px solid #8b5cf6" : "3px solid transparent",
            minHeight: "44px",
            justifyContent: collapsed ? "center" : "flex-start"
          })}
          onMouseEnter={(e) => {
            if (!e.currentTarget.classList.contains("active")) {
              e.currentTarget.style.background = "rgba(139, 92, 246, 0.08)";
            }
          }}
          onMouseLeave={(e) => {
            if (!e.currentTarget.classList.contains("active")) {
              e.currentTarget.style.background = "transparent";
            }
          }}
        >
          <span style={{ fontSize: "1.3rem" }}>📚</span>
          {!collapsed && <span>Resources</span>}
        </NavLink>

        {/* Community Q&A */}
        <NavLink
          to="/qna"
          className={({ isActive }) => isActive ? "active" : ""}
          style={({ isActive }) => ({
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: collapsed ? "10px" : "10px 14px",
            color: isActive ? "#10b981" : "#cbd5e1",
            textDecoration: "none",
            fontWeight: "500",
            fontSize: "0.9rem",
            transition: "all 200ms ease",
            borderRadius: "8px",
            background: isActive ? "rgba(16, 185, 129, 0.15)" : "transparent",
            borderLeft: isActive ? "3px solid #10b981" : "3px solid transparent",
            minHeight: "44px",
            justifyContent: collapsed ? "center" : "flex-start"
          })}
          onMouseEnter={(e) => {
            if (!e.currentTarget.classList.contains("active")) {
              e.currentTarget.style.background = "rgba(16, 185, 129, 0.08)";
            }
          }}
          onMouseLeave={(e) => {
            if (!e.currentTarget.classList.contains("active")) {
              e.currentTarget.style.background = "transparent";
            }
          }}
        >
          <span style={{ fontSize: "1.3rem" }}>❓</span>
          {!collapsed && <span>Community</span>}
        </NavLink>

        {/* Games */}
        <NavLink
          to="/games"
          className={({ isActive }) => isActive ? "active" : ""}
          style={({ isActive }) => ({
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: collapsed ? "10px" : "10px 14px",
            color: isActive ? "#f59e0b" : "#cbd5e1",
            textDecoration: "none",
            fontWeight: "500",
            fontSize: "0.9rem",
            transition: "all 200ms ease",
            borderRadius: "8px",
            background: isActive ? "rgba(245, 158, 11, 0.15)" : "transparent",
            borderLeft: isActive ? "3px solid #f59e0b" : "3px solid transparent",
            minHeight: "44px",
            justifyContent: collapsed ? "center" : "flex-start"
          })}
          onMouseEnter={(e) => {
            if (!e.currentTarget.classList.contains("active")) {
              e.currentTarget.style.background = "rgba(245, 158, 11, 0.08)";
            }
          }}
          onMouseLeave={(e) => {
            if (!e.currentTarget.classList.contains("active")) {
              e.currentTarget.style.background = "transparent";
            }
          }}
        >
          <span style={{ fontSize: "1.3rem" }}>🎮</span>
          {!collapsed && <span>Games</span>}
        </NavLink>
      </nav>

      {/* Bottom Section */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        padding: "0 12px",
        borderTop: "1px solid rgba(148, 163, 184, 0.1)",
        paddingTop: "20px"
      }}>
        {/* Profile */}
        <NavLink
          to="/profile"
          className={({ isActive }) => isActive ? "active" : ""}
          style={({ isActive }) => ({
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: collapsed ? "10px" : "10px 14px",
            color: isActive ? "#a855f7" : "#cbd5e1",
            textDecoration: "none",
            fontWeight: "500",
            fontSize: "0.9rem",
            transition: "all 200ms ease",
            borderRadius: "8px",
            background: isActive ? "rgba(168, 85, 247, 0.15)" : "transparent",
            borderLeft: isActive ? "3px solid #a855f7" : "3px solid transparent",
            minHeight: "44px",
            justifyContent: collapsed ? "center" : "flex-start"
          })}
          onMouseEnter={(e) => {
            if (!e.currentTarget.classList.contains("active")) {
              e.currentTarget.style.background = "rgba(168, 85, 247, 0.08)";
            }
          }}
          onMouseLeave={(e) => {
            if (!e.currentTarget.classList.contains("active")) {
              e.currentTarget.style.background = "transparent";
            }
          }}
        >
          <span style={{ fontSize: "1.3rem" }}>👤</span>
          {!collapsed && <span>Profile</span>}
        </NavLink>

        {/* Logout */}
        <button
          onClick={() => {
            console.log("🔘 Logout button clicked");
            if (onLogout) {
              console.log("✅ onLogout handler exists, calling...");
              onLogout();
            } else {
              console.warn("⚠️ onLogout handler not provided");
            }
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: collapsed ? "10px" : "10px 14px",
            color: "#cbd5e1",
            background: "transparent",
            border: "none",
            fontWeight: "500",
            fontSize: "0.9rem",
            transition: "all 200ms ease",
            borderRadius: "8px",
            borderLeft: "3px solid transparent",
            cursor: "pointer",
            minHeight: "44px",
            justifyContent: collapsed ? "center" : "flex-start"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
            e.currentTarget.style.borderLeftColor = "#ef4444";
            e.currentTarget.style.color = "#ef4444";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderLeftColor = "transparent";
            e.currentTarget.style.color = "#cbd5e1";
          }}
        >
          <span style={{ fontSize: "1.3rem" }}>🚪</span>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
