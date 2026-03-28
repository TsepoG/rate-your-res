import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import { Container, EmptyState, BtnLinkPrimary } from '../../styles/shared'

const UNIVERSITIES_BY_CITY = {
  'durban': [
    { id: 'ukzn', name: 'University of KwaZulu-Natal', abbreviation: 'UKZN', campus: 'Multiple Campuses, Durban', residences: 28, reviews: 1240, avgRating: 4.1, image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80' },
    { id: 'dut', name: 'Durban University of Technology', abbreviation: 'DUT', campus: 'Steve Biko Campus, Durban', residences: 18, reviews: 850, avgRating: 4.3, image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80' },
    { id: 'mut', name: 'Mangosuthu University of Technology', abbreviation: 'MUT', campus: 'Umlazi, Durban South', residences: 10, reviews: 420, avgRating: 3.9, image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80' },
  ],
  'johannesburg': [
    { id: 'wits', name: 'University of the Witwatersrand', abbreviation: 'Wits', campus: 'Braamfontein, Johannesburg', residences: 22, reviews: 1800, avgRating: 4.2, image: 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&q=80' },
    { id: 'uj', name: 'University of Johannesburg', abbreviation: 'UJ', campus: 'Auckland Park, Johannesburg', residences: 18, reviews: 1100, avgRating: 4.0, image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80' },
  ],
  'pretoria': [
    { id: 'up', name: 'University of Pretoria', abbreviation: 'UP', campus: 'Hatfield Campus, Pretoria', residences: 30, reviews: 2100, avgRating: 4.4, image: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800&q=80' },
    { id: 'tut', name: 'Tshwane University of Technology', abbreviation: 'TUT', campus: 'Arcadia Campus, Pretoria', residences: 15, reviews: 780, avgRating: 3.8, image: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=800&q=80' },
  ],
  'cape-town': [
    { id: 'uct', name: 'University of Cape Town', abbreviation: 'UCT', campus: 'Upper Campus, Cape Town', residences: 25, reviews: 2400, avgRating: 4.5, image: 'https://images.unsplash.com/photo-1580697529088-bee7f50533ef?w=800&q=80' },
    { id: 'cput', name: 'Cape Peninsula University of Technology', abbreviation: 'CPUT', campus: 'Bellville Campus, Cape Town', residences: 12, reviews: 560, avgRating: 3.9, image: 'https://images.unsplash.com/photo-1583373834259-46cc92173cb7?w=800&q=80' },
  ],
  'stellenbosch': [
    { id: 'sun', name: 'Stellenbosch University', abbreviation: 'SU', campus: 'Main Campus, Stellenbosch', residences: 22, reviews: 1900, avgRating: 4.6, image: 'https://images.unsplash.com/photo-1531370379003-f33ac6b26524?w=800&q=80' },
  ],
  'bloemfontein': [
    { id: 'ufs', name: 'University of the Free State', abbreviation: 'UFS', campus: 'Main Campus, Bloemfontein', residences: 28, reviews: 1200, avgRating: 4.1, image: 'https://images.unsplash.com/photo-1600431521340-491eca880813?w=800&q=80' },
    { id: 'cut', name: 'Central University of Technology', abbreviation: 'CUT', campus: 'Bloemfontein Campus', residences: 13, reviews: 490, avgRating: 3.7, image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80' },
  ],
}

function toTitleCase(slug) {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

/* ── Styled Components ── */

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  background: ${({ theme }) => theme.colors.surface};
`

/* ── Hero ── */

const Hero = styled.section`
  position: relative;
  background: ${({ theme }) => theme.colors.primary};
  padding: 120px 24px 96px;
  overflow: hidden;
`

const GlowTopRight = styled.div`
  position: absolute;
  top: -96px;
  right: -96px;
  width: 384px;
  height: 384px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  filter: blur(60px);
  pointer-events: none;
`

const GlowBottomLeft = styled.div`
  position: absolute;
  bottom: -64px;
  left: -64px;
  width: 256px;
  height: 256px;
  background: rgba(123, 51, 0, 0.1);
  border-radius: 50%;
  filter: blur(60px);
  pointer-events: none;
`

const HeroInner = styled(Container)`
  position: relative;
  z-index: 1;
`

const Breadcrumb = styled.nav`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.75);
  margin-bottom: 2rem;

  a {
    color: rgba(255, 255, 255, 0.75);
    text-decoration: none;
    &:hover { color: #fff; text-decoration: underline; }
  }

  .material-symbols-outlined { font-size: 0.875rem; }
`

const HeroTitle = styled.h1`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(2.5rem, 7vw, 4.5rem);
  font-weight: 800;
  color: #fff;
  line-height: 1.1;
  letter-spacing: -0.02em;
  margin-bottom: 1.25rem;

  span { color: ${({ theme }) => theme.colors.accentLight}; }
`

const HeroBottom = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (min-width: 640px) {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
  }
`

const HeroSubtitle = styled.p`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 500;
`

const StatRow = styled.div`
  display: flex;
  gap: 1rem;
  flex-shrink: 0;
`

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: 0.75rem 1.5rem;
  text-align: center;

  strong {
    display: block;
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 1.75rem;
    font-weight: 700;
    color: #fff;
    line-height: 1.1;
  }

  span {
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.65);
  }
`

/* ── Cards grid ── */

const GridSection = styled.section`
  max-width: ${({ theme }) => theme.maxWidth};
  margin: -48px auto 80px;
  padding: 0 24px;
  position: relative;
  z-index: 2;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`

const UniCard = styled.div`
  background: ${({ theme }) => theme.colors.surfaceCard};
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(25, 28, 30, 0.06);
  transition: transform 0.25s;

  &:hover { transform: translateY(-4px); }
  &:hover img { transform: scale(1.05); }
`

const CardImageWrap = styled.div`
  position: relative;
  height: 256px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
`

const CardImageOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(15, 23, 42, 0.8) 0%, transparent 50%);
`

const AbbrBadge = styled.span`
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.25rem 0.75rem;
  border-radius: ${({ theme }) => theme.radii.full};
`

const LogoBox = styled.div`
  position: absolute;
  bottom: -40px;
  left: 2rem;
  width: 80px;
  height: 80px;
  background: #fff;
  border-radius: ${({ theme }) => theme.radii.xl};
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border: 1px solid ${({ theme }) => theme.colors.surfaceHigh};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;

  span {
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 1rem;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.primary};
    letter-spacing: -0.02em;
  }
`

const CardBody = styled.div`
  padding: 3.5rem 2rem 2rem;
  position: relative;
`

const CardTopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`

const CardTitleBlock = styled.div``

const UniName = styled.h3`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.375rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.onSurface};
  line-height: 1.25;
  margin-bottom: 0.4rem;
`

const UniLocation = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};

  .material-symbols-outlined { font-size: 1rem; }
`

const RatingBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: ${({ theme }) => theme.colors.accentLight};
  color: ${({ theme }) => theme.colors.accentDark};
  padding: 0.25rem 0.625rem;
  border-radius: ${({ theme }) => theme.radii.full};
  font-weight: 700;
  font-size: 0.875rem;
  flex-shrink: 0;

  .material-symbols-outlined {
    font-size: 0.875rem;
    font-variation-settings: 'FILL' 1;
  }
`

const StatsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  font-weight: 500;
  font-size: 0.9rem;
`

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  .material-symbols-outlined {
    font-size: 1.25rem;
    color: ${({ theme }) => theme.colors.primary};
  }
`

const ViewBtn = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radii.full};
  background: transparent;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 700;
  font-size: 0.9375rem;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: rgba(79, 70, 229, 0.06);
  }

  &:hover .arrow-icon {
    transform: translateX(4px);
  }

  .material-symbols-outlined {
    font-size: 1.1rem;
    transition: transform 0.2s;
  }
`

/* ── Missing campus card ── */

const MissingCard = styled.div`
  border: 2px dashed ${({ theme }) => theme.colors.outlineVariant};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  opacity: 0.6;
  min-height: 200px;

  .material-symbols-outlined {
    font-size: 3rem;
    color: ${({ theme }) => theme.colors.onSurfaceMuted};
    margin-bottom: 1rem;
  }

  h3 {
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 1.1rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.onSurfaceMuted};
    margin-bottom: 0.5rem;
  }

  p {
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.onSurfaceMuted};
    max-width: 240px;
    line-height: 1.5;
    margin-bottom: 1.5rem;
  }

  button {
    background: none;
    border: none;
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 700;
    font-size: 0.875rem;
    cursor: pointer;
    font-family: inherit;
    &:hover { text-decoration: underline; }
  }
`

/* ── Newsletter CTA ── */

const CtaSection = styled.section`
  max-width: ${({ theme }) => theme.maxWidth};
  margin: 0 auto 80px;
  padding: 0 24px;
`

const CtaCard = styled.div`
  background: ${({ theme }) => theme.colors.primaryFixed};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: 3rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  position: relative;
  overflow: hidden;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`

const CtaGlow = styled.div`
  position: absolute;
  bottom: -80px;
  right: -80px;
  width: 320px;
  height: 320px;
  background: rgba(79, 70, 229, 0.15);
  border-radius: 50%;
  filter: blur(60px);
  pointer-events: none;
`

const CtaText = styled.div`
  position: relative;
  z-index: 1;
  max-width: 480px;

  h2 {
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 1.75rem;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.onSurface};
    margin-bottom: 1rem;
    line-height: 1.25;
  }

  p {
    font-size: 1rem;
    color: ${({ theme }) => theme.colors.onSurfaceMuted};
    line-height: 1.6;
  }
`

const CtaForm = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;

  @media (min-width: 640px) {
    flex-direction: row;
    width: auto;
  }
`

const CtaInput = styled.input`
  background: #fff;
  border: none;
  border-radius: ${({ theme }) => theme.radii.full};
  padding: 1rem 1.5rem;
  font-size: 0.9rem;
  font-family: inherit;
  color: ${({ theme }) => theme.colors.onSurface};
  outline: none;
  width: 100%;

  @media (min-width: 640px) { width: 288px; }

  &:focus { box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}; }
`

const CtaBtn = styled.button`
  background: ${({ theme }) => theme.colors.tertiaryBadge};
  color: #fff;
  font-weight: 700;
  font-size: 0.9375rem;
  font-family: inherit;
  padding: 1rem 2rem;
  border-radius: ${({ theme }) => theme.radii.full};
  border: none;
  cursor: pointer;
  white-space: nowrap;
  transition: opacity 0.15s;

  &:hover { opacity: 0.9; }
`

/* ── Component ── */

export default function Universities() {
  const { province, city } = useParams()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')

  const universities = UNIVERSITIES_BY_CITY[city]
  const provinceName = toTitleCase(province)
  const cityName = toTitleCase(city)

  if (!universities) {
    return (
      <Page>
        <Navbar />
        <EmptyState>
          <p>No universities found for this city.</p>
          <BtnLinkPrimary to={`/browse/${province}`} style={{ marginTop: '1rem' }}>
            Back to {provinceName}
          </BtnLinkPrimary>
        </EmptyState>
        <Footer />
      </Page>
    )
  }

  const totalResidences = universities.reduce((sum, u) => sum + u.residences, 0)

  return (
    <Page>
      <Navbar />

      <Hero>
        <GlowTopRight />
        <GlowBottomLeft />
        <HeroInner>
          <Breadcrumb>
            <Link to="/">Home</Link>
            <span className="material-symbols-outlined">chevron_right</span>
            <Link to="/browse">Browse</Link>
            <span className="material-symbols-outlined">chevron_right</span>
            <Link to={`/browse/${province}`}>{provinceName}</Link>
            <span className="material-symbols-outlined">chevron_right</span>
            <strong style={{ color: '#fff' }}>{cityName}</strong>
          </Breadcrumb>

          <HeroTitle>
            {cityName},<br />
            <span>{provinceName}</span>
          </HeroTitle>

          <HeroBottom>
            <HeroSubtitle>Choose a university to browse its residences</HeroSubtitle>
            <StatRow>
              <StatCard>
                <strong>{universities.length}</strong>
                <span>Universities</span>
              </StatCard>
              <StatCard>
                <strong>{totalResidences}+</strong>
                <span>Residences</span>
              </StatCard>
            </StatRow>
          </HeroBottom>
        </HeroInner>
      </Hero>

      <GridSection>
        <Grid>
          {universities.map(uni => (
            <UniCard key={uni.id}>
              <CardImageWrap>
                <img src={uni.image} alt={uni.name} />
                <CardImageOverlay />
                <AbbrBadge>{uni.abbreviation}</AbbrBadge>
                <LogoBox>
                  <span>{uni.abbreviation}</span>
                </LogoBox>
              </CardImageWrap>

              <CardBody>
                <CardTopRow>
                  <CardTitleBlock>
                    <UniName>{uni.name}</UniName>
                    <UniLocation>
                      <span className="material-symbols-outlined">location_on</span>
                      {uni.campus}
                    </UniLocation>
                  </CardTitleBlock>
                  <RatingBadge>
                    <span className="material-symbols-outlined">star</span>
                    {uni.avgRating.toFixed(1)}
                  </RatingBadge>
                </CardTopRow>

                <StatsRow>
                  <StatItem>
                    <span className="material-symbols-outlined">domain</span>
                    {uni.residences} Residences
                  </StatItem>
                  <StatItem>
                    <span className="material-symbols-outlined">reviews</span>
                    {uni.reviews.toLocaleString()} Reviews
                  </StatItem>
                </StatsRow>

                <ViewBtn onClick={() => navigate(`/university/${uni.id}`)}>
                  View Residences
                  <span className="material-symbols-outlined arrow-icon">arrow_forward</span>
                </ViewBtn>
              </CardBody>
            </UniCard>
          ))}

          {/* Missing campus slot */}
          <MissingCard>
            <span className="material-symbols-outlined">add_business</span>
            <h3>Are we missing a campus?</h3>
            <p>Help fellow students by suggesting a university or private residence cluster.</p>
            <button type="button">Suggest a Location</button>
          </MissingCard>
        </Grid>
      </GridSection>

      <CtaSection>
        <CtaCard>
          <CtaGlow />
          <CtaText>
            <h2>Get the latest student insights in {cityName}</h2>
            <p>
              Join over 5,000 students receiving weekly updates on the best-rated
              residences and student life hacks.
            </p>
          </CtaText>
          <CtaForm>
            <CtaInput
              type="email"
              placeholder="Enter your student email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <CtaBtn type="button">Join Now</CtaBtn>
          </CtaForm>
        </CtaCard>
      </CtaSection>

      <Footer />
    </Page>
  )
}
