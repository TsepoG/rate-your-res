import { Link, useParams } from 'react-router-dom'
import styled from 'styled-components'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import { EmptyState, BtnLinkPrimary } from '../../styles/shared'

const PROVINCE_DATA = {
  'gauteng': {
    name: 'Gauteng',
    abbr: 'Gauteng',
    subtitle: 'Select a city to explore universities and their residences across the economic hub of South Africa.',
    features: [
      { icon: 'school', title: 'Academic Excellence', body: 'Home to Wits, UP, UJ, and more, offering world-class research and professional programmes.' },
      { icon: 'trending_up', title: 'Career Opportunities', body: 'Johannesburg and Pretoria are the financial and administrative capitals of South Africa.' },
    ],
    cities: [
      { name: 'Johannesburg', slug: 'johannesburg', universities: 3, residences: 80, image: 'https://images.unsplash.com/photo-1577948000111-9c970dfe3743?w=800&q=80' },
      { name: 'Pretoria', slug: 'pretoria', universities: 3, residences: 65, image: 'https://images.unsplash.com/photo-1584451854308-66e5a8f3a002?w=800&q=80' },
    ],
  },
  'kwazulu-natal': {
    name: 'KwaZulu-Natal',
    abbr: 'KZN',
    subtitle: 'Select a city to explore universities and their residences across the garden province.',
    features: [
      { icon: 'school', title: 'Academic Excellence', body: 'Home to UKZN, DUT, and UNIZULU, offering world-class facilities and specialized research hubs.' },
      { icon: 'surfing', title: 'Vibrant Student Life', body: 'From the golden mile in Durban to the hills of Maritzburg, experience a unique cultural pulse.' },
    ],
    cities: [
      { name: 'Durban', slug: 'durban', universities: 2, residences: 52, image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&q=80' },
      { name: 'Pietermaritzburg', slug: 'pietermaritzburg', universities: 1, residences: 28, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80' },
    ],
  },
  'western-cape': {
    name: 'Western Cape',
    abbr: 'WC',
    subtitle: 'Select a city to explore universities and their residences along the scenic Cape.',
    features: [
      { icon: 'school', title: 'World-Class Universities', body: 'Home to UCT, Stellenbosch, and CPUT offering outstanding academic programmes.' },
      { icon: 'landscape', title: 'Scenic Living', body: "Study surrounded by mountains and ocean in one of the world's most beautiful regions." },
    ],
    cities: [
      { name: 'Cape Town', slug: 'cape-town', universities: 3, residences: 70, image: 'https://images.unsplash.com/photo-1580697529088-bee7f50533ef?w=800&q=80' },
      { name: 'Stellenbosch', slug: 'stellenbosch', universities: 1, residences: 22, image: 'https://images.unsplash.com/photo-1531370379003-f33ac6b26524?w=800&q=80' },
    ],
  },
  'eastern-cape': {
    name: 'Eastern Cape',
    abbr: 'EC',
    subtitle: 'Select a city to explore universities and their residences in the Eastern Cape.',
    features: [
      { icon: 'school', title: 'Historic Universities', body: 'Home to Rhodes, Walter Sisulu, and UFH, with rich academic heritage.' },
      { icon: 'nature', title: 'Natural Beauty', body: 'A province of stunning landscapes, from the Wild Coast to the Karoo.' },
    ],
    cities: [
      { name: 'Makhanda', slug: 'makhanda', universities: 1, residences: 18, image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80' },
      { name: 'Gqeberha', slug: 'gqeberha', universities: 1, residences: 22, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80' },
      { name: 'East London', slug: 'east-london', universities: 1, residences: 14, image: 'https://images.unsplash.com/photo-1502175353174-a7a70e73b362?w=800&q=80' },
    ],
  },
  'free-state': {
    name: 'Free State',
    abbr: 'FS',
    subtitle: 'Select a city to explore universities and their residences in the Free State.',
    features: [
      { icon: 'school', title: 'Established Institutions', body: 'Home to UFS and CUT, offering excellent academic programmes in the heart of South Africa.' },
      { icon: 'groups', title: 'Close-Knit Community', body: 'Bloemfontein offers an affordable student lifestyle with a strong sense of community.' },
    ],
    cities: [
      { name: 'Bloemfontein', slug: 'bloemfontein', universities: 2, residences: 41, image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80' },
    ],
  },
  'limpopo': {
    name: 'Limpopo',
    abbr: 'Limpopo',
    subtitle: 'Select a city to explore universities and their residences in Limpopo.',
    features: [
      { icon: 'school', title: 'Growing Institutions', body: 'Home to UL and UNIVEN, serving students across the northern regions of South Africa.' },
      { icon: 'nature_people', title: 'Rich Culture', body: "Experience the diverse cultural heritage and natural wonders of South Africa's northern province." },
    ],
    cities: [
      { name: 'Polokwane', slug: 'polokwane', universities: 2, residences: 28, image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&q=80' },
    ],
  },
  'mpumalanga': {
    name: 'Mpumalanga',
    abbr: 'MP',
    subtitle: 'Select a city to explore universities and their residences in Mpumalanga.',
    features: [
      { icon: 'school', title: 'New University', body: 'The University of Mpumalanga is a growing institution offering relevant programmes for the region.' },
      { icon: 'forest', title: 'Nature & Adventure', body: 'Gateway to the Kruger National Park and the spectacular Blyde River Canyon.' },
    ],
    cities: [
      { name: 'Mbombela', slug: 'mbombela', universities: 1, residences: 22, image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&q=80' },
    ],
  },
  'north-west': {
    name: 'North West',
    abbr: 'NW',
    subtitle: 'Select a city to explore universities and their residences in North West.',
    features: [
      { icon: 'school', title: 'Academic Institutions', body: 'NWU serves students across multiple campuses, offering a wide range of disciplines.' },
      { icon: 'bolt', title: 'Affordable Living', body: 'Potchefstroom and Mahikeng offer a cost-effective student lifestyle.' },
    ],
    cities: [
      { name: 'Mahikeng', slug: 'mahikeng', universities: 1, residences: 20, image: 'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=800&q=80' },
      { name: 'Potchefstroom', slug: 'potchefstroom', universities: 1, residences: 14, image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80' },
    ],
  },
  'northern-cape': {
    name: 'Northern Cape',
    abbr: 'NC',
    subtitle: 'Select a city to explore universities and their residences in the Northern Cape.',
    features: [
      { icon: 'school', title: 'Sol Plaatje University', body: 'A young institution in Kimberley offering focused programmes for the region.' },
      { icon: 'star', title: 'Unique Setting', body: 'Study in the land of diamonds and witness the most spectacular night skies in South Africa.' },
    ],
    cities: [
      { name: 'Kimberley', slug: 'kimberley', universities: 1, residences: 12, image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=80' },
    ],
  },
}

/* ── Styled Components ── */

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-top: ${({ theme }) => theme.navHeight};
  overflow-x: hidden;
  background: ${({ theme }) => theme.colors.surface};
`

// Hero
const Hero = styled.section`
  background: ${({ theme }) => theme.colors.primary};
  padding: 40px 0 100px;
`

const HeroInner = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.maxWidth};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.space[4]};
`

const Breadcrumb = styled.nav`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 20px;

  a {
    color: rgba(255, 255, 255, 0.6);
    text-decoration: none;
    &:hover { color: #fff; }
  }

  .sep {
    font-size: 0.6rem;
    opacity: 0.5;
  }

  .current { color: #fff; }
`

const HeroTitle = styled.h1`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(2.25rem, 8vw, 3.5rem);
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.02em;
  line-height: 1.1;
  margin-bottom: 12px;
`

const HeroSubtitle = styled.p`
  font-size: 1rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  max-width: 480px;
  margin-bottom: 32px;
`

const StatsRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 40px;
`

const StatItem = styled.div``

const StatNumber = styled.div`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 2rem;
  font-weight: 800;
  color: #fff;
  line-height: 1;
  margin-bottom: 4px;
`

const StatLabel = styled.div`
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.55);
`

// Cities list
const CitiesSection = styled.section`
  margin-top: -72px;
  padding: 0 0 48px;
  background: transparent;
  flex: 1;
  position: relative;
  z-index: 1;
`

const CitiesInner = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.maxWidth};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.space[4]};
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const CityCard = styled(Link)`
  position: relative;
  border-radius: ${({ theme }) => theme.radii.xl};
  overflow: hidden;
  height: 200px;
  display: block;
  text-decoration: none;
  box-shadow: 0 8px 32px rgba(25, 28, 30, 0.12);
  transition: transform 0.25s, box-shadow 0.25s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 48px rgba(25, 28, 30, 0.18);
  }

  &:first-child {
    height: 240px;
  }
`

const CardBg = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;

  ${CityCard}:hover & { transform: scale(1.05); }
`

const CardOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.15) 60%, transparent 100%);
`

const CardContent = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px 20px 20px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
`

const CardText = styled.div``

const CardName = styled.h3`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.625rem;
  font-weight: 800;
  color: #fff;
  line-height: 1.15;
  margin-bottom: 6px;
  letter-spacing: -0.01em;
`

const CardMeta = styled.p`
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.75);
`

const ArrowBtn = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.accent};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-left: 12px;
  box-shadow: 0 4px 16px rgba(249, 115, 22, 0.4);
  transition: transform 0.2s, box-shadow 0.2s;

  ${CityCard}:hover & {
    transform: scale(1.1);
    box-shadow: 0 8px 24px rgba(249, 115, 22, 0.5);
  }

  .material-symbols-outlined {
    font-size: 1.25rem;
    color: #fff;
  }
`

// Why Study section
const WhySection = styled.section`
  padding: 56px 0 64px;
  background: ${({ theme }) => theme.colors.surfaceCard};
`

const WhyInner = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.maxWidth};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.space[4]};
`

const WhyHeading = styled.h2`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(1.5rem, 5vw, 2rem);
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
  letter-spacing: -0.01em;
  margin-bottom: 8px;
`

const WhyAccent = styled.div`
  width: 40px;
  height: 4px;
  border-radius: 2px;
  background: #ef4444;
  margin-bottom: 40px;
`

const FeatureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`

const FeatureItem = styled.div`
  display: flex;
  gap: 20px;
  align-items: flex-start;
`

const FeatureIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.primaryFixed};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  .material-symbols-outlined {
    font-size: 1.4rem;
    color: ${({ theme }) => theme.colors.primary};
    font-variation-settings: 'FILL' 1;
  }
`

const FeatureText = styled.div``

const FeatureTitle = styled.h4`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.onSurface};
  margin-bottom: 6px;
`

const FeatureBody = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  line-height: 1.6;
`

/* ── Component ── */

export default function Cities() {
  const { province } = useParams()
  const data = PROVINCE_DATA[province]

  if (!data) {
    return (
      <Page>
        <Navbar />
        <EmptyState>
          <p>Province not found.</p>
          <BtnLinkPrimary to="/browse" style={{ marginTop: '1rem' }}>Back to Browse</BtnLinkPrimary>
        </EmptyState>
        <Footer />
      </Page>
    )
  }

  const totalUniversities = data.cities.reduce((sum, c) => sum + c.universities, 0)
  const totalResidences = data.cities.reduce((sum, c) => sum + c.residences, 0)

  return (
    <Page>
      <Navbar />

      <Hero>
        <HeroInner>
          <Breadcrumb>
            <Link to="/">Home</Link>
            <span className="sep">›</span>
            <Link to="/browse">Browse</Link>
            <span className="sep">›</span>
            <span className="current">{data.name}</span>
          </Breadcrumb>

          <HeroTitle>{data.name}</HeroTitle>
          <HeroSubtitle>{data.subtitle}</HeroSubtitle>

          <StatsRow>
            <StatItem>
              <StatNumber>{totalUniversities}</StatNumber>
              <StatLabel>Universities</StatLabel>
            </StatItem>
            <StatItem>
              <StatNumber>{totalResidences}+</StatNumber>
              <StatLabel>Residences</StatLabel>
            </StatItem>
          </StatsRow>
        </HeroInner>
      </Hero>

      <CitiesSection>
        <CitiesInner>
          {data.cities.map(city => (
            <CityCard key={city.slug} to={`/browse/${province}/${city.slug}`}>
              <CardBg src={city.image} alt={city.name} />
              <CardOverlay />
              <CardContent>
                <CardText>
                  <CardName>{city.name}</CardName>
                  <CardMeta>
                    {city.universities} {city.universities === 1 ? 'university' : 'universities'}&nbsp;&nbsp;·&nbsp;&nbsp;{city.residences} residences
                  </CardMeta>
                </CardText>
                <ArrowBtn>
                  <span className="material-symbols-outlined">arrow_forward</span>
                </ArrowBtn>
              </CardContent>
            </CityCard>
          ))}
        </CitiesInner>
      </CitiesSection>

      <WhySection>
        <WhyInner>
          <WhyHeading>Why Study in {data.abbr}?</WhyHeading>
          <WhyAccent />
          <FeatureList>
            {data.features.map((f, i) => (
              <FeatureItem key={i}>
                <FeatureIcon>
                  <span className="material-symbols-outlined">{f.icon}</span>
                </FeatureIcon>
                <FeatureText>
                  <FeatureTitle>{f.title}</FeatureTitle>
                  <FeatureBody>{f.body}</FeatureBody>
                </FeatureText>
              </FeatureItem>
            ))}
          </FeatureList>
        </WhyInner>
      </WhySection>

      <Footer />
    </Page>
  )
}
