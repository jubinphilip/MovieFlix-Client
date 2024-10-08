import { getMovieInfo, updateMovieInfo } from '@/app/services/services';
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './edit.module.css';
import { fetchImages } from '@/app/services/services';

interface EditMovieProps {
  movieId: string | null;
  movieState: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditMovie: React.FC<EditMovieProps> = ({ movieId, movieState }) => {
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

  const [actorPreview, setActorPreview] = useState<string | null>(null);
  const [actressPreview, setActressPreview] = useState<string | null>(null);
  const [posterPreview, setPosterPreview] = useState<string | null>(null);

  // Fetching information of that particular movie from the database
  useEffect(() => {
    const fetchMovie = async () => {
      const data = movieId ? await getMovieInfo(movieId) : null;
      setMovieData(data);
    };
    fetchMovie();
  }, [movieId]);

  console.log(movieData)
  // Handling change of images
  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'actor' | 'actress' | 'poster'
  ) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setImageFiles((prev) => ({ ...prev, [`${type}Image`]: file }));

      // Set the preview URL
      const previewUrl = URL.createObjectURL(file);
      if (type === 'actor') {
        setActorPreview(previewUrl);
      } else if (type === 'actress') {
        setActressPreview(previewUrl);
      } else if (type === 'poster') {
        setPosterPreview(previewUrl);
      }
    }
  };

  // Handling form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData();

    // Appending information to formData for dealing with image uploads
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
      formData.append('actor_image', imageFiles.actorImage);
    }
    if (imageFiles.actressImage) {
      formData.append('actress_image', imageFiles.actressImage);
    }
    if (imageFiles.posterImage) {
      formData.append('poster', imageFiles.posterImage);
    }

    const token = sessionStorage.getItem('adminToken');
    if (!token || !movieId) {
      console.error('Token or Movie ID is missing');
      return;
    }

    // Calling the API service for movie updation
    try {
      const response = await updateMovieInfo(movieId, formData, token);
      toast.success(response.data.message);
    } catch (error) {
      console.error('Error updating movie:', error);
    }
  };

  // Function for closing the modal
  const handleClose = () => {
    movieState(false);
  };

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
          <img src={actorPreview || fetchImages(movieData?.cast?.actor_image)} alt="Actor" className={styles.imagePreview} />
          <input type="file" accept=".jpg,.jpeg,.png,.avif,.webp" onChange={(e) => handleImageChange(e, 'actor')} />

          <label className={styles.label}>Actress:</label>
          <input type="text" name="actress" defaultValue={movieData.cast.actress} placeholder={movieData.cast.actress} className={styles.input} />
          <label className={styles.label}>Actress Image:</label>
          <img src={actressPreview || fetchImages(movieData?.cast?.actress_image)}  alt="Actress"  className={styles.imagePreview} />
          <input type="file" accept=".jpg,.jpeg,.png,.avif,.webp" onChange={(e) => handleImageChange(e, 'actress')} />

          <label className={styles.label}>Director:</label>
          <input type="text" name="director" defaultValue={movieData.cast.director} placeholder={movieData.cast.director} className={styles.input} />

          <label className={styles.label}>Production:</label>
          <input type="text" name="production" defaultValue={movieData.cast.production} placeholder={movieData.cast.production} className={styles.input} />
          <label className={styles.label}>Poster Image:</label>
          <img src={posterPreview || fetchImages(movieData.poster)} alt="Poster" className={styles.imagePreview} />
          <input type="file" accept=".jpg,.jpeg,.png,.avif,.webp" onChange={(e) => handleImageChange(e, 'poster')} />

          <button type="submit" className={styles.button}>Save</button>
        </form>
      </div>
    </div>
  );
};

export default EditMovie;
