import { useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { useAuth } from '../../context/AuthContext'

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: ${({ theme }) => theme.navHeight};
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.06);
`

const Inner = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.maxWidth};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.space[4]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[6]};
  height: 100%;
`

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.25rem;
  font-weight: 900;
  font-style: italic;
  color: ${({ theme }) => theme.colors.primary};
  letter-spacing: -0.02em;
  flex-shrink: 0;
  text-decoration: none;

  .material-symbols-outlined {
    font-size: 1.4rem;
  }
`

const Links = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[6]};
  margin-left: auto;

  @media (max-width: 768px) {
    display: ${({ $open }) => ($open ? 'flex' : 'none')};
    position: fixed;
    top: ${({ theme }) => theme.navHeight};
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.97);
    backdrop-filter: blur(12px);
    flex-direction: column;
    align-items: flex-start;
    padding: ${({ theme }) => theme.space[4]} ${({ theme }) => theme.space[6]};
    gap: ${({ theme }) => theme.space[4]};
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }
`

const NavLinkStyled = styled(NavLink)`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  letter-spacing: 0.01em;
  transition: color 0.15s;
  text-decoration: none;
  padding-bottom: 2px;

  &:hover { color: ${({ theme }) => theme.colors.primary}; }

  &.active {
    color: ${({ theme }) => theme.colors.primary};
    border-bottom: 2px solid ${({ theme }) => theme.colors.primary};
  }

  /* In burger menu, show with icon */
  &.menu-link {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 1rem;
    padding-bottom: 0;
    border-bottom: none !important;

    &.active {
      border-bottom: none;
    }

    .material-symbols-outlined {
      font-size: 1.25rem;
      font-variation-settings: 'FILL' 0;
    }
  }
`

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]};
  flex-shrink: 0;

  @media (max-width: 768px) {
    display: none;
  }
`

const BtnSignIn = styled(Link)`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  padding: 0.5rem 1.25rem;
  border-radius: ${({ theme }) => theme.radii.full};
  border: 1.5px solid ${({ theme }) => theme.colors.primary};
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: #fff;
  }
`

const BtnSignOut = styled.button`
  background: transparent;
  border: 1.5px solid ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.primary};
  padding: 0.5rem 1.25rem;
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: #fff;
  }
`

const UserEmail = styled.span`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const MobileActions = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.space[2]};
    margin-left: auto;
  }
`

const IconBtn = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.radii.full};
  color: ${({ theme }) => theme.colors.onSurface};
  background: none;
  text-decoration: none;
  transition: background 0.15s;

  &:hover { background: ${({ theme }) => theme.colors.surfaceLow}; }

  .material-symbols-outlined {
    font-size: 1.5rem;
  }
`

const Hamburger = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.radii.full};
  padding: 0;
  cursor: pointer;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.onSurface};
  transition: background 0.15s;

  &:hover { background: ${({ theme }) => theme.colors.surfaceLow}; }

  .material-symbols-outlined {
    font-size: 1.5rem;
  }

  @media (min-width: 769px) {
    display: none;
  }
`

/* ── Mobile bottom nav ── */
const BottomNav = styled.nav`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
    height: 64px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    box-shadow: 0 -1px 0 rgba(0, 0, 0, 0.08), 0 -4px 16px rgba(0, 0, 0, 0.06);
    align-items: stretch;
  }
`

const BottomNavItem = styled(NavLink)`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  transition: color 0.15s;

  .material-symbols-outlined {
    font-size: 1.4rem;
    font-variation-settings: 'FILL' 0;
    transition: font-variation-settings 0.15s;
  }

  &.active {
    color: ${({ theme }) => theme.colors.primary};

    .material-symbols-outlined {
      font-variation-settings: 'FILL' 1;
    }
  }
`

const BottomNavBtn = styled.button`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  transition: color 0.15s;

  .material-symbols-outlined {
    font-size: 1.4rem;
    font-variation-settings: 'FILL' 0;
  }

  &.active {
    color: ${({ theme }) => theme.colors.primary};

    .material-symbols-outlined {
      font-variation-settings: 'FILL' 1;
    }
  }
`

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <>
      <Nav>
        <Inner>
          <Logo to="/">
            <span className="material-symbols-outlined">maps_home_work</span>
            RateYourRes
          </Logo>

          {/* Desktop links */}
          <Links $open={menuOpen}>
            <NavLinkStyled to="/" end onClick={() => setMenuOpen(false)}>
              Home
            </NavLinkStyled>
            <NavLinkStyled to="/browse" onClick={() => setMenuOpen(false)}>
              Browse
            </NavLinkStyled>
            <NavLinkStyled to="/browse" onClick={() => setMenuOpen(false)}>
              Universities
            </NavLinkStyled>
            <NavLinkStyled to="/review" onClick={() => setMenuOpen(false)}>
              Write a Review
            </NavLinkStyled>

            {/* Burger menu extras (mobile only) */}
            <NavLinkStyled
              to="/search"
              className="menu-link"
              onClick={() => setMenuOpen(false)}
            >
              <span className="material-symbols-outlined">search</span>
              Search
            </NavLinkStyled>
            {isAuthenticated ? (
              <NavLinkStyled
                as="button"
                className="menu-link"
                onClick={() => { handleLogout(); setMenuOpen(false) }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                <span className="material-symbols-outlined">logout</span>
                Sign Out
              </NavLinkStyled>
            ) : (
              <NavLinkStyled
                to="/signin"
                className="menu-link"
                onClick={() => setMenuOpen(false)}
              >
                <span className="material-symbols-outlined">login</span>
                Sign In
              </NavLinkStyled>
            )}
          </Links>

          {/* Desktop actions */}
          <Actions>
            {isAuthenticated ? (
              <>
                <UserEmail>{user.email}</UserEmail>
                <BtnSignOut onClick={handleLogout}>Sign Out</BtnSignOut>
              </>
            ) : (
              <BtnSignIn to="/signin">Sign In</BtnSignIn>
            )}
          </Actions>

          {/* Mobile right-side icons */}
          <MobileActions>
            <IconBtn to="/search" aria-label="Search">
              <span className="material-symbols-outlined">search</span>
            </IconBtn>
            <Hamburger onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
              <span className="material-symbols-outlined">
                {menuOpen ? 'close' : 'menu'}
              </span>
            </Hamburger>
          </MobileActions>
        </Inner>
      </Nav>

      {/* Mobile bottom nav */}
      <BottomNav>
        <BottomNavItem to="/" end>
          <span className="material-symbols-outlined">home</span>
          Home
        </BottomNavItem>
        <BottomNavItem to="/browse">
          <span className="material-symbols-outlined">explore</span>
          Browse
        </BottomNavItem>
        <BottomNavItem to="/search">
          <span className="material-symbols-outlined">search</span>
          Search
        </BottomNavItem>
        <BottomNavItem to="/review">
          <span className="material-symbols-outlined">rate_review</span>
          Review
        </BottomNavItem>
        <BottomNavBtn onClick={() => setMenuOpen(o => !o)} className={menuOpen ? 'active' : ''}>
          <span className="material-symbols-outlined">{menuOpen ? 'close' : 'menu'}</span>
          Menu
        </BottomNavBtn>
      </BottomNav>
    </>
  )
}
