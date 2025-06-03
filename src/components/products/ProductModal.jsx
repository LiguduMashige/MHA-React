import React, { useState, useContext, useEffect } from 'react';
import { FaHeart, FaTimes, FaMinus, FaPlus, FaCheck, FaImage } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../../context/ShopContext';
import { formatImagePath } from '../../utils/pathUtils';
import '../../styles/ProductModal.css';

const ProductModal = ({ product: initialProduct, isOpen, onClose }) => {
  const navigate = useNavigate();
  const { addToCart, buyNow, favorites, toggleFavorite, products } = useContext(ShopContext);
  const [quantity, setQuantity] = useState(1);
  const [selectedScent, setSelectedScent] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [imageSrc, setImageSrc] = useState('');
  const [imageError, setImageError] = useState(false);
  const [loadAttempts, setLoadAttempts] = useState(0);
  const isFavorite = favorites[currentProduct?.id];

  // Effect to update currentProduct when initialProduct changes or products array changes
  // Reset image loading state when modal opens with a product
  useEffect(() => {
    if (initialProduct) {
      // Find the latest version of the product from products array
      const updatedProduct = products.find(p => p.id === initialProduct.id);
      if (updatedProduct) {
        setCurrentProduct(updatedProduct);
      } else {
        setCurrentProduct(initialProduct);
      }
      
      // Reset image loading state
      setImageError(false);
      setLoadAttempts(0);
    }
  }, [initialProduct, products]);
  
  // Handle image path and loading
  useEffect(() => {
    if (!currentProduct) return;
    
    if (imageError && loadAttempts < 3) {
      // If we had an error, try different path formats
      let newPath;
      if (loadAttempts === 0) {
        // First fallback: Try direct path with baseUrl
        const isGitHub = window.location.hostname.includes('github.io');
        const baseUrl = isGitHub ? '/MHA-React' : '';
        newPath = `${baseUrl}${currentProduct.image.startsWith('/') ? currentProduct.image : `/${currentProduct.image}`}`;
      } else if (loadAttempts === 1) {
        // Second fallback: Try with category-specific folder
        const imageName = currentProduct.image.split('/').pop();
        const isGitHub = window.location.hostname.includes('github.io');
        const baseUrl = isGitHub ? '/MHA-React' : '';
        newPath = `${baseUrl}/store-img/${currentProduct.category}/${imageName}`;
      } else {
        // Third fallback: Try with direct filename only
        const imageName = currentProduct.image.split('/').pop();
        const isGitHub = window.location.hostname.includes('github.io');
        const baseUrl = isGitHub ? '/MHA-React' : '';
        newPath = `${baseUrl}/images/${imageName}`;
      }
      console.log(`Modal attempt ${loadAttempts + 1}: trying ${newPath}`);
      setImageSrc(newPath);
      setLoadAttempts(prev => prev + 1);
    } else if (!imageError) {
      // First attempt or after product change
      const isGitHub = window.location.hostname.includes('github.io');
      const baseUrl = isGitHub ? '/MHA-React' : '';
      const path = currentProduct.image.startsWith('/') ? currentProduct.image : `/${currentProduct.image}`;
      const formattedPath = `${baseUrl}${path}`;
      console.log(`Modal initial image load: ${formattedPath}`);
      setImageSrc(formattedPath);
    }
  }, [currentProduct, imageError, loadAttempts]);
  
  useEffect(() => {
    if (isOpen && currentProduct) {
      // Reset state when modal opens
      setQuantity(1);
      if (currentProduct.scents && currentProduct.scents.length > 0) {
        setSelectedScent(currentProduct.scents[0]);
      } else {
        setSelectedScent('');
      }
      
      // Disable scrolling on body when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      // Re-enable scrolling when modal is closed
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, currentProduct]);
  
  // If no product data is available, don't render anything
  if (!initialProduct || !currentProduct) return null;

  const handleQuantityChange = (amount) => {
    const newQuantity = quantity + amount;
    if (newQuantity > 0 && newQuantity <= currentProduct.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    const success = addToCart(currentProduct.id, quantity, selectedScent, currentProduct.medium);
    if (success) {
      // Get the updated product with new stock level
      const updatedProduct = products.find(p => p.id === currentProduct.id);
      if (updatedProduct) {
        setCurrentProduct(updatedProduct);
      }
      // Show confirmation popup
      setShowConfirmation(true);
      
      // Add the popup to the DOM outside React's control
      document.body.classList.add('showing-notification');
    } else {
      // Could add a visual feedback for failed add to cart
      alert('Sorry, this product is out of stock or not enough quantity is available.');
    }
  };

  const handleBuyNow = () => {
    const success = buyNow(currentProduct.id, quantity, selectedScent, currentProduct.medium);
    if (success) {
      onClose();
      // Navigate to cart page after adding to cart
      navigate('/cart');
    } else {
      // Could add a visual feedback for failed add to cart
      alert('Sorry, this product is out of stock or not enough quantity is available.');
    }
  };

  const handleFavoriteClick = () => {
    toggleFavorite(currentProduct.id);
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    document.body.classList.remove('showing-notification');
  };

  const handleViewCart = () => {
    onClose();
    // Navigate to cart page
    navigate('/cart');
  };

  const handleContinueShopping = () => {
    setShowConfirmation(false);
    onClose();
    // Navigate to home page
    navigate('/');
  };

  return (
    <>
      {isOpen && (
        <>
          <div 
            className="modal-overlay fade-in"
            onClick={onClose}
          />
          <div
            className="modal-container scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-button" onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}>
              <FaTimes />
            </button>
            
            <div className="modal-content">
              {imageError && loadAttempts >= 3 ? (
                <div className="image-error-container">
                  <FaImage className="image-error-icon" size={60} />
                  <p>Image could not be loaded</p>
                </div>
              ) : (
                <img 
                  className="product-image" 
                  key={`modal-${currentProduct.id}-${loadAttempts}`}
                  src={imageSrc} 
                  alt={currentProduct.name} 
                  onLoad={() => setImageError(false)}
                  onError={(e) => {
                    console.error(`Failed to load modal image (attempt ${loadAttempts}): ${imageSrc}`);
                    e.target.onerror = null; // Prevent infinite loop
                    setImageError(true);
                  }}
                />
              )}
              
              <div className="product-details">
                <div className="product-header">
                  <h2 className="product-name">{currentProduct.name}</h2>
                </div>
                
                <p className="product-description">{currentProduct.description}</p>
                
                <div className="product-price-row">
                  <div className="product-price">R{currentProduct.price}</div>
                  <button 
                    className={`favorite-button-modal ${isFavorite ? 'active' : ''}`}
                    onClick={handleFavoriteClick}
                    aria-label="Add to favorites"
                  >
                    <FaHeart />
                    <span>{isFavorite ? 'In Favorites' : 'Add to Favorites'}</span>
                  </button>
                </div>
                
                {currentProduct.size && (
                  <div className="product-attribute">
                    <span className="attribute-label">Size:</span>
                    <span className="attribute-value">{currentProduct.size}</span>
                  </div>
                )}
                
                {currentProduct.medium && (
                  <div className="product-attribute">
                    <span className="attribute-label">Medium:</span>
                    <span className="attribute-value">{currentProduct.medium}</span>
                  </div>
                )}
                
                {currentProduct.scents && currentProduct.scents.length > 0 && (
                  <div className="scent-selector">
                    <span className="attribute-label">Scent:</span>
                    <div className="scent-options">
                      {currentProduct.scents.map(scent => (
                        <button
                          key={scent}
                          className={`scent-option ${selectedScent === scent ? 'selected' : ''}`}
                          onClick={() => setSelectedScent(scent)}
                        >
                          {scent}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="quantity-selector">
                  <span className="attribute-label">Quantity:</span>
                  <div className="quantity-controls">
                    <button 
                      className="quantity-button"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                    >
                      <FaMinus />
                    </button>
                    <span className="quantity-value">{quantity}</span>
                    <button 
                      className="quantity-button"
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= currentProduct.stock}
                    >
                      <FaPlus />
                    </button>
                  </div>
                </div>
                
                <div className={`stock-info ${currentProduct.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                  {currentProduct.stock > 0 
                    ? `In Stock: ${currentProduct.stock} available` 
                    : 'Out of Stock'}
                </div>
                
                <div className="action-buttons">
                  <button 
                    className="add-to-cart-button"
                    onClick={handleAddToCart}
                    disabled={currentProduct.stock === 0}
                  >
                    Add to Cart
                  </button>
                  <button 
                    className="buy-now-button"
                    onClick={handleBuyNow}
                    disabled={currentProduct.stock === 0}
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      
      {showConfirmation && (
        <div className="cart-notification-popup fade-in">
          <div className="cart-notification-header">
            <span className="success-checkmark"><FaCheck /></span>
            <span className="added-to-cart-text">Item added to your cart</span>
            <button className="close-notification-button" onClick={handleCloseConfirmation}>
              <FaTimes />
            </button>
          </div>
          
          <div className="cart-notification-content">
            <div className="cart-product-image">
              <img src={formatImagePath(currentProduct.image)} alt={currentProduct.name} />
            </div>
            <div className="cart-product-details">
              <h3 className="cart-product-name">{currentProduct.name}</h3>
              {selectedScent && (
                <p className="cart-product-scent">Scent: {selectedScent}</p>
              )}
            </div>
          </div>
          
          <div className="cart-notification-buttons">
            <button className="view-cart-button" onClick={handleViewCart}>
              View cart ({quantity})
            </button>
            <button className="continue-shopping-button" onClick={handleContinueShopping}>
              Continue shopping
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductModal;
