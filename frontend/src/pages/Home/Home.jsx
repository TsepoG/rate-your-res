import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import styled from 'styled-components'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'

const PROVINCES = [
  { name: 'Gauteng', slug: 'gauteng', universities: 8, image: 'https://images.unsplash.com/photo-1577948000111-9c970dfe3743?w=600&q=80' },
  { name: 'Western Cape', slug: 'western-cape', universities: 4, image: 'https://images.unsplash.com/photo-1580697529088-bee7f50533ef?w=600&q=80' },
  { name: 'KwaZulu-Natal', slug: 'kwazulu-natal', universities: 4, image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=600&q=80' },
  { name: 'Eastern Cape', slug: 'eastern-cape', universities: 4, image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=80' },
  { name: 'Free State', slug: 'free-state', universities: 2, image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600&q=80' },
  { name: 'Mpumalanga', slug: 'mpumalanga', universities: 1, image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=600&q=80' },
]

const FEATURED = [
  {
    id: 'wits-barnato',
    name: 'Barnato Hall',
    university: 'WITS University',
    rating: 4.8,
    amenities: [
      { icon: 'wifi', label: 'WIFI' },
      { icon: 'local_laundry_service', label: 'LAUNDRY' },
      { icon: 'security', label: '24/7' },
    ],
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&q=80',
  },
  {
    id: 'uct-tugwell',
    name: 'Tugwell Hall',
    university: 'UCT',
    rating: 4.5,
    amenities: [
      { icon: 'elevator', label: 'ELEVATOR' },
      { icon: 'restaurant', label: 'DINING' },
      { icon: 'directions_bus', label: 'SHUTTLE' },
    ],
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80',
  },
  {
    id: 'sun-metanoia',
    name: 'Metanoia',
    university: 'Stellenbosch',
    rating: 4.9,
    amenities: [
      { icon: 'fitness_center', label: 'GYM' },
      { icon: 'pool', label: 'POOL' },
      { icon: 'wifi', label: 'FIBRE' },
    ],
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80',
  },
]

/* ── Styled Components ── */

const Page = styled.div`
  min-height: 100vh;
  overflow-x: hidden;
`

const Main = styled.main`
  padding-top: ${({ theme }) => theme.navHeight};
`

const Hero = styled.section`
  position: relative;
  min-height: 720px;
  display: flex;
  align-items: center;
  background: #1a0f5e;
  overflow: hidden;
  color: #fff;
`

const HeroBg = styled.div`
  position: absolute;
  inset: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.6;
  }
`

const HeroBgGradient = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, #1a0f5e 0%, rgba(0, 0, 0, 0.2) 45%, rgba(0, 0, 0, 0.4) 100%);
`

const HeroContent = styled.div`
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 896px;
  margin: 0 auto;
  padding: 64px 24px 120px;
  text-align: center;

  @media (min-width: 768px) {
    text-align: left;
  }
`

const HeroTitle = styled.h1`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(3rem, 10vw, 4.5rem);
  font-weight: 900;
  letter-spacing: -0.03em;
  line-height: 1.05;
  color: #fff;
  margin-bottom: 24px;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
`

const HeroAccent = styled.span`
  color: #ffdbca;
`

const HeroSub = styled.p`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 40px;
  max-width: 520px;
  margin-left: auto;
  margin-right: auto;
  font-weight: 500;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);

  @media (min-width: 768px) {
    margin-left: 0;
    margin-right: 0;
  }
`

const SearchBar = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 640px;
  margin: 0 auto 32px;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  padding: 8px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.3);

  @media (min-width: 768px) {
    flex-direction: row;
    border-radius: ${({ theme }) => theme.radii.full};
    margin: 0 0 32px 0;
  }
`

const SearchField = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  padding: 0 16px;
`

const SearchIcon = styled.span`
  color: rgba(255, 255, 255, 0.5);
  font-size: 1.25rem;
  margin-right: 12px;
`

const SearchInput = styled.input`
  flex: 1;
  background: none;
  border: none;
  outline: none;
  color: #fff;
  font-size: 1rem;
  font-weight: 500;
  padding: 12px 0;

  &::placeholder { color: rgba(255, 255, 255, 0.5); }
`

const SearchBtn = styled.button`
  width: 100%;
  padding: 14px 32px;
  border-radius: 12px;
  background: #ffdbca;
  color: #341100;
  font-size: 1rem;
  font-weight: 700;
  font-family: ${({ theme }) => theme.fonts.body};
  cursor: pointer;
  border: none;
  transition: background 0.15s;

  &:hover { background: #fff; }

  @media (min-width: 768px) {
    width: auto;
    border-radius: ${({ theme }) => theme.radii.full};
    padding: 14px 32px;
  }
`

const ProvincePills = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  justify-content: center;

  @media (min-width: 768px) {
    justify-content: flex-start;
  }
`

const PillLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.6);
`

const Pill = styled(Link)`
  padding: 6px 18px;
  border-radius: ${({ theme }) => theme.radii.full};
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  font-size: 0.875rem;
  font-weight: 700;
  transition: background 0.15s;
  text-decoration: none;

  &:hover { background: rgba(255, 255, 255, 0.2); }
`

const StatsSection = styled.section`
  position: relative;
  z-index: 20;
  margin-top: -48px;
  padding: 0 24px;
`

const StatsCard = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-around;
  }
`

const Stat = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`

const StatIcon = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 2rem;
  margin-bottom: 8px;
`

const StatNum = styled.span`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 2rem;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.onSurface};
  letter-spacing: -0.02em;
  line-height: 1;
`

const StatLabel = styled.span`
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #777587;
  margin-top: 4px;
`

const StatDivider = styled.div`
  width: 80%;
  height: 1px;
  background: rgba(199, 196, 216, 0.3);

  @media (min-width: 768px) {
    width: 1px;
    height: 48px;
  }
`

const FeaturedSection = styled.section`
  padding: 80px 0;
`

const ContainerDiv = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.maxWidth};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.space[4]};
`

const FeaturedHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 40px;
`

const SectionTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(1.75rem, 4vw, 2.25rem);
  font-weight: 900;
  color: ${({ theme }) => theme.colors.onSurface};
  margin-bottom: 8px;
`

const SectionSub = styled.p`
  color: #777587;
  font-weight: 500;
`

const BrowseTitleBlock = styled.div`
  text-align: center;
  margin-bottom: 48px;
`

const ViewAllLink = styled(Link)`
  display: none;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 700;
  font-size: 0.9rem;
  transition: gap 0.2s;
  text-decoration: none;
  white-space: nowrap;

  &:hover { gap: 12px; }

  .material-symbols-outlined { font-size: 1.2rem; }

  @media (min-width: 768px) {
    display: flex;
  }
`

const CardsScroll = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 24px;
  padding-bottom: 24px;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  margin: 0 -16px;
  padding-left: 16px;
  padding-right: 16px;
  scrollbar-width: none;

  &::-webkit-scrollbar { display: none; }

  @media (min-width: 768px) {
    margin: 0;
    padding-left: 0;
    padding-right: 0;
  }
`

const ResCard = styled.div`
  min-width: 300px;
  flex-shrink: 0;
  scroll-snap-align: center;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.card};
  transition: box-shadow 0.3s;

  &:hover { box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12); }

  @media (min-width: 768px) {
    min-width: 380px;
  }
`

const ResCardImg = styled.div`
  height: 224px;
  position: relative;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s;
  }

  ${ResCard}:hover & img {
    transform: scale(1.05);
  }
`

const ResCardBadge = styled.span`
  position: absolute;
  top: 16px;
  left: 16px;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  font-size: 0.625rem;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: ${({ theme }) => theme.radii.full};
  text-transform: uppercase;
  letter-spacing: 0.08em;
`

const ResCardBody = styled.div`
  padding: 24px;
`

const ResCardTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`

const ResCardName = styled.h3`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.onSurface};
`

const ResCardRating = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #a04500;
`

