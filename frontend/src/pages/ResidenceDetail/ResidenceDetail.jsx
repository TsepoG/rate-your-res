import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import { getResidence } from '../../services/residences'
import { getReviews } from '../../services/reviews'
import { useAuth } from '../../context/AuthContext'
import { EmptyState, BtnLinkPrimary } from '../../styles/shared'
import { SkeletonBlock } from '../../components/ui/Skeleton'

/* ─── Data ─── */

const STANDARD_AMENITIES = [
  { label: 'WiFi',       icon: 'wifi',                   matches: ['wifi', 'wi-fi', 'free wifi'] },
  { label: 'Elevator',   icon: 'elevator',               matches: ['elevator'] },
  { label: 'Laundry',    icon: 'local_laundry_service',  matches: ['laundry'] },
  { label: 'Study Room', icon: 'auto_stories',           matches: ['study room', 'study rooms'] },
  { label: 'Dining Hall',icon: 'restaurant',             matches: ['dining hall', 'dining', 'tuckshop'] },
  { label: 'Parking',    icon: 'local_parking',          matches: ['parking'] },
  { label: 'Bus',        icon: 'directions_bus',         matches: ['shuttle', 'bus'] },
  { label: 'Security',   icon: 'security',               matches: ['security', '24/7 security'] },
  { label: 'Gym',        icon: 'fitness_center',         matches: ['gym'] },
  { label: 'Pool',       icon: 'pool',                   matches: ['pool'] },
  { label: 'Air Con',    icon: 'ac_unit',                matches: ['air conditioning', 'air-con', 'aircon', 'air con'] },
  { label: 'TV Lounge',  icon: 'tv',                     matches: ['tv lounge'] },
]

const ROOM_TYPE_CONFIG = {
  Single:    { icon: 'person',      note: 'Shared Bathroom' },
  Double:    { icon: 'group',       note: 'Shared Bathroom' },
  Triple:    { icon: 'groups',      note: 'Communal Bathroom' },
  Quad:      { icon: 'diversity_3', note: 'Communal Bathroom' },
  'En-suite':{ icon: 'bathroom',    note: 'Private Bathroom' },
}

/* ─── Styled Components ─── */

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-top: ${({ theme }) => theme.navHeight};
  background: ${({ theme }) => theme.colors.surface};
  overflow-x: hidden;
`

const Main = styled.main`
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding-bottom: 8rem;
`

const BackBar = styled.div`
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 1rem 1.5rem 0;
`

const BackBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: none;
  border: none;
  cursor: pointer;
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 600;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  padding: 0.4rem 0;
  transition: color 0.15s;

  &:hover { color: ${({ theme }) => theme.colors.primary}; }
  .material-symbols-outlined { font-size: 1.1rem; }
`

/* Gallery */
const GallerySection = styled.section`
  margin-top: 16px;
  padding: 0 16px;
  @media (min-width: 768px) { padding: 0 24px; }
`

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  height: 300px;
  border-radius: 24px;
  overflow: hidden;

  @media (min-width: 768px) {
    grid-template-columns: 2fr 1fr;
    height: 500px;
  }
`

const MainImgWrap = styled.div`
  position: relative;
  overflow: hidden;
`

const GalleryImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.7s;

  ${MainImgWrap}:hover & { transform: scale(1.05); }
`

const GalleryPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primaryDark}, ${({ theme }) => theme.colors.primaryDeeper});
`

const SideImages = styled.div`
  display: none;
  grid-template-rows: 1fr 1fr;
  gap: 12px;
  @media (min-width: 768px) { display: grid; }
`

const SideImgWrap = styled.div`
  position: relative;
  overflow: hidden;
`

const SideImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.7s;
  ${SideImgWrap}:hover & { transform: scale(1.05); }
`

