'use client';
import React, { useEffect, useState, ChangeEvent } from 'react';
import { RiDeleteBin2Fill } from "react-icons/ri";
import './manageshow.css'; 
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addShow, deleteShow, fetchImages, fetchTheatres, getShows, getTheatre } from '@/app/services/services';

type Movie = { _id: string; title: string; };
type Theatre = { _id: string; seats: string; theatrename: string; };
type ShowData = { theatre_id: string; movie_id: string; timing: string; seats: number; };
type Shows = { _id: string; theatre_id: { _id: string; theatrename: string; }; timing: string; seats: string; movie_id: { _id: string; title: string; poster: string; }; };

function ManageShows() {
  const timings = ['10.30 AM', '1.00 PM', '4.30 PM', '7.30 PM', '10.00 PM'];
  const [theatres, setTheatre] = useState<Theatre[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [showData, setShowData] = useState<ShowData>({} as ShowData);
  const [shows, setShows] = useState<Shows[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleError = (error: any, customMessage: string) => {
    console.error(customMessage, error);
    toast.error(customMessage);
  };

  useEffect(() => {
    const tokenFromStorage = sessionStorage.getItem('adminToken');
    if (tokenFromStorage) {
      setToken(tokenFromStorage);
      fetchTheatres();
      fetchShows(tokenFromStorage);
    } else {
      toast.error("Session expired. Please log in again.");
    }
  }, []);

  const fetchShows = async (token: string) => {
    if (!token) return;
    setIsLoading(true);
    try {
      const data = await getShows(token);
      setShows(data);
    } catch (error) {
      handleError(error, "Failed to fetch shows.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTheatreChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    const theatre_id = e.target.value;
    const selectedTheatre = theatres.find((theatre) => theatre._id === theatre_id);
    setShowData((prev) => ({ ...prev, theatre_id, seats: selectedTheatre ? parseInt(selectedTheatre.seats) : 0 }));

    try {
      if (token == null) {
        toast.error("Session Expired Login");
      } else {
        const data = await getTheatre(theatre_id, token);
        const { movie1, movie2, movie3 } = data;
        setMovies([movie1, movie2, movie3]);
      }
    } catch (error) {
      handleError(error, "Error occurred while fetching theatre details");
    }
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

    try {
      const response = await addShow(showData, token);
      if (response) {
        toast.success(response.message);
        fetchShows(token);
      }
    } catch (error) {
      handleError(error, "An error occurred while adding the show");
    }
  };

  const manageShow = async (id: string) => {
    try {
      if (token == null) {
        toast.error("Session Expired Login");
      } else {
        const message = await deleteShow(id, token);
        toast.success(message);
        fetchShows(token);
      }
    } catch (error) {
      handleError(error, "Unexpected error occurred");
    }
  };

  return (
    <div className="manage-shows">
      <ToastContainer/>
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
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Adding Show..." : "Add Show"}
        </button>
      </form>

      <h2>Current Shows</h2>
      <ul>
        {shows.map((show) => (
          <li key={show._id}>
            {show.movie_id.title} - {show.timing} - {show.theatre_id.theatrename}
            <RiDeleteBin2Fill onClick={() => manageShow(show._id)} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ManageShows;
