import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import theme from '../../utils/theme';
import { formatDate } from '../../utils/helpers';

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: white;
  border-radius: ${theme.borderRadius.md};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  }
`;

const ImageContainer = styled.div`
  height: 200px;
  overflow: hidden;
  position: relative;
`;

const ArticleImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  
  ${CardContainer}:hover & {
    transform: scale(1.05);
  }
`;

const ImagePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${theme.colors.lightBackground};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.lightText};
  font-size: 0.9rem;
`;

const CardContent = styled.div`
  padding: ${theme.spacing.lg};
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: ${theme.spacing.sm};
  line-height: 1.4;
  color: ${theme.colors.text};
`;

const CardExcerpt = styled.p`
  font-size: 0.95rem;
  color: ${theme.colors.lightText};
  line-height: 1.6;
  margin-bottom: ${theme.spacing.md};
  flex-grow: 1;
  
  /* Line clamp for 3 lines */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CardMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  color: ${theme.colors.lightText};
  margin-top: auto;
`;

const CardDate = styled.span``;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing.xs};
  margin-bottom: ${theme.spacing.md};
`;

const Tag = styled.span`
  font-size: 0.75rem;
  padding: 4px 8px;
  border-radius: ${theme.borderRadius.sm};
  background-color: ${theme.colors.lightBackground};
  color: ${theme.colors.primary};
  font-weight: 500;
`;

const ArticleCard = ({ article }) => {
  const navigate = useNavigate();
  const {
    _id,
    title,
    article_content,
    cover_picture_url,
    published_date,
    tags = []
  } = article;
  
  // Create excerpt from content
  const createExcerpt = (text, maxLength = 120) => {
    if (!text) return '';
    
    // Strip HTML tags if any
    const strippedText = text.replace(/<[^>]*>?/gm, '');
    
    if (strippedText.length <= maxLength) return strippedText;
    
    return strippedText.substr(0, maxLength) + '...';
  };
  
  // Get content text from article_content
  const getContentText = () => {
    if (!article_content) return '';
    if (typeof article_content === 'string') return article_content;
    if (typeof article_content === 'object' && article_content.content) 
      return article_content.content;
    return '';
  };
  
  const excerpt = createExcerpt(getContentText());
  const formattedDate = formatDate(published_date);
  
  // Display at most 2 tags
  const displayTags = tags.slice(0, 2);

  const handleTagClick = (tag, e) => {
    e.stopPropagation();
    navigate(`/articles?tag=${tag}`);
  };
  
  const handleCardClick = () => {
    navigate(`/articles/${_id}`);
  };
  
  // Properly format the image URL
  const getImageUrl = () => {
    if (!cover_picture_url) return null;
    
    // If it's a full URL (starts with http), use it directly
    if (cover_picture_url.startsWith('http')) {
      return cover_picture_url;
    }
    
    // If it's a default image, use null to display placeholder
    if (cover_picture_url === 'default-cover.jpg') {
      return null;
    }
    
    // Otherwise, prefix with API URL
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
    return `${API_URL}${cover_picture_url}`;
  };
  
  const imageUrl = getImageUrl();
  
  return (
    <CardContainer onClick={handleCardClick}>
      <ImageContainer>
        {imageUrl ? (
          <ArticleImage src={imageUrl} alt={title} />
        ) : (
          <ImagePlaceholder>No image available</ImagePlaceholder>
        )}
      </ImageContainer>
      
      <CardContent>
        {displayTags.length > 0 && (
          <TagsContainer>
            {displayTags.map((tag, index) => (
              <Tag key={index} onClick={(e) => handleTagClick(tag, e)}>{tag}</Tag>
            ))}
          </TagsContainer>
        )}
        
        <CardTitle>{title}</CardTitle>
        <CardExcerpt>{excerpt}</CardExcerpt>
        
        <CardMeta>
          <CardDate>{formattedDate}</CardDate>
        </CardMeta>
      </CardContent>
    </CardContainer>
  );
};

ArticleCard.propTypes = {
  article: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    article_content: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ]),
    cover_picture_url: PropTypes.string,
    published_date: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string)
  }).isRequired
};

export default ArticleCard; 