import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import { ShopContext } from '../context/ShopContext';
import '../styles/Cart.css';

const Cart = () => {
  const { 
    products, 
    cartItems, 
    getCartTotal, 
    removeFromCart, 
    updateCartItemQuantity 
  } = useContext(ShopContext);
  const navigate = useNavigate();
  
  const cartTotal = getCartTotal();
  const hasItems = Object.keys(cartItems).length > 0;
  const isGitHubPages = window.location.hostname.includes('github.io');
  
  // Helper function to generate proper image paths for products
  const generateImagePath = (imagePath) => {
    if (!imagePath) return '';
    
    // Clean the original path by removing any 'public/' prefix
    const cleanedPath = imagePath.replace(/^public\/?/, '');
    
    // Create the correct path based on environment
    const baseUrl = isGitHubPages ? '/MHA-React' : '';
    return `${baseUrl}/${cleanedPath}`;
  };
  
  const handleQuantityChange = (productId, scent, medium, amount) => {
    const item = cartItems[productId];
    const currentQuantity = item ? 
      (scent && medium ? item.scentQuantities[scent][medium] : 
       scent ? item.scentQuantities[scent] : 
       item.quantity) : 0;
    
    const newQuantity = currentQuantity + amount;
    if (newQuantity > 0) {
      updateCartItemQuantity(productId, newQuantity, scent, medium);
    }
  };
  
  const handleRemoveItem = (productId, scent, medium) => {
    removeFromCart(productId, scent, medium);
  };
  
  const handleCheckout = () => {
    navigate('/checkout');
  };
  
  const getItemPrice = (product, quantity, cartItem) => {
    // Use custom price for gift cards if available
    const price = cartItem && cartItem.customPrice ? cartItem.customPrice : product.price;
    return price * quantity;
  };

  return (
    <div className="cart-container">
      <h1 className="cart-title">Your Cart</h1>
      
      {hasItems ? (
        <div className="cart-content">
          <div className="cart-items-container">
            {Object.entries(cartItems).map(([productId, cartItem]) => {
              const product = products.find(p => p.id === parseInt(productId));
              if (!product) return null;
              
              // For gift cards with custom price
              const itemPrice = cartItem.customPrice || product.price;
              const isGiftCard = product.category === 'gift';
              
              // Check if the product has scents
              if (cartItem.scentQuantities) {
                return Object.entries(cartItem.scentQuantities).map(([scent, quantity]) => {
                  // Check if the scent has medium options
                  if (typeof quantity === 'object') {
                    return Object.entries(quantity).map(([medium, mediumQuantity]) => (
                      <div className="cart-item" key={`${productId}-${scent}-${medium}`}>
                        <img 
  className="item-image" 
  src={generateImagePath(product.image)} 
  alt={product.name} 
  onError={(e) => {
    console.error(`Failed to load cart image: ${e.target.src}`);
    e.target.onerror = null; // Prevent infinite loop
    e.target.src = isGitHubPages ? '/MHA-React/images/product-placeholder.jpg' : '/images/product-placeholder.jpg';
  }}
/>
                        <div className="item-details">
                          <h3 className="item-name">{product.name}</h3>
                          <div className="item-attributes">
                            <span className="attribute-label">Scent:</span> {scent}
                            <span className="attribute-separator">|</span>
                            <span className="attribute-label">Medium:</span> {medium}
                          </div>
                          <div className="item-price">R{itemPrice}</div>
                        </div>
                        <div className="quantity-controls">
                          <button 
                            className="quantity-button"
                            onClick={() => handleQuantityChange(parseInt(productId), scent, medium, -1)}
                            disabled={mediumQuantity <= 1}
                          >
                            <FaMinus />
                          </button>
                          <span className="quantity-value">{mediumQuantity}</span>
                          <button 
                            className="quantity-button"
                            onClick={() => handleQuantityChange(parseInt(productId), scent, medium, 1)}
                            disabled={mediumQuantity >= product.stock}
                          >
                            <FaPlus />
                          </button>
                        </div>
                        <div className="item-subtotal">
                          R{getItemPrice(product, mediumQuantity, cartItem)}
                        </div>
                        <button className="remove-button" onClick={() => handleRemoveItem(parseInt(productId), scent, medium)}>
                          <FaTrash />
                        </button>
                      </div>
                    ));
                  } else {
                    // No medium options
                    return (
                      <div className="cart-item" key={`${productId}-${scent}`}>
                        <img 
  className="item-image" 
  src={generateImagePath(product.image)} 
  alt={product.name} 
  onError={(e) => {
    console.error(`Failed to load cart image: ${e.target.src}`);
    e.target.onerror = null; // Prevent infinite loop
    e.target.src = isGitHubPages ? '/MHA-React/images/product-placeholder.jpg' : '/images/product-placeholder.jpg';
  }}
/>
                        <div className="item-details">
                          <h3 className="item-name">{product.name}</h3>
                          <div className="item-attributes">
                            <span className="attribute-label">Scent:</span> {scent}
                          </div>
                          <div className="item-price">R{itemPrice}</div>
                        </div>
                        <div className="quantity-controls">
                          <button 
                            className="quantity-button"
                            onClick={() => handleQuantityChange(parseInt(productId), scent, null, -1)}
                            disabled={quantity <= 1}
                          >
                            <FaMinus />
                          </button>
                          <span className="quantity-value">{quantity}</span>
                          <button 
                            className="quantity-button"
                            onClick={() => handleQuantityChange(parseInt(productId), scent, null, 1)}
                            disabled={quantity >= product.stock}
                          >
                            <FaPlus />
                          </button>
                        </div>
                        <div className="item-subtotal">
                          R{getItemPrice(product, quantity)}
                        </div>
                        <button className="remove-button" onClick={() => handleRemoveItem(parseInt(productId), scent, null)}>
                          <FaTrash />
                        </button>
                      </div>
                    );
                  }
                });
              } else {
                // No scent options
                return (
                  <div className="cart-item" key={productId}>
                    {isGiftCard && <span className="gift-label">Gift Card</span>}
                    <img 
  className="item-image" 
  src={generateImagePath(product.image) || (isGitHubPages ? '/MHA-React/images/gift-card.jpg' : '/images/gift-card.jpg')} 
  alt={product.name} 
  onError={(e) => {
    console.error(`Failed to load cart image: ${e.target.src}`);
    e.target.onerror = null; // Prevent infinite loop
    e.target.src = isGitHubPages ? '/MHA-React/images/product-placeholder.jpg' : '/images/product-placeholder.jpg';
  }}
/>
                    <div className="item-details">
                      <h3 className="item-name">{product.name}</h3>
                      <div className="item-attributes">
                        {isGiftCard && (
                          <>
                            <span className="attribute-label">Amount:</span> R{cartItem.customPrice}
                            {cartItem.isGift && (
                              <>
                                <span className="attribute-separator">|</span>
                                <span className="attribute-label">Gift</span>
                              </>
                            )}
                          </>
                        )}
                      </div>
                      {cartItem.giftMessage && (
                        <div className="item-attributes message-box">
                          <span className="attribute-label">Gift Message:</span> {cartItem.giftMessage}
                        </div>
                      )}
                      <div className="item-price">R{itemPrice}</div>
                    </div>
                    <div className="quantity-controls">
                      <button 
                        className="quantity-button"
                        onClick={() => handleQuantityChange(parseInt(productId), null, null, -1)}
                        disabled={cartItem.quantity <= 1}
                      >
                        <FaMinus />
                      </button>
                      <span className="quantity-value">{cartItem.quantity}</span>
                      <button 
                        className="quantity-button"
                        onClick={() => handleQuantityChange(parseInt(productId), null, null, 1)}
                        disabled={cartItem.quantity >= (product.stock || 10)}
                      >
                        <FaPlus />
                      </button>
                    </div>
                    <div className="item-subtotal">
                      R{getItemPrice(product, cartItem.quantity, cartItem)}
                    </div>
                    <button className="remove-button" onClick={() => handleRemoveItem(parseInt(productId), null, null)}>
                      <FaTrash />
                    </button>
                  </div>
                );
              }
            })}
          </div>
          
          <div className="cart-summary">
            <h3 className="summary-title">Order Summary</h3>
            <div className="summary-row">
              <span className="summary-label">Subtotal</span>
              <span className="summary-value">R{cartTotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Shipping</span>
              <span className="summary-value">Free</span>
            </div>
            <div className="total-row">
              <span className="total-label">Total</span>
              <span className="total-value">R{cartTotal.toFixed(2)}</span>
            </div>
            <button className="checkout-button" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
            <Link className="continue-shopping-link" to="/">
              Continue Shopping
            </Link>
          </div>
        </div>
      ) : (
        <div className="empty-cart-message">
          <p className="empty-cart-text">Your cart is empty</p>
          <Link className="continue-shopping-link" to="/">
            Continue Shopping
          </Link>
        </div>
      )}
    </div>
  );
};


export default Cart;
