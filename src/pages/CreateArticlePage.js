import React, { useState, useEffect, useRef } from 'react';
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
  const [coverImage, setCoverImage] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState('');
  const fileInputRef = useRef(null);
  
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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    console.log('Button clicked');
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
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('Creating article...');
      
      // Create form data to send both text data and file
      const formDataToSend = new FormData();
      
      // Add text fields
      formDataToSend.append('title', formData.title);
      formDataToSend.append('article_content', JSON.stringify({ 
        content: formData.article_content.content 
      }));
      
      // Add tags as a JSON string
      formDataToSend.append('tags', JSON.stringify(formData.tags));
      
      // Add cover image file if it exists
      if (coverImage) {
        formDataToSend.append('coverImage', coverImage);
        console.log('Adding new cover image');
      } else {
        console.log('No cover image provided');
      }
      
      const response = await apiService.articles.create(formDataToSend);
      console.log('Article creation response:', response.data);
      
      navigate(`/articles/${response.data.data._id}`);
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
              onKeyDown={handleKeyDown}
              placeholder="Enter article title"
              required
            />
          </FormGroup>
          
          <FormGroup>
            <label>Cover Image</label>
            <FileInputContainer>
              <FileInputLabel>
                Choose a cover image
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
                    <img src={coverImagePreview} alt="Cover preview" />
                  </ImagePreview>
                  <ImageFileName>
                    {coverImage?.name}{' '}
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