import React, { useEffect, useState } from 'react'
import axios from 'axios'

function Home({shoppingCart, setShoppingCart}) {
  const [products, setProducts] = useState([]);
  
  // Retrieve product list from backend
  useEffect(() => {
    axios.get('http://localhost:5000/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  // Add a given product to the shopping user's shopping cart.
  function addProduct(product_id){
    console.log("Adding to cart product #", product_id);
    setShoppingCart([...shoppingCart, product_id]);
  }

  return (
    <div>
      <h1>Catalog</h1>
      {products.length > 0 ? (
        products.map((product, index) => (
          <div key={index} style={{ border: "1px solid gray", padding: "10px", marginBottom: "10px" }}>
            <h2>{product.name}</h2>
            <img src={product.picture_url} alt={product.name} style={{ width: "200px" }} />
            <p><strong>Price:</strong> ${product.price}</p>
            <p><strong>Description:</strong> {product.description}</p>
            <button onClick={() => addProduct(product.id)}>Add to Cart</button>
          </div>
        ))
      ) : (
        <p>Loading products...</p>
      )}
    </div>
  );
}

export default Home;