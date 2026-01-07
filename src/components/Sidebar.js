
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
    <aside className={`sidebar ${collapsed ? "collapsed" : "expanded"}`}>
      <div className="sidebar-top">
        <button className="sidebar-logo" onClick={handleLogoClick}>
          <span className="sidebar-logo-icon" title="SciHub logo">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2v20" stroke="#e6eef8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="6" cy="8" r="2" stroke="#e6eef8" strokeWidth="1.5"/>
              <circle cx="18" cy="16" r="2" stroke="#e6eef8" strokeWidth="1.5"/>
            </svg>
          </span>
          {!collapsed && <span className="sidebar-logo-text">SciHub</span>}
        </button>

        <button
          className="sidebar-toggle"
          onClick={() => setCollapsed((prev) => !prev)}
          aria-label="Toggle sidebar"
        >
          {collapsed ? "›" : "‹"}
        </button>
      </div>

<nav className="sidebar-nav">

  {/* Dashboard */}
  <NavLink to="/dashboard" className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}>
    <span className="sidebar-icon" title="Dashboard">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 11.5L12 4l9 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M21 13v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </span>
    {!collapsed && <span className="sidebar-label">Dashboard</span>}
  </NavLink>

  {/* Resources */}
  <NavLink to="/resources" className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}>
    <span className="sidebar-icon" title="Resources">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M12 7v5l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    </span>
    {!collapsed && <span className="sidebar-label">Resources</span>}
  </NavLink>

  {/* Community */}
  <NavLink to="/qna" className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}>
    <span className="sidebar-icon" title="Community">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </span>
    {!collapsed && <span className="sidebar-label">Community</span>}
  </NavLink>

  {/* Games */}
  <NavLink to="/games" className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}>
    <span className="sidebar-icon" title="Games">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 12h.01M10 8h.01M10 16h.01M14 12h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="2" y="6" width="20" height="12" rx="3" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </span>
    {!collapsed && <span className="sidebar-label">Games</span>}
  </NavLink>

</nav>


      <div className="sidebar-bottom">
        {/* Profile */}
        <NavLink to="/profile" className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}>
          <span className="sidebar-icon" title="Profile">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          </span>
          {!collapsed && <span className="sidebar-label">Profile</span>}
        </NavLink>

        {/* Logout */}
        <button className="sidebar-logout-btn" onClick={onLogout} title="Log out">
          <span className="sidebar-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 17l5-5-5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 5v14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          {!collapsed && <span className="sidebar-label">Logout</span>}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
