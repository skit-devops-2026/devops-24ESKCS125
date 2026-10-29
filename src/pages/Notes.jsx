import React, { useState, useEffect } from 'react';
import Topbar from '../components/Topbar';
import { noteAPI } from '../services/api';

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('DBMS');
  const [content, setContent] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function load() {
      const data = await noteAPI.getNotes();
      if (data && data.length > 0) {
        setNotes(data);
      } else {
        setNotes([
          {
            id: 1,
            title: 'ACID Properties in DBMS',
            subject: 'DBMS',
            content: 'Atomicity: All or nothing.\nConsistency: Database remains valid.\nIsolation: Concurrent transactions execute independently.\nDurability: Committed changes survive crashes.',
            date: '2026-10-25'
          },
          {
            id: 2,
            title: 'CPU Scheduling Algorithms',
            subject: 'Operating System',
            content: 'FCFS: First Come First Served (convoy effect).\nSJF: Shortest Job First (optimal average wait time).\nRound Robin: Time quantum based preemption.',
            date: '2026-10-26'
          }
        ]);
      }
    }
    load();
  }, []);

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const newNote = {
      id: Date.now(),
      title: title.trim(),
      subject,
      content: content.trim(),
      date: new Date().toISOString().split('T')[0]
    };

    const updated = [newNote, ...notes];
    setNotes(updated);
    noteAPI.saveNotes(updated);
    setTitle('');
    setContent('');
  };

  const deleteNote = (id) => {
    const updated = notes.filter((n) => n.id !== id);
    setNotes(updated);
    noteAPI.saveNotes(updated);
  };

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase()) ||
      n.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Topbar title="Study Notes 📝" subtitle="Quick revision notes, lecture summaries, and formula cheatsheets." />

      {/* Add Note Form */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="font-bold text-slate-800 text-base flex items-center gap-2">
          <span>➕</span> Create New Note
        </h2>
        <form onSubmit={handleAddNote} className="space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <input
                type="text"
                placeholder="Note Title (e.g. OSI Model Layers)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
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
                <option value="DBMS">DBMS</option>
                <option value="Operating System">Operating System</option>
                <option value="Computer Networks">Computer Networks</option>
                <option value="General">General / Other</option>
              </select>
            </div>
          </div>

          <div>
            <textarea
              placeholder="Write your study notes, key definitions, or formulas here..."
              rows="3"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-md shadow-blue-500/20"
            >
              Save Note
            </button>
          </div>
        </form>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search notes by keyword or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
          <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm">🔍</span>
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note) => (
            <div
              key={note.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-blue-300 transition-all group"
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                    {note.subject}
                  </span>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="text-slate-300 hover:text-rose-500 text-xs p-1 transition-colors"
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </div>
                <h3 className="font-bold text-slate-800 text-base mt-2 mb-2">{note.title}</h3>
                <p className="text-xs text-slate-600 whitespace-pre-line line-clamp-4 leading-relaxed">
                  {note.content}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                <span>📅 {note.date || 'Recent'}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-slate-400 text-sm font-medium">
            No notes found. Create your first study note above!
          </div>
        )}
      </div>
    </div>
  );
}
