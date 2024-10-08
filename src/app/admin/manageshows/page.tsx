'use client';
import React, { useEffect, useState, ChangeEvent } from 'react';
import { RiDeleteBin2Fill } from "react-icons/ri";
import './manageshow.css'; 
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addShow, deleteShow, fetchImages, fetchTheatres, getShows, getTheatre } from '@/app/services/services';

type Movie = {
  _id: string;
  title: string;
};

type Theatre = {
  _id: string;
  seats: string;
  theatrename: string;
};

type ShowData = {
  theatre_id: string;
  movie_id: string;
  timing: string;
  seats: number;
  from_date: string; 
  to_date: string;    
};


type Shows = {
  _id: string;
  theatre_id: {
    _id: string;
    theatrename: string;
  };
  timing: string;
  seats: string;
  movie_id: {
    _id: string;
    title: string;
    poster: string;
  };
};

function ManageShows() {
  const timings = ['10.30 AM', '1.00 PM', '4.30 PM', '7.30 PM', '10.00 PM'];
  const [theatres, setTheatre] = useState<Theatre[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [showData, setShowData] = useState<ShowData>({} as ShowData);
  const [shows, setShows] = useState<Shows[]>([]);
  const [token, setToken] = useState<string | null>(null);

  // Fetch token on component mount
  useEffect(() => {
    const storedToken = sessionStorage.getItem('adminToken');
    setToken(storedToken);
  }, []);

  const fetchShows = async () => {
    if (!token) {
      console.error("Token is null or undefined");
      return;
    }

    try {
      const data = await getShows(token);
      setShows(data);
      console.log(data);
    } catch (error) {
      console.error("An error occurred while fetching shows", error);
    }
  };

  useEffect(() => {
    const getTheatres = async () => {
      try {
        const res = await fetchTheatres();
        setTheatre(res);
      } catch (error) {
        console.log(error);
      }
    };

    getTheatres();
    if (token) {
      fetchShows();
    }
  }, [token]);

  const handleTheatreChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const theatre_id = e.target.value;
    const selectedTheatre = theatres.find((theatre) => theatre._id === theatre_id);

    setShowData((prev) => ({
      ...prev,
      theatre_id,
      seats: selectedTheatre ? parseInt(selectedTheatre.seats) : 0,
    }));

    const fetchTheatre = async (theatre_id: string) => {
      try {
        if (!token) {
          toast.error("Session Expired Login");
          return;
        }

        const data = await getTheatre(theatre_id, token);
        const { movie1, movie2, movie3 } = data;
        setMovies([movie1, movie2, movie3]);
      } catch (error) {
        console.log("Error occurred while fetching theatre details", error);
      }
    };
    fetchTheatre(theatre_id);
  };

  const handleChange = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setShowData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

 const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
  e.preventDefault();
  
  if (!token) {
    toast.error("Token is not available");
    return;
  }

  const { from_date, to_date } = showData;

  if (new Date(from_date) >= new Date(to_date)) {
    toast.error("From Date cannot be equal to or greater than To Date.");
    return;
  }

  try {
    const response = await addShow(showData, token);
    if (response) {
      toast.success(response.message);
      fetchShows();
    }
  } catch (error) {
    toast.error("An error occurred while adding the show");
    console.error("Error details:", error);
  }
};


  const manageShow = async (id: string) => {
    try {
      if (!token) {
        toast.error("Session Expired Login");
        return;
      }
      const message = await deleteShow(id, token);
      toast.success(message);
      fetchShows();
    } catch (error) {
      toast.error("Unexpected error occurred");
    }
  };

  return (
    <div className="manage-shows">
      <ToastContainer />
      <form onSubmit={handleSubmit} className="add-show-form">
        <h1>Add New Show</h1>
        <label>Select Theatre:</label>
        <select name="theatre_id" onChange={handleTheatreChange} value={showData.theatre_id}>
          <option value="" disabled>Select a theatre</option>
          {theatres.map((theatre) => (
            <option key={theatre._id} value={theatre._id}>
              {theatre.theatrename}
            </option>
          ))}
        </select>

        <label>Select Movie:</label>
        <select name="movie_id" onChange={handleChange}>
          <option value="" disabled>Select a movie</option>
          {movies.map((movie) => (
            <option key={movie._id} value={movie._id}>{movie.title}</option>
          ))}
        </select>

        <label>Select Timing:</label>
        <select name="timing" onChange={handleChange}>
          <option value="" disabled>Select a timing</option>
          {timings.map((timing, index) => (
            <option key={index} value={timing}>{timing}</option>
          ))}
        </select>

        <label>From Date:</label>
        <input type="date" name='from_date' onChange={handleChange} />
        <label>To Date:</label>
        <input type="date" name='to_date' onChange={handleChange} />
        <button type="submit">Add Show</button>
      </form>

      <h1>View Shows</h1>
      {shows.length === 0 ? (
        <p>No shows available.</p>
      ) : (
        <ul className="show-list">
          {shows.map((show) => (
            <li key={show._id} className="show-item">
              {show.movie_id && show.movie_id.title ? (
                <div className="show-details">
                  <img
                    src={fetchImages(show.movie_id.poster)}
                    alt={show.movie_id.title}
                    className="show-poster"
                  />
                  <div className="show-info">
                    <h2>{show?.movie_id?.title}</h2>
                    <p>Theatre: {show?.theatre_id?.theatrename}</p>
                    <p>Showtime: {show.timing}</p>
                    <p>Seats Available: {show.seats}</p>
                    <RiDeleteBin2Fill className="delete-icon" onClick={() => manageShow(show._id)} />
                  </div>
                </div>
              ) : (
                <h2>Movie information not available</h2>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ManageShows;
