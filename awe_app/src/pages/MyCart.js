import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';

function MyCart({ shoppingCart, setShoppingCart }) {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    address: '',
    paymentMethod: 'Credit Card',
    cardNumber: '',
  });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderHistory, setOrderHistory] = useState([]);

  // Fetch all products from backend
  useEffect(() => {
    axios.get('http://localhost:5000/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  // Delete product from cart
  function deleteProduct(product_id) {
    const updatedCart = shoppingCart.filter(id => id !== product_id);
    setShoppingCart(updatedCart);
  }

  // Get product details from shoppingCart
  const cartItems = shoppingCart
    .map(product_id => products.find(p => p.id === product_id))
    .filter(Boolean); // remove undefined items

  // Calculate total price
  const totalPrice = cartItems.reduce((sum, product) => sum + product.price, 0);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle checkout form submission
  const handleCheckout = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.contact || !formData.address || !formData.cardNumber) {
      alert("Please fill in all required fields.");
      return;
    }

    const orderData = {
      orderId: Math.floor(100000 + Math.random() * 900000),
      customer: formData,
      items: cartItems,
      total: totalPrice,
      time: new Date().toLocaleString(),
    };

    setOrderHistory(prev => [...prev, orderData]);

    // Save order to backend
    axios.post('http://localhost:5000/orders', orderData)
      .then(res => {
        console.log("Order saved to server:", res.data);
        alert(`Order placed successfully!\nInvoice #: ${orderData.orderId}`);
      })
      .catch(err => {
        console.error("Failed to save order:", err);
        alert("There was an issue saving your order. Please try again.");
      });

    console.log("Order placed:", orderData);
    setOrderPlaced(true);
    setShoppingCart([]); // Clear cart
    setFormData({
      name: '',
      contact: '',
      address: '',
      paymentMethod: 'Credit Card',
      cardNumber: '',
    });
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const lastOrder = orderHistory[orderHistory.length - 1];

    doc.setFontSize(16);
    doc.text("🧾 Invoice", 90, 10);
    doc.setFontSize(12);
    doc.text(`Invoice #: ${lastOrder.orderId}`, 20, 20);
    doc.text(`Date: ${lastOrder.time}`, 20, 30);

    doc.text(`Name: ${lastOrder.customer.name}`, 20, 40);
    doc.text(`Contact: ${lastOrder.customer.contact}`, 20, 50);
    doc.text(`Address: ${lastOrder.customer.address}`, 20, 60);
    doc.text(`Payment Method: ${lastOrder.customer.paymentMethod}`, 20, 70);

    doc.text("Items:", 20, 85);
    let y = 95;
    lastOrder.items.forEach((item, i) => {
      doc.text(`${i + 1}. ${item.name} - $${item.price.toFixed(2)}`, 25, y);
      y += 10;
    });

    doc.text(`Total: $${lastOrder.total.toFixed(2)}`, 20, y + 10);

    doc.save(`Invoice_${lastOrder.orderId}.pdf`);
  };

  return (
    <div>
      <h1>My Cart</h1>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        cartItems.map((product, index) => (
          <div key={index} style={{ border: "1px solid gray", padding: "10px", marginBottom: "10px" }}>
            <p>{product.name} : ${product.price}</p>
            <button onClick={() => deleteProduct(product.id)}>Delete</button>
          </div>
        ))
      )}

      {cartItems.length > 0 && (
        <>
          <h2>Total: ${totalPrice.toFixed(2)}</h2>

          <form onSubmit={handleCheckout} style={{ marginTop: "20px", border: "1px solid #ccc", padding: "20px", borderRadius: "8px" }}>
            <h3>Checkout Information</h3>

            <label>Name:<br />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </label>
            <br /><br />

            <label>Contact Number:<br />
              <input
                type="tel"
                name="contact"
                value={formData.contact}
                onChange={handleInputChange}
                required
              />
            </label>
            <br /><br />

            <label>Shipping Address:<br />
              <textarea
                name="address"
                rows="3"
                cols="50"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </label>
            <br /><br />

            <label>Payment Method:<br />
              <select name="paymentMethod" value={formData.paymentMethod} onChange={handleInputChange}>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="PayPal">PayPal</option>
              </select>
            </label>
            <br /><br />

            <label>Card Number:<br />
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                required
              />
            </label>
            <br /><br />

            <button type="submit">Confirm Order</button>
          </form>
        </>
      )}

      {orderPlaced && (
        <div style={{ marginTop: "20px" }}>
          <p style={{ color: "green" }}>✅ Order placed successfully!</p>
          <button onClick={generatePDF} style={{ marginRight: '10px' }}>
            📥 Download the Invoice
          </button>
        </div>
      )}
    </div>
  );
}

export default MyCart;
