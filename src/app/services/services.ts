
import axios from 'axios';
//Fetching Movies from the database
export const fetchLocalMovies = async (role:string) => {
  //Role determines whether admin or user is fetching movies
  const url = `http://localhost:9000/${role}/getmovies`;
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

//Fetching List of theatres
export const fetchTheatres = async () => {
  const url = 'http://localhost:9000/user/gettheatres';
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching data: ", error);
    throw error; // Re-throw the error so it can be caught by the calling function
  }
};

//Image Service Api all of the images are displayed in the website from the uploads directory 
export function fetchImages(imageUrl:string){
  const url=`http://localhost:9000/uploads/${imageUrl}`;
  return url
}