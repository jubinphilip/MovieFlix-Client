'use client';
import React, { useEffect, useState } from 'react';
import './view.css'; 
import { fetchImages, fetchLocalMovies } from '@/app/services/services';
import Slider from '../components/slider';
import EditMovie from '../components/editmovie';

type Movie = {
  _id: string;
  title: string;
  description: string;
  poster: string;
  summary: string;
};

function Home() {
  const [data, setData] = useState<Movie[]>([]);
  const [isedit,setIsedit]=useState(false)
  const[movieId,setMovieId]=useState('')

  let token:string |null=''

  useEffect(() => {
    //Function for getting all movies
    const token=sessionStorage.getItem('adminToken');
    const fetchData = async () => {
     //calling service for getting movies list
      const res = await fetchLocalMovies('admin')
      setData(res);
    };

    fetchData();
  }, [token]);
  const handleEdit=async(movieid:string)=>{
    setIsedit(true)
    setMovieId(movieid)
    console.log("movieid",movieid)
    
  }
  return (
    <div className="container">
      <Slider/>
      {isedit && <EditMovie movieId={movieId?movieId:""} movieState={setIsedit}  />}
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
              <button onClick={()=>handleEdit(item._id)} className='edit-button'>Edit Movie</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
