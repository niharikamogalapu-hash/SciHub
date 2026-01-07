import React, { useState } from "react";

function Profile({ user, onUpdate }) {
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [notifications, setNotifications] = useState(true);

  function handleSave(e) {
    e.preventDefault();
    onUpdate({ name, email, notifications });
    alert("Profile updated!");
  }

  return (
    <section className="page fade-in">
      <h1 className="slide-up">Your Profile</h1>

      <form className="auth-form slide-up" onSubmit={handleSave}>
        <label>
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>

        <label>
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>

        <label>
          New Password
          <input
            type="password"
            placeholder="Leave blank to keep current"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <label style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <input
            type="checkbox"
            checked={notifications}
            onChange={() => setNotifications(!notifications)}
          />
          Enable notifications
        </label>

        <button className="primary-btn">Save Changes</button>
      </form>
    </section>
  );
}

export default Profile;
