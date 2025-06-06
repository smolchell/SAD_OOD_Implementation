import React, { useState } from 'react';
import axios from 'axios';

function Register({ data }) {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    dob: '',
    email: '',
    password: '',
    role: 'user' // Default role
  });

  const [msg, setMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/register', form)
      .then(res => setMsg(res.data.message))
      .catch(err => setMsg(err.response?.data?.message || 'Something went wrong'));
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit} style={{border:"1px solid gray", width:"50%", padding:"10px"}}>
        <input type="text" name="first_name" placeholder="First Name" onChange={handleChange} required />
        <input type="text" name="last_name" placeholder="Last Name" onChange={handleChange} required />
        <input type="date" name="dob" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Register</button>
      </form>
      <p>{msg}</p>
    </div>
  );
}

export default Register
