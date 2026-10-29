import React, { useState, useEffect } from 'react';
import Topbar from '../components/Topbar';
import { taskAPI } from '../services/api';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('All');
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('General');
  const [priority, setPriority] = useState('Medium');
  const [date, setDate] = useState('');

  useEffect(() => {
    async function load() {
      const data = await taskAPI.getTasks();
      if (data && data.length > 0) {
        setTasks(data);
      } else {
        setTasks([
          { id: 1, title: 'Complete DBMS Assignment', subject: 'DBMS', priority: 'High', status: 'Pending', date: '2026-10-30' },
          { id: 2, title: 'Read OS Unit 2 Process Scheduling', subject: 'OS', priority: 'Medium', status: 'Completed', date: '2026-10-28' },
          { id: 3, title: 'Prepare Computer Networks Notes', subject: 'CN', priority: 'Low', status: 'Pending', date: '2026-11-02' },
        ]);
      }
    }
    load();
  }, []);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask = {
      id: Date.now(),
      title: title.trim(),
      subject,
      priority,
      status: 'Pending',
      date: date || new Date().toISOString().split('T')[0]
    };

    const updated = [newTask, ...tasks];
    setTasks(updated);
    taskAPI.saveTasks(updated);
    setTitle('');
    setDate('');
  };

  const toggleStatus = (id) => {
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, status: t.status === 'Completed' ? 'Pending' : 'Completed' } : t
    );
    setTasks(updated);
    taskAPI.saveTasks(updated);
  };

  const deleteTask = (id) => {
    const updated = tasks.filter((t) => t.id !== id);
    setTasks(updated);
    taskAPI.saveTasks(updated);
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'All') return true;
    return t.status === filter;
  });

  return (
    <div className="space-y-6">
      <Topbar title="Task Planner ✅" subtitle="Plan, track, and complete your academic to-dos." />

      {/* Add Task Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="font-bold text-slate-800 text-base mb-4 flex items-center gap-2">
          <span>➕</span> Add New Study Task
        </h2>
        <form onSubmit={handleAddTask} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="sm:col-span-2">
            <input
              type="text"
              placeholder="What do you need to study?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="General">General</option>
              <option value="DBMS">DBMS</option>
              <option value="Operating System">Operating System</option>
              <option value="Computer Networks">Computer Networks</option>
              <option value="Software Engg">Software Engg</option>
            </select>
          </div>

          <div>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
            </select>
          </div>

          <div>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>

          <div className="sm:col-span-2 md:col-span-3"></div>

          <div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-sm shadow-md shadow-blue-500/20 transition-all"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>

      {/* Task Filters & List */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-3">
          <h2 className="font-bold text-slate-800 text-base">Your Tasks ({filteredTasks.length})</h2>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            {['All', 'Pending', 'Completed'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filter === tab ? 'bg-white text-blue-600 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* List items */}
        <div className="space-y-3">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((t) => (
              <div
                key={t.id}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                  t.status === 'Completed'
                    ? 'bg-slate-50/70 border-slate-200 opacity-75'
                    : 'bg-white border-slate-200/90 shadow-sm hover:border-blue-200'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <input
                    type="checkbox"
                    checked={t.status === 'Completed'}
                    onChange={() => toggleStatus(t.id)}
                    className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <div className="min-w-0">
                    <p
                      className={`text-sm font-bold truncate ${
                        t.status === 'Completed' ? 'line-through text-slate-400' : 'text-slate-800'
                      }`}
                    >
                      {t.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {t.subject || 'General'}
                      </span>
                      {t.date && <span className="text-[11px] text-slate-400">📅 {t.date}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-md ${
                      t.priority === 'High'
                        ? 'bg-rose-100 text-rose-700'
                        : t.priority === 'Medium'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {t.priority}
                  </span>
                  <button
                    onClick={() => deleteTask(t.id)}
                    className="text-slate-300 hover:text-rose-500 text-sm p-1 transition-colors"
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-slate-400 text-sm font-medium">
              No tasks found in this view.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
