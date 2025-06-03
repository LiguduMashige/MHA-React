import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { getBaseUrl } from './utils/pathUtils';
import { preloadCriticalImages, getCriticalImages, initImageCache } from './utils/preloadUtil';
import './App.css';

// Context Providers
import { ShopContextProvider } from './context/ShopContext';
import AuthProvider from './context/AuthContext';

// Layout Components
import Layout from './components/layout/Layout';

// Pages
import Home from './pages/Home';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Favourites from './pages/Favourites';
import Profile from './pages/Profile';
import Services from './pages/Services';
import SearchResults from './pages/SearchResults';
import Login from './pages/Login';
import Register from './pages/Register';
import Reflection from './pages/Reflection';

// Components
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  useEffect(() => {
    // Initialize image cache from sessionStorage first
    initImageCache();
    
    // Then preload critical images to ensure they're cached
    preloadCriticalImages(getCriticalImages())
      .then(() => console.log('Critical images preloaded successfully'))
      .catch(error => console.error('Error preloading images:', error));
      
    // Add event listener for page visibility changes to reload images when user returns to tab
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('Tab became visible, checking image cache');
        // Only reload if it's been more than 30 seconds since last cache refresh
        const lastRefresh = sessionStorage.getItem('lastCacheRefresh');
        const now = Date.now();
        if (!lastRefresh || (now - parseInt(lastRefresh)) > 30000) {
          preloadCriticalImages(getCriticalImages());
          sessionStorage.setItem('lastCacheRefresh', now.toString());
        }
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <ShopContextProvider>
      <AuthProvider>
        <Router basename={getBaseUrl()}>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
              <Route path="/favourites" element={<Favourites />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/services" element={<Services />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/reflection" element={<Reflection />} />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </ShopContextProvider>
  );
}

export default App;
