import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import theme from '../../utils/theme';

const Card = styled.div`
  display: flex;
  flex-direction: row;
  background: white;
  border-radius: 17px;
  box-shadow: 0 4px 32px rgba(16, 30, 54, 0.08);
  overflow: hidden;
  min-height: 400px;
  @media (max-width: 900px) {
    flex-direction: column;
    min-height: unset;
  }
`;

const Info = styled.div`
  flex: 1 1 0;
  padding: 48px 40px 48px 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  @media (max-width: 900px) {
    padding: 32px 24px;
  }
`;

const Category = styled.div`
  color: ${theme.colors.primary};
  font-weight: 600;
  margin-bottom: 12px;
  font-size: 1rem;
`;

const Title = styled.h2`
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0 0 24px 0;
  color: ${theme.colors.text};
  line-height: 1.1;
`;

const AuthorRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 16px;
`;

const AuthorGroup = styled.div`
  display: flex;
  align-items: center;
`;

const AuthorImg = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 16px;
`;

const AuthorInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const AuthorName = styled.div`
  font-weight: 700;
  color: ${theme.colors.text};
`;

const AuthorRole = styled.div`
  color: ${theme.colors.lightText};
  font-size: 0.95rem;
`;

const Summary = styled.p`
  color: ${theme.colors.lightText};
  font-size: 1.15rem;
  margin-bottom: 24px;
`;

const ReadMore = styled(Link)`
  color: ${theme.colors.primary};
  font-weight: 600;
  text-decoration: none;
  font-size: 1.1rem;
  margin-top: auto;
  &:hover {
    color: black;
  }
`;

const ImageContainer = styled.div`
  flex: 1 1 0;
  background: #181b2a;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 320px;
  position: relative;
  overflow: hidden;
  margin: 20px;
  @media (max-width: 900px) {
    min-width: unset;
    height: 300px;
  }
`;

const ArticleImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 0;
`;

const Placeholder = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #e0e7ef 60%, #f5f7fa 100%);
`;

const FeaturedArticleCard = ({ article }) => {
  if (!article) return null;
  const {
    _id,
    title,
    summary,
    tags = [],
    authors = [],
    image,
  } = article;

  return (
    <Card>
      <Info>
        {tags[0] && <Category>{tags[0]}</Category>}
        <Title>{title}</Title>
        <AuthorRow>
          {authors.map((author, index) => (
            <AuthorGroup key={author._id || index}>
              <AuthorImg 
                src={author.image || `https://api.dicebear.com/7.x/identicon/svg?seed=${author.name || 'author'}`} 
                alt={author.name || 'Author'} 
              />
              <AuthorInfo>
                <AuthorName>{author.name || 'Unknown Author'}</AuthorName>
              </AuthorInfo>
            </AuthorGroup>
          ))}
          {authors.length === 0 && (
            <AuthorGroup>
              <AuthorImg 
                src={`https://api.dicebear.com/7.x/identicon/svg?seed=unknown`}
                alt="Unknown Author" 
              />
              <AuthorInfo>
                <AuthorName>Unknown Author</AuthorName>
                <AuthorRole></AuthorRole>
              </AuthorInfo>
            </AuthorGroup>
          )}
        </AuthorRow>
        {summary ? (
          <Summary>{summary}</Summary>
        ) : (
            <Summary>This is the summary.</Summary>
        )}
        <ReadMore to={`/articles/${_id}`}>Read more &rarr;</ReadMore>
      </Info>
      <ImageContainer>
        {article.cover_picture_url ? (
          <ArticleImg src={article.cover_picture_url} alt={title} />
        ) : (
          <Placeholder />
        )}
      </ImageContainer>
    </Card>
  );
};

export default FeaturedArticleCard; 