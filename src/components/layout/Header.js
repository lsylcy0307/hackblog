import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import theme from '../../utils/theme';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';

const HeaderContainer = styled.header`
  background-color: ${theme.colors.background};
  padding: ${theme.spacing.md} ${theme.spacing.xl};
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 10;
`;

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: ${theme.containers.lg};
  margin: 0 auto;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${theme.colors.primary};
  text-decoration: none;
  display: flex;
  align-items: center;
  
  &:hover {
    color: ${theme.colors.primary};
  }
`;

const NavLinks = styled.nav`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  
  @media (max-width: ${theme.breakpoints.md}) {
    display: ${props => (props.isOpen ? 'flex' : 'none')};
    position: absolute;
    flex-direction: column;
    top: 100%;
    left: 0;
    right: 0;
    background-color: ${theme.colors.background};
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
    padding: ${theme.spacing.md};
    z-index: 20;
  }
`;

const NavLink = styled(Link)`
  color: ${theme.colors.text};
  text-decoration: none;
  font-weight: 500;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.md};
  transition: all 0.2s ease-in-out;
  
  &:hover, &.active {
    color: ${theme.colors.primary};
  }
  
  @media (max-width: ${theme.breakpoints.md}) {
    width: 100%;
    padding: ${theme.spacing.sm};
    text-align: center;
  }
`;

const NavButtons = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  
  @media (max-width: ${theme.breakpoints.md}) {
    flex-direction: column;
    width: 100%;
  }
`;

const ToggleButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${theme.colors.text};
  
  @media (max-width: ${theme.breakpoints.md}) {
    display: block;
  }
`;

const ProfileButton = styled.div`
  position: relative;
  display: inline-block;
`;

const ProfileMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: ${theme.colors.background};
  border-radius: ${theme.borderRadius.md};
  box-shadow: ${theme.boxShadow.md};
  padding: ${theme.spacing.sm} 0;
  min-width: 200px;
  z-index: 30;
  margin-top: ${theme.spacing.xs};
  
  display: ${props => (props.isOpen ? 'block' : 'none')};
`;

const ProfileMenuItem = styled.div`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  cursor: pointer;
  color: ${theme.colors.text};
  
  &:hover {
    background-color: ${theme.colors.lightBackground};
    color: ${theme.colors.primary};
  }
`;

const Header = () => {
  const [navOpen, setNavOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const { currentUser, isAdmin, isAuthor, logout } = useAuth();
  const navigate = useNavigate();

  const toggleNav = () => setNavOpen(!navOpen);
  const toggleProfileMenu = () => setProfileMenuOpen(!profileMenuOpen);
  const closeProfileMenu = () => setProfileMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeProfileMenu();
    navigate('/');
  };

  return (
    <HeaderContainer>
      <NavContainer>
        <Logo to="/">Hack4Impact</Logo>
        
        <ToggleButton onClick={toggleNav}>
          {navOpen ? '✕' : '☰'}
        </ToggleButton>
        
        <NavLinks isOpen={navOpen}>
          <NavLink to="/">Home</NavLink>
          
          {!currentUser && (
            <NavButtons>
              <Button variant="outline" size="sm" onClick={() => navigate('/login')}>
                Sign In
              </Button>
            </NavButtons>
          )}
          
          {currentUser && (
            <ProfileButton>
              <Button variant="outline" size="sm" onClick={toggleProfileMenu}>
                {currentUser.name}
              </Button>
              
              <ProfileMenu isOpen={profileMenuOpen}>
                {(isAuthor || isAdmin) && (
                  <>
                    <ProfileMenuItem onClick={() => { closeProfileMenu(); navigate('/profile'); }}>
                      Profile
                    </ProfileMenuItem>
                    <ProfileMenuItem onClick={() => { closeProfileMenu(); navigate('/write'); }}>
                      Write Article
                    </ProfileMenuItem>
                    <ProfileMenuItem onClick={() => { closeProfileMenu(); navigate('/my-articles'); }}>
                      My Articles
                    </ProfileMenuItem>
                  </>
                )}
                
                {isAdmin && (
                  <ProfileMenuItem onClick={() => { closeProfileMenu(); navigate('/admin'); }}>
                    Admin Dashboard
                  </ProfileMenuItem>
                )}
                
                <ProfileMenuItem onClick={handleLogout}>
                  Logout
                </ProfileMenuItem>
              </ProfileMenu>
            </ProfileButton>
          )}
        </NavLinks>
      </NavContainer>
    </HeaderContainer>
  );
};

export default Header; 