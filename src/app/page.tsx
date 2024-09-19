'use client'
import React from 'react';
import './styles/home.css';

export default function Home() {
  return (
    <div className="container">
   
      <main className="main-content">
      <h1 className='main-head'>MOVIEFLIX</h1>
        <h2 className="title">Welcome to Movie Booking</h2>
        <p className="description">
          Your one-stop solution for booking movie tickets. Sign up to start enjoying our services!
        </p>
        <div className="button-grid">
          <a href="/user/signup" className="button primary">
            Register
          </a>
          <a href="/user/signin" className="button secondary">
            Sign In
          </a>
          <a href="/admin" className="button outlined">
            Login as Admin
          </a>
        </div>
      </main>
    </div>
  );
}