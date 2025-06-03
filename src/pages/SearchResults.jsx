import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import ProductCard from '../components/products/ProductCard';
import ProductModal from '../components/products/ProductModal';
import '../styles/SearchResults.css';

const SearchResults = () => {
  const { searchResults } = useContext(ShopContext);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="search-results-container">
      <div className="search-results-header">
        <h1 className="search-results-title">Search Results</h1>
        <p className="search-results-count">
          {searchResults.length} {searchResults.length === 1 ? 'product' : 'products'} found
        </p>
      </div>
      
      {searchResults.length > 0 ? (
        <div className="search-results-grid">
          {searchResults.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onClick={() => handleProductClick(product)}
            />
          ))}
        </div>
      ) : (
        <div className="no-results-message">
          <h3>No products found</h3>
          <p>
            Try adjusting your search terms or browse our categories
          </p>
          <Link to="/" className="back-to-home">Back to Home</Link>
        </div>
      )}
      
      <ProductModal 
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};


export default SearchResults;
