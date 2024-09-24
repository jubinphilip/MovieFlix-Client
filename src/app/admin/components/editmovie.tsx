import { getMovieInfo, updateMovieInfo } from '@/app/services/services';
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './edit.module.css';

interface EditMovieProps {
  movieId: string | null;
  movieState: React.Dispatch<React.SetStateAction<boolean>>;
} // true if in edit mode 


const EditMovie: React.FC<EditMovieProps> = ({ movieId, movieState}) => {
  const [movieData, setMovieData] = useState<any | null>(null);
  const [imageFiles, setImageFiles] = useState<{
    actorImage: File | null;
    actressImage: File | null;
    posterImage: File | null;
  }>({
    actorImage: null,
    actressImage: null,
    posterImage: null,
  });
//Fetching information of that particular movie from the databse
  useEffect(() => {
    const fetchMovie = async () => {
      const data = movieId ? await getMovieInfo(movieId) : null;
      setMovieData(data);
    };
    fetchMovie();
  }, [movieId]);

  //handling change of images
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'actor' | 'actress' | 'poster') => {
    if (e.target.files) {
      const file = e.target.files[0];
      setImageFiles((prev) => ({ ...prev, [`${type}Image`]: file }));
    }
  };

  //handling form submisssion
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData();
//appending informatin to formdata for dealing with imageuploads
    formData.append('title', (form.elements.namedItem('title') as HTMLInputElement).value);
    formData.append('description', (form.elements.namedItem('description') as HTMLTextAreaElement).value);
    formData.append('language', (form.elements.namedItem('language') as HTMLInputElement).value);
    formData.append('genre', (form.elements.namedItem('genre') as HTMLInputElement).value);
    formData.append('rating', (form.elements.namedItem('rating') as HTMLInputElement).value);
    formData.append('summary', (form.elements.namedItem('summary') as HTMLTextAreaElement).value);
    formData.append('actor', (form.elements.namedItem('actor') as HTMLInputElement).value);
    formData.append('actress', (form.elements.namedItem('actress') as HTMLInputElement).value);
    formData.append('director', (form.elements.namedItem('director') as HTMLInputElement).value);
    formData.append('production', (form.elements.namedItem('production') as HTMLInputElement).value);

    if (imageFiles.actorImage) {
      formData.append('actor', imageFiles.actorImage);
    }
    if (imageFiles.actressImage) {
      formData.append('actress', imageFiles.actressImage);
    }
    if (imageFiles.posterImage) {
      formData.append('poster', imageFiles.posterImage);
    }

    const token = sessionStorage.getItem('adminToken');
    if (!token || !movieId) {
      console.error('Token or Movie ID is missing');
      return;
    }
//calling the api service for movie updation
    try {
      const response = await updateMovieInfo(movieId, formData, token);
      toast.success(response.data.message);
    } catch (error) {
      console.error('Error updating movie:', error);
    }
  };
  //fucntion for closing the modal
  function handleClose()
  {
    movieState(false)
  }

  if (!movieState || !movieData) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={handleClose}>X</button>
        <ToastContainer />
        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label}>Movie Title:</label>
          <input type="text" name="title" defaultValue={movieData.title} placeholder={movieData.title} className={styles.input} />

          <label className={styles.label}>Description:</label>
          <textarea name="description" defaultValue={movieData.description} placeholder={movieData.description} className={styles.textarea} />

          <label className={styles.label}>Language:</label>
          <input type="text" name="language" defaultValue={movieData.language} placeholder={movieData.language} className={styles.input} />

          <label className={styles.label}>Genre:</label>
          <input type="text" name="genre" defaultValue={movieData.genre} placeholder={movieData.genre} className={styles.input} />

          <label className={styles.label}>Rating:</label>
          <input type="text" name="rating" defaultValue={movieData.rating} placeholder={movieData.rating} className={styles.input} />

          <label className={styles.label}>Summary:</label>
          <textarea name="summary" defaultValue={movieData.summary} placeholder={movieData.summary} className={styles.textarea} />

          <h3>Cast Information</h3>
          <label className={styles.label}>Actor:</label>
          <input type="text" name="actor" defaultValue={movieData.cast.actor} placeholder={movieData.cast.actor} className={styles.input} />
          <label className={styles.label}>Actor Image:</label>
          <input type="file" onChange={(e) => handleImageChange(e, 'actor')} />

          <label className={styles.label}>Actress:</label>
          <input type="text" name="actress" defaultValue={movieData.cast.actress} placeholder={movieData.cast.actress} className={styles.input} />
          <label className={styles.label}>Actress Image:</label>
          <input type="file" onChange={(e) => handleImageChange(e, 'actress')} />

          <label className={styles.label}>Director:</label>
          <input type="text" name="director" defaultValue={movieData.cast.director} placeholder={movieData.cast.director} className={styles.input} />

          <label className={styles.label}>Production:</label>
          <input type="text" name="production" defaultValue={movieData.cast.production} placeholder={movieData.cast.production} className={styles.input} />

          <label className={styles.label}>Poster Image:</label>
          <input type="file" onChange={(e) => handleImageChange(e, 'poster')} />

          <button type="submit" className={styles.button}>Save</button>
        </form>
      </div>
    </div>
  );
};

export default EditMovie;
