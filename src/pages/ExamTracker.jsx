import React, { useState, useEffect } from 'react';
import Topbar from '../components/Topbar';
import { examAPI } from '../services/api';

export default function ExamTracker() {
  const [exams, setExams] = useState([]);
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('DBMS');
  const [date, setDate] = useState('');

  useEffect(() => {
    async function load() {
      const data = await examAPI.getExams();
      if (data && data.length > 0) {
        setExams(data);
      } else {
        setExams([
          { id: 1, name: 'Mid Term Exam', subject: 'Database Management Systems', date: '2026-11-15', totalUnits: 5, preparedUnits: 4 },
          { id: 2, name: 'Final Semester Exam', subject: 'Operating Systems', date: '2026-12-02', totalUnits: 6, preparedUnits: 3 },
          { id: 3, name: 'Unit Test 2', subject: 'Computer Networks', date: '2026-11-10', totalUnits: 4, preparedUnits: 2 },
        ]);
      }
    }
    load();
  }, []);

  const getDaysLeft = (examDate) => {
    if (!examDate) return 0;
    const diff = new Date(examDate) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const handleAddExam = (e) => {
    e.preventDefault();
    if (!name.trim() || !date) return;

    const newEx = {
      id: Date.now(),
      name: name.trim(),
      subject,
      date,
      totalUnits: 5,
      preparedUnits: 1
    };

    const updated = [...exams, newEx];
    setExams(updated);
    examAPI.saveExams(updated);
    setName('');
    setDate('');
  };

  const deleteExam = (id) => {
    const updated = exams.filter((e) => e.id !== id);
    setExams(updated);
    examAPI.saveExams(updated);
  };

  return (
    <div className="space-y-6">
      <Topbar title="Exam Tracker 🎯" subtitle="Never lose sight of exams, midterms, and submission deadlines." />

      {/* Add Exam */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="font-bold text-slate-800 text-base flex items-center gap-2">
          <span>➕</span> Add Upcoming Exam
        </h2>
        <form onSubmit={handleAddExam} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <input
              type="text"
              placeholder="Exam Name (e.g. Midterm 1)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-slate-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="DBMS">Database Management Systems</option>
              <option value="Operating Systems">Operating Systems</option>
              <option value="Computer Networks">Computer Networks</option>
              <option value="Software Engineering">Software Engineering</option>
            </select>
          </div>

          <div>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>

          <div className="sm:col-span-2"></div>
          <div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-sm transition-all shadow-md shadow-blue-500/20"
            >
              Schedule Exam
            </button>
          </div>
        </form>
      </div>

      {/* Exam Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams.map((ex) => {
          const days = getDaysLeft(ex.date);
          const percent = Math.round(((ex.preparedUnits || 2) / (ex.totalUnits || 5)) * 100);

          return (
            <div
              key={ex.id}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-blue-300 transition-all"
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                    {ex.subject}
                  </span>
                  <button
                    onClick={() => deleteExam(ex.id)}
                    className="text-slate-300 hover:text-rose-500 text-xs p-1 transition-colors"
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </div>

                <h3 className="font-bold text-slate-800 text-lg mt-3">{ex.name}</h3>
                <p className="text-xs font-semibold text-slate-400 mt-1">📅 {ex.date}</p>

                {/* Countdown Box */}
                <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-black text-slate-800">{days}</span>
                    <span className="text-xs font-semibold text-slate-500 ml-1.5">Days Left</span>
                  </div>
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                      days <= 7 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {days <= 7 ? '⚠️ Urgent' : 'On Track'}
                  </span>
                </div>

                {/* Preparation status */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-600">
                    <span>Preparation Progress</span>
                    <span>{percent}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: `${percent}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 text-[11px] text-slate-400 font-medium">
                Target: {ex.preparedUnits || 3} of {ex.totalUnits || 5} units revised
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
