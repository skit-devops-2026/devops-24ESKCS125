import React from 'react';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: '✅',
    title: 'Smart Task Planner',
    desc: 'Organize study tasks with deadlines, priority tags, and status tracking.'
  },
  {
    icon: '📚',
    title: 'Subject Progress',
    desc: 'Track topics covered, syllabus percentage, and study materials per course.'
  },
  {
    icon: '📝',
    title: 'Exam Tracker',
    desc: 'Never miss an exam with live countdowns, syllabus checklists, and reminders.'
  },
  {
    icon: '📅',
    title: 'Interactive Calendar',
    desc: 'Visualize deadlines, study slots, and important academic milestones.'
  },
  {
    icon: '⏱️',
    title: 'Focus Timer',
    desc: 'Boost retention using Pomodoro intervals with custom sound and break sessions.'
  },
  {
    icon: '📝',
    title: 'Quick Notes',
    desc: 'Store lecture summaries, formula sheets, and key concept revisions in one place.'
  }
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between">
      {/* Header */}
      <header className="max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">📚</span>
          <span className="text-xl font-bold tracking-tight text-white">Study Planner</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
          >
            Log in
          </Link>
          <Link
            to="/signup"
            className="px-5 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-500/20 transition-all"
          >
            Get Started Free
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-6 py-16 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-8">
          ✨ Next-Gen Student Productivity Platform
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Master Your Studies with <br />
          <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Clarity and Consistency
          </span>
        </h1>
        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Plan daily sessions, track syllabus completion, hit exam goals, and elevate your grades with an all-in-one student workspace.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <Link
            to="/signup"
            className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-xl shadow-blue-500/25 transition-all text-base"
          >
            Start Planning Free →
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto px-8 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl border border-slate-700 transition-all text-base"
          >
            Sign In to Dashboard
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:border-blue-500/40 transition-all shadow-lg hover:shadow-blue-500/5 group"
            >
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform inline-block">
                {feat.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 text-center text-xs text-slate-500">
        <p>© 2026 Study Planner • SKIT DevOps Project</p>
      </footer>
    </div>
  );
}
