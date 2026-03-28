import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import { getUniversity, getUniversityResidences } from '../../services/universities'
import { Container, LoadingState, EmptyState, BtnLinkPrimary } from '../../styles/shared'

const SORT_OPTIONS = [
  { value: 'top_rated', label: 'Recommended' },
  { value: 'most_reviewed', label: 'Most Reviewed' },
  { value: 'az', label: 'A–Z' },
]

const AMENITY_ICONS = {
  'wifi': 'wifi', 'wi-fi': 'wifi', 'free wifi': 'wifi',
  'laundry': 'local_laundry_service',
  'security': 'security', '24/7 security': 'security',
  'parking': 'local_parking',
  'gym': 'fitness_center',
  'pool': 'pool',
  'dining': 'restaurant', 'dining hall': 'restaurant',
  'shuttle': 'directions_bus',
  'elevator': 'elevator',
  'en-suite': 'bathroom',
  'study room': 'menu_book',
}

function getAmenityIcon(name) {
  return AMENITY_ICONS[name.toLowerCase()] || 'check_circle'
}

/* ── Styled Components ── */

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-top: ${({ theme }) => theme.navHeight};
  overflow-x: hidden;
`

// Hero
const Hero = styled.section`
  position: relative;
  min-height: 400px;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
  background: #1a0f5e;
`

const HeroBgImg = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const HeroBgGradient = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, #191c1e 0%, rgba(25, 28, 30, 0.6) 50%, transparent 100%);
`

const HeroContent = styled.div`
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: ${({ theme }) => theme.maxWidth};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.space[4]} 48px;
`

const Breadcrumb = styled.nav`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  letter-spacing: 0.03em;
  margin-bottom: 24px;

  a { color: rgba(255, 255, 255, 0.7); text-decoration: none; &:hover { color: #fff; } }
  span { opacity: 0.5; }
`

const HeroBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;

  @media (min-width: 640px) {
    flex-direction: row;
    align-items: flex-end;
  }
`

const UniLogo = styled.div`
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: #fff;
  border: 4px solid #fff;
  box-shadow: 0 8px 24px rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 2rem;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.primary};

  @media (min-width: 640px) {
    width: 128px;
    height: 128px;
    font-size: 2.5rem;
  }
`

const HeroText = styled.div`
  flex: 1;
`

const HeroTitle = styled.h1`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(1.75rem, 6vw, 3rem);
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.02em;
  line-height: 1.1;
  margin-bottom: 8px;
`

const HeroMeta = styled.p`
  font-size: 1rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 24px;
`

const StatChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
`

const StatChip = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 12px 24px;
  display: flex;
  flex-direction: column;
`

const StatChipLabel = styled.span`
  font-size: 0.6rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 2px;
`

const StatChipValue = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  color: #fff;
`

// Campus tabs
const TabsOuter = styled.div`
  background: ${({ theme }) => theme.colors.surfaceCard};
  border-bottom: 1px solid rgba(199, 196, 216, 0.15);
  position: sticky;
  top: ${({ theme }) => theme.navHeight};
  z-index: 40;
`

const TabsInner = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.maxWidth};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.space[4]};
  display: flex;
  gap: 32px;
  overflow-x: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
`

const Tab = styled.button`
  position: relative;
  flex-shrink: 0;
  padding: 16px 0 16px;
  font-size: 0.875rem;
  font-weight: ${({ $active }) => $active ? '700' : '600'};
  color: ${({ $active, theme }) => $active ? theme.colors.primary : '#464555'};
  background: transparent;
  border: none;
  cursor: pointer;
  white-space: nowrap;
  transition: color 0.15s;

  &:hover { color: ${({ theme }) => theme.colors.primary}; }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    border-radius: 3px 3px 0 0;
    background: ${({ $active, theme }) => $active ? theme.colors.primary : 'transparent'};
    transition: background 0.15s;
  }
`

// Content area
const ContentArea = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.maxWidth};
  margin: 0 auto;
  padding: 48px ${({ theme }) => theme.space[4]};
  flex: 1;
`

const FilterRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 48px;

  @media (min-width: 640px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }
`

const ShowingBlock = styled.div``

const ShowingTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.onSurface};
  letter-spacing: -0.01em;
  margin-bottom: 4px;
`

const ShowingSubtitle = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
`

const FilterControls = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
`

const FilterLabel = styled.span`
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  margin-right: 4px;
`

const SortBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: ${({ theme }) => theme.colors.surfaceCard};
  border: 1px solid rgba(199, 196, 216, 0.2);
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.onSurface};
  cursor: pointer;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);

  .material-symbols-outlined { font-size: 1.1rem; }
`

const SortSelect = styled.select`
  position: absolute;
  opacity: 0;
  pointer-events: none;
`

// Cards grid
const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surfaceCard};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(25, 28, 30, 0.06);
  transition: transform 0.3s;
  cursor: pointer;

  &:hover { transform: translateY(-8px); }
`

