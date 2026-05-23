import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import api from '../api/axios';

function AddCar() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    try {
      await api.post('/cars', { name, price, description });
      setSuccess('Car added successfully.');
      setTimeout(() => navigate('/cars'), 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add car');
    }
  };

  return (
    <AdminLayout>
      <div className="page-card form-card">
        <h1 className="page-title">Add Car</h1>
        {error && <div className="alert">{error}</div>}
        {success && <div className="alert">{success}</div>}
        <form onSubmit={handleSubmit} className="form-card">
          <div className="form-field">
            <label htmlFor="name">Model</label>
            <input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="form-field">
            <label htmlFor="price">Price</label>
            <input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
          </div>
          <div className="form-field">
            <label htmlFor="description">Description</label>
            <textarea id="description" rows="5" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <button className="button" type="submit">
            Save Car
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}

export default AddCar;
