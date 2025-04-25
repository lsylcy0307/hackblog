import React, { useState, useEffect } from 'react';
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
  font-size: 1.1rem;
  line-height: 1.7;
  color: ${theme.colors.text};
  
  h1 {
    font-size: 2em;
    font-weight: bold;
    margin-top: 1em;
    margin-bottom: 0.5em;
  }
  
  h2 {
    font-size: 1.5em;
    font-weight: bold;
    margin-top: 1em;
    margin-bottom: 0.5em;
  }
  
  h3 {
    font-size: 1.3em;
    font-weight: bold;
    margin-top: 1em;
    margin-bottom: 0.5em;
  }
  
  p {
    margin: 0.75em 0;
  }
  
  ul, ol {
    padding-left: 1.5em;
    margin-bottom: 1em;
  }
  
  blockquote {
    border-left: 3px solid ${theme.colors.primary};
    padding-left: 1em;
    margin-left: 0;
    color: ${theme.colors.lightText};
    font-style: italic;
    margin: 1em 0;
  }
  
  code {
    background-color: ${theme.colors.lightBackground};
    padding: 0.2em 0.4em;
    border-radius: ${theme.borderRadius.sm};
    font-family: monospace;
  }
  
  pre {
    background-color: ${theme.colors.lightBackground};
    padding: 0.75em;
    border-radius: ${theme.borderRadius.md};
    overflow-x: auto;
    margin: 1em 0;
    
    code {
      background: none;
      padding: 0;
    }
  }
  
  img {
    max-width: 100%;
    height: auto;
    margin: 1em 0;
    border-radius: ${theme.borderRadius.md};
  }
  
  a {
    color: ${theme.colors.primary};
    text-decoration: underline;
  }
  
  mark {
    background-color: rgba(255, 230, 0, 0.3);
    border-radius: 0.1em;
  }
  
  .text-align-center {
    text-align: center;
  }
  
  .text-align-right {
    text-align: right;
  }
  
  .text-align-left {
    text-align: left;
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

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      try {
        const response = await apiService.articles.getById(id);
        setArticle(response.data.data);
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

  // Format article content to display properly
  let content = article.article_content;
  if (typeof content === 'object' && content.content) {
    content = content.content;
  }

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

        <ArticleContent dangerouslySetInnerHTML={{ __html: content }} />
        
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