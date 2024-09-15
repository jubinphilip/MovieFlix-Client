'use client'

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import './theatres.css'

interface Movie {
  _id: string;
  title: string;
  poster: string;
}

interface Theatres {
  _id: string;
  theatrename: string;
  theatreloc: string;
  ticketprice: string;
  movies: {
    movie1: Movie | null; 
    movie2: Movie | null;
    movie3: Movie | null;
  };
}

function Theatres() {
  const [theatres, setTheatres] = useState<Theatres[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const url = 'http://localhost:9000/user/gettheatres';
    axios.get(url)
      .then((res) => {
        setTheatres(res.data);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, []);

  const filteredTheatres = theatres.filter(theatre =>
    theatre.theatreloc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="theatres-container">
      <h1>Theatres</h1>
      <input 
        type="text" 
        placeholder='Search by Place' 
        value={search} 
        onChange={(e) => setSearch(e.target.value)} 
      />
      {filteredTheatres.length > 0 ? (
        filteredTheatres.map((theatre) => (
          <div key={theatre._id} className="theatre-item">
            <h2>{theatre.theatrename} - {theatre.theatreloc}</h2>
            <p>Ticket Price: {theatre.ticketprice}</p>
            <div>
              <h3>Movies:</h3>
              <ul className="movies-list">
                {theatre.movies.movie1 && (
                  <li>
                    <img 
                      src={`http://localhost:9000/uploads/${theatre.movies.movie1?.poster}`} 
                      alt={theatre.movies.movie1?.title} 
                    />
                    <p>{theatre.movies.movie1.title || 'N/A'}</p>
                  </li>
                )}
                {theatre.movies.movie2 && (
                  <li>
                    <img 
                      src={`http://localhost:9000/uploads/${theatre.movies.movie2?.poster}`} 
                      alt={theatre.movies.movie2?.title} 
                    />
                    <p>{theatre.movies.movie2.title || 'N/A'}</p>
                  </li>
                )}
                {theatre.movies.movie3 && (
                  <li>
                    <img 
                      src={`http://localhost:9000/uploads/${theatre.movies.movie3?.poster}`} 
                      alt={theatre.movies.movie3?.title} 
                    />
                    <p>{theatre.movies.movie3.title || 'N/A'}</p>
                  </li>
                )}
              </ul>
            </div>
          </div>
        ))
      ) : (
        <p>No theatres found for the given location.</p>
      )}
    </div>
  );
}

export default Theatres;