const ViewPhotosBtn = styled.button`
  position: absolute;
  bottom: 16px;
  right: 16px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  padding: 8px 24px;
  border-radius: ${({ theme }) => theme.radii.full};
  font-weight: 700;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  transition: background 0.15s;
  &:hover { background: #fff; }
  .material-symbols-outlined { font-size: 1.1rem; }
`

/* Info section — 2-col at lg */
const InfoSection = styled.section`
  margin-top: 48px;
  padding: 0 16px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 48px;
  @media (min-width: 768px) { padding: 0 24px; }
  @media (min-width: 1024px) { grid-template-columns: 2fr 1fr; }
`

const InfoLeft = styled.div`
  min-width: 0;
`

const BadgeRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`

const OnCampusBadge = styled.span`
  padding: 4px 12px;
  background: ${({ $on }) => $on ? '#dcfce7' : '#f1f5f9'};
  color: ${({ $on }) => $on ? '#15803d' : '#475569'};
  font-size: 0.7rem;
  font-weight: 700;
  border-radius: ${({ theme }) => theme.radii.full};
  letter-spacing: 0.08em;
  text-transform: uppercase;
`

const LocationPill = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  background: #f2f4f6;
  padding: 4px 12px;
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: 0.875rem;
  color: #464555;
  .material-symbols-outlined { font-size: 1.1rem; }
`

const ResTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(2.25rem, 7vw, 3rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  color: ${({ theme }) => theme.colors.onSurface};
  line-height: 1.1;
  margin-bottom: 8px;
`

const UniLine = styled(Link)`
  display: inline-block;
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  margin-bottom: 24px;
  &:hover { text-decoration: underline; }
`

const UniLineSpan = styled.p`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 24px;
`

const Description = styled.p`
  color: #464555;
  line-height: 1.7;
  font-size: 1.0625rem;
  max-width: 680px;
`

/* Amenities */
const SubSection = styled.div`
  margin-top: ${({ $mt }) => $mt || '48px'};
`

const SubHeading = styled.h3`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.onSurface};
  margin-bottom: 24px;
`

const AmenitiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  width: 100%;
  @media (min-width: 640px) { grid-template-columns: repeat(3, 1fr); }
  @media (min-width: 768px) { grid-template-columns: repeat(4, 1fr); }
`

const AmenityChip = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f2f4f6;
  border-radius: 16px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  transition: background 0.2s;
  opacity: ${({ $available }) => $available ? 1 : 0.45};
  &:hover { background: #fff; }
  .material-symbols-outlined {
    font-size: 1.25rem;
    color: ${({ $available, theme }) => $available ? theme.colors.primary : '#777587'};
  }
`

const AmenityLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.onSurface};
  text-decoration: ${({ $available }) => $available ? 'none' : 'line-through'};
`

/* Room Types */
const RoomTypesScroll = styled.div`
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding-bottom: 16px;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
`

const RoomCard = styled.div`
  min-width: 200px;
  flex-shrink: 0;
  background: #fff;
  padding: 24px;
  border-radius: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.2s;
  &:hover { box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1); }
  .material-symbols-outlined {
    font-size: 2rem;
    color: ${({ theme }) => theme.colors.primary};
    display: block;
    margin-bottom: 16px;
  }
`

const RoomName = styled.h4`
  font-weight: 700;
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.onSurface};
`

const RoomNote = styled.p`
  font-size: 0.75rem;
  color: #464555;
  margin-top: 4px;
`

/* Right sticky rating card */
const InfoRight = styled.div`
  @media (min-width: 1024px) {
    position: sticky;
    top: calc(${({ theme }) => theme.navHeight} + 28px);
    align-self: start;
  }
`

const RatingCard = styled.div`
  background: #fff;
  border-radius: 40px;
  padding: 32px;
  box-shadow: 0 20px 40px rgba(25, 28, 30, 0.06);
`

const ScoreNum = styled.div`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 3.75rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.onSurface};
  line-height: 1;
`

const StarsRow = styled.div`
  display: flex;
  margin-top: 8px;
  color: #f97316;
  .material-symbols-outlined { font-size: 1.5rem; }
`

const TotalReviews = styled.p`
  font-size: 0.875rem;
  color: #464555;
  font-weight: 500;
  margin-top: 4px;
  margin-bottom: 32px;
`

const SubRatingsBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 32px;
`

const SubRatingHeader = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 4px;
  color: #464555;
  span:last-child { color: ${({ theme }) => theme.colors.onSurface}; }
`

const ProgressTrack = styled.div`
  height: 8px;
  width: 100%;
  background: #eceef0;
  border-radius: ${({ theme }) => theme.radii.full};
  overflow: hidden;
`

const ProgressFill = styled.div`
  height: 100%;
  background: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radii.full};
  width: ${({ $pct }) => $pct}%;
  transition: width 0.4s ease;
`

const WriteReviewBtn = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  background: ${({ theme }) => theme.colors.tertiaryBadge};
  color: ${({ theme }) => theme.colors.accentLight};
  border: none;
  border-radius: ${({ theme }) => theme.radii.full};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
  .material-symbols-outlined {
    font-size: 1.2rem;
    transition: transform 0.2s;
  }
  &:hover {
    background: #341100;
    .material-symbols-outlined { transform: rotate(12deg); }
  }
`

/* Reviews */
const ReviewsSection = styled.section`
  margin-top: 80px;
  padding: 0 16px;
  @media (min-width: 768px) { padding: 0 24px; }
`

const ReviewsHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 40px;
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
  }
`

const ReviewsTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.875rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.onSurface};
  margin-bottom: 8px;
