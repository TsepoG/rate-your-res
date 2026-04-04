import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import styled from 'styled-components'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import { searchResidences } from '../../services/residences'
import { Container } from '../../styles/shared'
import { SkeletonBlock } from '../../components/ui/Skeleton'

const PROVINCES = [
  'Gauteng', 'Western Cape', 'KwaZulu-Natal', 'Eastern Cape',
  'Limpopo', 'Mpumalanga', 'North West', 'Free State', 'Northern Cape',
]

const ALL_UNIVERSITIES = [
  { id: 'ukzn', abbr: 'UKZN' },
  { id: 'wits', abbr: 'Wits' },
  { id: 'uct', abbr: 'UCT' },
  { id: 'sun', abbr: 'SU' },
  { id: 'up', abbr: 'UP' },
  { id: 'uj', abbr: 'UJ' },
  { id: 'ufs', abbr: 'UFS' },
  { id: 'dut', abbr: 'DUT' },
]

const AMENITY_FILTERS = ['WiFi', 'Laundry', 'Gym', 'Security']

const SORT_OPTIONS = [
  { value: 'top_rated', label: 'Top Rated' },
  { value: 'most_reviewed', label: 'Most Reviewed' },
  { value: 'az', label: 'A – Z' },
]

const AMENITY_ICON_MAP = {
  wifi: 'wifi',
  laundry: 'local_laundry_service',
  gym: 'fitness_center',
  pool: 'pool',
  security: 'security',
  'study room': 'menu_book',
  dining: 'restaurant',
  parking: 'local_parking',
  shuttle: 'directions_bus',
  elevator: 'elevator',
}

function getAmenityIcon(amenity) {
  const lower = amenity.toLowerCase()
  for (const [key, icon] of Object.entries(AMENITY_ICON_MAP)) {
    if (lower.includes(key)) return icon
  }
  return 'check_circle'
}

const PER_PAGE = 10

/* ── Styled Components ── */

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.surface};
  overflow-x: hidden;
`

const SearchBanner = styled.div`
  background: ${({ theme }) => theme.colors.surfaceCard};
  border-bottom: 1px solid #eaecf0;
  padding: 1rem 0;
  position: sticky;
  top: ${({ theme }) => theme.navHeight};
  z-index: 10;
`

const SearchBox = styled.form`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${({ theme }) => theme.colors.surfaceCard};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: 0.375rem;
  box-shadow: ${({ theme }) => theme.shadows.card};

  @media (max-width: 768px) {
    flex-wrap: wrap;
  }
`

const InputWrap = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${({ theme }) => theme.colors.surfaceLow};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 0.75rem 1rem;
  min-width: 0;

  .material-symbols-outlined {
    font-size: 1.25rem;
    color: ${({ theme }) => theme.colors.onSurfaceMuted};
    flex-shrink: 0;
  }
`

const SearchInput = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-size: 0.95rem;
  font-family: inherit;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.onSurface};
  min-width: 0;

  &::placeholder { color: ${({ theme }) => theme.colors.onSurfaceMuted}; }
`

const TuneBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  flex-shrink: 0;

  .material-symbols-outlined { font-size: 1.25rem; }

  @media (min-width: 769px) { display: none; }
`

const SortWrap = styled.div`
  display: none;
  align-items: center;
  gap: 0.5rem;
  padding: 0 0.5rem;
  flex-shrink: 0;

  @media (min-width: 769px) { display: flex; }
`

const SortLabel = styled.span`
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${({ theme }) => theme.colors.outlineVariant};
  white-space: nowrap;
`

const SortSelect = styled.select`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  &:focus { outline: none; }
`

const SearchBtn = styled.button`
  display: none;
  align-items: center;
  gap: 0.5rem;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  padding: 0.75rem 1.5rem;
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: 0.875rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  white-space: nowrap;
  font-family: inherit;
  flex-shrink: 0;
  transition: opacity 0.15s;

  &:hover { opacity: 0.9; }

  @media (min-width: 769px) { display: flex; }
`

