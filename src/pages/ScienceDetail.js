// src/pages/ScienceDetail.js
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { markIntroVideoWatched, isIntroVideoWatched } from "../utils/storageManager";

function ScienceDetail({ onLessonCompleted }) {
  const { branch, scienceId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [introVideoWatched, setIntroVideoWatched] = useState(false);
  const videoTimerRef = useRef(null);
  const videoWatchTimeRef = useRef(0);

  // Load user from localStorage and check intro video status
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        
        // Check if intro video has been watched
        const watched = isIntroVideoWatched(userData.id, branch, scienceId);
        console.log(`🎬 Checking intro video status for ${branch}/${scienceId}: ${watched}`);
        setIntroVideoWatched(watched);
      } catch (err) {
        console.error("❌ Error loading user from localStorage:", err);
      }
    } else {
      console.warn("⚠️ No user found in localStorage");
    }
  }, [branch, scienceId]);

  // Auto-track video watch time - save after 30 seconds
  useEffect(() => {
    if (!introVideoWatched) {
      // Start a timer that counts seconds
      videoTimerRef.current = setInterval(() => {
        videoWatchTimeRef.current += 1;
        
        // Auto-save after 30 seconds of page being visible with video
        if (videoWatchTimeRef.current >= 30 && user && user.id) {
          console.log(`⏱️ Video watched for ${videoWatchTimeRef.current} seconds - Auto-saving`);
          markIntroVideoWatched(user.id, branch, scienceId, scienceTitle);
          setIntroVideoWatched(true);
          console.log(`✅ Auto-tracked: Intro video marked as watched for ${branch}/${scienceId}`);
          if (videoTimerRef.current) {
            clearInterval(videoTimerRef.current);
          }
        }
      }, 1000);

      return () => {
        if (videoTimerRef.current) {
          clearInterval(videoTimerRef.current);
        }
      };
    }
  }, [introVideoWatched, user, branch, scienceId]);

  const titleBranch = branch === "natural" ? "Natural Science" : "Social Science";
  const scienceTitle = scienceId.charAt(0).toUpperCase() + scienceId.slice(1);

  function handleStartLesson() {
    // simulate a completed lesson for demo
    onLessonCompleted({
      subject: scienceTitle,
      title: `${scienceTitle} Intro Lesson`,
    });
  }

  function handleIntroVideoWatched() {
    if (user && user.id) {
      // Mark intro video as watched in localStorage with subject name
      markIntroVideoWatched(user.id, branch, scienceId, scienceTitle);
      setIntroVideoWatched(true);
      console.log(`✅ Manual: Intro video marked as watched for ${branch}/${scienceId} - Subject: ${scienceTitle}`);
    } else {
      console.warn("⚠️ Cannot track video: User not logged in");
    }
  }

  function goToChat() {
    navigate("/chat"); // can change to /chat/:branch/:scienceId later
  }

  function goToGames() {
    navigate(`/games/${branch}`);
  }

  return (
    <section className="science-detail-page fade-in">
      <h1>{titleBranch} · {scienceTitle}</h1>
      <p className="subtitle">
        Watch intro videos, complete lessons and quizzes, then ask questions in public chat.
      </p>

      <div className="science-layout">
        <div className="card">
          <h2>Intro Video {introVideoWatched && "✓ Completed"}</h2>
          <div className="video-wrapper">
            <iframe
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title={`Intro video for ${scienceTitle}`}
              frameBorder="0"
              allowFullScreen
            />
          </div>
          {user && (
            <button 
              onClick={handleIntroVideoWatched}
              style={{
                marginTop: "1rem",
                padding: "0.5rem 1rem",
                backgroundColor: introVideoWatched ? "#4caf50" : "#2196F3",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              {introVideoWatched ? "✓ Intro Video Watched" : "Mark as Watched"}
            </button>
          )}
        </div>

        <div className="card">
          <h2>Lessons & Quizzes</h2>
          <p>Start a lesson, save your progress, and earn XP when you complete it.</p>
          <button className="btn primary" onClick={handleStartLesson}>
            Mark Intro Lesson as Completed
          </button>
          <button className="btn" style={{ marginLeft: "0.5rem" }}>
            Take Quiz
          </button>
        </div>

        <div className="card">
          <h2>Community & Games</h2>
          <button className="btn" onClick={goToChat}>
            Open Public Chat
          </button>
          <button className="btn" onClick={goToGames} style={{ marginLeft: "0.5rem" }}>
            Play {branch === "natural" ? "Natural Science" : "Social Science"} Games
          </button>
        </div>
      </div>
    </section>
  );
}

export default ScienceDetail;
