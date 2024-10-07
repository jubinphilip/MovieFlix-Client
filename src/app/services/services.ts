
import axios from 'axios';
//Fetching Movies from the database
export const fetchLocalMovies = async (role:string) => {
  //Role determines whether admin or user is fetching movies
  const url = `https://movieflix-server.onrender.com/${role}/getmovies`;
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
  const url = 'https://movieflix-server.onrender.com/user/gettheatres';
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
  const url=`https://movieflix-server.onrender.com/uploads/${imageUrl}`;
  return url
}
//helper function for getting movie info
export async function getMovieInfo(movieId: string | number | undefined) {
  const url = `https://movieflix-server.onrender.com/user/getmovieinfo/${movieId}`;
  
  try {
    const res = await axios.get(url);
    return res.data;  // This will return the movie data properly
  } catch (error) {
    console.error('Error fetching movie info:', error);
    return undefined;  // Handle the error case by returning undefined
  }
}
//helper function for gettting thetre
export async function getShowTheatre(movieId:string)
{
  const url = `https://movieflix-server.onrender.com/user/getshowtheatre/${movieId}`; //getting all show information with the particular movie
  try{
  const res = await axios.get(url);
  return res.data;
  }catch (error) {
    console.error('Error fetching Theatre info:', error);
    return undefined;  // Handle the error case by returning undefined
  }
}
//helper function for geting show details
export async function getShowDetails(showid:any)
{
  const showUrl = `https://movieflix-server.onrender.com/user/getshow/${showid}`;
  try
  {
  const showResponse = await axios.get(showUrl);
  return showResponse.data;
  }
  catch (error) {
    console.error('Error fetching Show info:', error);
  }
}
//helper function for getting the bookings data
export async function getBookings(seats:any)
{
  const bookingsUrl = 'https://movieflix-server.onrender.com/user/getbookings';
  const bookingsResponse = await axios.get(bookingsUrl, { params:seats });
  return bookingsResponse.data.bookedSeats;
}



//Admin Functions 


//Login


export const adminLogin = async (data: any) => {
  try {
    const response = await axios.post('https://movieflix-server.onrender.com/admin/login', data);
    return response.data; // Return the response data
  } catch (error) {
    throw error;  
  }
};
//Adds Theatre
export async function addTheatre(data: any, token: any) {
  const url = 'https://movieflix-server.onrender.com/admin/addtheatre';
  try {
    const response = await axios.post(url, data, { 
      headers: { 'Authorization': `Bearer ${token}` } 
    });
    return response;  //return response
  } catch (error: any) {
   
    console.error("Error occurred while adding theatre:", error);
    if (error.response) {
      return {
        status: error.response.status,
        data: { error: error.response.data.message || 'Failed to add theatre' },
      };
    } else {
      // Handle network or other unexpected errors
      return {
        status: 500,
        data: { error: 'Server error or network issue' },
      };
    }
  }
}

//Function For Editing Movies
export async function editMovies(editData: any, token: any) {
  const url = 'https://movieflix-server.onrender.com/admin/editmovies';
  try {
    const response = await axios.post(url, editData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error: any) {
    console.error("Error occurred while editing movies:", error);

    if (error.response) {
      return {
        status: error.response.status,
        data: { error: error.response.data.message || 'Failed to edit movie' },
      };
    } else {
      return {
        status: 500,
        data: { error: 'Server error or network issue' },
      };
    }
  }
}

//Function For getting Shows
export const getShows = async (token: string) => {
  try {
    const response = await axios.get('https://movieflix-server.onrender.com/admin/getshows', {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching shows:", error);
    throw error; // Re-throw the error so it can be caught in the calling function
  }
};

//Function For deleting a Show 
export const deleteShow = async (id: string, token: string) => {
  const url = `https://movieflix-server.onrender.com/admin/deleteshow/${id}`;
  
  if (!token) {
    throw new Error("Token is required for authentication");
  }

  try {
    const response = await axios.delete(url, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.data; // Return the response data
  } catch (error: any) {
    console.error("Error deleting show:", error);
    throw error; // Re-throw the error to be handled in the calling function
  }
};


//Function for getting movies on a particular theatre
export const getTheatre = async (theatreId: string, token: string) => {
  if (!token) {
    throw new Error("Token is required for authentication");
  }

  try {
    const response = await axios.get(`https://movieflix-server.onrender.com/admin/gettheatre/${theatreId}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.data; // Return the theatre data
  } catch (error: any) {
    console.error("Error fetching theatre details:", error);
    throw error; // Re-throw the error to be handled in the calling function
  }
};

//Function For adding a Show 
export const addShow = async (showData: any, token: string) => {
  if (!token) {
    throw new Error("Token is required for authentication");
  }

  try {
    const response = await axios.post('https://movieflix-server.onrender.com/admin/addshows', showData, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.data; // Return the response data
  } catch (error: any) {
    console.error("Error adding show:", error);
    throw error; // Re-throw the error to be handled in the calling function
  }
};
export const updateMovieInfo = async (movieId: string, formData: FormData, token: string) => {
  try {
    console.log("Function Called")
    console.log(movieId,formData,token)
    const response = await axios.post(`https://movieflix-server.onrender.com/admin/updatemovie/${movieId}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};