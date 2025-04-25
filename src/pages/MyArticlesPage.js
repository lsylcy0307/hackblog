import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Layout from '../components/layout/Layout';
import ArticleCard from '../components/articles/ArticleCard';
import Spinner from '../components/common/Spinner';
import Button from '../components/common/Button';
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

const SubTitle = styled.p`
  font-size: 1.25rem;
  color: ${theme.colors.lightText};
  max-width: 800px;
`;

const ArticlesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.xl};
`;

const ActionButton = styled(Button)`
  margin-bottom: ${theme.spacing.lg};
`;

const NoResults = styled.div`
  text-align: center;
  padding: ${theme.spacing.xl};
  background-color: ${theme.colors.lightBackground};
  border-radius: ${theme.borderRadius.lg};
  margin: ${theme.spacing.xl} 0;
`;

const MyArticlesPage = () => {
  const { currentUser, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login', { state: { from: '/my-articles' } });
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Fetch user's articles when currentUser changes
  useEffect(() => {
    const fetchUserArticles = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      // For debugging - check what we're working with
      console.log('Current user:', currentUser);
      
      try {
        // Approach 1: Try the new getMine endpoint
        try {
          console.log('Trying to fetch articles using /articles/mine endpoint');
          const response = await apiService.articles.getMine();
          console.log('getMine response:', response.data);
          
          if (response.data && response.data.data) {
            setArticles(response.data.data);
            setLoading(false);
            return;
          }
        } catch (err) {
          console.log('Error using getMine:', err);
        }
        
        // Approach 2: Try the myArticles endpoint
        try {
          console.log('Trying to fetch articles using /users/me/articles endpoint');
          const response = await apiService.users.getMyArticles();
          console.log('getMyArticles response:', response.data);
          
          if (response.data && response.data.data) {
            setArticles(response.data.data);
            setLoading(false);
            return;
          }
        } catch (err) {
          console.log('Error using getMyArticles:', err);
        }
        
        // Approach 3: Get the user ID and query by author
        const userId = currentUser._id || currentUser.id;
        if (userId) {
          try {
            console.log(`Trying to fetch articles for author ID: ${userId}`);
            const response = await apiService.articles.getByAuthor(userId);
            console.log('getByAuthor response:', response.data);
            
            if (response.data && response.data.data) {
              setArticles(response.data.data);
              setLoading(false);
              return;
            }
          } catch (err) {
            console.log('Error using getByAuthor:', err);
          }
        }
        
        // Approach 4: Fall back to the original approach with params
        try {
          console.log(`Trying to fetch articles with authors param: ${userId}`);
          const response = await apiService.articles.getAll({ 
            authors: userId,
            limit: 100
          });
          
          console.log('getAll response:', response.data);
          
          if (response.data && response.data.data) {
            setArticles(response.data.data);
            setLoading(false);
            return;
          }
        } catch (err) {
          console.log('Error using getAll with authors param:', err);
        }
        
        // Final approach: Use profile data
        try {
          console.log('Falling back to profile data to get articles');
          const response = await apiService.auth.getProfile();
          console.log('User profile response:', response.data);
          
          const userData = response.data.data;
          
          if (userData.articles && userData.articles.length > 0) {
            console.log(`User has ${userData.articles.length} articles in profile`);
            
            const articlePromises = userData.articles.map(articleId => {
              console.log(`Fetching article with ID: ${articleId}`);
              return apiService.articles.getById(articleId)
                .catch(err => {
                  console.error(`Error fetching article ${articleId}:`, err);
                  return null;
                });
            });
            
            const articleResponses = await Promise.all(articlePromises);
            const validArticles = articleResponses
              .filter(res => res && res.data && res.data.data)
              .map(res => res.data.data);
            
            setArticles(validArticles);
            return;
          }
        } catch (err) {
          console.log('Error using profile data:', err);
        }
        
        // If we got here, we didn't find any articles
        console.log('No articles found using any method');
        setArticles([]);
        
      } catch (error) {
        console.error('Error fetching articles:', error);
        setError('Failed to load your articles. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserArticles();
  }, [currentUser]);

  const handleCreateArticle = () => {
    navigate('/write');
  };

  if (authLoading || loading) {
    return <Layout><Spinner size="lg" /></Layout>;
  }

  return (
    <Layout>
      <PageHeader>
        <PageTitle>My Articles</PageTitle>
        <SubTitle>
          Manage your articles and create new content to share with the community.
        </SubTitle>
      </PageHeader>
      
      <ActionButton onClick={handleCreateArticle}>
        Create New Article
      </ActionButton>
      
      {error ? (
        <NoResults>
          <p>{error}</p>
          <Button onClick={() => window.location.reload()} style={{ marginTop: theme.spacing.md }}>
            Try Again
          </Button>
        </NoResults>
      ) : articles.length === 0 ? (
        <NoResults>
          <p>You haven't published any articles yet.</p>
          <Button onClick={handleCreateArticle} style={{ marginTop: theme.spacing.md }}>
            Write Your First Article
          </Button>
        </NoResults>
      ) : (
        <ArticlesGrid>
          {articles.map(article => (
            <ArticleCard key={article._id} article={article} />
          ))}
        </ArticlesGrid>
      )}
    </Layout>
  );
};

export default MyArticlesPage; 