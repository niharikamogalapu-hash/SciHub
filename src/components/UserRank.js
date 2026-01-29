import React, { useState, useEffect } from "react";
import { getUserRank, getAllRankTiers, checkRankUp } from "../utils/storageManager";
import "./UserRank.css";

function UserRank({ userId }) {
  const [rank, setRank] = useState(null);
  const [allTiers, setAllTiers] = useState([]);
  const [newRankUnlocked, setNewRankUnlocked] = useState(null);

  useEffect(() => {
    // Get current rank
    const currentRank = getUserRank(userId);
    setRank(currentRank);

    // Get all rank tiers
    const tiers = getAllRankTiers();
    setAllTiers(tiers);

    // Check if new rank was unlocked
    const newRank = checkRankUp(userId);
    if (newRank) {
      setNewRankUnlocked(newRank);
      // Auto-dismiss after 5 seconds
      setTimeout(() => setNewRankUnlocked(null), 5000);
    }
  }, [userId]);

  if (!rank) return null;

  return (
    <div className="user-rank">
      {/* Rank Badge Card */}
      <div className="rank-badge-card">
        <div className="rank-badge" style={{ background: rank.color }}>
          <div className="rank-emoji">{rank.emoji}</div>
          <div className="rank-name">{rank.name}</div>
        </div>

        <div className="rank-details">
          <div className="rank-level">Level {rank.rank + 1}</div>
          <div className="rank-xp">
            <span className="xp-current">{rank.currentXP.toLocaleString()}</span>
            <span className="xp-separator">•</span>
            <span className="xp-next">{rank.nextLevelXP.toLocaleString()} XP</span>
          </div>

          {!rank.isMaxRank && (
            <div className="rank-progress-section">
              <div className="progress-label">
                {rank.xpUntilNextRank.toLocaleString()} XP until {rank.name === "Novice" ? "Apprentice" : rank.name === "Apprentice" ? "Scholar" : rank.name === "Scholar" ? "Expert" : rank.name === "Expert" ? "Master" : "Sage"}
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ 
                    width: `${rank.progressPercent}%`,
                    background: rank.color 
                  }}
                />
              </div>
              <div className="progress-percent">{rank.progressPercent}%</div>
            </div>
          )}
          {rank.isMaxRank && (
            <div className="max-rank-message">
              🏆 Congratulations! You've reached the maximum rank!
            </div>
          )}
        </div>
      </div>

      {/* Rank Roadmap */}
      <div className="rank-roadmap">
        <h4>📊 Your Rank Progression</h4>
        <div className="roadmap-container">
          {allTiers.map((tier, idx) => {
            const isCurrentRank = rank.rank === tier.rank;
            const isCompletedRank = rank.rank > tier.rank;
            const isNextRank = rank.rank + 1 === tier.rank;

            return (
              <div key={tier.rank} className={`roadmap-item ${isCurrentRank ? 'current' : isCompletedRank ? 'completed' : ''}`}>
                <div className="roadmap-badge" style={{ background: isCurrentRank || isCompletedRank ? tier.color : '#4b5563' }}>
                  {tier.emoji}
                </div>
                <div className="roadmap-info">
                  <div className="roadmap-name">{tier.name}</div>
                  <div className="roadmap-xp">{tier.minXP.toLocaleString()} XP</div>
                  {isCurrentRank && (
                    <div className="roadmap-status current-status">Current</div>
                  )}
                  {isCompletedRank && (
                    <div className="roadmap-status completed-status">Unlocked</div>
                  )}
                  {isNextRank && (
                    <div className="roadmap-status next-status">Next</div>
                  )}
                </div>
                {idx < allTiers.length - 1 && (
                  <div className="roadmap-connector" style={{
                    background: isCompletedRank || (isCurrentRank && rank.progressPercent === 100) ? tier.color : '#4b5563'
                  }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Benefits by Rank */}
      <div className="rank-benefits">
        <h4>⭐ Rank Benefits</h4>
        <div className="benefits-grid">
          <div className="benefit-card">
            <div className="benefit-icon">🎓</div>
            <div className="benefit-title">Access Premium Content</div>
            <div className="benefit-desc">Unlock advanced lessons and materials at higher ranks</div>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">🏆</div>
            <div className="benefit-title">Exclusive Badges</div>
            <div className="benefit-desc">Earn special badges to showcase your achievements</div>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">💎</div>
            <div className="benefit-title">Bonus Rewards</div>
            <div className="benefit-desc">Earn extra coins and items as you level up</div>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">👥</div>
            <div className="benefit-title">Community Status</div>
            <div className="benefit-desc">Higher ranks get recognition on leaderboards</div>
          </div>
        </div>
      </div>

      {/* Rank Up Notification */}
      {newRankUnlocked && (
        <div className="rank-up-notification">
          <div className="rank-up-content">
            <div className="rank-up-emoji">🎉</div>
            <h3>RANK UP!</h3>
            <p>Congratulations! You've reached</p>
            <div className="rank-up-badge" style={{ background: newRankUnlocked.color }}>
              {newRankUnlocked.emoji} {newRankUnlocked.name}
            </div>
            <p className="rank-up-message">Keep studying to reach the next level!</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserRank;
