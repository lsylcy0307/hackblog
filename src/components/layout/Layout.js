import React from 'react';
import styled from 'styled-components';
import Header from './Header';
import Footer from './Footer';
import theme from '../../utils/theme';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  padding: ${theme.spacing.xl} ${theme.spacing.xl};
  max-width: ${theme.containers.xl};
  margin: 0 auto;
  width: 100%;
`;

const Layout = ({ children }) => {
  return (
    <PageContainer>
      <Header />
      <MainContent>{children}</MainContent>
      <Footer />
    </PageContainer>
  );
};

export default Layout; 