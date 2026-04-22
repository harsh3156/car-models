import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div
      style={{
        width: "200px",
        background: "#f2f2f2",
        height: "100vh",
        padding: "20px",
      }}
    >
      <h3>Menu</h3>

      <ul style={{ listStyle: "none", padding: 0 }}>

        <li>
          <Link to="/">Dashboard</Link>
        </li>

        <li>
          <Link to="/add-product">Add Product</Link>
        </li>

        <li>
          <Link to="/view-product">View Product</Link>
        </li>

      </ul>
    </div>
  );
}

export default Sidebar;