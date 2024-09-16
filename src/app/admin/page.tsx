'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import styles from './home.module.css'; 

type Data = {
  email: string;
  password: string;
};

function Admin() {
  const [data, setData] = useState<Data>({} as Data);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    console.log(data);
    const url = 'http://localhost:9000/admin/login';
    axios.post(url, data)
      .then((res) => {
        console.log(res.data);
        sessionStorage.setItem('adminToken', res.data.token);
        if (res.status === 200) {
          router.push('/admin/adminhome');
        }
      })
      .catch((error) => {
        console.error('Error during login:', error);
        alert('Login failed. Please check your credentials.');
      });
  };

  return (
    <div className={styles.container}>
    <div className={styles.adminLoginContainer}>
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
        <button type="submit" className={styles.adminLoginButton}>Login</button>
      </form>
    </div>
    </div>
  );
}

export default Admin;
