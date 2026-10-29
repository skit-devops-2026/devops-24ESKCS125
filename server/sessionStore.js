const crypto = require('crypto');
const sessions = new Map();
function createSession(email) {
  const token = crypto.randomBytes(32).toString('hex');
  sessions.set(token, String(email).trim().toLowerCase());
  return token;
}
function getEmail(token) { return token ? sessions.get(token) || null : null; }
function revokeSession(token) { if (token) sessions.delete(token); }
module.exports = { createSession, getEmail, revokeSession };
