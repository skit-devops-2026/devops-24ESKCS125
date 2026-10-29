import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Topbar from '../components/Topbar';
import { subjectAPI } from '../services/api';

export default function SubjectDetails() {
  const { id } = useParams();
  const [subject, setSubject] = useState(null);
  const [topics, setTopics] = useState([]);
  const [newTopic, setNewTopic] = useState('');

  useEffect(() => {
    async function load() {
      const subjects = await subjectAPI.getSubjects();
      const current = (subjects || []).find((s) => String(s.id) === String(id));
      if (current) {
        setSubject(current);
        setTopics(
          current.topics || [
            { id: 1, title: 'Introduction & Architecture', completed: true },
            { id: 2, title: 'ER Modeling and Relational Calculus', completed: true },
            { id: 3, title: 'Normalization (1NF to BCNF)', completed: false },
            { id: 4, title: 'Transaction Processing & Concurrency', completed: false },
          ]
        );
      } else {
        setSubject({
          id,
          name: 'Subject Overview',
          code: 'CS-Core',
          instructor: 'Faculty'
        });
        setTopics([
          { id: 1, title: 'Unit 1: Fundamentals', completed: true },
          { id: 2, title: 'Unit 2: Core Concepts', completed: false },
          { id: 3, title: 'Unit 3: Advanced Topics', completed: false },
        ]);
      }
    }
    load();
  }, [id]);

  const toggleTopic = (tid) => {
    const updated = topics.map((t) => (t.id === tid ? { ...t, completed: !t.completed } : t));
    setTopics(updated);
  };

  const handleAddTopic = (e) => {
    e.preventDefault();
    if (!newTopic.trim()) return;
    setTopics([...topics, { id: Date.now(), title: newTopic.trim(), completed: false }]);
    setNewTopic('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-2">
        <Link to="/subjects" className="hover:text-blue-600">
          ← Back to Subjects
        </Link>
      </div>

      <Topbar
        title={`${subject?.name || 'Subject Details'} 📖`}
        subtitle={`Course Code: ${subject?.code || 'N/A'} • Faculty: ${subject?.instructor || 'Staff'}`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Topics Checklist */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="font-bold text-slate-800 text-base">Course Topics & Syllabus Checklist</h2>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
              {topics.filter((t) => t.completed).length} / {topics.length} Done
            </span>
          </div>

          <form onSubmit={handleAddTopic} className="flex gap-2">
            <input
              type="text"
              placeholder="Add new syllabus chapter/topic..."
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              className="flex-1 border border-slate-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-xl text-sm transition-all shadow-sm"
            >
              Add
            </button>
          </form>

          <div className="space-y-2.5 pt-2">
            {topics.map((top) => (
              <div
                key={top.id}
                onClick={() => toggleTopic(top.id)}
                className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={top.completed}
                  onChange={() => {}}
                  className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                />
                <span
                  className={`text-sm font-semibold ${
                    top.completed ? 'line-through text-slate-400' : 'text-slate-800'
                  }`}
                >
                  {top.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Resources card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="font-bold text-slate-800 text-base">Quick Links & Resources</h2>
          <div className="space-y-3">
            <Link
              to="/notes"
              className="block p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 hover:bg-blue-50/50 transition-all text-xs font-bold text-slate-700"
            >
              📝 Open Lecture Notes
            </Link>
            <Link
              to="/exams"
              className="block p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 hover:bg-blue-50/50 transition-all text-xs font-bold text-slate-700"
            >
              📅 Exam Schedule & Past Papers
            </Link>
            <Link
              to="/tasks"
              className="block p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 hover:bg-blue-50/50 transition-all text-xs font-bold text-slate-700"
            >
              ✅ Active Assignments
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
