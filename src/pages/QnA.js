import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import "./QnA.css";

// Helper function to format dates
function formatDate(date) {
  if (!date) return "just now";
  try {
    let d;
    // Handle string, Date object, or plain object with date properties
    if (typeof date === "string") {
      d = new Date(date);
    } else if (date instanceof Date) {
      d = date;
    } else if (typeof date === "object" && date.toString) {
      // Plain object - try to convert
      d = new Date(date.toString());
    } else {
      return "just now";
    }
    
    // Validate the date
    if (!(d instanceof Date) || isNaN(d)) {
      return "just now";
    }
    
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString();
  } catch (error) {
    console.error("formatDate error:", error, date);
    return "just now";
  }
}

// Shared localStorage key for Q&A data
const QNA_STORAGE_KEY = "scihub_qna_questions";

// Get questions from localStorage
function getStoredQuestions() {
  try {
    const stored = localStorage.getItem(QNA_STORAGE_KEY);
    if (stored) {
      const questions = JSON.parse(stored);
      // Convert ISO strings back to Date objects
      return questions.map(q => ({
        ...q,
        timestamp: new Date(q.timestamp),
        replies: (q.replies || []).map(r => ({
          ...r,
          timestamp: new Date(r.timestamp),
        })),
      }));
    }
    return getDefaultQuestions();
  } catch (error) {
    console.error("❌ Error reading from localStorage:", error);
    return getDefaultQuestions();
  }
}

// Save questions to localStorage
function saveQuestions(questions) {
  try {
    // Convert Date objects to ISO strings for proper serialization
    const serialized = questions.map(q => ({
      ...q,
      timestamp: q.timestamp instanceof Date ? q.timestamp.toISOString() : q.timestamp,
      replies: (q.replies || []).map(r => ({
        ...r,
        timestamp: r.timestamp instanceof Date ? r.timestamp.toISOString() : r.timestamp,
      })),
    }));
    localStorage.setItem(QNA_STORAGE_KEY, JSON.stringify(serialized));
    console.log("✅ Q&A questions saved to localStorage:", serialized.length, "questions");
  } catch (error) {
    console.error("❌ Error saving to localStorage:", error);
  }
}

// Default questions
function getDefaultQuestions() {
  return [
      {
        id: 1,
        title: "What is photosynthesis?",
        body: "Can someone explain how photosynthesis works and why it's important for life on Earth?",
        author: "Sarah Johnson",
        authorId: 2,
        timestamp: new Date(Date.now() - 86400000),
        views: 245,
        replies: [
          {
            id: 1,
            body: "Photosynthesis is the process where plants convert sunlight into chemical energy. It's crucial for producing oxygen and food.",
            author: "Mr. Smith",
            authorId: 3,
            timestamp: new Date(Date.now() - 79200000),
            upvotes: 12,
          },
          {
            id: 2,
            body: "The process involves two main stages: light-dependent and light-independent reactions.",
            author: "Emma Wilson",
            authorId: 4,
            timestamp: new Date(Date.now() - 72000000),
            upvotes: 8,
          },
        ],
      },
      {
        id: 2,
        title: "Help with algebra equations",
        body: "I'm struggling with solving quadratic equations. Any tips or resources?",
        author: "Michael Chen",
        authorId: 5,
        timestamp: new Date(Date.now() - 172800000),
        views: 156,
        replies: [
          {
            id: 3,
            body: "Use the quadratic formula: x = (-b ± √(b²-4ac)) / 2a. Practice with different values!",
            author: "Alex Kumar",
            authorId: 6,
            timestamp: new Date(Date.now() - 165600000),
            upvotes: 15,
          },
        ],
      },
      {
        id: 3,
        title: "Best study techniques for finals",
        body: "What study methods work best for you all? Looking for some new approaches to try.",
        author: "Jessica Brown",
        authorId: 7,
        timestamp: new Date(Date.now() - 259200000),
        views: 389,
        replies: [
          {
            id: 4,
            body: "Spaced repetition is scientifically proven! Review material at increasing intervals.",
            author: "Thomas Lee",
            authorId: 8,
            timestamp: new Date(Date.now() - 252000000),
            upvotes: 22,
          },
          {
            id: 5,
            body: "I use the Pomodoro technique: 25 min study, 5 min break. It keeps me focused!",
            author: "Lisa Park",
            authorId: 9,
            timestamp: new Date(Date.now() - 244800000),
            upvotes: 18,
          },
        ],
      },
    ];
  }

