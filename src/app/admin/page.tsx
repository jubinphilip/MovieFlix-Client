'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import './home.css'

type Data = {
  email: string,
  password: string
}

function Admin() {
  const [data, setData] = useState<Data>({} as Data)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    
    console.log(data);
    const url = "http://localhost:9000/admin/login";
    axios.post(url, data).then((res) => {
      console.log(res.data)
      sessionStorage.setItem('adminToken', res.data.token);
      if (res.status === 200) {
        router.push('/admin/adminhome');
      }
    }).catch((error) => {
      console.error("Error during login:", error);
      alert("Login failed. Please check your credentials.");
    });
  };

  return (
    <div className="admin-login-container">
      <form onSubmit={handleSubmit} className="admin-login-form">
        <h1 className="admin-login-title">Admin Login</h1>
        <p className="admin-login-subtitle">Please enter your credentials</p>
        <input 
          type="email" 
          name="email" 
          placeholder="Enter your email"  
          onChange={handleChange}
          className="admin-login-input"
        />
        <input 
          type="password" 
          name="password" 
          placeholder="Enter your password" 
          onChange={handleChange}
          className="admin-login-input"
        />
        <button type="submit" className="admin-login-button">Login</button>
      </form>
    </div>
  )
}

export default Admin