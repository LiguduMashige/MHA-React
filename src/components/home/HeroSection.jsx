import React, { useState, useEffect } from 'react';
import '../../styles/HeroSection.css';

// Define hero images with both standard and GitHub Pages paths
const heroImages = [
  {
    src: '/store-img/hero-img/Luxury_Candle_Collection.jpg',
    githubSrc: '/MHA-React/store-img/hero-img/Luxury_Candle_Collection.jpg',
    alt: 'Luxury candle collection',
    title: 'Luxury Candle Collection',
    subtitle: 'Elevate your space with our premium candles'
  },
  {
    src: '/store-img/hero-img/Reed_Diffuser_Collection.jpg',
    githubSrc: '/MHA-React/store-img/hero-img/Reed_Diffuser_Collection.jpg',
    alt: 'Reed diffuser collection',
    title: 'Reed Diffuser Collection',
    subtitle: 'Long-lasting fragrance for your home'
  },
  {
    src: '/store-img/hero-img/Statement_Furniture.jpg',
    githubSrc: '/MHA-React/store-img/hero-img/Statement_Furniture.jpg',
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

  // Determine if we're on GitHub Pages
  const isGitHubPages = window.location.hostname.includes('github.io');

  return (
    <section className="hero-container">
      {heroImages.map((image, index) => {
        // Try both paths for better compatibility
        const imagePath = isGitHubPages ? image.githubSrc : image.src;
        const fallbackPath = isGitHubPages ? image.src : image.githubSrc;
        
        return (
          <div 
            key={index} 
            className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
          >
            <img 
              src={imagePath}
              alt={image.alt}
              className="hero-background-image"
              onError={(e) => {
                console.log(`Failed to load hero image: ${imagePath}, trying fallback`);
                e.target.onerror = null; // Prevent infinite loop
                e.target.src = fallbackPath;
              }}
            />
            <div className="hero-content">
              <h1 className="hero-title">{image.title}</h1>
              <p className="hero-subtitle">{image.subtitle}</p>
            </div>
          </div>
        );
      })}
      
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
