import React, { useEffect, useState } from 'react';
import axios from 'axios';

function OrderHistory() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/orders')
      .then(res => setOrders(res.data))
      .catch(err => console.error("Failed to fetch order history:", err));
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>🧾 Order History</h1>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        orders.map((order, idx) => (
          <div key={idx} style={{ border: '1px solid #ccc', marginBottom: '20px', padding: '10px' }}>
            <p><strong>Invoice #:</strong> {order.orderId}</p>
            <p><strong>Date:</strong> {order.time}</p>
            <p><strong>Name:</strong> {order.customer.name}</p>
            <p><strong>Contact:</strong> {order.customer.contact}</p>
            <p><strong>Address:</strong> {order.customer.address}</p>
            <p><strong>Payment:</strong> {order.customer.paymentMethod}</p>
            <h4>Items:</h4>
            <ul>
              {order.items.map((item, i) => (
                <li key={i}>{item.name} - ${item.price.toFixed(2)}</li>
              ))}
            </ul>
            <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default OrderHistory;
