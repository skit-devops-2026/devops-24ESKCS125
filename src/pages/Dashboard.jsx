import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/dashboard.css';

export default function Dashboard() {
  const [user, setUser] = useState('Student');
  const [tasks, setTasks] = useState([]);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (u.name) setUser(u.name);
      const t = JSON.parse(localStorage.getItem('study_tasks') || '[]');
      setTasks(t);
      const s = JSON.parse(localStorage.getItem('study_subjects') || '[]');
      setSubjects(s);
    } catch (e) {}
  }, []);

  const completed = tasks.filter(t => t.completed).length;
  const total = tasks.length || 10;
  const percent = tasks.length ? Math.round((completed / total) * 100) : 60;

  return (
    <div className="dashboard-page-root">


    {/*  ================= SIDEBAR =================  */}

    <div className="sidebar">

        <a href="/dashboard" className="logo" style={{ textDecoration: 'none', display: 'block', color: 'white' }}>
            📚 Study Planner
        </a>

        <div className="menu">

            <a href="/dashboard" className="active">
                🏠 Dashboard
            </a>

            <a href="/subjects">
                📚 Subjects
            </a>

            <a href="/tasks">
                ✅ Task Planner
            </a>

            <a href="/calendar">
                📅 Calendar
            </a>

            <a href="/notes">
                📝 Notes
            </a>

            <a href="/exams">
                📝 Exam Tracker
            </a>

            <a href="/focus">
                ⏱️ Focus Timer
            </a>

        </div>

        <div className="bottom-menu">

            <a href="/settings">
                ⚙️ Settings
            </a>

            <a href="/">
                🚪 Logout
            </a>

        </div>

    </div>


    {/*  ================= MAIN CONTENT =================  */}

    <div className="main-content">


        {/*  Header  */}

        <div className="header">

            <div>
                <h1 id="greetingTitle">Good Morning! 👋</h1>
                <p id="todayDate">Let's make today productive.</p>
            </div>

            <div className="user-section">

                <span className="notification" title="Notifications">🔔</span>

                <a href="/settings" className="user" style={{ textDecoration: 'none', color: 'inherit' }}>
                    👤
                    <span id="userNameDisplay">Student</span>
                </a>

            </div>

        </div>


        {/*  ================= QUOTE =================  */}

        <div className="quote-card">

            <div className="quote-icon">
                💡
            </div>

            <div>
                <h2>Quote of the Day</h2>

                <p id="dailyQuote">
                    "Success is the sum of small efforts, repeated day in and day out."
                </p>
            </div>

        </div>


        {/*  ================= FIRST ROW =================  */}

        <div className="card-row">


            {/*  Today's Task Progress  */}

            <div className="dashboard-card task-progress-card">

                <div className="card-title">

                    <h2>📋 Today's Task Progress</h2>

                    <span id="taskProgressPercent">0%</span>

                </div>

                <div className="task-number">

                    <strong id="completedTasks">0</strong>

                    <span id="totalTasksDisplay">/ 0 Tasks Completed</span>

                </div>

                <div className="progress">

                    <div
                        className="progress-bar task-bar"
                        id="taskProgress"
                        style={{ width: '60%' }}>
                    </div>

                </div>

                <p id="remainingTasks">
                    0 tasks remaining
                </p>

                <a href="/tasks" className="view-link">
                    View Tasks →
                </a>

            </div>


            {/*  Subject Progress  */}

            <div className="dashboard-card" id="subjectProgressCard">

                <div className="card-title">

                    <h2>📚 Subject Progress</h2>

                    <a href="/subjects">
                        View All
                    </a>

                </div>

                <div id="subjectProgressList">
                    {/*  Populated dynamically by dashboard.js  */}
                </div>

            </div>

        </div>


        {/*  ================= SECOND ROW =================  */}

        <div className="card-row">


            {/*  Upcoming Exam  */}

            <div className="dashboard-card exam-card">

                <div className="card-title">

                    <h2>📅 Upcoming Exam</h2>

                    <a href="/exams">
                        View All
                    </a>

                </div>

                <div id="upcomingExamContainer">
                    {/*  Populated dynamically by dashboard.js  */}
                </div>

            </div>


            {/*  High Priority Tasks  */}

            <div className="dashboard-card priority-card">

                <div className="card-title">

                    <h2>🔥 High Priority Tasks</h2>

                    <a href="/tasks">
                        View All
                    </a>

                </div>

                <div id="highPriorityContainer">
                    {/*  Populated dynamically by dashboard.js  */}
                </div>

            </div>

        </div>


        {/*  ================= QUICK ACTIONS =================  */}

        <div className="quick-section">

            <h2>Quick Actions</h2>

            <div className="quick-actions">

                <a href="task.html?action=add" className="quick-card">
                    <span>➕</span>
                    <p>Add Task</p>
                </a>

                <a href="Notes.html?action=new" className="quick-card">
                    <span>📝</span>
                    <p>New Note</p>
                </a>

                <a href="subjects.html?action=add" className="quick-card">
                    <span>📚</span>
                    <p>Add Subject</p>
                </a>

                <a href="/focus" className="quick-card">
                    <span>⏱️</span>
                    <p>Start Focus</p>
                </a>

            </div>

        </div>

    </div>


    {/*  JavaScript  */}

    
    
    


    </div>
  );
}
