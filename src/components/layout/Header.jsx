import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaHeart, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import { ShopContext } from '../../context/ShopContext';
import { AuthContext } from '../../context/AuthContext';
import { formatImagePath } from '../../utils/pathUtils';
import SearchBar from '../search/SearchBar';
import '../../styles/Header.css';

const Header = () => {
  const { getCartItemCount } = useContext(ShopContext);
  const { isAuthenticated } = useContext(AuthContext);
  const cartItemCount = getCartItemCount();

  return (
    <div className="header-container">
      <div className="header-top">
        <Link to="/" className="logo">
          <img 
            src={formatImagePath("/store-img/logos-img/MHA_Black_Logo_Transparent.png")} 
            alt="MHA Logo" 
            className="logo-image" 
          />
        </Link>

        <SearchBar />

        <div className="nav-icons">
          <Link className="nav-icon-link" to="/favourites">
            <FaHeart />
          </Link>
          <Link className="nav-icon-link" to="/cart">
            <FaShoppingCart />
            {cartItemCount > 0 && <div className="cart-count">{cartItemCount}</div>}
          </Link>
          {isAuthenticated ? (
            <Link className="nav-icon-link" to="/profile" title="My Profile">
              <FaUser />
            </Link>
          ) : (
            <>
              <Link className="nav-icon-link" to="/login" title="Login">
                <FaSignInAlt />
              </Link>
              <Link className="nav-icon-link" to="/register" title="Register">
                <FaUserPlus />
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="sub-nav">
        <Link className="nav-link" to="/">Home</Link>
        <Link className="nav-link" to="/services">Services</Link>
        <Link className="nav-link" to="/reflection">Reflection</Link>
      </div>
    </div>
  );
};

export default Header;
