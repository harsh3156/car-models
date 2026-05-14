import { useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';

const titles = {
  '/dashboard': 'Dashboard',
  '/cars': 'Vehicle Inventory',
  '/cars/add': 'Add New Car',
  '/orders': 'Orders',
  '/users': 'User Management',
};

export default function Navbar() {
  const { pathname } = useLocation();
  const base = '/' + pathname.split('/')[1];
  const title = pathname.startsWith('/cars/edit') ? 'Edit Car' : (titles[pathname] || titles[base] || 'Admin');

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <header className={styles.navbar}>
      <div>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.date}>{dateStr}</p>
      </div>
      <div className={styles.right}>
        <div className={styles.search}>
          <span className={styles.searchIcon}>⌕</span>
          <input placeholder="Search anything..." className={styles.searchInput} />
        </div>
        <div className={styles.notif}>
          <span>🔔</span>
          <span className={styles.badge}>3</span>
        </div>
        <div className={styles.userBadge}>
          <div className={styles.dot} />
          <span>Live</span>
        </div>
      </div>
    </header>
  );
}
