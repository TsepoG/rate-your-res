import { Link } from 'react-router-dom'
import styled from 'styled-components'

const FooterWrapper = styled.footer`
  background: #191c1e;
  color: #ffdbca;
  padding: 80px 0 0;
`

const Inner = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.maxWidth};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.space[4]};
  display: flex;
  flex-direction: column;
  gap: 48px;
  padding-bottom: 48px;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }
`

const Brand = styled.div`
  max-width: 320px;
`

const LogoText = styled.span`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.5rem;
  font-weight: 900;
  color: #fff;
  display: block;
  margin-bottom: 24px;
`

const Tagline = styled.p`
  font-size: 0.875rem;
  line-height: 1.7;
  color: #6b7280;
  margin-bottom: 32px;
`

const Socials = styled.div`
  display: flex;
  gap: 16px;
`

const SocialBtn = styled.a`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid #374151;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  transition: border-color 0.15s, color 0.15s;
  text-decoration: none;

  &:hover {
    border-color: #ffdbca;
    color: #ffdbca;
  }

  .material-symbols-outlined {
    font-size: 1.1rem;
  }
`

const Cols = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 48px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`

const Col = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  a {
    font-size: 0.875rem;
    color: #6b7280;
    transition: color 0.15s;
    text-decoration: none;

    &:hover { color: #ffdbca; }
  }
`

const ColTitle = styled.h4`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 0.9rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8px;
`

const Bottom = styled.div`
  border-top: 1px solid #1f2937;
  padding: 32px 0;

  @media (max-width: 768px) {
    padding-bottom: calc(32px + 64px); /* clear mobile bottom nav */
  }

  p {
    width: 100%;
    max-width: ${({ theme }) => theme.maxWidth};
    margin: 0 auto;
    padding: 0 ${({ theme }) => theme.space[4]};
    font-size: 0.75rem;
    color: #4b5563;
    font-weight: 500;
    letter-spacing: 0.03em;
  }
`

export default function Footer() {
  return (
    <FooterWrapper>
      <Inner>
        <Brand>
          <LogoText>RateYourRes</LogoText>
          <Tagline>
            The #1 platform for South African students to rate and review their living spaces.
            Empowering students with transparency since 2024.
          </Tagline>
          <Socials>
            <SocialBtn href="#" aria-label="Website">
              <span className="material-symbols-outlined">public</span>
            </SocialBtn>
            <SocialBtn href="#" aria-label="Share">
              <span className="material-symbols-outlined">share</span>
            </SocialBtn>
            <SocialBtn href="#" aria-label="Contact">
              <span className="material-symbols-outlined">contacts</span>
            </SocialBtn>
          </Socials>
        </Brand>

        <Cols>
          <Col>
            <ColTitle>Platform</ColTitle>
            <Link to="/browse">Browse All</Link>
            <Link to="/browse">Universities</Link>
            <Link to="/review">Write a Review</Link>
          </Col>

          <Col>
            <ColTitle>Support</ColTitle>
            <Link to="/help">Help Center</Link>
            <Link to="/contact">Contact Us</Link>
            <Link to="/about">About Us</Link>
          </Col>

          <Col>
            <ColTitle>Legal</ColTitle>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </Col>
        </Cols>
      </Inner>

      <Bottom>
        <p>© {new Date().getFullYear()} RateYourRes. Built for the South African Student Pulse.</p>
      </Bottom>
    </FooterWrapper>
  )
}
