'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './userhome.css';
import Movieinfo from '../Components/movie';
import TmdbMovie from '../Components/tmdb';
import Slider from '../../admin/components/slider'

type Movies = {
  _id: string;
  title: string;
  language: string;
  poster: string;
  genre: string; 
  rating: number; 
}

interface Upcomingmovie {
  id: number;
  title: string;
  language: string;
  poster_path: string;
}

interface UpcomingmovieResponse {
  results: Upcomingmovie[];
}

function Userhome() {
  const [movies, setMovies] = useState<Movies[]>([]);
  const [upcomingMovies, setUpcomingmovies] = useState<Upcomingmovie[]>([]);//Setting movies from api
  const [movieInfo, setMovieinfo] = useState(false);//state for handling click on amovie
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState<string>('');
  const [rating, setRating] = useState<number | undefined>(undefined);
  const [movieId, setMovieId] = useState<string | number | undefined>();
  const [tmdbMovie,settmdbMovie]=useState(false)//State for handling click on tmdb movie


  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // Fetch movies from local server
        const url = 'http://localhost:9000/user/getmovies';
        const response = await axios.get(url);
        setMovies(response.data);
        console.log(response.data);

        try {
          // Fetch upcoming movies from TMDB API
          const tmdbResponse = await axios.get<UpcomingmovieResponse>("https://api.themoviedb.org/3/movie/upcoming?api_key=fe3cd914a480ec52c7dd38f24e8b82d0");
          const upcoming: Upcomingmovie[] = tmdbResponse.data.results;
          console.log(tmdbResponse.data.results);
          setUpcomingmovies(upcoming);
        } catch (tmdbError) {
          console.error("Error fetching upcoming movies:", tmdbError);
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
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
  
  const user = sessionStorage.getItem('username');//Storing the username in session
  console.log(movies);
//Function for handling click in amovie
  const handleMovieClick = (id: string) => {
    setMovieinfo(!movieInfo);
    setMovieId(id);
    window.scrollTo(0, 0);
  };
  //function for handling click in movie form tmdb api
  const handleTmdbClick = (id: number) => {
    settmdbMovie(!tmdbMovie)
    setMovieId(id);
    window.scrollTo(0, 0);
  };

  //for Filtering movies based on genre and rating the result in stored here and its mapped in the page
  const filteredMovies = movies
    .filter((movie) => {
      const matchesGenre = genre ? movie.genre === genre : true;
      const matchesRating = rating ? movie.rating >= rating : true;
      return (
        movie.title.toLowerCase().includes(search.toLowerCase()) &&
        matchesGenre &&
        matchesRating
      );
    });

  return (
    <div>
          <Slider/>

    <div className='container'>
      <h1 className='welcome_user'>Welcome {user}</h1>
  
      <div className='now-running_movies'>
        <h2 className='now_running_head'>Now Running On Theatres</h2>
        <input type="text" placeholder='Search by Movie Name' name='search_movie' value={search} onChange={(e) => setSearch(e.target.value)} />
        <div className='filters'>
          {/* Selecting genre for filtering movies */}
          <select value={genre} onChange={(e) => setGenre(e.target.value)}>
            <option value="">All Genres</option>
            <option value="Action">Action</option>
            <option value="Comedy">Comedy</option>
            <option value="Drama">Drama</option>
          </select>
{/* Selecting rating for filterng movies */}
          <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
            <option value="">All Ratings</option>
            <option value="3">3+</option>
            <option value="5">5+</option>
            <option value="7">7+</option>
            <option value="9">9+</option>
          </select>
        </div>
        <div className='now_running_cards'>
          {
            /* Mapping through the filtered movies */
            filteredMovies.map((item) => (
              <div key={item._id} className='now_running_card' onClick={() => handleMovieClick(item._id)}>
                <h3 className='movie_title'>{item.title}</h3>
                {/* the movie poster name is aquired from db and it is retrieved from upload folder from the server so image is given like this */}
                <img className='movie_image' src={`http://localhost:9000/uploads/${item.poster}`} alt={item.title} />
                <p>{item.language}</p>
              </div>
            ))
          }
        </div>
      </div>

          {/*on clicking on a movie the state and movie id is passed to a compnent and that particular movie details are displayed in that component  */}
      {movieInfo && <Movieinfo movieId={movieId} movieState={setMovieinfo} />}
      {tmdbMovie && <TmdbMovie movieId={movieId} movieState={settmdbMovie} />}


      <div className="upcoming-movies">
        <h2 className="upcoming-head">Trending Movies</h2>
        <div className='upcoming_cards'>
          {/* mapping through movies form tmdb api */}
          {upcomingMovies.map((movie, index) => (
            <div key={index} className='upcoming_card'>
              <h3 className='movie_title'>{movie.title}</h3>
              <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} className='movie_image' alt={movie.title}  onClick={() => handleTmdbClick(movie.id)} />
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
