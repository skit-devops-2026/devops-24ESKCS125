import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: 'fa-house' },
  { name: 'Subjects', path: '/subjects', icon: 'fa-book' },
  { name: 'Task Planner', path: '/tasks', icon: 'fa-square-check' },
  { name: 'Calendar', path: '/calendar', icon: 'fa-calendar-days' },
  { name: 'Notes', path: '/notes', icon: 'fa-note-sticky' },
  { name: 'Exam Tracker', path: '/exams', icon: 'fa-graduation-cap' },
  { name: 'Focus Timer', path: '/focus', icon: 'fa-stopwatch' },
];

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-[#1e2337] text-slate-300 min-h-screen flex flex-col justify-between p-4 shadow-xl select-none flex-shrink-0">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-3 py-4 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white text-xl shadow-md">
            📚
          </div>
          <div>
            <h1 className="font-bold text-white text-lg tracking-wide">Study Planner</h1>
            <p className="text-xs text-slate-400">Student Portal</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`
              }
            >
              <i className={`fa-solid ${item.icon} text-lg w-5 text-center`}></i>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom Menu */}
      <div className="pt-4 border-t border-slate-700/60 space-y-1.5">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
              isActive
                ? 'bg-blue-600 text-white font-semibold'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`
          }
        >
          <i className="fa-solid fa-gear text-lg w-5 text-center"></i>
          <span>Settings</span>
        </NavLink>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors text-left"
        >
          <i className="fa-solid fa-right-from-bracket text-lg w-5 text-center"></i>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
