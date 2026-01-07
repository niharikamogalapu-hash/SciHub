import React, { useState } from "react";

function SciPetChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "pet",
      text: "Hey! I’m SciPet 🧪. Ask me what to study next, or where to find a topic.",
    },
  ]);
  const [input, setInput] = useState("");

  function handleSend(e) {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { from: "user", text: input.trim() };
    const lower = input.toLowerCase();

    let reply =
      "Great question! Check your Dashboard, then open Resources or Worksheet to go deeper.";
    if (lower.includes("tutor")) {
      reply = "Try the Tutoring and Schedule pages to pick a tutor and time.";
    } else if (lower.includes("game")) {
      reply = "The Games page has quick science challenges to warm up your brain.";
    } else if (lower.includes("worksheet") || lower.includes("practice")) {
      reply =
        "Open Worksheet to practice. After you submit, your Analysis page will show what to review.";
    } else if (lower.includes("stuck") || lower.includes("hard")) {
      reply =
        "Totally normal to get stuck. Break the problem into smaller parts, then try one step at a time.";
    }

    const petMessage = { from: "pet", text: reply };
    setMessages((prev) => [...prev, userMessage, petMessage]);
    setInput("");
  }

  return (
    <div className="scipet-container">
      {isOpen && (
        <section className="scipet-chat fade-in" aria-label="SciPet AI helper">
          <header className="scipet-header">
            <h2>SciPet AI</h2>
            <p className="scipet-subtitle">
              Ask for help with topics, features, or study ideas.
            </p>
          </header>

          <div className="scipet-messages">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`message ${
                  m.from === "pet" ? "message-pet" : "message-user"
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>

          <form className="scipet-input-row" onSubmit={handleSend}>
            <label htmlFor="scipet-input" className="sr-only">
              Ask SciPet a question
            </label>
            <input
              id="scipet-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask SciPet anything..."
            />
            <button type="submit" className="primary-btn small">
              Send
            </button>
          </form>
        </section>
      )}

      <button
        className="scipet-toggle"
        onClick={() => setIsOpen((o) => !o)}
        aria-expanded={isOpen}
      >
        🧪
      </button>
    </div>
  );
}

export default SciPetChat;