`

const ReviewsSubtitle = styled.p`
  color: #464555;
  font-size: 0.9375rem;
`

const SortControls = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`

const SortChip = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #e6e8ea;
  padding: 8px 16px;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.onSurface};
  border: none;
  cursor: pointer;
  transition: background 0.15s;
  &:hover { background: #d8dadc; }
  .material-symbols-outlined { font-size: 1rem; }
`

const ReviewsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

const ReviewCardEl = styled.div`
  background: #fff;
  padding: 32px;
  border-radius: 32px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  transition: box-shadow 0.2s;
  &:hover { box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08); }
`

const ReviewTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24px;
`

const ReviewerLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`

const ReviewAvatar = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.primaryFixed};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  .material-symbols-outlined {
    font-size: 2rem;
    color: ${({ theme }) => theme.colors.primary};
    font-variation-settings: 'FILL' 1;
  }
`

const ReviewerDetails = styled.div``

const ReviewerName = styled.h4`
  font-weight: 700;
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.onSurface};
  margin-bottom: 4px;
`

const ReviewerMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`

const UniBadge = styled.span`
  padding: 2px 8px;
  background: #eef2ff;
  color: #3730a3;
  font-size: 0.625rem;
  font-weight: 700;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
`

const MetaText = styled.span`
  font-size: 0.75rem;
  color: #464555;
  font-weight: 500;
`

const ReviewRight = styled.div`
  text-align: right;
  flex-shrink: 0;
`

const ReviewStars = styled.div`
  display: flex;
  justify-content: flex-end;
  color: #f97316;
  margin-bottom: 4px;
  .material-symbols-outlined { font-size: 1.25rem; }
`

const ReviewDate = styled.p`
  font-size: 0.625rem;
  color: #464555;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`

const ReviewComment = styled.p`
  color: ${({ theme }) => theme.colors.onSurface};
  line-height: 1.65;
  font-style: italic;
  margin-bottom: 24px;
  font-size: 0.9375rem;
`

const ReviewBottom = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`

const HashtagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`

const HashtagChip = styled.span`
  padding: 4px 12px;
  background: #eceef0;
  color: #464555;
  font-size: 0.75rem;
  font-weight: 700;
  border-radius: ${({ theme }) => theme.radii.full};
`

const RecommendRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
`

const RecommendLabel = styled.span`color: #464555;`

const RecommendYes = styled.span`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  gap: 4px;
  .material-symbols-outlined { font-size: 1rem; }
`

const RecommendNo = styled.span`
  font-weight: 700;
  color: #dc2626;
  display: flex;
  align-items: center;
  gap: 4px;
  .material-symbols-outlined { font-size: 1rem; }
`

const LoadMoreBtn = styled.button`
  width: 100%;
  margin-top: 48px;
  padding: 16px;
  background: transparent;
  border: 2px dashed #c7c4d8;
  border-radius: 24px;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 1rem;
  font-weight: 700;
  color: #777587;
  cursor: pointer;
  transition: background 0.15s;
  &:hover { background: #f2f4f6; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`

/* ─── Helpers ─── */

function renderStars(rating) {
  const full = Math.floor(rating || 0)
  const hasHalf = (rating || 0) - full >= 0.5
  return (
    <>
      {[1, 2, 3, 4, 5].map(i => {
        if (i <= full)
          return <span key={i} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
        if (i === full + 1 && hasHalf)
          return <span key={i} className="material-symbols-outlined">star_half</span>
        return <span key={i} className="material-symbols-outlined">star</span>
      })}
    </>
  )
}

function formatMonth(dateString) {
  if (!dateString) return ''
  try {
    return new Date(dateString).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long' }).toUpperCase()
  } catch { return '' }
}

function isAvailable(amenityMatches, residenceAmenities) {
  const lower = residenceAmenities.map(a => a.toLowerCase())
  return amenityMatches.some(m => lower.includes(m))
}

function SubRatingBar({ label, value }) {
  const pct = Math.min(100, Math.max(0, ((value || 0) / 5) * 100))
  return (
    <div>
      <SubRatingHeader>
        <span>{label}</span>
        <span>{(value || 0).toFixed(1)}</span>
      </SubRatingHeader>
      <ProgressTrack>
        <ProgressFill $pct={pct} />
      </ProgressTrack>
    </div>
  )
}

/* ─── Review Card ─── */
function ReviewCard({ review, uniAbbr }) {
  const overall = review.rating || review.overallRating || review.overall_rating || 0
  const recommend = review.recommend != null ? review.recommend : review.wouldRecommend
  const comment = review.comment || review.text || review.body || ''
  const date = review.createdAt || review.created_at || review.date || ''
  const year = review.year || review.academicYear || ''
  const roomType = review.roomType || review.room_type || ''
  const tags = review.tags || review.hashtags || (review.category ? [review.category] : [])

  const metaParts = [year, roomType].filter(Boolean).join(' • ')

  return (
    <ReviewCardEl>
      <ReviewTop>
        <ReviewerLeft>
          <ReviewAvatar>
            <span className="material-symbols-outlined">person</span>
          </ReviewAvatar>
          <ReviewerDetails>
            <ReviewerName>Anonymous Student</ReviewerName>
            <ReviewerMeta>
              {uniAbbr && <UniBadge>{uniAbbr}</UniBadge>}
              {metaParts && <MetaText>{metaParts}</MetaText>}
            </ReviewerMeta>
          </ReviewerDetails>
        </ReviewerLeft>
        <ReviewRight>
          <ReviewStars>{renderStars(overall)}</ReviewStars>
          {date && <ReviewDate>{formatMonth(date)}</ReviewDate>}
        </ReviewRight>
      </ReviewTop>

      {comment && <ReviewComment>"{comment}"</ReviewComment>}

      <ReviewBottom>
        {tags.length > 0 && (
          <HashtagRow>
            {tags.map((tag, i) => (
              <HashtagChip key={i}>#{tag}</HashtagChip>
            ))}
          </HashtagRow>
        )}
        {recommend != null && (
          <RecommendRow>
            <RecommendLabel>Recommend:</RecommendLabel>
            {recommend
              ? <RecommendYes><span className="material-symbols-outlined">thumb_up</span>Yes</RecommendYes>
              : <RecommendNo><span className="material-symbols-outlined">thumb_down</span>No</RecommendNo>
            }
          </RecommendRow>
        )}
      </ReviewBottom>
    </ReviewCardEl>
  )
}

