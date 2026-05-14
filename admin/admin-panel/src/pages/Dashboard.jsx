import { useEffect, useState } from 'react';
import API from '../api/axios';
import styles from './Dashboard.module.css';

const StatCard = ({ label, value, icon, color, sub }) => (
  <div className={styles.statCard} style={{ '--c': color }}>
    <div className={styles.statIcon}>{icon}</div>
    <div className={styles.statInfo}>
      <div className={styles.statValue}>{value ?? '—'}</div>
      <div className={styles.statLabel}>{label}</div>
      {sub && <div className={styles.statSub}>{sub}</div>}
    </div>
    <div className={styles.statGlow} />
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get('/admin/stats').catch(() => ({ data: { totalCars: 0, totalOrders: 0, totalUsers: 0, revenue: 0 } })),
      API.get('/orders?limit=5').catch(() => ({ data: [] })),
    ]).then(([statsRes, ordersRes]) => {
      setStats(statsRes.data);
      setRecentOrders(Array.isArray(ordersRes.data) ? ordersRes.data.slice(0, 5) : []);
    }).finally(() => setLoading(false));
  }, []);

  const statusColor = { pending: '#f59e0b', confirmed: '#6c63ff', delivered: '#43e97b', cancelled: '#ff6584' };

  return (
    <div className={styles.page}>
      <div className={styles.statsGrid}>
        <StatCard label="Total Cars" value={stats?.totalCars} icon="◈" color="#6c63ff" sub="In inventory" />
        <StatCard label="Total Orders" value={stats?.totalOrders} icon="◎" color="#ff6584" sub="All time" />
        <StatCard label="Registered Users" value={stats?.totalUsers} icon="◉" color="#43e97b" sub="Active accounts" />
        <StatCard label="Revenue" value={stats?.revenue ? `₹${Number(stats.revenue).toLocaleString('en-IN')}` : '₹0'} icon="⬡" color="#f59e0b" sub="Total earnings" />
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Recent Orders</h2>
          <a href="/orders" className={styles.viewAll}>View all →</a>
        </div>

        {loading ? (
          <div className={styles.tableWrap}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className={`${styles.skeletonRow} shimmer`} />
            ))}
          </div>
        ) : recentOrders.length === 0 ? (
          <div className={styles.empty}>No orders yet.</div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Order ID</th><th>Customer</th><th>Car</th><th>Amount</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o, i) => (
                  <tr key={o._id || i} className={styles.row}>
                    <td className={styles.id}>#{(o._id || i).toString().slice(-6).toUpperCase()}</td>
                    <td>{o.user?.name || o.userName || 'N/A'}</td>
                    <td>{o.car?.name || o.carName || 'N/A'}</td>
                    <td>₹{Number(o.totalAmount || 0).toLocaleString('en-IN')}</td>
                    <td>
                      <span className={styles.badge} style={{ '--bc': statusColor[o.status] || '#8888aa' }}>
                        {o.status || 'pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
