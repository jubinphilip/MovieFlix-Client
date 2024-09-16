'use client';

import { useState } from 'react';
import axios from 'axios';
import styles from './signup.module.css'; 

function Signup() {
  const [data, setData] = useState({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    console.log(data);
    const url = 'http://localhost:9000/user/register';
    try {
      const res = await axios.post(url, data);
      console.log(res.data);  
      alert('Registration successful!'); 
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 400) {
          alert(`Registration failed: ${error.response.data.message}`);
        } else if (error.request) {
          alert('No response from the server.');
        } else {
          alert('An error occurred during registration.');
        }
      } else {
        alert('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className={styles.container}>
    <div className={styles.signupContainer}>
      <div className={styles.signupPaper}>
        <h2 className={styles.signupHeading}>Sign Up</h2>
        <form onSubmit={handleSubmit} className={styles.signupForm}>
          <div className={styles.signupInputGroup}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              onChange={handleChange}
            />
          </div>
          <div className={styles.signupInputGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              onChange={handleChange}
            />
          </div>
          <div className={styles.signupInputGroup}>
            <label htmlFor="phone">Phone</label>
            <input
              type="text"
              id="phone"
              name="phone"
              placeholder="Enter your phone"
              onChange={handleChange}
            />
          </div>
          <div className={styles.signupInputGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              onChange={handleChange}
            />
          </div>
          <button type="submit" className={styles.signupButton}>
            Sign Up
          </button>
        </form>
      </div>
    </div>
    </div>
  );
}

export default Signup;