const CardImgWrap = styled.div`
  position: relative;
  height: 224px;
  overflow: hidden;
`

const CardImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;

  ${Card}:hover & { transform: scale(1.1); }
`

const CardImgPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.colors.surfaceLow};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
`

const CampusBadge = styled.span`
  position: absolute;
  top: 16px;
  left: 16px;
  background: ${({ $onCampus }) => $onCampus ? '#10b981' : '#64748b'};
  color: #fff;
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 5px 12px;
  border-radius: ${({ theme }) => theme.radii.full};
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
`

const HeartBtn = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;

  .material-symbols-outlined { font-size: 1.25rem; }

  &:hover {
    background: #fff;
    color: #ef4444;
  }
`

const CardBody = styled.div`
  padding: 24px;
`

const CardTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 4px;
`

const CardTitleBlock = styled.div``

const CardName = styled.h3`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.1rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.onSurface};
  line-height: 1.3;
`

const CardCampus = styled.p`
  font-size: 0.8rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  margin-top: 2px;
`

const RatingBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
  background: #ffdbca;
  color: #341100;
  padding: 5px 10px;
  border-radius: 8px;
  flex-shrink: 0;
  margin-left: 8px;

  .material-symbols-outlined {
    font-size: 1rem;
    font-variation-settings: 'FILL' 1;
  }
`

const RatingNum = styled.span`
  font-size: 0.875rem;
  font-weight: 700;
`

const ReviewCount = styled.p`
  font-size: 0.75rem;
  color: rgba(70, 69, 85, 0.7);
  margin-bottom: 16px;
`

const AmenityRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 24px;
`

const AmenityItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};

  .material-symbols-outlined { font-size: 1.1rem; }
  span:last-child { font-size: 0.75rem; font-weight: 500; }
`

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 20px;
  border-top: 1px solid rgba(199, 196, 216, 0.1);
`

const RoomTypes = styled.span`
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
`

const ViewBtn = styled.button`
  padding: 10px 24px;
  border-radius: ${({ theme }) => theme.radii.full};
  border: 2px solid ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.875rem;
  font-weight: 700;
  background: transparent;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: #fff;
  }

  &:active { transform: scale(0.95); }
`

/* ── Sub-components ── */

function ResidenceCard({ residence }) {
  const navigate = useNavigate()
  const isOnCampus = residence.campusType === 'on_campus' || residence.on_campus
  const amenities = (residence.amenities || []).slice(0, 3)
  const roomTypes = residence.roomTypes || residence.room_types || []
  const rating = (residence.avgRating || residence.avg_rating || 0).toFixed(1)
  const reviewCount = (residence.reviewCount || residence.review_count || 0).toLocaleString()
  const imgSrc = residence.imageUrl || residence.image_url

  return (
    <Card onClick={() => navigate(`/residence/${residence.id || residence.residenceId}`)}>
      <CardImgWrap>
        {imgSrc
          ? <CardImg src={imgSrc} alt={residence.name} />
          : <CardImgPlaceholder>🏠</CardImgPlaceholder>
        }
        <CampusBadge $onCampus={isOnCampus}>
          {isOnCampus ? 'On Campus' : 'Off Campus'}
        </CampusBadge>
        <HeartBtn onClick={e => e.stopPropagation()}>
          <span className="material-symbols-outlined">favorite</span>
        </HeartBtn>
      </CardImgWrap>

      <CardBody>
        <CardTop>
          <CardTitleBlock>
            <CardName>{residence.name}</CardName>
            <CardCampus>{residence.campus}</CardCampus>
          </CardTitleBlock>
          <RatingBadge>
            <span className="material-symbols-outlined">star</span>
            <RatingNum>{rating}</RatingNum>
          </RatingBadge>
        </CardTop>

        <ReviewCount>{reviewCount} reviews</ReviewCount>

        {amenities.length > 0 && (
          <AmenityRow>
            {amenities.map((a, i) => (
              <AmenityItem key={i}>
                <span className="material-symbols-outlined">{getAmenityIcon(a)}</span>
                <span>{a}</span>
              </AmenityItem>
            ))}
          </AmenityRow>
        )}

        <CardFooter>
          <RoomTypes>{roomTypes.join(' · ')}</RoomTypes>
          <ViewBtn onClick={e => { e.stopPropagation(); navigate(`/residence/${residence.id || residence.residenceId}`) }}>
            View Reviews
          </ViewBtn>
        </CardFooter>
      </CardBody>
    </Card>
  )
}

/* ── Page component ── */

