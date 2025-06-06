import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login({ setLoggedInUser }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post('http://localhost:5000/login', form)
      .then(res => {
        const user = res.data.user;

        if (user) {
          console.log("ASDF");
          console.log(user);
          setMsg('Login successful!');
          setLoggedInUser(user); // Pass user info to parent

          // Redirect based on role
          if (user.role === 'admin') {
            navigate('/');
          } else {
            navigate('/');
          }
        } else {
          setMsg('User not found. Redirecting to registration...');
          setTimeout(() => {
            navigate('/register');
          }, 2000);
        }
      })
      .catch(err => {
        console.error(err);
        setMsg(err.response?.data?.message || 'Login failed');
      });
  };

  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        /><br /><br />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        /><br /><br />

        <button type="submit">Login</button>
      </form>

      <p>{msg}</p>
    </div>
  );
}

export default Login
