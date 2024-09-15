'use client';

import React, { useEffect, useState } from 'react';
import './slider.css'; // Import the CSS file

type Slide = {
    id: number;
    image: string;
    title: string;
    description: string;
};

const slidesData: Slide[] = [
    { id: 1, image: '/assets/Brahmastra.jpeg', title: 'Watch New Movies', description: 'With Exiting Offers.' },
    { id: 2, image: '/assets/junglee.webp', title: 'Junglee', description: '' },
    { id: 3, image: '/assets/kingkong.jpg', title: 'KingKong', description: '' },
    { id: 4, image: '/assets/vazha.jpg', title: 'Vazha', description: ''}
]
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
            <div className="slider">
                <div className="slides">
                    {slidesData.map((slide, index) => (
                        <div
                            className={`slide fade ${index === slideIndex ? 'show' : ''}`}
                            key={slide.id}
                        >
                            <img src={slide.image} alt={slide.title} />
                            <div className="overlay">
                                <h2 id={slide.title === 'EXPLORE' ? 'main' : ''}>{slide.title}</h2>
                                <p>{slide.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <a className="prev" onClick={() => plusSlides(-1)}>&#10094;</a>
                <a className="next" onClick={() => plusSlides(1)}>&#10095;</a>
            </div>
        </section>
    );
};

export default Slider;
