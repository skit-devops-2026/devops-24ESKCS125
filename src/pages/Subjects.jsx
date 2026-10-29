import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Topbar from '../components/Topbar';
import { subjectAPI } from '../services/api';

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [instructor, setInstructor] = useState('');

  useEffect(() => {
    async function load() {
      const data = await subjectAPI.getSubjects();
      if (data && data.length > 0) {
        setSubjects(data);
      } else {
        setSubjects([
          { id: 1, name: 'Database Management Systems', code: 'CS401', instructor: 'Dr. Sharma', progress: 80, topicsCount: 14, coveredCount: 11 },
          { id: 2, name: 'Operating Systems', code: 'CS402', instructor: 'Prof. Verma', progress: 65, topicsCount: 12, coveredCount: 8 },
          { id: 3, name: 'Computer Networks', code: 'CS403', instructor: 'Dr. Gupta', progress: 50, topicsCount: 16, coveredCount: 8 },
          { id: 4, name: 'Software Engineering', code: 'CS404', instructor: 'Prof. Singh', progress: 40, topicsCount: 10, coveredCount: 4 },
        ]);
      }
    }
    load();
  }, []);

  const handleAddSubject = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newSub = {
      id: Date.now(),
      name: name.trim(),
      code: code.trim() || 'CS101',
      instructor: instructor.trim() || 'Faculty',
      progress: 0,
      topicsCount: 10,
      coveredCount: 0
    };

    const updated = [...subjects, newSub];
    setSubjects(updated);
    subjectAPI.saveSubjects(updated);
    setName('');
    setCode('');
    setInstructor('');
  };

  const deleteSubject = (id) => {
    const updated = subjects.filter((s) => s.id !== id);
    setSubjects(updated);
    subjectAPI.saveSubjects(updated);
  };

  return (
    <div className="space-y-6">
      <Topbar title="Academic Subjects 📚" subtitle="Track course syllabus, chapters, and completion milestones." />

      {/* Add Subject Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="font-bold text-slate-800 text-base mb-4 flex items-center gap-2">
          <span>➕</span> Add New Subject
        </h2>
        <form onSubmit={handleAddSubject} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <input
              type="text"
              placeholder="Subject Name (e.g. Cloud Computing)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Subject Code (e.g. CS501)"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Faculty / Instructor"
              value={instructor}
              onChange={(e) => setInstructor(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="sm:col-span-2"></div>
          <div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-sm shadow-md shadow-blue-500/20 transition-all"
            >
              Add Subject
            </button>
          </div>
        </form>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {subjects.map((sub) => (
          <div
            key={sub.id}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-blue-300 transition-all group"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                    {sub.code}
                  </span>
                  <h3 className="text-lg font-bold text-slate-800 mt-2">{sub.name}</h3>
                  <p className="text-xs text-slate-500 font-medium">Instructor: {sub.instructor || 'Staff'}</p>
                </div>
                <button
                  onClick={() => deleteSubject(sub.id)}
                  className="text-slate-300 hover:text-rose-500 text-sm p-1 transition-colors"
                >
                  <i className="fa-solid fa-trash-can"></i>
                </button>
              </div>

              {/* Progress Bar */}
              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-600">Syllabus Completion</span>
                  <span className="text-blue-600">{sub.progress || 50}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${sub.progress || 50}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 font-medium pt-1">
                  <span>{sub.coveredCount || 6} Topics Completed</span>
                  <span>{sub.topicsCount || 12} Total Topics</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-between">
              <Link
                to={`/subjects/${sub.id}`}
                className="text-xs font-bold text-blue-600 group-hover:text-blue-700 flex items-center gap-1.5"
              >
                <span>View Details & Notes</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
