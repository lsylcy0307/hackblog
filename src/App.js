import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AboutPage from './pages/AboutPage';
import ArticlesPage from './pages/ArticlesPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import MyArticlesPage from './pages/MyArticlesPage';
import CreateArticlePage from './pages/CreateArticlePage';
import EditArticlePage from './pages/EditArticlePage';
import AuthorProfilePage from './pages/AuthorProfilePage';
import ProfilePage from './pages/ProfilePage';
import theme from './utils/theme';

// Global styles
const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  body {
    font-family: ${theme.typography.fontFamily};
    background-color: #f9fafb;
    color: ${theme.colors.text};
    line-height: 1.5;
  }
  
  img {
    max-width: 100%;
    height: auto;
  }
`;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/articles" element={<ArticlesPage />} />
            <Route path="/articles/:id" element={<ArticleDetailPage />} />
            <Route path="/articles/:id/edit" element={<EditArticlePage />} />
            <Route path="/authors/:id" element={<AuthorProfilePage />} />
            <Route path="/my-articles" element={<MyArticlesPage />} />
            <Route path="/write" element={<CreateArticlePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            {/* Add more routes as they are developed */}
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
