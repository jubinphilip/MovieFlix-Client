'use client';
import React, { useEffect, useState } from 'react';
import './userhome.css';
import Movieinfo from '../Components/movie';
import TmdbMovie from '../Components/tmdb';
import Slider from '../../admin/components/slider';
import { fetchImages, fetchLocalMovies, fetchUpcomingMovies } from '../../services/services'; // Import the API call functions

type Movies = {
  _id: string;
  title: string;
  language: string;
  poster: string;
  genre: string;
  rating: number;
};

interface Upcomingmovie {
  id: number;
  title: string;
  language: string;
  poster_path: string;
}

function Userhome() {
  const [movies, setMovies] = useState<Movies[]>([]);
  const [upcomingMovies, setUpcomingmovies] = useState<Upcomingmovie[]>([]);
  const [movieInfo, setMovieinfo] = useState(false);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState<string>('');
  const [rating, setRating] = useState<number | undefined>(undefined);
  const [movieId, setMovieId] = useState<string | number | undefined>();
  const [tmdbMovie, settmdbMovie] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {

        const localMovies = await fetchLocalMovies('user');//Fetch movies stored in the db
        setMovies(localMovies);

        // Fetch upcoming movies from TMDB API function returns movies from tmdb api
        const upcoming = await fetchUpcomingMovies();
        setUpcomingmovies(upcoming);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (movieInfo || tmdbMovie) {
      document.body.style.overflow = 'hidden'; // Disable scrolling
    } else {
      document.body.style.overflow = 'auto'; // Re-enable scrolling when modal is closed
    }

    return () => {
      document.body.style.overflow = 'auto'; // Clean up on component unmount
    };
  }, [movieInfo, tmdbMovie]);

  const user = sessionStorage.getItem('username');
  console.log(movies);

  const handleMovieClick = (id: string) => {
    setMovieinfo(!movieInfo);
    setMovieId(id);
    window.scrollTo(0, 0);
  };

  const handleTmdbClick = (id: number) => {
    settmdbMovie(!tmdbMovie);
    setMovieId(id);
    window.scrollTo(0, 0);
  };

  const filteredMovies = movies.filter((movie) => {
    const matchesGenre = genre ? movie.genre === genre : true;
    const matchesRating = rating ? movie.rating >= rating : true;
    return movie.title.toLowerCase().includes(search.toLowerCase()) && matchesGenre && matchesRating;
  });

  return (
    <div>
      <Slider />
      <div className="container">
        <h1 className="welcome_user">Welcome {user}</h1>

        <div className="now-running_movies">
          <h2 className="now_running_head">Now Running On Theatres</h2>
          <input type="text" placeholder="Search by Movie Name" name="search_movie" value={search} onChange={(e) => setSearch(e.target.value)} />
          <div className="filters">
            <select value={genre} onChange={(e) => setGenre(e.target.value)}>
              <option value="">All Genres</option>
              <option value="Action">Action</option>
              <option value="Comedy">Comedy</option>
              <option value="Drama">Drama</option>
            </select>
            <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
              <option value="">All Ratings</option>
              <option value="3">3+</option>
              <option value="5">5+</option>
              <option value="7">7+</option>
              <option value="9">9+</option>
            </select>
          </div>
          <div className="now_running_cards">
            {filteredMovies.map((item) => (
              <div key={item._id} className="now_running_card" onClick={() => handleMovieClick(item._id)}>
                <h3 className="movie_title">{item.title}</h3>
                <img className="movie_image" src={fetchImages(item.poster)} alt={item.title} />
                <p>{item.language}</p>
              </div>
            ))}
          </div>
        </div>

        {movieInfo && <Movieinfo movieId={movieId} movieState={setMovieinfo} />}
        {tmdbMovie && <TmdbMovie movieId={movieId} movieState={settmdbMovie} />}

        <div className="upcoming-movies">
          <h2 className="upcoming-head">Trending Movies</h2>
          <div className="upcoming_cards">
            {upcomingMovies.map((movie, index) => (
              <div key={index} className="upcoming_card">
                <h3 className="movie_title">{movie.title}</h3>
                <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} className="movie_image" alt={movie.title} onClick={() => handleTmdbClick(movie.id)} />
                <p>{movie.language}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Userhome;
