'use client';
import React, { useState } from 'react';
import axios from 'axios';
import styles from './addmovies.module.css'; 
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
  const [data, setData] = useState<Data>({} as Data);
  const [image, setImage] = useState<File | null>(null);
  const [actorImage, setActorImage] = useState<File | null>(null);
  const [actressImage, setActressImage] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    imageSetter: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    if (e.target.files) {
      imageSetter(e.target.files[0]);
    }
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (Number(data.rating) > 10) {
      return toast.error("Rating should be less than or equal to 10");
    }

    const token = sessionStorage.getItem('adminToken');
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
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        toast.success(response.data.message);
        router.push('/admin/adminhome');
      }
    } catch (error: any) {
      if (error.response) {
        console.error('Error response from server:', error.response.data);
        toast.error(error.response.data.message);
      } else {
        console.error('Error setting up request:', error.message);
        toast.error('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className={styles.addmoviesContainer}>
      <ToastContainer />
      <h1 className={styles.addmoviesTitle}>Add Movie</h1>
      <form onSubmit={handleSubmit} className={styles.addmoviesForm} encType="multipart/form-data">
        <div className={styles.formGroup}>
          <label>Title:</label>
          <input type="text" name="title" onChange={handleChange} required />
        </div>
        <div className={styles.formGroup}>
          <label>Description:</label>
          <input type="text" name="description" onChange={handleChange} required />
        </div>
        <div className={styles.formGroup}>
          <label>Language:</label>
          <input type="text" name="language" onChange={handleChange} required />
        </div>
        <div className={styles.formGroup}>
          <label>Poster:</label>
          <input type="file" accept=".jpg,.jpeg,.png,.avif,.webp" name="poster" onChange={(e) => handleFileChange(e, setImage)} required />
        </div>
        <div className={styles.formGroup}>
          <label>Genre:</label>
          <input type="text" name="genre" onChange={handleChange} required />
        </div>
        <div className={styles.formGroup}>
          <label>Rating:</label>
          <input type="number" name="rating" placeholder='Enter rating out of 10' onChange={handleChange} required />
        </div>
        <div className={styles.formGroup}>
          <label>Movie Summary:</label>
          <input type="text" name="summary" onChange={handleChange} required />
        </div>
        <h3>Cast</h3>
        <div className={styles.formGroup}>
          <label>Actor:</label>
          <input type="text" name="actor" onChange={handleChange} />
        </div>
        <div className={styles.formGroup}>
          <label>Actress:</label>
          <input type="text" name="actress" onChange={handleChange} />
        </div>
        <div className={styles.formGroup}>
          <label>Actor Image:</label>
          <input type="file" name="actor_image" accept=".jpg,.jpeg,.png,.avif,.webp" onChange={(e) => handleFileChange(e, setActorImage)} required />
        </div>
        <div className={styles.formGroup}>
          <label>Actress Image:</label>
          <input type="file" name="actress_image" accept=".jpg,.jpeg,.png,.avif,.webp" onChange={(e) => handleFileChange(e, setActressImage)} required />
        </div>
        <div className={styles.formGroup}>
          <label>Director:</label>
          <input type="text" name="director" onChange={handleChange} />
        </div>
        <div className={styles.formGroup}>
          <label>Production:</label>
          <input type="text" name="production" onChange={handleChange} />
        </div>
        <button type="submit" className={styles.addmoviesSubmit}>Add Movie</button>
      </form>
    </div>
  );
}

export default Addmovies;
