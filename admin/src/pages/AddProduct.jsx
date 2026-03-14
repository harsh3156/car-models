import { useState } from "react";

function AddProduct() {

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const addProduct = () => {

    const product = { name, price };

    const oldProducts =
      JSON.parse(localStorage.getItem("products")) || [];

    oldProducts.push(product);

    localStorage.setItem("products", JSON.stringify(oldProducts));

    alert("Product Added");

    setName("");
    setPrice("");
  };

  return (
    <div>

      <h2>Add Product</h2>

      <input
        type="text"
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <br /><br />

      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <br /><br />

      <button onClick={addProduct}>
        Add Product
      </button>

    </div>
  );
}

export default AddProduct;