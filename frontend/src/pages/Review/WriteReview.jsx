import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import styled from 'styled-components'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import { getUniversities, getUniversityResidences } from '../../services/universities'
import { createReview } from '../../services/reviews'
import { useAuth } from '../../context/AuthContext'
import { Container, BtnAccent, BtnOutline, BtnLinkPrimary } from '../../styles/shared'

const AMENITIES = [
  { key: 'wifi', label: 'WiFi', icon: '📶' },
  { key: 'elevator', label: 'Elevator', icon: '🛗' },
  { key: 'laundry', label: 'Laundry', icon: '🧺' },
  { key: 'studyRoom', label: 'Study Room', icon: '📚' },
  { key: 'diningHall', label: 'Dining Hall', icon: '🍽️' },
  { key: 'tuckshop', label: 'Tuckshop', icon: '🛒' },
  { key: 'tvLounge', label: 'TV Lounge', icon: '📺' },
  { key: 'gym', label: 'Gym', icon: '🏋️' },
  { key: 'computerRoom', label: 'Computer Room', icon: '💻' },
  { key: 'airConditioning', label: 'Air Conditioning', icon: '❄️' },
  { key: 'parking', label: 'Parking', icon: '🚗' },
  { key: 'shuttle', label: 'Shuttle', icon: '🚌' },
]

const YEARS = Array.from({ length: 11 }, (_, i) => 2025 - i)
const STEPS = ['Residence', 'Ratings', 'Amenities', 'Done']

/* ── Styled Components ── */

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.surface};
  overflow-x: hidden;
`

const Hero = styled.div`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primaryDark}, ${({ theme }) => theme.colors.primary});
  padding: 3rem 0 4rem;
  color: #fff;
`

const HeroTitle = styled.h1`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-bottom: 0.35rem;
`

const HeroSub = styled.p`
  opacity: 0.8;
  font-size: 1rem;
  margin-bottom: 2rem;
`

const StepIndicator = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    gap: 0.5rem;
  }
`

const StepPill = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: ${({ $active, $done }) =>
    ($active || $done) ? '0.45rem 1.1rem' : '0.45rem 1.1rem'};
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ $active, $done }) =>
    $active ? 'rgba(255,255,255,0.28)' :
    $done ? 'rgba(255,255,255,0.22)' :
    'rgba(255,255,255,0.15)'};
  color: ${({ $active, $done }) =>
    $active ? '#fff' :
    $done ? 'rgba(255,255,255,0.9)' :
    'rgba(255,255,255,0.65)'};
  font-size: ${({ theme: _ }) => '0.85rem'};
  font-weight: 600;
  box-shadow: ${({ $active }) => $active ? '0 0 0 2px rgba(255,255,255,0.5)' : 'none'};
  transition: background 0.2s, color 0.2s;

  @media (max-width: 640px) {
    font-size: 0.78rem;
    padding: 0.35rem 0.85rem;
  }
`

const StepNum = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.4rem;
  height: 1.4rem;
  border-radius: 50%;
  background: ${({ $active, $done }) =>
    $active ? '#fff' :
    $done ? 'rgba(255,255,255,0.3)' :
    'rgba(255,255,255,0.2)'};
  color: ${({ $active, theme }) => $active ? theme.colors.primary : 'inherit'};
  font-size: 0.75rem;
`

const Body = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 0 1rem 4rem;
  margin-top: -2rem;
`

const CardEl = styled.div`
  background: ${({ theme }) => theme.colors.surfaceCard};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.float};
  width: 100%;
  max-width: 680px;
  overflow: hidden;
`

const StepContent = styled.div`
  padding: 2.5rem 2.5rem 2rem;
  text-align: ${({ $center }) => $center ? 'center' : 'left'};

  @media (max-width: 640px) {
    padding: 1.75rem 1.25rem 1.5rem;
  }