const Body = styled.div`
  padding: 1.5rem 0 4rem;
`

const ResultsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
`

const ResultsTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.onSurface};
`

const MobileSortBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: ${({ theme }) => theme.colors.surfaceHigh};
  border: none;
  border-radius: ${({ theme }) => theme.radii.full};
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.onSurface};
  cursor: pointer;
  font-family: inherit;

  .material-symbols-outlined { font-size: 1rem; }

  @media (min-width: 1024px) { display: none; }
`

const MobileSortSelect = styled.select`
  display: block;
  width: 100%;
  margin-bottom: 1rem;
  padding: 0.625rem 1rem;
  border-radius: ${({ theme }) => theme.radii.full};
  border: 1.5px solid ${({ theme }) => theme.colors.outlineVariant};
  background: ${({ theme }) => theme.colors.surfaceCard};
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  font-family: inherit;
  cursor: pointer;

  @media (min-width: 1024px) { display: none; }
`

const Layout = styled.div`
  display: flex;
  gap: 2rem;
  align-items: flex-start;
`

const Sidebar = styled.aside`
  width: 288px;
  flex-shrink: 0;
  display: none;

  @media (min-width: 1024px) {
    display: block;
    position: sticky;
    top: calc(${({ theme }) => theme.navHeight} + 72px);
  }
`

const MobileSidebar = styled.div`
  display: ${({ $open }) => ($open ? 'block' : 'none')};
  margin-bottom: 1.25rem;

  @media (min-width: 1024px) { display: none; }
`

const SidebarCard = styled.div`
  background: ${({ theme }) => theme.colors.surfaceLow};
  border-radius: ${({ theme }) => theme.radii.xl};
  overflow: hidden;
`

const SidebarHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;

  h3 {
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 1.1rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.onSurface};
  }

  button {
    background: none;
    border: none;
    cursor: pointer;
    color: ${({ theme }) => theme.colors.primary};
    display: flex;
    align-items: center;
    .material-symbols-outlined { font-size: 1.25rem; }
  }
`

const FilterGroup = styled.div`
  padding: 0 1.5rem 1.25rem;
`

const FilterLabel = styled.label`
  display: block;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  margin-bottom: 0.75rem;
`

const ProvinceSelect = styled.select`
  width: 100%;
  background: ${({ theme }) => theme.colors.surfaceCard};
  border: none;
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  font-family: inherit;
  color: ${({ theme }) => theme.colors.onSurface};
  cursor: pointer;

  &:focus { outline: 2px solid ${({ theme }) => theme.colors.primary}; }
`

const CheckLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.onSurface};
  cursor: pointer;
  padding: 0.25rem 0;

  input {
    accent-color: ${({ theme }) => theme.colors.primary};
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
  }
`

const RatingSlider = styled.input`
  width: 100%;
  accent-color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 0.25rem;
`

const RatingSliderLabels = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.7rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
`

const AmenityGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
`

const AmenityBtn = styled.button`
  padding: 0.5rem;
  border-radius: ${({ theme }) => theme.radii.lg};
  font-size: 0.7rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s, color 0.15s;
  background: ${({ $active, theme }) => $active ? theme.colors.primaryFixed : theme.colors.surfaceHigh};
  color: ${({ $active, theme }) => $active ? theme.colors.primaryDark : theme.colors.onSurfaceMuted};
`

const Divider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.surfaceHigh};
  margin: 0 1.5rem 1.25rem;
`

const ToggleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem 1.25rem;
`

const ToggleLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.onSurface};
`

const ToggleSwitch = styled.button`
  position: relative;
  width: 2.5rem;
  height: 1.35rem;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ $on, theme }) => $on ? theme.colors.primary : '#d1d5db'};
  border: none;
  cursor: pointer;
  transition: background 0.2s;
  flex-shrink: 0;
`

