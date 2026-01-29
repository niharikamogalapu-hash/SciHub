import React, { useState } from "react";
import { getStudyTime, getAPExamReadiness, getCareerConnections, generateStudyCertificate } from "../utils/storageManager";
import "./LongTermValue.css";

function LongTermValue({ userId, userName }) {
  const [activeTab, setActiveTab] = useState("readiness");
  const [selectedSubject, setSelectedSubject] = useState("AP Biology");
  
  const studyTime = getStudyTime(userId);
  const readiness = getAPExamReadiness(userId);
  const careers = getCareerConnections(selectedSubject);
  const certificate = generateStudyCertificate(userId, userName);

  const handlePrintCertificate = () => {
    const printWindow = window.open("", "", "height=600,width=800");
    printWindow.document.write(`
      <html>
        <head>
          <title>Study Certificate</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              margin: 0;
              padding: 20px;
            }
            .certificate {
              background: white;
              border: 4px solid #667eea;
              border-radius: 10px;
              padding: 60px;
              max-width: 900px;
              box-shadow: 0 10px 30px rgba(0,0,0,0.3);
              text-align: center;
              font-size: 18px;
              line-height: 1.8;
            }
            .certificate-header {
              font-size: 48px;
              font-weight: bold;
              color: #667eea;
              margin-bottom: 30px;
              text-transform: uppercase;
              letter-spacing: 3px;
            }
            .certificate-line {
              margin: 20px 0;
              color: #333;
            }
            .certificate-name {
              font-size: 32px;
              font-weight: bold;
              color: #764ba2;
              margin: 20px 0;
              text-decoration: underline;
            }
            .certificate-stats {
              display: grid;
              grid-template-columns: 1fr 1fr 1fr;
              gap: 20px;
              margin: 40px 0;
              padding: 30px;
              background: rgba(102, 126, 234, 0.1);
              border-radius: 8px;
            }
            .stat-box {
              padding: 15px;
              border-left: 3px solid #667eea;
            }
            .stat-label {
              font-size: 14px;
              color: #666;
              text-transform: uppercase;
            }
            .stat-value {
              font-size: 28px;
              font-weight: bold;
              color: #667eea;
            }
            .certificate-footer {
              margin-top: 50px;
              font-style: italic;
              color: #666;
              font-size: 14px;
            }
            @media print {
              body { background: white; padding: 0; }
              .certificate { box-shadow: none; border-width: 2px; }
            }
          </style>
        </head>
        <body>
          <div class="certificate">
            <div class="certificate-header">🎓 Certificate of Dedication</div>
            <div class="certificate-line">This certifies that</div>
            <div class="certificate-name">${certificate.studentName}</div>
            <div class="certificate-line">has demonstrated exceptional commitment to academic excellence and exam preparation through dedicated study and comprehensive learning activities.</div>
            
            <div class="certificate-stats">
              <div class="stat-box">
                <div class="stat-label">Study Hours</div>
                <div class="stat-value">${certificate.studyHours}</div>
              </div>
              <div class="stat-box">
                <div class="stat-label">Lessons Completed</div>
                <div class="stat-value">${certificate.lessonsCompleted}</div>
              </div>
              <div class="stat-box">
                <div class="stat-label">Exam Readiness</div>
                <div class="stat-value">${certificate.examReadiness}%</div>
              </div>
            </div>
            
            <div class="certificate-line">Awarded on ${certificate.dateIssued}</div>
            <div class="certificate-line">Certificate ID: ${certificate.certificateId}</div>
            <div class="certificate-footer">This certificate recognizes dedication to educational excellence and preparation for advanced placement examinations.</div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="long-term-value">
      {/* Tabs */}
      <div className="ltv-tabs">
        <button 
          className={`ltv-tab ${activeTab === "readiness" ? "active" : ""}`}
          onClick={() => setActiveTab("readiness")}
        >
          📊 AP Exam Readiness
        </button>
        <button 
          className={`ltv-tab ${activeTab === "careers" ? "active" : ""}`}
          onClick={() => setActiveTab("careers")}
        >
          💼 Career Connections
        </button>
        <button 
          className={`ltv-tab ${activeTab === "certificate" ? "active" : ""}`}
          onClick={() => setActiveTab("certificate")}
        >
          🎓 Study Certificate
        </button>
      </div>

      {/* Content */}
      <div className="ltv-content">
        {/* AP Exam Readiness Tab */}
        {activeTab === "readiness" && (
          <div className="ltv-panel readiness-panel">
            <h3>📊 AP Exam Readiness Tracker</h3>
            
            {/* Overall Progress */}
            <div className="readiness-overall">
              <div className="readiness-meter">
                <div className="readiness-label">Overall Exam Readiness</div>
                <div className="readiness-bar">
                  <div 
                    className="readiness-fill" 
                    style={{ width: `${readiness.overallPercentage}%` }}
                  >
                    <span>{readiness.overallPercentage}%</span>
                  </div>
                </div>
                <div className="readiness-hint">
                  {readiness.overallPercentage >= 80 && "✅ You're well-prepared for the AP exam!"}
                  {readiness.overallPercentage >= 60 && readiness.overallPercentage < 80 && "⭐ Keep studying! You're on track."}
                  {readiness.overallPercentage >= 40 && readiness.overallPercentage < 60 && "📚 More study needed. You're making progress!"}
                  {readiness.overallPercentage < 40 && "💪 Keep going! Every lesson helps."}
                </div>
              </div>
            </div>

            {/* Study Time */}
            <div className="study-stats">
              <div className="stat-card">
                <div className="stat-icon">⏱️</div>
                <div className="stat-detail">
                  <div className="stat-label">Total Study Time</div>
                  <div className="stat-value">{studyTime.totalHours} hours</div>
                  <div className="stat-sub">({studyTime.totalMinutes} minutes)</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📖</div>
                <div className="stat-detail">
                  <div className="stat-label">Days of Studying</div>
                  <div className="stat-value">{studyTime.totalDays} days</div>
                  <div className="stat-sub">Consistent effort compounds!</div>
                </div>
              </div>
            </div>

            {/* By Subject */}
            <div className="readiness-by-subject">
              <h4>📚 Readiness by Subject</h4>
              <div className="subject-grid">
                {Object.entries(readiness.bySubject).map(([subject, percentage]) => (
                  <div key={subject} className="subject-card">
                    <div className="subject-name">{subject}</div>
                    <div className="subject-bar">
                      <div 
                        className="subject-progress"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="subject-percentage">{Math.round(percentage)}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Career Connections Tab */}
        {activeTab === "careers" && (
          <div className="ltv-panel careers-panel">
            <h3>💼 Career Connections</h3>
            
            {/* Subject Selector */}
            <div className="career-selector">
              <label>Select a subject to explore careers:</label>
              <select 
                value={selectedSubject} 
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="subject-dropdown"
              >
                <option>AP Biology</option>
                <option>AP Chemistry</option>
                <option>AP Physics</option>
                <option>AP Environmental Science</option>
                <option>AP Psychology</option>
                <option>Economics</option>
                <option>AP Human Geography</option>
                <option>History</option>
              </select>
            </div>

            {/* Careers for Selected Subject */}
            <div className="careers-list">
              {careers.map((career, idx) => (
                <div key={idx} className="career-card">
                  <div className="career-header">
                    <h4>{career.title}</h4>
                  </div>
                  <p>{career.description}</p>
                  <div className="career-connection">
                    Learn more about how {selectedSubject} connects to this career path!
                  </div>
                </div>
              ))}
            </div>

            {/* Motivational Message */}
            <div className="career-message">
              <p>💡 <strong>Did you know?</strong> Mastering {selectedSubject} opens doors to exciting career paths in science, technology, business, and beyond. Your dedication now is an investment in your future!</p>
            </div>
          </div>
        )}

        {/* Certificate Tab */}
        {activeTab === "certificate" && (
          <div className="ltv-panel certificate-panel">
            <h3>🎓 Study Certificate</h3>
            
            <div className="certificate-preview">
              <div className="cert-badge">
                <div className="cert-emoji">🎓</div>
                <div className="cert-title">Certificate of Dedication</div>
              </div>
              
              <div className="certificate-details">
                <div className="cert-detail">
                  <span className="label">Student Name:</span>
                  <span className="value">{certificate.studentName}</span>
                </div>
                <div className="cert-detail">
                  <span className="label">Study Hours:</span>
                  <span className="value">{certificate.studyHours} hours</span>
                </div>
                <div className="cert-detail">
                  <span className="label">Lessons Completed:</span>
                  <span className="value">{certificate.lessonsCompleted}</span>
                </div>
                <div className="cert-detail">
                  <span className="label">AP Exam Readiness:</span>
                  <span className="value">{certificate.examReadiness}%</span>
                </div>
                <div className="cert-detail">
                  <span className="label">Date Issued:</span>
                  <span className="value">{certificate.dateIssued}</span>
                </div>
                <div className="cert-detail">
                  <span className="label">Certificate ID:</span>
                  <span className="value">{certificate.certificateId}</span>
                </div>
              </div>

              <button className="print-btn" onClick={handlePrintCertificate}>
                🖨️ Print Certificate
              </button>

              <div className="cert-message">
                <p>Share your certificate with colleges, tutors, or parents to showcase your dedication to academic excellence!</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LongTermValue;
