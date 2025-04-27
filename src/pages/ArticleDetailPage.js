import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import Layout from '../components/layout/Layout';
import Spinner from '../components/common/Spinner';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import apiService from '../utils/api';
import theme from '../utils/theme';
import { formatDate } from '../utils/helpers';

const ArticleContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding-bottom: ${theme.spacing.xxl};
`;

const ArticleHeader = styled.div`
  margin-bottom: ${theme.spacing.xl};
`;

const ArticleTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: ${theme.spacing.md};
  line-height: 1.2;
`;

const ArticleMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};
  color: ${theme.colors.lightText};
  font-size: 0.9rem;
`;

const ArticleDate = styled.span`
  display: flex;
  align-items: center;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing.xs};
`;

const Tag = styled(Link)`
  font-size: 0.75rem;
  padding: 4px 8px;
  border-radius: ${theme.borderRadius.sm};
  background-color: ${theme.colors.lightBackground};
  color: ${theme.colors.primary};
  font-weight: 500;
  text-decoration: none;
  
  &:hover {
    background-color: ${theme.colors.primary}10;
  }
`;

const CoverImage = styled.img`
  width: 100%;
  max-height: 500px;
  object-fit: cover;
  border-radius: ${theme.borderRadius.lg};
  margin-bottom: ${theme.spacing.xl};
`;

const AuthorsContainer = styled.div`
  margin-bottom: ${theme.spacing.xl};
  padding: ${theme.spacing.lg};
  background-color: ${theme.colors.lightBackground};
  border-radius: ${theme.borderRadius.lg};
`;

const AuthorTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: ${theme.spacing.md};
`;

const AuthorsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing.lg};
`;

const AuthorCard = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
`;

const AuthorImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
`;

const AuthorInfo = styled.div``;

const AuthorName = styled(Link)`
  font-weight: 600;
  color: ${theme.colors.text};
  text-decoration: none;
  
  &:hover {
    color: ${theme.colors.primary};
    text-decoration: underline;
  }
`;

const AuthorUsername = styled.div`
  font-size: 0.85rem;
  color: ${theme.colors.lightText};
