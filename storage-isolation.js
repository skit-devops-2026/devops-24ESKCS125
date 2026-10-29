/*
 * Keep each account's browser-side planner data separate.
 * Authentication keys remain global; planner data keys are namespaced by email.
 */
(function () {
  const rawGet = Storage.prototype.getItem;
  const rawSet = Storage.prototype.setItem;
  const rawRemove = Storage.prototype.removeItem;
  const rawClear = Storage.prototype.clear;
  const GLOBAL_KEYS = new Set(['currentUser', 'studyUsers']);
  const DATA_KEYS = new Set([
    'studyTasks', 'studySubjects', 'studyNotes', 'examList',
    'studyPlannerCalendarEvents', 'focusSessions', 'dailyFocusGoal',
    'studySettings', 'userSettings', 'selectedSubject', 'streakData', 'theme'
  ]);

  function accountEmail() {
    try {
      const user = JSON.parse(rawGet.call(localStorage, 'currentUser') || 'null');
      return user && user.email ? String(user.email).trim().toLowerCase() : '';
    } catch (_) { return ''; }
  }
  function scopedKey(key) {
    if (GLOBAL_KEYS.has(key) || (!DATA_KEYS.has(key) && !key.startsWith('topics_'))) return key;
    const email = accountEmail();
    return email ? `account:${encodeURIComponent(email)}:${key}` : key;
  }

  Storage.prototype.getItem = function (key) {
    return rawGet.call(this, scopedKey(String(key)));
  };
  Storage.prototype.setItem = function (key, value) {
    return rawSet.call(this, scopedKey(String(key)), value);
  };
  Storage.prototype.removeItem = function (key) {
    return rawRemove.call(this, scopedKey(String(key)));
  };

  // Logging out must clear the active account, but never another user's data.
  document.addEventListener('click', function (event) {
    const link = event.target.closest('a[href]');
    if (link && /(?:^|\/)landing\.html(?:[?#]|$)/i.test(link.getAttribute('href'))) {
      rawRemove.call(localStorage, 'currentUser');
    }
  });
})();
