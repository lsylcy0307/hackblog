import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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

const BackButton = styled(Button)`
  margin-bottom: ${theme.spacing.lg};
`;

const EditArticlePage = () => {
  const { currentUser, isAuthenticated, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [formData, setFormData] = useState({
    title: '',
    cover_picture_url: '',
    article_content: { content: '' },
    tags: []
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  const categories = [
    { id: 'engineering', label: 'Engineering' },
    { id: 'products', label: 'Products' },
    { id: 'impact', label: 'Impact' },
    { id: 'nonprofits', label: 'Nonprofits' }
  ];

  // Fetch article data on load
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await apiService.articles.getById(id);
        const article = response.data.data;
        
        // Format the data for the form
        let content = '';
        if (article.article_content) {
          if (typeof article.article_content === 'object' && article.article_content.content) {
            content = article.article_content.content;
          } else if (typeof article.article_content === 'string') {
            content = article.article_content;
          }
        }
        
        setFormData({
          title: article.title || '',
          cover_picture_url: article.cover_picture_url || '',
          article_content: { content },
          tags: article.tags || []
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching article:', err);
        setError('Failed to load article. Please try again.');
        setLoading(false);
      }
    };

    if (id) {
      fetchArticle();
    }
  }, [id]);

  // Check authorization
  useEffect(() => {
    const checkAuth = async () => {
      if (!authLoading && !isAuthenticated) {
        navigate('/login', { state: { from: `/articles/${id}/edit` } });
        return;
      }
      
      if (!loading && !authLoading && isAuthenticated) {
        // Check if user is author or admin
        try {
          const response = await apiService.articles.getById(id);
          const article = response.data.data;
          
          const isArticleAuthor = article.authors.some(author => 
            currentUser && (author._id === currentUser._id || author._id === currentUser.id)
          );
          
          if (!isArticleAuthor && !isAdmin) {
            navigate(`/articles/${id}`);
            return;
          }
        } catch (err) {
          console.error('Error checking authorization:', err);
        }
      }
    };
    
    checkAuth();
  }, [id, isAuthenticated, authLoading, loading, currentUser, isAdmin, navigate]);

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
    
    setSubmitting(true);
    setError(null);
    
    try {
      console.log('Updating article...');
      console.log('Sending article data:', formData);
      
      const response = await apiService.articles.update(id, formData);
      console.log('Article update response:', response.data);
      
      navigate(`/articles/${id}`);
    } catch (error) {
      console.error('Error updating article:', error);
      setError(error.response?.data?.error || 'Failed to update article');
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/articles/${id}`);
  };
  
  const handleBack = () => {
    navigate(`/articles/${id}`);
  };

  if (authLoading || loading) {
    return <Layout><Spinner size="lg" /></Layout>;
  }

  return (
    <Layout>
      <BackButton variant="outline" onClick={handleBack}>
        ← Back to Article
      </BackButton>
      
      <PageHeader>
        <PageTitle>Edit Article</PageTitle>
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
              disabled={submitting}
              isLoading={submitting}
            >
              Update Article
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={submitting}
            >
              Cancel
            </Button>
          </ButtonGroup>
        </form>
      </FormContainer>
    </Layout>
  );
};

export default EditArticlePage; 