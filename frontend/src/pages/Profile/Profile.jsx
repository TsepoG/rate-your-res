import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import styled from 'styled-components'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import { useAuth } from '../../context/AuthContext'
import { getUserReviews } from '../../services/profile'

/* ─── Layout ─── */

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.surface};
  overflow-x: hidden;
`

/* ─── Hero ─── */

const Hero = styled.section`
  position: relative;
  padding: calc(${({ theme }) => theme.navHeight} + 2.5rem) 1.5rem 3rem;
  text-align: center;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.primary};
`

const HeroBg = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const HeroOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: ${({ theme }) => theme.colors.primary};
  opacity: 0.55;
`

const HeroInner = styled.div`
  position: relative;
  z-index: 1;
`

const Avatar = styled.div`
  width: 88px;
  height: 88px;
  border-radius: 50%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);

  .material-symbols-outlined {
    font-size: 2.5rem;
    color: ${({ theme }) => theme.colors.primary};
    font-variation-settings: 'FILL' 1;
  }
`

const HeroEmail = styled.p`
  color: rgba(255,255,255,0.85);
  font-size: 0.95rem;
  font-weight: 500;
  margin-bottom: 0.75rem;
`

const UniBadge = styled.span`
  display: inline-block;
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.25);
  color: #fff;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  padding: 0.25rem 0.9rem;
  border-radius: ${({ theme }) => theme.radii.full};
  margin-bottom: 1.25rem;
`

const StatChips = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  flex-wrap: wrap;
`

const StatChip = styled.span`
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.2);
  color: rgba(255,255,255,0.9);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  padding: 0.35rem 1rem;
  border-radius: ${({ theme }) => theme.radii.full};
`

/* ─── Content wrapper ─── */

const Content = styled.div`
  flex: 1;
  max-width: 640px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem 1rem calc(2rem + 64px);
  display: flex;
  flex-direction: column;
  gap: 2rem;

  @media (min-width: 768px) {
    padding-bottom: 2rem;
  }
`

/* ─── Section header ─── */

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`

const SectionTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.25rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.onSurface};
  letter-spacing: -0.01em;
`

const CountBadge = styled.span`
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
  min-width: 24px;
  height: 24px;
  border-radius: ${({ theme }) => theme.radii.full};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.5rem;
`

/* ─── Review cards ─── */

const ReviewCard = styled.div`
  background: ${({ theme }) => theme.colors.surfaceCard};
  border-radius: ${({ theme }) => theme.radii.xl};
  box-shadow: ${({ theme }) => theme.shadows.card};
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-bottom: 0.75rem;
`

const ReviewCardTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;
`

const ResidenceName = styled.h3`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.onSurface};
`

const CampusBadge = styled.span`
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  padding: 0.25rem 0.6rem;
  border-radius: ${({ theme }) => theme.radii.full};
  white-space: nowrap;
  flex-shrink: 0;
  background: ${({ $on }) => $on ? 'rgba(5,150,105,0.1)' : '#f1f5f9'};
  color: ${({ $on }) => $on ? '#059669' : '#6b7280'};
`

const ReviewMeta = styled.p`
  font-size: 0.82rem;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};

  .star { color: ${({ theme }) => theme.colors.primary}; }
`

const ReviewTags = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
`

const YearChip = styled.span`
  font-size: 0.72rem;
  font-weight: 700;
  background: ${({ theme }) => theme.colors.surfaceLow};
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  padding: 0.2rem 0.6rem;
  border-radius: ${({ theme }) => theme.radii.full};
`

const RecommendPill = styled.span`
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  padding: 0.2rem 0.7rem;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ $yes }) => $yes ? 'rgba(160,69,0,0.1)' : '#f1f5f9'};
  color: ${({ $yes }) => $yes ? '#a04500' : '#6b7280'};
`

const ReviewQuote = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  font-style: italic;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

const ReviewCardBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.5rem;
  border-top: 1px solid ${({ theme }) => theme.colors.surfaceHigh};
`

const SubmittedDate = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.muted};
`

const ViewLink = styled(Link)`
  font-size: 0.8rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  &:hover { text-decoration: underline; }
`

/* ─── Empty state ─── */

const EmptyState = styled.div`
  text-align: center;
  padding: 2.5rem 1rem;
  background: ${({ theme }) => theme.colors.surfaceCard};
  border-radius: ${({ theme }) => theme.radii.xl};
  box-shadow: ${({ theme }) => theme.shadows.card};

  .material-symbols-outlined {
    font-size: 2.5rem;
    color: ${({ theme }) => theme.colors.outlineVariant};
    display: block;
    margin-bottom: 0.75rem;
  }
