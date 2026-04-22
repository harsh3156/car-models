import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import AddProduct from "./pages/AddProduct";
import ViewProduct from "./pages/ViewProduct";

function App() {
  return (
    <Router>

      <Navbar />

      <div style={{ display: "flex" }}>
        <Sidebar />

        <div style={{ padding: "20px", width: "100%" }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/view-product" element={<ViewProduct />} />
          </Routes>
        </div>

      </div>

    </Router>
  );
}

export default App;