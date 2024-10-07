'use client'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../Redux/store'
import axios from 'axios'
import styles from './history.module.css' 
import { fetchImages } from '@/app/services/services'

interface History {
  movieid: {
    _id: string;
    title: string;
    language: string;
    poster: string;
  }
  _id: string;
  bookedSeats: string[];
  theatreid: {
    _id: string;
    theatrename: string;
    ticketprice: string;
  }
  amount: string;
  booked_date: string;
  showid: {
    _id: string;
    timing: string;
  }
}

function History() {
  const userProfile = useSelector((state: RootState) => state.user)
  const [history, setHistory] = useState<History[]>([])
  const token = userProfile.token

  useEffect(() => {
    const userid = userProfile.userid //taking userid from redux
    const url = 'http://localhost:9000/user/gethistory'
    axios.get(url, { params: { userid }, headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => {
        console.log(res.data)
        setHistory(res.data)
      })
      .catch(err => {
        console.error(err)
      })
  }, [userProfile.userid])

  return (
    <div className={styles.historyContainer}>
      <h1>Booking History</h1>
      {history.map((item) => (
        <div key={item._id} className={styles.historyItem}>
          <img className={styles.movieImage} src={fetchImages(item.movieid.poster)} alt={item.movieid.title} />
          <div className={styles.historyItemDetails}>
            <h2>{item.movieid.title}</h2>
            <p className={styles.details}>Language: {item.movieid.language}</p>
            <p className={styles.details}>Seats Booked: {item.bookedSeats.join(', ')}</p>
            <p className={styles.details}>Theatre: {item.theatreid.theatrename}</p>
            <p className={styles.details}>Ticket Price: {item.theatreid.ticketprice}</p>
            <p className={styles.details}>Show Time: {item.showid?.timing}</p>
            <p className={styles.amount}>Amount: {item.amount}</p>
            <p className={styles.details}>Booking Date: {item.booked_date}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default History