`

const EmptyTitle = styled.p`
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.onSurface};
  margin-bottom: 0.4rem;
`

const EmptySub = styled.p`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  margin-bottom: 1.25rem;
`

const WriteBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: ${({ theme }) => theme.colors.accent};
  color: #fff;
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 700;
  font-size: 0.9rem;
  padding: 0.7rem 1.5rem;
  border-radius: ${({ theme }) => theme.radii.full};
  border: none;
  cursor: pointer;
  transition: opacity 0.15s;
  &:hover { opacity: 0.9; }
`

/* ─── Account card ─── */

const AccountCard = styled.div`
  background: ${({ theme }) => theme.colors.surfaceCard};
  border-radius: ${({ theme }) => theme.radii.xl};
  box-shadow: ${({ theme }) => theme.shadows.card};
  overflow: hidden;
`

const AccountRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.surfaceLow};

  &:last-child { border-bottom: none; }
`

const RowIcon = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.primaryFixed};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  .material-symbols-outlined {
    font-size: 1.1rem;
    color: ${({ theme }) => theme.colors.primary};
  }
`

const RowText = styled.div`
  flex: 1;
`

const RowLabel = styled.p`
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.muted};
  margin-bottom: 0.15rem;
`

const RowValue = styled.p`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.onSurface};
`

const ChevronIcon = styled.span`
  color: ${({ theme }) => theme.colors.outlineVariant};
  .material-symbols-outlined { font-size: 1.1rem; }
`

/* ─── Toggle ─── */

const Toggle = styled.button`
  width: 44px;
  height: 24px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  background: ${({ $on, theme }) => $on ? theme.colors.primary : theme.colors.outlineVariant};
  position: relative;
  transition: background 0.2s;
  flex-shrink: 0;

  &::after {
    content: '';
    position: absolute;
    top: 3px;
    left: ${({ $on }) => $on ? '23px' : '3px'};
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #fff;
    transition: left 0.2s;
  }
`

/* ─── Sign out ─── */

const SignOutBtn = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.9rem;
  border-radius: ${({ theme }) => theme.radii.full};
  border: 2px solid #DC2626;
  background: transparent;
  color: #DC2626;
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background 0.15s;

  &:hover { background: rgba(220,38,38,0.05); }
  .material-symbols-outlined { font-size: 1.1rem; }
