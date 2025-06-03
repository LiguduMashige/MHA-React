import React, { useState, useContext, useRef, useEffect } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { ShopContext } from '../../context/ShopContext';
import { useNavigate } from 'react-router-dom';
import '../../styles/SearchBar.css';

const SearchBar = () => {
  const { searchProducts, setSearchResults } = useContext(ShopContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setLocalSearchResults] = useState([]);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Handle click outside to close search results
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.trim().length > 2) {
      const results = searchProducts(value);
      setSearchResults(results);
      setLocalSearchResults(results);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setLocalSearchResults([]);
      setShowResults(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim().length > 2) {
      const results = searchProducts(searchTerm);
      setSearchResults(results);
      setLocalSearchResults(results);
      navigate('/search');
      setShowResults(false);
      setIsExpanded(false);
    }
  };

  const handleSearchIconClick = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setTimeout(() => {
        document.getElementById('search-input').focus();
      }, 100);
    } else {
      setShowResults(false);
      setSearchTerm('');
    }
  };

  const handleResultClick = (productId) => {
    setShowResults(false);
    setIsExpanded(false);
    // Navigate to product detail or trigger product modal
    // This depends on how your app handles product viewing
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setLocalSearchResults([]);
    setShowResults(false);
    document.getElementById('search-input').focus();
  };

  return (
    <div className="search-container" ref={searchRef}>
      <form className={`search-form ${isExpanded ? 'expanded' : ''}`} onSubmit={handleSearchSubmit}>
        <div className="search-icon" onClick={handleSearchIconClick}>
          <FaSearch />
        </div>
        
        <input 
          id="search-input"
          className={`search-input ${isExpanded ? 'expanded' : ''}`}
          type="text" 
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        
        {searchTerm && isExpanded && (
          <button className="clear-button" type="button" onClick={clearSearch}>
            <FaTimes />
          </button>
        )}
      </form>
      
      {showResults && searchTerm.trim().length > 2 && (
        <div className="search-results">
          {searchResults && searchResults.length > 0 ? (
            searchResults.slice(0, 5).map(product => (
              <div 
                className="search-result-item"
                key={product.id}
                onClick={() => handleResultClick(product.id)}
              >
                <img className="result-image" src={product.image} alt={product.name} />
                <div className="result-info">
                  <div className="result-name">{product.name}</div>
                  <div className="result-price">R{product.price}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">No products found</div>
          )}
          
          {searchResults && searchResults.length > 5 && (
            <div className="view-all-results" onClick={handleSearchSubmit}>
              View all {searchResults.length} results
            </div>
          )}
        </div>
      )}
    </div>
  );
};


export default SearchBar;