import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Topbar from '../components/Topbar';
import { taskAPI, subjectAPI, examAPI } from '../services/api';

const quotes = [
  "Success is the sum of small efforts, repeated day in and day out.",
  "The secret to getting ahead is getting started.",
  "Focus on being productive instead of busy.",
  "Don't wish it were easier. Wish you were better."
];

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [exams, setExams] = useState([]);
  const [quote, setQuote] = useState(quotes[0]);

  useEffect(() => {
    // Pick quote of the day based on date
    const day = new Date().getDate();
    setQuote(quotes[day % quotes.length]);

    // Load initial data
    async function loadData() {
      const [tList, sList, eList] = await Promise.all([
        taskAPI.getTasks(),
        subjectAPI.getSubjects(),
        examAPI.getExams()
      ]);

      // Provide default demo subjects if empty
      const defaultSubjects = [
        { id: 1, name: 'DBMS', code: 'CS401', progress: 80 },
        { id: 2, name: 'Operating System', code: 'CS402', progress: 65 },
        { id: 3, name: 'Computer Networks', code: 'CS403', progress: 50 },
      ];

      setTasks(tList && tList.length > 0 ? tList : [
        { id: 1, title: 'Complete DBMS Assignment', subject: 'DBMS', priority: 'High', status: 'Pending' },
        { id: 2, title: 'OS Unit 3 Revision', subject: 'OS', priority: 'High', status: 'Pending' },
        { id: 3, title: 'CN Lab Program 4', subject: 'CN', priority: 'Medium', status: 'Completed' },
      ]);
      setSubjects(sList && sList.length > 0 ? sList : defaultSubjects);
      setExams(eList && eList.length > 0 ? eList : [
        { id: 1, name: 'DBMS Mid Term', subject: 'DBMS', date: '2026-11-15' }
      ]);
    }
    loadData();
  }, []);

  const completedCount = tasks.filter((t) => t.status === 'Completed').length;
  const totalCount = tasks.length || 1;
  const progressPercent = Math.round((completedCount / totalCount) * 100);
  const remainingCount = tasks.length - completedCount;

  const highPriorityTasks = tasks.filter((t) => t.priority === 'High' && t.status !== 'Completed');
  const nextExam = exams[0];

  return (
    <div className="space-y-6">
      <Topbar />

      {/* Quote Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-2xl shadow-lg shadow-blue-500/10 flex items-start gap-4">
        <span className="text-3xl p-2 bg-white/10 rounded-xl">💡</span>
        <div>
          <h2 className="text-xs uppercase font-extrabold tracking-wider text-blue-200">Quote of the Day</h2>
          <p className="text-base sm:text-lg font-medium mt-1 leading-snug">"{quote}"</p>
        </div>
      </div>

      {/* Row 1: Task Progress & Subject Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Progress */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <span>📋</span> Today's Task Progress
              </h2>
              <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                {progressPercent}%
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-4xl font-extrabold text-slate-800">{completedCount}</span>
              <span className="text-slate-400 font-medium">/ {tasks.length} Tasks Completed</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden mb-3">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <p className="text-xs text-slate-500 font-medium">{remainingCount} tasks remaining</p>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100">
            <Link to="/tasks" className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5">
              <span>View Tasks</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* Subject Progress */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-800 text-base flex items-center gap-2">
              <span>📚</span> Subject Progress
            </h2>
            <Link to="/subjects" className="text-xs font-bold text-blue-600 hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {subjects.slice(0, 3).map((sub, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700">{sub.name}</span>
                  <span className="text-slate-500">{sub.progress || 60}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-indigo-500 h-full rounded-full"
                    style={{ width: `${sub.progress || 60}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Upcoming Exam & High Priority Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Exam */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <span>📅</span> Upcoming Exam
              </h2>
              <Link to="/exams" className="text-xs font-bold text-blue-600 hover:underline">
                View All
              </Link>
            </div>

            {nextExam ? (
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">{nextExam.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{nextExam.subject}</p>
                  <p className="text-xs font-semibold text-blue-600 mt-2">📅 {nextExam.date}</p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-extrabold text-blue-600">12</span>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Days Left</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-400 py-4">No upcoming exams scheduled.</p>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100">
            <Link to="/exams" className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5">
              <span>View Exam Details</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* High Priority Tasks */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <span>🔥</span> High Priority Tasks
              </h2>
              <Link to="/tasks" className="text-xs font-bold text-blue-600 hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {highPriorityTasks.length > 0 ? (
                highPriorityTasks.slice(0, 3).map((t, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-rose-50/50 rounded-xl border border-rose-100">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 flex-shrink-0"></span>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-slate-800 truncate">{t.title}</h4>
                      <p className="text-xs text-slate-400">{t.subject || 'General'}</p>
                    </div>
                    <span className="text-[11px] font-bold text-rose-600 bg-rose-100 px-2 py-0.5 rounded-md">
                      Due Soon
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-400 py-4 text-center">🎉 No urgent tasks pending!</p>
              )}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100">
            <Link to="/tasks" className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5">
              <span>Manage All Tasks</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="font-bold text-slate-800 text-base mb-4">⚡ Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            to="/tasks"
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200/80 hover:border-blue-300 transition-all text-center group"
          >
            <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">➕</span>
            <span className="text-xs font-bold text-slate-700 group-hover:text-blue-600">Add Task</span>
          </Link>
          <Link
            to="/notes"
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200/80 hover:border-blue-300 transition-all text-center group"
          >
            <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">📝</span>
            <span className="text-xs font-bold text-slate-700 group-hover:text-blue-600">New Note</span>
          </Link>
          <Link
            to="/subjects"
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200/80 hover:border-blue-300 transition-all text-center group"
          >
            <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">📚</span>
            <span className="text-xs font-bold text-slate-700 group-hover:text-blue-600">Add Subject</span>
          </Link>
          <Link
            to="/focus"
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200/80 hover:border-blue-300 transition-all text-center group"
          >
            <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">⏱️</span>
            <span className="text-xs font-bold text-slate-700 group-hover:text-blue-600">Start Focus</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
