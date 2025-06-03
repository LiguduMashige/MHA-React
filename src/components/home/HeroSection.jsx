import React, { useState, useEffect } from 'react';
import '../../styles/HeroSection.css';

const heroImages = [
  {
    src: '/store-img/hero-img/Luxury_Candle_Collection.jpg',
    alt: 'Luxury candle collection',
    title: 'Luxury Candle Collection',
    subtitle: 'Elevate your space with our premium candles'
  },
  {
    src: '/store-img/hero-img/Reed_Diffuser_Collection.jpg',
    alt: 'Reed diffuser collection',
    title: 'Reed Diffuser Collection',
    subtitle: 'Long-lasting fragrance for your home'
  },
  {
    src: '/store-img/hero-img/Statement_Furniture.jpg',
    alt: 'Unique furniture pieces',
    title: 'Statement Furniture',
    subtitle: 'Unique pieces that define your space'
  }
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero-container">
      {heroImages.map((image, index) => (
        <div 
          key={index} 
          className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
          style={{ backgroundImage: `url(${image.src})` }}
        >
          <div className="hero-content">
            <h1 className="hero-title">{image.title}</h1>
            <p className="hero-subtitle">{image.subtitle}</p>
          </div>
        </div>
      ))}
      
      <div className="slide-indicators">
        {heroImages.map((_, index) => (
          <button 
            key={index} 
            className={`slide-indicator ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </section>
  );
};





export default HeroSection;
