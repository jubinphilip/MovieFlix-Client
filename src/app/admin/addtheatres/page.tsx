'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './addtheatres.css'; // Import the CSS file

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

  useEffect(() => {
    const token = sessionStorage.getItem('adminToken');//Taking token from sesssion
    setToken(token ? token : '');
    
    //Fetching already existing movies from the database
    const fetchMovies = async () => {
      const url = 'http://localhost:9000/admin/getmovies';
      const res = await axios.get(url, { headers: { 'Authorization': `Bearer ${token}` } });
      setMovies(res.data);
    };

    //Fetching  thetares from database
    const fetchTheatres = async () => {
      const url2 = 'http://localhost:9000/admin/gettheatre';
      const res = await axios.get(url2, { headers: { 'Authorization': `Bearer ${token}` } });
      setTheatre(res.data);
    };
    fetchMovies();
    fetchTheatres();
  }, []);

 //Function for setting thetare values 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target as HTMLInputElement | HTMLSelectElement;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  //Function for setting edited values

  const handleEditChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditdata((prev) => ({ ...prev, [name]: value }));
  };
//Function for editing currently running movies
  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const url = 'http://localhost:9000/admin/editmovies';
    await axios.post(url, editData, { headers: { 'Authorization': `Bearer ${token}` } });
  };
//Function for adding the theatre
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const url = 'http://localhost:9000/admin/addtheatre';
    await axios.post(url, data, { headers: { 'Authorization': `Bearer ${token}` } });
  };

  return (
    <div className="container">
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
              <select name="movie1" onChange={handleChange}>
                <option value="">Select a movie</option>
                {/*Mapping through the movies array for displaying it in the dropdown */}
                {movies.map((movie) => (
                  <option key={movie._id} value={movie._id}>{movie.title}</option>
                ))}
              </select>
              <select name="movie2" onChange={handleChange}>
                <option value="">Select a movie</option>
                {movies.map((movie) => (
                  <option key={movie._id} value={movie._id}>{movie.title}</option>
                ))}
              </select>
              <select name="movie3" onChange={handleChange}>
                <option value="">Select a movie</option>
                {movies.map((movie) => (
                  <option key={movie._id} value={movie._id}>{movie.title}</option>
                ))}
              </select>
            </div>
          </div>
          <button type="submit" className="submit-button">Add Theatre</button>
        </form>

        <form onSubmit={handleEdit} className="edit-form">
          <h1>Edit Movies</h1>
          <div className="form-group">
            <label>Select Theatre:</label>
            <select name="theatrename" onChange={handleEditChange}>
              <option value="">Select a theatre</option>
                  {/*Mapping through the theatres array for displaying it in the dropdown */}
              {theatres.map((theatre) => (
                <option key={theatre._id} value={theatre.theatrename}>{theatre.theatrename}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Select Movies:</label>
            <div className="select-group">
              <select name="movie1" onChange={handleEditChange}>
                <option value="">Select a movie</option>
                {movies.map((movie) => (
                  <option key={movie._id} value={movie._id}>{movie.title}</option>
                ))}
              </select>
              <select name="movie2" onChange={handleEditChange}>
                <option value="">Select a movie</option>
                {movies.map((movie) => (
                  <option key={movie._id} value={movie._id}>{movie.title}</option>
                ))}
              </select>
              <select name="movie3" onChange={handleEditChange}>
                <option value="">Select a movie</option>
                {movies.map((movie) => (
                  <option key={movie._id} value={movie._id}>{movie.title}</option>
                ))}
              </select>
            </div>
          </div>
          <button type="submit" className="submit-button">Submit Data</button>
        </form>
      </div>
    </div>
  );
}

export default Addtheatres;
