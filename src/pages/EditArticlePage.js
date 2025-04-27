import React, { useState, useEffect, useRef } from 'react';
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

const FileInputContainer = styled.div`
  position: relative;
  margin-top: ${theme.spacing.sm};
`;

const FileInputLabel = styled.label`
  display: inline-flex;
  align-items: center;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background: ${theme.colors.lightBackground};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.sm};
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: ${theme.colors.border + '50'};
  }
`;

const HiddenFileInput = styled.input`
  position: absolute;
  left: -9999px;
  opacity: 0;
  width: 1px;
  height: 1px;
`;

const ImagePreview = styled.div`
  margin-top: ${theme.spacing.md};
  
  img {
    max-width: 100%;
    max-height: 200px;
    border-radius: ${theme.borderRadius.md};
    border: 1px solid ${theme.colors.border};
  }
`;

const ImageFileName = styled.div`
  margin-top: ${theme.spacing.sm};
  font-size: 0.85rem;
  color: ${theme.colors.lightText};
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
  const [coverImage, setCoverImage] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState('');
  const fileInputRef = useRef(null);
  
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
        
        // Set the cover image preview from the URL if it exists
        if (article.cover_picture_url) {
          setCoverImagePreview(article.cover_picture_url);
        }
        
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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const handleCoverImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      
      // Validate file type
      if (!file.type.match('image.*')) {
        setError('Please select an image file');
        return;
      }
      
      // Set the new cover image and clear any existing URL
      setCoverImage(file);
      setFormData(prev => ({
        ...prev,
        cover_picture_url: '' // Clear existing URL since we're replacing it
      }));
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (event) => {
        setCoverImagePreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleRemoveCoverImage = () => {
    // Clear both the new file and any existing URL
    setCoverImage(null);
    setCoverImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    // Clear the cover_picture_url in formData
    setFormData(prev => ({
      ...prev,
      cover_picture_url: ''
    }));
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
      
      // Create form data to send both text data and file
      const formDataToSend = new FormData();
      
      // Add text fields
      formDataToSend.append('title', formData.title);
      formDataToSend.append('article_content', JSON.stringify({ 
        content: formData.article_content.content 
      }));
      
      // Add tags as a JSON string
      formDataToSend.append('tags', JSON.stringify(formData.tags));
      
      // Handle cover image:
      // 1. If there's a new cover image file, use it (will replace existing)
      // 2. If no new file but we have an existing URL, keep it 
      // 3. If both are null/empty, it means we're removing the cover image
      if (coverImage) {
        formDataToSend.append('coverImage', coverImage);
        formDataToSend.append('replace_cover', 'true'); // Signal to replace existing cover
      } else if (formData.cover_picture_url) {
        formDataToSend.append('cover_picture_url', formData.cover_picture_url);
      } else {
        // No cover image, signal to remove existing one if any
        formDataToSend.append('remove_cover', 'true');
      }
      
      // Log what we're doing with the cover image
      if (coverImage) {
        console.log('Replacing cover image with new upload');
      } else if (formData.cover_picture_url) {
        console.log('Keeping existing cover image');
      } else {
        console.log('Removing cover image');
      }
      
      const response = await apiService.articles.update(id, formDataToSend);
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
              onKeyDown={handleKeyDown}
              placeholder="Enter article title"
              required
            />
          </FormGroup>
          
          <FormGroup>
            <label>Cover Image</label>
            <FileInputContainer>
              <FileInputLabel>
                {coverImagePreview ? 'Change cover image' : 'Choose a cover image'}
                <HiddenFileInput 
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleCoverImageChange}
                />
              </FileInputLabel>
              
              {coverImagePreview && (
                <>
                  <ImagePreview>
                    <img 
                      src={coverImagePreview} 
                      alt="Cover preview" 
                    />
                  </ImagePreview>
                  <ImageFileName>
                    {coverImage?.name || 'Current cover image'}{' '}
                    <Button 
                      variant="text" 
                      size="sm" 
                      onClick={handleRemoveCoverImage}
                    >
                      Remove
                    </Button>
                  </ImageFileName>
                </>
              )}
            </FileInputContainer>
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