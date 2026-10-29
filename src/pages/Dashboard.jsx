import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/dashboard.css';

export default function Dashboard() {
  const [user, setUser] = useState('Student');
  const [todayStr, setTodayStr] = useState('');

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (u.name) setUser(u.name);
    } catch (e) {}

    const today = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    setTodayStr(today.toLocaleDateString('en-IN', options));
  }, []);

  return (
    <div className="dashboard-page-root">
      {/* ================= SIDEBAR ================= */}
      <div className="sidebar">
        <a href="/dashboard.html" className="logo" style={{ textDecoration: 'none', display: 'block', color: 'white' }}>
          📚 Study Planner
        </a>

        <div className="menu">
          <a href="/dashboard.html" className="active">
            🏠 Dashboard
          </a>
          <a href="/subjects.html">
            📚 Subjects
          </a>
          <a href="/task.html">
            ✅ Task Planner
          </a>
          <a href="/calendar.html">
            📅 Calendar
          </a>
          <a href="/Notes.html">
            📝 Notes
          </a>
          <a href="/exam-tracker.html">
            📝 Exam Tracker
          </a>
          <a href="/focus.html">
            ⏱️ Focus Timer
          </a>
        </div>

        <div className="bottom-menu">
          <a href="/settings.html">
            ⚙️ Settings
          </a>
          <a href="/">
            🚪 Logout
          </a>
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="main-content">
        {/* Header */}
        <div className="header">
          <div>
            <h1 id="greetingTitle">Good Morning, {user}! 👋</h1>
            <p id="todayDate">{todayStr || "Let's make today productive."}</p>
          </div>

          <div className="user-section">
            <span className="notification" title="Notifications">🔔</span>
            <a href="/settings.html" className="user" style={{ textDecoration: 'none', color: 'inherit' }}>
              👤
              <span id="userNameDisplay">{user}</span>
            </a>
          </div>
        </div>

        {/* ================= QUOTE ================= */}
        <div className="quote-card">
          <div className="quote-icon">💡</div>
          <div>
            <h2>Quote of the Day</h2>
            <p id="dailyQuote">
              "Believe you can and you're halfway there."
            </p>
          </div>
        </div>

        {/* ================= FIRST ROW ================= */}
        <div className="card-row">
          {/* Today's Task Progress */}
          <div className="dashboard-card task-progress-card">
            <div className="card-title">
              <h2>📋 Today's Task Progress</h2>
              <span id="taskProgressPercent">60%</span>
            </div>

            <div className="task-number">
              <strong id="completedTasks">6</strong>
              <span id="totalTasksDisplay">/ 10 Tasks Completed</span>
            </div>

            <div className="progress">
              <div
                class="progress-bar task-bar"
                id="taskProgress"
                style={{ width: '60%' }}
              ></div>
            </div>

            <p id="remainingTasks">4 tasks remaining</p>

            <a href="/task.html" className="view-link">
              View Tasks →
            </a>
          </div>

          {/* Subject Progress */}
          <div className="dashboard-card" id="subjectProgressCard">
            <div className="card-title">
              <h2>📚 Subject Progress</h2>
              <a href="/subjects.html">View All</a>
            </div>

            <div id="subjectProgressList">
              <div className="subject">
                <div className="subject-info">
                  <span>DBMS</span>
                  <span>80%</span>
                </div>
                <div className="progress">
                  <div className="progress-bar" style={{ width: '80%' }}></div>
                </div>
              </div>

              <div className="subject">
                <div className="subject-info">
                  <span>Operating System</span>
                  <span>65%</span>
                </div>
                <div className="progress">
                  <div className="progress-bar" style={{ width: '65%' }}></div>
                </div>
              </div>

              <div className="subject">
                <div className="subject-info">
                  <span>Computer Networks</span>
                  <span>50%</span>
                </div>
                <div className="progress">
                  <div className="progress-bar" style={{ width: '50%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= SECOND ROW ================= */}
        <div className="card-row">
          {/* Upcoming Exam */}
          <div className="dashboard-card exam-card">
            <div className="card-title">
              <h2>📅 Upcoming Exam</h2>
              <a href="/exam-tracker.html">View All</a>
            </div>

            <div id="upcomingExamContainer">
              <div className="exam-content">
                <div>
                  <h3>DBMS</h3>
                  <p>Database Management Systems</p>
                  <div className="exam-date">📅 15 Nov 2026</div>
                </div>
                <div className="days-left">
                  <strong>15</strong>
                  <span>Days Left</span>
                </div>
              </div>
              <a href="/exam-tracker.html" className="view-button">
                View Details
              </a>
            </div>
          </div>

          {/* High Priority Tasks */}
          <div className="dashboard-card priority-card">
            <div className="card-title">
              <h2>🔥 High Priority Tasks</h2>
              <a href="/task.html">View All</a>
            </div>

            <div id="highPriorityContainer">
              <div className="priority-task">
                <div className="priority-dot"></div>
                <div>
                  <h3>Complete DBMS Assignment</h3>
                  <p>Due: Tomorrow</p>
                </div>
              </div>

              <div className="priority-task">
                <div className="priority-dot"></div>
                <div>
                  <h3>Read OS Unit 2 Process Scheduling</h3>
                  <p>Due: 2 Nov 2026</p>
                </div>
              </div>

              <div className="priority-task">
                <div className="priority-dot"></div>
                <div>
                  <h3>Prepare CN Revision Notes</h3>
                  <p>Due: 4 Nov 2026</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= QUICK ACTIONS ================= */}
        <div className="quick-section">
          <h2>Quick Actions</h2>

          <div className="quick-actions">
            <a href="/task.html?action=add" className="quick-card">
              <span>➕</span>
              <p>Add Task</p>
            </a>

            <a href="/Notes.html?action=new" className="quick-card">
              <span>📝</span>
              <p>New Note</p>
            </a>

            <a href="/subjects.html?action=add" className="quick-card">
              <span>📚</span>
              <p>Add Subject</p>
            </a>

            <a href="/focus.html" className="quick-card">
              <span>⏱️</span>
              <p>Start Focus</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