`

const StepTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.onSurface};
  margin-bottom: 0.25rem;
`

const StepSub = styled.p`
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  font-size: 0.9rem;
  margin-bottom: 2rem;
`

const Field = styled.div`
  margin-bottom: 1.5rem;
`

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.onSurface};
  margin-bottom: 0.5rem;
`

const Optional = styled.span`
  font-weight: 400;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
`

const SELECT_ARROW = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236b7280' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E\")"

const Select = styled.select`
  width: 100%;
  padding: 0.7rem 1rem;
  border: 1.5px solid #e2e4e9;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surfaceCard};
  color: ${({ theme }) => theme.colors.onSurface};
  font-size: 0.9rem;
  appearance: none;
  background-image: ${SELECT_ARROW};
  background-repeat: no-repeat;
  background-position: right 1rem center;
  cursor: pointer;
  transition: border-color 0.15s;
  font-family: inherit;

  &:focus { outline: none; border-color: ${({ theme }) => theme.colors.primary}; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`

const RadioGroup = styled.div`
  display: flex;
  gap: 1.5rem;
`

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  cursor: pointer;

  input[type="radio"] {
    accent-color: ${({ theme }) => theme.colors.primary};
    width: 1rem;
    height: 1rem;
  }
`

const AnonNote = styled.p`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  margin-bottom: 1.5rem;
`

const RatingsBlock = styled.div`
  border: 1.5px solid #f0f1f3;
  border-radius: ${({ theme }) => theme.radii.md};
  overflow: hidden;
  margin-bottom: 1.5rem;
`

const StarRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.9rem 1.25rem;
  border-bottom: 1px solid #f0f1f3;

  &:last-child { border-bottom: none; }
`

const StarRowLabel = styled.span`
  font-size: 0.9rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.onSurface};
`

const StarsRow = styled.div`
  display: flex;
  gap: 0.2rem;
`

const StarBtn = styled.button`
  font-size: 1.6rem;
  color: ${({ $filled }) => $filled ? '#F59E0B' : '#d1d5db'};
  transition: color 0.1s, transform 0.1s;
  line-height: 1;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  transform: ${({ $filled }) => $filled ? 'scale(1.1)' : 'none'};

  &:hover { color: #F59E0B; transform: scale(1.1); }
`

const ToggleGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`

const ToggleBtn = styled.button`
  padding: 0.5rem 1.1rem;
  border-radius: ${({ theme }) => theme.radii.full};
  border: 1.5px solid ${({ $active, theme }) => $active ? theme.colors.primary : '#e2e4e9'};
  background: ${({ $active, theme }) => $active ? theme.colors.primary : theme.colors.surfaceCard};
  color: ${({ $active, theme }) => $active ? '#fff' : theme.colors.onSurfaceMuted};
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.15s;
  cursor: pointer;
  font-family: inherit;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ $active }) => $active ? '#fff' : '#4F46E5'};
  }
`

const RecommendGroup = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`

const RecommendBtn = styled.button`
  flex: 1;
  padding: 1rem;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 2px solid ${({ $yes, $no }) => $yes ? '#4F46E5' : $no ? '#ef4444' : '#e2e4e9'};
  background: ${({ $yes, $no }) => $yes ? '#4F46E5' : $no ? '#ef4444' : '#ffffff'};
  color: ${({ $yes, $no }) => ($yes || $no) ? '#fff' : '#6b7280'};
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.15s;
  cursor: pointer;
  font-family: inherit;

  &:hover {
    border-color: ${({ $no }) => $no ? '#ef4444' : '#4F46E5'};
    color: ${({ $yes, $no }) => ($yes || $no) ? '#fff' : '#4F46E5'};
  }
`

const AmenityGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.6rem;
  margin-bottom: 1.75rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

const AmenityItem = styled.label`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.65rem 0.9rem;
  border: 1.5px solid ${({ $checked, theme }) => $checked ? theme.colors.primary : '#e2e4e9'};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ $checked }) => $checked ? 'rgba(79, 70, 229, 0.06)' : 'white'};
  cursor: pointer;
  transition: all 0.15s;
  position: relative;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: rgba(79, 70, 229, 0.04);
  }
