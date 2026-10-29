import React, { useState } from 'react';
import Topbar from '../components/Topbar';
import { useAuth } from '../context/AuthContext';

export default function Settings() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || 'Garima Verma');
  const [email] = useState(user?.email || 'garimav163@gmail.com');
  const [saved, setSaved] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const updatedUser = { ...user, name };
    localStorage.setItem('study_planner_user', JSON.stringify(updatedUser));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleExportData = () => {
    const data = {
      user,
      tasks: JSON.parse(localStorage.getItem(`${user?.email}_tasks`) || '[]'),
      subjects: JSON.parse(localStorage.getItem(`${user?.email}_subjects`) || '[]'),
      notes: JSON.parse(localStorage.getItem(`${user?.email}_notes`) || '[]'),
      exams: JSON.parse(localStorage.getItem(`${user?.email}_exams`) || '[]'),
      calendarEvents: JSON.parse(localStorage.getItem(`${user?.email}_calendarEvents`) || '[]'),
      focusSessions: JSON.parse(localStorage.getItem(`${user?.email}_focusSessions`) || '[]'),
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `study_planner_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <Topbar title="Settings ⚙️" subtitle="Manage your profile, preferences, and study data." />

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-bold rounded-2xl flex items-center gap-2">
          <span>✅</span>
          <span>Profile changes updated successfully!</span>
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="font-bold text-slate-800 text-base">Student Profile</h2>
        <form onSubmit={handleSaveProfile} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-slate-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Email Address</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full border border-slate-200 bg-slate-50 text-slate-500 rounded-xl px-4 py-2 text-sm cursor-not-allowed"
            />
            <p className="text-[11px] text-slate-400 mt-1">Email is tied to your student account credentials.</p>
          </div>

          <div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-md shadow-blue-500/20"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>

      {/* Data Backup Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="font-bold text-slate-800 text-base">Study Data & Privacy</h2>
        <p className="text-sm text-slate-500 leading-relaxed max-w-2xl">
          Export your tasks, subject syllabus logs, study notes, and focus history as a backup JSON file anytime.
        </p>

        <div>
          <button
            onClick={handleExportData}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
          >
            <span>📥</span>
            <span>Download My Study Data (JSON)</span>
          </button>
        </div>
      </div>

      {/* App Information */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-xs text-slate-500 space-y-1.5">
        <p className="font-bold text-slate-700">Study Planner Web App</p>
        <p>Built with React, Vite, Express, and MongoDB.</p>
        <p>Author: Garima Verma (24ESKCS125) • SKIT DevOps Project</p>
      </div>
    </div>
  );
}