const ToggleThumb = styled.span`
  position: absolute;
  top: 0.15rem;
  left: 0.15rem;
  width: 1.05rem;
  height: 1.05rem;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s;
  display: block;
  transform: ${({ $on }) => $on ? 'translateX(1.15rem)' : 'none'};
`

const Results = styled.div`
  flex: 1;
  min-width: 0;
`

const ResultCard = styled.div`
  background: ${({ theme }) => theme.colors.surfaceCard};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: 1rem;
  box-shadow: ${({ theme }) => theme.shadows.card};
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  overflow: hidden;
  transition: box-shadow 0.2s;

  &:hover { box-shadow: ${({ theme }) => theme.shadows.float}; }
  &:hover img { transform: scale(1.05); }
  &:hover .card-title { color: ${({ theme }) => theme.colors.primary}; }

  @media (min-width: 640px) {
    flex-direction: row;
  }
`

const CardThumb = styled.div`
  width: 100%;
  height: 192px;
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
  flex-shrink: 0;
  background: ${({ theme }) => theme.colors.surfaceLow};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  @media (min-width: 640px) {
    width: 192px;
    height: 192px;
  }
`

const CardBody = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0.25rem 0;
`

const BadgeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
`

const OnCampusBadge = styled.span`
  background: ${({ theme }) => theme.colors.accentLight};
  color: ${({ theme }) => theme.colors.accentDark};
  font-size: 0.625rem;
  font-weight: 800;
  text-transform: uppercase;
  padding: 0.15rem 0.5rem;
  border-radius: ${({ theme }) => theme.radii.full};
`

const OffCampusBadge = styled.span`
  background: ${({ theme }) => theme.colors.primaryFixed};
  color: ${({ theme }) => theme.colors.primaryDark};
  font-size: 0.625rem;
  font-weight: 800;
  text-transform: uppercase;
  padding: 0.15rem 0.5rem;
  border-radius: ${({ theme }) => theme.radii.full};
`

const CampusName = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.outlineVariant};
`

const CardTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.25rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.onSurface};
  transition: color 0.15s;
  margin-bottom: 0.5rem;
  line-height: 1.25;
`

const CardDesc = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 0.75rem;
`

const AmenityRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`

const AmenityItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;

  .material-symbols-outlined {
    font-size: 1.1rem;
    color: ${({ theme }) => theme.colors.primary};
    font-variation-settings: 'FILL' 0;
  }

  span:last-child {
    font-size: 0.75rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.onSurfaceMuted};
  }
`

const CardSide = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid ${({ theme }) => theme.colors.surfaceHigh};
  padding-top: 0.75rem;
  gap: 1rem;
  flex-shrink: 0;

  @media (min-width: 640px) {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-top: none;
    border-left: 1px solid ${({ theme }) => theme.colors.surfaceHigh};
    padding-top: 0;
    padding-left: 1.5rem;
    width: 128px;
    gap: 1rem;
  }
`

const RatingBlock = styled.div`
  text-align: center;
`

const RatingNum = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.5rem;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.tertiaryBadge};

  .material-symbols-outlined {
    font-size: 1.25rem;
    font-variation-settings: 'FILL' 1;
    color: ${({ theme }) => theme.colors.tertiaryBadge};
  }
`

const ReviewCount = styled.div`
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.colors.outlineVariant};
  margin-top: 0.2rem;
`

const ViewBtn = styled(Link)`
  display: block;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.primaryFixed};
  font-weight: 700;
  font-size: 0.9rem;
  padding: 0.75rem 1.5rem;
  border-radius: ${({ theme }) => theme.radii.full};
  text-decoration: none;
  text-align: center;
  transition: background 0.15s, color 0.15s;
  white-space: nowrap;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
    color: #fff;
  }

  @media (min-width: 640px) { width: 100%; }
