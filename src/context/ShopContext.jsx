import React, { createContext, useState, useEffect } from 'react';

export const ShopContext = createContext(null);

export const ShopContextProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState({});
  const [favorites, setFavorites] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  // Load products from JSON file or localStorage if available
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // Check if we have products in localStorage first
        const savedProducts = localStorage.getItem('products');
        
        if (savedProducts) {
          // Use products from localStorage to maintain stock levels
          setProducts(JSON.parse(savedProducts));
        } else {
          // Load from JSON file if no localStorage data exists
          const response = await import('../data/products.json');
          setProducts(response.default);
          // Initialize localStorage with the products
          localStorage.setItem('products', JSON.stringify(response.default));
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Initialize cart items - separated from products to avoid dependency issues
  useEffect(() => {
    const storedCart = localStorage.getItem('cartItems');
    
    if (storedCart) {
      // Parse the stored cart data and validate it
      try {
        const parsedCart = JSON.parse(storedCart);
        // Check if we have a valid cart object
        if (parsedCart && typeof parsedCart === 'object') {
          console.log('Restored cart from localStorage:', parsedCart);
          setCartItems(parsedCart);
        } else {
          // Invalid format, start with empty cart
          console.warn('Invalid cart format in localStorage');
          setCartItems({});
        }
      } catch (e) {
        console.error('Error parsing cart data:', e);
        // If there's an error parsing, start with empty cart
        localStorage.removeItem('cartItems');
        setCartItems({});
      }
    } else {
      // No stored cart, start with an empty cart
      setCartItems({});
    }
  }, []); // No dependencies to ensure it only runs once on initial load
  
  // Initialize favorites - separated from products to avoid dependency issues
  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    
    if (storedFavorites) {
      try {
        const parsedFavorites = JSON.parse(storedFavorites);
        if (parsedFavorites && typeof parsedFavorites === 'object') {
          console.log('Restored favorites from localStorage');
          setFavorites(parsedFavorites);
        } else {
          initializeEmptyFavorites();
        }
      } catch (e) {
        console.error('Error parsing favorites data:', e);
        initializeEmptyFavorites();
      }
    } else {
      initializeEmptyFavorites();
    }
    
    function initializeEmptyFavorites() {
      const initialFavorites = {};
      products.forEach((product) => {
        initialFavorites[product.id] = false;
      });
      setFavorites(initialFavorites);
    }
  }, [products]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      // Always save cart state, even if empty
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      console.log('Saved cart to localStorage:', Object.keys(cartItems).length ? cartItems : 'empty cart');
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cartItems]);

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    // Always save favorites, even if empty
    localStorage.setItem('favorites', JSON.stringify(favorites));
    console.log('Saved favorites to localStorage');
  }, [favorites]);

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts(products);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = products.filter(product => {
      // Search by name, category, description, scent
      const nameMatch = product.name.toLowerCase().includes(query);
      const categoryMatch = product.category.toLowerCase().includes(query);
      const descriptionMatch = product.description && product.description.toLowerCase().includes(query);
      
      // Check if scents array exists and if any scent matches the query
      const scentMatch = product.scents && 
        product.scents.some(scent => scent.toLowerCase().includes(query));
      
      // Check if medium exists and matches the query
      const mediumMatch = product.medium && 
        product.medium.toLowerCase().includes(query);

      return nameMatch || categoryMatch || descriptionMatch || scentMatch || mediumMatch;
    });

    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  // Add to cart function
  const addToCart = (productId, quantity, scent, medium, giftCardDetails = null) => {
    // Find the product to check stock
    const product = products.find(p => p.id === productId);
    
    // If product doesn't exist or is out of stock, don't add to cart
    if (!product || (product.stock !== undefined && product.stock <= 0)) {
      console.log('Product out of stock');
      return false;
    }
    
    // For standard products, check if the requested quantity is available
    if (!giftCardDetails && product.stock !== undefined) {
      // Check if requested quantity exceeds available stock
      if (quantity > product.stock) {
        console.log('Not enough stock available');
        return false;
      }
    }
    
    // Update product stock in products array FIRST
    if (product.stock !== undefined) {
      const updatedProducts = products.map(p => {
        if (p.id === productId) {
          return { ...p, stock: p.stock - quantity };
        }
        return p;
      });
      
      // Update the products state
      setProducts(updatedProducts);
      
      // Save updated products to localStorage
      localStorage.setItem('products', JSON.stringify(updatedProducts));
    }
    
    // Update cart items
    setCartItems(prev => {
      const updatedCart = {
        ...prev,
        [productId]: giftCardDetails ? 
          {
            quantity: quantity,
            customPrice: giftCardDetails.customPrice,
            isGift: giftCardDetails.isGift,
            giftMessage: giftCardDetails.giftMessage || '',
            scent: null,
            medium: null
          } : 
          {
            quantity: (prev[productId]?.quantity || 0) + quantity,
            scent: scent || prev[productId]?.scent,
            medium: medium || prev[productId]?.medium
          }
      };
      
      // Save cart to localStorage
      localStorage.setItem('cartItems', JSON.stringify(updatedCart));
      
      return updatedCart;
    });
    
    return true;
  };

  // Update cart item quantity
  const updateCartItemQuantity = (productId, newQuantity) => {
    // Find the product to check stock
    const product = products.find(p => p.id === productId);
    const currentQuantity = cartItems[productId]?.quantity || 0;
    
    // If new quantity is 0 or less, remove the item from cart
    if (newQuantity <= 0) {
      const updatedCart = { ...cartItems };
      delete updatedCart[productId];
      
      // Update cart state and localStorage
      setCartItems(updatedCart);
      localStorage.setItem('cartItems', JSON.stringify(updatedCart));
      return;
    }
    
    // Check if the new quantity is available in stock plus what's already in cart
    if (product && product.stock !== undefined) {
      // Calculate how many more items we're adding (could be negative if reducing)
      const quantityDifference = newQuantity - currentQuantity;
      
      // If we're adding more items, check if we have enough stock
      if (quantityDifference > 0 && product.stock < quantityDifference) {
        console.log('Not enough stock available');
        return;
      }
      
      // Update product stock only if we're adding more items
      if (quantityDifference > 0) {
        const updatedProducts = products.map(p => {
          if (p.id === productId) {
            return { ...p, stock: p.stock - quantityDifference };
          }
          return p;
        });
        
        // Update products state and localStorage
        setProducts(updatedProducts);
        localStorage.setItem('products', JSON.stringify(updatedProducts));
      }
    }
    
    // Update cart quantity
    const updatedCart = {
      ...cartItems,
      [productId]: {
        ...cartItems[productId],
        quantity: newQuantity
      }
    };
    
    // Update cart state and localStorage
    setCartItems(updatedCart);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
  };

  // Remove from cart function
  const removeFromCart = (productId, scent = null, medium = null) => {
    // If no scent/medium specified, remove the entire product
    if (!scent) {
      const updatedCart = { ...cartItems };
      delete updatedCart[productId];
      
      // Update cart state (localStorage update happens in useEffect)
      setCartItems(updatedCart);
      return;
    }
    
    // Handle removing specific scent/medium combinations
    const updatedCart = { ...cartItems };
    const item = updatedCart[productId];
    
    if (!item || !item.scentQuantities || !item.scentQuantities[scent]) {
      console.warn('Attempted to remove non-existent item variation');
      return;
    }
    
    // If medium is specified, remove just that medium from the scent
    if (medium && typeof item.scentQuantities[scent] === 'object') {
      const updatedScentQuantities = { ...item.scentQuantities };
      const updatedMediums = { ...updatedScentQuantities[scent] };
      
      delete updatedMediums[medium];
      
      // If no more mediums for this scent, remove the scent
      if (Object.keys(updatedMediums).length === 0) {
        delete updatedScentQuantities[scent];
      } else {
        updatedScentQuantities[scent] = updatedMediums;
      }
      
      // If no more scents, remove the product
      if (Object.keys(updatedScentQuantities).length === 0) {
        delete updatedCart[productId];
      } else {
        updatedCart[productId] = {
          ...item,
          scentQuantities: updatedScentQuantities
        };
      }
    } else {
      // Remove the entire scent
      const updatedScentQuantities = { ...item.scentQuantities };
      delete updatedScentQuantities[scent];
      
      // If no more scents, remove the product
      if (Object.keys(updatedScentQuantities).length === 0) {
        delete updatedCart[productId];
      } else {
        updatedCart[productId] = {
          ...item,
          scentQuantities: updatedScentQuantities
        };
      }
    }
    
    // Update cart state (localStorage update happens in useEffect)
    setCartItems(updatedCart);
  };

  // Toggle favorite status
  const toggleFavorite = (productId) => {
    setFavorites(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  // Calculate cart total
  const getCartTotal = () => {
    let total = 0;
    for (const itemId in cartItems) {
      const cartItem = cartItems[itemId];
      
      if (cartItem.quantity > 0) {
        // Check if this is a gift card with a custom price
        if (cartItem.customPrice) {
          total += cartItem.customPrice * cartItem.quantity;
        } else {
          // Regular product
          const itemInfo = products.find(product => product.id === parseInt(itemId));
          if (itemInfo) {
            total += itemInfo.price * cartItem.quantity;
          }
        }
      }
    }
    return total;
  };

  // Get cart item count
  const getCartItemCount = () => {
    let count = 0;
    for (const itemId in cartItems) {
      count += cartItems[itemId].quantity;
    }
    return count;
  };

  // Buy now function (add to cart and proceed to checkout)
  const buyNow = (productId, quantity, scent, medium) => {
    // Find the product to check stock
    const product = products.find(p => p.id === productId);
    
    // If product doesn't exist or is out of stock, don't add to cart
    if (!product || (product.stock !== undefined && product.stock <= 0)) {
      console.log('Product out of stock');
      return false;
    }
    
    // For standard products, check if the requested quantity is available
    if (product.stock !== undefined) {
      // Check if requested quantity exceeds available stock
      if (quantity > product.stock) {
        console.log('Not enough stock available');
        return false;
      }
    }
    
    // Update product stock in products array FIRST
    if (product.stock !== undefined) {
      const updatedProducts = products.map(p => {
        if (p.id === productId) {
          return { ...p, stock: p.stock - quantity };
        }
        return p;
      });
      
      // Update the products state
      setProducts(updatedProducts);
      
      // Save updated products to localStorage
      localStorage.setItem('products', JSON.stringify(updatedProducts));
    }
    
    // Update cart items
    const updatedCart = {
      ...cartItems,
      [productId]: {
        quantity: quantity,
        scent: scent,
        medium: medium
      }
    };
    
    // Update cart state and localStorage
    setCartItems(updatedCart);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    
    return true; // Return success
    // Navigation is handled by the component
  };

  // Get top selling products (highest rated)
  const getTopSellingProducts = () => {
    return [...products]
      .filter(product => product.rating >= 4.4 && product.rating <= 5.1)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 10);
  };

  // Get products by category
  const getProductsByCategory = (category) => {
    return products.filter(product => product.category === category);
  };

  // Get favorite products
  const getFavoriteProducts = () => {
    return products.filter(product => favorites[product.id]);
  };

  // Search products function
  const searchProducts = (query) => {
    if (!query || query.trim() === '') {
      return [];
    }
    
    const searchTerm = query.toLowerCase();
    return products.filter(product => {
      // Search by name, category, description, scent
      const nameMatch = product.name.toLowerCase().includes(searchTerm);
      const categoryMatch = product.category.toLowerCase().includes(searchTerm);
      const descriptionMatch = product.description && product.description.toLowerCase().includes(searchTerm);
      
      // Check if scents array exists and if any scent matches the query
      const scentMatch = product.scents && 
        product.scents.some(scent => scent.toLowerCase().includes(searchTerm));
      
      // Check if medium exists and matches the query
      const mediumMatch = product.medium && 
        product.medium.toLowerCase().includes(searchTerm);

      return nameMatch || categoryMatch || descriptionMatch || scentMatch || mediumMatch;
    });
  };
  
  // Get recommended products based on user favorites or viewed products
  const getRecommendedProducts = (baseProducts, limit = 4) => {
    if (!baseProducts || baseProducts.length === 0) {
      return [];
    }
    
    // Get categories from base products
    const categories = [...new Set(baseProducts.map(product => product.category))];
    
    // Get products from same categories that aren't in the base products
    const baseProductIds = baseProducts.map(p => p.id);
    const recommendations = products.filter(product => 
      categories.includes(product.category) && !baseProductIds.includes(product.id)
    );
    
    // Shuffle and limit results
    return [...recommendations]
      .sort(() => 0.5 - Math.random())
      .slice(0, limit);
  };

  // Get recommendations based on favorites
  const getRecommendations = () => {
    // Get categories of favorite products
    const favoriteProducts = getFavoriteProducts();
    const favoriteCategories = [...new Set(favoriteProducts.map(product => product.category))];
    
    // Get 2 random products from each favorite category
    const recommendations = [];
    
    favoriteCategories.forEach(category => {
      const categoryProducts = products.filter(
        product => product.category === category && !favorites[product.id]
      );
      
      // Shuffle and take up to 2 products
      const shuffled = [...categoryProducts].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 2);
      
      recommendations.push(...selected);
    });
    
    return recommendations;
  };

  // Clear cart function
  const clearCart = () => {
    // Don't restore stock, just clear the cart
    // This simulates a real e-commerce site where stock is reduced when added to cart
    setCartItems({});
    localStorage.removeItem('cartItems');
  };

  const contextValue = {
    products,
    loading,
    cartItems,
    favorites,
    searchQuery,
    setSearchQuery,
    filteredProducts,
    searchResults,
    setSearchResults,
    searchProducts,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    toggleFavorite,
    getCartTotal,
    getCartItemCount,
    buyNow,
    getTopSellingProducts,
    getProductsByCategory,
    getFavoriteProducts,
    getRecommendations,
    getRecommendedProducts,
    clearCart
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {children}
    </ShopContext.Provider>
  );
};
