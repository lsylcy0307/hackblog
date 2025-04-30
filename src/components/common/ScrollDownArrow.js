import React from 'react';
import styled, { keyframes } from 'styled-components';
import theme from '../../utils/theme';

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
`;

const ArrowContainer = styled.div`
  display: flex;
  justify-content: center;
  cursor: pointer;
`;

const Arrow = styled.div`
  width: 30px;
  height: 30px;
  border: 2px solid ${theme.colors.primary};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    animation: ${bounce} 2s infinite;
    background: ${theme.colors.primary};
    svg {
      fill: white;
    }
  }

  svg {
    width: 20px;
    height: 20px;
    fill: ${theme.colors.primary};
    transition: fill 0.2s ease;
  }
`;

const ScrollDownArrow = () => {
  const scrollDown = () => {
    window.scrollBy({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <ArrowContainer onClick={scrollDown}>
      <Arrow>
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
        </svg>
      </Arrow>
    </ArrowContainer>
  );
};

export default ScrollDownArrow; 