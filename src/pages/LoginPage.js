import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Layout from '../components/layout/Layout';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import theme from '../utils/theme';

const FormContainer = styled.div`
  max-width: 500px;
  margin: 0 auto;
  padding: ${theme.spacing.xl};
  background-color: ${theme.colors.background};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.boxShadow.md};
`;

const FormTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: ${theme.spacing.lg};
  color: ${theme.colors.text};
`;

const FormGroup = styled.div`
  margin-bottom: ${theme.spacing.md};
`;

const ErrorMessage = styled.div`
  color: ${theme.colors.error};
  background-color: ${`${theme.colors.error}10`};
  padding: ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.md};
  margin-bottom: ${theme.spacing.md};
  text-align: center;
`;

const FormFooter = styled.div`
  margin-top: ${theme.spacing.lg};
  text-align: center;
  color: ${theme.colors.lightText};
  
  a {
    color: ${theme.colors.primary};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const { login, loading, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the redirect path from location state or default to home page
  const from = location.state?.from || '/';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from);
    }
  }, [isAuthenticated, navigate, from]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await login(formData.email, formData.password);
      // Will be redirected by the useEffect hook
    } catch (error) {
      console.error('Login error:', error);
      // Error is handled by the auth context
    }
  };

  return (
    <Layout>
      <FormContainer>
        <FormTitle>Sign In</FormTitle>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
            />
          </FormGroup>
          
          <Button
            type="submit"
            fullWidth
            isLoading={loading}
            disabled={loading}
          >
            Sign In
          </Button>
        </form>
        
        <FormFooter>
          Don't have an account? <Link to="/register">Sign Up</Link>
        </FormFooter>
      </FormContainer>
    </Layout>
  );
};

export default LoginPage; 