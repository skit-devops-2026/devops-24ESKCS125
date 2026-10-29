// API service with token authentication and automatic localStorage fallback
const API_BASE = '/api';

export const getAuthToken = () => localStorage.getItem('study_planner_token');
export const setAuthToken = (token) => {
  if (token) localStorage.setItem('study_planner_token', token);
  else localStorage.removeItem('study_planner_token');
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('study_planner_user');
  try {
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

export const setCurrentUser = (user) => {
  if (user) localStorage.setItem('study_planner_user', JSON.stringify(user));
  else localStorage.removeItem('study_planner_user');
};

const getHeaders = () => {
  const token = getAuthToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['x-auth-token'] = token;
  return headers;
};

// Generic Fetch with Fallback
async function apiRequest(endpoint, options = {}, fallbackKey = null) {
  const user = getCurrentUser();
  const storageKey = user && user.email ? `${user.email}_${fallbackKey}` : fallbackKey;

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: { ...getHeaders(), ...(options.headers || {}) }
    });

    if (res.ok) {
      const data = await res.json();
      if (fallbackKey && Array.isArray(data) && options.method !== 'POST') {
        localStorage.setItem(storageKey, JSON.stringify(data));
      }
      return data;
    }
  } catch (err) {
    console.warn(`API call ${endpoint} failed, falling back to localStorage:`, err.message);
  }

  // LocalStorage Fallback logic
  if (fallbackKey) {
    const localData = localStorage.getItem(storageKey);
    return localData ? JSON.parse(localData) : [];
  }
  return null;
}

// Auth API
export const authAPI = {
  async login(email, password) {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      setAuthToken(data.token);
      setCurrentUser(data.user);
      return data;
    } catch (err) {
      // Local fallback for offline/demo accounts
      const localUsers = JSON.parse(localStorage.getItem('study_planner_users') || '[]');
      const found = localUsers.find(u => u.email === email && u.password === password);
      if (found) {
        const dummyToken = 'local_token_' + Date.now();
        const userObj = { name: found.name, email: found.email };
        setAuthToken(dummyToken);
        setCurrentUser(userObj);
        return { token: dummyToken, user: userObj };
      }
      throw err;
    }
  },

  async signup(name, email, password) {
    try {
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Signup failed');
      setAuthToken(data.token);
      setCurrentUser(data.user);
      return data;
    } catch (err) {
      // Local fallback
      const localUsers = JSON.parse(localStorage.getItem('study_planner_users') || '[]');
      if (localUsers.some(u => u.email === email)) {
        throw new Error('An account with this email already exists.');
      }
      localUsers.push({ name, email, password });
      localStorage.setItem('study_planner_users', JSON.stringify(localUsers));
      const dummyToken = 'local_token_' + Date.now();
      const userObj = { name, email };
      setAuthToken(dummyToken);
      setCurrentUser(userObj);
      return { token: dummyToken, user: userObj };
    }
  },

  logout() {
    setAuthToken(null);
    setCurrentUser(null);
  }
};

// Tasks API
export const taskAPI = {
  getTasks: () => apiRequest('/tasks', { method: 'GET' }, 'tasks'),
  async saveTasks(tasks) {
    const user = getCurrentUser();
    const storageKey = user && user.email ? `${user.email}_tasks` : 'tasks';
    localStorage.setItem(storageKey, JSON.stringify(tasks));
    try {
      await fetch(`${API_BASE}/tasks/sync`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ tasks })
      });
    } catch (e) {}
  }
};

// Subjects API
export const subjectAPI = {
  getSubjects: () => apiRequest('/subjects', { method: 'GET' }, 'subjects'),
  async saveSubjects(subjects) {
    const user = getCurrentUser();
    const storageKey = user && user.email ? `${user.email}_subjects` : 'subjects';
    localStorage.setItem(storageKey, JSON.stringify(subjects));
    try {
      await fetch(`${API_BASE}/subjects/sync`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ subjects })
      });
    } catch (e) {}
  }
};

// Notes API
export const noteAPI = {
  getNotes: () => apiRequest('/notes', { method: 'GET' }, 'notes'),
  async saveNotes(notes) {
    const user = getCurrentUser();
    const storageKey = user && user.email ? `${user.email}_notes` : 'notes';
    localStorage.setItem(storageKey, JSON.stringify(notes));
    try {
      await fetch(`${API_BASE}/notes/sync`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ notes })
      });
    } catch (e) {}
  }
};

// Exams API
export const examAPI = {
  getExams: () => apiRequest('/exams', { method: 'GET' }, 'exams'),
  async saveExams(exams) {
    const user = getCurrentUser();
    const storageKey = user && user.email ? `${user.email}_exams` : 'exams';
    localStorage.setItem(storageKey, JSON.stringify(exams));
    try {
      await fetch(`${API_BASE}/exams/sync`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ exams })
      });
    } catch (e) {}
  }
};

// Calendar API
export const calendarAPI = {
  getEvents: () => apiRequest('/calendar', { method: 'GET' }, 'calendarEvents'),
  async saveEvents(events) {
    const user = getCurrentUser();
    const storageKey = user && user.email ? `${user.email}_calendarEvents` : 'calendarEvents';
    localStorage.setItem(storageKey, JSON.stringify(events));
    try {
      await fetch(`${API_BASE}/calendar/sync`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ events })
      });
    } catch (e) {}
  }
};

// Focus API
export const focusAPI = {
  getSessions: () => apiRequest('/focus', { method: 'GET' }, 'focusSessions'),
  async saveSessions(sessions) {
    const user = getCurrentUser();
    const storageKey = user && user.email ? `${user.email}_focusSessions` : 'focusSessions';
    localStorage.setItem(storageKey, JSON.stringify(sessions));
    try {
      await fetch(`${API_BASE}/focus/sync`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ sessions })
      });
    } catch (e) {}
  }
};
