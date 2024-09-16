'use client'
import React, { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import styles from './styles/verify.module.css'  // Import the CSS module

function Verify() {
    const [otp, setOtp] = useState('');
    const router = useRouter();
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOtp(e.target.value);
    }

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        const email = sessionStorage.getItem('email');
        const url = 'http://localhost:9000/user/verifyotp';
        
        axios.post(url, { email, otp })
            .then((res) => {
                if (res.data.status === 1) {
                    sessionStorage.setItem('username', res.data.username);
                    router.push('/user/userhome');
                }
            })
            .catch((error) => {
                console.error('Error verifying OTP:', error);
            });
    }

    return (
        <div className={styles.container}>
            <div className={styles.verifyContainer}>
                <h1 className={styles.verifyTitle}>Verify Your OTP</h1>
                <form onSubmit={handleSubmit} className={styles.verifyForm}>
                    <input
                        type="text"
                        name="otp"
                        value={otp}
                        onChange={handleChange}
                        placeholder="Enter your OTP"
                        className={styles.verifyInput}
                    />
                    <button type="submit" className={styles.verifyButton}>
                        Verify
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Verify;
