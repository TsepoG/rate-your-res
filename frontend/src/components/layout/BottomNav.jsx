import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

const Nav = styled.nav`
  display: flex;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  justify-content: space-around;
  align-items: center;
  padding: 12px 16px 24px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 28px 28px 0 0;
  box-shadow: 0 -10px 40px rgba(25, 28, 30, 0.08);

  @media (min-width: 768px) {
    display: none;
  }
`

const Item = styled(NavLink)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 20px;
  border-radius: 16px;
  color: #9ca3af;
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-decoration: none;
  transition: all 0.3s;

  .material-symbols-outlined {
    font-size: 1.25rem;
  }

  &.active {
    background: ${({ theme }) => theme.colors.primary};
    color: #fff;
    transform: scale(1.1);
  }
`

const NAV_ITEMS = [
  { to: '/', icon: 'home', label: 'Home' },
  { to: '/browse', icon: 'explore', label: 'Browse' },
  { to: '/review', icon: 'rate_review', label: 'Reviews' },
  { to: '/signin', icon: 'person', label: 'Profile' },
]

export default function BottomNav() {
  return (
    <Nav>
      {NAV_ITEMS.map(({ to, icon, label }) => (
        <Item key={to + label} to={to} end={to === '/'}>
          <span className="material-symbols-outlined">{icon}</span>
          <span>{label}</span>
        </Item>
      ))}
    </Nav>
  )
}
