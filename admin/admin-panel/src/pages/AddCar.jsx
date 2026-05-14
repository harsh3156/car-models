import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import styles from './CarForm.module.css';

const INIT = { name:'', brand:'', price:'', year:'', fuelType:'Petrol', transmission:'Automatic', seats:'', description:'', image:'' };

export default function AddCar() {
  const [form, setForm] = useState(INIT);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess('');
    try {
      await API.post('/cars', { ...form, price: Number(form.price), year: Number(form.year), seats: Number(form.seats) });
      setSuccess('Car added successfully!');
      setTimeout(() => navigate('/cars'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add car.');
    } finally { setLoading(false); }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className={styles.grid}>
            <div className={styles.field}>
              <label className={styles.label}>Car Name *</label>
              <input className={styles.input} value={form.name} onChange={set('name')} placeholder="e.g. Model S" required />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Brand *</label>
              <input className={styles.input} value={form.brand} onChange={set('brand')} placeholder="e.g. Tesla" required />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Price (₹) *</label>
              <input className={styles.input} type="number" value={form.price} onChange={set('price')} placeholder="e.g. 8500000" required min="0" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Year *</label>
              <input className={styles.input} type="number" value={form.year} onChange={set('year')} placeholder="e.g. 2024" required min="2000" max="2030" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Fuel Type</label>
              <select className={styles.select} value={form.fuelType} onChange={set('fuelType')}>
                {['Petrol','Diesel','Electric','Hybrid','CNG'].map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Transmission</label>
              <select className={styles.select} value={form.transmission} onChange={set('transmission')}>
                {['Automatic','Manual'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Seats</label>
              <input className={styles.input} type="number" value={form.seats} onChange={set('seats')} placeholder="e.g. 5" min="1" max="10" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Image URL</label>
              <input className={styles.input} value={form.image} onChange={set('image')} placeholder="https://..." />
            </div>
            <div className={`${styles.field} ${styles.fullWidth}`}>
              <label className={styles.label}>Description</label>
              <textarea className={styles.textarea} value={form.description} onChange={set('description')} placeholder="Car description..." />
            </div>
          </div>
          <div className={styles.footer}>
            <button type="button" className={styles.cancelBtn} onClick={() => navigate('/cars')}>Cancel</button>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Adding...' : 'Add Car →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
