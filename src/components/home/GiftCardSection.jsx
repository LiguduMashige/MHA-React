import React, { useState, useContext } from 'react';
import { ShopContext } from '../../context/ShopContext';
import { formatImagePath } from '../../utils/pathUtils';
import '../../styles/GiftCardSection.css';

const giftCardPrices = [100, 200, 500, 1000];

const GiftCardSection = () => {
  const { products, addToCart } = useContext(ShopContext);
  const [selectedPrice, setSelectedPrice] = useState(200);
  const [isGift, setIsGift] = useState(false);
  const [giftMessage, setGiftMessage] = useState('');
  
  // Find gift card product - ensure we only use the one with id 59 which is at the bottom of the page
  const giftCardProduct = products.find(product => product.category === 'gift' && product.id === 59);
  
  const handleAddToCart = () => {
    if (giftCardProduct) {
      // Add gift card to cart with price and gift message
      addToCart(
        giftCardProduct.id,
        1,                // quantity
        null,             // scent (null for gift cards)
        null,             // medium (null for gift cards)
        {                 // gift card details object
          customPrice: selectedPrice,
          isGift: isGift,
          giftMessage: isGift ? giftMessage : ''
        }
      );
      
      // Show visual feedback
      const button = document.querySelector('.gift-add-to-cart-button');
      const originalText = button.textContent;
      button.textContent = 'Added to Cart!';
      button.classList.add('success');
      
      // Reset button after delay
      setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove('success');
      }, 2000);
    }
  };

  return (
    <section className="gift-section-container">
      <div className="gift-content-container">
        <div className="gift-text-content">
          <h2 className="gift-section-title">Gift Cards</h2>
          <p className="gift-section-description">
            Give the gift of choice with our digital gift cards. Perfect for birthdays, 
            anniversaries, or just because. Let them choose their favorite home accessories.
          </p>
          
          <div className="gift-price-selector">
            <p className="gift-selector-label">Select Amount:</p>
            <div className="gift-price-options">
              {giftCardPrices.map(price => (
                <button 
                  key={price}
                  className={`gift-price-option ${price === selectedPrice ? 'selected' : ''}`}
                  onClick={() => setSelectedPrice(price)}
                >
                  R{price}
                </button>
              ))}
            </div>
          </div>
          
          <div className="gift-toggle">
            <label className="gift-toggle-label">
              <input 
                className="gift-toggle-checkbox"
                type="checkbox" 
                checked={isGift} 
                onChange={() => setIsGift(!isGift)}
              />
              This is a gift
            </label>
          </div>
          
          {isGift && (
            <div className="gift-message-container">
              <label className="gift-message-label">Gift Message (optional):</label>
              <textarea
                className="gift-message-input"
                value={giftMessage}
                onChange={(e) => setGiftMessage(e.target.value)}
                placeholder="Enter a personalized message to the recipient..."
                rows={3}
              />
            </div>
          )}
          
          <button className="gift-add-to-cart-button" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
        
        <div className="gift-image-container">
          <img 
            className="gift-card-image" 
            src={formatImagePath(giftCardProduct ? giftCardProduct.image : '/store-img/logos-img/MHA_Gold_Logo_White_Background.jpg')} 
            alt="Gift Card" 
          />
        </div>
      </div>
    </section>
  );
};


export default GiftCardSection;
