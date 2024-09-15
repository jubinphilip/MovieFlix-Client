import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IoCloseCircleSharp } from 'react-icons/io5';
import './styles//movieinfo.css'; 

interface MovieDetailsProps {
  movieId: string | undefined | number;
  movieState: React.Dispatch<React.SetStateAction<boolean>>;
}
interface Movie {
  title: string;
  description: string;
  language: string;
  genre: string;
  rating: string;
  poster: string;
  summary: string;
  cast: {
    actor: string;
    actor_image: string;
    actress: string;
    actress_image: string;
    director: string;
    production: string;
  };
}

function Movieinfo({ movieId, movieState }: MovieDetailsProps) {
  const [movieInfo, setMovieInfo] = useState<Movie>();
  const router = useRouter();

  useEffect(() => {
    const url = `http://localhost:9000/user/getmovieinfo/${movieId}`;
    axios.get(url).then((res) => {
      setMovieInfo(res.data);
    });
  }, [movieId]);

  const handleBookTickets = () => {
    router.push(`/user/showtheatre/${movieId}`);
  };

  const handleClose = () => {
    movieState(false);
  };

  return (
    <div className="overlay">
      <div className="movie-info-container">
        <IoCloseCircleSharp className="close-icon" onClick={handleClose} />
        {movieInfo && (
          <div className="movie-details">
            <div className="movie-header">
              <img
                src={`http://localhost:9000/uploads/${movieInfo.poster}`}
                alt={movieInfo.title}
                className="movie-poster"
              />
              <div className="movie-meta">
                <h1>{movieInfo.title}</h1>
                <p>Language: {movieInfo.language}</p>
                <p>Genre: {movieInfo.genre}</p>
                <p>Rating: {movieInfo.rating}</p>
                <p>Summary: {movieInfo.summary}</p>
              </div>
            </div>
            <h2>Cast & Crew</h2>
            <div className="cast-info">
              <div className="cast-member">
                <img
                  src={`http://localhost:9000/uploads/${movieInfo.cast.actor_image}`}
                  alt={movieInfo.cast.actor}
                />
                <p>Actor: {movieInfo.cast.actor}</p>
              </div>
              <div className="cast-member">
                <img
                  src={`http://localhost:9000/uploads/${movieInfo.cast.actress_image}`}
                  alt={movieInfo.cast.actress}
                />
                <p>Actress: {movieInfo.cast.actress}</p>
              </div>
              <p>Director: {movieInfo.cast.director}</p>
              <p>Production: {movieInfo.cast.production}</p>
            </div>
            <button className="book-tickets-btn" onClick={handleBookTickets}>
              Book Tickets
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Movieinfo;
