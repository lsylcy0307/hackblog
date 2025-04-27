import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Layout from '../components/layout/Layout';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import { useAuth } from '../context/AuthContext';
import apiService from '../utils/api';
import theme from '../utils/theme';

const PageHeader = styled.div`
  margin-bottom: ${theme.spacing.xl};
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: ${theme.spacing.md};
  position: relative;
  display: inline-block;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 60%;
    height: 4px;
    background-color: ${theme.colors.primary};
    border-radius: 2px;
  }
`;

const FormContainer = styled.div`
  background-color: white;
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.xl};
  box-shadow: ${theme.boxShadow.md};
  max-width: 800px;
  margin: 0 auto;
`;

const FormSection = styled.div`
  margin-bottom: ${theme.spacing.xl};
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: ${theme.spacing.md};
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

const ButtonGroup = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  margin-top: ${theme.spacing.xl};
`;

const ErrorMessage = styled.div`
  color: ${theme.colors.error};
  background-color: ${`${theme.colors.error}10`};
  padding: ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.md};
  margin-bottom: ${theme.spacing.md};
`;

const SuccessMessage = styled.div`
  color: ${theme.colors.success};
  background-color: ${`${theme.colors.success}10`};
  padding: ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.md};
  margin-bottom: ${theme.spacing.md};
`;

const ProfilePage = () => {
  const { currentUser, isAuthenticated, loading: authLoading, updateProfile } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    linkedin_url: '',
    github_url: '',
    personal_bio: '',
    class_year: '',
    profile_picture_url: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login', { state: { from: '/profile' } });
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Load user data when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        username: currentUser.username || '',
        linkedin_url: currentUser.linkedin_url || '',
        github_url: currentUser.github_url || '',
        personal_bio: currentUser.personal_bio || '',
        class_year: currentUser.class_year || '',
        profile_picture_url: currentUser.profile_picture_url || ''
      });
    } else {
      console.log('CurrentUser not available yet');
    }
  }, [currentUser]);

  // Add a new useEffect to ensure we get fresh data from the server
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (isAuthenticated && !authLoading) {
        try {
          console.log('Fetching fresh user profile data');
          const response = await apiService.auth.getProfile();
          // The AuthContext will update with this data via its interceptor
        } catch (err) {
          console.error('Error fetching profile:', err);
        }
      }
    };
    
    fetchUserProfile();
  }, [isAuthenticated, authLoading]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear messages when user starts typing
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Create a new object with only the fields that have changed
      const changedFields = {};
      
      // Compare each field with the original user data and only include changed fields
      if (formData.name !== currentUser.name) changedFields.name = formData.name;
      if (formData.linkedin_url !== currentUser.linkedin_url) changedFields.linkedin_url = formData.linkedin_url;
      if (formData.github_url !== currentUser.github_url) changedFields.github_url = formData.github_url;
      if (formData.personal_bio !== currentUser.personal_bio) changedFields.personal_bio = formData.personal_bio;
      if (formData.class_year !== currentUser.class_year) changedFields.class_year = formData.class_year;
      if (formData.profile_picture_url !== currentUser.profile_picture_url) changedFields.profile_picture_url = formData.profile_picture_url;
      
      // Only proceed with update if there are actually changes
      if (Object.keys(changedFields).length > 0) {
        await updateProfile(changedFields);
        setSuccess('Profile updated successfully!');
      } else {
        setSuccess('No changes detected.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  if (authLoading) {
    return <Layout><Spinner size="lg" /></Layout>;
  }

  return (
    <Layout>
      <PageHeader>
        <PageTitle>Your Profile</PageTitle>
      </PageHeader>
      
      <FormContainer>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}
        
        <form onSubmit={handleSubmit}>
          <FormSection>
            <SectionTitle>Basic Information</SectionTitle>
            
            <TwoColumnGrid>
              <FormGroup>
                <Input
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Input
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Your username"
                  required
                  disabled
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
                placeholder="Your email address"
                required
                disabled
              />
            </FormGroup>
            
            <FormGroup>
              <Input
                label="Profile Picture URL"
                name="profile_picture_url"
                value={formData.profile_picture_url}
                onChange={handleChange}
                placeholder="URL to your profile picture"
              />
            </FormGroup>
          </FormSection>
          
          <FormSection>
            <SectionTitle>Professional Information</SectionTitle>
            
            <TwoColumnGrid>
              <FormGroup>
                <Input
                  label="LinkedIn URL"
                  name="linkedin_url"
                  value={formData.linkedin_url}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/yourusername"
                />
              </FormGroup>
              
              <FormGroup>
                <Input
                  label="GitHub URL"
                  name="github_url"
                  value={formData.github_url}
                  onChange={handleChange}
                  placeholder="https://github.com/yourusername"
                />
              </FormGroup>
            </TwoColumnGrid>
            
            <FormGroup>
              <Input
                label="Class Year"
                name="class_year"
                value={formData.class_year}
                onChange={handleChange}
                placeholder="e.g., 2023"
              />
            </FormGroup>
          </FormSection>
          
          <FormGroup>
            <Input
              label="Bio"
              type="textarea"
              name="personal_bio"
              value={formData.personal_bio}
              onChange={handleChange}
              placeholder="Tell us about yourself..."
              rows={6}
            />
          </FormGroup>
          
          <ButtonGroup>
            <Button
              type="submit"
              disabled={loading}
              isLoading={loading}
            >
              Save Changes
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </Button>
          </ButtonGroup>
        </form>
      </FormContainer>
    </Layout>
  );
};

export default ProfilePage; 