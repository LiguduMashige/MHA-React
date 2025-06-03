import React, { useContext } from 'react';
import { FaHeart } from 'react-icons/fa';
import { ShopContext } from '../../context/ShopContext';
import '../../styles/ProductCard.css';

const ProductCard = ({ product, onClick }) => {
  const { favorites, toggleFavorite } = useContext(ShopContext);
  const isFavorite = favorites[product.id];

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavorite(product.id);
  };

  return (
    <div className="card-container" onClick={onClick}>
      <div className="image-container">
        <div className="image-wrapper">
          <img className="product-image" src={product.image} alt={product.name} />
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
