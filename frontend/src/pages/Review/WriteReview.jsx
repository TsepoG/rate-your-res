import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import styled from 'styled-components'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import { getUniversities, getUniversityResidences } from '../../services/universities'
import { createReview } from '../../services/reviews'
import { Container, BtnLinkPrimary } from '../../styles/shared'

const AMENITIES = [
  { key: 'wifi',            label: 'WiFi',          icon: 'wifi' },
  { key: 'elevator',        label: 'Elevator',       icon: 'elevator' },
  { key: 'laundry',         label: 'Laundry',        icon: 'local_laundry_service' },
  { key: 'studyRoom',       label: 'Study Room',     icon: 'menu_book' },
  { key: 'diningHall',      label: 'Dining Hall',    icon: 'restaurant' },
  { key: 'tuckshop',        label: 'Tuckshop',       icon: 'storefront' },
  { key: 'tvLounge',        label: 'TV Lounge',      icon: 'tv' },
  { key: 'gym',             label: 'Gym',            icon: 'fitness_center' },
  { key: 'computerRoom',    label: 'Computer Room',  icon: 'computer' },
  { key: 'airConditioning', label: 'Air Con',        icon: 'ac_unit' },
  { key: 'parking',         label: 'Parking',        icon: 'local_parking' },
  { key: 'shuttle',         label: 'Shuttle',        icon: 'directions_bus' },
]

const YEARS = Array.from({ length: 11 }, (_, i) => 2025 - i)
const STEPS = ['Residence', 'Ratings', 'Amenities', 'Submit']

/* ─── Page shell ─── */

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.surface};
  overflow-x: hidden;
`

/* ─── Step 1: purple hero ─── */

const Hero = styled.section`
  background: ${({ theme }) => theme.colors.primary};
  padding: calc(${({ theme }) => theme.navHeight} + 2.5rem) 1.5rem 8rem;
  overflow: hidden;
  position: relative;
`

const HeroGlow = styled.div`
  position: absolute;
  top: -60px;
  right: -80px;
  width: 320px;
  height: 320px;
  border-radius: 50%;
  background: rgba(249, 115, 22, 0.12);
  filter: blur(80px);
  pointer-events: none;
`

const HeroInner = styled.div`
  max-width: 720px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`

const StepBadge = styled.span`
  display: inline-block;
  padding: 0.2rem 0.85rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  border-radius: ${({ theme }) => theme.radii.full};
  color: #fff;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 1rem;
`

const HeroTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(1.75rem, 5vw, 2.5rem);
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.02em;
  margin-bottom: 0.4rem;
`

const HeroSub = styled.p`
  color: rgba(255, 255, 255, 0.85);
  font-size: 1rem;
  margin-bottom: 2rem;
`

const ProgressBars = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 2rem;

  @media (max-width: 480px) {
    gap: 0.5rem;
  }
`

const ProgressSegment = styled.div`
  flex: 1;
`

const ProgressBar = styled.div`
  height: 6px;
  width: 100%;
  background: ${({ $done }) => $done ? '#fff' : 'rgba(255,255,255,0.2)'};
  border-radius: 999px;
`

const ProgressLabel = styled.p`
  font-size: 0.65rem;
  font-weight: ${({ $done }) => $done ? 700 : 500};
  color: ${({ $done }) => $done ? '#fff' : 'rgba(255,255,255,0.4)'};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-top: 0.4rem;
`

/* ─── Steps 2-4: inline progress header ─── */

const ProgressHeader = styled.div`
  max-width: 720px;
  margin: 0 auto;
  padding: 2rem 1.5rem 0;
`

const ProgressTop = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 1rem;
`

const ProgressStepLabel = styled.span`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.primary};
`

const ProgressTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 800;
  color: ${({ theme }) => theme.colors.onSurface};
  letter-spacing: -0.02em;
  margin-top: 0.25rem;
`

const ProgressPct = styled.span`
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.9rem;
`

const ProgressTrack = styled.div`
  height: 8px;
  width: 100%;
  background: ${({ theme }) => theme.colors.surfaceHigh};
  border-radius: 999px;
  overflow: hidden;
`

const ProgressFill = styled.div`
  height: 100%;
  width: ${({ $pct }) => $pct}%;
  background: ${({ theme }) => theme.colors.primary};
  border-radius: 999px;
  transition: width 0.5s ease;
`

/* ─── Body / card ─── */

const Body = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 0 1rem 5rem;
  margin-top: ${({ $heroOverlap }) => $heroOverlap ? '-5rem' : '0'};
`

