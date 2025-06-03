import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

// Components
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ShopContextProvider>
      <AuthProvider>
        <Router>
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
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </ShopContextProvider>
  );
}

export default App;
