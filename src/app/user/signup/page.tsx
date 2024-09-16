'use client';

import { useState } from 'react';
import axios from 'axios';
import styles from './signup.module.css'; 
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
function Signup() {
  const [data, setData] = useState({});
  const router=useRouter()
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
      if(res.status==200)
      {
      toast.success('Registration successful!'); 
      router.push('/user/signin')
      }

    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 400) {
          toast.error(`Registration failed: ${error.response.data.message}`);
        } else if (error.request) {
          toast.error('No response from the server.');
        } 
      }
    }
  };

  return (

    <div className={styles.container}>
      <ToastContainer/>
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
