'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { GoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { setUser } from '../Redux/Feautures/user/userslice';
import styles from './signin.module.css'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


type Data = {
  email: string;
  password: string;
};

function Signin() {
  const dispatch = useDispatch();
  const [data, setData] = useState<Data>({} as Data);
  const[error,setError]=useState('')
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    try {
      const url = 'https://movieflix-server.onrender.com/user/login';
      axios.post(url, data).then((res) => {
        if (res.data.status === 1) {
          toast.success(res.data.message);
          const token = res.data.token;
          /* The contents are dispatched to Redux for storing it in a global state */
          dispatch(
            setUser({
              userid: res.data.data._id,
              token: token,
              name: res.data.data.username,
              email: res.data.data.email,
            })
          );
          // Username is stored in session storage
          sessionStorage.setItem('username', res.data.data.username);
          router.push('/user/userhome');
        } else {
          setError(res.data.message)  
        }
      });
    } catch (err) {
      setError("Error Occured")
      toast.error("An Unexpected error occurred");
    }
  };

  return (
    <div className={styles.container}>
      <ToastContainer />
      <div className={styles.signinContainer}>
        <h1 className={styles.signinTitle}>Sign In</h1>
        <form onSubmit={handleSubmit} className={styles.signinForm}>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            onChange={handleChange}
            className={styles.signinInput}
          />
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            onChange={handleChange}
            className={styles.signinInput}
          />
        {error && <span className={styles.error}>Login Failed Invalid credentials</span>}
          <button type="submit" className={styles.signinButton}>
            Sign In
          </button>
          <div className={styles.signinGoogle}>
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                console.log(credentialResponse.credential);
                const credential = credentialResponse.credential;
                const url = 'https://movieflix-server.onrender.com/user/login';
                axios
                  .post(url, { credential: credential })
                  .then((res) => {
                    console.log('Credential submitted');
                    const token = res.data.token;
                    dispatch(
                      setUser({
                        userid: res.data.data._id,
                        token:token,
                        name: res.data.data.username,
                        email: res.data.data.email,
                      })
                    );
                    console.log(res);
                    sessionStorage.setItem('email', res.data.email);
                    if (res.data.status === 1) {

                       router.push('/user/verify'); 
                    }
                  });
              }}
              onError={() => {
                console.log('Login Failed');
              }}
            />
            <button className={styles.signinGoogleButton}>
              <a href="/user/userhome" style={{ color: 'white', textDecoration: 'none' }}>
                Continue without login
              </a>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signin;
