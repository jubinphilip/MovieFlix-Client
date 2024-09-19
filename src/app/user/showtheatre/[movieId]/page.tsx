'use client'

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setTicketDetails } from '../../Redux/Feautures/user/ticketSlice';
import { useRouter } from 'next/navigation';
import './showtheatre.css'; 
import { fetchImages } from '@/app/services/services';

interface BookTicketProps {
  params: { movieId: string }
}

interface Movie {
  createdAt: string;
  from_date: string;
  to_date: string;
  movie_id: {
    _id: string;
    language: string;
    poster: string;
    title: string;
  }
  _id: string;
  seats: string;
  theatre_id: {
    _id: string;
    theatreloc: string;
    theatrename: string;
    ticketprice: string;
    seats:string
  }
  timing: string;
  updatedAt: string;
}

const ShowTheatres: React.FC<BookTicketProps> = ({ params }) => {
  const { movieId } = params; //Receiving the movie id from params
  const [theatresWithMovies, setTheatresWithMovies] = useState<Movie[]>([]); //State for getting theatres which run that movie
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]); //state for filtering movie with date and time
  const [date, setDate] = useState<string>(''); //stores date
  const [selectedTime, setSelectedTime] = useState<string>(''); //stores selected time
  const timings = ['10.30 AM', '1.00 PM', '4.30 PM', '7.30 PM', '10.00 PM']
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const url = `http://localhost:9000/user/getshowtheatre/${movieId}`; //getting all show information with the particular movie
        const response = await axios.get(url);
        setTheatresWithMovies(response.data);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };
    fetchMovies();
  }, [movieId]);

  useEffect(() => {
    if (date || selectedTime) {
      const filtered = theatresWithMovies.filter(movie => {
        const selectedDate = new Date(date);
        const fromDate = new Date(movie.from_date);
        const toDate = new Date(movie.to_date);
        // Check if the selected date is within the movie's date range
        const dateMatches = !date || (selectedDate >= fromDate && selectedDate <= toDate);
        // Check if the selected time matches the movie's timing
        const timeMatches = !selectedTime || movie.timing === selectedTime;
        return dateMatches && timeMatches;
      });
      setFilteredMovies(filtered);
    } else {
      setFilteredMovies(theatresWithMovies);
    }
  }, [date, selectedTime, theatresWithMovies]);

  const handleDateChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setDate(e.target.value);
  };

  const handleTimeChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    setSelectedTime(e.target.value);
  };

  const handleDate: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
  };

  //function for handling booking tickets before booking the user needs to select a date and time
  function handleClick(movieId: string, theatreId: string, timing: string, showId: string) {
    const currentDate = new Date();
    const selectedDate = new Date(date);

    if (!date) {
      alert("Please select a show date");
    } else if (selectedDate < currentDate) { //selected date needs to >= current date
      alert("Incorrect date. Please select a future date.");
    } else if (!selectedTime) {
      alert("Please select a show time");
    } else {
      //All these informations are stored in the redux state and then is routed to next page
      dispatch(setTicketDetails({ movieId, theatreId, timing, showId, showdate: date }));
      router.push('/user/theatrelayout');
    }
  }

  return (
    <div className="show-theatres-container">
      <form onSubmit={handleDate} className="date-form">
        <h2>Choose a Date and Time</h2>
        <label htmlFor='movie-date'>Choose a date:</label>
        <input type="date" id='movie-date' name='movie-date' value={date} onChange={handleDateChange} />
        
        <label htmlFor='movie-time'>Select Timing:</label>
        <select id='movie-time' name="timing" value={selectedTime} onChange={handleTimeChange}>
          <option value="">Select a timing</option>
          {/* mapping through the array of timings and selects a timing for show */}
          {timings.map((timing, index) => (
            <option key={index} value={timing}>{timing}</option>
          ))}
        </select>
      </form>

      <h1>Theatres</h1>
      <ul className="theatre-list">
        {/* mapping through the movies */}
        {filteredMovies.length > 0 ? filteredMovies.map((movie) => (
          <li key={movie._id} className="theatre-item">
            <img src={fetchImages(movie.movie_id.poster)} alt={movie.movie_id.title} />
            <div className="theatre-item-content">
              <h2>{movie.movie_id.title}</h2>
              <p><strong>Language:</strong> {movie.movie_id.language}</p>
              <p><strong>Seats:</strong> {movie.theatre_id.seats}</p>
              <p><strong>Theatre:</strong> {movie.theatre_id.theatrename}</p>
              <p><strong>Location:</strong> {movie.theatre_id.theatreloc}</p>
              <p><strong>Ticket Price:</strong> {movie.theatre_id.ticketprice}</p>
              <p><strong>Timing:</strong> {movie.timing}</p>
              <p><strong>From Date:</strong> {new Date(movie.from_date).toLocaleDateString()}</p>
              <p><strong>To Date:</strong> {new Date(movie.to_date).toLocaleDateString()}</p>
            </div>
            <button onClick={() => handleClick(movie.movie_id._id, movie.theatre_id._id, movie.timing, movie._id)}>Book Tickets</button>
          </li>
        )) : "No Movies Found"}
      </ul>
    </div>
  );
};

export default ShowTheatres;