`

const EmptyCard = styled.div`
  background: ${({ theme }) => theme.colors.surfaceCard};
  border-radius: ${({ theme }) => theme.radii.xl};
  box-shadow: ${({ theme }) => theme.shadows.card};
  padding: 4rem 2rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};

  .material-symbols-outlined {
    font-size: 3rem;
    margin-bottom: 1rem;
    display: block;
    color: ${({ theme }) => theme.colors.outlineVariant};
  }

  h3 {
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 1.1rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.onSurface};
    margin-bottom: 0.5rem;
  }
`

const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
  flex-wrap: wrap;
`

const PageCircle = styled.button`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 700;
  font-family: inherit;
  transition: background 0.15s, color 0.15s;
  background: ${({ $active, theme }) => $active ? theme.colors.primary : theme.colors.surfaceLow};
  color: ${({ $active }) => $active ? '#fff' : 'inherit'};

  &:hover:not(:disabled) {
    background: ${({ $active, theme }) => $active ? theme.colors.primaryDark : theme.colors.primaryFixed};
    color: ${({ $active, theme }) => $active ? '#fff' : theme.colors.primary};
  }

  &:disabled { opacity: 0.4; cursor: default; }

  .material-symbols-outlined { font-size: 1.25rem; }
`

const Ellipsis = styled.span`
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  font-size: 0.875rem;
  padding: 0 0.25rem;
`

/* ── Skeleton ── */

function SearchResultsSkeleton() {
  return (
    <>
      {[1, 2, 3, 4].map(i => (
        <ResultCard key={i} style={{ cursor: 'default' }}>
          <CardThumb>
            <SkeletonBlock $h="100%" $radius="0" />
          </CardThumb>
          <CardBody>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <SkeletonBlock $w="55%" $h="18px" />
                <SkeletonBlock $w="48px" $h="28px" $radius="8px" />
              </div>
              <SkeletonBlock $w="38%" $h="13px" />
              <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                <SkeletonBlock $w="56px" $h="12px" />
                <SkeletonBlock $w="56px" $h="12px" />
                <SkeletonBlock $w="56px" $h="12px" />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
              <SkeletonBlock $w="90px" $h="36px" $radius="999px" />
            </div>
          </CardBody>
        </ResultCard>
      ))}
    </>
  )
}

