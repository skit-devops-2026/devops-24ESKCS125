import React, { useState, useEffect } from 'react';
import Topbar from '../components/Topbar';
import { focusAPI } from '../services/api';

export default function Focus() {
  const [mode, setMode] = useState('focus'); // 'focus' (25m), 'short' (5m), 'long' (15m)
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);

  const modeTimes = {
    focus: 25 * 60,
    short: 5 * 60,
    long: 15 * 60
  };

  useEffect(() => {
    async function load() {
      const data = await focusAPI.getSessions();
      if (data && Array.isArray(data)) {
        setCompletedSessions(data.length);
      }
    }
    load();
  }, []);

  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      if (mode === 'focus') {
        const newCount = completedSessions + 1;
        setCompletedSessions(newCount);
        focusAPI.saveSessions([{ date: new Date().toISOString(), duration: 25, mode }]);
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode, completedSessions]);

  const switchMode = (m) => {
    setMode(m);
    setTimeLeft(modeTimes[m]);
    setIsRunning(false);
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(modeTimes[mode]);
  };

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const seconds = String(timeLeft % 60).padStart(2, '0');

  return (
    <div className="space-y-6">
      <Topbar title="Focus Timer ⏱️" subtitle="Stay in deep work mode with Pomodoro intervals." />

      <div className="max-w-xl mx-auto bg-white p-8 rounded-3xl border border-slate-200 shadow-xl text-center space-y-6">
        {/* Mode Selector */}
        <div className="inline-flex bg-slate-100 p-1.5 rounded-2xl gap-1">
          <button
            onClick={() => switchMode('focus')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'focus' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🎯 Focus (25m)
          </button>
          <button
            onClick={() => switchMode('short')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'short' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ☕ Short Break (5m)
          </button>
          <button
            onClick={() => switchMode('long')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'long' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🛋️ Long Break (15m)
          </button>
        </div>

        {/* Big Clock Display */}
        <div className="py-6">
          <span className="text-7xl sm:text-8xl font-black tracking-tight text-slate-800 font-mono">
            {minutes}:{seconds}
          </span>
          <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mt-3">
            {mode === 'focus' ? 'Deep Work Session' : 'Rest & Recharge Interval'}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={toggleTimer}
            className={`px-8 py-3.5 rounded-2xl font-bold text-base text-white shadow-xl transition-all ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-400 shadow-amber-500/20'
                : 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/25'
            }`}
          >
            {isRunning ? 'Pause' : 'Start Focus'}
          </button>
          <button
            onClick={resetTimer}
            className="px-6 py-3.5 rounded-2xl font-bold text-base bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all"
          >
            Reset
          </button>
        </div>

        {/* Session Stats */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-around text-xs font-semibold text-slate-500">
          <div>
            <span className="block text-2xl font-extrabold text-slate-800">{completedSessions}</span>
            <span>Completed Pomodoros</span>
          </div>
          <div className="w-px h-8 bg-slate-200"></div>
          <div>
            <span className="block text-2xl font-extrabold text-slate-800">
              {Math.round(completedSessions * 25)}
            </span>
            <span>Total Minutes Focused</span>
          </div>
        </div>
      </div>
    </div>
  );
}
