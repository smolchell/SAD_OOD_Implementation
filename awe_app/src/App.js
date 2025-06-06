import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import Catalog from './pages/Catalog';
import MyCart from './pages/MyCart';
import Login from './pages/Login';
import Register from './pages/Register';
import OrderHistory from './pages/OrderHistory';

function App() {
  const [shoppingCart, setShoppingCart] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(
    JSON.parse(localStorage.getItem('loggedInUser')) || null
  );

  // Sync logged-in user to localStorage
  useEffect(() => {
    if (loggedInUser) {
      localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
    } else {
      localStorage.removeItem('loggedInUser');
    }
  }, [loggedInUser]);

  // Logout handler
  const handleLogout = () => {
    setLoggedInUser(null);
    alert('You have been logged out.');
  };

  return (
    <Router>
      <div style={{ padding: '10px', fontFamily: 'Arial' }}>
        <nav style={{ marginBottom: '20px' }}>
          <Link to="/" style={{ marginRight: '10px' }}>Catalog</Link>
          <Link to="/cart" style={{ marginRight: '10px' }}>My Cart</Link>
          <Link to="/history" style={{ marginRight: '10px' }}>Order History</Link>

          {loggedInUser ? (
            <>
              <span style={{ marginLeft: '20px', marginRight: '10px' }}>👤 {loggedInUser.name}</span>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ marginRight: '10px' }}>Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>

        <Routes>
          <Route
            path="/"
            element={<Catalog shoppingCart={shoppingCart} setShoppingCart={setShoppingCart} />}
          />

          <Route
            path="/cart"
            element={
              loggedInUser ? (
                <MyCart
                  shoppingCart={shoppingCart}
                  setShoppingCart={setShoppingCart}
                  orderHistory={orderHistory}
                  setOrderHistory={setOrderHistory}
                  user={loggedInUser}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/history"
            element={
              loggedInUser ? (
                <OrderHistory orderHistory={orderHistory} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/login"
            element={<Login setLoggedInUser={setLoggedInUser} />}
          />

          <Route
            path="/register"
            element={<Register setLoggedInUser={setLoggedInUser} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
