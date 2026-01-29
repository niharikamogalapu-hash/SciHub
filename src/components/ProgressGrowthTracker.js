import React, { useState, useEffect } from "react";
import { getProgressHistory, calculateGrowthMetrics } from "../utils/storageManager";
import "./ProgressGrowthTracker.css";

function ProgressGrowthTracker({ userId }) {
  const [history, setHistory] = useState([]);
  const [metrics, setMetrics] = useState({});
  const [timeRange, setTimeRange] = useState(7); // 7, 14, 30 days
  const [selectedMetric, setSelectedMetric] = useState("xp");

  useEffect(() => {
    // Load progress history and metrics
    const progressData = getProgressHistory(userId, timeRange);
    const growthMetrics = calculateGrowthMetrics(userId);
    
    setHistory(progressData);
    setMetrics(growthMetrics);
  }, [userId, timeRange]);

  const getChartData = () => {
    if (history.length === 0) return [];
    
    return history.map((entry, idx) => ({
      date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      fullDate: entry.date,
      value: selectedMetric === 'xp' ? entry.xp : 
             selectedMetric === 'coins' ? entry.coins :
             selectedMetric === 'lessons' ? entry.lessonsCompleted :
             selectedMetric === 'games' ? entry.gamesCompleted : 0,
      index: idx,
    }));
  };

  const chartData = getChartData();
  const maxValue = Math.max(...(chartData.map(d => d.value) || [1])) * 1.1;
  const minValue = 0;

  const getTrendArrow = (value) => {
    if (value > 0) return "📈";
    if (value < 0) return "📉";
    return "➡️";
  };

  const getMetricLabel = (metric) => {
    switch(metric) {
      case 'xp': return 'XP';
      case 'coins': return 'Coins';
      case 'lessons': return 'Lessons';
      case 'games': return 'Games';
      default: return 'Progress';
    }
  };

  const getTrendColor = (value) => {
    return value > 0 ? '#10b981' : value < 0 ? '#ef4444' : '#6b7280';
  };

  return (
    <div className="progress-growth-tracker">
      {/* Header */}
      <div className="pgt-header">
        <h3>📈 Your Progress Growth</h3>
        <p>Track how you're improving over time</p>
      </div>

      {/* Time Range Selector */}
      <div className="time-range-selector">
        <button 
          className={`range-btn ${timeRange === 7 ? 'active' : ''}`}
          onClick={() => setTimeRange(7)}
        >
          7 Days
        </button>
        <button 
          className={`range-btn ${timeRange === 14 ? 'active' : ''}`}
          onClick={() => setTimeRange(14)}
        >
          14 Days
        </button>
        <button 
          className={`range-btn ${timeRange === 30 ? 'active' : ''}`}
          onClick={() => setTimeRange(30)}
        >
          30 Days
        </button>
      </div>

      {/* Metric Selector */}
      <div className="metric-selector">
        <button 
          className={`metric-btn ${selectedMetric === 'xp' ? 'active' : ''}`}
          onClick={() => setSelectedMetric('xp')}
        >
          📊 XP
        </button>
        <button 
          className={`metric-btn ${selectedMetric === 'coins' ? 'active' : ''}`}
          onClick={() => setSelectedMetric('coins')}
        >
          💰 Coins
        </button>
        <button 
          className={`metric-btn ${selectedMetric === 'lessons' ? 'active' : ''}`}
          onClick={() => setSelectedMetric('lessons')}
        >
          📚 Lessons
        </button>
        <button 
          className={`metric-btn ${selectedMetric === 'games' ? 'active' : ''}`}
          onClick={() => setSelectedMetric('games')}
        >
          🎮 Games
        </button>
      </div>

      {/* Chart */}
      <div className="chart-container">
        <div className="chart">
          <div className="chart-canvas">
            {chartData.length > 0 ? (
              <svg viewBox={`0 0 ${Math.max(600, chartData.length * 40)} 300`} className="chart-svg">
                {/* Grid lines */}
                {[0, 25, 50, 75, 100].map((pct) => (
                  <line
                    key={`grid-${pct}`}
                    x1="40"
                    y1={300 - (pct / 100) * 250}
                    x2={40 + chartData.length * 40}
                    y2={300 - (pct / 100) * 250}
                    stroke="rgba(99, 102, 241, 0.1)"
                    strokeDasharray="4"
                  />
                ))}

                {/* Bars */}
                {chartData.map((point, idx) => {
                  const x = 40 + idx * 40;
                  const barHeight = (point.value / maxValue) * 250;
                  const y = 300 - barHeight;
                  
                  return (
                    <g key={idx} className="chart-bar-group">
                      {/* Bar */}
                      <rect
                        x={x + 5}
                        y={y}
                        width="30"
                        height={barHeight}
                        fill={`url(#barGradient${idx})`}
                        rx="4"
                        className="chart-bar"
                        title={`${point.date}: ${point.value}`}
                      />
                      <defs>
                        <linearGradient id={`barGradient${idx}`} x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#60a5fa" />
                          <stop offset="100%" stopColor="#3b82f6" />
                        </linearGradient>
                      </defs>
                      {/* Label */}
                      {idx % Math.ceil(chartData.length / 7) === 0 && (
                        <text
                          x={x + 20}
                          y="320"
                          textAnchor="middle"
                          fontSize="12"
                          fill="#cbd5e1"
                        >
                          {point.date}
                        </text>
                      )}
                    </g>
                  );
                })}

                {/* Y-axis labels */}
                {[0, 25, 50, 75, 100].map((pct) => (
                  <text
                    key={`label-${pct}`}
                    x="30"
                    y={305 - (pct / 100) * 250}
                    textAnchor="end"
                    fontSize="12"
                    fill="#94a3b8"
                  >
                    {Math.round((pct / 100) * maxValue)}
                  </text>
                ))}
              </svg>
            ) : (
              <div className="empty-chart">
                <p>📊 Start learning to see your progress chart!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Growth Metrics */}
      <div className="growth-metrics">
        <div className="metric-card growth-card">
          <div className="metric-header">
            <span className="metric-label">XP Growth</span>
            <span className="metric-arrow">{getTrendArrow(metrics.xpGrowth)}</span>
          </div>
          <div className="metric-value" style={{ color: getTrendColor(metrics.xpGrowth) }}>
            +{metrics.xpGrowth || 0}
          </div>
          <div className="metric-percent">
            {Math.abs(metrics.xpGrowthPercent || 0)}% increase
          </div>
          <div className="metric-average">
            ⌀ {metrics.avgDailyXP || 0} XP/day
          </div>
        </div>

        <div className="metric-card growth-card">
          <div className="metric-header">
            <span className="metric-label">Coins Growth</span>
            <span className="metric-arrow">{getTrendArrow(metrics.coinGrowth)}</span>
          </div>
          <div className="metric-value" style={{ color: getTrendColor(metrics.coinGrowth) }}>
            +{metrics.coinGrowth || 0}
          </div>
          <div className="metric-percent">
            {Math.abs(metrics.coinGrowthPercent || 0)}% increase
          </div>
          <div className="metric-average">
            ⌀ {metrics.avgDailyCoins || 0} coins/day
          </div>
        </div>

        <div className="metric-card growth-card">
          <div className="metric-header">
            <span className="metric-label">Lessons</span>
            <span className="metric-arrow">{getTrendArrow(metrics.lessonsGrowth)}</span>
          </div>
          <div className="metric-value" style={{ color: getTrendColor(metrics.lessonsGrowth) }}>
            +{metrics.lessonsGrowth || 0}
          </div>
          <div className="metric-percent">
            New lessons started
          </div>
          <div className="metric-average">
            Keep pushing! 💪
          </div>
        </div>

        <div className="metric-card growth-card">
          <div className="metric-header">
            <span className="metric-label">Games</span>
            <span className="metric-arrow">{getTrendArrow(metrics.gamesGrowth)}</span>
          </div>
          <div className="metric-value" style={{ color: getTrendColor(metrics.gamesGrowth) }}>
            +{metrics.gamesGrowth || 0}
          </div>
          <div className="metric-percent">
            Games completed
          </div>
          <div className="metric-average">
            Points earned! 🎮
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="growth-insights">
        <h4>💡 Your Growth Insights</h4>
        <div className="insights-grid">
          {metrics.avgDailyXP > 0 && (
            <div className="insight-card">
              <div className="insight-icon">📈</div>
              <div className="insight-text">
                You're averaging <strong>{metrics.avgDailyXP} XP per day</strong>. Keep up this pace to reach your goals!
              </div>
            </div>
          )}
          {metrics.lessonsGrowth > 0 && (
            <div className="insight-card">
              <div className="insight-icon">📚</div>
              <div className="insight-text">
                You've completed <strong>{metrics.lessonsGrowth} new lessons</strong> in the last {timeRange} days. You're learning fast!
              </div>
            </div>
          )}
          {metrics.gamesGrowth > 0 && (
            <div className="insight-card">
              <div className="insight-icon">🎮</div>
              <div className="insight-text">
                You've earned <strong>{metrics.gamesGrowth} points from games</strong>. Gamification works! 🎉
              </div>
            </div>
          )}
          {history.length >= timeRange && (
            <div className="insight-card">
              <div className="insight-icon">🔥</div>
              <div className="insight-text">
                You've been consistent for <strong>{history.length} days</strong>. Your dedication is paying off!
              </div>
            </div>
          )}
          {metrics.xpGrowth === 0 && history.length > 0 && (
            <div className="insight-card warning">
              <div className="insight-icon">⚠️</div>
              <div className="insight-text">
                No progress yet this period. <strong>Start a lesson or game</strong> to kickstart your growth!
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProgressGrowthTracker;
