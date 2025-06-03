import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app startup
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    return true;
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user');
  };

  // Register function
  const register = (userData) => {
    // In a real app, we would validate if the email already exists
    // For this simple implementation, we'll just save the user
    const newUser = {
      ...userData,
      id: Date.now(), // Simple way to generate unique IDs
      createdAt: new Date().toISOString(),
      orders: []
    };
    
    setCurrentUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    
    // Also save to users collection for future login checks
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    return true;
  };

  // Update user profile
  const updateProfile = (updatedData) => {
    const updatedUser = {
      ...currentUser,
      ...updatedData,
      updatedAt: new Date().toISOString()
    };
    
    setCurrentUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Update in users collection too
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map(user => 
      user.id === currentUser.id ? updatedUser : user
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    return true;
  };

  // Check if email exists (for registration)
  const emailExists = (email) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.some(user => user.email.toLowerCase() === email.toLowerCase());
  };

  // Find user by email (for login)
  const findUserByEmail = (email) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.find(user => user.email.toLowerCase() === email.toLowerCase());
  };

  return (
    <AuthContext.Provider 
      value={{ 
        currentUser, 
        login, 
        logout, 
        register,
        updateProfile,
        emailExists,
        findUserByEmail,
        isAuthenticated: !!currentUser
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
