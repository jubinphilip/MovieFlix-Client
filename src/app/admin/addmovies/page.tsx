'use client';
import React, { useState } from 'react';
import axios from 'axios';
import './addmovies.css'; 
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type Data = {
  title: string;
  description: string;
  language: string;
  genre: string;
  rating: string;
  summary: string;
  actor: string;
  actress: string;
  director: string;
  production: string;
};

function Addmovies() {
  const [data, setData] = useState<Data>({} as Data);//state for setting data
  //3 states for storing 3 images
  const [image, setImage] = useState<File | null>(null);
  const [actorImage, setActorImage] = useState<File | null>(null);
  const [actressImage, setActressImage] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
//Function for Setting uploaded image
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    imageSetter: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    if (e.target.files) {
      imageSetter(e.target.files[0]);
    }
  };
//Submitting a=data
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
//Storing the token in a session
    const token = sessionStorage.getItem('adminToken'); // Retrieve token from sessionStorage

    //Appending all coontents to formdata beacause for elements contain multipart data

    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('language', data.language);
    formData.append('genre', data.genre);
    formData.append('rating', data.rating);
    formData.append('summary', data.summary);
    formData.append('actor', data.actor);
    formData.append('actress', data.actress);
    formData.append('director', data.director);
    formData.append('production', data.production);

    if (image) {
      formData.append('poster', image);
    }
    if (actorImage) {
      formData.append('actor_image', actorImage);
    }
    if (actressImage) {
      formData.append('actress_image', actressImage);
    }

    const url = 'http://localhost:9000/admin/addmovies';

    try {
      const response = await axios.post(url, formData, {
        //Bearer ${token} is a common format for OAuth 2.0 authentication. The Bearer keyword indicates that the token is being used for authorization, and ${token} is a placeholder for your actual token value.
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      if(response.status==200)
      {
        toast.success(response.data.message)
      }
      else
      {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error('Error adding movie:', error);
    }
  };

  return (
    <div className="addmovies-container">
      <ToastContainer/>
      <h1 className="addmovies-title">Add Movie</h1>
      <form onSubmit={handleSubmit} className="addmovies-form" encType="multipart/form-data">
        <div className="form-group">
          <label>Title:</label>
          <input type="text" name="title" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <input type="text" name="description" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Language:</label>
          <input type="text" name="language" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Poster:</label>
          <input type="file" name="poster" onChange={(e) => handleFileChange(e, setImage)} required />
        </div>
        <div className="form-group">
          <label>Genre:</label>
          <input type="text" name="genre" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Rating:</label>
          <input type="text" name="rating" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Movie Summary:</label>
          <input type="text" name="summary" onChange={handleChange} required />
        </div>
        <h3>Cast</h3>
        <div className="form-group">
          <label>Actor:</label>
          <input type="text" name="actor" onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Actress:</label>
          <input type="text" name="actress" onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Actor Image:</label>
          <input type="file" name="actor_image" onChange={(e) => handleFileChange(e, setActorImage)} required />
        </div>
        <div className="form-group">
          <label>Actress Image:</label>
          <input type="file" name="actress_image" onChange={(e) => handleFileChange(e, setActressImage)} required />
        </div>
        <div className="form-group">
          <label>Director:</label>
          <input type="text" name="director" onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Production:</label>
          <input type="text" name="production" onChange={handleChange} />
        </div>
        <button type="submit" className="addmovies-submit">Add Movie</button>
      </form>
    </div>
  );
}

export default Addmovies;