import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ShopContextProvider } from './context/ShopContext';
import Layout from './components/layout/Layout';

// Pages
import Home from './pages/Home';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Favourites from './pages/Favourites';
import Profile from './pages/Profile';
import Services from './pages/Services';
import SearchResults from './pages/SearchResults';

function App() {
  return (
    <ShopContextProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/favourites" element={<Favourites />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/services" element={<Services />} />
            <Route path="/search-results" element={<SearchResults />} />
          </Routes>
        </Layout>
      </Router>
    </ShopContextProvider>
  );
}

export default App;
