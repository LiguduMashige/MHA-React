import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../styles/Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { login, findUserByEmail } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the path the user was trying to access before being redirected to login
  const from = location.state?.from?.pathname || '/';
  
  // Clear error when user types in fields
  useEffect(() => {
    if (error) {
      setShowError(true);
      const timer = setTimeout(() => {
        setShowError(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setShowError(false);
    setLoading(true);
    
    if (!email || !password) {
      setError('Please fill in all fields');
      setShowError(true);
      setLoading(false);
      return;
    }
    
    // In a real app, we would send this to a server
    // For this simple implementation, we'll check localStorage
    const user = findUserByEmail(email);
    
    if (!user) {
      setError('No account found with this email');
      setShowError(true);
      setLoading(false);
      return;
    }
    
    if (user.password !== password) { // In real app, use proper password hashing
      setError('Incorrect password');
      setShowError(true);
      setLoading(false);
      return;
    }
    
    // Login successful
    login(user);
    setLoading(false);
    
    // Correctly use navigate with replace to update history
    navigate(from, { replace: true });
  };
  
  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h2>Login to Your Account</h2>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <h1>Login</h1>
          
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setShowError(false);
              }} 
              className={`form-control ${error && error.includes('email') ? 'input-error' : ''}`}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setShowError(false);
              }} 
              className={`form-control ${error && error.includes('password') ? 'input-error' : ''}`}
              required
            />
            <div className="forgot-password">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>
          </div>
          
          {showError && <div className="error-message error-bottom">{error}</div>}
          
          <button 
            type="submit" 
            className="auth-button" 
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          
          <div className="auth-switch">
            Don't have an account? <Link to="/register">Register</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