`

/* ─── Helpers ─── */

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-ZA', { month: 'long', year: 'numeric' })
}

const UNI_NAMES = {
  ukzn: 'University of KwaZulu-Natal',
  wits: 'University of the Witwatersrand',
  uct: 'University of Cape Town',
  up: 'University of Pretoria',
  sun: 'Stellenbosch University',
  uj: 'University of Johannesburg',
  ufs: 'University of the Free State',
  dut: 'Durban University of Technology',
  tut: 'Tshwane University of Technology',
  mut: 'Mangosuthu University of Technology',
  cput: 'Cape Peninsula University of Technology',
  cut: 'Central University of Technology',
}

/* ─── Component ─── */

export default function Profile() {
  const { user, logout, isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()
  const [reviews, setReviews] = useState([])
  const [notificationsOn, setNotificationsOn] = useState(true)

  useEffect(() => {
    if (!loading && !isAuthenticated) navigate('/signin')
  }, [loading, isAuthenticated])

  useEffect(() => {
    if (!isAuthenticated) return
    getUserReviews()
      .then(data => setReviews(Array.isArray(data) ? data : (data.reviews || data.items || [])))
      .catch(() => setReviews([]))
  }, [isAuthenticated])

  function handleSignOut() {
    logout()
    navigate('/')
  }

  if (loading) return null

  const email = user?.email || ''
  const uniId = user?.universityId || ''
  const uniAbbr = uniId.toUpperCase()
  const uniName = UNI_NAMES[uniId] || uniId
  const memberYear = user ? new Date().getFullYear() : ''

  return (
    <Page>
      <Navbar />

      {/* ── Hero ── */}
      <Hero>
        <HeroBg
          src="https://images.unsplash.com/photo-1562774053-701939374585?w=1200&q=80"
          alt=""
          aria-hidden="true"
        />
        <HeroOverlay />
        <HeroInner>
          <Avatar>
            <span className="material-symbols-outlined">person</span>
          </Avatar>
          <HeroEmail>{email}</HeroEmail>
          {uniAbbr && <UniBadge>{uniAbbr}</UniBadge>}
          <StatChips>
            <StatChip>{reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}</StatChip>
            <StatChip>Member since {memberYear}</StatChip>
          </StatChips>
        </HeroInner>
      </Hero>

      <Content>

        {/* ── Account ── */}
        <div>
          <SectionHeader>
            <SectionTitle>Account</SectionTitle>
          </SectionHeader>

          <AccountCard>
            <AccountRow>
              <RowIcon><span className="material-symbols-outlined">person</span></RowIcon>
              <RowText>
                <RowLabel>Email Address</RowLabel>
                <RowValue>{email}</RowValue>
              </RowText>
            </AccountRow>

            <AccountRow>
              <RowIcon><span className="material-symbols-outlined">school</span></RowIcon>
              <RowText>
                <RowLabel>University</RowLabel>
                <RowValue>{uniName || '—'}</RowValue>
              </RowText>
            </AccountRow>

            <AccountRow style={{ cursor: 'pointer' }}>
              <RowIcon><span className="material-symbols-outlined">lock</span></RowIcon>
              <RowText>
                <RowLabel>Security</RowLabel>
                <RowValue>Change Password</RowValue>
              </RowText>
              <ChevronIcon><span className="material-symbols-outlined">chevron_right</span></ChevronIcon>
            </AccountRow>

            <AccountRow>
              <RowIcon><span className="material-symbols-outlined">notifications</span></RowIcon>
              <RowText>
                <RowLabel>Notifications</RowLabel>
                <RowValue>{notificationsOn ? 'Enabled' : 'Disabled'}</RowValue>
              </RowText>
              <Toggle $on={notificationsOn} onClick={() => setNotificationsOn(p => !p)} aria-label="Toggle notifications" />
            </AccountRow>
          </AccountCard>
        </div>

        {/* ── Sign Out ── */}
        <SignOutBtn onClick={handleSignOut}>
          <span className="material-symbols-outlined">logout</span>
          Sign Out
        </SignOutBtn>

        {/* ── My Reviews ── */}
        <div>
          <SectionHeader>
            <SectionTitle>My Reviews</SectionTitle>
            {reviews.length > 0 && <CountBadge>{reviews.length}</CountBadge>}
          </SectionHeader>

          {reviews.length === 0 ? (
            <EmptyState>
              <span className="material-symbols-outlined">rate_review</span>
              <EmptyTitle>No reviews yet</EmptyTitle>
              <EmptySub>Share your experience to help other students choose wisely.</EmptySub>
              <WriteBtn onClick={() => navigate('/review')}>
                Write Your First Review
              </WriteBtn>
            </EmptyState>
          ) : (
            reviews.map(r => {
              const isOnCampus = r.campusType === 'on_campus' || r.onCampus
              const recommended = r.wouldRecommend === true || r.recommended === true
              return (
                <ReviewCard key={r.reviewId || r.id}>
                  <ReviewCardTop>
                    <ResidenceName>{r.residenceName || r.residence?.name || 'Residence'}</ResidenceName>
                    <CampusBadge $on={isOnCampus}>
                      {isOnCampus ? 'On Campus' : 'Off Campus'}
                    </CampusBadge>
                  </ReviewCardTop>

                  <ReviewMeta>
                    <span className="star">★</span> {r.avgRating || r.roomQuality || '—'}
                    {r.universityAbbr && <> · {r.universityAbbr}</>}
                    {r.campus && <> · {r.campus}</>}
                  </ReviewMeta>

                  <ReviewTags>
                    {r.yearLived && <YearChip>{r.yearLived}</YearChip>}
                    <RecommendPill $yes={recommended}>
                      {recommended ? 'Recommended ✓' : 'Not Recommended'}
                    </RecommendPill>
                  </ReviewTags>

                  {r.comment && <ReviewQuote>"{r.comment}"</ReviewQuote>}

                  <ReviewCardBottom>
                    <SubmittedDate>Submitted {formatDate(r.createdAt)}</SubmittedDate>
                    {r.residenceId && (
                      <ViewLink to={`/residence/${r.residenceId}`}>View</ViewLink>
                    )}
                  </ReviewCardBottom>
                </ReviewCard>
              )
            })
          )}
        </div>

      </Content>

      <Footer />
    </Page>
  )
}
