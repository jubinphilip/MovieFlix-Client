'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './theatres.module.css'
import { fetchImages, fetchTheatres } from '@/app/services/services'

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
    movie1: Movie;
    movie2: Movie;
    movie3: Movie;
  };
}

function Theatres() {
  const [theatres, setTheatres] = useState<Theatres[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter()

  useEffect(() => {
    const fetchTheatreList = async () => {
      try {
        const data = await fetchTheatres()
        setTheatres(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data: ", error);
        setLoading(false);
      }
    }
    fetchTheatreList();
  }, []);

  const handleClick = (id: string) => {
    router.push(`/user/showtheatre/${id}`);
  };

  const filteredTheatres = theatres.filter(theatre =>
    theatre.theatreloc.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <p>Loading theatres...</p>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Theatres</h1>
      <input
        className={styles.searchInput}
        type="text"
        placeholder='Search by Place'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className={styles.theatreContainer}>
      {filteredTheatres.length > 0 ? (
        filteredTheatres.map((theatre) => (
          <div key={theatre._id} className={styles.theatreItem}>
            <h2 className={styles.theatreName}>{theatre.theatrename} - {theatre.theatreloc}</h2>
            <p className={styles.theatreInfo}>Ticket Price: {theatre.ticketprice}</p>
            <div>
              <h3>Movies:</h3>
              <ul className={styles.moviesList}>
                {theatre.movies.movie1 && (
                  <li className={styles.movieItem}>
                    <img
                      className={styles.moviePoster}
                      src={fetchImages(theatre.movies.movie1?.poster)}
                      alt={theatre.movies.movie1?.title}
                      onClick={() => handleClick(theatre.movies.movie1?._id)}
                    />
                    <p className={styles.movieTitle}>{theatre.movies.movie1.title || 'N/A'}</p>
                  </li>
                )}
                {theatre.movies.movie2 && (
                  <li className={styles.movieItem}>
                    <img
                      className={styles.moviePoster}
                      src={fetchImages(theatre.movies.movie2?.poster)}
                      alt={theatre.movies.movie2?.title}
                      onClick={() => handleClick(theatre.movies.movie2?._id)}
                    />
                    <p className={styles.movieTitle}>{theatre.movies.movie2.title || 'N/A'}</p>
                  </li>
                )}
                {theatre.movies.movie3 && (
                  <li className={styles.movieItem}>
                    <img
                      className={styles.moviePoster}
                      src={fetchImages(theatre.movies.movie3?.poster)}
                      alt={theatre.movies.movie3?.title}
                      onClick={() => handleClick(theatre.movies.movie3?._id)}
                    />
                    <p className={styles.movieTitle}>{theatre.movies.movie3.title || 'N/A'}</p>
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
    </div>
  );
}

export default Theatres;