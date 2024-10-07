'use client';

import React, { useEffect, useState } from 'react';
import styles from './slider.module.css'; 

type Slide = {
    id: number;
    image: string;
    title: string;
    description: string;
};

const slidesData: Slide[] = [
    { id: 1, image: '/assets/marvel.jpg', title: 'Watch New Movies', description: 'With Exciting Offers.' },
    { id: 2, image: '/assets/deadvswol.jpg', title: 'Deadpool vs Wolverine', description: '' },
    { id: 3, image: '/assets/aavesham.jpg', title: 'Aavesham', description: '' },
    { id: 4, image: '/assets/inside.jpg', title: 'Inside Out 2', description: '' }
];

const Slider: React.FC = () => {
    const [slideIndex, setSlideIndex] = useState<number>(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setSlideIndex((prevIndex) => (prevIndex + 1) % slidesData.length);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const plusSlides = (n: number) => {
        setSlideIndex((prevIndex) => {
            const newIndex = (prevIndex + n) % slidesData.length;
            return newIndex < 0 ? slidesData.length - 1 : newIndex;
        });
    };

    return (
        <section>
            <div className={styles.slider}>
                <div className={styles.slides}>
                    {slidesData.map((slide, index) => (
                        <div
                            className={`${styles.slide} ${index === slideIndex ? styles.show : ''}`}
                            key={slide.id}
                        >
                            <img src={slide.image} alt={slide.title} />
                            <div className={styles.overlay}>
                                <h2 id={slide.title === 'EXPLORE' ? styles.main : ''}>{slide.title}</h2>
                                <p>{slide.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <a className={styles.prev} onClick={() => plusSlides(-1)}>&#10094;</a>
                <a className={styles.next} onClick={() => plusSlides(1)}>&#10095;</a>
            </div>
        </section>
    );
};

export default Slider;
