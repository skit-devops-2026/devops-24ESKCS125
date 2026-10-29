import React, { useState, useEffect } from 'react';
import Topbar from '../components/Topbar';
import { calendarAPI } from '../services/api';

export default function Calendar() {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('Study');

  useEffect(() => {
    async function load() {
      const data = await calendarAPI.getEvents();
      if (data && data.length > 0) {
        setEvents(data);
      } else {
        setEvents([
          { id: 1, title: 'DBMS Assignment Due', date: '2026-10-30', category: 'Assignment' },
          { id: 2, title: 'OS Midterm Exam', date: '2026-11-05', category: 'Exam' },
          { id: 3, title: 'CN Group Study Session', date: '2026-11-02', category: 'Study' },
        ]);
      }
    }
    load();
  }, []);

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!title.trim() || !date) return;

    const newEv = {
      id: Date.now(),
      title: title.trim(),
      date,
      category
    };

    const updated = [...events, newEv];
    setEvents(updated);
    calendarAPI.saveEvents(updated);
    setTitle('');
    setDate('');
  };

  const deleteEvent = (id) => {
    const updated = events.filter((e) => e.id !== id);
    setEvents(updated);
    calendarAPI.saveEvents(updated);
  };

  return (
    <div className="space-y-6">
      <Topbar title="Study Calendar 📅" subtitle="Schedule study blocks, track exam dates, and stay organized." />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Event Form */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="font-bold text-slate-800 text-base flex items-center gap-2">
            <span>➕</span> Add Academic Event
          </h2>

          <form onSubmit={handleAddEvent} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Event Title</label>
              <input
                type="text"
                placeholder="e.g. Chapter 4 Revision"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="Study">Study Session</option>
                <option value="Assignment">Assignment</option>
                <option value="Exam">Exam / Quiz</option>
                <option value="Reminder">Reminder</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-sm transition-all shadow-md shadow-blue-500/20"
            >
              Add to Calendar
            </button>
          </form>
        </div>

        {/* Scheduled Events List */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="font-bold text-slate-800 text-base mb-4 flex items-center justify-between">
            <span>Upcoming Scheduled Dates</span>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
              {events.length} Events
            </span>
          </h2>

          <div className="space-y-3">
            {events.length > 0 ? (
              events.map((ev) => (
                <div
                  key={ev.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex flex-col items-center justify-center font-bold text-xs flex-shrink-0">
                      <span>{ev.date ? ev.date.split('-')[2] : '•'}</span>
                      <span className="text-[9px] uppercase">{ev.date ? 'Day' : ''}</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{ev.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">📅 {ev.date}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-md ${
                        ev.category === 'Exam'
                          ? 'bg-rose-100 text-rose-700'
                          : ev.category === 'Assignment'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {ev.category}
                    </span>
                    <button
                      onClick={() => deleteEvent(ev.id)}
                      className="text-slate-300 hover:text-rose-500 text-sm p-1 transition-colors"
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-12 text-slate-400 text-sm">No scheduled events yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
