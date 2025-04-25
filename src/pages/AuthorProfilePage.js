import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import Layout from '../components/layout/Layout';
import ArticleCard from '../components/articles/ArticleCard';
import Spinner from '../components/common/Spinner';
import Button from '../components/common/Button';
import apiService from '../utils/api';
import theme from '../utils/theme';

const ProfileContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: ${theme.spacing.xxl};
`;

const BackButton = styled(Button)`
  margin-bottom: ${theme.spacing.lg};
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${theme.spacing.xl};
  margin-bottom: ${theme.spacing.xl};
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ProfileImageContainer = styled.div`
  flex-shrink: 0;
`;

const ProfileImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: ${theme.boxShadow.md};
`;

const ProfileImagePlaceholder = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-color: ${theme.colors.lightBackground};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: ${theme.colors.lightText};
  box-shadow: ${theme.boxShadow.md};
`;

const ProfileInfo = styled.div`
  flex-grow: 1;
`;

const ProfileName = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: ${theme.spacing.sm};
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

const ProfileUsername = styled.div`
  font-size: 1.25rem;
  color: ${theme.colors.lightText};
  margin-bottom: ${theme.spacing.md};
  margin-top: ${theme.spacing.md};
`;

const ProfileBio = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: ${theme.spacing.lg};
  color: ${theme.colors.text};
`;

const SocialLinks = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
`;

const SocialLink = styled.a`
  color: ${theme.colors.primary};
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: ${theme.spacing.lg};
  margin-top: ${theme.spacing.xl};
  position: relative;
  display: inline-block;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 40%;
    height: 3px;
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

const NoArticles = styled.div`
  text-align: center;
  padding: ${theme.spacing.xl};
  background-color: ${theme.colors.lightBackground};
  border-radius: ${theme.borderRadius.lg};
  margin: ${theme.spacing.lg} 0;
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: ${theme.spacing.xl};
  background-color: ${theme.colors.lightBackground};
  border-radius: ${theme.borderRadius.lg};
  margin: ${theme.spacing.xl} 0;
`;

const AuthorProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [author, setAuthor] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAuthorAndArticles = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch author profile
        const authorResponse = await apiService.users.getById(id);
        setAuthor(authorResponse.data.data);
        
        // Fetch author's articles
        const articlesResponse = await apiService.articles.getByAuthor(id);
        setArticles(articlesResponse.data.data || []);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching author profile:', err);
        setError('Failed to load author profile. Please try again.');
        setLoading(false);
      }
    };

    if (id) {
      fetchAuthorAndArticles();
    }
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return <Layout><Spinner size="lg" /></Layout>;
  }

  if (error || !author) {
    return (
      <Layout>
        <ErrorContainer>
          <h2>Error</h2>
          <p>{error || 'Author not found'}</p>
          <Button onClick={handleBack} style={{ marginTop: theme.spacing.md }}>
            Go Back
          </Button>
        </ErrorContainer>
      </Layout>
    );
  }

  // Get the first initial for placeholder
  const getInitial = () => {
    return author.name ? author.name.charAt(0).toUpperCase() : 'U';
  };

  return (
    <Layout>
      <ProfileContainer>
        <BackButton variant="outline" onClick={handleBack}>
          ← Back
        </BackButton>
        
        <ProfileHeader>
          <ProfileImageContainer>
            {author.profile_picture_url ? (
              <ProfileImage src={author.profile_picture_url} alt={author.name} />
            ) : (
              <ProfileImagePlaceholder>{getInitial()}</ProfileImagePlaceholder>
            )}
          </ProfileImageContainer>
          
          <ProfileInfo>
            <ProfileName>{author.name}</ProfileName>
            <ProfileUsername>@{author.username}</ProfileUsername>
            
            {author.personal_bio && (
              <ProfileBio>{author.personal_bio}</ProfileBio>
            )}
            
            <SocialLinks>
              {author.linkedin_url && (
                <SocialLink href={author.linkedin_url} target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </SocialLink>
              )}
              
              {author.github_url && (
                <SocialLink href={author.github_url} target="_blank" rel="noopener noreferrer">
                  GitHub
                </SocialLink>
              )}
            </SocialLinks>
          </ProfileInfo>
        </ProfileHeader>
        
        <SectionTitle>Articles</SectionTitle>
        
        {articles.length === 0 ? (
          <NoArticles>
            <p>This author hasn't published any articles yet.</p>
          </NoArticles>
        ) : (
          <ArticlesGrid>
            {articles.map(article => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </ArticlesGrid>
        )}
      </ProfileContainer>
    </Layout>
  );
};

export default AuthorProfilePage; 