/* ── Component ── */

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams()

  const [inputValue, setInputValue] = useState(searchParams.get('q') || '')
  const [query, setQuery] = useState(searchParams.get('q') || '')

  const [results, setResults] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)

  const [province, setProvince] = useState('')
  const [universityIds, setUniversityIds] = useState([])
  const [minRating, setMinRating] = useState(1)
  const [amenities, setAmenities] = useState([])
  const [onCampus, setOnCampus] = useState(false)
  const [sort, setSort] = useState('top_rated')

  function toggleUniversity(id) {
    setUniversityIds(prev => prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id])
  }

  function toggleAmenity(a) {
    setAmenities(prev => prev.includes(a) ? prev.filter(v => v !== a) : [...prev, a])
  }

  function clearFilters() {
    setProvince('')
    setUniversityIds([])
    setMinRating(1)
    setAmenities([])
    setOnCampus(false)
    setPage(1)
  }

  const doSearch = useCallback(async (q, pg = 1) => {
    if (!q.trim()) { setResults([]); setTotal(0); return }
    setLoading(true)
    try {
      const data = await searchResidences({
        q,
        province: province || undefined,
        universityIds: universityIds.join(',') || undefined,
        minRating: minRating > 1 ? minRating : undefined,
        amenities: amenities.join(',') || undefined,
        onCampus: onCampus || undefined,
        sort,
        page: pg,
        limit: PER_PAGE,
      })
      setResults(data.residences || data.items || data.results || (Array.isArray(data) ? data : []))
      setTotal(data.total || 0)
    } catch {
      setResults([]); setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [province, universityIds, minRating, amenities, onCampus, sort])

  useEffect(() => {
    const q = searchParams.get('q') || ''
    setQuery(q); setInputValue(q)
  }, []) // eslint-disable-line

  useEffect(() => {
    setPage(1); doSearch(query, 1)
  }, [query, province, universityIds, minRating, amenities, onCampus, sort]) // eslint-disable-line

  function handleSearch(e) {
    e.preventDefault()
    const q = inputValue.trim()
    setQuery(q)
    setSearchParams(q ? { q } : {})
    setPage(1)
  }

  function goToPage(pg) {
    setPage(pg); doSearch(query, pg)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const totalPages = Math.ceil(total / PER_PAGE)
  const hasFilters = province || universityIds.length || minRating > 1 || amenities.length || onCampus

  const SidebarContent = () => (
    <SidebarCard>
      <SidebarHead>
        <h3>Filters</h3>
        {hasFilters ? (
          <button onClick={clearFilters} aria-label="Clear filters">
            <span className="material-symbols-outlined">restart_alt</span>
          </button>
        ) : <span />}
      </SidebarHead>

      <FilterGroup>
        <FilterLabel>Province</FilterLabel>
        <ProvinceSelect value={province} onChange={e => setProvince(e.target.value)}>
          <option value="">All Provinces</option>
          {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
        </ProvinceSelect>
      </FilterGroup>

      <Divider />

      <FilterGroup>
        <FilterLabel>University</FilterLabel>
        {ALL_UNIVERSITIES.map(u => (
          <CheckLabel key={u.id}>
            <input
              type="checkbox"
              checked={universityIds.includes(u.id)}
              onChange={() => toggleUniversity(u.id)}
            />
            {u.abbr}
          </CheckLabel>
        ))}
      </FilterGroup>

      <Divider />

      <FilterGroup>
        <FilterLabel>Min. Rating</FilterLabel>
        <RatingSlider
          type="range"
          min={1}
          max={5}
          step={0.5}
          value={minRating}
          onChange={e => setMinRating(parseFloat(e.target.value))}
        />
        <RatingSliderLabels>
          <span>1★</span>
          <span style={{ color: minRating > 1 ? '#a04500' : undefined }}>
            {minRating > 1 ? `${minRating}★` : ''}
          </span>
          <span>5★</span>
        </RatingSliderLabels>
      </FilterGroup>

      <Divider />

      <FilterGroup>
        <FilterLabel>Amenities</FilterLabel>
        <AmenityGrid>
          {AMENITY_FILTERS.map(a => (
            <AmenityBtn
              key={a}
              type="button"
              $active={amenities.includes(a)}
              onClick={() => toggleAmenity(a)}
            >
              {a}
            </AmenityBtn>
          ))}
        </AmenityGrid>
      </FilterGroup>

      <Divider />

      <ToggleRow>
        <ToggleLabel>On-Campus Only</ToggleLabel>
        <ToggleSwitch
          type="button"
          role="switch"
          aria-checked={onCampus}
          onClick={() => setOnCampus(v => !v)}
          $on={onCampus}
        >
          <ToggleThumb $on={onCampus} />
        </ToggleSwitch>
      </ToggleRow>
    </SidebarCard>
  )

  return (
    <Page>
      <Navbar />

      <SearchBanner>
        <Container>
          <SearchBox onSubmit={handleSearch}>
            <InputWrap>
              <span className="material-symbols-outlined">search</span>
              <SearchInput
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder="Search residences, universities, cities…"
              />
              <TuneBtn
                type="button"
                onClick={() => setSidebarOpen(o => !o)}
                aria-label="Filters"
              >
                <span className="material-symbols-outlined">tune</span>
              </TuneBtn>
            </InputWrap>
            <SortWrap>
              <SortLabel>Sort by:</SortLabel>
              <SortSelect value={sort} onChange={e => setSort(e.target.value)}>
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </SortSelect>
            </SortWrap>
            <SearchBtn type="submit">Search</SearchBtn>
          </SearchBox>
        </Container>
      </SearchBanner>

      <Body>
        <Container>
          <ResultsHeader>
            <ResultsTitle>
              {query
                ? `${total} Residence${total !== 1 ? 's' : ''} Found`
                : 'Search for a residence'}
            </ResultsTitle>
            <MobileSortBtn type="button" onClick={() => setSortOpen(o => !o)}>
              Sort
              <span className="material-symbols-outlined">expand_more</span>
            </MobileSortBtn>
          </ResultsHeader>

          {sortOpen && (
            <MobileSortSelect value={sort} onChange={e => { setSort(e.target.value); setSortOpen(false) }}>
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </MobileSortSelect>
          )}

          <MobileSidebar $open={sidebarOpen}>
            <SidebarContent />
          </MobileSidebar>

          <Layout>
            <Sidebar>
              <SidebarContent />
            </Sidebar>

            <Results>
              {loading && <SearchResultsSkeleton />}

              {!loading && query && results.length === 0 && (
                <EmptyCard>
                  <span className="material-symbols-outlined">search_off</span>
                  <h3>No residences found</h3>
                  <p>Try adjusting your search or clearing filters</p>
                </EmptyCard>
              )}

              {!loading && !query && (
                <EmptyCard>
                  <span className="material-symbols-outlined">search</span>
                  <h3>Start searching</h3>
                  <p>Enter a residence name, university, or city to find results</p>
                </EmptyCard>
              )}

              {!loading && results.map(res => (
                <ResultCard key={res.id}>
                  <CardThumb>
                    {res.imageUrl
                      ? <img src={res.imageUrl} alt={res.name} />
                      : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '3rem' }}>🏠</div>
                    }
                  </CardThumb>

                  <CardBody>
                    <div>
                      <BadgeRow>
                        {res.campusType === 'on_campus'
                          ? <OnCampusBadge>On-Campus</OnCampusBadge>
                          : <OffCampusBadge>Off-Campus</OffCampusBadge>
                        }
                        <CampusName>{res.campus}</CampusName>
                      </BadgeRow>

                      <CardTitle className="card-title">{res.name}</CardTitle>

                      {res.description && <CardDesc>{res.description}</CardDesc>}

                      {res.amenities?.length > 0 && (
                        <AmenityRow>
                          {res.amenities.slice(0, 3).map(a => (
                            <AmenityItem key={a}>
                              <span className="material-symbols-outlined">{getAmenityIcon(a)}</span>
                              <span>{a}</span>
                            </AmenityItem>
                          ))}
                        </AmenityRow>
                      )}
                    </div>
                  </CardBody>

                  <CardSide>
                    <RatingBlock>
                      <RatingNum>
                        {res.avgRating ? Number(res.avgRating).toFixed(1) : '—'}
                        <span className="material-symbols-outlined">star</span>
                      </RatingNum>
                      <ReviewCount>{res.reviewCount || 0} Reviews</ReviewCount>
                    </RatingBlock>
                    <ViewBtn to={`/residence/${res.id}`}>View</ViewBtn>
                  </CardSide>
                </ResultCard>
              ))}

              {!loading && totalPages > 1 && (
                <Pagination>
                  <PageCircle onClick={() => goToPage(page - 1)} disabled={page <= 1}>
                    <span className="material-symbols-outlined">chevron_left</span>
                  </PageCircle>

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                    .reduce((acc, p, idx, arr) => {
                      if (idx > 0 && p - arr[idx - 1] > 1) acc.push('…')
                      acc.push(p)
                      return acc
                    }, [])
                    .map((p, idx) =>
                      p === '…'
                        ? <Ellipsis key={`e-${idx}`}>…</Ellipsis>
                        : <PageCircle key={p} $active={p === page} onClick={() => goToPage(p)}>{p}</PageCircle>
                    )
                  }

                  <PageCircle onClick={() => goToPage(page + 1)} disabled={page >= totalPages}>
                    <span className="material-symbols-outlined">chevron_right</span>
                  </PageCircle>
                </Pagination>
              )}
            </Results>
          </Layout>
        </Container>
      </Body>

      <Footer />
    </Page>
  )
}
