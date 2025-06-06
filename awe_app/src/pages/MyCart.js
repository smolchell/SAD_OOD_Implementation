import React, { useEffect, useState } from 'react';
import axios from 'axios';

function MyCart({ shoppingCart, setShoppingCart }) {
  const [products, setProducts] = useState([]);

  // Retrieve product list from backend
  useEffect(() => {
    axios.get('http://localhost:5000/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  function deleteProduct(product_id) {
    const updatedCart = shoppingCart.filter(id => id !== product_id);
    setShoppingCart(updatedCart);
  }

  return (
    <div>
      <h1>My Cart</h1>

      {shoppingCart.map((product_id, index) => {
        const match = products.find(product => product.id === product_id);

        return (
          <div key={index} style={{ border: "1px solid gray", padding: "10px", marginBottom: "10px" }}>
            {match ? (
              <>
                <p>{match.name} : ${match.price}</p>
                {/* <img src={match.picture_url} alt={match.name} style={{ width: "200px" }} /> */}
              </>
            ) : (
              <p>Product ID {product_id} not found</p>
            )}
            <button onClick={() => deleteProduct(product_id)}>Delete</button>
          </div>
        );
      })}
    </div>
  );
}

export default MyCart;
