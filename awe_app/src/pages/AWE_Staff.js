import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AWE_Staff({ user }) {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '' });
  const [editingProductId, setEditingProductId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', price: '' });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    axios.get('http://localhost:5000/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  };

  const handleAddChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const addProduct = () => {
    if (!newProduct.name || !newProduct.price) return alert("Fill out all fields");
    axios.post('http://localhost:5000/products', newProduct)
      .then(() => {
        fetchProducts();
        setNewProduct({ name: '', price: '' });
      })
      .catch(err => alert("Failed to add product"));
  };

  const deleteProduct = (id) => {
    axios.delete(`http://localhost:5000/products/${id}`)
      .then(() => fetchProducts())
      .catch(err => alert("Failed to delete product"));
  };

  const startEdit = (product) => {
    setEditingProductId(product.id);
    setEditForm({ name: product.name, price: product.price });
  };

  const saveEdit = () => {
    axios.put(`http://localhost:5000/products/${editingProductId}`, editForm)
      .then(() => {
        fetchProducts();
        setEditingProductId(null);
      })
      .catch(err => alert("Failed to update product"));
  };

  if (user?.role !== 'staff') {
    return <p>❌ Access Denied. Staff only.</p>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>🛠️ AWE Staff Product Management</h2>
      <p>Logged in as: <strong>{user.email}</strong> ({user.role})</p>

      <div style={{ marginBottom: '20px' }}>
        <h3>Add New Product</h3>
        <input
          type="text"
          name="name"
          placeholder="Product name"
          value={newProduct.name}
          onChange={handleAddChange}
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={newProduct.price}
          onChange={handleAddChange}
          min="0"
        />
        <button onClick={addProduct}>Add</button>
      </div>

      <h3>Catalog</h3>
      <table border="1" cellPadding="8" style={{ width: '100%', textAlign: 'left' }}>
        <thead>
          <tr>
            <th>Name</th><th>Price</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td>
                {editingProductId === p.id ? (
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleEditChange}
                  />
                ) : (
                  p.name
                )}
              </td>
              <td>
                {editingProductId === p.id ? (
                  <input
                    type="number"
                    name="price"
                    value={editForm.price}
                    onChange={handleEditChange}
                    min="0"
                  />
                ) : (
                  `$${p.price}`
                )}
              </td>
              <td>
                {editingProductId === p.id ? (
                  <>
                    <button onClick={saveEdit}>✅ Save</button>
                    <button onClick={() => setEditingProductId(null)}>❌ Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(p)}>✏️ Edit</button>
                    <button onClick={() => deleteProduct(p.id)}>🗑️ Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AWE_Staff