const StarIcon = styled.span`
  font-size: 1rem;
  font-variation-settings: 'FILL' 1;
`

const RatingNum = styled.span`
  font-weight: 700;
  font-size: 0.9rem;
`

const AmenitiesRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`

const AmenityChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.625rem;
  font-weight: 700;
  background: #f2f4f6;
  color: #464555;
  padding: 4px 8px;
  border-radius: 6px;

  .material-symbols-outlined { font-size: 0.875rem; }
`

const ViewResBtn = styled(Link)`
  display: block;
  width: 100%;
  padding: 14px;
  background: #e6e8ea;
  color: ${({ theme }) => theme.colors.onSurface};
  font-weight: 700;
  font-size: 0.9rem;
  border-radius: 8px;
  text-align: center;
  text-decoration: none;
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: #fff;
  }
`

const BrowseSection = styled.section`
  padding: 80px 0;
  background: #f2f4f6;
`

const ProvinceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
  }
`

const ProvinceCard = styled(Link)`
  position: relative;
  aspect-ratio: 1 / 1;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  display: block;

  &:hover img { transform: scale(1.1); }
`

const ProvinceImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.7s;
`

const ProvinceOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.2) 50%, transparent 100%);
`

const ProvinceInfo = styled.div`
  position: absolute;
  bottom: 16px;
  left: 16px;
  color: #fff;
`

const ProvinceName = styled.p`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.1rem;
  font-weight: 900;
  margin-bottom: 2px;
`

const ProvinceSub = styled.p`
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.7);
`

const HowSection = styled.section`
  padding: 96px 0;
  overflow: hidden;
