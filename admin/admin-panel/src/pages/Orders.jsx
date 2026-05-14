import { useEffect, useState } from 'react';
import API from '../api/axios';
import styles from './Orders.module.css';

const STATUS_OPTS = ['all','pending','confirmed','delivered','cancelled'];
const STATUS_COLOR = { pending:'#f59e0b', confirmed:'#6c63ff', delivered:'#43e97b', cancelled:'#ff6584' };

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    API.get('/orders')
      .then(({ data }) => setOrders(Array.isArray(data) ? data : data.orders || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    setUpdating(id);
    try {
      await API.put(`/orders/${id}`, { status });
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o));
    } catch { alert('Failed to update status'); }
    finally { setUpdating(null); }
  };

  const shown = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  return (
    <div className={styles.page}>
      <div className={styles.filters}>
        {STATUS_OPTS.map(s => (
          <button
            key={s}
            className={`${styles.filterBtn} ${filter === s ? styles.active : ''}`}
            onClick={() => setFilter(s)}
            style={filter === s && s !== 'all' ? { '--fc': STATUS_COLOR[s] } : {}}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div>{[...Array(5)].map((_, i) => <div key={i} className={`${styles.skeleton} shimmer`} />)}</div>
      ) : shown.length === 0 ? (
        <div className={styles.empty}><div className={styles.emptyIcon}>◎</div><p>No orders found.</p></div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order ID</th><th>Customer</th><th>Car</th><th>Date</th><th>Amount</th><th>Status</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((o, i) => (
                <tr key={o._id || i} className={styles.row}>
                  <td className={styles.id}>#{(o._id || i).toString().slice(-6).toUpperCase()}</td>
                  <td>
                    <div className={styles.customer}>
                      <div className={styles.avatar}>{(o.user?.name || o.userName || 'U')[0].toUpperCase()}</div>
                      <div>
                        <div>{o.user?.name || o.userName || 'N/A'}</div>
                        <div className={styles.email}>{o.user?.email || o.userEmail || ''}</div>
                      </div>
                    </div>
                  </td>
                  <td>{o.car?.name || o.carName || 'N/A'}</td>
                  <td className={styles.date}>{o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-IN') : 'N/A'}</td>
                  <td className={styles.amount}>₹{Number(o.totalAmount || 0).toLocaleString('en-IN')}</td>
                  <td>
                    <span className={styles.badge} style={{ '--bc': STATUS_COLOR[o.status] || '#8888aa' }}>
                      {o.status || 'pending'}
                    </span>
                  </td>
                  <td>
                    <select
                      className={styles.select}
                      value={o.status || 'pending'}
                      onChange={e => updateStatus(o._id, e.target.value)}
                      disabled={updating === o._id}
                    >
                      {['pending','confirmed','delivered','cancelled'].map(s => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
