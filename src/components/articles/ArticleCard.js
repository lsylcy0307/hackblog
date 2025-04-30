import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import theme from '../../utils/theme';

const Card = styled(Link)`
  display: flex;
  text-decoration: none;
  transition: all 0.2s ease;
  overflow: hidden;
  min-height: 320px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    min-height: unset;
  }
`;

const ContentSection = styled.div`
  flex: 1;
  padding: ${theme.spacing.xl};
  display: flex;
  flex-direction: column;
`;

const ImageSection = styled.div`
  width: 45%;
  display: flex;
  flex-direction: column;
  
  @media (max-width: 768px) {
    width: 100%;
    order: -1;
  }
`;

const AuthorsSection = styled.div`
  padding: ${theme.spacing.lg};
`;

const ImageContainer = styled.div`
  flex: 1;
  position: relative;
  min-height: 400px;
  margin-top: 3rem;
  overflow: hidden;
  border-radius: 8px;
`;

const Category = styled.div`
  color: ${theme.colors.primary};
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: ${theme.spacing.md};
`;

const Title = styled.h3`
  font-size: 2rem;
  font-weight: 700;
  color: ${theme.colors.text};
  margin: 0 0 ${theme.spacing.md} 0;
  line-height: 1.2;
`;

const Summary = styled.p`
  color: ${theme.colors.lightText};
  font-size: 1.1rem;
  line-height: 1.5;
  margin-bottom: ${theme.spacing.md};
`;

const ReadMore = styled.span`
  color: ${theme.colors.primary};
  font-weight: 500;
  font-size: 1rem;
  display: inline-block;

  &:hover {
    color: black;
  }
`;

const CoverImage = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const AuthorGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.sm};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const AuthorImage = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
`;

const AuthorInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const AuthorName = styled.div`
  font-weight: 600;
  color: ${theme.colors.text};
  font-size: 1rem;
`;

const AuthorRole = styled.div`
  color: ${theme.colors.lightText};
  font-size: 0.9rem;
`;

const ArticleCard = ({ article }) => {
  if (!article) return null;

  const {
    _id,
    title,
    summary,
    authors = [],
    tags = [],
    cover_picture_url,
  } = article;

  return (
    <Card to={`/articles/${_id}`}>
      <ContentSection>
        {tags[0] && <Category>{tags[0]}</Category>}
        <Title>{title}</Title>
        <Summary>{summary || 'This is the summary.'}</Summary>
        <ReadMore>Read more </ReadMore>
      </ContentSection>

      <ImageSection>
        <AuthorsSection>
          {authors.map((author, index) => (
            <AuthorGroup key={author._id || index}>
              <AuthorImage 
                src={author.image || `https://api.dicebear.com/7.x/identicon/svg?seed=${author.name || 'author'}`}
                alt={author.name || 'Author'}
              />
              <AuthorInfo>
                <AuthorName>{author.name}</AuthorName>
                <AuthorRole>{author.role}</AuthorRole>
              </AuthorInfo>
            </AuthorGroup>
          ))}
        </AuthorsSection>
        <ImageContainer>
          <CoverImage 
            src={cover_picture_url || 'https://via.placeholder.com/800x600/181b2a/ffffff?text=No+Image'} 
            alt={title}
          />
        </ImageContainer>
      </ImageSection>
    </Card>
  );
};

export default ArticleCard; 