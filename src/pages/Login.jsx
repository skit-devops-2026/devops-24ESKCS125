import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/auth.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    const user = { name: email.split('@')[0], email };
    localStorage.setItem('currentUser', JSON.stringify(user));
    navigate('/dashboard');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <Link to="/" className="auth-title">
          📚 Study Planner
        </Link>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-label">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="auth-input"
            required
          />

          <label className="auth-label">Password</label>
          <div className="auth-password-wrapper">
            <input
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="auth-input"
              required
            />
            <span
              onClick={() => setShowPass(!showPass)}
              className="auth-toggle-pass"
            >
              {showPass ? '🙈' : '👁️'}
            </span>
          </div>

          <button type="submit" className="auth-btn">
            Login
          </button>

          <p className="auth-footer">
            Don't have an account?{' '}
            <Link to="/signup" className="auth-link">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
