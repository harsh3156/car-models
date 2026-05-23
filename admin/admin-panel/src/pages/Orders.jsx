import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import api from '../api/axios';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await api.get('/orders');
        setOrders(response.data.orders || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  return (
    <AdminLayout>
      <div className="page-card">
        <h1 className="page-title">Orders</h1>
        {loading ? (
          <p>Loading orders…</p>
        ) : error ? (
          <div className="alert">{error}</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Tracking ID</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order.trackingId || '—'}</td>
                  <td>{order.user?.name || order.user?.email || '—'}</td>
                  <td>{order.status || 'pending'}</td>
                  <td>{order.totalPrice ? `$${order.totalPrice.toFixed(2)}` : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}

export default Orders;
