import AdminLayout from '../components/AdminLayout';

function Dashboard() {
  return (
    <AdminLayout>
      <div className="page-card">
        <h1 className="page-title">Dashboard</h1>
        <div className="grid-2">
          <section className="page-card">
            <h2>Active metrics</h2>
            <p>Manage cars, orders, and users from the admin dashboard.</p>
          </section>
          <section className="page-card">
            <h2>Quick actions</h2>
            <p>Use the sidebar to navigate to users, orders, and car inventory.</p>
          </section>
        </div>
      </div>
    </AdminLayout>
  );
}

export default Dashboard;
