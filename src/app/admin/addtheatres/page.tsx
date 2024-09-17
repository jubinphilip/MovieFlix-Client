'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './addtheatres.css'; // Import the CSS file
import { toast,ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchLocalMovies } from '@/app/services/services';

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
      try
      {
      const res:any = fetchLocalMovies()
      setMovies(res.data);
      }
      catch(error)
      {
        console.error(error);
      }
    };

    //Fetching  thetares from database
    const fetchTheatres = async () => {
      const url2 = 'http://localhost:9000/admin/gettheatre';
      try
    {
      const res = await axios.get(url2, { headers: { 'Authorization': `Bearer ${token}` } });
      setTheatre(res.data);
    }
    catch(error)
    {
      console.log(error)
    }
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
  const handleEdit =  (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const url = 'http://localhost:9000/admin/editmovies';
    console.log(editData)
    try{
     axios.post(url, editData, { headers: { 'Authorization': `Bearer ${token}` } }).then((res)=>
    {
      if(res.status===200)
      {
        toast.success(res.data.message)
      }
      else{
        toast.error(res.data.message)
      }
    });
  }
  catch(err)
  {
    toast.error("An Error Occured")
  }
  };
//Function for adding the theatre
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const url = 'http://localhost:9000/admin/addtheatre';
    try
    {
    await axios.post(url, data, { headers: { 'Authorization': `Bearer ${token}` } }).then((res)=>
    {
      if(res.status===200)
      {
        toast.success(res.data.message)
      }
      else
      {
        toast.error(res.data.error)
      }
    });
  }
  catch(err)
  {
    toast.error("An error Occured")
  }
  };

  return (
    <div className="container">
      <ToastContainer/>
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
