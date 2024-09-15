'use client'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../Redux/store'
import Image from 'next/image'
import axios from 'axios'
import './theatreLayout.css'
import Success from '../Components/Success'

interface Shows {
  _id: string,
  movie_id: string,
  theatre_id: {
    _id: string,
    ticketprice: string
  },
  from_date: string,
  to_date: string,
  seats: string
}

function Layout() {
  const ticketDetails = useSelector((state: RootState) => state.ticket)
  const userProfile = useSelector((state: RootState) => state.user)
  const [seatInfo, setSeatInfo] = useState(0)
  const [price, setPrice] = useState<number | null>(null)
  const [ticketInfo, setTicketInfo] = useState<Shows | undefined>(undefined)
  const [bookedSeats, setBookedSeats] = useState<string[]>([])
  const [seatLayout, setSeatLayout] = useState<string[][]>([])
  const [booking, setBooking] = useState(false)
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const [bookingId, setBookingId] = useState('')
  const rowLetters = 'ABCDEFGHIJ'

  useEffect(() => {
    const url = `http://localhost:9000/user/getshow/${ticketDetails.showId}`
    axios.get(url).then((res) => {
      console.log(res.data)
      setSeatInfo(res.data.seats)
      setTicketInfo(res.data)

      const recordSeats = {
        showid: ticketDetails.showId,
        date: ticketDetails.showdate,
      }

      const url = 'http://localhost:9000/user/getbookings';
      axios.get(url, { params: recordSeats }).then(res => {
        setBookedSeats(res.data.bookedSeats)
      })
    })
  }, [ticketDetails.showId])

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script)
  }, [])

  function handleClick() {
    console.log(seatInfo)
    createLayout()
    console.log("user", userProfile)
    console.log(ticketDetails)
    console.log(ticketInfo)
  }

  const handleSeatClicks = (seat: string) => {
    if (bookedSeats.includes(seat)) {
      alert("Already booked")
      return
    } else {
      setSelectedSeats((prev) => {
        let updatedSeats;
        if (prev.includes(seat)) {
          // If seat is already selected, remove it from the array
          updatedSeats = prev.filter(s => s !== seat);
        } else {
          // If seat is not selected, add it to the array
          if (prev.length < 10) {
            updatedSeats = [...prev, seat];
          } else {
            console.log("You can only book 10 seats at a time.");
            updatedSeats = prev;
          }
        }
        // Recalculate the total price based on the updated seat selection
        setPrice(updatedSeats.length * Number(ticketInfo?.theatre_id.ticketprice));
        return updatedSeats;
      });
    }
  }

  function createLayout() {
    const rows = 10
    const columns = Math.ceil(Number(seatInfo) / rows)
    const newSeatLayout: string[][] = []
    for (let row = 0; row < rows; row++) {
      const rowSeats: string[] = []
      for (let col = 0; col < columns; col++) {
        const seatName = `${rowLetters[row]}${col + 1}`
        rowSeats.push(seatName)
      }
      newSeatLayout.push(rowSeats)
    }

    setSeatLayout(newSeatLayout)
  }

  const record = {
    showid: ticketDetails.showId,
    userid: userProfile.userid,
    booked_date: ticketDetails.showdate,
    theatreid: ticketDetails.theatreId,
    movieid: ticketDetails.movieId,
    bookedSeats: selectedSeats,
    amount: price
  }

  const makePayment = async () => {
    console.log(ticketDetails.showdate)

    try {
      const content = {
        amount: price ? price : '', // Razorpay expects the amount in paise (multiply by 100)
        currency: 'INR'
      };

      // Make an API call to your backend to create the order
      const token = userProfile.token
      const url = "http://localhost:9000/user/payment";
      const response = await axios.post(url, content, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const { id, amount, currency } = response.data; // Get order details from response
      console.log(response.data);

      // Define Razorpay options
      const options = {
        key: 'rzp_test_XcdzS9WNbteswG', // Your Razorpay Key ID
        amount, // Amount in paise (from backend)
        currency,
        name: 'MovieFlix',
        description: 'Movie Ticket Payment',
        order_id: id, // Razorpay order ID from backend
        handler: async function (res: any) {
          // Payment was successful, handle the response here
          const paymentData = {
            razorpay_order_id: res.razorpay_order_id,
            razorpay_payment_id: res.razorpay_payment_id,
            razorpay_signature: res.razorpay_signature,
          };

          // Verify the payment on the backend
          const verify = await axios.post('http://localhost:9000/user/verifyPayment', paymentData, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (verify.data.state === true) {
            console.log("Payment Success")
            const url = 'http://localhost:9000/user/booking'
            axios.post(url, record, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }).then((res) => {
              if (res.status === 200) {
                console.log(res.data.bookingId)
                setBookingId(res.data.bookingId)
                console.log(bookingId)
                setBooking(true)
              }
            })
          } else {
            alert("Payment Verification Failed");
          }
        },
        prefill: {
          name: userProfile.name, // Pre-fill the user's name
          email: userProfile.email, // Pre-fill the user's email
        },
        theme: {
          color: '#3399cc', // Theme color for Razorpay payment window
        }
      };

      // Check if Razorpay is loaded
      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open(); // Open the Razorpay payment window
      } else {
        console.error('Razorpay SDK not loaded');
      }
    } catch (error) {
      console.error('Payment initiation failed:', error);
    }
  };

  return (
    <div className="layout-container">
      {booking && <Success id={bookingId} />}
      <button onClick={handleClick}>Show Layout</button>
      <p>Ticket Price: {ticketInfo?.theatre_id.ticketprice}</p>
      <div className="seating-layout">
        {seatLayout.map((row, rowIndex) => (
          <div key={rowIndex} className="seat-row">
            {row.map((seat, seatIndex) => (
              <div
                key={`${rowIndex}-${seatIndex}`}
                className={`seat ${selectedSeats.includes(seat) ? 'selected' : ''}${bookedSeats.includes(seat) ? 'booked' : ''}`}
                onClick={() => handleSeatClicks(seat)}>
                {seat}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div>
        <p>All eyes this way</p>
        <Image src="/assets/movie.jpg" alt="" width={1000} height={100} />
      </div>
      {selectedSeats.length > 0 && <button onClick={makePayment}>Pay {price}</button>}
    </div>
  )
}

export default Layout
