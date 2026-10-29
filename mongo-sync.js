/**
 * mongo-sync.js
 * Transparent two-way synchronization between client localStorage and MongoDB backend.
 * Zero layout, visual, or structural changes to existing pages.
 */
(function () {
  const API_BASE = '/api';

  // Helper safe fetch
  async function apiFetch(url, options = {}) {
    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
      if (!currentUser || !currentUser.email) return null;
      const res = await fetch(`${API_BASE}${url}`, {
        ...options,
        headers: { 'Content-Type': 'application/json', 'X-Auth-Token': currentUser.token || '', ...options.headers }
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (err) {
      return null;
    }
  }

  // Sync on Initial Load
  async function syncInitialData() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!currentUser || !currentUser.email) {
      if (!window.location.pathname.toLowerCase().includes('index.html') &&
          !window.location.pathname.toLowerCase().includes('signup.html') &&
          !window.location.pathname.toLowerCase().includes('landing.html') &&
          window.location.pathname !== '/') {
        window.location.replace('index.html');
      }
      return;
    }
    const page = window.location.pathname.toLowerCase();

    // 1. Tasks sync
    if (page.includes('task') || page.includes('dashboard')) {
      const remoteTasks = await apiFetch('/tasks');
      if (Array.isArray(remoteTasks) && remoteTasks.length > 0) {
        localStorage.setItem('studyTasks', JSON.stringify(remoteTasks));
        if (typeof displayTasks === 'function' && typeof tasks !== 'undefined') {
          tasks = remoteTasks;
          displayTasks(tasks);
          if (typeof updateStatistics === 'function') updateStatistics();
        }
      } else {
        // If remote is empty but local has data, upload local to MongoDB
        const local = JSON.parse(localStorage.getItem('studyTasks') || '[]');
        if (local.length > 0) {
          apiFetch('/tasks/sync', {
            method: 'POST',
            body: JSON.stringify({ tasks: local })
          });
        }
      }
    }

    // 2. Subjects sync
    if (page.includes('subject') || page.includes('dashboard') || page.includes('notes')) {
      const remoteSubjects = await apiFetch('/subjects');
      if (Array.isArray(remoteSubjects) && remoteSubjects.length > 0) {
        const names = remoteSubjects.map(s => (typeof s === 'string' ? s : s.name));
        localStorage.setItem('studySubjects', JSON.stringify(names));
        if (typeof displaySubjects === 'function' && typeof subjects !== 'undefined') {
          subjects = names;
          displaySubjects();
        }
      } else {
        const local = JSON.parse(localStorage.getItem('studySubjects') || '[]');
        if (local.length > 0) {
          apiFetch('/subjects/sync', {
            method: 'POST',
            body: JSON.stringify({ subjects: local.map(s => ({ name: s })) })
          });
        }
      }
    }

    // 3. Notes sync
    if (page.includes('notes')) {
      const remoteNotes = await apiFetch('/notes');
      if (Array.isArray(remoteNotes) && remoteNotes.length > 0) {
        localStorage.setItem('studyNotes', JSON.stringify(remoteNotes));
        if (typeof displayNotes === 'function' && typeof notes !== 'undefined') {
          notes = remoteNotes;
          displayNotes();
          if (typeof updateStatistics === 'function') updateStatistics();
        }
      } else {
        const local = JSON.parse(localStorage.getItem('studyNotes') || '[]');
        if (local.length > 0) {
          apiFetch('/notes/sync', {
            method: 'POST',
            body: JSON.stringify({ notes: local })
          });
        }
      }
    }

    // 4. Exams sync
    if (page.includes('exam') || page.includes('dashboard')) {
      const remoteExams = await apiFetch('/exams');
      if (Array.isArray(remoteExams) && remoteExams.length > 0) {
        localStorage.setItem('examList', JSON.stringify(remoteExams));
        if (typeof renderAllExams === 'function' && typeof exams !== 'undefined') {
          exams = remoteExams;
          renderAllExams();
        }
      } else {
        const local = JSON.parse(localStorage.getItem('examList') || '[]');
        if (local.length > 0) {
          apiFetch('/exams/sync', {
            method: 'POST',
            body: JSON.stringify({ exams: local })
          });
        }
      }
    }

    // 5. Calendar sync
    if (page.includes('calendar')) {
      const remoteEvents = await apiFetch('/calendar');
      if (Array.isArray(remoteEvents) && remoteEvents.length > 0) {
        localStorage.setItem('studyPlannerCalendarEvents', JSON.stringify(remoteEvents));
        if (typeof renderCalendar === 'function') {
          renderCalendar();
        }
      } else {
        const local = JSON.parse(localStorage.getItem('studyPlannerCalendarEvents') || '[]');
        if (local.length > 0) {
          apiFetch('/calendar/sync', {
            method: 'POST',
            body: JSON.stringify({ events: local })
          });
        }
      }
    }

    // 6. Focus sessions sync
    if (page.includes('focus')) {
      const remoteFocus = await apiFetch('/focus');
      if (Array.isArray(remoteFocus) && remoteFocus.length > 0) {
        localStorage.setItem('focusSessions', JSON.stringify(remoteFocus));
        if (typeof renderHistory === 'function') {
          renderHistory();
        }
      }
    }

    // Refresh Dashboard if active
    if (typeof initDashboard === 'function') {
      initDashboard();
    }
  }

  // Hook into localStorage.setItem to auto-save to MongoDB
  const originalSetItem = localStorage.setItem.bind(localStorage);
  localStorage.setItem = function (key, value) {
    originalSetItem(key, value);

    try {
      if (key === 'studyTasks') {
        const tasks = JSON.parse(value);
        apiFetch('/tasks/sync', {
          method: 'POST',
          body: JSON.stringify({ tasks })
        });
      } else if (key === 'studySubjects') {
        const rawSubs = JSON.parse(value);
        const subjects = rawSubs.map(s => (typeof s === 'string' ? { name: s } : s));
        apiFetch('/subjects/sync', {
          method: 'POST',
          body: JSON.stringify({ subjects })
        });
      } else if (key === 'studyNotes') {
        const notes = JSON.parse(value);
        apiFetch('/notes/sync', {
          method: 'POST',
          body: JSON.stringify({ notes })
        });
      } else if (key === 'examList') {
        const exams = JSON.parse(value);
        apiFetch('/exams/sync', {
          method: 'POST',
          body: JSON.stringify({ exams })
        });
      } else if (key === 'studyPlannerCalendarEvents') {
        const events = JSON.parse(value);
        apiFetch('/calendar/sync', {
          method: 'POST',
          body: JSON.stringify({ events })
        });
      } else if (key === 'focusSessions') {
        const sessions = JSON.parse(value);
        apiFetch('/focus/sync', {
          method: 'POST',
          body: JSON.stringify({ sessions })
        });
      }
    } catch (e) {
      // Quiet fail if offline
    }
  };

  // Run initial sync after DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', syncInitialData);
  } else {
    syncInitialData();
  }
})();
