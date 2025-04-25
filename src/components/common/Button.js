import React from 'react';
import styled, { css } from 'styled-components';
import theme from '../../utils/theme';

const getButtonStyles = (variant = 'primary', size = 'md', fullWidth = false) => {
  // Variant styles
  let variantStyles = '';
  
  switch (variant) {
    case 'primary':
      variantStyles = css`
        background-color: ${theme.colors.primary};
        color: white;
        &:hover {
          background-color: ${darken(theme.colors.primary, 10)};
        }
        &:focus {
          box-shadow: 0 0 0 3px ${lighten(theme.colors.primary, 40)};
        }
      `;
      break;
    case 'secondary':
      variantStyles = css`
        background-color: ${theme.colors.secondary};
        color: white;
        &:hover {
          background-color: ${darken(theme.colors.secondary, 10)};
        }
        &:focus {
          box-shadow: 0 0 0 3px ${lighten(theme.colors.secondary, 40)};
        }
      `;
      break;
    case 'outline':
      variantStyles = css`
        background-color: transparent;
        color: ${theme.colors.primary};
        border: 1px solid ${theme.colors.primary};
        &:hover {
          background-color: ${lighten(theme.colors.primary, 45)};
        }
        &:focus {
          box-shadow: 0 0 0 3px ${lighten(theme.colors.primary, 40)};
        }
      `;
      break;
    case 'text':
      variantStyles = css`
        background-color: transparent;
        color: ${theme.colors.primary};
        &:hover {
          background-color: ${lighten(theme.colors.primary, 45)};
        }
        &:focus {
          box-shadow: none;
        }
      `;
      break;
    default:
      variantStyles = css`
        background-color: ${theme.colors.primary};
        color: white;
        &:hover {
          background-color: ${darken(theme.colors.primary, 10)};
        }
        &:focus {
          box-shadow: 0 0 0 3px ${lighten(theme.colors.primary, 40)};
        }
      `;
  }

  // Size styles
  let sizeStyles = '';
  switch (size) {
    case 'sm':
      sizeStyles = css`
        padding: 0.375rem 0.75rem;
        font-size: 0.875rem;
      `;
      break;
    case 'md':
      sizeStyles = css`
        padding: 0.5rem 1rem;
        font-size: 1rem;
      `;
      break;
    case 'lg':
      sizeStyles = css`
        padding: 0.75rem 1.5rem;
        font-size: 1.125rem;
      `;
      break;
    default:
      sizeStyles = css`
        padding: 0.5rem 1rem;
        font-size: 1rem;
      `;
  }

  // Width styles
  const widthStyles = fullWidth
    ? css`
        width: 100%;
      `
    : '';

  return css`
    ${variantStyles}
    ${sizeStyles}
    ${widthStyles}
  `;
};

// Helper functions to darken and lighten colors
function darken(color, percentage) {
  const hex = color.replace('#', '');
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  r = Math.max(0, Math.floor(r * (100 - percentage) / 100));
  g = Math.max(0, Math.floor(g * (100 - percentage) / 100));
  b = Math.max(0, Math.floor(b * (100 - percentage) / 100));

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function lighten(color, percentage) {
  const hex = color.replace('#', '');
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  r = Math.min(255, Math.floor(r + (255 - r) * percentage / 100));
  g = Math.min(255, Math.floor(g + (255 - g) * percentage / 100));
  b = Math.min(255, Math.floor(b + (255 - b) * percentage / 100));

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${theme.borderRadius.md};
  font-weight: 500;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  border: none;
  outline: none;
  
  /* Apply variant, size and width styles */
  ${props => getButtonStyles(props.variant, props.size, props.fullWidth)}
  
  /* Disabled state */
  ${props =>
    props.disabled &&
    css`
      opacity: 0.6;
      cursor: not-allowed;
      pointer-events: none;
    `}
    
  /* Loading state */
  ${props =>
    props.isLoading &&
    css`
      position: relative;
      color: transparent;
      pointer-events: none;
      
      &::after {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        width: 1em;
        height: 1em;
        margin: -0.5em 0 0 -0.5em;
        border: 2px solid currentColor;
        border-right-color: transparent;
        border-radius: 50%;
        animation: button-loading-spinner 0.75s linear infinite;
      }
      
      @keyframes button-loading-spinner {
        from {
          transform: rotate(0turn);
        }
        to {
          transform: rotate(1turn);
        }
      }
    `}
`;

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  isLoading = false,
  disabled = false,
  type = 'button',
  onClick,
  ...rest 
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      isLoading={isLoading}
      disabled={disabled || isLoading}
      type={type}
      onClick={onClick}
      {...rest}
    >
      {children}
    </StyledButton>
  );
};

export default Button; 