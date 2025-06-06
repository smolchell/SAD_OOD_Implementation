import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Catalog({ shoppingCart, setShoppingCart, loggedInUser }) {
  const [products, setProducts] = useState([]);

  // Retrieve product list from backend
  useEffect(() => {
    axios.get('http://localhost:5000/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  // Add a given product to the shopping cart
  function addProduct(product_id) {
    console.log("Adding to cart product #", product_id);
    setShoppingCart([...shoppingCart, product_id]);
  }

  // Admin-only: delete product
  function deleteProduct(product_id) {
    axios.delete(`http://localhost:5000/products/${product_id}`)
      .then(() => {
        setProducts(products.filter(p => p.id !== product_id));
      })
      .catch(err => console.error("Delete failed:", err));
  }

  return (
    <div>
      <h1>Catalog</h1>

      {loggedInUser?.role === 'admin' && (
        <button onClick={() => alert("Add product form here")}>+ Add New Product</button>
      )}

      {products.length > 0 ? (
        products.map((product, index) => (
          <div key={index} style={{ border: "1px solid gray", padding: "10px", marginBottom: "10px" }}>
            <h2>{product.name}</h2>
            <img src={product.picture_url} alt={product.name} style={{ width: "200px" }} />
            <p><strong>Price:</strong> ${product.price}</p>
            <p><strong>Description:</strong> {product.description}</p>
            <button onClick={() => addProduct(product.id)}>Add to Cart</button>

            {loggedInUser?.role === 'admin' && (
              <div style={{ marginTop: "10px" }}>
                <button onClick={() => alert(`Edit product #${product.id}`)}>Edit</button>
                <button onClick={() => deleteProduct(product.id)} style={{ marginLeft: "10px" }}>Delete</button>
              </div>
            )}
          </div>
        ))
      ) : (
        <p>Loading products...</p>
      )}
    </div>
  );
}

export default Catalog
