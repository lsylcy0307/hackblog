import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Layout from '../components/layout/Layout';
import ArticleCard from '../components/articles/ArticleCard';
import FeaturedArticleCard from '../components/articles/FeaturedArticleCard';
import Spinner from '../components/common/Spinner';
import Button from '../components/common/Button';
import apiService from '../utils/api';
import theme from '../utils/theme';
import ScrollDownArrow from '../components/common/ScrollDownArrow';


const FeaturedArticle = styled.div`
  width: 100%;
  margin-top: ${theme.spacing.xl};
  margin-bottom: ${theme.spacing.xl};
`;

const BlogHeading = styled.h1`
  margin-left: ${theme.spacing.md};
  font-size: 1.3rem;
  font-weight: 500;
  color: ${theme.colors.text};
  margin-bottom: 5rem;
`;

const CategoryFilterContainer = styled.div`
  margin-top: 6rem;
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.lg};
  background-color: ${theme.colors.lightBackground};
  border-radius: ${theme.borderRadius.lg};
`;

const ArticlesGrid = styled.div`
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.xl};
  margin-top: 6rem;
`;

const ViewAllButton = styled.div`
  margin-top: 6rem;
  margin-left: ${theme.spacing.md};
`;

const HomePage = () => {
  const [featuredArticle, setFeaturedArticle] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const navigate = useNavigate();

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'engineering', label: 'Engineering' },
    { id: 'products', label: 'Products' },
    { id: 'impact', label: 'Impact' },
    { id: 'nonprofits', label: 'Nonprofits' }
  ];

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      setError(null);
      try {
        // Get the most recent article for featured section
        const featuredResponse = await apiService.articles.getAll({ 
          sort: '-published_date',
          limit: 1
        });
        
        // Get articles for the grid
        const params = {
          sort: '-published_date',
          limit: 10
        };
        
        if (activeCategory !== 'all') {
          params.tags = activeCategory;
        }
        
        const articlesResponse = await apiService.articles.getAll(params);
        
        setFeaturedArticle(featuredResponse.data.data[0]);
        setArticles(articlesResponse.data.data);
      } catch (error) {
        console.error('Error fetching articles:', error);
        setError('Failed to load articles. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [activeCategory]);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  const handleViewAll = () => {
    const url = activeCategory === 'all' ? '/articles' : `/articles?tag=${activeCategory}`;
    navigate(url);
  };
  
  if (error) {
    return (
      <Layout>
        <div>
          <p>{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <BlogHeading>Blog</BlogHeading>
      
      {featuredArticle && (
        <FeaturedArticle>
          <FeaturedArticleCard article={featuredArticle} />
        </FeaturedArticle>
      )}
    
      
      <CategoryFilterContainer>
        {categories.map(category => (
          <Button
            key={category.id}
            variant={activeCategory === category.id ? 'primary' : 'outline'}
            size="sm"
            onClick={() => handleCategoryChange(category.id)}
          >
            {category.label}
          </Button>
        ))}
      </CategoryFilterContainer>
      
      <ScrollDownArrow />
      <ArticlesGrid>
        {articles.map(article => (
          <ArticleCard key={article._id} article={article} />
        ))}
      </ArticlesGrid>
      
      <ViewAllButton>
        <Button variant="primary" onClick={handleViewAll}>
          View All Posts
        </Button>
      </ViewAllButton>
    </Layout>
  );
};

export default HomePage; 