/* ─── Skeleton ─── */

function ResidenceDetailSkeleton() {
  return (
    <Page>
      <Navbar />

      <Main>
        {/* Back button placeholder */}
        <BackBar>
          <SkeletonBlock $w="80px" $h="14px" $radius="6px" />
        </BackBar>

        {/* Gallery skeleton — large block + two side panels on desktop */}
        <GallerySection>
          <GalleryGrid>
            <SkeletonBlock $h="100%" $radius="0" />
            <SideImages>
              <SkeletonBlock $h="100%" $radius="0" />
              <SkeletonBlock $h="100%" $radius="0" />
            </SideImages>
          </GalleryGrid>
        </GallerySection>

        {/* Info section skeleton — left content + right rating card */}
        <InfoSection>
          <InfoLeft>
            {/* Badges row */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              <SkeletonBlock $w="80px" $h="22px" $radius="999px" />
              <SkeletonBlock $w="120px" $h="22px" $radius="999px" />
            </div>
            {/* Title */}
            <SkeletonBlock $w="70%" $h="36px" style={{ marginBottom: 8 }} />
            <SkeletonBlock $w="45%" $h="18px" style={{ marginBottom: 32 }} />
            {/* Description lines */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <SkeletonBlock $w="100%" $h="14px" />
              <SkeletonBlock $w="95%" $h="14px" />
              <SkeletonBlock $w="80%" $h="14px" />
            </div>
            {/* Amenities block */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 40 }}>
              {[1,2,3,4,5,6].map(i => (
                <SkeletonBlock key={i} $w="100px" $h="36px" $radius="8px" />
              ))}
            </div>
          </InfoLeft>

          {/* Right: rating card — minWidth:0 prevents grid column overflow */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
            <SkeletonBlock $w="80px" $h="48px" style={{ marginBottom: 4 }} />
            {[1,2,3,4].map(i => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <SkeletonBlock $w="90px" $h="12px" style={{ flexShrink: 0 }} />
                <SkeletonBlock $w="auto" $h="8px" $radius="999px" style={{ flex: 1, minWidth: 0 }} />
                <SkeletonBlock $w="28px" $h="12px" style={{ flexShrink: 0 }} />
              </div>
            ))}
            <SkeletonBlock $h="48px" $radius="12px" style={{ marginTop: 16 }} />
          </div>
        </InfoSection>
      </Main>

      <Footer />
    </Page>
  )
}

/* ─── Page ─── */
export default function ResidenceDetail() {
  const { residenceId } = useParams()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [residence, setResidence] = useState(null)
  const [reviews, setReviews] = useState([])
  const [nextKey, setNextKey] = useState(null)
  const [loadingPage, setLoadingPage] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(null)
  const [reviewSort, setReviewSort] = useState('recent')

  useEffect(() => {
    let cancelled = false
    async function fetchData() {
      setLoadingPage(true)
      setError(null)
      try {
        const [resData, reviewData] = await Promise.all([
          getResidence(residenceId),
          getReviews(residenceId, { sort: 'recent', limit: 10 }),
        ])
        if (!cancelled) {
          setResidence(resData)
          setReviews(reviewData.items || reviewData.reviews || reviewData || [])
          setNextKey(reviewData.nextKey || reviewData.next_key || null)
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load residence data.')
      } finally {
        if (!cancelled) setLoadingPage(false)
      }
    }
    fetchData()
    return () => { cancelled = true }
  }, [residenceId])

  useEffect(() => {
    if (!residence) return
    let cancelled = false
    async function fetchReviews() {
      try {
        const data = await getReviews(residenceId, { sort: reviewSort, limit: 10 })
        if (!cancelled) {
          setReviews(data.items || data.reviews || data || [])
          setNextKey(data.nextKey || data.next_key || null)
        }
      } catch { /* silently fail */ }
    }
    fetchReviews()
    return () => { cancelled = true }
  }, [reviewSort, residenceId, residence])

  async function handleLoadMore() {
    if (!nextKey) return
    setLoadingMore(true)
    try {
      const data = await getReviews(residenceId, { sort: reviewSort, limit: 10, nextKey })
      setReviews(prev => [...prev, ...(data.items || data.reviews || data || [])])
      setNextKey(data.nextKey || data.next_key || null)
    } catch { /* silently fail */ }
    finally { setLoadingMore(false) }
  }

  if (loadingPage) return <ResidenceDetailSkeleton />

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

  if (!residence) return null

  /* Normalise data */
  const uniObj = typeof residence.university === 'object' ? residence.university : null
  const universityName = residence.universityName || residence.university_name || uniObj?.name || ''
  const universityAbbr = residence.universityAbbr || residence.university_abbr || uniObj?.abbreviation || ''
  const universityId = residence.universityId || residence.university_id || uniObj?.id || ''
  const campus = residence.campus || ''
  const city = residence.city || uniObj?.city || ''
  const description = residence.description || ''
  const isOnCampus = residence.campusType === 'on_campus' || residence.on_campus
  const amenities = residence.amenities || []
  const roomTypes = residence.roomTypes || residence.room_types || []
  const avgRating = residence.avgRating || residence.avg_rating || 0
  const reviewCount = residence.reviewCount || residence.review_count || reviews.length
  const ratings = residence.ratings || residence.subRatings || residence.sub_ratings || {}
  const imgSrc = residence.imageUrl || residence.image_url || residence.coverImage || null

  const uniLabel = [universityAbbr || universityName, campus].filter(Boolean).join(' · ')
  const locationLabel = [city, 'South Africa'].filter(Boolean).join(', ')
  const remaining = nextKey ? Math.max(0, reviewCount - reviews.length) : 0

  return (
    <Page>
      <Navbar />
      <BackBar>
        <BackBtn onClick={() => navigate(-1)}>
          <span className="material-symbols-outlined">arrow_back</span>
          Back
        </BackBtn>
      </BackBar>
      <Main>

        {/* ── Image Gallery ── */}
        <GallerySection>
          <GalleryGrid>
            <MainImgWrap>
              {imgSrc
                ? <GalleryImg src={imgSrc} alt={residence.name} />
                : <GalleryPlaceholder />
              }
            </MainImgWrap>
            <SideImages>
              <SideImgWrap>
                {imgSrc ? <SideImg src={imgSrc} alt={residence.name} /> : <GalleryPlaceholder />}
              </SideImgWrap>
              <SideImgWrap>
                {imgSrc ? <SideImg src={imgSrc} alt={residence.name} /> : <GalleryPlaceholder />}
                <ViewPhotosBtn>
                  <span className="material-symbols-outlined">photo_library</span>
                  View all photos
                </ViewPhotosBtn>
              </SideImgWrap>
            </SideImages>
          </GalleryGrid>
        </GallerySection>

        {/* ── Info + Rating card ── */}
        <InfoSection>
          <InfoLeft>
            <BadgeRow>
              <OnCampusBadge $on={isOnCampus}>
                {isOnCampus ? 'On Campus' : 'Off Campus'}
              </OnCampusBadge>
              {locationLabel && (
                <LocationPill>
                  <span className="material-symbols-outlined">location_on</span>
                  {locationLabel}
                </LocationPill>
              )}
            </BadgeRow>

            <ResTitle>{residence.name}</ResTitle>

            {uniLabel && (
              universityId
                ? <UniLine to={`/university/${universityId}`}>{uniLabel}</UniLine>
                : <UniLineSpan>{uniLabel}</UniLineSpan>
            )}

            {description && <Description>{description}</Description>}

            {/* Amenities */}
            <SubSection $mt="48px">
              <SubHeading>Amenities</SubHeading>
              <AmenitiesGrid>
                {STANDARD_AMENITIES.map(a => {
                  const available = isAvailable(a.matches, amenities)
                  return (
                    <AmenityChip key={a.label} $available={available}>
                      <span className="material-symbols-outlined">{a.icon}</span>
                      <AmenityLabel $available={available}>{a.label}</AmenityLabel>
                    </AmenityChip>
                  )
                })}
              </AmenitiesGrid>
            </SubSection>

            {/* Room Types */}
            {roomTypes.length > 0 && (
              <SubSection $mt="64px">
                <SubHeading>Room Types</SubHeading>
                <RoomTypesScroll>
                  {roomTypes.map(type => {
                    const config = ROOM_TYPE_CONFIG[type] || { icon: 'bed', note: '' }
                    return (
                      <RoomCard key={type}>
                        <span className="material-symbols-outlined">{config.icon}</span>
                        <RoomName>{type} Room</RoomName>
                        <RoomNote>{config.note}</RoomNote>
                      </RoomCard>
                    )
                  })}
                </RoomTypesScroll>
              </SubSection>
            )}
          </InfoLeft>

          {/* ── Sticky Rating Card ── */}
          <InfoRight>
            <RatingCard>
              <ScoreNum>{avgRating.toFixed(1)}</ScoreNum>
              <StarsRow>{renderStars(avgRating)}</StarsRow>
              <TotalReviews>{reviewCount.toLocaleString()} Total Reviews</TotalReviews>

              <SubRatingsBlock>
                <SubRatingBar label="Room Quality"     value={ratings.room || ratings.roomQuality || ratings.room_quality} />
                <SubRatingBar label="Building & Safety" value={ratings.safety || ratings.building || ratings.buildingSafety || ratings.building_safety} />
                <SubRatingBar label="Bathroom"         value={ratings.bathroom} />
                <SubRatingBar label="Location"         value={ratings.location} />
              </SubRatingsBlock>

              <WriteReviewBtn onClick={() => navigate(`/review?residence=${residenceId}`)}>
                <span className="material-symbols-outlined">rate_review</span>
                Write a Review
              </WriteReviewBtn>
            </RatingCard>
          </InfoRight>
        </InfoSection>

        {/* ── Student Reviews ── */}
        <ReviewsSection>
          <ReviewsHeader>
            <div>
              <ReviewsTitle>Student Reviews</ReviewsTitle>
              {universityName && (
                <ReviewsSubtitle>What {universityName} students are saying about their stay.</ReviewsSubtitle>
              )}
            </div>
            <SortControls>
              <SortChip onClick={() => setReviewSort('recent')}>
                <span className="material-symbols-outlined">sort</span>
                Most Recent
              </SortChip>
              <SortChip onClick={() => setReviewSort('top_rated')}>
                <span className="material-symbols-outlined">filter_list</span>
                Filter
              </SortChip>
            </SortControls>
          </ReviewsHeader>

          {reviews.length === 0 ? (
            <EmptyState><p>No reviews yet. Be the first!</p></EmptyState>
          ) : (
            <ReviewsList>
              {reviews.map((review, i) => (
                <ReviewCard
                  key={review.id || review.reviewId || i}
                  review={review}
                  uniAbbr={universityAbbr}
                />
              ))}
            </ReviewsList>
          )}

          {nextKey && (
            <LoadMoreBtn onClick={handleLoadMore} disabled={loadingMore}>
              {loadingMore
                ? 'Loading...'
                : `Load More Reviews${remaining > 0 ? ` (${remaining} remaining)` : ''}`
              }
            </LoadMoreBtn>
          )}
        </ReviewsSection>

      </Main>
      <Footer />
    </Page>
  )
}
