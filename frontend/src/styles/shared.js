import styled from 'styled-components'
import { Link } from 'react-router-dom'

export const Container = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.maxWidth};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.space[4]};
`

export const Section = styled.section`
  padding: ${({ theme }) => theme.space[20]} 0;
`

export const PageHeader = styled.div`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primaryDark}, ${({ theme }) => theme.colors.primaryDeeper});
  color: #fff;
  padding: ${({ theme }) => theme.space[12]} 0;

  h1 {
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 2.25rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    margin-bottom: ${({ theme }) => theme.space[2]};
  }

  p {
    opacity: 0.85;
    font-size: 1rem;
    margin-bottom: ${({ theme }) => theme.space[4]};
  }
`

export const Breadcrumb = styled.nav`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  font-size: 0.8rem;
  opacity: 0.75;
  margin-bottom: ${({ theme }) => theme.space[4]};

  a:hover { opacity: 1; text-decoration: underline; }
  span { opacity: 0.6; }
`

export const BtnBase = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space[2]};
  padding: 0.625rem 1.25rem;
  border-radius: ${({ theme }) => theme.radii.full};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 0.875rem;
  font-weight: 600;
  transition: opacity 0.15s, transform 0.15s;
  white-space: nowrap;
  cursor: pointer;
  border: none;

  &:hover { opacity: 0.9; transform: translateY(-1px); }
  &:active { transform: translateY(0); }
`

export const BtnPrimary = styled(BtnBase)`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.onPrimary};
`

export const BtnAccent = styled(BtnBase)`
  background: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.onPrimary};
  ${({ $lg }) => $lg && `padding: 0.875rem 2rem; font-size: 1rem;`}
`

export const BtnOutline = styled(BtnBase)`
  background: transparent;
  border: 1.5px solid currentColor;
`

export const Card = styled.div`
  background: ${({ theme }) => theme.colors.surfaceCard};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.card};
  overflow: hidden;
`

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.625rem;
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: 0.75rem;
  font-weight: 600;
`

export const BadgePrimary = styled(Badge)`
  background: rgba(79, 70, 229, 0.1);
  color: ${({ theme }) => theme.colors.primary};
`

export const BadgeGreen = styled(Badge)`
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
`

export const BadgeGrey = styled(Badge)`
  background: ${({ theme }) => theme.colors.surfaceLow};
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
`

export const HeaderStatChip = styled.span`
  display: inline-block;
  font-size: 0.85rem;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: rgba(255, 255, 255, 0.9);
  padding: 0.25rem 0.75rem;
  border-radius: ${({ theme }) => theme.radii.full};
  margin-top: ${({ theme }) => theme.space[2]};
`

export const LoadingState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.space[20]};
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
`

export const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.space[16]};
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
`

export const BtnLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space[2]};
  padding: 0.625rem 1.25rem;
  border-radius: ${({ theme }) => theme.radii.full};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 0.875rem;
  font-weight: 600;
  transition: opacity 0.15s, transform 0.15s;
  white-space: nowrap;
  text-decoration: none;

  &:hover { opacity: 0.9; transform: translateY(-1px); }
  &:active { transform: translateY(0); }
`

export const BtnLinkPrimary = styled(BtnLink)`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.onPrimary};
`

export const BtnLinkAccent = styled(BtnLink)`
  background: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.onPrimary};
  ${({ $lg }) => $lg && `padding: 0.875rem 2rem; font-size: 1rem;`}
`