function QnA() {
  const [questions, setQuestions] = useState([]);
  const [showNewQuestion, setShowNewQuestion] = useState(false);
  const [newQuestionTitle, setNewQuestionTitle] = useState("");
  const [newQuestionBody, setNewQuestionBody] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [newReply, setNewReply] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "null") || null;

  // Load questions from localStorage on mount
  useEffect(() => {
    const stored = getStoredQuestions();
    setQuestions(stored);
  }, []);

  const handlePostQuestion = (e) => {
    e.preventDefault();
    if (!newQuestionTitle.trim() || !newQuestionBody.trim()) return;

    const question = {
      id: questions.length + 1,
      title: newQuestionTitle,
      body: newQuestionBody,
      author: user?.firstName || "Anonymous",
      authorId: user?.id || 0,
      timestamp: new Date(),
      views: 0,
      replies: [],
    };

    const updated = [question, ...questions];
    setQuestions(updated);
    saveQuestions(updated);
    console.log("✅ New question posted and saved:", question.title);
    setNewQuestionTitle("");
    setNewQuestionBody("");
    setShowNewQuestion(false);
  };

  const handlePostReply = (e) => {
    e.preventDefault();
    if (!newReply.trim() || !selectedQuestion) return;

    const updatedQuestions = questions.map((q) => {
      if (q.id === selectedQuestion.id) {
        const reply = {
          id: (q.replies?.length || 0) + 1,
          body: newReply,
          author: user?.firstName || "Anonymous",
          authorId: user?.id || 0,
          timestamp: new Date(),
          upvotes: 0,
        };
        return {
          ...q,
          replies: [...(q.replies || []), reply],
        };
      }
      return q;
    });

    setQuestions(updatedQuestions);
    saveQuestions(updatedQuestions);
    console.log("✅ Reply posted and saved to question:", selectedQuestion.id);
    setSelectedQuestion(updatedQuestions.find((q) => q.id === selectedQuestion.id));
    setNewReply("");
  };

  const filteredQuestions = questions
    .filter((q) =>
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.body.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "newest") return b.timestamp - a.timestamp;
      if (sortBy === "oldest") return a.timestamp - b.timestamp;
      if (sortBy === "mostViewed") return b.views - a.views;
      if (sortBy === "mostAnswered")
        return (b.replies?.length || 0) - (a.replies?.length || 0);
      return 0;
    });

  const formatDate = (date) => {
    if (!date) return "just now";
    try {
      let d;
      // Handle string, Date object, or plain object with date properties
      if (typeof date === "string") {
        d = new Date(date);
      } else if (date instanceof Date) {
        d = date;
      } else if (typeof date === "object" && date.toString) {
        // Plain object - try to convert
        d = new Date(date.toString());
      } else {
        return "just now";
      }
      
      // Validate the date
      if (!(d instanceof Date) || isNaN(d)) {
        return "just now";
      }
      
      const now = new Date();
      const diff = now - d;
      const hours = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);

      if (hours < 1) return "just now";
      if (hours < 24) return `${hours}h ago`;
      if (days < 7) return `${days}d ago`;
      return d.toLocaleDateString();
    } catch (error) {
      console.error("formatDate error:", error, date);
      return "just now";
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0f172a" }}>
      <Sidebar
        user={user}
        onLogout={() => {
          localStorage.removeItem("user");
          window.location.href = "/login";
        }}
      />

      <main className="qna-main-animated" style={{ flex: 1, padding: "40px", background: "#0f172a" }}>
        {/* Hero Section */}
        <header style={{
          background: "linear-gradient(135deg, #8b5cf6 0%, #06b6d4 50%, #0ea5e9 100%)",
          padding: "50px 40px",
          borderRadius: "16px",
          marginBottom: "40px",
          color: "white",
          boxShadow: "0 20px 40px rgba(139, 92, 246, 0.2)"
        }}>
          <div style={{ fontSize: "3rem", marginBottom: "16px" }}>❓</div>
          <h1 style={{ fontSize: "2.8rem", margin: "0 0 12px 0", fontWeight: "800" }}>Community Q&A</h1>
          <p style={{ fontSize: "1.1rem", margin: 0, opacity: 0.95, maxWidth: "600px" }}>
            Ask questions and share knowledge with the SciHub community. Learn together, grow together!
          </p>
          <button
            onClick={() => setShowNewQuestion(!showNewQuestion)}
            style={{
              marginTop: "24px",
              background: "rgba(255, 255, 255, 0.2)",
              border: "2px solid rgba(255, 255, 255, 0.3)",
              color: "white",
              padding: "12px 28px",
              borderRadius: "10px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s",
              backdropFilter: "blur(10px)"
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "rgba(255, 255, 255, 0.3)";
              e.target.style.borderColor = "rgba(255, 255, 255, 0.5)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "rgba(255, 255, 255, 0.2)";
              e.target.style.borderColor = "rgba(255, 255, 255, 0.3)";
            }}
          >
            + Ask a Question
          </button>
        </header>

        {/* New Question Form */}
        {showNewQuestion && (
          <div style={{
            background: "rgba(51, 65, 85, 0.5)",
            border: "1px solid rgba(148, 163, 184, 0.2)",
            borderRadius: "14px",
            padding: "30px",
            marginBottom: "40px",
            backdropFilter: "blur(10px)"
          }}>
            <h2 style={{ fontSize: "1.8rem", margin: "0 0 24px 0", color: "#f9fafb" }}>Ask a Question</h2>
            <form onSubmit={handlePostQuestion}>
              <div style={{ marginBottom: "24px" }}>
                <label style={{
                  display: "block",
                  color: "#cbd5e1",
                  marginBottom: "10px",
                  fontWeight: "600",
                  fontSize: "0.95rem"
                }}>
                  Question Title
                </label>
                <input
                  type="text"
                  placeholder="What's your question?"
                  value={newQuestionTitle}
                  onChange={(e) => setNewQuestionTitle(e.target.value)}
                  required
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
                    e.target.style.borderColor = "rgba(139, 92, 246, 0.5)";
                    e.target.style.background = "rgba(15, 23, 42, 1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(148, 163, 184, 0.3)";
                    e.target.style.background = "rgba(15, 23, 42, 0.8)";
                  }}
                />
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label style={{
                  display: "block",
                  color: "#cbd5e1",
                  marginBottom: "10px",
                  fontWeight: "600",
                  fontSize: "0.95rem"
                }}>
                  Details
                </label>
                <textarea
                  placeholder="Provide more details about your question..."
                  value={newQuestionBody}
                  onChange={(e) => setNewQuestionBody(e.target.value)}
                  rows="6"
                  required
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    background: "rgba(15, 23, 42, 0.8)",
                    border: "1px solid rgba(148, 163, 184, 0.3)",
                    borderRadius: "8px",
                    color: "#f9fafb",
                    fontSize: "1rem",
                    boxSizing: "border-box",
                    fontFamily: "inherit",
                    transition: "all 0.2s"
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(139, 92, 246, 0.5)";
                    e.target.style.background = "rgba(15, 23, 42, 1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(148, 163, 184, 0.3)";
                    e.target.style.background = "rgba(15, 23, 42, 0.8)";
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  type="submit"
                  style={{
                    background: "linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)",
                    border: "none",
                    color: "white",
                    padding: "12px 28px",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 8px 20px rgba(139, 92, 246, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "none";
                  }}
                >
                  Post Question
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewQuestion(false)}
                  style={{
                    background: "rgba(100, 116, 139, 0.2)",
                    border: "1px solid rgba(148, 163, 184, 0.3)",
                    color: "#cbd5e1",
                    padding: "12px 28px",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "rgba(100, 116, 139, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "rgba(100, 116, 139, 0.2)";
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search & Sort Controls */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 200px",
          gap: "16px",
          marginBottom: "30px"
        }}>
          <input
            type="text"
            placeholder="🔍 Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: "12px 16px",
              background: "rgba(51, 65, 85, 0.4)",
              border: "1px solid rgba(148, 163, 184, 0.3)",
              borderRadius: "8px",
              color: "#f9fafb",
              fontSize: "1rem",
              transition: "all 0.2s"
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "rgba(139, 92, 246, 0.5)";
              e.target.style.background = "rgba(51, 65, 85, 0.6)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "rgba(148, 163, 184, 0.3)";
              e.target.style.background = "rgba(51, 65, 85, 0.4)";
            }}
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: "12px 16px",
              background: "rgba(51, 65, 85, 0.4)",
              border: "1px solid rgba(148, 163, 184, 0.3)",
              borderRadius: "8px",
              color: "#cbd5e1",
              fontSize: "0.95rem",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="mostViewed">Most Viewed</option>
            <option value="mostAnswered">Most Answered</option>
          </select>
        </div>

        {/* Main Content */}
        {selectedQuestion ? (
          /* Question Detail View */
          <div>
            <button
              onClick={() => setSelectedQuestion(null)}
              style={{
                background: "rgba(100, 116, 139, 0.2)",
                border: "1px solid rgba(148, 163, 184, 0.3)",
                color: "#cbd5e1",
                padding: "8px 16px",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "0.95rem",
                marginBottom: "24px",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(100, 116, 139, 0.3)";
                e.target.style.borderColor = "rgba(148, 163, 184, 0.5)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(100, 116, 139, 0.2)";
                e.target.style.borderColor = "rgba(148, 163, 184, 0.3)";
              }}
            >
              ← Back to Questions
            </button>

            <div style={{
              background: "rgba(51, 65, 85, 0.3)",
              border: "1px solid rgba(148, 163, 184, 0.2)",
              borderRadius: "14px",
              padding: "30px",
              marginBottom: "30px"
            }}>
              <h2 style={{ fontSize: "2rem", margin: "0 0 16px 0", color: "#f9fafb" }}>
                {selectedQuestion.title}
              </h2>
              <div style={{
                display: "flex",
                gap: "16px",
                color: "#94a3b8",
                fontSize: "0.95rem",
                marginBottom: "24px"
              }}>
                <span>👤 {selectedQuestion.author}</span>
                <span>•</span>
                <span>⏱️ {formatDate(selectedQuestion.timestamp)}</span>
                <span>•</span>
                <span>👁️ {selectedQuestion.views} views</span>
              </div>

              <div style={{
                color: "#cbd5e1",
                fontSize: "1.05rem",
                lineHeight: "1.6"
              }}>
                {selectedQuestion.body}
              </div>
            </div>

            {/* Replies Section */}
            <div style={{ marginBottom: "30px" }}>
              <h3 style={{
                fontSize: "1.4rem",
                margin: "0 0 20px 0",
                color: "#f9fafb"
              }}>
                💬 Answers ({selectedQuestion.replies?.length || 0})
              </h3>

              {selectedQuestion.replies && selectedQuestion.replies.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {selectedQuestion.replies.map((reply) => (
                    <div
                      key={reply.id}
                      style={{
                        background: "rgba(51, 65, 85, 0.3)",
                        border: "1px solid rgba(16, 185, 129, 0.2)",
                        borderLeft: "4px solid #10b981",
                        borderRadius: "10px",
                        padding: "20px",
                        transition: "all 0.3s"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "rgba(16, 185, 129, 0.4)";
                        e.currentTarget.style.background = "rgba(51, 65, 85, 0.4)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "rgba(16, 185, 129, 0.2)";
                        e.currentTarget.style.background = "rgba(51, 65, 85, 0.3)";
                      }}
                    >
                      <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "12px",
                        fontSize: "0.9rem"
                      }}>
                        <span style={{ color: "#10b981", fontWeight: "600" }}>✓ {reply.author}</span>
                        <span style={{ color: "#94a3b8" }}>{formatDate(reply.timestamp)}</span>
                      </div>
                      <p style={{
                        color: "#cbd5e1",
                        fontSize: "1rem",
                        lineHeight: "1.6",
                        margin: "0 0 12px 0"
                      }}>
                        {reply.body}
                      </p>
                      <button
                        style={{
                          background: "rgba(16, 185, 129, 0.2)",
                          border: "1px solid rgba(16, 185, 129, 0.3)",
                          color: "#10b981",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontSize: "0.85rem",
                          fontWeight: "600",
                          transition: "all 0.2s"
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = "rgba(16, 185, 129, 0.3)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = "rgba(16, 185, 129, 0.2)";
                        }}
                      >
                        👍 {reply.upvotes > 0 ? reply.upvotes : "Helpful"}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{
                  background: "rgba(100, 116, 139, 0.2)",
                  border: "1px dashed rgba(148, 163, 184, 0.3)",
                  borderRadius: "10px",
                  padding: "30px",
                  textAlign: "center",
                  color: "#94a3b8"
                }}>
                  <p>No answers yet. Be the first to reply!</p>
                </div>
              )}
            </div>

            {/* Reply Form */}
            <div style={{
              background: "rgba(51, 65, 85, 0.3)",
              border: "1px solid rgba(148, 163, 184, 0.2)",
              borderRadius: "14px",
              padding: "30px"
            }}>
              <h4 style={{ fontSize: "1.2rem", margin: "0 0 20px 0", color: "#f9fafb" }}>Your Answer</h4>
              <form onSubmit={handlePostReply}>
                <textarea
                  placeholder="Share your answer..."
                  value={newReply}
                  onChange={(e) => setNewReply(e.target.value)}
                  rows="4"
                  required
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    background: "rgba(15, 23, 42, 0.8)",
                    border: "1px solid rgba(148, 163, 184, 0.3)",
                    borderRadius: "8px",
                    color: "#f9fafb",
                    fontSize: "1rem",
                    boxSizing: "border-box",
                    fontFamily: "inherit",
                    marginBottom: "16px",
                    transition: "all 0.2s"
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(139, 92, 246, 0.5)";
                    e.target.style.background = "rgba(15, 23, 42, 1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(148, 163, 184, 0.3)";
                    e.target.style.background = "rgba(15, 23, 42, 0.8)";
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: "linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)",
                    border: "none",
                    color: "white",
                    padding: "12px 28px",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 8px 20px rgba(139, 92, 246, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "none";
                  }}
                >
                  Post Answer
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Questions List View */
          <div>
            {filteredQuestions.length > 0 ? (
              <div style={{
                display: "grid",
                gap: "16px"
              }}>
                {filteredQuestions.map((question) => (
                  <div
                    key={question.id}
                    onClick={() => setSelectedQuestion(question)}
                    style={{
                      background: "rgba(51, 65, 85, 0.3)",
                      border: "1px solid rgba(148, 163, 184, 0.2)",
                      borderRadius: "12px",
                      padding: "24px",
                      cursor: "pointer",
                      display: "grid",
                      gridTemplateColumns: "120px 1fr",
                      gap: "24px",
                      transition: "all 0.3s",
                      alignItems: "start"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.3)";
                      e.currentTarget.style.background = "rgba(51, 65, 85, 0.4)";
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow = "0 12px 24px rgba(139, 92, 246, 0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "rgba(148, 163, 184, 0.2)";
                      e.currentTarget.style.background = "rgba(51, 65, 85, 0.3)";
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                      textAlign: "center"
                    }}>
                      <div style={{
                        fontSize: "1.8rem",
                        fontWeight: "800",
                        color: "#06b6d4"
                      }}>
                        {question.replies?.length || 0}
                      </div>
                      <div style={{
                        fontSize: "0.85rem",
                        color: "#94a3b8",
                        fontWeight: "600"
                      }}>
                        answers
                      </div>
                      <div style={{
                        fontSize: "1.8rem",
                        fontWeight: "800",
                        color: "#8b5cf6"
                      }}>
                        {question.views}
                      </div>
                      <div style={{
                        fontSize: "0.85rem",
                        color: "#94a3b8",
                        fontWeight: "600"
                      }}>
                        views
                      </div>
                    </div>

                    <div>
                      <h3 style={{
                        fontSize: "1.3rem",
                        fontWeight: "700",
                        margin: "0 0 10px 0",
                        color: "#f9fafb"
                      }}>
                        {question.title}
                      </h3>
                      <p style={{
                        fontSize: "0.95rem",
                        color: "#cbd5e1",
                        margin: "0 0 16px 0",
                        lineHeight: "1.5"
                      }}>
                        {question.body.substring(0, 150)}...
                      </p>
                      <div style={{
                        display: "flex",
                        gap: "16px",
                        color: "#94a3b8",
                        fontSize: "0.9rem",
                        borderTop: "1px solid rgba(148, 163, 184, 0.1)",
                        paddingTop: "12px"
                      }}>
                        <span>👤 {question.author}</span>
                        <span>•</span>
                        <span>⏱️ {formatDate(question.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                background: "rgba(51, 65, 85, 0.3)",
                border: "1px dashed rgba(148, 163, 184, 0.3)",
                borderRadius: "12px",
                padding: "60px 30px",
                textAlign: "center"
              }}>
                <p style={{ fontSize: "1.1rem", color: "#94a3b8", margin: 0 }}>
                  No questions found. Ask the first one! 🚀
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default QnA;