`

const AmenityCheckbox = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`

const AmenityIcon = styled.span`
  font-size: 1.15rem;
  flex-shrink: 0;
`

const AmenityLabel = styled.span`
  font-size: 0.85rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.onSurface};
  flex: 1;
`

const AmenityTick = styled.span`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 700;
  margin-left: auto;
`

const RadioRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1.5px solid #e2e4e9;
  border-radius: ${({ theme }) => theme.radii.md};
  resize: vertical;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.onSurface};
  background: ${({ theme }) => theme.colors.surfaceCard};
  transition: border-color 0.15s;
  line-height: 1.6;
  font-family: inherit;

  &:focus { outline: none; border-color: ${({ theme }) => theme.colors.primary}; }
`

const CharCount = styled.span`
  display: block;
  text-align: right;
  font-size: 0.78rem;
  color: ${({ $warn }) => $warn ? '#ef4444' : '#6b7280'};
  margin-top: 0.35rem;
`

const Actions = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: ${({ $center }) => $center ? 'center' : 'flex-end'};
  flex-wrap: ${({ $center }) => $center ? 'wrap' : 'nowrap'};
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #f0f1f3;

  @media (max-width: 640px) {
    flex-direction: column-reverse;
  }
`

const ContinueBtn = styled(BtnAccent)`
  min-width: 160px;

  @media (max-width: 640px) {
    width: 100%;
    min-width: unset;
  }
`

const BackBtn = styled(BtnOutline)`
  color: ${({ theme }) => theme.colors.onSurfaceMuted};

  @media (max-width: 640px) {
    width: 100%;
    min-width: unset;
  }
`

const SuccessCircle = styled.div`
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  font-size: 2.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  box-shadow: 0 8px 24px rgba(79, 70, 229, 0.35);
`

const StatusCard = styled.div`
  background: ${({ theme }) => theme.colors.surfaceLow};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: 1.25rem 1.5rem;
  margin: 1.5rem auto;
  max-width: 320px;
  text-align: left;
`

const StatusRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.4rem 0;

  & + & {
    border-top: 1px solid #e9eaed;
    margin-top: 0.4rem;
    padding-top: 0.85rem;
  }
`

const StatusLabel = styled.span`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  font-weight: 500;
`

const StatusBadge = styled.span`
  font-size: 0.8rem;
  font-weight: 700;
  color: #D97706;
  background: #FEF3C7;
  padding: 0.25rem 0.75rem;
  border-radius: ${({ theme }) => theme.radii.full};
`

const StatusValue = styled.span`
  font-size: 0.85rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.onSurface};
`

const LegendNote = styled.p`
  margin-top: 1.5rem;
  font-size: 0.82rem;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
