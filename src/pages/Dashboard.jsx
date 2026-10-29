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
        <Link to="/dashboard" className="logo" style={{ textDecoration: 'none', display: 'block', color: 'white' }}>
          📚 Study Planner
        </Link>

        <div className="menu">
          <Link to="/dashboard" className="active">
            🏠 Dashboard
          </Link>
          <Link to="/subjects">
            📚 Subjects
          </Link>
          <Link to="/tasks">
            ✅ Task Planner
          </Link>
          <Link to="/calendar">
            📅 Calendar
          </Link>
          <Link to="/notes">
            📝 Notes
          </Link>
          <Link to="/exams">
            📝 Exam Tracker
          </Link>
          <Link to="/focus">
            ⏱️ Focus Timer
          </Link>
        </div>

        <div className="bottom-menu">
          <Link to="/settings">
            ⚙️ Settings
          </Link>
          <Link to="/">
            🚪 Logout
          </Link>
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
            <Link to="/settings" className="user" style={{ textDecoration: 'none', color: 'inherit' }}>
              👤
              <span id="userNameDisplay">{user}</span>
            </Link>
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
                className="progress-bar task-bar"
                id="taskProgress"
                style={{ width: '60%' }}
              ></div>
            </div>

            <p id="remainingTasks">4 tasks remaining</p>

            <Link to="/tasks" className="view-link">
              View Tasks →
            </Link>
          </div>

          {/* Subject Progress */}
          <div className="dashboard-card" id="subjectProgressCard">
            <div className="card-title">
              <h2>📚 Subject Progress</h2>
              <Link to="/subjects">View All</Link>
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
              <Link to="/exams">View All</Link>
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
              <Link to="/exams" className="view-button">
                View Details
              </Link>
            </div>
          </div>

          {/* High Priority Tasks */}
          <div className="dashboard-card priority-card">
            <div className="card-title">
              <h2>🔥 High Priority Tasks</h2>
              <Link to="/tasks">View All</Link>
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
            <Link to="/tasks" className="quick-card">
              <span>➕</span>
              <p>Add Task</p>
            </Link>

            <Link to="/notes" className="quick-card">
              <span>📝</span>
              <p>New Note</p>
            </Link>

            <Link to="/subjects" className="quick-card">
              <span>📚</span>
              <p>Add Subject</p>
            </Link>

            <Link to="/focus" className="quick-card">
              <span>⏱️</span>
              <p>Start Focus</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