`

const HowTitleBlock = styled.div`
  text-align: center;
  margin-bottom: 80px;
`

const HowTitleLine = styled.div`
  width: 96px;
  height: 6px;
  background: #a04500;
  border-radius: ${({ theme }) => theme.radii.full};
  margin: 16px auto 0;
`

const Steps = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
  max-width: 480px;
  margin: 0 auto;
  align-items: center;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: flex-start;
    max-width: none;
    justify-content: space-between;
    gap: 0;
  }
`

const Step = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  @media (min-width: 768px) {
    flex: 1;
  }
`

const StepIconWrap = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  background: #e2dfff;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  transition: transform 0.3s;

  &:hover { transform: scale(1.05); }

  .material-symbols-outlined {
    color: ${({ theme }) => theme.colors.primary};
    font-size: 2.25rem;
  }
`

const StepBadge = styled.span`
  position: absolute;
  top: -12px;
  right: -12px;
  width: 32px;
  height: 32px;
  background: #a04500;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
`

const StepArrow = styled.span`
  display: none;
  color: #c7c4d8;
  font-size: 2rem;

  @media (min-width: 768px) {
    display: block;
    margin-top: 40px;
    flex-shrink: 0;
  }
`

const StepTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 12px;
  color: ${({ theme }) => theme.colors.onSurface};
`

const StepDesc = styled.p`
  color: #777587;
  line-height: 1.6;
  max-width: 260px;
`

const CtaSection = styled.section`
  padding: 48px 0;
`

const CtaBanner = styled.div`
  position: relative;
  background: ${({ theme }) => theme.colors.primary};
  border-radius: 32px;
  padding: 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  text-align: center;
  overflow: hidden;

  @media (min-width: 768px) {
    flex-direction: row;
    text-align: left;
    justify-content: space-between;
  }
`

const CtaBannerBg = styled.div`
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at top right, rgba(255, 255, 255, 0.1), transparent 60%);
  pointer-events: none;
`

const CtaText = styled.div`
  position: relative;
  z-index: 1;
`

const CtaTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(1.5rem, 4vw, 2.25rem);
  font-weight: 900;
  color: #fff;
  margin-bottom: 16px;
`

const CtaSub = styled.p`
  color: #c3c0ff;
  font-weight: 500;
  max-width: 400px;
  margin: 0 auto;

  @media (min-width: 768px) {
    margin: 0;
  }
`

const CtaBtn = styled(Link)`
  position: relative;
  z-index: 1;
  background: #ffdbca;
  color: #341100;
  padding: 16px 40px;
  border-radius: ${({ theme }) => theme.radii.full};
  font-weight: 900;
  font-size: 1.1rem;
  text-decoration: none;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s;
  white-space: nowrap;
  flex-shrink: 0;

  &:hover { transform: scale(1.05); }
`


