'use client';
import React, { useEffect, useState, ChangeEvent } from 'react';
import { RiDeleteBin2Fill } from "react-icons/ri";
import axios from 'axios';
import './manageshow.css'; 
import { toast,ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchImages, fetchTheatres } from '@/app/services/services';

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
  const timings = ['10.30 AM', '1.00 PM', '4.30 PM', '7.30 PM', '10.00 PM'];//array which stores timings
  const [theatres, setTheatre] = useState<Theatre[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [showData, setShowData] = useState<ShowData>({} as ShowData);
  const [shows, setShows] = useState<Shows[]>([]);
  const token = sessionStorage.getItem('adminToken');

  //Function for fetching shows
  const fetchShows = () => {
    try
    {
    axios.get('http://localhost:9000/admin/getshows', {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then((res) => {
      setShows(res.data);
    });
}
catch(error)
{
  console.error("an error occured")
}
};

  //Function for getting theatres
  useEffect(() => {
  try{
    const getTheatres=async()=>
    {

    const res=await fetchTheatres()
      setTheatre(res);
    }
  getTheatres()
    fetchShows();
  }
  catch(error)
  {
    console.log(error)
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

    //Function for getting a specific theatre and its movies
    try
    {
    axios.get(`http://localhost:9000/admin/gettheatre/${theatre_id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then((res) => {
      const { movie1, movie2, movie3 } = res.data;
      setMovies([movie1, movie2, movie3]);
    });
}catch(error)
{
  console.log("Error Occured")
}
  }

  const handleChange = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setShowData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
//Functon for adding shows
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    try{
    axios.post('http://localhost:9000/admin/addshows', showData, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then((res) => {
      if(res.status==200)
      {
      toast.success(res.data.message)
      fetchShows();
      }
      else
      {
        toast.error(res.data.message)
      }
    });
  }catch(error)
  {
    toast.error("An error Occured")
  }
  };

  //Function for deleting a particular show
  const deleteShow = (id: string) => {
    const url = `http://localhost:9000/admin/deleteshow/${id}`;
    try{
    axios.delete(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then((res) => {
      if (res.status === 200) {
        toast.success(res.data.message)
        fetchShows();
      } else {
        toast.error(res.data.message)
      }
    });
  }
  catch(error)
  {
    toast.error("Unexpected Error Occured")
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

          {/* mapping through the array of timings and selects a timing for show */}
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
                    <h2>{show.movie_id.title}</h2>
                    <p>Theatre: {show.theatre_id.theatrename}</p>
                    <p>Showtime: {show.timing}</p>
                    <p>Seats Available: {show.seats}</p>
                    <RiDeleteBin2Fill className="delete-icon" onClick={() => deleteShow(show._id)} />
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
