'use client';
import React, { useEffect, useState } from 'react';
import './view.css'; 
import { fetchImages, fetchLocalMovies } from '@/app/services/services';

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
     
      const res = await fetchLocalMovies('admin')
      setData(res);
    };

    fetchData();
  }, [token]);

  return (
    <div className="container">
      <h1 className="header">Movie List</h1>
      <div className="movie-grid">
        {data.map((item) => (
          <div key={item._id} className="movie-card">
            {/* getting images using the fetchImage api */}
            <img src={fetchImages(item.poster)} alt={item.title} className="movie-poster" />
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