const CardEl = styled.div`
  background: ${({ theme }) => theme.colors.surfaceCard};
  border-radius: ${({ theme }) => theme.radii.xl};
  box-shadow: ${({ theme }) => theme.shadows.float};
  width: 100%;
  max-width: 720px;
  overflow: hidden;
  position: relative;
  z-index: 2;
`

const StepContent = styled.div`
  padding: 2.5rem 2.5rem 2rem;

  @media (max-width: 640px) {
    padding: 1.75rem 1.25rem 1.5rem;
  }
`

const SectionTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.1rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.onSurface};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.75rem;

  .material-symbols-outlined {
    color: ${({ theme }) => theme.colors.primary};
    font-size: 1.25rem;
  }
`

const Field = styled.div`
  margin-bottom: 1.75rem;
`

const FieldLabel = styled.label`
  display: block;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.onSurface};
  margin-bottom: 0.75rem;
`

const SelectWrap = styled.div`
  position: relative;
`

const StyledSelect = styled.select`
  width: 100%;
  height: 56px;
  padding: 0 3rem 0 1.25rem;
  background: ${({ theme }) => theme.colors.surfaceLow};
  border: none;
  border-radius: ${({ theme }) => theme.radii.xl};
  color: ${({ theme }) => theme.colors.onSurface};
  font-size: 0.95rem;
  font-family: inherit;
  appearance: none;
  cursor: pointer;
  transition: box-shadow 0.15s;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}33;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const SelectIcon = styled.span`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 1.25rem;
`

const RadioCards = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

const RadioCard = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: ${({ theme }) => theme.radii.xl};
  background: ${({ theme }) => theme.colors.surfaceLow};
  border: 2px solid ${({ $checked, theme }) => $checked ? theme.colors.primary : 'transparent'};
  background: ${({ $checked }) => $checked ? 'rgba(79,70,229,0.05)' : undefined};
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;

  input { accent-color: ${({ theme }) => theme.colors.primary}; }
  font-size: 0.9rem;
  font-weight: 500;
`

/* ─── Step 1 Continue button (orange/tertiary) ─── */

const ContinueBtn = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1.1rem 2rem;
  background: ${({ theme }) => theme.colors.tertiaryBadge};
  color: #fff;
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 700;
  font-size: 1rem;
  border: none;
  border-radius: ${({ theme }) => theme.radii.full};
  cursor: pointer;
  transition: background 0.15s, transform 0.1s;
  box-shadow: 0 8px 20px ${({ theme }) => theme.colors.tertiaryBadge}40;

  &:hover:not(:disabled) { background: #7b3300; }
  &:active:not(:disabled) { transform: scale(0.98); }
  &:disabled { opacity: 0.45; cursor: not-allowed; }
`

const AnonNote = styled.p`
  text-align: center;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  margin-top: 1.25rem;
  font-weight: 500;
`

/* ─── Info cards below Step 1 ─── */

const InfoCards = styled.div`
  max-width: 720px;
  margin: 1.5rem auto 0;
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const InfoCard = styled.div`
  background: ${({ $primary, theme }) => $primary ? theme.colors.primaryFixed : '#e3dfff'};
  padding: 1.25rem;
  border-radius: ${({ theme }) => theme.radii.xl};
  display: flex;
  gap: 1rem;
  align-items: center;
`

const InfoIconBox = styled.div`
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.primary}1a;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primary};

  .material-symbols-outlined { font-size: 1.1rem; }
`

const InfoText = styled.div``

const InfoTitle = styled.h4`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 0.85rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.onSurface};
  margin-bottom: 0.25rem;
`

const InfoDesc = styled.p`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  line-height: 1.5;
`

/* ─── Step 2: ratings ─── */

const RatingsCard = styled.div`
  background: ${({ theme }) => theme.colors.surfaceCard};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: 2rem;
  box-shadow: 0 4px 24px rgba(25,28,30,0.04);
  margin-bottom: 1.5rem;
`

const StarRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.surfaceHigh};

  &:last-child { border-bottom: none; }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
`

const StarRowLabel = styled.span`
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  font-size: 0.95rem;
`

const Stars = styled.div`
  display: flex;
  gap: 0.35rem;
`

