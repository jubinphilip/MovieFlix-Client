'use client'
import React, { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import styles from './verify.module.css'

function Verify() {
  const [otp, setOtp] = useState('')
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value)
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    const email = sessionStorage.getItem('email')
    const url = 'http://localhost:9000/user/verifyotp'

    axios.post(url, { email, otp: otp }).then((res) => {
      if (res.data.status === 1) {
        sessionStorage.setItem('username', res.data.username)
        router.push('/user/userhome')
      }
    })
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Verify Your Otp</h1>
      <form className={styles.formContainer} onSubmit={handleSubmit}>
        <input
          type="text"
          name="otp"
          value={otp}
          onChange={handleChange}
          className={styles.inputField}
        />
        <button type="submit" className={styles.submitButton}>
          Verify
        </button>
      </form>
    </div>
  )
}

export default Verify
