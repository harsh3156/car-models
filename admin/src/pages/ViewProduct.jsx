import { useEffect, useState } from "react";

function ViewProduct() {

  const [products, setProducts] = useState([]);

  useEffect(() => {

    const stored =
      JSON.parse(localStorage.getItem("products")) || [];

    setProducts(stored);

  }, []);

  const deleteProduct = (index) => {

    let updated = [...products];

    updated.splice(index, 1);

    localStorage.setItem("products", JSON.stringify(updated));

    setProducts(updated);
  };

  return (
    <div>

      <h2>Product List</h2>

      <table border="1" cellPadding="10">

        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

          {products.map((p, i) => (
            <tr key={i}>
              <td>{p.name}</td>
              <td>{p.price}</td>

              <td>
                <button onClick={() => deleteProduct(i)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
}

export default ViewProduct;