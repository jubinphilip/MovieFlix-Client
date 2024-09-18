import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { IoCloseCircleSharp } from 'react-icons/io5';
import styles from './styles/movieinfo.module.css';
import { fetchImages } from '@/app/services/services';

interface MovieDetailsProps {
  movieId: string | undefined | number;
  movieState: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Movie {
  title: string;
  description: string;
  language: string;
  genre: string;
  rating: string;
  poster: string;
  summary: string;
  cast: {
    actor: string;
    actor_image: string;
    actress: string;
    actress_image: string;
    director: string;
    production: string;
  };
}

const Movieinfo = ({ movieId, movieState }: MovieDetailsProps) => {
  const [movieInfo, setMovieInfo] = useState<Movie>();
  const router = useRouter();

  //getting infrmation of the movie clicked by the user
  useEffect(() => {
    const url = `http://localhost:9000/user/getmovieinfo/${movieId}`;
    axios.get(url).then((res) => {
      setMovieInfo(res.data);
    });
  }, [movieId]);

  const handleBookTickets = () => {
    router.push(`/user/showtheatre/${movieId}`);
  };
//Changing the state of variable which determines whether this component needs to be displayed or not
  const handleClose = () => {
    movieState(false);
  };

  if (!movieInfo) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.movieInfoContainer}>
        <IoCloseCircleSharp className={styles.closeIcon} onClick={handleClose} />
        <div className={styles.contentWrapper}>
          <div className={styles.posterSection}>
            <img
              src={fetchImages(movieInfo.poster)}
              alt={movieInfo.title}
              className={styles.moviePoster}
            />
          </div>
          <div className={styles.infoSection}>
            <h1 className={styles.movieTitle}>{movieInfo.title}</h1>
            <div className={styles.movieMeta}>
              <span className={styles.metaItem}>{movieInfo.language}</span>
              <span className={styles.metaItem}>{movieInfo.genre}</span>
              <span className={styles.metaItem}>{movieInfo.rating}</span>
            </div>
            <p className={styles.movieSummary}>{movieInfo.summary}</p>
            <div className={styles.castSection}>
              <div className={styles.castMember}>
                <img
                  src={fetchImages(movieInfo.cast.actor_image)}
                  alt={movieInfo.cast.actor}
                  className={styles.castImage}
                />
                <p className={styles.castName}>{movieInfo.cast.actor}</p>
                <p className={styles.castRole}>Actor</p>
              </div>
              <div className={styles.castMember}>
                <img
                  src={fetchImages(movieInfo.cast.actress_image)}
                  alt={movieInfo.cast.actress}
                  className={styles.castImage}
                />
                <p className={styles.castName}>{movieInfo.cast.actress}</p>
                <p className={styles.castRole}>Actress</p>
              </div>
            </div>
            <div className={styles.crewInfo}>
              <p><span className={styles.crewLabel}>Director:</span> {movieInfo.cast.director}</p>
              <p><span className={styles.crewLabel}>Production:</span> {movieInfo.cast.production}</p>
            </div>
            <button className={styles.bookTicketsBtn} onClick={handleBookTickets}>
              Book Tickets
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Movieinfo;