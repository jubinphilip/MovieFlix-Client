'use client'
import React, { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { Router } from 'next/router'
function Verify() {
    const[otp,setOtp]=useState('')
    const router=useRouter()
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
       setOtp(e.target.value)
    }
    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => 
        {
            e.preventDefault()
            console.log(otp)
            const email = sessionStorage.getItem('email');
            console.log(email);
            const url='http://localhost:9000/user/verifyotp'
            axios.post(url,{email,otp:otp}).then((res)=>{
                console.log(res.data)
               if(res.data.status==1)
               {
                console.log(res.data.username)
                sessionStorage.setItem('username',res.data.username)
                router.push('/user/userhome')
               }
            })
        }
  return (
    <div>
      <h1>Verify Your Otp</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="otp" value={otp} onChange={handleChange} />
        <button type="submit">Verify</button>
      </form>
    </div>
  )
}
export default Verify
