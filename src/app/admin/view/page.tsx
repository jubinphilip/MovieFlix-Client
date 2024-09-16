'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './view.css'; 

type Movie = {
  _id: string;
  title: string;
  description: string;
  poster: string;
  summary: string;
};

function View() {
  const [data, setData] = useState<Movie[]>([]);
  const token = sessionStorage.getItem('adminToken');

  useEffect(() => {
    //Function for getting all movies
    const fetchData = async () => {
      const url = 'http://localhost:9000/admin/getmovies';
      const res = await axios.get(url, { headers: { 'Authorization': `Bearer ${token}` } });
      setData(res.data);
    };

    fetchData();
  }, [token]);

  return (
    <div className="container">
      <h1 className="header">Movie List</h1>
      <div className="movie-grid">
        {data.map((item) => (
          <div key={item._id} className="movie-card">
            <img src={`http://localhost:9000/uploads/${item.poster}`} alt={item.title} className="movie-poster" />
            <div className="movie-details">
              <h2 className="movie-title">{item.title}</h2>
              <p className="movie-description">{item.description}</p>
              <p className="movie-summary">{item.summary}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default View;
