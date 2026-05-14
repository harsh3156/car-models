import { useEffect, useState } from 'react';
import API from '../api/axios';
import styles from './Users.module.css';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    API.get('/admin/users')
      .then(({ data }) => setUsers(Array.isArray(data) ? data : data.users || []))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, []);

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user permanently?')) return;
    setDeleting(id);
    try {
      await API.delete(`/admin/users/${id}`);
      setUsers(prev => prev.filter(u => u._id !== id));
    } catch { alert('Failed to delete user'); }
    finally { setDeleting(null); }
  };

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const initials = (name = '') => name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() || 'U';
  const colors = ['#6c63ff','#ff6584','#43e97b','#f59e0b','#06b6d4','#ec4899'];
  const colorFor = (i) => colors[i % colors.length];

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <input
          className={styles.search}
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className={styles.count}>{filtered.length} users</div>
      </div>

      {loading ? (
        <div className={styles.grid}>
          {[...Array(8)].map((_, i) => <div key={i} className={`${styles.skeleton} shimmer`} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className={styles.empty}><div className={styles.emptyIcon}>◉</div><p>No users found.</p></div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>User</th><th>Email</th><th>Joined</th><th>Role</th><th>Orders</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <tr key={u._id || i} className={styles.row}>
                  <td>
                    <div className={styles.user}>
                      <div className={styles.avatar} style={{ background: colorFor(i) }}>
                        {initials(u.name)}
                      </div>
                      <div className={styles.name}>{u.name || 'N/A'}</div>
                    </div>
                  </td>
                  <td className={styles.email}>{u.email || 'N/A'}</td>
                  <td className={styles.muted}>{u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN') : 'N/A'}</td>
                  <td>
                    <span className={`${styles.roleBadge} ${u.role === 'admin' ? styles.admin : ''}`}>
                      {u.role || 'user'}
                    </span>
                  </td>
                  <td className={styles.muted}>{u.orderCount ?? u.orders?.length ?? '—'}</td>
                  <td>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => deleteUser(u._id)}
                      disabled={deleting === u._id || u.role === 'admin'}
                    >
                      {deleting === u._id ? '...' : 'Remove'}
                    </button>
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
