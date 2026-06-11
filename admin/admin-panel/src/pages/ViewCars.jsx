import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import api from '../api/axios';

function ViewCars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCars = async () => {
      try {
        const response = await api.get('/cars');
        setCars(response.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load cars');
      } finally {
        setLoading(false);
      }
    };

    loadCars();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this car?')) return;

    try {
      await api.delete(`/cars/${id}`);
      setCars((currentCars) => currentCars.filter((car) => car._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete car');
    }
  };

  return (
    <AdminLayout>
      <div className="page-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1 className="page-title">Cars</h1>
          <Link to="/cars/add" className="button">
            Add Car
          </Link>
        </div>
        {loading ? (
          <p>Loading cars…</p>
        ) : error ? (
          <div className="alert">{error}</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Model</th>
                <th>Brand</th>
                <th>Price</th>
                <th>Mileage</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cars.map((car) => (
                <tr key={car._id}>
                  <td>{car.name || car.model || '—'}</td>
                  <td>{car.brand || '—'}</td>
                  <td>{car.price ? `₹${Number(car.price).toLocaleString('en-IN')}` : '—'}</td>
                  <td>{car.mileage || '—'}</td>
                  <td>{car.stock ?? '—'}</td>
                  <td>
                    <Link to={`/cars/edit/${car._id}`} className="button secondary" style={{ marginRight: 8 }}>
                      Edit
                    </Link>
                    <button className="button" onClick={() => handleDelete(car._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}

export default ViewCars;
