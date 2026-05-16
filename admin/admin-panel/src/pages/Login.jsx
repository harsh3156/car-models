import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import styles from './Login.module.css';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const resetForm = () => {
    setForm({ email: '', password: '', confirmPassword: '' });
    setError('');
    setSuccess('');
  };

  const toggleMode = () => {
    resetForm();
    setIsRegister((prev) => !prev);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await API.post('/admin/login', {
        email: form.email,
        password: form.password,
      });
      localStorage.setItem('adminToken', data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await API.post('/register', {
        email: form.email,
        password: form.password,
      });
      setSuccess('Account created successfully! You can now sign in.');
      resetForm();
      setTimeout(() => {
        setIsRegister(false);
        setSuccess('');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.bg}>
        <div className={styles.glow1} />
        <div className={styles.glow2} />
      </div>
      <div className={`${styles.card} ${isRegister ? styles.cardRegister : ''}`}>
        <div className={styles.cardTop}>
          <div className={styles.logo}>{isRegister ? 'R' : 'A'}</div>
          <h1 className={styles.heading}>
            {isRegister ? 'CREATE ACCOUNT' : 'LOGIN PAGE'}
          </h1>
          <p className={styles.sub}>
            {isRegister ? 'Register a new account' : 'WELCOME TO HARSH ERA'}
          </p>
        </div>

        <form
          onSubmit={isRegister ? handleRegister : handleLogin}
          className={styles.form}
        >
          {error && <div className={styles.error}>{error}</div>}
          {success && <div className={styles.success}>{success}</div>}

          {/* Email Field */}
          <div className={styles.field}>
            <label className={styles.label}>Email Address</label>
            <input
              type="email"
              className={styles.input}
              placeholder="ENTER EMAIL ID"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          {/* Password Field */}
          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <input
              type="password"
              className={styles.input}
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          {/* Confirm Password (Register only) */}
          {isRegister && (
            <div className={`${styles.field} ${styles.fadeIn}`}>
              <label className={styles.label}>Confirm Password</label>
              <input
                type="password"
                className={styles.input}
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
                required
              />
            </div>
          )}

          {/* Submit Button */}
          <button className={styles.btn} disabled={loading} type="submit">
            {loading ? (
              <span className={styles.spinner} />
            ) : isRegister ? (
              'Create Account →'
            ) : (
              'Sign In →'
            )}
          </button>
        </form>

        {/* Toggle between Login / Register */}
        <div className={styles.toggleWrap}>
          <p className={styles.toggleText}>
            {isRegister ? 'Already have an account?' : "Don't have an account?"}
          </p>
          <button
            type="button"
            className={styles.toggleBtn}
            onClick={toggleMode}
          >
            {isRegister ? 'Sign In' : 'Register'}
          </button>
        </div>

        <p className={styles.footer}>Secure Access Only</p>
        <p className={styles.footer}>
          DONT COOKED YOUR MIND AND STAY PRIVATE YOUR GROWTH
        </p>
      </div>
    </div>
  );
}