export default function UniversityDetail() {
  const { universityId } = useParams()
  const [university, setUniversity] = useState(null)
  const [residences, setResidences] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCampus, setSelectedCampus] = useState('all')
  const [sort, setSort] = useState('top_rated')

  useEffect(() => {
    let cancelled = false
    async function fetchData() {
      setLoading(true)
      setError(null)
      try {
        const [uniData, resData] = await Promise.all([
          getUniversity(universityId),
          getUniversityResidences(universityId, { sort }),
        ])
        if (!cancelled) {
          setUniversity(uniData)
          setResidences(resData.items || resData.residences || resData || [])
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load university data.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchData()
    return () => { cancelled = true }
  }, [universityId, sort])

  const campuses = ['all', ...Array.from(new Set(
    residences.map(r => r.campus).filter(Boolean)
  ))]

  const filtered = selectedCampus === 'all'
    ? residences
    : residences.filter(r => r.campus === selectedCampus)

  if (loading) return (
    <Page><Navbar /><LoadingState>Loading university...</LoadingState><Footer /></Page>
  )

  if (error) return (
    <Page>
      <Navbar />
      <EmptyState>
        <p>⚠ {error}</p>
        <BtnLinkPrimary to="/browse" style={{ marginTop: '1rem' }}>Back to Browse</BtnLinkPrimary>
      </EmptyState>
      <Footer />
    </Page>
  )

  if (!university) return null

  const province = university.province || university.state || ''
  const city = university.city || ''
  const estYear = university.establishedYear || university.established_year || university.year || ''
  const numCampuses = university.campusCount || university.campus_count || university.campuses?.length || '—'
  const numResidences = university.residenceCount || university.residence_count || residences.length
  const numReviews = university.reviewCount || university.review_count || '—'
  const heroBg = university.imageUrl || university.image_url || university.coverImage ||
    'https://images.unsplash.com/photo-1562774053-701939374585?w=1600&q=80'
  const initials = university.name?.split(' ').filter(w => w.length > 2).map(w => w[0]).slice(0, 2).join('') || '?'

  return (
    <Page>
      <Navbar />

      {/* ── Hero ── */}
      <Hero>
        <HeroBgImg src={heroBg} alt={university.name} />
        <HeroBgGradient />
        <HeroContent>
          <Breadcrumb>
            <Link to="/">Home</Link>
            <span>/</span>
            {province && <>
              <Link to={`/browse/${province.toLowerCase().replace(/\s+/g, '-')}`}>{province}</Link>
              <span>/</span>
            </>}
            <span style={{ color: '#fff' }}>{university.abbreviation || university.name}</span>
          </Breadcrumb>

          <HeroBody>
            <UniLogo>{initials}</UniLogo>
            <HeroText>
              <HeroTitle>{university.name}</HeroTitle>
              <HeroMeta>
                {[city, province, estYear ? `Est. ${estYear}` : null].filter(Boolean).join(' · ')}
              </HeroMeta>
              <StatChips>
                <StatChip>
                  <StatChipLabel>Campuses</StatChipLabel>
                  <StatChipValue>{numCampuses}</StatChipValue>
                </StatChip>
                <StatChip>
                  <StatChipLabel>Residences</StatChipLabel>
                  <StatChipValue>{numResidences}</StatChipValue>
                </StatChip>
                <StatChip>
                  <StatChipLabel>Reviews</StatChipLabel>
                  <StatChipValue>{typeof numReviews === 'number' ? numReviews.toLocaleString() : numReviews}</StatChipValue>
                </StatChip>
              </StatChips>
            </HeroText>
          </HeroBody>
        </HeroContent>
      </Hero>

      {/* ── Campus tabs ── */}
      <TabsOuter>
        <TabsInner>
          {campuses.map(c => (
            <Tab key={c} $active={selectedCampus === c} onClick={() => setSelectedCampus(c)}>
              {c === 'all' ? 'All Campuses' : c}
            </Tab>
          ))}
        </TabsInner>
      </TabsOuter>

      {/* ── Content ── */}
      <ContentArea>
        <FilterRow>
          <ShowingBlock>
            <ShowingTitle>Showing {filtered.length} {filtered.length === 1 ? 'residence' : 'residences'}</ShowingTitle>
            <ShowingSubtitle>Discover the best-rated student accommodation at {university.abbreviation || university.name}</ShowingSubtitle>
          </ShowingBlock>

          <FilterControls>
            <FilterLabel>Sort:</FilterLabel>
            <SortBtn>
              <span>{SORT_OPTIONS.find(o => o.value === sort)?.label}</span>
              <span className="material-symbols-outlined">expand_more</span>
              <SortSelect value={sort} onChange={e => setSort(e.target.value)}>
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </SortSelect>
            </SortBtn>
          </FilterControls>
        </FilterRow>

        {filtered.length === 0 ? (
          <EmptyState><p>🏠 No residences found for this campus.</p></EmptyState>
        ) : (
          <Grid>
            {filtered.map(res => (
              <ResidenceCard key={res.id || res.residenceId} residence={res} />
            ))}
          </Grid>
        )}
      </ContentArea>

      <Footer />
    </Page>
  )
}
