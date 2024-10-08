'use client'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../Redux/store'
import axios from 'axios'
import './theatreLayout.css'
import Success from '../Components/Success'
import { useRouter } from 'next/navigation'
import { toast ,ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { getBookings, getShowDetails } from '@/app/services/services'

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
  const router = useRouter()
  const ticketDetails = useSelector((state: RootState) => state.ticket)
  const userProfile = useSelector((state: RootState) => state.user)
  const [seatInfo, setSeatInfo] = useState(0)//State for storing the number of seats available in the theatre
  const [price, setPrice] = useState<number | null>(null)//state for storing the price of tickets on each seat selection the price will be incremented
  const [ticketInfo, setTicketInfo] = useState<Shows | undefined>(undefined)//state for storing details regarding theatre and ticket price
  const [bookedSeats, setBookedSeats] = useState<string[]>([])//state for storing the array of booked seats and from this array booked seats are marked
  const [seatLayout, setSeatLayout] = useState<string[][]>([])//state for storing the layout of seats 
  const [booking, setBooking] = useState(false)//storing the state for showing the success component on successfull payment
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])//storing the seatnames selected by the user
  const [bookingId, setBookingId] = useState('')//Booking id if the current booking is set after a successfull payment and is passed to next component
  const rowLetters = 'ABCDEFGHIJK'//array of alphabets for displaying seats

  // useEffect for fetching show details, booked seats, and creating seat layout
  useEffect(() => {
    const fetchData = async () => {
      try {
        // First API call to fetch show details
        const data = await getShowDetails(ticketDetails.showId)
        console.log(data);
        setSeatInfo(data.seats);
        setTicketInfo(data);

        // Prepare parameters for the second API call
        // recordSeats is an object which stores the showid and date used to take booked seats for that particular show at that date
        const recordSeats = {
          showid: ticketDetails.showId,
          date: ticketDetails.showdate,
        };
        // Second API call to fetch booked seats
        const bookingsData = await getBookings(recordSeats)//passing record of seats
        setBookedSeats(bookingsData);  // Getting booked seats

        // Create seat layout after fetching data
        createLayout(data.seats);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error fetching seat or booking details!");
      }
    };

    fetchData(); // Calling the async function
  }, [ticketDetails.showId]);

  // Razorpay element loading on page load
  useEffect(() => {
    try {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    } catch (error) {
      console.error('Error loading Razorpay script:', error);
      toast.error('Failed to load Razorpay.');
    }
  }, [])

  // Function for creating seat layout
  function createLayout(seats: number) {
    const rows = 10;
    const remaining_seats = seats % 10;
    const seatCount = seats - remaining_seats;
    const columns = Math.ceil(seatCount / rows); // All seats are arranged in 10 rows
    const newSeatLayout: string[][] = []; // Initializes a multidimensional array for storing the seat layout

    // Row letters, assuming you have defined them somewhere
   // const rowLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; // Example for rows A to Z

    // Create the main seat layout
    for (let row = 0; row < rows; row++) {
        const rowSeats: string[] = []; // Array for storing seats in a row
        for (let col = 0; col < columns; col++) {
            const seatName = `${rowLetters[row]}${col + 1}`;
            rowSeats.push(seatName); // Pushing seats to the row
        }
        newSeatLayout.push(rowSeats); // Push a row to the array
    }

    // If there are remaining seats, create a new row for them
    if (remaining_seats > 0) {
        const remainingRow: string[] = [];
        for (let i = 0; i < remaining_seats; i++) {
            const seatName = `${rowLetters[rows]}${i + 1}`; // Use the next row letter
            remainingRow.push(seatName);
        }
        newSeatLayout.push(remainingRow); // Add the remaining seats row to the layout
    }

    console.log(newSeatLayout);
    setSeatLayout(newSeatLayout); // Setting the layout
}

  // Function to handle seat clicks
  const handleSeatClicks = (seat: string) => {
    const seatcount=Number(sessionStorage.getItem('seatcount'))
    if (bookedSeats.includes(seat)) {
      toast.warn("Already booked")
      return
    } else {
      setSelectedSeats((prev) => {
        let updatedSeats;
        if (prev.includes(seat)) {
          // If seat is already selected, remove it from the array
          updatedSeats = prev.filter(s => s !== seat);
        } else {
          // If seat is not selected, add it to the array
          if (prev.length < seatcount) {
            updatedSeats = [...prev, seat];
          } else {
           toast.error(`You choose ${seatcount} seats only`);
            updatedSeats = prev;
          }
        }
        // Calculate the total price based on the updated seat selection
        setPrice(updatedSeats.length * Number(ticketInfo?.theatre_id.ticketprice));
        return updatedSeats;
      });
    }
  }

  // Info needed for adding data to the db
  const record = {
    showid: ticketDetails.showId,
    userid: userProfile.userid,
    booked_date: ticketDetails.showdate,
    theatreid: ticketDetails.theatreId,
    movieid: ticketDetails.movieId,
    bookedSeats: selectedSeats,
    amount: price
  }

  // Function to initiate payment and booking
  const makePayment = async () => {
    console.log(userProfile.token)
    if (!userProfile.token) {
      router.push('/user/signin');
    }
    else
    {
    try {
      const content = {
        amount: price ? price : '', // Razorpay expects the amount in paise (multiply by 100)
        currency: 'INR'
      };

      const token = userProfile.token;
      const url = "https://movieflix-server.onrender.com/user/payment";
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
          try {
            const paymentData = {
              razorpay_order_id: res.razorpay_order_id,
              razorpay_payment_id: res.razorpay_payment_id,
              razorpay_signature: res.razorpay_signature,
            };

            // Verify the payment on the backend
            const verify = await axios.post('https://movieflix-server.onrender.com/user/verifyPayment', paymentData, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });

            if (verify.data.state === true) {
              toast.success("Payment Success")
              const url = 'https://movieflix-server.onrender.com/user/booking';
              axios.post(url, record, {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              }).then((res) => {
                if (res.status === 200) {
                  console.log(res.data.bookingId);
                  setBookingId(res.data.bookingId); // Storing the current booking id
                  console.log(bookingId);
                  setBooking(true); // Setting state of booking to true
                }
              })
            } else {
              alert("Payment Verification Failed");
            }
          } catch (error) {
            console.error("Payment verification failed:", error);
            toast.error("Error verifying payment.");
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
        toast.error('Razorpay SDK not loaded');
      }
    } catch (error) {
      console.error('Payment initiation failed:', error);
      toast.error("Error initiating payment.");
    }
  }
  };

  return (
    <div className="layout-container">
      <ToastContainer/>
      {booking && <Success id={bookingId} show={true} />} {/* If booking success, show success component */}
      <p>Ticket Price: {ticketInfo?.theatre_id.ticketprice}</p>
      
      <div className="seating-layout">
        {seatLayout.map((row, rowIndex) => (
          <div key={rowIndex} className="seat-row">
            {row.map((seat, seatIndex) => (
              <div
                key={`${rowIndex}-${seatIndex}`}
                className={`seat ${selectedSeats.includes(seat) ? 'selected' : ''}${bookedSeats.includes(seat) ? 'booked' : ''}`}
                onClick={() => handleSeatClicks(seat)}
              >
                {seat}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div>
        <p>All eyes this way</p>
        <img src="/assets/movie.jpg" alt="" className='screen' />
      </div>
      {selectedSeats.length > 0 && <button onClick={makePayment}>Pay {price}</button>}
    </div>
  )
}

export default Layout;