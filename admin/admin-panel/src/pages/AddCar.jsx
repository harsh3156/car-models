import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import api from '../api/axios';

function AddCar() {
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('BMW');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [fuelType, setFuelType] = useState('Petrol');
  const [modelYear, setModelYear] = useState(new Date().getFullYear());
  const [transmission, setTransmission] = useState('Automatic');
  const [mileage, setMileage] = useState('');
  const [stock, setStock] = useState('1');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    try {
      await api.post('/cars', {
        name,
        brand,
        price: Number(price),
        image: image || 'https://via.placeholder.com/600x320?text=Car+World',
        description,
        fuelType,
        modelYear: Number(modelYear),
        transmission,
        mileage,
        stock: Number(stock),
      });
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
            <label htmlFor="brand">Brand</label>
            <input id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} required />
          </div>
          <div className="form-field">
            <label htmlFor="price">Price</label>
            <input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
          </div>
          <div className="form-field">
            <label htmlFor="image">Image URL</label>
            <input id="image" value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://..." />
          </div>
          <div className="form-field">
            <label htmlFor="fuelType">Fuel Type</label>
            <select id="fuelType" value={fuelType} onChange={(e) => setFuelType(e.target.value)}>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="modelYear">Model Year</label>
            <input id="modelYear" type="number" value={modelYear} onChange={(e) => setModelYear(e.target.value)} required />
          </div>
          <div className="form-field">
            <label htmlFor="transmission">Transmission</label>
            <select id="transmission" value={transmission} onChange={(e) => setTransmission(e.target.value)}>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="mileage">Mileage</label>
            <input id="mileage" value={mileage} onChange={(e) => setMileage(e.target.value)} placeholder="12 km/l" />
          </div>
          <div className="form-field">
            <label htmlFor="stock">Stock</label>
            <input id="stock" type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)} />
          </div>
          <div className="form-field">
            <label htmlFor="description">Description</label>
            <textarea id="description" rows="5" value={description} onChange={(e) => setDescription(e.target.value)} required />
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
