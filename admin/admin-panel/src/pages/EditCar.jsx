import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import api from '../api/axios';

function EditCar() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await api.get(`/cars/${id}`);
        setCar(response.data.car);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load car');
      }
    };

    fetchCar();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    try {
      await api.put(`/cars/${id}`, car);
      setSuccess('Car updated successfully.');
      setTimeout(() => navigate('/cars'), 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update car');
    }
  };

  if (!car) {
    return (
      <AdminLayout>
        <div className="page-card">
          <h1 className="page-title">Edit Car</h1>
          {error ? <div className="alert">{error}</div> : <p>Loading car details…</p>}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="page-card form-card">
        <h1 className="page-title">Edit Car</h1>
        {error && <div className="alert">{error}</div>}
        {success && <div className="alert">{success}</div>}
        <form onSubmit={handleSubmit} className="form-card">
          <div className="form-field">
            <label htmlFor="name">Model</label>
            <input
              id="name"
              value={car.name || ''}
              onChange={(e) => setCar({ ...car, name: e.target.value })}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="price">Price</label>
            <input
              id="price"
              type="number"
              value={car.price || ''}
              onChange={(e) => setCar({ ...car, price: e.target.value })}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              rows="5"
              value={car.description || ''}
              onChange={(e) => setCar({ ...car, description: e.target.value })}
            />
          </div>
          <button className="button" type="submit">
            Update Car
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}

export default EditCar;
