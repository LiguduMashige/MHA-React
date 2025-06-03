import React, { useState, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';

// Components
import HeroSection from '../components/home/HeroSection';
import ProductCategory from '../components/products/ProductCategory';
import TopSellingSection from '../components/products/TopSellingSection';
import CandleCareSection from '../components/home/CandleCareSection';
import GiftCardSection from '../components/home/GiftCardSection';
import ProductModal from '../components/products/ProductModal';

// Styles
import '../styles/Home.css';

const Home = () => {
  const { products, loading, getTopSellingProducts } = useContext(ShopContext);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Group products by category
  const categories = {};
  products.forEach(product => {
    // Exclude both 'gift cards' and 'gift' categories
    if (product.category !== 'gift cards' && product.category !== 'gift') {
      if (!categories[product.category]) {
        categories[product.category] = [];
      }
      categories[product.category].push(product);
    }
  });
  
  // Get top selling products
  const topSellingProducts = getTopSellingProducts(10);
  
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  // Format category names for display
  const formatCategoryName = (category) => {
    return category.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="home-container">
      <HeroSection />
      
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      ) : (
        <>
          {/* Render each category section */}
          {Object.entries(categories).map(([category, categoryProducts]) => (
            <ProductCategory 
              key={category}
              title={formatCategoryName(category)}
              products={categoryProducts}
              onProductClick={handleProductClick}
            />
          ))}
          
          {/* Top Selling Section */}
          <TopSellingSection 
            products={topSellingProducts} 
            onProductClick={handleProductClick} 
          />
          
          {/* Candle Care Section */}
          <CandleCareSection />
          
          {/* Gift Card Section */}
          <GiftCardSection />
        </>
      )}
      
      {/* Product Modal */}
      <ProductModal 
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};


export default Home;
