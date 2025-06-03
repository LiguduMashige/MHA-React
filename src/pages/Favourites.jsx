import React, { useState, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import ProductCard from '../components/products/ProductCard';
import ProductModal from '../components/products/ProductModal';
import '../styles/Favourites.css';

const Favourites = () => {
  const { products, favorites, getRecommendedProducts } = useContext(ShopContext);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Filter products that are in favorites
  const favoriteProducts = products.filter(product => favorites[product.id]);
  
  // Get recommended products based on favorites
  const recommendedProducts = getRecommendedProducts(favoriteProducts, 8);
  
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="favourites-container">
      <h1 className="page-title">Your Favourites</h1>
      
      {favoriteProducts.length > 0 ? (
        <>
          <div className="products-grid">
            {favoriteProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onClick={() => handleProductClick(product)}
              />
            ))}
          </div>
          
          {recommendedProducts.length > 0 && (
            <section className="recommendations-section">
              <h2 className="section-title">You Might Also Like</h2>
              <div className="products-grid">
                {recommendedProducts.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onClick={() => handleProductClick(product)}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      ) : (
        <div className="empty-message">
          <h2 className="empty-text">You haven't added any favourites yet</h2>
          <p className="empty-subtext">
            Browse our products and click the heart icon to add items to your favourites
          </p>
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


export default Favourites;