const StarIcon = styled.span`
  font-size: 1.75rem;
  cursor: pointer;
  color: ${({ $filled }) => $filled ? '#4F46E5' : '#e0e3e5'};
  font-variation-settings: ${({ $filled }) => $filled ? "'FILL' 1" : "'FILL' 0"};
  transition: color 0.1s, font-variation-settings 0.1s, transform 0.1s;
  transform: ${({ $filled }) => $filled ? 'scale(1.1)' : 'none'};
  user-select: none;

  &:hover {
    color: #4F46E5;
    font-variation-settings: 'FILL' 1;
    transform: scale(1.1);
  }
`

const SpecRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

const SpecCard = styled.div`
  background: ${({ theme }) => theme.colors.surfaceLow};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: 1.25rem;
`

const SpecLabel = styled.p`
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  margin-bottom: 0.75rem;
`

const PillGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`

const Pill = styled.button`
  padding: 0.4rem 1rem;
  border-radius: ${({ theme }) => theme.radii.full};
  border: none;
  background: ${({ $active, theme }) => $active ? theme.colors.primary : theme.colors.surfaceHigh};
  color: ${({ $active, theme }) => $active ? '#fff' : theme.colors.onSurfaceMuted};
  font-size: 0.85rem;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;

  &:hover:not(:disabled) {
    background: ${({ $active, theme }) => $active ? theme.colors.primary : theme.colors.outlineVariant};
  }
`

const RecommendSection = styled.div`
  background: rgba(79, 70, 229, 0.05);
  border: 2px solid rgba(79, 70, 229, 0.1);
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: 1.5rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  margin-bottom: 1.5rem;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
    padding: 1.25rem;
  }
`

const RecommendText = styled.div``

const RecommendTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.1rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`

const RecommendSub = styled.p`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  margin-top: 0.2rem;
`

const RecommendToggle = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-shrink: 0;
`

const RecommendOpt = styled.button`
  flex: 1;
  padding: 0.7rem 2rem;
  border-radius: ${({ theme }) => theme.radii.full};
  border: 2px solid ${({ $active, theme }) => $active ? theme.colors.primary : theme.colors.outlineVariant};
  background: ${({ $active, theme }) => $active ? theme.colors.primary : '#fff'};
  color: ${({ $active, theme }) => $active ? '#fff' : theme.colors.onSurface};
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  white-space: nowrap;
  ${({ $active }) => $active && 'box-shadow: 0 4px 12px rgba(79,70,229,0.25);'}

  @media (max-width: 640px) {
    padding: 0.7rem 1.25rem;
  }
`

/* ─── Floating action bar (step 2) ─── */

const FloatBar = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border-top: 1px solid rgba(199, 196, 216, 0.2);
  padding: 1rem 1.5rem;
  z-index: 100;

  @media (max-width: 768px) {
    padding-bottom: calc(1rem + 64px);
  }
`

const FloatBarInner = styled.div`
  max-width: 720px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`

const BackBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.85rem 1.5rem;
  border-radius: ${({ theme }) => theme.radii.full};
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.primary};
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background 0.15s;

  &:hover { background: rgba(79, 70, 229, 0.06); }
`

const NextBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem 2.5rem;
  border-radius: ${({ theme }) => theme.radii.full};
  border: none;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: opacity 0.15s, transform 0.1s;
  box-shadow: 0 8px 20px ${({ theme }) => theme.colors.primary}50;

  &:hover:not(:disabled) { opacity: 0.9; }
  &:active:not(:disabled) { transform: scale(0.98); }
  &:disabled { opacity: 0.45; cursor: not-allowed; }
`

/* ─── Step 3: amenities ─── */

const AmenityGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin-bottom: 2rem;
`

const AmenityItem = styled.label`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.65rem 0.75rem;
  background: ${({ $checked }) => $checked ? 'rgba(79,70,229,0.05)' : '#fff'};
  border: 1.5px solid ${({ $checked, theme }) => $checked ? theme.colors.primary : theme.colors.surfaceHigh};
  border-radius: ${({ theme }) => theme.radii.lg};
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: rgba(79, 70, 229, 0.03);
  }

  input { display: none; }
`

const AmenityIconBox = styled.div`
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border-radius: 10px;
  background: ${({ $checked, theme }) => $checked ? theme.colors.primary : theme.colors.surfaceLow};
  color: ${({ $checked }) => $checked ? '#fff' : undefined};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;

  .material-symbols-outlined { font-size: 1.15rem; }
`

const AmenityLabel = styled.span`
  font-size: 0.8rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.onSurface};
  flex: 1;
