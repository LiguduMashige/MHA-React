import React, { useContext, useState, useEffect, useCallback } from 'react';
import { FaHeart } from 'react-icons/fa';
import { ShopContext } from '../../context/ShopContext';
import '../../styles/ProductCard.css';

const ProductCard = ({ product, onClick }) => {
  const { favorites, toggleFavorite } = useContext(ShopContext);
  const isFavorite = favorites[product.id];
  
  // Removed debug console.log for production
  const isGitHubPages = window.location.hostname.includes('github.io');

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavorite(product.id);
  };

  const [primaryImage, setPrimaryImage] = useState("");
  const [fallbackImages, setFallbackImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // Using the imageError state to track if all image loading attempts failed
  const [imageError, setImageError] = useState(false);
  
  // Generate all possible image paths when product changes - memoized to avoid dependency issues
  const generateImagePaths = useCallback(() => {
    if (!product?.image) {
      console.error(`Product ID ${product?.id} has missing or invalid image path`);
      setImageError(true);
      return;
    }
    
    // Clean the original path by removing any 'public/' prefix
    const cleanedOriginalPath = product.image.replace(/^public\/?/, '');
    
    // Get category
    const category = product.category;
    
    // Extract the filename and extension from the path
    const fileName = cleanedOriginalPath.split('/').pop();
    const fileNameParts = fileName.split('.');
    const baseName = fileNameParts.length > 1 ? fileNameParts.slice(0, -1).join('.') : fileName;
    const originalExtension = fileNameParts.length > 1 ? fileNameParts.pop() : '';
    
    // Create paths with both lowercase and uppercase extensions to handle case sensitivity
    const lowerExt = originalExtension.toLowerCase();
    const upperExt = originalExtension.toUpperCase();
    
    // Build an array of paths to try
    const paths = [];
    
    // Add direct paths for both local and GitHub Pages environments
    paths.push(`/${cleanedOriginalPath}`);
    paths.push(`/MHA-React/${cleanedOriginalPath}`);
    
    // Add paths with explicit case variations
    if (lowerExt !== upperExt) {
      // Replace extension with lowercase version
      const lowerCasePath = cleanedOriginalPath.replace(new RegExp(`\\.${originalExtension}$`, 'i'), `.${lowerExt}`);
      paths.push(`/${lowerCasePath}`);
      paths.push(`/MHA-React/${lowerCasePath}`);
      
      // Replace extension with uppercase version
      const upperCasePath = cleanedOriginalPath.replace(new RegExp(`\\.${originalExtension}$`, 'i'), `.${upperExt}`);
      paths.push(`/${upperCasePath}`);
      paths.push(`/MHA-React/${upperCasePath}`);
    }
    
    // Add direct category paths
    paths.push(`/store-img/${category}-img/${fileName}`);
    paths.push(`/MHA-React/store-img/${category}-img/${fileName}`);
    
    // Add category paths with case variations
    if (lowerExt !== upperExt) {
      paths.push(`/store-img/${category}-img/${baseName}.${lowerExt}`);
      paths.push(`/store-img/${category}-img/${baseName}.${upperExt}`);
      paths.push(`/MHA-React/store-img/${category}-img/${baseName}.${lowerExt}`);
      paths.push(`/MHA-React/store-img/${category}-img/${baseName}.${upperExt}`);
    }
    
    // Set primary image path - use GitHub path if on GitHub Pages
    setPrimaryImage(isGitHubPages ? paths[1] : paths[0]);
    
    // Set remaining paths as fallbacks, filtering out the primary path
    setFallbackImages(paths.filter((path, index) => isGitHubPages ? index !== 1 : index !== 0));
    
    // Image paths are now set without logging
  }, [product, isGitHubPages]);
  
  // Reset image state when product changes
  useEffect(() => {
    setImageError(false);
    setCurrentImageIndex(0);
    generateImagePaths();
  }, [product.id, generateImagePaths]);
  
  // Try next fallback image when current one fails
  // This useEffect is no longer needed as we handle fallback in the onError callback
  // We're keeping it commented out to avoid duplicated fallback attempts
  /* 
  useEffect(() => {
    if (!imageError) return;
    
    if (currentImageIndex < fallbackImages.length) {
      console.log(`Trying fallback image ${currentImageIndex + 1} for ${product.name}: ${fallbackImages[currentImageIndex]}`);
      setCurrentImageIndex(prevIndex => prevIndex + 1);
    } else {
      console.error(`All image loading attempts failed for ${product.name}`);
    }
  }, [imageError, currentImageIndex, fallbackImages, product?.name]);
  */
  
  return (
    <div className="card-container" onClick={onClick}>
      <div className="image-container">
        <div className="image-wrapper">
          {/* Use imageError explicitly for condition to silence ESLint warning */}
          {currentImageIndex >= fallbackImages.length || imageError ? (
            // We've tried all fallbacks, show placeholder
            <div className="image-error-fallback">
              <img 
                src="/store-img/logos-img/MHA_Gold_Logo_White_Background.jpg" 
                alt="MHA Logo" 
                className="fallback-image"
              />
            </div>
          ) : (
            // Show current image with proper error handling
            <img 
              key={`${product.id}-${currentImageIndex}`} 
              src={currentImageIndex === 0 ? primaryImage : fallbackImages[currentImageIndex - 1]}
              alt={product.name} 
              className="product-image"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              onError={(e) => {
                // Silent error handling - no console logs
                e.target.onerror = null; // Prevent infinite loop
                if (currentImageIndex < fallbackImages.length) {
                  // Try next fallback immediately instead of state update
                  e.target.src = fallbackImages[currentImageIndex];
                  setCurrentImageIndex(prev => prev + 1);
                } else {
                  setImageError(true);
                }
              }}
            />
          )}
        </div>
        
        {/* Favorite Heart Button - Always on Top */}
        <div 
          className="favorite-button-container"
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            padding: '10px',
            zIndex: 500
          }}
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click
            handleFavoriteClick(e);
          }}
        >
          <button 
            className={`favorite-button ${isFavorite ? 'active' : ''}`}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'rgba(155, 129, 129, 0.9)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
              cursor: 'pointer'
            }}
          >
            <FaHeart size={20} color={isFavorite ? '#D06262' : '#ffffff'} />
          </button>
        </div>
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">R{product.price || 0}</p>
        <div className="rating-container">
          <span className="rating">{product.rating ? product.rating.toFixed(1) : '0.0'}</span>
          <span className={`stock-status ${product.stock && product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
            {product.stock && product.stock > 0 ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
      </div>
    </div>
  );
};


export default ProductCard;
