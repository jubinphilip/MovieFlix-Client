'use client';
import React, { useEffect, useState } from 'react';
import './addtheatres.css'; 
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addTheatre, editMovies, fetchLocalMovies, fetchTheatres } from '@/app/services/services';

type Movie = {
  _id: string;
  title: string;
};

type Theatre = {
  _id: string;
  theatrename: string;
};

function Addtheatres() {
  const [data, setData] = useState({});
  const [movies, setMovies] = useState<Movie[]>([]);
  const [theatres, setTheatre] = useState<Theatre[]>([]);
  const [editData, setEditdata] = useState({});
  const [token, setToken] = useState('');
  const[showEdit,setShowEdit]=useState(false)

  useEffect(() => {
    const token = sessionStorage.getItem('adminToken'); // Taking token from session
    setToken(token ? token : '');

    // Fetching already existing movies from the database
    const fetchMovies = async () => {
      try {
        const res = await fetchLocalMovies('admin');
        console.group("Localmovies", res);
        setMovies(res);
      } catch (error) {
        console.error(error);
      }
    };

    // Fetching theatres from database
    const getTheatres = async () => {
      try {
        const res = await fetchTheatres();
        setTheatre(res);
      } catch (error) {
        console.log(error);
      }
    };

    fetchMovies();
    getTheatres();
  }, []);

  // Function for setting theatre values 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target as HTMLInputElement | HTMLSelectElement;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // Function for setting edited values
  const handleEditChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditdata((prev) => ({ ...prev, [name]: value }));
  };

  // Function for editing currently running movies
  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(editData);

    try {
      const res = await editMovies(editData, token);  // Call the API service for editing movies

      if (res && res.status === 200) {
        toast.success(res.data.message || 'Movie updated successfully');
      } else if (res) {
        toast.error(res.data.error || 'An error occurred while editing the movie');
      } else {
        toast.error('No response from server');
      }
    } catch (err) {
      console.error("An unexpected error occurred:", err);
      toast.error('An unexpected error occurred');
    }
  };

  // Function for adding the theatre
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    // Calling API service
    try
    {
    const res = await addTheatre(data, token);
    if (res.status === 200) {
      toast.success(res.data.message);
    } else {
      toast.error(res.data.error);
    }
  }catch (error: any) {
    if (error.response) {
      console.error('Error response from server:', error.response.data);
      toast.error(error.response.data.message);
    } else {
      console.error('Error setting up request:', error.message);
      toast.error('An unexpected error occurred.');
    }
  }
  }
  return (
    <div className="container">
      <ToastContainer />
      <div className="form-container">
        <form onSubmit={handleSubmit} className="theatre-form">
          <h1>Add Theatres</h1>
          <div className="form-group">
            <label>Theatre Name:</label>
            <input type="text" placeholder="Name" name="theatrename" onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Theatre Location:</label>
            <input type="text" name="theatreloc" placeholder="Location" onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Price:</label>
            <input type="text" name="ticketprice" placeholder="Enter price" onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Number of Seats:</label>
            <input type="text" name="seats" placeholder="Enter seats" onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Select Movies:</label>
            <div className="select-group">
              <select name="movie1" className="movie-select" onChange={handleChange}>
                <option value="">Select a movie</option>
                {movies && movies.map((movie) => (
                  <option key={movie._id} value={movie._id}>{movie.title}</option>
                ))}
              </select>
              <select name="movie2" className="movie-select" onChange={handleChange}>
                <option value="">Select a movie</option>
                {movies && movies.map((movie) => (
                  <option key={movie._id} value={movie._id}>{movie.title}</option>
                ))}
              </select>
              <select name="movie3" className="movie-select" onChange={handleChange}>
                <option value="">Select a movie</option>
                {movies && movies.map((movie) => (
                  <option key={movie._id} value={movie._id}>{movie.title}</option>
                ))}
              </select>
            </div>
          </div>
          <button type="submit" className="submit-button">Add Theatre</button>
        </form>
       {!showEdit && <button  className="submit-button" onClick={()=>setShowEdit(true)}>Edit Theatre Information</button>}

        { showEdit && <form onSubmit={handleEdit} className="edit-form">
          <h1>Edit Now Running Movies</h1>
          <div className="form-group">
            <label>Select Theatre:</label>
            <select name="theatrename" className="theatre-select" onChange={handleEditChange}>
              <option value="">Select a theatre</option>
              {theatres.map((theatre) => (
                <option key={theatre._id} value={theatre.theatrename}>{theatre.theatrename}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Select Movies:</label>
            <div className="select-group">
              <select name="movie1" className="movie-select" onChange={handleEditChange}>
                <option value="">Select a movie</option>
                {movies && movies.map((movie) => (
                  <option key={movie._id} value={movie._id}>{movie.title}</option>
                ))}
              </select>
              <select name="movie2" className="movie-select" onChange={handleEditChange}>
                <option value="">Select a movie</option>
                {movies && movies.map((movie) => (
                  <option key={movie._id} value={movie._id}>{movie.title}</option>
                ))}
              </select>
              <select name="movie3" className="movie-select" onChange={handleEditChange}>
                <option value="">Select a movie</option>
                {movies && movies.map((movie) => (
                  <option key={movie._id} value={movie._id}>{movie.title}</option>
                ))}
              </select>
            </div>
          </div>
          <button type="submit" className="submit-button">Submit Data</button>
        </form>}
      </div>
    </div>
  );
}

export default Addtheatres;