`

const AmenityCheck = styled.span`
  margin-left: auto;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.1rem;
  opacity: ${({ $visible }) => $visible ? 1 : 0};
  font-variation-settings: 'FILL' 1;
`

const RadioRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

const RadioCardGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const RadioCardItem = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.surfaceLow};
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 2px solid ${({ $checked, theme }) => $checked ? theme.colors.primary : 'transparent'};
  cursor: pointer;
  transition: border-color 0.15s;

  input { accent-color: ${({ theme }) => theme.colors.primary}; }
  font-size: 0.9rem;
  font-weight: 500;
`

const Textarea = styled.textarea`
  width: 100%;
  padding: 1.25rem;
  background: ${({ theme }) => theme.colors.surfaceCard};
  border: none;
  border-radius: ${({ theme }) => theme.radii.xl};
  resize: none;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.onSurface};
  line-height: 1.6;
  font-family: inherit;
  box-shadow: 0 2px 8px rgba(25,28,30,0.04);
  transition: box-shadow 0.15s;

  &::placeholder { color: ${({ theme }) => theme.colors.muted}; }
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}33;
  }
`

const CharCount = styled.span`
  display: block;
  text-align: right;
  font-size: 0.78rem;
  color: ${({ $warn }) => $warn ? '#ef4444' : '#6b7280'};
  margin-top: 0.35rem;
`

const Step3Actions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;

  @media (max-width: 480px) {
    flex-direction: column-reverse;
  }
`

const OutlineBtn = styled.button`
  flex: 1;
  padding: 1rem;
  border-radius: ${({ theme }) => theme.radii.full};
  border: 2px solid ${({ theme }) => theme.colors.primary};
  background: transparent;
  color: ${({ theme }) => theme.colors.primary};
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background 0.15s;

  &:hover { background: rgba(79, 70, 229, 0.05); }
`

const SubmitBtn = styled.button`
  flex: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: ${({ theme }) => theme.radii.full};
  border: none;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: opacity 0.15s, transform 0.1s;
  box-shadow: 0 6px 16px rgba(79, 70, 229, 0.3);

  &:hover:not(:disabled) { opacity: 0.9; }
  &:active:not(:disabled) { transform: scale(0.98); }
  &:disabled { opacity: 0.45; cursor: not-allowed; }
`

/* ─── Step 4: confirmation ─── */

const SuccessWrap = styled.div`
  padding: 3rem 2rem;
  text-align: center;
`

const SuccessCircleWrap = styled.div`
  position: relative;
  display: inline-flex;
  margin-bottom: 2rem;
`

const SuccessGlow = styled.div`
  position: absolute;
  inset: 0;
  background: ${({ theme }) => theme.colors.primaryFixed};
  opacity: 0.4;
  border-radius: 50%;
  filter: blur(32px);
  transform: scale(2);
`

const SuccessCircle = styled.div`
  position: relative;
  width: 5.5rem;
  height: 5.5rem;
  border-radius: 50%;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primaryFixed}, ${({ theme }) => theme.colors.primary});
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(79,70,229,0.35);

  .material-symbols-outlined {
    font-size: 2.5rem;
    color: #fff;
    font-variation-settings: 'FILL' 1;
  }
`

const SuccessTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 2.25rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.onSurface};
  letter-spacing: -0.02em;
  margin-bottom: 0.75rem;
`

const SuccessSub = styled.p`
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  font-size: 1rem;
  line-height: 1.6;
  max-width: 280px;
  margin: 0 auto 2.5rem;
`

const StatusGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 2.5rem;
  text-align: left;
`

const StatusTile = styled.div`
  background: ${({ theme }) => theme.colors.surfaceLow};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 1rem;
`

const StatusTileLabel = styled.p`
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.muted};
  margin-bottom: 0.4rem;
`

const StatusTileValue = styled.p`
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 700;
  font-size: 0.9rem;
  color: ${({ $primary, theme }) => $primary ? theme.colors.primary : theme.colors.onSurface};
`

const SuccessActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

const ViewResBtn = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: ${({ theme }) => theme.radii.full};
  border: none;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.15s;
  box-shadow: 0 6px 16px rgba(79,70,229,0.3);

  &:hover { opacity: 0.9; }
`

