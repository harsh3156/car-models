import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import styles from './ViewCars.module.css';

export default function ViewCars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState(null);
  const navigate = useNavigate();

  const fetchCars = async () => {
    try {
      const { data } = await API.get('/cars');
      setCars(Array.isArray(data) ? data : data.cars || []);
    } catch { setCars([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCars(); }, []);

  const deleteCar = async (id) => {
    if (!window.confirm('Delete this car permanently?')) return;
    setDeleting(id);
    try {
      await API.delete(`/cars/${id}`);
      setCars(prev => prev.filter(c => c._id !== id));
    } catch (e) {
      alert(e.response?.data?.message || 'Delete failed');
    } finally { setDeleting(null); }
  };

  const filtered = cars.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.brand?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <input
          className={styles.search}
          placeholder="Search by name or brand..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button className={styles.addBtn} onClick={() => navigate('/cars/add')}>
          + Add New Car
        </button>
      </div>

      {loading ? (
        <div className={styles.grid}>
          {[...Array(6)].map((_, i) => <div key={i} className={`${styles.skeleton} shimmer`} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>◈</div>
          <p>No cars found.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {filtered.map(car => (
            <div key={car._id} className={styles.card}>
              <div className={styles.imgWrap}>
                {car.image ? (
                  <img src={car.image} alt={car.name} className={styles.img} />
                ) : (
                  <div className={styles.imgPlaceholder}>◈</div>
                )}
                <span className={styles.fuelBadge}>{car.fuelType || 'Petrol'}</span>
              </div>
              <div className={styles.info}>
                <div className={styles.brand}>{car.brand || 'Unknown Brand'}</div>
                <h3 className={styles.name}>{car.name}</h3>
                <div className={styles.specs}>
                  {car.year && <span>{car.year}</span>}
                  {car.transmission && <span>{car.transmission}</span>}
                  {car.seats && <span>{car.seats} seats</span>}
                </div>
                <div className={styles.price}>₹{Number(car.price || 0).toLocaleString('en-IN')}</div>
              </div>
              <div className={styles.actions}>
                <button
                  className={styles.editBtn}
                  onClick={() => navigate(`/cars/edit/${car._id}`)}
                >Edit</button>
                <button
                  className={styles.deleteBtn}
                  onClick={() => deleteCar(car._id)}
                  disabled={deleting === car._id}
                >{deleting === car._id ? '...' : 'Delete'}</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
