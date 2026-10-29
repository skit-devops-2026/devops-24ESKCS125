import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function Topbar({ title, subtitle }) {
  const { user } = useAuth();
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b border-slate-200/80 gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
          {title || `Good Day, ${user?.name || 'Student'}! 👋`}
        </h1>
        <p className="text-sm text-slate-500 mt-1 font-medium">
          {subtitle || `${today} • Let's make today productive.`}
        </p>
      </div>

      <div className="flex items-center gap-4">
        {/* Quick Date Badge */}
        <div className="hidden sm:flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-sm text-xs text-slate-600 font-semibold">
          <span>📅</span>
          <span>{today}</span>
        </div>

        {/* User Card */}
        <div className="flex items-center gap-2.5 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-sm">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-slate-800 leading-none">{user?.name || 'Student'}</p>
            <p className="text-[10px] text-slate-400 leading-none mt-1">{user?.email || 'student@skit.ac.in'}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
