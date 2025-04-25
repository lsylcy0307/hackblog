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
import RichTextEditor from '../components/editor/RichTextEditor';

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
`;

const FormGroup = styled.div`
  margin-bottom: ${theme.spacing.lg};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  margin-top: ${theme.spacing.xl};
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing.sm};
  margin-top: ${theme.spacing.sm};
`;

const TagButton = styled.button`
  background-color: ${props => props.selected ? theme.colors.primary : theme.colors.lightBackground};
  color: ${props => props.selected ? 'white' : theme.colors.text};
  border: 1px solid ${props => props.selected ? theme.colors.primary : theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  padding: 8px 12px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.selected ? theme.colors.primary : theme.colors.border};
  }
`;

const ErrorMessage = styled.div`
  color: ${theme.colors.error};
  background-color: ${`${theme.colors.error}10`};
  padding: ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.md};
  margin-bottom: ${theme.spacing.md};
`;

const CreateArticlePage = () => {
  const { currentUser, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    cover_picture_url: '',
    article_content: { content: '' },
    tags: []
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const categories = [
    { id: 'engineering', label: 'Engineering' },
    { id: 'products', label: 'Products' },
    { id: 'impact', label: 'Impact' },
    { id: 'nonprofits', label: 'Nonprofits' }
  ];

  useEffect(() => {
    // Redirect if not authenticated and not loading
    if (!authLoading && !isAuthenticated) {
      navigate('/login', { state: { from: '/write' } });
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContentChange = (content) => {
    setFormData(prev => ({
      ...prev,
      article_content: { content }
    }));
  };

  const toggleTag = (tagId) => {
    setFormData(prev => {
      const currentTags = [...prev.tags];
      
      if (currentTags.includes(tagId)) {
        return {
          ...prev,
          tags: currentTags.filter(id => id !== tagId)
        };
      } else {
        return {
          ...prev,
          tags: [...currentTags, tagId]
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title) {
      setError('Title is required');
      return;
    }
    
    if (!formData.article_content.content) {
      setError('Article content is required');
      return;
    }
    
    if (formData.tags.length === 0) {
      setError('Please select at least one category');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Get the user ID
      const userId = currentUser._id || currentUser.id;
      
      if (!userId) {
        setError('Could not determine user ID. Please try logging in again.');
        setLoading(false);
        return;
      }
      
      console.log(`Creating article with author ID: ${userId}`);
      
      // Explicitly add the current user as author
      const articleData = {
        ...formData,
        authors: [userId]
      };
      
      console.log('Sending article data:', articleData);
      
      const response = await apiService.articles.create(articleData);
      console.log('Article creation response:', response.data);
      
      navigate('/my-articles');
    } catch (error) {
      console.error('Error creating article:', error);
      setError(error.response?.data?.error || 'Failed to create article');
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/my-articles');
  };

  if (authLoading) {
    return <Layout><Spinner size="lg" /></Layout>;
  }

  return (
    <Layout>
      <PageHeader>
        <PageTitle>Create New Article</PageTitle>
      </PageHeader>
      
      <FormContainer>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Input
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter article title"
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Input
              label="Cover Image URL"
              name="cover_picture_url"
              value={formData.cover_picture_url}
              onChange={handleChange}
              placeholder="Enter URL for cover image (optional)"
            />
          </FormGroup>
          
          <FormGroup>
            <label>Content</label>
            <RichTextEditor
              value={formData.article_content.content}
              onChange={handleContentChange}
              placeholder="Write your article content here..."
            />
          </FormGroup>
          
          <FormGroup>
            <label>Categories</label>
            <TagsContainer>
              {categories.map(category => (
                <TagButton
                  key={category.id}
                  type="button"
                  selected={formData.tags.includes(category.id)}
                  onClick={() => toggleTag(category.id)}
                >
                  {category.label}
                </TagButton>
              ))}
            </TagsContainer>
          </FormGroup>
          
          <ButtonGroup>
            <Button
              type="submit"
              disabled={loading}
              isLoading={loading}
            >
              Publish Article
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

export default CreateArticlePage; 