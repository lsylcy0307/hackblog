import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import theme from '../../utils/theme';

const FooterContainer = styled.footer`
  background-color: ${theme.colors.darkBackground};
  color: ${theme.colors.lightBackground};
  padding: ${theme.spacing.xl} 0;
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: ${theme.containers.xl};
  margin: 0 auto;
  padding: 0 ${theme.spacing.xl};
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${theme.spacing.xl};
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: ${theme.spacing.md};
  color: white;
`;

const FooterLink = styled(Link)`
  color: ${theme.colors.lightBackground};
  text-decoration: none;
  margin-bottom: ${theme.spacing.sm};
  transition: color 0.2s ease-in-out;
  
  &:hover {
    color: ${theme.colors.accent};
    text-decoration: underline;
  }
`;

const FooterText = styled.p`
  margin-bottom: ${theme.spacing.sm};
  line-height: 1.5;
`;

const FooterBottom = styled.div`
  max-width: ${theme.containers.xl};
  margin: ${theme.spacing.xl} auto 0;
  padding: ${theme.spacing.lg} ${theme.spacing.xl} 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: ${theme.spacing.md};
  
  @media (max-width: ${theme.breakpoints.md}) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`;

const Copyright = styled.p`
  color: ${theme.colors.lightBackground};
`;

const SocialLinks = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
`;

const SocialLink = styled.a`
  color: ${theme.colors.lightBackground};
  font-size: 1.25rem;
  transition: color 0.2s ease-in-out;
  
  &:hover {
    color: ${theme.colors.accent};
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <SectionTitle>Hack4Impact</SectionTitle>
          <FooterText>
            Empowering nonprofits and strengthening communities through student-developed technology.
          </FooterText>
        </FooterSection>
        
        <FooterSection>
          <SectionTitle>Links</SectionTitle>
          <FooterLink to="/">Home</FooterLink>
          <FooterLink to="/articles">Articles</FooterLink>
          <FooterLink to="/about">About Us</FooterLink>
          <FooterLink to="/register">Sign Up</FooterLink>
        </FooterSection>
        
        <FooterSection>
          <SectionTitle>Categories</SectionTitle>
          <FooterLink to="/articles?tag=engineering">Engineering</FooterLink>
          <FooterLink to="/articles?tag=products">Products</FooterLink>
          <FooterLink to="/articles?tag=impact">Impact</FooterLink>
          <FooterLink to="/articles?tag=nonprofits">Nonprofits</FooterLink>
        </FooterSection>
        
        <FooterSection>
          <SectionTitle>Contact</SectionTitle>
          <FooterText>
            Have questions or want to contribute?
          </FooterText>
          <FooterLink to="/contact">Contact Us</FooterLink>
        </FooterSection>
      </FooterContent>
      
      <FooterBottom>
        <Copyright>
          &copy; {new Date().getFullYear()} Hack4Impact Engineering Blog. All rights reserved.
        </Copyright>
        
        <SocialLinks>
          <SocialLink href="https://github.com/hack4impact" target="_blank" rel="noopener noreferrer">
            GitHub
          </SocialLink>
          <SocialLink href="https://twitter.com/hack4impact" target="_blank" rel="noopener noreferrer">
            Twitter
          </SocialLink>
          <SocialLink href="https://www.linkedin.com/company/hack4impact/" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </SocialLink>
        </SocialLinks>
      </FooterBottom>
    </FooterContainer>
  );
};

export default Footer; 