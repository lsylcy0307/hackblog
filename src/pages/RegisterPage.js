import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Layout from '../components/layout/Layout';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import theme from '../utils/theme';

const FormContainer = styled.div`
  max-width: 600px;
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

const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.md};
  
  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
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

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    linkedin_url: '',
    personal_bio: '',
    class_year: '',
    github_url: ''
  });
  
  const [errors, setErrors] = useState({});
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

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
    
    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (!formData.name) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (formData.linkedin_url && !formData.linkedin_url.includes('linkedin.com')) {
      newErrors.linkedin_url = 'Please enter a valid LinkedIn URL';
    }
    
    if (formData.github_url && !formData.github_url.includes('github.com')) {
      newErrors.github_url = 'Please enter a valid GitHub URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    // Remove confirmPassword as it's not needed for the API
    const { confirmPassword, ...registerData } = formData;
    
    try {
      await register(registerData);
      navigate('/');
    } catch (error) {
      console.error('Registration error:', error);
      // Error is handled by the auth context
    }
  };

  return (
    <Layout>
      <FormContainer>
        <FormTitle>Create an Account</FormTitle>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <form onSubmit={handleSubmit}>
          <TwoColumnGrid>
            <FormGroup>
              <Input
                label="Username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                error={errors.username}
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Input
                label="Full Name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                required
              />
            </FormGroup>
          </TwoColumnGrid>
          
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
          
          <TwoColumnGrid>
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
            
            <FormGroup>
              <Input
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                required
              />
            </FormGroup>
          </TwoColumnGrid>
          
          <FormGroup>
            <Input
              label="LinkedIn URL"
              type="text"
              name="linkedin_url"
              value={formData.linkedin_url}
              onChange={handleChange}
              error={errors.linkedin_url}
              placeholder="https://linkedin.com/in/yourusername"
            />
          </FormGroup>
          
          <FormGroup>
            <Input
              label="GitHub URL"
              type="text"
              name="github_url"
              value={formData.github_url}
              onChange={handleChange}
              error={errors.github_url}
              placeholder="https://github.com/yourusername"
            />
          </FormGroup>
          
          <TwoColumnGrid>
            <FormGroup>
              <Input
                label="Class Year"
                type="text"
                name="class_year"
                value={formData.class_year}
                onChange={handleChange}
                error={errors.class_year}
                placeholder="e.g., 2023"
              />
            </FormGroup>
          </TwoColumnGrid>
          
          <FormGroup>
            <Input
              label="Bio"
              type="textarea"
              name="personal_bio"
              value={formData.personal_bio}
              onChange={handleChange}
              error={errors.personal_bio}
              placeholder="Tell us about yourself..."
            />
          </FormGroup>
          
          <Button
            type="submit"
            fullWidth
            isLoading={loading}
            disabled={loading}
          >
            Sign Up
          </Button>
        </form>
        
        <FormFooter>
          Already have an account? <Link to="/login">Sign In</Link>
        </FormFooter>
      </FormContainer>
    </Layout>
  );
};

export default RegisterPage; 