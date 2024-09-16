import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { IoCloseCircleSharp } from 'react-icons/io5';
import styles from './styles/tmdb.module.css';


interface MovieDetailsProps {
  movieId: string | undefined | number;
  movieState: React.Dispatch<React.SetStateAction<boolean>>;
}

interface MovieInfo {
  poster_path: string;
  original_title: string;
  original_language: string;
  release_date: string;
  runtime: string;
  tagline: string;
  overview: string;
  genres: genres[];
  production_companies: production[];
}

interface genres {
  name: string;
}

interface production {
  logo_path: string;
  name: string;
}

function TmdbMovie({ movieId, movieState }: MovieDetailsProps) {
  const [movieInfo, setMovieInfo] = useState<MovieInfo | undefined>(undefined);

  const handleClose = () => {
    movieState(false);
  };

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=fe3cd914a480ec52c7dd38f24e8b82d0`;
        const response = await axios.get(url);
        setMovieInfo(response.data);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };

    if (movieId) {
      fetchMovieDetails();
    }
  }, [movieId]);

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <IoCloseCircleSharp onClick={handleClose} className={styles['close-icon']} />
  
        {movieInfo && (
          <div className={styles['movie-info']}>
            <img
              src={`https://image.tmdb.org/t/p/w500/${movieInfo.poster_path}`}
              alt="Movie Poster"
              className={styles['movie-poster']}
            />
  
            <div>
              <h1>{movieInfo.original_title}</h1>
              <p>Language: {movieInfo.original_language}</p>
              <p>Release date: {movieInfo.release_date}</p>
              <p>Duration: {movieInfo.runtime} mins</p>
              <p>Overview: {movieInfo.overview}</p>
              <p>Tagline: {movieInfo.tagline}</p>
              <p>Genre: {movieInfo.genres.length > 0 ? movieInfo.genres[0].name : 'N/A'}</p>
  
              {movieInfo.production_companies.length > 0 && (
                <div className={styles['production-company']}>
                  <img
                    src={`https://image.tmdb.org/t/p/w500/${movieInfo.production_companies[0].logo_path}`}
                    alt={`${movieInfo.production_companies[0].name} logo`}
                  />
                  <p>Production: {movieInfo.production_companies[0].name}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}  

export default TmdbMovie;
