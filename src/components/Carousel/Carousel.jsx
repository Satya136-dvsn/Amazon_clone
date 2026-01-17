import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Carousel.css';

const Carousel = ({ slides, autoPlay = true, interval = 5000 }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, [slides.length]);

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    useEffect(() => {
        if (autoPlay && !isHovered) {
            const timer = setInterval(nextSlide, interval);
            return () => clearInterval(timer);
        }
    }, [autoPlay, interval, isHovered, nextSlide]);

    if (!slides || slides.length === 0) return null;

    return (
        <div
            className="carousel"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="carousel-container">
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
                        style={{
                            backgroundImage: `url(${slide.image})`,
                            background: slide.bgColor
                        }}
                    >
                        <div className="carousel-overlay"></div>
                        <div className="carousel-content">
                            <h2 className="carousel-title">{slide.title}</h2>
                            <p className="carousel-subtitle">{slide.subtitle}</p>
                            <button className="carousel-btn">{slide.buttonText}</button>
                        </div>
                    </div>
                ))}
            </div>

            <button className="carousel-arrow carousel-arrow-left" onClick={prevSlide}>
                <ChevronLeft size={40} />
            </button>
            <button className="carousel-arrow carousel-arrow-right" onClick={nextSlide}>
                <ChevronRight size={40} />
            </button>

            <div className="carousel-indicators">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        className={`carousel-indicator ${index === currentSlide ? 'active' : ''}`}
                        onClick={() => goToSlide(index)}
                    />
                ))}
            </div>

            <div className="carousel-fade-bottom"></div>
        </div>
    );
};

export default Carousel;
