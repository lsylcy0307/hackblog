import React from 'react';
import styled, { keyframes } from 'styled-components';
import theme from '../../utils/theme';

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: ${props => props.size === 'lg' ? theme.spacing.xl : theme.spacing.md};
`;

const SpinnerCircle = styled.div`
  border: 4px solid ${theme.colors.lightBackground};
  border-top: 4px solid ${theme.colors.primary};
  border-radius: 50%;
  width: ${props => {
    switch(props.size) {
      case 'sm': return '20px';
      case 'lg': return '50px';
      default: return '30px';
    }
  }};
  height: ${props => {
    switch(props.size) {
      case 'sm': return '20px';
      case 'lg': return '50px';
      default: return '30px';
    }
  }};
  animation: ${spin} 1s linear infinite;
`;

const Spinner = ({ size = 'md' }) => {
  return (
    <SpinnerContainer size={size}>
      <SpinnerCircle size={size} />
    </SpinnerContainer>
  );
};

export default Spinner; 