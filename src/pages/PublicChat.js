import React, { useState } from "react";

function PublicChat() {
  const [messages, setMessages] = useState([
    { user: "System", text: "Welcome to the SciHub Study Chat!" },
  ]);
  const [input, setInput] = useState("");

  function sendMessage(e) {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { user: "Student", text: input }]);
    setInput("");
  }

  return (
    <section className="page fade-in">
      <h1 className="slide-up">Public Study Chat</h1>
      <p className="slide-up" style={{ maxWidth: "700px" }}>
        Ask questions, help others, and learn together.
      </p>

      <div className="card slide-up" style={{ height: "400px", display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, overflowY: "auto", marginBottom: "1rem" }}>
          {messages.map((m, i) => (
            <p key={i}><strong>{m.user}:</strong> {m.text}</p>
          ))}
        </div>

        <form onSubmit={sendMessage} style={{ display: "flex", gap: "0.5rem" }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
          />
          <button className="primary-btn">Send</button>
        </form>
      </div>
    </section>
  );
}

export default PublicChat;
