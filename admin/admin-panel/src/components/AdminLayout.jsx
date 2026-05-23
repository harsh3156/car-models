import Navbar from './Navbar';
import Sidebar from './Sidebar';

function AdminLayout({ children }) {
  return (
    <div className="page-layout">
      <Sidebar />
      <div>
        <Navbar />
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}

export default AdminLayout;
