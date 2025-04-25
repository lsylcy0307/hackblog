import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Layout from '../components/layout/Layout';
import ArticleCard from '../components/articles/ArticleCard';
import Spinner from '../components/common/Spinner';
import Button from '../components/common/Button';
import apiService from '../utils/api';
import theme from '../utils/theme';

const HeroSection = styled.section`
  background-color: ${theme.colors.darkBackground};
  color: white;
  padding: ${theme.spacing.xxl} 0;
  margin: -${theme.spacing.xl} -${theme.spacing.xl} ${theme.spacing.xl};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const HeroTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: ${theme.spacing.md};
  max-width: 800px;
  
  @media (min-width: ${theme.breakpoints.md}) {
    font-size: 3.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  max-width: 600px;
  margin-bottom: ${theme.spacing.lg};
  color: ${theme.colors.lightBackground};
`;

const SectionTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: ${theme.spacing.lg};
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

const ArticlesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.xl};
`;

const CategorySection = styled.section`
  margin: ${theme.spacing.xl} 0;
`;

const CategoryButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.xl};
`;

const CategoryButton = styled(Link)`
  text-decoration: none;
`;

const HomePage = () => {
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [recentArticles, setRecentArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      setError(null);
      try {
        // Get pinned articles for featured section
        const pinnedResponse = await apiService.articles.getAll({ pinned: true, limit: 3 });
        
        // Get recent articles
        const recentResponse = await apiService.articles.getAll({ 
          sort: '-published_date',
          limit: 6,
          pinned: false
        });
        
        setFeaturedArticles(pinnedResponse.data.data);
        setRecentArticles(recentResponse.data.data);
      } catch (error) {
        console.error('Error fetching articles:', error);
        setError('Failed to load articles. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) return <Layout><Spinner size="lg" /></Layout>;
  
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
      <HeroSection>
        <HeroTitle>Insights from Hack4Impact Engineering</HeroTitle>
        <HeroSubtitle>
          Explore our latest thoughts on technology, impact, and building products for nonprofits.
        </HeroSubtitle>
        <Button size="lg" onClick={() => window.location.href = '/articles'}>
          Browse All Articles
        </Button>
      </HeroSection>
      
      {featuredArticles.length > 0 && (
        <section>
          <SectionTitle>Featured Articles</SectionTitle>
          <ArticlesGrid>
            {featuredArticles.map(article => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </ArticlesGrid>
        </section>
      )}
      
      <CategorySection>
        <SectionTitle>Browse by Category</SectionTitle>
        <CategoryButtons>
          <CategoryButton to="/articles?tag=engineering">
            <Button variant="outline">Engineering</Button>
          </CategoryButton>
          <CategoryButton to="/articles?tag=products">
            <Button variant="outline">Products</Button>
          </CategoryButton>
          <CategoryButton to="/articles?tag=impact">
            <Button variant="outline">Impact</Button>
          </CategoryButton>
          <CategoryButton to="/articles?tag=nonprofits">
            <Button variant="outline">Nonprofits</Button>
          </CategoryButton>
        </CategoryButtons>
      </CategorySection>
      
      <section>
        <SectionTitle>Recent Articles</SectionTitle>
        <ArticlesGrid>
          {recentArticles.map(article => (
            <ArticleCard key={article._id} article={article} />
          ))}
        </ArticlesGrid>
        
        <div style={{ textAlign: 'center', marginTop: theme.spacing.xl }}>
          <Link to="/articles">
            <Button variant="outline">View All Articles</Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage; 