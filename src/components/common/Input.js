import React, { forwardRef } from 'react';
import styled, { css } from 'styled-components';
import theme from '../../utils/theme';

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${props => props.noMargin ? '0' : theme.spacing.md};
  width: ${props => props.fullWidth ? '100%' : 'auto'};
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: ${theme.spacing.xs};
  color: ${theme.colors.text};
`;

const sharedStyles = css`
  padding: 0.625rem 0.75rem;
  border: 1px solid ${props => props.error ? theme.colors.error : theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  font-size: 1rem;
  color: ${theme.colors.text};
  background-color: ${theme.colors.background};
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  width: 100%;
  font-family: ${theme.typography.fontFamily};
  
  &:focus {
    outline: none;
    border-color: ${props => props.error ? theme.colors.error : theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => 
      props.error 
        ? `${theme.colors.error}33` 
        : `${theme.colors.primary}33`
    };
  }
  
  &::placeholder {
    color: ${theme.colors.lightText};
  }
  
  ${props =>
    props.disabled &&
    css`
      background-color: ${theme.colors.lightBackground};
      cursor: not-allowed;
      opacity: 0.7;
    `}
`;

const StyledInput = styled.input`
  ${sharedStyles}
`;

const StyledTextarea = styled.textarea`
  ${sharedStyles}
  min-height: 100px;
  resize: vertical;
`;

const HelperText = styled.div`
  font-size: 0.75rem;
  margin-top: ${theme.spacing.xs};
  color: ${props => props.error ? theme.colors.error : theme.colors.lightText};
`;

const Input = forwardRef(({
  label,
  id,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  disabled,
  required,
  fullWidth = true,
  noMargin = false,
  rows = 4,
  ...rest
}, ref) => {
  const inputId = id || name;
  const isTextarea = type === 'textarea';

  return (
    <InputWrapper fullWidth={fullWidth} noMargin={noMargin}>
      {label && (
        <Label htmlFor={inputId}>
          {label}
          {required && <span style={{ color: theme.colors.error }}> *</span>}
        </Label>
      )}
      
      {isTextarea ? (
        <StyledTextarea
          id={inputId}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          error={error}
          disabled={disabled}
          required={required}
          ref={ref}
          rows={rows}
          {...rest}
        />
      ) : (
        <StyledInput
          id={inputId}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          error={error}
          disabled={disabled}
          required={required}
          ref={ref}
          {...rest}
        />
      )}
      
      {(helperText || error) && <HelperText error={!!error}>{error || helperText}</HelperText>}
    </InputWrapper>
  );
});

export default Input; 