export default function Home() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  function handleSearch(e) {
    e.preventDefault()
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <Page>
      <Navbar />

      <Main>
        {/* ── Hero ── */}
        <Hero>
          <HeroBg>
            <img
              src="https://images.unsplash.com/photo-1562774053-701939374585?w=1600&q=80"
              alt="University campus"
            />
            <HeroBgGradient />
          </HeroBg>

          <HeroContent>
            <HeroTitle>
              Know Before<br />
              <HeroAccent>You Move In</HeroAccent>
            </HeroTitle>
            <HeroSub>
              Real reviews from real students across all 25 South African universities.
            </HeroSub>

            <SearchBar onSubmit={handleSearch}>
              <SearchField>
                <SearchIcon className="material-symbols-outlined">search</SearchIcon>
                <SearchInput
                  type="text"
                  placeholder="Search a university or residence..."
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                />
              </SearchField>
              <SearchBtn type="submit">Search</SearchBtn>
            </SearchBar>

            <ProvincePills>
              <PillLabel>Browse by province:</PillLabel>
              {['Gauteng', 'Western Cape', 'KZN'].map(p => (
                <Pill
                  key={p}
                  to={`/browse/${p.toLowerCase().replace(/ /g, '-')}`}
                >
                  {p}
                </Pill>
              ))}
            </ProvincePills>
          </HeroContent>
        </Hero>

        {/* ── Stats bar ── */}
        <StatsSection>
          <StatsCard>
            <Stat>
              <StatIcon className="material-symbols-outlined">school</StatIcon>
              <StatNum>25</StatNum>
              <StatLabel>Universities</StatLabel>
            </Stat>
            <StatDivider />
            <Stat>
              <StatIcon className="material-symbols-outlined">domain</StatIcon>
              <StatNum>200+</StatNum>
              <StatLabel>Residences</StatLabel>
            </Stat>
            <StatDivider />
            <Stat>
              <StatIcon className="material-symbols-outlined">verified</StatIcon>
              <StatNum>Trusted</StatNum>
              <StatLabel>By Students</StatLabel>
            </Stat>
          </StatsCard>
        </StatsSection>

        {/* ── Top Rated Residences ── */}
        <FeaturedSection>
          <ContainerDiv>
            <FeaturedHeader>
              <div>
                <SectionTitle>Top Rated Residences</SectionTitle>
                <SectionSub>Handpicked favorites from across the country</SectionSub>
              </div>
              <ViewAllLink to="/search">
                View all
                <span className="material-symbols-outlined">arrow_forward</span>
              </ViewAllLink>
            </FeaturedHeader>

            <CardsScroll>
              {FEATURED.map(res => (
                <ResCard key={res.id}>
                  <ResCardImg>
                    <img src={res.image} alt={res.name} />
                    <ResCardBadge>{res.university}</ResCardBadge>
                  </ResCardImg>
                  <ResCardBody>
                    <ResCardTop>
                      <ResCardName>{res.name}</ResCardName>
                      <ResCardRating>
                        <StarIcon className="material-symbols-outlined">star</StarIcon>
                        <RatingNum>{res.rating}</RatingNum>
                      </ResCardRating>
                    </ResCardTop>
                    <AmenitiesRow>
                      {res.amenities.map(a => (
                        <AmenityChip key={a.label}>
                          <span className="material-symbols-outlined">{a.icon}</span>
                          {a.label}
                        </AmenityChip>
                      ))}
                    </AmenitiesRow>
                    <ViewResBtn to={`/residence/${res.id}`}>
                      View Residence
                    </ViewResBtn>
                  </ResCardBody>
                </ResCard>
              ))}
            </CardsScroll>
          </ContainerDiv>
        </FeaturedSection>

        {/* ── Browse by Province ── */}
        <BrowseSection>
          <ContainerDiv>
            <BrowseTitleBlock>
              <SectionTitle>Browse by Province</SectionTitle>
              <SectionSub>Discover housing options in South Africa's major student hubs</SectionSub>
            </BrowseTitleBlock>

            <ProvinceGrid>
              {PROVINCES.map(p => (
                <ProvinceCard key={p.slug} to={`/browse/${p.slug}`}>
                  <ProvinceImg src={p.image} alt={p.name} />
                  <ProvinceOverlay />
                  <ProvinceInfo>
                    <ProvinceName>{p.name}</ProvinceName>
                    <ProvinceSub>
                      {p.universities} {p.universities === 1 ? 'University' : 'Universities'}
                    </ProvinceSub>
                  </ProvinceInfo>
                </ProvinceCard>
              ))}
            </ProvinceGrid>
          </ContainerDiv>
        </BrowseSection>

        {/* ── How It Works ── */}
        <HowSection>
          <ContainerDiv>
            <HowTitleBlock>
              <SectionTitle>How It Works</SectionTitle>
              <HowTitleLine />
            </HowTitleBlock>

            <Steps>
              <Step>
                <StepIconWrap>
                  <span className="material-symbols-outlined">manage_search</span>
                  <StepBadge>1</StepBadge>
                </StepIconWrap>
                <StepTitle>Find Your Residence</StepTitle>
                <StepDesc>Search through hundreds of verified residences by university or province.</StepDesc>
              </Step>

              <StepArrow className="material-symbols-outlined">trending_flat</StepArrow>

              <Step>
                <StepIconWrap>
                  <span className="material-symbols-outlined">rate_review</span>
                  <StepBadge>2</StepBadge>
                </StepIconWrap>
                <StepTitle>Read Real Reviews</StepTitle>
                <StepDesc>Get the truth about WiFi speed, safety, and late-night noise levels.</StepDesc>
              </Step>

              <StepArrow className="material-symbols-outlined">trending_flat</StepArrow>

              <Step>
                <StepIconWrap>
                  <span className="material-symbols-outlined">mail_lock</span>
                  <StepBadge>3</StepBadge>
                </StepIconWrap>
                <StepTitle>Share Your Experience</StepTitle>
                <StepDesc>Verify your student email and help others by sharing your story.</StepDesc>
              </Step>
            </Steps>
          </ContainerDiv>
        </HowSection>

        {/* ── CTA Banner ── */}
        <CtaSection>
          <ContainerDiv>
            <CtaBanner>
              <CtaBannerBg />
              <CtaText>
                <CtaTitle>
                  Lived in a res?<br />Help the next student.
                </CtaTitle>
                <CtaSub>
                  Your insights can make a difference in someone's university journey.
                </CtaSub>
              </CtaText>
              <CtaBtn to="/review">Write a Review</CtaBtn>
            </CtaBanner>
          </ContainerDiv>
        </CtaSection>

        <Footer />
      </Main>
    </Page>
  )
}
