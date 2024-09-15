'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { GoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { setUser } from '../Redux/Feautures/user/userslice';
import './signin.css'; // Import the CSS file

type Data = {
  email: string;
  password: string;
};

function Signin() {
  const dispatch = useDispatch();
  const [data, setData] = useState<Data>({} as Data);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    console.log(data.email, data.password);
    if (data.email === 'admin@gmail.com' && data.password === 'admin@123') {
      router.push('/admin');
    } else {
      console.log(data);
      const url = 'http://localhost:9000/user/login';
      axios.post(url, data).then((res) => {
        //console.log(res.data.message, res.data.status);
        alert(res.data.message)
        const token = res.data.token;
        console.log(token);
        if (res.data.status === 1) {
          dispatch(
            setUser({
              userid: res.data.data._id,
              token: token,
              name: res.data.data.username,
              email: res.data.data.email,
            })
          );
          console.log(res.data);
          sessionStorage.setItem('username', res.data.data.username);
          router.push('/user/userhome');
        }
      });
    }
  };

  return (
    <div className="signin-container">
      <h1 className="signin-title">Sign In</h1>
      <form onSubmit={handleSubmit} className="signin-form">
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          onChange={handleChange}
          className="signin-input"
        />
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          onChange={handleChange}
          className="signin-input"
        />
        <button type="submit" className="signin-button">
          Sign In
        </button>
        <div className="signin-google">
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              console.log(credentialResponse.credential);
              const credential = credentialResponse.credential;
              const url = 'http://localhost:9000/user/login';
              axios
                .post(url, { credential: credential })
                .then((res) => {
                  console.log('Credential submitted');
                  const token = res.data.token;
                  console.log('token', token);
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
        </div>
      </form>
    </div>
  );
}

export default Signin;
