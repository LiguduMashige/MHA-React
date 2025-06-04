import React, { useState, useContext, useEffect } from 'react';
import { FaHeart, FaTimes, FaMinus, FaPlus, FaCheck } from 'react-icons/fa';
import { AiOutlineClose } from 'react-icons/ai';
import { ShopContext } from '../../context/ShopContext';
import { useNavigate } from 'react-router-dom';
import '../../styles/ProductModal.css';

const ProductModal = ({ product: initialProduct, isOpen, onClose }) => {
  const { addToCart, toggleFavorite, favorites, products } = useContext(ShopContext);
  const [quantity, setQuantity] = useState(1);
  const [selectedScent, setSelectedScent] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isGitHubPages, setIsGitHubPages] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(initialProduct);
  const navigate = useNavigate();

  // Set initial scent when product changes and get latest product state
  useEffect(() => {
    if (initialProduct) {
      // Always get the most up-to-date version of the product
      const freshProduct = products.find(p => p.id === initialProduct.id) || initialProduct;
      setCurrentProduct(freshProduct);
      
      // Set initial scent
      if (freshProduct.scents && freshProduct.scents.length > 0) {
        setSelectedScent(freshProduct.scents[0]);
      } else {
        setSelectedScent('');
      }
      setQuantity(1);
    }
  }, [initialProduct, products]);

  // Handle GitHub Pages detection
  useEffect(() => {
    const isGithub = window.location.hostname.includes('github.io');
    setIsGitHubPages(isGithub);
  }, []);
  
  // Handle image error reset when product changes
  useEffect(() => {
    if (currentProduct) {
      setImageError(false);
    }
  }, [currentProduct]);
  
  // Handle scroll locking when modal opens/closes
  useEffect(() => {    
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen || !currentProduct) return null;

  const handleQuantityChange = (change) => {
    setQuantity(Math.max(1, quantity + change));
  };

  const handleAddToCart = () => {
    if (addToCart(currentProduct.id, quantity, selectedScent)) {
      // Find the updated product with reduced stock after cart addition
      const updatedProduct = products.find(p => p.id === currentProduct.id);
      if (updatedProduct) {
        setCurrentProduct(updatedProduct);
      }
      setShowConfirmation(true);
    }
    // Don't auto-hide the confirmation - user needs to close it
  };

  const handleBuyNow = () => {
    if (addToCart(currentProduct.id, quantity, selectedScent)) {
      onClose();
      navigate('/checkout');
    }
  };

  const isFavorite = favorites && favorites[currentProduct.id];
  
  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-container">
        <button className="close-button" onClick={onClose}>
          <FaTimes />
        </button>
        
        <div className="modal-content">
          <div className="modal-left">
            {imageError ? (
              <div className="image-error-container">
                <span>Image not available</span>
              </div>
            ) : (
              <img 
                src={currentProduct.image ? 
                  (isGitHubPages 
                    ? `/MHA-React${currentProduct.image}` 
                    : currentProduct.image
                  ) : ''
                } 
                alt={currentProduct.name} 
                onError={(e) => {
                  // Silent error handling - no console logs
                  // Use fallback image directly
                  e.target.onerror = null; // Prevent infinite loop
                  e.target.src = isGitHubPages
                    ? `/MHA-React/store-img/image-not-available.jpg`
                    : `/store-img/image-not-available.jpg`;
                  setImageError(true);
                }}
                className="product-image"
              />
            )}
          </div>
          
          <div className="modal-right">
            <div className="product-header">
              <h2 className="product-name">{currentProduct.name}</h2>
            </div>
            
            <div className="price-favorite-row">
              <p className="product-price">R{currentProduct.price.toFixed(2)}</p>
              <button 
                className={`favorite-button-modal ${isFavorite ? 'active' : ''}`}
                onClick={() => toggleFavorite(currentProduct.id)}
              >
                <FaHeart />
                <span>Favorite</span>
              </button>
            </div>
            
            <p className="product-description">{currentProduct.description}</p>
            
            {currentProduct.scents && currentProduct.scents.length > 0 && (
              <div className="scent-selector">
                <label>Scent:</label>
                <div className="scent-options">
                  {currentProduct.scents.map((scent, index) => (
                    <button 
                      key={index} 
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
              <label>Quantity:</label>
              <div className="quantity-controls">
                <button 
                  className="quantity-button"
                  onClick={() => handleQuantityChange(-1)} 
                  disabled={quantity <= 1}
                >
                  <FaMinus />
                </button>
                <span className="quantity-value">{quantity}</span>
                <button className="quantity-button" onClick={() => handleQuantityChange(1)}>
                  <FaPlus />
                </button>
              </div>
            </div>

            <div className="stock-info">
              {currentProduct.stock > 0 ? (
                <span className="stock-info in-stock">{currentProduct.stock} available</span>
              ) : (
                <span className="stock-info out-of-stock">Out of stock</span>
              )}
            </div>

            <div className="action-buttons">
              <button 
                className="add-to-cart-button" 
                onClick={handleAddToCart}
                disabled={currentProduct.stock <= 0}
              >
                Add to Cart
              </button>
              <button 
                className="buy-now-button" 
                onClick={handleBuyNow}
                disabled={currentProduct.stock <= 0}
              >
                Buy Now
              </button>
            </div>
            
            {showConfirmation && (
              <div className="confirmation-popup">
                <div className="confirmation-header">
                  <span className="check-icon"><FaCheck /></span>
                  <p>Item added to your cart</p>
                  <button className="close-confirmation" onClick={() => setShowConfirmation(false)}>
                    <AiOutlineClose />
                  </button>
                </div>
                
                <div className="confirmation-product">
                  <div className="confirmation-image">
                    <img 
                      src={currentProduct.image ? 
                        (isGitHubPages 
                          ? `/MHA-React${currentProduct.image}` 
                          : currentProduct.image
                        ) : ''
                      } 
                      alt={currentProduct.name} 
                      onError={(e) => {
                        // Silent error handling with fallback logic
                        try {
                          // Create fallback path using category
                          const categoryFolder = currentProduct.category + '-img';
                          const imgName = currentProduct.image.split('/').pop();
                          const fallbackPath = `/store-img/${categoryFolder}/${imgName}`;
                          
                          // Set fallback error handler
                          e.target.onerror = (e2) => {
                            e2.target.onerror = null; // Prevent infinite loop
                            e2.target.src = isGitHubPages 
                              ? "/MHA-React/store-img/image-not-available.jpg"
                              : "/store-img/image-not-available.jpg";
                          };
                          
                          // Try the fallback path
                          e.target.src = isGitHubPages 
                            ? `/MHA-React${fallbackPath}` 
                            : fallbackPath;
                        } catch (err) {
                          // In case of any error, use the default fallback image
                          e.target.onerror = null;
                          e.target.src = isGitHubPages 
                            ? "/MHA-React/store-img/image-not-available.jpg"
                            : "/store-img/image-not-available.jpg";
                        }
                      }}
                    />
                  </div>
                  <div className="confirmation-details">
                    <p className="confirmation-product-name">{currentProduct.name}</p>
                    <p className="confirmation-product-scent">Scent: {selectedScent || 'None'}</p>
                  </div>
                </div>
                
                <div className="confirmation-buttons">
                  <button className="view-cart-button" onClick={() => {
                    onClose();
                    navigate('/cart');
                  }}>View cart ({quantity})</button>
                  <button className="checkout-button" onClick={() => {
                    onClose();
                    navigate('/checkout');
                  }}>Check out</button>
                </div>
                
                <button className="continue-shopping" onClick={() => setShowConfirmation(false)}>Continue shopping</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductModal;