`

/* ── StarRow Component ── */
function StarRowComp({ label, value, onChange }) {
  const [hovered, setHovered] = useState(0)
  return (
    <StarRow>
      <StarRowLabel>{label}</StarRowLabel>
      <StarsRow>
        {[1, 2, 3, 4, 5].map(n => (
          <StarBtn
            key={n}
            type="button"
            $filled={n <= (hovered || value)}
            onMouseEnter={() => setHovered(n)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange(n)}
            aria-label={`Rate ${n} star${n !== 1 ? 's' : ''}`}
          >
            &#9733;
          </StarBtn>
        ))}
      </StarsRow>
    </StarRow>
  )
}

export default function WriteReview() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { isAuthenticated } = useAuth()

  const [step, setStep] = useState(1)
  const [universities, setUniversities] = useState([])
  const [residences, setResidences] = useState([])
  const [loadingUnis, setLoadingUnis] = useState(true)
  const [loadingRes, setLoadingRes] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submittedResidenceId, setSubmittedResidenceId] = useState(null)

  const [formData, setFormData] = useState({
    universityId: searchParams.get('university') || '',
    residenceId: searchParams.get('residence') || '',
    currentlyLiving: '',
    yearLived: '',
    roomQuality: 0,
    buildingSafety: 0,
    bathroom: 0,
    location: 0,
    roomType: '',
    cleaningFrequency: '',
    wouldRecommend: null,
    amenities: [],
    kitchenType: '',
    bathroomType: '',
    comment: '',
  })

  useEffect(() => {
    getUniversities()
      .then(data => setUniversities(Array.isArray(data) ? data : (data.universities || [])))
      .catch(() => setUniversities([]))
      .finally(() => setLoadingUnis(false))
  }, [])

  useEffect(() => {
    if (!formData.universityId) { setResidences([]); return }
    setLoadingRes(true)
    getUniversityResidences(formData.universityId)
      .then(data => setResidences(Array.isArray(data) ? data : (data.residences || [])))
      .catch(() => setResidences([]))
      .finally(() => setLoadingRes(false))
  }, [formData.universityId])

  function set(field, value) {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  function toggleAmenity(key) {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(key)
        ? prev.amenities.filter(a => a !== key)
        : [...prev.amenities, key],
    }))
  }

  function resetForm() {
    setFormData({
      universityId: '', residenceId: '', currentlyLiving: '', yearLived: '',
      roomQuality: 0, buildingSafety: 0, bathroom: 0, location: 0,
      roomType: '', cleaningFrequency: '', wouldRecommend: null,
      amenities: [], kitchenType: '', bathroomType: '', comment: '',
    })
    setSubmittedResidenceId(null)
    setStep(1)
  }

  async function handleSubmit() {
    if (!isAuthenticated) {
      navigate('/signin')
      return
    }
    setSubmitting(true)
    try {
      await createReview(formData.residenceId, formData)
      setSubmittedResidenceId(formData.residenceId)
      setStep(4)
    } catch {
      alert('Failed to submit review. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const step1Valid =
    formData.universityId && formData.residenceId && formData.currentlyLiving && formData.yearLived
  const step2Valid =
    formData.roomQuality > 0 &&
    formData.buildingSafety > 0 &&
    formData.bathroom > 0 &&
    formData.location > 0 &&
    formData.roomType &&
    formData.cleaningFrequency &&
    formData.wouldRecommend !== null

  return (
    <Page>
      <Navbar />

      {/* Hero / Step indicator */}
      <Hero>
        <Container>
          <HeroTitle>Write a Review</HeroTitle>
          <HeroSub>Share your honest experience to help future students</HeroSub>
          <StepIndicator>
            {STEPS.map((label, i) => {
              const num = i + 1
              const active = step === num
              const done = step > num
              return (
                <StepPill key={num} $active={active} $done={done}>
                  <StepNum $active={active} $done={done}>{done ? '✓' : num}</StepNum>
                  <span>{label}</span>
                </StepPill>
              )
            })}
          </StepIndicator>
        </Container>
      </Hero>

      {/* Card body */}
      <Body>
        <CardEl>

          {/* STEP 1 — Select Residence */}
          {step === 1 && (
            <StepContent>
              <StepTitle>Select your residence</StepTitle>
              <StepSub>Tell us where you lived</StepSub>

              <Field>
                <Label>University</Label>
                <Select
                  value={formData.universityId}
                  onChange={e => { set('universityId', e.target.value); set('residenceId', '') }}
                  disabled={loadingUnis}
                >
                  <option value="">
                    {loadingUnis ? 'Loading universities…' : 'Select a university'}
                  </option>
                  {universities.map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </Select>
              </Field>

              <Field>
                <Label>Residence</Label>
                <Select
                  value={formData.residenceId}
                  onChange={e => set('residenceId', e.target.value)}
                  disabled={!formData.universityId || loadingRes}
                >
                  <option value="">
                    {!formData.universityId
                      ? 'Select a university first'
                      : loadingRes
                      ? 'Loading residences…'
                      : 'Select a residence'}
                  </option>
                  {residences.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </Select>
              </Field>

              <Field>
                <Label>Are you currently living here?</Label>
                <RadioGroup>
                  {['Yes', 'No'].map(opt => (
                    <RadioLabel key={opt}>
                      <input
                        type="radio"
                        name="currentlyLiving"
                        value={opt}
                        checked={formData.currentlyLiving === opt}
                        onChange={() => set('currentlyLiving', opt)}
                      />
                      {opt}
                    </RadioLabel>
                  ))}
                </RadioGroup>
              </Field>

              <Field>
                <Label>Year lived there</Label>
                <Select
                  value={formData.yearLived}
                  onChange={e => set('yearLived', e.target.value)}
                >
                  <option value="">Select a year</option>
                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </Select>
              </Field>

              <AnonNote>&#128274; All information is kept anonymous</AnonNote>

              <Actions>
                <ContinueBtn
                  onClick={() => setStep(2)}
                  disabled={!step1Valid}
                >
                  Continue &#8594;
                </ContinueBtn>
              </Actions>
            </StepContent>
          )}

          {/* STEP 2 — Ratings */}
          {step === 2 && (
            <StepContent>
              <StepTitle>Rate your experience</StepTitle>
              <StepSub>How was living there?</StepSub>

              <RatingsBlock>
                <StarRowComp label="Room Quality" value={formData.roomQuality} onChange={v => set('roomQuality', v)} />
                <StarRowComp label="Building &amp; Safety" value={formData.buildingSafety} onChange={v => set('buildingSafety', v)} />
                <StarRowComp label="Bathroom" value={formData.bathroom} onChange={v => set('bathroom', v)} />
                <StarRowComp label="Location" value={formData.location} onChange={v => set('location', v)} />
              </RatingsBlock>

              <Field>
                <Label>Room type</Label>
                <ToggleGroup>
                  {['Single', 'Double', 'Triple', 'Quad'].map(t => (
                    <ToggleBtn
                      key={t}
                      type="button"
                      $active={formData.roomType === t}
                      onClick={() => set('roomType', t)}
                    >
                      {t}
                    </ToggleBtn>
                  ))}
                </ToggleGroup>
              </Field>

              <Field>
                <Label>Cleaning frequency</Label>
                <ToggleGroup>
                  {['Daily', 'Weekly', 'Fortnightly', 'Monthly'].map(f => (
                    <ToggleBtn
                      key={f}
                      type="button"
                      $active={formData.cleaningFrequency === f}
                      onClick={() => set('cleaningFrequency', f)}
                    >
                      {f}
                    </ToggleBtn>
                  ))}
                </ToggleGroup>
              </Field>

              <Field>
                <Label>Would you recommend this residence?</Label>
                <RecommendGroup>
                  <RecommendBtn
                    type="button"
                    $yes={formData.wouldRecommend === true}
                    onClick={() => set('wouldRecommend', true)}
                  >
                    &#128077; Yes, I would
                  </RecommendBtn>
                  <RecommendBtn
                    type="button"
                    $no={formData.wouldRecommend === false}
                    onClick={() => set('wouldRecommend', false)}
                  >
                    &#128078; No, I wouldn't
                  </RecommendBtn>
                </RecommendGroup>
              </Field>

              <Actions>
                <BackBtn onClick={() => setStep(1)}>&#8592; Back</BackBtn>
                <ContinueBtn
                  onClick={() => setStep(3)}
                  disabled={!step2Valid}
                >
                  Continue &#8594;
                </ContinueBtn>
              </Actions>
            </StepContent>
          )}

          {/* STEP 3 — Amenities & Comment */}
          {step === 3 && (
            <StepContent>
              <StepTitle>What's included?</StepTitle>
              <StepSub>Select all amenities available at this residence</StepSub>

              <AmenityGrid>
                {AMENITIES.map(({ key, label, icon }) => (
                  <AmenityItem
                    key={key}
                    $checked={formData.amenities.includes(key)}
                  >
                    <AmenityCheckbox
                      type="checkbox"
                      checked={formData.amenities.includes(key)}
                      onChange={() => toggleAmenity(key)}
                    />
                    <AmenityIcon>{icon}</AmenityIcon>
                    <AmenityLabel>{label}</AmenityLabel>
                    {formData.amenities.includes(key) && (
                      <AmenityTick>&#10003;</AmenityTick>
                    )}
                  </AmenityItem>
                ))}
              </AmenityGrid>

              <RadioRow>
                <Field>
                  <Label>Kitchen type</Label>
                  <RadioGroup>
                    {['Private', 'Communal'].map(opt => (
                      <RadioLabel key={opt}>
                        <input
                          type="radio"
                          name="kitchenType"
                          value={opt}
                          checked={formData.kitchenType === opt}
                          onChange={() => set('kitchenType', opt)}
                        />
                        {opt}
                      </RadioLabel>
                    ))}
                  </RadioGroup>
                </Field>
                <Field>
                  <Label>Bathroom type</Label>
                  <RadioGroup>
                    {['En-suite', 'Communal'].map(opt => (
                      <RadioLabel key={opt}>
                        <input
                          type="radio"
                          name="bathroomType"
                          value={opt}
                          checked={formData.bathroomType === opt}
                          onChange={() => set('bathroomType', opt)}
                        />
                        {opt}
                      </RadioLabel>
                    ))}
                  </RadioGroup>
                </Field>
              </RadioRow>

              <Field>
                <Label>
                  Share your experience{' '}
                  <Optional>(optional)</Optional>
                </Label>
                <Textarea
                  placeholder="Tell future students what it's really like to live here…"
                  value={formData.comment}
                  onChange={e => {
                    if (e.target.value.length <= 1000) set('comment', e.target.value)
                  }}
                  rows={5}
                />
                <CharCount $warn={formData.comment.length >= 900}>
                  {formData.comment.length} / 1000
                </CharCount>
              </Field>

              <Actions>
                <BackBtn onClick={() => setStep(2)}>&#8592; Back</BackBtn>
                <ContinueBtn
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? 'Submitting…' : 'Submit Review ✓'}
                </ContinueBtn>
              </Actions>
            </StepContent>
          )}

          {/* STEP 4 — Confirmation */}
          {step === 4 && (
            <StepContent $center>
              <SuccessCircle>&#10003;</SuccessCircle>
              <StepTitle>Review Submitted!</StepTitle>
              <StepSub>
                Your review is being verified and will appear shortly
              </StepSub>

              <StatusCard>
                <StatusRow>
                  <StatusLabel>Status</StatusLabel>
                  <StatusBadge>&#9679; Pending Verification</StatusBadge>
                </StatusRow>
                <StatusRow>
                  <StatusLabel>Est. time</StatusLabel>
                  <StatusValue>~24 Hours</StatusValue>
                </StatusRow>
              </StatusCard>

              <Actions $center>
                {submittedResidenceId && (
                  <BtnLinkPrimary to={`/residence/${submittedResidenceId}`}>
                    View Residence
                  </BtnLinkPrimary>
                )}
                <BackBtn onClick={resetForm}>
                  Review Another Residence
                </BackBtn>
              </Actions>

              <LegendNote>
                &#127942; Users with 5+ reviews earn the <strong>Campus Legend</strong> badge
              </LegendNote>
            </StepContent>
          )}

        </CardEl>
      </Body>

      <Footer />
    </Page>
  )
}