`;

const ArticleContent = styled.div`
  font-size: 18px;
  line-height: 1.8;
  
  h1, h2, h3, h4, h5, h6 {
    margin-top: 1.5em;
    margin-bottom: 0.5em;
    font-weight: 700;
  }
  
  p {
    margin-bottom: 1.5em;
  }
  
  a {
    color: #0070f3;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
  
  ul, ol {
    margin-left: 2em;
    margin-bottom: 1.5em;
  }
  
  blockquote {
    border-left: 4px solid #ddd;
    padding-left: 1em;
    margin-left: 0;
    color: #666;
  }
  
  pre {
    background-color: #f5f5f5;
    padding: 1em;
    border-radius: 4px;
    overflow-x: auto;
  }
  
  code {
    background-color: #f5f5f5;
    padding: 0.2em 0.4em;
    border-radius: 3px;
    font-family: monospace;
  }
  
  /* Image sizing classes that match the editor */
  img.img-small {
    max-width: 25% !important;
    width: 25% !important;
    display: block !important;
    margin: 1em 0 !important;
    box-sizing: border-box !important;
  }
  
  img.img-medium {
    max-width: 50% !important;
    width: 50% !important;
    display: block !important;
    margin: 1em 0 !important;
    box-sizing: border-box !important;
  }
  
  img.img-large {
    max-width: 100% !important;
    width: 100% !important;
    display: block !important;
    margin: 1em 0 !important;
    box-sizing: border-box !important;
  }
  
  /* Target images with class names containing our size keywords */
  img[class*="img-small"] {
    max-width: 25% !important;
    width: 25% !important;
    display: block !important;
    margin: 1em 0 !important;
    box-sizing: border-box !important;
  }
  
  img[class*="img-medium"] {
    max-width: 50% !important;
    width: 50% !important;
    display: block !important;
    margin: 1em 0 !important;
    box-sizing: border-box !important;
  }
  
  img[class*="img-large"] {
    max-width: 100% !important;
    width: 100% !important;
    display: block !important;
    margin: 1em 0 !important;
    box-sizing: border-box !important;
  }
  
  /* Default image style if no class is present */
  img:not(.img-small):not(.img-medium):not(.img-large):not([class*="img-"]) {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 1em 0;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  margin-top: ${theme.spacing.xl};
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: ${theme.spacing.xl};
  background-color: ${theme.colors.lightBackground};
  border-radius: ${theme.borderRadius.lg};
  margin: ${theme.spacing.xl} 0;
`;

const BackButton = styled(Button)`
  margin-bottom: ${theme.spacing.lg};
`;

const ArticleDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated, isAuthor, isAdmin } = useAuth();
  
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const articleContentRef = useRef(null);
  const [content, setContent] = useState('');

  // Add global styles to ensure image classes work across the site
  useEffect(() => {
    // Create a style element for global CSS if it doesn't exist
    if (!document.getElementById('article-image-global-styles')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'article-image-global-styles';
      styleEl.innerHTML = `
        /* Global image size styles that will apply in article view */
        img.img-small {
          max-width: 25% !important;
          width: 25% !important;
          display: block !important;
          margin: 1em 0 !important;
          box-sizing: border-box !important;
        }
        
        img.img-medium {
          max-width: 50% !important;
          width: 50% !important;
          display: block !important;
          margin: 1em 0 !important;
          box-sizing: border-box !important;
        }
        
        img.img-large {
          max-width: 100% !important;
          width: 100% !important;
          display: block !important;
          margin: 1em 0 !important;
          box-sizing: border-box !important;
        }

        /* Force image sizing for all article content */
        .article-content img.img-small,
        .article-content img[class*="img-small"] {
          max-width: 25% !important;
          width: 25% !important;
        }
        
        .article-content img.img-medium,
        .article-content img[class*="img-medium"] {
          max-width: 50% !important;
          width: 50% !important;
        }
        
        .article-content img.img-large,
        .article-content img[class*="img-large"] {
          max-width: 100% !important;
          width: 100% !important;
        }
      `;
      document.head.appendChild(styleEl);
    }
    
    return () => {
      // Leave the styles for other article views
    };
  }, []);

  // Debug image classes in the content
  useEffect(() => {
    if (content) {
      // Create a temporary div to parse the HTML content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = content;
      
      // Get all image elements
      const images = tempDiv.querySelectorAll('img');
      
      if (images.length > 0) {
        console.log(`Found ${images.length} images in article content`);
      }
    }
  }, [content]);
  
  // Apply size classes directly to images after rendering
  useEffect(() => {
    // This runs after the content is rendered to the DOM
    if (articleContentRef.current && content) {
      const contentElement = articleContentRef.current;
      const images = contentElement.querySelectorAll('img');
      
      // Process each image to ensure sizes are applied
      images.forEach(img => {
        const classList = img.className.split(/\s+/);
        
        // Check for size classes in the classList or attributes
        const hasSmallClass = classList.some(cls => cls.includes('img-small')) || 
          (img.attributes[1]['name'].includes('img-small'));
            
        const hasMediumClass = classList.some(cls => cls.includes('img-medium')) || 
          (img.attributes[1]['name'].includes('img-medium'));
            
        const hasLargeClass = classList.some(cls => cls.includes('img-large')) || 
          (img.attributes[1]['name'].includes('img-large'));
        
        // If no size class is found, default to medium
        if (!hasSmallClass && !hasMediumClass && !hasLargeClass) {
          img.classList.add('img-medium');
        }
        
        // Ensure img element takes up the right width
        if (hasSmallClass) {
          img.style.maxWidth = '25%';
          img.style.width = '25%';
        } else if (hasMediumClass) {
          img.style.maxWidth = '50%';
          img.style.width = '50%';
        } else if (hasLargeClass) {
          img.style.maxWidth = '100%';
          img.style.width = '100%';
        }
        
        // Additional styles common to all images
        img.style.display = 'block';
        img.style.margin = '1em 0';
        img.style.boxSizing = 'border-box';
      });
    }
  }, [content]);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      try {
        const response = await apiService.articles.getById(id);
        setArticle(response.data.data);
        
        // Process content
        let articleContent = response.data.data.article_content;
        if (typeof articleContent === 'object' && articleContent.content) {
          articleContent = articleContent.content;
        } else if (typeof articleContent === 'string') {
          // Already a string, no need to do anything
        } else {
          articleContent = ''; // Default to empty string if content is undefined or null
        }
        
        // Sanitize and set content
        setContent(sanitizeContent(articleContent));
      } catch (err) {
        console.error('Error fetching article:', err);
        setError('Failed to load article. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArticle();
    }
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleEdit = () => {
    navigate(`/articles/${id}/edit`);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
      try {
        await apiService.articles.delete(id);
        navigate('/articles');
      } catch (err) {
        console.error('Error deleting article:', err);
        alert('Failed to delete article. Please try again.');
      }
    }
  };

  // Ensure content is properly sanitized but still preserves HTML tags
  const sanitizeContent = (htmlContent) => {
    // Simple sanitization to replace problematic patterns
    // This prevents HTML tags from being rendered as text
    if (!htmlContent) return '';
    
    // First, properly decode HTML entities that might have been double-encoded
    let cleaned = htmlContent
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"');
    
    // Fix potential issues with self-closing tags and image data
    cleaned = cleaned
      // Make sure data URLs are not broken
      .replace(/src="(data:[^"]*?)"/g, function(match, dataUrl) {
        // Ensure data URL doesn't have escaped quotes or entities
        return 'src="' + dataUrl.replace(/&quot;/g, '"') + '"';
      })
      // Ensure proper tag closing for images
      .replace(/<img([^>]*)>/g, '<img$1 />')
      // Specifically preserve image classes - fix if they got mangled
      .replace(/<img([^>]*?)class="([^"]*?)"([^>]*?)>/g, '<img$1class="$2"$3 />')
      .replace(/<img([^>]*?)class=([^\s>]*?)([^>]*?)>/g, '<img$1class="$2"$3 />');
      
    // Extra check specifically for size classes, ensuring they're properly applied
    ['small', 'medium', 'large'].forEach(size => {
      const regex = new RegExp(`<img([^>]*?)class="([^"]*?)img-${size}([^"]*?)"([^>]*?)>`, 'g');
      const replacement = `<img$1class="$2img-${size}$3"$4 />`;
      cleaned = cleaned.replace(regex, replacement);
      
      // Another variation
      const regex2 = new RegExp(`<img([^>]*?)class="([^"]*?)img-${size}([^"]*?)"([^>]*?) />`, 'g');
      cleaned = cleaned.replace(regex2, replacement);
    });
    
    // Clean up any duplicate closing tags
    cleaned = cleaned.replace(/<img([^>]*?) \/\s*\/>/g, '<img$1 />');
    
    // Handle img-small, img-medium, img-large directly
    cleaned = cleaned.replace(
      /<img([^>]*?)(class="[^"]*?)(img-(?:small|medium|large))([^"]*?)"([^>]*?)>/g,
      '<img$1$2$3$4"$5 />'
    );
    
    return cleaned;
  };

  if (loading) {
    return <Layout><Spinner size="lg" /></Layout>;
  }

  if (error || !article) {
    return (
      <Layout>
        <ErrorContainer>
          <h2>Error</h2>
          <p>{error || 'Article not found'}</p>
          <Button onClick={handleBack} style={{ marginTop: theme.spacing.md }}>
            Go Back
          </Button>
        </ErrorContainer>
      </Layout>
    );
  }

  // Check if user is an author of this article or an admin
  const isArticleAuthor = article.authors.some(author => 
    currentUser && (author._id === currentUser._id || author._id === currentUser.id)
  );
  const canEdit = isAuthenticated && (isArticleAuthor || isAdmin);

  return (
    <Layout>
      <ArticleContainer>
        <BackButton variant="outline" onClick={handleBack}>
          ← Back to Articles
        </BackButton>

        <ArticleHeader>
          <ArticleTitle>{article.title}</ArticleTitle>
          
          <ArticleMeta>
            <ArticleDate>
              Published: {formatDate(article.published_date)}
            </ArticleDate>
            {article.last_edited && article.last_edited !== article.published_date && (
              <ArticleDate>
                Last updated: {formatDate(article.last_edited)}
              </ArticleDate>
            )}
            
            {article.tags && article.tags.length > 0 && (
              <TagsContainer>
                {article.tags.map((tag, index) => (
                  <Tag key={index} to={`/articles?tag=${tag}`}>
                    {tag}
                  </Tag>
                ))}
              </TagsContainer>
            )}
          </ArticleMeta>
        </ArticleHeader>

        {article.cover_picture_url && (
          <CoverImage 
            src={article.cover_picture_url} 
            alt={article.title} 
          />
        )}
        
        {article.authors && article.authors.length > 0 && (
          <AuthorsContainer>
            <AuthorTitle>
              {article.authors.length > 1 ? 'Authors' : 'Author'}
            </AuthorTitle>
            <AuthorsList>
              {article.authors.map((author, index) => (
                <AuthorCard key={index}>
                  {author.profile_picture_url && (
                    <AuthorImage 
                      src={author.profile_picture_url} 
                      alt={author.name} 
                    />
                  )}
                  <AuthorInfo>
                    <AuthorName to={`/authors/${author._id}`}>{author.name}</AuthorName>
                    <AuthorUsername>@{author.username}</AuthorUsername>
                  </AuthorInfo>
                </AuthorCard>
              ))}
            </AuthorsList>
          </AuthorsContainer>
        )}

        <ArticleContent 
          dangerouslySetInnerHTML={{ __html: content }} 
          className="article-content"
          ref={articleContentRef}
        />
        
        {canEdit && (
          <ActionButtons>
            <Button onClick={handleEdit}>
              Edit Article
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete Article
            </Button>
          </ActionButtons>
        )}
      </ArticleContainer>
    </Layout>
  );
};

export default ArticleDetailPage; 