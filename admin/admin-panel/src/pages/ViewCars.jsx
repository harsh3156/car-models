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
        setCars(response.data.cars || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load cars');
      } finally {
        setLoading(false);
      }
    };

    loadCars();
  }, []);

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
                <th>Price</th>
                <th>Mileage</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cars.map((car) => (
                <tr key={car._id}>
                  <td>{car.name || car.model || '—'}</td>
                  <td>{car.price ? `$${car.price}` : '—'}</td>
                  <td>{car.mileage || '—'}</td>
                  <td>
                    <Link to={`/cars/edit/${car._id}`} className="button secondary">
                      Edit
                    </Link>
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
