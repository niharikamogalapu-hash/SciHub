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
    return stored ? JSON.parse(stored) : getDefaultQuestions();
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return getDefaultQuestions();
  }
}

// Save questions to localStorage
function saveQuestions(questions) {
  try {
    localStorage.setItem(QNA_STORAGE_KEY, JSON.stringify(questions));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
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
    <div className="qna-container">
      <Sidebar
        user={user}
        onLogout={() => {
          localStorage.removeItem("user");
          window.location.href = "/login";
        }}
      />

      <div className="qna-main">
        {/* Header */}
        <div className="qna-header">
          <div className="qna-header-content">
            <h1>Community Q&A</h1>
            <p>Ask questions and share knowledge with the SciHub community</p>
          </div>
          <button
            className="qna-post-btn"
            onClick={() => setShowNewQuestion(!showNewQuestion)}
          >
            + Ask a Question
          </button>
        </div>

        {/* New Question Form */}
        {showNewQuestion && (
          <div className="qna-form-container">
            <div className="qna-form">
              <h2>Ask a Question</h2>
              <form onSubmit={handlePostQuestion}>
                <div className="form-group">
                  <label>Question Title</label>
                  <input
                    type="text"
                    placeholder="What's your question?"
                    value={newQuestionTitle}
                    onChange={(e) => setNewQuestionTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Details</label>
                  <textarea
                    placeholder="Provide more details about your question..."
                    value={newQuestionBody}
                    onChange={(e) => setNewQuestionBody(e.target.value)}
                    rows="6"
                    required
                  ></textarea>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-primary">
                    Post Question
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setShowNewQuestion(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="qna-content">
          {/* Sidebar Filters */}
          <div className="qna-filters">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="filter-group">
              <label>Sort by:</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="mostViewed">Most Viewed</option>
                <option value="mostAnswered">Most Answered</option>
              </select>
            </div>
          </div>

          {/* Questions List or Detail View */}
          <div className="qna-main-content">
            {selectedQuestion ? (
              /* Question Detail View */
              <div className="question-detail">
                <button
                  className="back-btn"
                  onClick={() => setSelectedQuestion(null)}
                >
                  ← Back to Questions
                </button>

                <div className="question-header">
                  <h2>{selectedQuestion.title}</h2>
                  <div className="question-meta">
                    <span>Asked by {selectedQuestion.author}</span>
                    <span>•</span>
                    <span>{formatDate(selectedQuestion.timestamp)}</span>
                    <span>•</span>
                    <span>{selectedQuestion.views} views</span>
                  </div>
                </div>

                <div className="question-body">
                  <p>{selectedQuestion.body}</p>
                </div>

                {/* Replies Section */}
                <div className="replies-section">
                  <h3>
                    Answers ({selectedQuestion.replies?.length || 0})
                  </h3>

                  {selectedQuestion.replies && selectedQuestion.replies.length > 0 ? (
                    <div className="replies-list">
                      {selectedQuestion.replies.map((reply) => (
                        <div key={reply.id} className="reply-item">
                          <div className="reply-header">
                            <span className="reply-author">{reply.author}</span>
                            <span className="reply-time">
                              {formatDate(reply.timestamp)}
                            </span>
                          </div>
                          <p className="reply-body">{reply.body}</p>
                          <div className="reply-footer">
                            <button className="upvote-btn">
                              👍 {reply.upvotes > 0 ? reply.upvotes : ""}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-replies">No answers yet. Be the first to reply!</p>
                  )}

                  {/* Reply Form */}
                  <div className="reply-form">
                    <h4>Your Answer</h4>
                    <form onSubmit={handlePostReply}>
                      <textarea
                        placeholder="Share your answer..."
                        value={newReply}
                        onChange={(e) => setNewReply(e.target.value)}
                        rows="4"
                        required
                      ></textarea>
                      <div className="form-actions">
                        <button type="submit" className="btn-primary">
                          Post Answer
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            ) : (
              /* Questions List View */
              <div className="questions-list">
                {filteredQuestions.length > 0 ? (
                  filteredQuestions.map((question) => (
                    <div
                      key={question.id}
                      className="question-card"
                      onClick={() => setSelectedQuestion(question)}
                    >
                      <div className="question-stats">
                        <div className="stat">
                          <span className="stat-value">
                            {question.replies?.length || 0}
                          </span>
                          <span className="stat-label">answers</span>
                        </div>
                        <div className="stat">
                          <span className="stat-value">{question.views}</span>
                          <span className="stat-label">views</span>
                        </div>
                      </div>

                      <div className="question-content">
                        <h3>{question.title}</h3>
                        <p>{question.body.substring(0, 150)}...</p>
                        <div className="question-footer">
                          <span className="question-author">
                            asked by {question.author}
                          </span>
                          <span className="question-time">
                            {formatDate(question.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-results">
                    <p>No questions found. Ask the first one!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default QnA;
