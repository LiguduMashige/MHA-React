import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { AuthContext } from '../context/AuthContext';
import '../styles/Checkout.css';

const Checkout = () => {
  const { products, cartItems, getCartTotal, clearCart } = useContext(ShopContext);
  const { currentUser, updateProfile } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [contactInfo, setContactInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  
  const [deliveryInfo, setDeliveryInfo] = useState({
    address: '',
    city: '',
    postalCode: '',
    province: ''
  });
  
  // Pre-fill form with user data if logged in
  useEffect(() => {
    if (currentUser) {
      setContactInfo({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
        phone: currentUser.phone || ''
      });
      
      // If user has address info saved, pre-fill delivery info
      if (currentUser.address) {
        setDeliveryInfo({
          address: currentUser.address || '',
          city: currentUser.city || '',
          postalCode: currentUser.postalCode || '',
          province: currentUser.province || ''
        });
      }
    }
  }, [currentUser]);
  
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });
  
  const [tipAmount, setTipAmount] = useState(0);
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  const cartTotal = getCartTotal();
  const shippingCost = cartTotal > 500 ? 0 : 50;
  const totalWithShipping = cartTotal + shippingCost;
  const finalTotal = totalWithShipping + tipAmount;
  
  const tipOptions = [0, 20, 50, 100];
  
  const handleContactChange = (e) => {
    setContactInfo({
      ...contactInfo,
      [e.target.name]: e.target.value
    });
  };
  
  const handleDeliveryChange = (e) => {
    setDeliveryInfo({
      ...deliveryInfo,
      [e.target.name]: e.target.value
    });
  };
  
  const handlePaymentChange = (e) => {
    setPaymentInfo({
      ...paymentInfo,
      [e.target.name]: e.target.value
    });
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // Contact validation
    if (!contactInfo.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!contactInfo.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!contactInfo.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(contactInfo.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!contactInfo.phone.trim()) newErrors.phone = 'Phone number is required';
    
    // Delivery validation
    if (!deliveryInfo.address.trim()) newErrors.address = 'Address is required';
    if (!deliveryInfo.city.trim()) newErrors.city = 'City is required';
    if (!deliveryInfo.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
    if (!deliveryInfo.province.trim()) newErrors.province = 'Province is required';
    
    // Payment validation
    if (!paymentInfo.cardNumber.trim()) {
      newErrors.cardNumber = 'Card number is required';
    } else if (!/^\d{16}$/.test(paymentInfo.cardNumber.replace(/\s/g, ''))) {
      newErrors.cardNumber = 'Card number must be 16 digits';
    }
    if (!paymentInfo.cardName.trim()) newErrors.cardName = 'Name on card is required';
    if (!paymentInfo.expiryDate.trim()) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(paymentInfo.expiryDate)) {
      newErrors.expiryDate = 'Expiry date must be in MM/YY format';
    }
    if (!paymentInfo.cvv.trim()) {
      newErrors.cvv = 'CVV is required';
    } else if (!/^\d{3,4}$/.test(paymentInfo.cvv)) {
      newErrors.cvv = 'CVV must be 3 or 4 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsProcessing(true);
      
      // Simulate payment processing
      setTimeout(() => {
        setIsProcessing(false);
        setIsComplete(true);
        clearCart();
        
        // Save order to order history
        const orderData = {
          orderId: Math.floor(Math.random() * 1000000),
          date: new Date().toISOString(),
          items: Object.entries(cartItems).map(([productId, cartItem]) => {
            const product = products.find(p => p.id === parseInt(productId));
            return {
              id: parseInt(productId),
              name: product?.name || 'Product',
              quantity: cartItem.quantity,
              price: cartItem.customPrice || product?.price || 0,
              scent: cartItem.scent || null,
              medium: cartItem.medium || null,
              isGift: cartItem.isGift || false,
              giftMessage: cartItem.giftMessage || ''
            };
          }),
          total: finalTotal,
          shippingAddress: deliveryInfo,
          contactInfo: contactInfo
        };
        
        // Save to localStorage and user profile if logged in
        const existingOrders = JSON.parse(localStorage.getItem('orderHistory') || '[]');
        localStorage.setItem('orderHistory', JSON.stringify([...existingOrders, orderData]));
        
        // If user is logged in, update their profile with order history and address info
        if (currentUser) {
          const userOrders = currentUser.orders || [];
          const updatedUser = {
            ...currentUser,
            orders: [...userOrders, orderData],
            address: deliveryInfo.address,
            city: deliveryInfo.city,
            postalCode: deliveryInfo.postalCode,
            province: deliveryInfo.province,
          };
          updateProfile(updatedUser);
        }
        
        // Redirect to home after 5 seconds
        setTimeout(() => {
          navigate('/');
        }, 5000);
      }, 2000);
    }
  };
  
  if (Object.keys(cartItems).length === 0 && !isComplete) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="checkout-container">
      {isComplete ? (
        <div className="success-message">
          <h2 className="success-title">Order Complete!</h2>
          <p className="success-text">
            Thank you for your purchase. Your order has been received and will be processed shortly.
            You will receive a confirmation email with your order details.
          </p>
          <p className="success-text">
            Redirecting you to the home page...
          </p>
        </div>
      ) : (
        <div className="checkout-content">
          <form className="checkout-form" onSubmit={handleSubmit}>
            <h1 className="checkout-title">Checkout</h1>
            
            <div className="form-section">
              <h2 className="section-title">Contact Information</h2>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input 
                    className={`form-input ${errors.firstName ? 'error' : ''}`}
                    type="text" 
                    name="firstName" 
                    value={contactInfo.firstName} 
                    onChange={handleContactChange}
                  />
                  {errors.firstName && <div className="error-message">{errors.firstName}</div>}
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input 
                    className={`form-input ${errors.lastName ? 'error' : ''}`}
                    type="text" 
                    name="lastName" 
                    value={contactInfo.lastName} 
                    onChange={handleContactChange}
                  />
                  {errors.lastName && <div className="error-message">{errors.lastName}</div>}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input 
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    type="email" 
                    name="email" 
                    value={contactInfo.email} 
                    onChange={handleContactChange}
                  />
                  {errors.email && <div className="error-message">{errors.email}</div>}
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input 
                    className={`form-input ${errors.phone ? 'error' : ''}`}
                    type="tel" 
                    name="phone" 
                    value={contactInfo.phone} 
                    onChange={handleContactChange}
                  />
                  {errors.phone && <div className="error-message">{errors.phone}</div>}
                </div>
              </div>
            </div>
            
            <div className="form-section">
              <h2 className="section-title">Delivery Information</h2>
              <div className="form-group">
                <label className="form-label">Address</label>
                <input 
                  className={`form-input ${errors.address ? 'error' : ''}`}
                  type="text" 
                  name="address" 
                  value={deliveryInfo.address} 
                  onChange={handleDeliveryChange}
                />
                {errors.address && <div className="error-message">{errors.address}</div>}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input 
                    className={`form-input ${errors.city ? 'error' : ''}`}
                    type="text" 
                    name="city" 
                    value={deliveryInfo.city} 
                    onChange={handleDeliveryChange}
                  />
                  {errors.city && <div className="error-message">{errors.city}</div>}
                </div>
                <div className="form-group">
                  <label className="form-label">Postal Code</label>
                  <input 
                    className={`form-input ${errors.postalCode ? 'error' : ''}`}
                    type="text" 
                    name="postalCode" 
                    value={deliveryInfo.postalCode} 
                    onChange={handleDeliveryChange}
                  />
                  {errors.postalCode && <div className="error-message">{errors.postalCode}</div>}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Province</label>
                <select 
                  className={`form-select ${errors.province ? 'error' : ''}`}
                  name="province" 
                  value={deliveryInfo.province} 
                  onChange={handleDeliveryChange}
                >
                  <option value="">Select Province</option>
                  <option value="Eastern Cape">Eastern Cape</option>
                  <option value="Free State">Free State</option>
                  <option value="Gauteng">Gauteng</option>
                  <option value="KwaZulu-Natal">KwaZulu-Natal</option>
                  <option value="Limpopo">Limpopo</option>
                  <option value="Mpumalanga">Mpumalanga</option>
                  <option value="North West">North West</option>
                  <option value="Northern Cape">Northern Cape</option>
                  <option value="Western Cape">Western Cape</option>
                </select>
                {errors.province && <div className="error-message">{errors.province}</div>}
              </div>
            </div>
            
            <div className="form-section">
              <h2 className="section-title">Payment Information</h2>
              <div className="form-group">
                <label className="form-label">Card Number</label>
                <input 
                  className={`form-input ${errors.cardNumber ? 'error' : ''}`}
                  type="text" 
                  name="cardNumber" 
                  value={paymentInfo.cardNumber} 
                  onChange={handlePaymentChange}
                  placeholder="1234 5678 9012 3456"
                />
                {errors.cardNumber && <div className="error-message">{errors.cardNumber}</div>}
              </div>
              <div className="form-group">
                <label className="form-label">Name on Card</label>
                <input 
                  className={`form-input ${errors.cardName ? 'error' : ''}`}
                  type="text" 
                  name="cardName" 
                  value={paymentInfo.cardName} 
                  onChange={handlePaymentChange}
                />
                {errors.cardName && <div className="error-message">{errors.cardName}</div>}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Expiry Date</label>
                  <input 
                    className={`form-input ${errors.expiryDate ? 'error' : ''}`}
                    type="text" 
                    name="expiryDate" 
                    value={paymentInfo.expiryDate} 
                    onChange={handlePaymentChange}
                    placeholder="MM/YY"
                  />
                  {errors.expiryDate && <div className="error-message">{errors.expiryDate}</div>}
                </div>
                <div className="form-group">
                  <label className="form-label">CVV</label>
                  <input 
                    className={`form-input ${errors.cvv ? 'error' : ''}`}
                    type="text" 
                    name="cvv" 
                    value={paymentInfo.cvv} 
                    onChange={handlePaymentChange}
                    placeholder="123"
                  />
                  {errors.cvv && <div className="error-message">{errors.cvv}</div>}
                </div>
              </div>
              
              <div className="tip-section">
                <h3 className="tip-title">Add a Tip for Our Artisans</h3>
                <div className="tip-options">
                  {tipOptions.map(option => (
                    <button
                      key={option}
                      type="button"
                      className={`tip-option ${tipAmount === option ? 'selected' : ''}`}
                      onClick={() => setTipAmount(option)}
                    >
                      {option === 0 ? 'No Tip' : `R${option}`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <button 
              className="submit-button" 
              type="submit" 
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Complete Order'}
            </button>
          </form>
          
          <div className="order-summary">
            <h3 className="summary-title">Order Summary</h3>
            
            <div className="order-items">
              {Object.entries(cartItems).map(([productId, cartItem]) => {
                const product = products.find(p => p.id === parseInt(productId));
                if (!product) return null;
                
                return (
                  <div className="order-item" key={productId}>
                    <img 
                      className="item-image-small"
                      src={product.image} 
                      alt={product.name} 
                    />
                    <div className="item-info">
                      <div className="item-name-small">{product.name}</div>
                      <div className="item-quantity">
                        {cartItem.quantity} × {cartItem.scent ? `${cartItem.scent} ` : ''}
                        {cartItem.medium ? `(${cartItem.medium})` : ''}
                      </div>
                    </div>
                    <div className="item-price-small">R{product.price * cartItem.quantity}</div>
                  </div>
                );
              })}
            </div>
            
            <hr className="summary-divider" />
            
            <div className="summary-row">
              <span className="summary-label">Subtotal</span>
              <span className="summary-value">R{cartTotal}</span>
            </div>
            
            <div className="summary-row">
              <span className="summary-label">Shipping</span>
              <span className="summary-value">
                {shippingCost === 0 ? 'Free' : `R${shippingCost}`}
              </span>
            </div>
            
            {tipAmount > 0 && (
              <div className="summary-row">
                <span className="summary-label">Tip</span>
                <span className="summary-value">R{tipAmount}</span>
              </div>
            )}
            
            <div className="total-row">
              <span className="total-label">Total</span>
              <span className="total-value">R{finalTotal}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
