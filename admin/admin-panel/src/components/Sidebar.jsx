import { NavLink, useNavigate } from 'react-router-dom';
import styles from './Sidebar.module.css';

const nav = [
  { to: '/dashboard', icon: '⬡', label: 'Dashboard' },
  { to: '/cars', icon: '◈', label: 'View Cars' },
  { to: '/cars/add', icon: '⊕', label: 'Add Car' },
  { to: '/orders', icon: '◎', label: 'Orders' },
  { to: '/users', icon: '◉', label: 'Users' },
];

export default function Sidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <div className={styles.logo}>
          <span>A</span>
        </div>
        <div>
          <div className={styles.brandName}>Antigravity</div>
          <div className={styles.brandSub}>Admin Panel</div>
        </div>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Main Menu</span>
        <nav className={styles.nav}>
          {nav.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ''}`
              }
            >
              <span className={styles.icon}>{icon}</span>
              <span>{label}</span>
              <span className={styles.arrow}>›</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className={styles.bottom}>
        <div className={styles.adminCard}>
          <div className={styles.avatar}>AD</div>
          <div>
            <div className={styles.adminName}>Admin</div>
            <div className={styles.adminRole}>Super Admin</div>
          </div>
        </div>
        <button className={styles.logout} onClick={logout}>
          <span>⏻</span> Logout
        </button>
      </div>
    </aside>
  );
}
