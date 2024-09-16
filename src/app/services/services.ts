
import axios from 'axios';
//Fetching Movies from the database
export const fetchLocalMovies = async () => {
  const url = 'http://localhost:9000/user/getmovies';
  try {
    const response = await axios.get(url);
    return response.data; 
  } catch (error) {
    console.error('Error fetching local movies:', error);
    throw error;
  }
};
//Fetching Data from TmDb api 
export const fetchUpcomingMovies = async () => {
  const tmdbApiKey = 'fe3cd914a480ec52c7dd38f24e8b82d0';
  const url = `https://api.themoviedb.org/3/movie/upcoming?api_key=${tmdbApiKey}`;

  try {
    const response = await axios.get(url);
    return response.data.results; // Assuming results is the array of movies
  } catch (error) {
    console.error('Error fetching upcoming movies:', error);
    throw error;
  }
};
