import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { FaUser, FaShoppingBag, FaMapMarkerAlt, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import '../styles/Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const { currentUser, updateProfile, logout, isAuthenticated } = useContext(AuthContext);
  const [activeSection, setActiveSection] = useState('profile');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    province: ''
  });
  
  // Load user data and orders from localStorage
  useEffect(() => {
    if (currentUser) {
      // Load user data
      setFormData({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        address: currentUser.address || '',
        city: currentUser.city || '',
        postalCode: currentUser.postalCode || '',
        province: currentUser.province || ''
      });
      
      // Load order history
      if (currentUser.orders) {
        setOrderHistory(currentUser.orders);
      } else {
        // Fallback to legacy orderHistory in localStorage if exists
        const savedOrders = localStorage.getItem('orderHistory');
        if (savedOrders) {
          try {
            const parsedOrders = JSON.parse(savedOrders);
            setOrderHistory(parsedOrders);
          } catch (error) {
            console.error('Error parsing order history:', error);
          }
        }
      }
    }
  }, [currentUser]);
  
  const toggleSection = (section) => {
    setActiveSection(section === activeSection ? null : section);
  };
  
  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Update user profile data
    const success = updateProfile(formData);
    if (success) {
      alert('Profile updated successfully!');
    } else {
      alert('Failed to update profile. Please try again.');
    }
  };
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Redirect if not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <FaUser />
        </div>
        <h1 className="profile-name">{formData.firstName} {formData.lastName}</h1>
        <div className="profile-email">{formData.email}</div>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>
      
      <div className="profile-sections">
        {/* Profile Information Section */}
        <div className="profile-section">
          <div className="section-header" onClick={() => toggleSection('profile')}>
            <h2 className="section-title">
              <span className="section-icon"><FaUser /></span>
              Personal Information
            </h2>
            <span className="toggle-icon">
              {activeSection === 'profile' ? <FaChevronUp /> : <FaChevronDown />}
            </span>
          </div>
          
          {activeSection === 'profile' && (
            <div className="section-content">
              <form className="profile-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">First Name</label>
                    <input 
                      className="form-input"
                      type="text" 
                      name="firstName" 
                      value={formData.firstName} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <input 
                      className="form-input"
                      type="text" 
                      name="lastName" 
                      value={formData.lastName} 
                      onChange={handleInputChange} 
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input 
                      className="form-input"
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input 
                      className="form-input"
                      type="tel" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleInputChange} 
                    />
                  </div>
                </div>
                
                <button className="save-button" type="submit">Save Changes</button>
              </form>
            </div>
          )}
        </div>
        
        {/* Address Section */}
        <div className="profile-section">
          <div className="section-header" onClick={() => toggleSection('address')}>
            <h2 className="section-title">
              <span className="section-icon"><FaMapMarkerAlt /></span>
              Address Information
            </h2>
            <span className="toggle-icon">
              {activeSection === 'address' ? <FaChevronUp /> : <FaChevronDown />}
            </span>
          </div>
          
          {activeSection === 'address' && (
            <div className="section-content">
              <form className="profile-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Street Address</label>
                  <input 
                    className="form-input"
                    type="text" 
                    name="address" 
                    value={formData.address} 
                    onChange={handleInputChange} 
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input 
                      className="form-input"
                      type="text" 
                      name="city" 
                      value={formData.city} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Postal Code</label>
                    <input 
                      className="form-input"
                      type="text" 
                      name="postalCode" 
                      value={formData.postalCode} 
                      onChange={handleInputChange} 
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Province</label>
                  <select 
                    className="form-select"
                    name="province" 
                    value={formData.province} 
                    onChange={handleInputChange}
                  >
                    <option value="">Select Province</option>
                    <option value="Eastern Cape">Eastern Cape</option>
                    <option value="Free State">Free State</option>
                    <option value="Gauteng">Gauteng</option>
                    <option value="KwaZulu-Natal">KwaZulu-Natal</option>
                    <option value="Limpopo">Limpopo</option>
                    <option value="Mpumalanga">Mpumalanga</option>
                    <option value="Northern Cape">Northern Cape</option>
                    <option value="North West">North West</option>
                    <option value="Western Cape">Western Cape</option>
                  </select>
                </div>
                
                <button className="save-button" type="submit">Save Changes</button>
              </form>
            </div>
          )}
        </div>
        
        {/* Order History Section */}
        <div className="profile-section">
          <div className="section-header" onClick={() => toggleSection('orders')}>
            <h2 className="section-title">
              <span className="section-icon"><FaShoppingBag /></span>
              Order History
            </h2>
            <span className="toggle-icon">
              {activeSection === 'orders' ? <FaChevronUp /> : <FaChevronDown />}
            </span>
          </div>
          
          {activeSection === 'orders' && (
            <div className="section-content">
              {orderHistory.length > 0 ? (
                <div className="orders-list">
                  {orderHistory.map(order => (
                    <div className="order-item" key={order.orderId}>
                      <div className="order-header" onClick={() => toggleOrderDetails(order.orderId)}>
                        <div className="order-info">
                          <div className="order-id">Order #{order.orderId}</div>
                          <div className="order-date">{new Date(order.date).toLocaleDateString()}</div>
                        </div>
                        <div className="order-info">
                          <div className="order-status order-status-completed">Completed</div>
                          <div className="order-total">R {order.total.toFixed(2)}</div>
                        </div>
                      </div>
                      
                      {expandedOrder === order.orderId && (
                        <div className="order-details">
                          <div className="order-items-list">
                            {order.items.map((item, index) => (
                              <div className="order-item-detail" key={index}>
                                <div className="order-item-name">{item.name}</div>
                                <div className="order-item-quantity">Qty: {item.quantity}</div>
                                <div className="order-item-price">R {item.price.toFixed(2)}</div>
                                {item.isGift && <div className="order-item-gift">Gift</div>}
                                {item.giftMessage && <div className="order-item-message">Message: {item.giftMessage}</div>}
                              </div>
                            ))}
                          </div>
                          
                          <div className="order-shipping">
                            <h4>Shipping Address:</h4>
                            <p>{order.shippingAddress.address}, {order.shippingAddress.city}</p>
                            <p>{order.shippingAddress.province}, {order.shippingAddress.postalCode}</p>
                          </div>
                          
                          <div className="order-actions">
                            <button className="order-button order-button-primary">Track Order</button>
                            <button className="order-button order-button-secondary">View Invoice</button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-message">You haven't placed any orders yet.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


export default Profile;
