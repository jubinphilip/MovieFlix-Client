'use client'

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setTicketDetails } from '../../Redux/Feautures/user/ticketSlice';
import { useRouter } from 'next/navigation';
import './showtheatre.css'; // Import the CSS file

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
  const { movieId } = params;
  const [theatresWithMovies, setTheatresWithMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [date, setDate] = useState<string>('');
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const url = `http://localhost:9000/user/getshowtheatre/${movieId}`;
        const response = await axios.get(url);
        setTheatresWithMovies(response.data);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };
    fetchMovies();
  }, [movieId]);

  useEffect(() => {
    if (date) {
      const filtered = theatresWithMovies.filter(movie => {
        const selectedDate = new Date(date);
        const fromDate = new Date(movie.from_date);
        const toDate = new Date(movie.to_date);
        return selectedDate >= fromDate && selectedDate <= toDate;
      });
      setFilteredMovies(filtered);
    } else {
      setFilteredMovies(theatresWithMovies);
    }
  }, [date, theatresWithMovies]);

  const handleDateChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setDate(e.target.value);
  };

  const handleDate: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
  };

  function handleClick(movieId: string, theatreId: string, timing: string, showId: string) {
    const currentDate = new Date();
    const selectedDate = new Date(date);

    if (!date) {
      alert("Please select a show date");
    } else if (selectedDate < currentDate) {
      alert("Incorrect date. Please select a future date.");
    } else {
      dispatch(setTicketDetails({ movieId, theatreId, timing, showId, showdate: date }));
      router.push('/user/theatrelayout');
    }
  }

  return (
    <div className="show-theatres-container">
      <form onSubmit={handleDate} className="date-form">
        <h2>Choose a Date</h2>
        <label htmlFor='movie-date'>Choose a date:</label>
        <input type="date" id='movie-date' name='movie-date' value={date} onChange={handleDateChange} />
      </form>
      <h1>Theatres</h1>
      <ul className="theatre-list">
        {filteredMovies.map((movie) => (
          <li key={movie._id} className="theatre-item">
            <img src={`http://localhost:9000/uploads/${movie.movie_id.poster}`} alt={movie.movie_id.title} />
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
        ))}
      </ul>
    </div>
  );
};

export default ShowTheatres;
