import React, { useContext, useState, useEffect } from 'react';
import { FaHeart, FaImage } from 'react-icons/fa';
import { ShopContext } from '../../context/ShopContext';
import '../../styles/ProductCard.css';

const ProductCard = ({ product, onClick }) => {
  const { favorites, toggleFavorite } = useContext(ShopContext);
  const isFavorite = favorites[product.id];

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavorite(product.id);
  };

  const [imageSrc, setImageSrc] = useState("");
  const [imageError, setImageError] = useState(false);
  const [loadAttempts, setLoadAttempts] = useState(0);
  
  // Always reset imageError when product changes
  useEffect(() => {
    setImageError(false);
    setLoadAttempts(0);
  }, [product.id]);
  
  // Ensure image path is correctly formatted and image is loaded
  useEffect(() => {
    // Validate product.image
    if (!product.image || typeof product.image !== 'string' || product.image.trim() === '') {
      console.error(`Product ID ${product.id} (${product.name}) has invalid or empty image path: '${product.image}'`);
      if (!imageError || loadAttempts < 3) { // Prevent state update loop if already in error max attempts
        setImageError(true);
        setLoadAttempts(3); // Max out attempts to show fallback UI immediately
      }
      return;
    }

    const isGitHub = window.location.hostname.includes('github.io');
    const baseUrl = isGitHub ? '/MHA-React' : '';

    if (imageError && loadAttempts < 3) {
      let newPath;
      // Determine the base for relative paths (product.image itself)
      const imagePathSegment = product.image.startsWith('http://') || product.image.startsWith('https://') 
        ? product.image 
        : (product.image.startsWith('/') ? product.image : `/${product.image}`);

      if (loadAttempts === 0) {
        // First fallback: Retry initial logic (handles absolute URLs and prepends baseUrl for relative)
        if (imagePathSegment.startsWith('http://') || imagePathSegment.startsWith('https://')) {
          newPath = imagePathSegment;
        } else {
          newPath = `${baseUrl}${imagePathSegment}`;
        }
        console.log(`Fallback Attempt 1 for ${product.name}: trying ${newPath}`);
      } else if (loadAttempts === 1) {
        // Second fallback: Try with category-specific folder (relative to baseUrl)
        const imageName = product.image.split('/').pop();
        newPath = `${baseUrl}/store-img/${product.category}/${imageName}`;
        console.log(`Fallback Attempt 2 for ${product.name}: trying ${newPath}`);
      } else { // loadAttempts === 2
        // Third fallback: Try with direct images folder (relative to baseUrl)
        const imageName = product.image.split('/').pop();
        newPath = `${baseUrl}/images/${imageName}`;
        console.log(`Fallback Attempt 3 for ${product.name}: trying ${newPath}`);
      }
      setImageSrc(newPath);
      setLoadAttempts(prev => prev + 1);
    } else if (!imageError) {
      // Initial attempt or after product change (and image is valid)
      let initialPathAttempt;
      if (product.image.startsWith('http://') || product.image.startsWith('https://')) {
        initialPathAttempt = product.image; // It's already an absolute URL
      } else {
        const pathSegment = product.image.startsWith('/') ? product.image : `/${product.image}`;
        initialPathAttempt = `${baseUrl}${pathSegment}`;
      }
      console.log(`Initial image load attempt for ${product.name}: ${initialPathAttempt}`);
      setImageSrc(initialPathAttempt);
    }
  }, [product.image, imageError, loadAttempts, product.id, product.name, product.category]);
  
  return (
    <div className="card-container" onClick={onClick}>
      <div className="image-container">
        <div className="image-wrapper">
          {imageError && loadAttempts >= 3 ? (
            <div className="image-error-fallback">
              <FaImage size={40} />
              <p>Image not available</p>
            </div>
          ) : (
            <img 
              key={`${product.id}-${loadAttempts}`} /* Key helps force re-render */
              src={imageSrc} 
              alt={product.name} 
              className="product-image"
              onLoad={() => setImageError(false)}
              onError={(e) => {
                console.error(`Failed to load image (attempt ${loadAttempts}): ${imageSrc}`);
                e.target.onerror = null; // Prevent infinite loop
                setImageError(true);
              }}
            />
          )}
        </div>
        <button 
          className={`favorite-button ${isFavorite ? 'active' : ''}`}
          onClick={handleFavoriteClick}
        >
          <FaHeart />
        </button>
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
