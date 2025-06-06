import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Catalog from './pages/Catalog';
import MyCart from './pages/MyCart';
import Login from './pages/Login';
import Register from './pages/Register';
import OrderHistory from './pages/OrderHistory';
import axios from 'axios';

function App() {
  const [dataTransfer, setData] = useState([{}]);
  const [shoppingCart, setShoppingCart] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]); // ✅ Order history state

  useEffect(() => {
    fetch("http://localhost:5000/")
      .then(res => res.json())
      .then(data => {
        setData(data);
        console.log(data);
      });
  }, []);

  return (
    <Router>
      <div style={{ padding: '10px', fontFamily: 'Arial' }}>
        <nav style={{ marginBottom: '20px' }}>
          <Link to="/" style={{ marginRight: '10px' }}>Catalog</Link>
          <Link to="/cart" style={{ marginRight: '10px' }}>My Cart</Link>
          <Link to="/orders" style={{ marginRight: '10px' }}>Order History</Link> {/* ✅ added */}
          <Link to="/history" style={{ marginRight: '10px' }}>Order History</Link>
          <Link to="/login" style={{ marginRight: '10px' }}>Login</Link>
          <Link to="/register">Register</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Catalog shoppingCart={shoppingCart} setShoppingCart={setShoppingCart} />} />
          <Route path="/cart" element={
            <MyCart
              shoppingCart={shoppingCart}
              setShoppingCart={setShoppingCart}
              orderHistory={orderHistory}
              setOrderHistory={setOrderHistory}
            />
          } />
          <Route path="/orders" element={<OrderHistory orderHistory={orderHistory} />} /> {/* ✅ added */}
          <Route path="/history" element={<OrderHistory />} />
          <Route path="/login" element={<Login data={dataTransfer} />} />
          <Route path="/register" element={<Register data={dataTransfer} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
