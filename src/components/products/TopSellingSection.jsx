import React, { useRef, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import ProductCard from './ProductCard';
import '../../styles/TopSellingSection.css';

const TopSellingSection = ({ products, onProductClick }) => {
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10); // 10px buffer
    }
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const cardWidth = 250; // Approximate width of a card + margin
      const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="category-container">
      <div className="category-header">
        <h2 className="category-title">Top Selling / Trending</h2>
      </div>
      
      <div className="scroll-container">
        {showLeftArrow && (
          <button className="scroll-button left" onClick={() => scroll('left')}>
            <FaChevronLeft />
          </button>
        )}
        
        <div 
          className="products-container"
          ref={scrollContainerRef} 
          onScroll={handleScroll}
        >
          {products.map((product, index) => (
            <div className="product-card-wrapper" key={product.id}>
              <div className="ranking-number">{index + 1}</div>
              <ProductCard 
                product={product} 
                onClick={() => onProductClick(product)}
              />
            </div>
          ))}
        </div>
        
        {showRightArrow && (
          <button className="scroll-button right" onClick={() => scroll('right')}>
            <FaChevronRight />
          </button>
        )}
      </div>
    </section>
  );
};

export default TopSellingSection;
