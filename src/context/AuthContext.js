import React, { createContext, useState, useEffect, useContext } from 'react';
import apiService from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verify token and load user data on initial mount or refresh
  useEffect(() => {
    const loadUserFromStorage = async () => {
      setLoading(true);
      
      try {
        // Check for token in localStorage
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (!token) {
          setLoading(false);
          return;
        }

        // First set the stored user data to avoid flashing login screens
        if (storedUser) {
          try {
            setCurrentUser(JSON.parse(storedUser));
          } catch (err) {
            console.error('Failed to parse stored user', err);
          }
        }
        
        // Then verify the token with the server
        try {
          const response = await apiService.auth.getProfile();
          const userData = response.data.data;
          
          // Update the user data in state and localStorage
          setCurrentUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        } catch (error) {
          console.error('Token verification failed:', error);
          // Only logout if there was an actual auth error
          if (error.response && error.response.status === 401) {
            logout();
          }
        }
      } finally {
        setLoading(false);
      }
    };

    loadUserFromStorage();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.auth.login({ email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setCurrentUser(user);
      return user;
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.auth.register(userData);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setCurrentUser(user);
      return user;
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  const updateProfile = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.auth.updateProfile(userData);
      const updatedUser = response.data.data;
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
      
      return updatedUser;
    } catch (error) {
      setError(error.response?.data?.message || 'Profile update failed. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    isAdmin: currentUser?.admin_status === 'admin',
    isAuthor: ['author', 'admin'].includes(currentUser?.admin_status),
    isAuthenticated: !!currentUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 