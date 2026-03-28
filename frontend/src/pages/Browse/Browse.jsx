import { Link } from 'react-router-dom'
import styled from 'styled-components'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import { Container } from '../../styles/shared'

const PROVINCES = [
  { name: 'Gauteng', slug: 'gauteng', universities: 6, residences: 145, image: 'https://images.unsplash.com/photo-1577948000111-9c970dfe3743?w=600&q=80' },
  { name: 'KwaZulu-Natal', slug: 'kwazulu-natal', universities: 4, residences: 78, image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=600&q=80' },
  { name: 'Western Cape', slug: 'western-cape', universities: 4, residences: 92, image: 'https://images.unsplash.com/photo-1580697529088-bee7f50533ef?w=600&q=80' },
  { name: 'Eastern Cape', slug: 'eastern-cape', universities: 3, residences: 54, image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=80' },
  { name: 'Free State', slug: 'free-state', universities: 2, residences: 41, image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600&q=80' },
  { name: 'Limpopo', slug: 'limpopo', universities: 2, residences: 28, image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600&q=80' },
  { name: 'Mpumalanga', slug: 'mpumalanga', universities: 1, residences: 22, image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=600&q=80' },
  { name: 'North West', slug: 'north-west', universities: 1, residences: 34, image: 'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=600&q=80' },
  { name: 'Northern Cape', slug: 'northern-cape', universities: 1, residences: 12, image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=600&q=80' },
]

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  background: ${({ theme }) => theme.colors.surface};
`

const Hero = styled.section`
  position: relative;
  background: ${({ theme }) => theme.colors.primary};
  padding: 120px 24px 80px;
  overflow: hidden;
`

const HeroGlow = styled.div`
  position: absolute;
  top: -48px;
  right: -48px;
  width: 384px;
  height: 384px;
  background: rgba(255, 219, 202, 0.15);
  border-radius: 50%;
  filter: blur(100px);
  pointer-events: none;
`

const HeroInner = styled(Container)`
  position: relative;
  z-index: 1;
`

const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 24px;

  a {
    color: rgba(255, 255, 255, 0.7);
    text-decoration: none;
    &:hover { color: #fff; }
  }

  span { color: rgba(255, 255, 255, 0.5); }
`

const HeroTitle = styled.h1`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 800;
  color: #fff;
  line-height: 1.1;
  margin-bottom: 20px;
  letter-spacing: -0.02em;
`

const HeroDesc = styled.p`
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.8);
  max-width: 640px;
  line-height: 1.6;
`

const GridSection = styled.section`
  padding: 64px 0;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 540px) {
    grid-template-columns: 1fr;
  }
`

const ProvinceCard = styled(Link)`
  position: relative;
  border-radius: ${({ theme }) => theme.radii.xl};
  overflow: hidden;
  height: 320px;
  cursor: pointer;
  display: block;
  transition: transform 0.25s, box-shadow 0.25s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 48px rgba(0, 0, 0, 0.25);
  }

  &:hover img {
    transform: scale(1.1);
  }

  &:hover .bottom-border {
    opacity: 1;
  }
`

const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
`

const CardOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.15) 60%, transparent 100%);
`

const CardBottomBorder = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: ${({ theme }) => theme.colors.tertiaryBadge};
  opacity: 0;
  transition: opacity 0.25s;
`

const CardInfo = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 32px;
`

const CardName = styled.h3`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.75rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8px;
  line-height: 1.2;
`

const CardMeta = styled.p`
  font-size: 0.875rem;
  color: #ffdbca;
  display: flex;
  align-items: center;
  gap: 6px;

  .material-symbols-outlined {
    font-size: 1rem;
    font-variation-settings: 'FILL' 1;
  }
`

export default function Browse() {
  return (
    <Page>
      <Navbar />

      <Hero>
        <HeroGlow />
        <HeroInner>
          <Breadcrumb>
            <Link to="/">Home</Link>
            <span>›</span>
            <span>Browse</span>
          </Breadcrumb>
          <HeroTitle>Browse by Province</HeroTitle>
          <HeroDesc>
            Explore student residences across South Africa. Select a province to discover universities and their accommodation options.
          </HeroDesc>
        </HeroInner>
      </Hero>

      <GridSection>
        <Container>
          <Grid>
            {PROVINCES.map(province => (
              <ProvinceCard
                key={province.slug}
                to={`/browse/${province.slug}`}
              >
                <CardImage src={province.image} alt={province.name} />
                <CardOverlay />
                <CardBottomBorder className="bottom-border" />
                <CardInfo>
                  <CardName>{province.name}</CardName>
                  <CardMeta>
                    <span className="material-symbols-outlined">school</span>
                    {province.universities} {province.universities === 1 ? 'university' : 'universities'} · {province.residences} residences
                  </CardMeta>
                </CardInfo>
              </ProvinceCard>
            ))}
          </Grid>
        </Container>
      </GridSection>

      <Footer />
    </Page>
  )
}
