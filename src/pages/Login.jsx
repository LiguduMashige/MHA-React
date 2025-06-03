import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../styles/Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, findUserByEmail } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the path the user was trying to access before being redirected to login
  const from = location.state?.from?.pathname || '/';
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }
    
    // In a real app, we would send this to a server
    // For this simple implementation, we'll check localStorage
    const user = findUserByEmail(email);
    
    if (!user) {
      setError('No account found with this email');
      setLoading(false);
      return;
    }
    
    if (user.password !== password) { // In real app, use proper password hashing
      setError('Incorrect password');
      setLoading(false);
      return;
    }
    
    // Login successful
    login(user);
    setLoading(false);
    
    // Redirect to the page they were trying to access, or home
    navigate(from, { replace: true });
  };
  
  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h2>Login to Your Account</h2>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="auth-links">
          <p>
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