const ReviewAnotherBtn = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: ${({ theme }) => theme.radii.full};
  border: none;
  background: ${({ theme }) => theme.colors.accentLight};
  color: ${({ theme }) => theme.colors.accentDark};
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s;

  &:hover { background: #ffcfb5; }
`

const EngagementNudge = styled.div`
  margin-top: 2rem;
  background: rgba(226, 223, 255, 0.35);
  backdrop-filter: blur(8px);
  border: 1px solid ${({ theme }) => theme.colors.primaryFixed};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  text-align: left;

  .material-symbols-outlined {
    font-size: 2rem;
    color: ${({ theme }) => theme.colors.primary};
    font-variation-settings: 'FILL' 1;
    flex-shrink: 0;
  }
`

const NudgeTitle = styled.h4`
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 700;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.onSurface};
`

const NudgeSub = styled.p`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  margin-top: 0.15rem;
`

/* ─── StarRowComp ─── */
function StarRowComp({ label, value, onChange }) {
  const [hovered, setHovered] = useState(0)
  return (
    <StarRow>
      <StarRowLabel>{label}</StarRowLabel>
      <Stars>
        {[1, 2, 3, 4, 5].map(n => (
          <StarIcon
            key={n}
            className="material-symbols-outlined"
            $filled={n <= (hovered || value)}
            onMouseEnter={() => setHovered(n)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange(n)}
            role="button"
            aria-label={`${n} star${n !== 1 ? 's' : ''}`}
          >
            star
          </StarIcon>
        ))}
      </Stars>
    </StarRow>
  )
}

/* ─── Main component ─── */
export default function WriteReview() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

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
    cleanliness: 0,
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
      .then(data => setUniversities(Array.isArray(data) ? data : (data.items || data.universities || [])))
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
      roomQuality: 0, buildingSafety: 0, bathroom: 0, cleanliness: 0, location: 0,
      roomType: '', cleaningFrequency: '', wouldRecommend: null,
      amenities: [], kitchenType: '', bathroomType: '', comment: '',
    })
    setSubmittedResidenceId(null)
    setStep(1)
  }

  async function handleSubmit() {
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
    formData.universityId && formData.residenceId &&
    formData.currentlyLiving && formData.yearLived

  const step2Valid =
    formData.roomQuality > 0 && formData.buildingSafety > 0 &&
    formData.bathroom > 0 && formData.cleanliness > 0 && formData.location > 0 &&
    formData.roomType && formData.cleaningFrequency &&
    formData.wouldRecommend !== null

  const PROGRESS_PCT = { 1: 25, 2: 50, 3: 75, 4: 100 }
  const STEP_TITLES = {
    2: 'Detailed Ratings',
    3: "What's included?",
    4: 'Review Submitted',
  }

  return (
    <Page>
      <Navbar />

      {/* ── Step 1 hero ── */}
      {step === 1 && (
        <>
          <Hero>
            <HeroGlow />
            <HeroInner>
              <StepBadge>Step 1 of 4</StepBadge>
              <HeroTitle>Select your residence</HeroTitle>
              <HeroSub>Help other students by sharing your experience.</HeroSub>
              <ProgressBars>
                {STEPS.map((label, i) => (
                  <ProgressSegment key={i}>
                    <ProgressBar $done={i === 0} />
                    <ProgressLabel $done={i === 0}>{label}</ProgressLabel>
                  </ProgressSegment>
                ))}
              </ProgressBars>
            </HeroInner>
          </Hero>

          <Body $heroOverlap>
            <div style={{ width: '100%', maxWidth: 720 }}>
              <CardEl>
                <StepContent>
                  <Field>
                    <FieldLabel>Select your university</FieldLabel>
                    <SelectWrap>
                      <StyledSelect
                        value={formData.universityId}
                        onChange={e => { set('universityId', e.target.value); set('residenceId', '') }}
                        disabled={loadingUnis}
                      >
                        <option value="">
                          {loadingUnis ? 'Loading universities…' : 'Search for your institution...'}
                        </option>
                        {universities.map(u => (
                          <option key={u.id} value={u.id}>{u.name}</option>
                        ))}
                      </StyledSelect>
                      <SelectIcon className="material-symbols-outlined">expand_more</SelectIcon>
                    </SelectWrap>
                  </Field>

                  <Field>
                    <FieldLabel>Select your residence</FieldLabel>
                    <SelectWrap>
                      <StyledSelect
                        value={formData.residenceId}
                        onChange={e => set('residenceId', e.target.value)}
                        disabled={!formData.universityId || loadingRes}
                      >
                        <option value="">
                          {!formData.universityId
                            ? 'Select a university first'
                            : loadingRes
                            ? 'Loading residences…'
                            : 'Which residence did you live in?'}
                        </option>
                        {residences.map(r => (
                          <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                      </StyledSelect>
                      <SelectIcon className="material-symbols-outlined">search</SelectIcon>
                    </SelectWrap>
                  </Field>

                  <Field>
                    <FieldLabel>Are you currently living here?</FieldLabel>
                    <RadioCards>
                      {[
                        { val: 'Yes', label: 'Yes, I live here now' },
                        { val: 'No', label: 'No, I previously lived here' },
                      ].map(({ val, label }) => (
                        <RadioCard key={val} $checked={formData.currentlyLiving === val}>
                          <input
                            type="radio"
                            name="currentlyLiving"
                            value={val}
                            checked={formData.currentlyLiving === val}
                            onChange={() => set('currentlyLiving', val)}
                          />
                          {label}
                        </RadioCard>
                      ))}
                    </RadioCards>
                  </Field>

                  <Field>
                    <FieldLabel>Year you lived there</FieldLabel>
                    <SelectWrap>
                      <StyledSelect
                        value={formData.yearLived}
                        onChange={e => set('yearLived', e.target.value)}
                      >
                        <option value="">Select year...</option>
                        {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                      </StyledSelect>
                      <SelectIcon className="material-symbols-outlined">calendar_today</SelectIcon>
                    </SelectWrap>
                  </Field>

                  <ContinueBtn onClick={() => setStep(2)} disabled={!step1Valid}>
                    Continue
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </ContinueBtn>
                  <AnonNote>Step 1 of 4: All information is kept anonymous</AnonNote>
                </StepContent>
              </CardEl>

              <InfoCards>
                <InfoCard $primary>
                  <InfoIconBox>
                    <span className="material-symbols-outlined">verified</span>
                  </InfoIconBox>
                  <InfoText>
                    <InfoTitle>Honest Feedback</InfoTitle>
                    <InfoDesc>Your reviews help thousands of students make better living choices every year.</InfoDesc>
                  </InfoText>
                </InfoCard>
                <InfoCard>
                  <InfoIconBox>
                    <span className="material-symbols-outlined">security</span>
                  </InfoIconBox>
                  <InfoText>
                    <InfoTitle>Privacy First</InfoTitle>
                    <InfoDesc>We never share your personal identity with residences.</InfoDesc>
                  </InfoText>
                </InfoCard>
              </InfoCards>
            </div>
          </Body>
        </>
      )}

      {/* ── Step 2: purple hero (same layout as step 1) ── */}
      {step === 2 && (
        <>
          <Hero>
            <HeroGlow />
            <HeroInner>
              <StepBadge>Step 2 of 4</StepBadge>
              <HeroTitle>Detailed Ratings</HeroTitle>
              <HeroSub>Rate the key aspects of your stay.</HeroSub>
              <ProgressBars>
                {STEPS.map((label, i) => (
                  <ProgressSegment key={i}>
                    <ProgressBar $done={i <= 1} />
                    <ProgressLabel $done={i <= 1}>{label}</ProgressLabel>
                  </ProgressSegment>
                ))}
              </ProgressBars>
            </HeroInner>
          </Hero>

          <Body $heroOverlap style={{ paddingBottom: '7rem' }}>
            <div style={{ width: '100%', maxWidth: 720 }}>
              <CardEl>
                <StepContent>
                  <RatingsCard>
                    <SectionTitle>
                      <span className="material-symbols-outlined">grade</span>
                      Rate your experience
                    </SectionTitle>
                    <StarRowComp label="Room Quality" value={formData.roomQuality} onChange={v => set('roomQuality', v)} />
                    <StarRowComp label="Building & Safety" value={formData.buildingSafety} onChange={v => set('buildingSafety', v)} />
                    <StarRowComp label="Bathroom" value={formData.bathroom} onChange={v => set('bathroom', v)} />
                    <StarRowComp label="Cleanliness" value={formData.cleanliness} onChange={v => set('cleanliness', v)} />
                    <StarRowComp label="Location" value={formData.location} onChange={v => set('location', v)} />
                  </RatingsCard>

                  <SpecRow>
                    <SpecCard>
                      <SpecLabel>Room Type</SpecLabel>
                      <PillGroup>
                        {['Single', 'Double', 'Triple', 'Quad'].map(t => (
                          <Pill key={t} type="button" $active={formData.roomType === t} onClick={() => set('roomType', t)}>
                            {t}
                          </Pill>
                        ))}
                      </PillGroup>
                    </SpecCard>
                    <SpecCard>
                      <SpecLabel>Cleaning Frequency</SpecLabel>
                      <PillGroup>
                        {['Daily', 'Weekly', 'Fortnightly', 'Monthly'].map(f => (
                          <Pill key={f} type="button" $active={formData.cleaningFrequency === f} onClick={() => set('cleaningFrequency', f)}>
                            {f}
                          </Pill>
                        ))}
                      </PillGroup>
                    </SpecCard>
                  </SpecRow>

                  <RecommendSection>
                    <RecommendText>
                      <RecommendTitle>Would you recommend this place?</RecommendTitle>
                      <RecommendSub>Your recommendation helps thousands of other students choose.</RecommendSub>
                    </RecommendText>
                    <RecommendToggle>
                      <RecommendOpt
                        type="button"
                        $active={formData.wouldRecommend === false}
                        onClick={() => set('wouldRecommend', false)}
                      >
                        No
                      </RecommendOpt>
                      <RecommendOpt
                        type="button"
                        $active={formData.wouldRecommend === true}
                        onClick={() => set('wouldRecommend', true)}
                      >
                        Yes
                      </RecommendOpt>
                    </RecommendToggle>
                  </RecommendSection>

                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                    <OutlineBtn type="button" onClick={() => setStep(1)}>
                      Back
                    </OutlineBtn>
                    <ContinueBtn onClick={() => setStep(3)} disabled={!step2Valid} style={{ flex: 2 }}>
                      Continue
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </ContinueBtn>
                  </div>
                  <AnonNote>Step 2 of 4: All information is kept anonymous</AnonNote>
                </StepContent>

              </CardEl>
            </div>
          </Body>
        </>
      )}

      {/* ── Step 3: purple hero (same layout as steps 1 & 2) ── */}
      {step === 3 && (
        <>
          <Hero>
            <HeroGlow />
            <HeroInner>
              <StepBadge>Step 3 of 4</StepBadge>
              <HeroTitle>What's included?</HeroTitle>
              <HeroSub>Tell us about the amenities and facilities at your residence.</HeroSub>
              <ProgressBars>
                {STEPS.map((label, i) => (
                  <ProgressSegment key={i}>
                    <ProgressBar $done={i <= 2} />
                    <ProgressLabel $done={i <= 2}>{label}</ProgressLabel>
                  </ProgressSegment>
                ))}
              </ProgressBars>
            </HeroInner>
          </Hero>

          <Body $heroOverlap>
            <div style={{ width: '100%', maxWidth: 720 }}>
              <CardEl>
                <StepContent>
                  <SectionTitle style={{ marginBottom: '0.5rem' }}>Available Amenities</SectionTitle>
                  <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                    Help other students understand the facilities available at this residence.
                  </p>

                  <AmenityGrid>
                    {AMENITIES.map(({ key, label, icon }) => {
                      const checked = formData.amenities.includes(key)
                      return (
                        <AmenityItem key={key} $checked={checked}>
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleAmenity(key)}
                          />
                          <AmenityIconBox $checked={checked}>
                            <span className="material-symbols-outlined">{icon}</span>
                          </AmenityIconBox>
                          <AmenityLabel>{label}</AmenityLabel>
                          <AmenityCheck className="material-symbols-outlined" $visible={checked}>
                            check_circle
                          </AmenityCheck>
                        </AmenityItem>
                      )
                    })}
                  </AmenityGrid>

                  <RadioRow>
                    <div>
                      <SectionTitle style={{ fontSize: '1rem', marginBottom: '1rem' }}>Kitchen Type</SectionTitle>
                      <RadioCardGroup>
                        {[
                          { val: 'Private', label: 'Private Kitchen' },
                          { val: 'Communal', label: 'Communal Kitchen' },
                        ].map(({ val, label }) => (
                          <RadioCardItem key={val} $checked={formData.kitchenType === val}>
                            <input
                              type="radio"
                              name="kitchenType"
                              value={val}
                              checked={formData.kitchenType === val}
                              onChange={() => set('kitchenType', val)}
                            />
                            {label}
                          </RadioCardItem>
                        ))}
                      </RadioCardGroup>
                    </div>
                    <div>
                      <SectionTitle style={{ fontSize: '1rem', marginBottom: '1rem' }}>Bathroom</SectionTitle>
                      <RadioCardGroup>
                        {[
                          { val: 'En-suite', label: 'En-suite (Private)' },
                          { val: 'Communal', label: 'Communal / Shared' },
                        ].map(({ val, label }) => (
                          <RadioCardItem key={val} $checked={formData.bathroomType === val}>
                            <input
                              type="radio"
                              name="bathroomType"
                              value={val}
                              checked={formData.bathroomType === val}
                              onChange={() => set('bathroomType', val)}
                            />
                            {label}
                          </RadioCardItem>
                        ))}
                      </RadioCardGroup>
                    </div>
                  </RadioRow>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <SectionTitle style={{ marginBottom: 0 }}>Share your experience</SectionTitle>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6b7280' }}>Optional</span>
                    </div>
                    <div style={{ position: 'relative' }}>
                      <Textarea
                        placeholder="Tell us about the atmosphere, the management, and anything else future residents should know..."
                        value={formData.comment}
                        onChange={e => {
                          if (e.target.value.length <= 1000) set('comment', e.target.value)
                        }}
                        rows={6}
                      />
                      <CharCount $warn={formData.comment.length >= 900}>
                        {formData.comment.length} / 1000
                      </CharCount>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                    <OutlineBtn type="button" onClick={() => setStep(2)} style={{ padding: '0.7rem 1.25rem' }}>Back</OutlineBtn>
                    <ContinueBtn
                      type="button"
                      onClick={handleSubmit}
                      disabled={submitting}
                      style={{ flex: 2, padding: '0.7rem 1.25rem' }}
                    >
                      {submitting ? 'Submitting…' : 'Submit Review'}
                      {!submitting && <span className="material-symbols-outlined">send</span>}
                    </ContinueBtn>
                  </div>
                  <AnonNote>Step 3 of 4: All information is kept anonymous</AnonNote>
                </StepContent>
              </CardEl>
            </div>
          </Body>
        </>
      )}

      {/* ── Step 4: confirmation ── */}
      {step === 4 && (
        <>
          <Hero>
            <HeroGlow />
            <HeroInner>
              <StepBadge>Step 4 of 4</StepBadge>
              <HeroTitle>Review Submitted!</HeroTitle>
              <HeroSub>Thank you for helping fellow students make better decisions.</HeroSub>
              <ProgressBars>
                {STEPS.map((label, i) => (
                  <ProgressSegment key={i}>
                    <ProgressBar $done={true} />
                    <ProgressLabel $done={true}>{label}</ProgressLabel>
                  </ProgressSegment>
                ))}
              </ProgressBars>
            </HeroInner>
          </Hero>

          <Body $heroOverlap style={{ paddingBottom: '5rem' }}>
            <div style={{ width: '100%', maxWidth: 720 }}>
            <CardEl>
              <SuccessWrap>
                  <SuccessCircleWrap>
                    <SuccessGlow />
                    <SuccessCircle>
                      <span className="material-symbols-outlined">check_circle</span>
                    </SuccessCircle>
                  </SuccessCircleWrap>

                  <SuccessTitle>Review Submitted!</SuccessTitle>
                  <SuccessSub>Your review is being verified and will appear shortly</SuccessSub>

                  <StatusGrid>
                    <StatusTile>
                      <StatusTileLabel>Status</StatusTileLabel>
                      <StatusTileValue $primary>Pending Verification</StatusTileValue>
                    </StatusTile>
                    <StatusTile>
                      <StatusTileLabel>Estimated Time</StatusTileLabel>
                      <StatusTileValue>~24 Hours</StatusTileValue>
                    </StatusTile>
                  </StatusGrid>

                  <SuccessActions>
                    {submittedResidenceId ? (
                      <ViewResBtn onClick={() => navigate(`/residence/${submittedResidenceId}`)}>
                        View Residence
                        <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>visibility</span>
                      </ViewResBtn>
                    ) : null}
                    <ReviewAnotherBtn onClick={resetForm}>
                      Review Another Residence
                      <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>add_reaction</span>
                    </ReviewAnotherBtn>
                  </SuccessActions>

                  <EngagementNudge>
                    <span className="material-symbols-outlined">emoji_events</span>
                    <div>
                      <NudgeTitle>Help more students!</NudgeTitle>
                      <NudgeSub>Users with 5+ reviews get the "Campus Legend" badge.</NudgeSub>
                    </div>
                  </EngagementNudge>
              </SuccessWrap>
            </CardEl>
            </div>
          </Body>
        </>
      )}

      <Footer />
    </Page>
  )
}
