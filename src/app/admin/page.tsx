'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './home.module.css'; 
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { adminLogin } from '../services/services';


type Data = {
  email: string;
  password: string;
};

function Admin() {
  const [data, setData] = useState<Data>({} as Data);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    setError(null);

    // Check if email or password is empty
    if (!data.email || !data.password) {
      setError("Email and Password Cannot be Empty");
      return;
    }

    try {
      const res = await adminLogin(data);
      sessionStorage.setItem('adminToken', res.token);
      router.push('/admin/adminhome');
    } catch (error) {
      console.error('Error during login:', error);
      setError("Login Failed. Invalid Credentials.");
    }
  };

  return (
    <div className={styles.container}>
    <div className={styles.adminLoginContainer}>
    <ToastContainer/>
      <form onSubmit={handleSubmit} className={styles.adminLoginForm}>
        <h1 className={styles.adminLoginTitle}>Admin Login</h1>
        <p className={styles.adminLoginSubtitle}>Please enter your credentials</p>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          onChange={handleChange}
          className={styles.adminLoginInput}
        />
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          onChange={handleChange}
          className={styles.adminLoginInput}
        />
        {error && <span className={styles.error}>Login Failed Invalid credentials</span>}
        <button type="submit" className={styles.adminLoginButton}>Login</button>
      </form>
    </div>
    </div>
  );
}

export default Admin;
