import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Layout from '../components/layout/Layout';
import ArticleCard from '../components/articles/ArticleCard';
import Spinner from '../components/common/Spinner';
import Button from '../components/common/Button';
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

const CategoryFilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.xl};
  padding: ${theme.spacing.lg};
  background-color: ${theme.colors.lightBackground};
  border-radius: ${theme.borderRadius.lg};
`;

const ArticlesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.xl};
`;

const PaginationControls = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${theme.spacing.md};
  margin-top: ${theme.spacing.xl};
`;

const PageInfo = styled.span`
  color: ${theme.colors.lightText};
`;

const NoResults = styled.div`
  text-align: center;
  padding: ${theme.spacing.xl};
  background-color: ${theme.colors.lightBackground};
  border-radius: ${theme.borderRadius.lg};
  margin: ${theme.spacing.xl} 0;
`;

// Parse query params
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const ArticlesPage = () => {
  const location = useLocation();
  const query = useQuery();
  const navigate = useNavigate();
  const tagParam = query.get('tag');
  
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTag, setActiveTag] = useState(tagParam || 'all');
  
  const categories = [
    { id: 'all', label: 'All' },
    { id: 'engineering', label: 'Engineering' },
    { id: 'products', label: 'Products' },
    { id: 'impact', label: 'Impact' },
    { id: 'nonprofits', label: 'Nonprofits' }
  ];

  // Effect to handle URL changes
  useEffect(() => {
    if (tagParam) {
      setActiveTag(tagParam);
    } else {
      setActiveTag('all');
    }
  }, [tagParam, location.search]);

  // Effect to fetch articles
  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      setError(null);
      
      const params = {
        page: currentPage,
        limit: 9,
        sort: '-published_date'
      };
      
      // Add tag filter if not showing all
      if (activeTag !== 'all') {
        params.tags = activeTag;
      }
      
      try {
        const response = await apiService.articles.getAll(params);
        setArticles(response.data.data);
        
        // Calculate total pages
        const total = response.data.pagination.total || response.data.count;
        const limit = response.data.pagination.limit || 9;
        setTotalPages(Math.ceil(total / limit));
      } catch (error) {
        console.error('Error fetching articles:', error);
        setError('Failed to load articles. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [currentPage, activeTag]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };

  const handleTagChange = (tag) => {
    setActiveTag(tag);
    setCurrentPage(1); // Reset to first page when changing filters
    
    // Update URL without full page reload
    if (tag === 'all') {
      navigate('/articles', { replace: true });
    } else {
      navigate(`/articles?tag=${tag}`, { replace: true });
    }
  };

  if (loading && currentPage === 1) {
    return <Layout><Spinner size="lg" /></Layout>;
  }

  return (
    <Layout>
      <PageHeader>
        <PageTitle>Articles</PageTitle>
        <SubTitle>
          Explore our collection of articles on engineering, products, impact, and nonprofits.
        </SubTitle>
      </PageHeader>
      
      <CategoryFilterContainer>
        {categories.map(category => (
          <Button
            key={category.id}
            variant={activeTag === category.id ? 'primary' : 'outline'}
            size="sm"
            onClick={() => handleTagChange(category.id)}
          >
            {category.label}
          </Button>
        ))}
      </CategoryFilterContainer>
      
      {error ? (
        <NoResults>
          <p>{error}</p>
          <Button onClick={() => window.location.reload()} style={{ marginTop: theme.spacing.md }}>
            Try Again
          </Button>
        </NoResults>
      ) : articles.length === 0 ? (
        <NoResults>
          <p>No articles found for the selected category.</p>
          <Button onClick={() => handleTagChange('all')} style={{ marginTop: theme.spacing.md }}>
            View All Articles
          </Button>
        </NoResults>
      ) : (
        <>
          <ArticlesGrid>
            {articles.map(article => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </ArticlesGrid>
          
          {totalPages > 1 && (
            <PaginationControls>
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
              >
                Previous
              </Button>
              
              <PageInfo>
                Page {currentPage} of {totalPages}
              </PageInfo>
              
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
              >
                Next
              </Button>
            </PaginationControls>
          )}
        </>
      )}
    </Layout>
  );
};

export default ArticlesPage; 