import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import styles from './Login.module.css';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await API.post('/admin/login', form);
      localStorage.setItem('adminToken', data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
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
      <div className={styles.card}>
        <div className={styles.cardTop}>
          <div className={styles.logo}>A</div>
          <h1 className={styles.heading}>LOGIN PAGE</h1>
          <p className={styles.sub}>WELCOME TO HARSH ERA</p>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}
          <div className={styles.field}>
            <label className={styles.label}>Email Address</label>
            <input
              type="email"
              className={styles.input}
              placeholder="ENTER EMAIL ID "
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <input
              type="password"
              className={styles.input}
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button className={styles.btn} disabled={loading} type="submit">
            {loading ? <span className={styles.spinner} /> : 'Sign In →'}
          </button>
        </form>
        <p className={styles.footer}>Secure Access Only</p>
        <p1 className={styles.footer}>DONT COOKED YOUR MIND AND STAY PRIVATE YOUR GROWTH</p1>
      </div>


    </div>
  );
}
