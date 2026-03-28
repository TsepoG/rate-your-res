import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { signUp } from '../../services/auth'
import { getUniversities } from '../../services/universities'

/* ── Shared Auth styled components (also used by SignIn) ── */

export const AuthPage = styled.div`
  display: flex;
  min-height: 100vh;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`

export const LeftPanel = styled.div`
  flex: 0 0 42%;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 3rem 3.5rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 0;
  }

  @media (max-width: 768px) {
    flex: none;
    padding: 2.5rem 1.5rem;
  }
`

export const LeftContent = styled.div`
  position: relative;
  z-index: 1;
`

export const LogoMark = styled.div`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.75rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-bottom: 3rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  .material-symbols-outlined {
    font-size: 2.25rem;
  }

  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
    font-size: 1.4rem;
    .material-symbols-outlined { font-size: 1.75rem; }
  }
`

export const LeftHeading = styled.h2`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.9rem;
  font-weight: 800;
  line-height: 1.25;
  letter-spacing: -0.02em;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
`

export const Bullets = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  li {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 1.1rem;
    color: rgba(255, 255, 255, 0.9);
    font-weight: 500;

    @media (max-width: 768px) {
      font-size: 0.95rem;
      gap: 0.75rem;
    }
  }

  @media (max-width: 768px) {
    gap: 1rem;
  }
`

export const BulletIcon = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  backdrop-filter: blur(4px);
  transition: transform 0.2s;

  li:hover & { transform: scale(1.1); }

  .material-symbols-outlined {
    font-size: 1.25rem;
    font-variation-settings: 'FILL' 1;
  }

  @media (max-width: 768px) {
    width: 2rem;
    height: 2rem;
    .material-symbols-outlined { font-size: 1rem; }
  }
`

export const LeftDecoration = styled.div`
  display: none;
`

export const LeftImageWrap = styled.div`
  position: relative;
  z-index: 1;
  margin-top: 3rem;
  border-radius: ${({ theme }) => theme.radii.xl};
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);

  img {
    width: 100%;
    height: 192px;
    object-fit: cover;
    opacity: 0.8;
    mix-blend-mode: overlay;
    display: block;
  }

  @media (max-width: 768px) {
    margin-top: 2rem;
    img { height: 140px; }
  }
`

export const LeftImageOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(53, 37, 205, 0.6) 0%, transparent 60%);
`

export const RightPanel = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.surfaceCard};
  padding: 2.5rem 2rem;
  overflow-y: auto;

  @media (max-width: 768px) {
    padding: 2rem 1.25rem;
    align-items: flex-start;
  }
`

export const FormWrapper = styled.div`
  width: 100%;
  max-width: 420px;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`

export const Tabs = styled.div`
  display: flex;
  gap: 0;
  margin-bottom: 2rem;
  border-bottom: 2px solid #f0f1f3;
`

export const Tab = styled(Link)`
  flex: 1;
  text-align: center;
  padding: 0.65rem 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ $active, theme }) => $active ? theme.colors.primary : theme.colors.onSurfaceMuted};
  cursor: pointer;
  border-bottom: 2px solid ${({ $active, theme }) => $active ? theme.colors.primary : 'transparent'};
  margin-bottom: -2px;
  transition: color 0.15s, border-color 0.15s;
  text-decoration: none;
  display: block;

  &:hover { color: ${({ theme }) => theme.colors.primary}; }
`

export const TabSpan = styled.span`
  flex: 1;
  text-align: center;
  padding: 0.65rem 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ $active, theme }) => $active ? theme.colors.primary : theme.colors.onSurfaceMuted};
  border-bottom: 2px solid ${({ $active, theme }) => $active ? theme.colors.primary : 'transparent'};
  margin-bottom: -2px;
  transition: color 0.15s, border-color 0.15s;
`

export const FormTitle = styled.h1`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.65rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.onSurface};
  letter-spacing: -0.02em;
  margin-bottom: 0.3rem;
`

export const FormSub = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  margin-bottom: 1.75rem;
`

export const ApiError = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
  border-radius: ${({ theme }) => theme.radii.md};
  padding: 0.75rem 1rem;
  font-size: 0.85rem;
  margin-bottom: 1.25rem;
`

export const Field = styled.div`
  margin-bottom: 1.25rem;
`

export const Label = styled.label`
  display: block;
  font-size: 0.84rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.onSurface};
  margin-bottom: 0.4rem;
`

export const LabelRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.4rem;
`

export const Input = styled.input`
  width: 100%;
  padding: 0.7rem 0.95rem;
  border: 1.5px solid ${({ $error }) => $error ? '#ef4444' : '#e2e4e9'};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.onSurface};
  background: ${({ theme }) => theme.colors.surface};
  transition: border-color 0.15s, background 0.15s;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    background: #fff;
  }
`

const SELECT_ARROW = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236b7280' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E\")"

export const SelectInput = styled.select`
  width: 100%;
  padding: 0.7rem 0.95rem;
  border: 1.5px solid ${({ $error }) => $error ? '#ef4444' : '#e2e4e9'};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.onSurface};
  background: ${({ theme }) => theme.colors.surface};
  appearance: none;
  background-image: ${SELECT_ARROW};
  background-repeat: no-repeat;
  background-position: right 1rem center;
  cursor: pointer;
  transition: border-color 0.15s;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    background-color: #fff;
  }
`

export const ErrorMsg = styled.span`
  display: block;
  font-size: 0.78rem;
  color: #ef4444;
  margin-top: 0.3rem;
`

export const TermsLabel = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
  font-size: 0.84rem;
  color: ${({ theme }) => theme.colors.onSurface};
  cursor: pointer;
  margin-bottom: 1rem;
  line-height: 1.5;
`

export const Checkbox = styled.input`
  accent-color: ${({ theme }) => theme.colors.primary};
  width: 1rem;
  height: 1rem;
  margin-top: 0.1rem;
  flex-shrink: 0;
`

export const InlineLink = styled.a`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  text-decoration: none;

  &:hover { text-decoration: underline; }
`

export const ForgotLink = styled.a`
  font-size: 0.78rem;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  text-decoration: none;

  &:hover { text-decoration: underline; }
`

export const SubmitBtn = styled.button`
  width: 100%;
  padding: 0.85rem;
  font-size: 0.95rem;
  margin-top: 0.5rem;
  margin-bottom: 1.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.onPrimary};
  font-weight: 600;
  font-family: inherit;
  border: none;
  cursor: pointer;
  transition: opacity 0.15s, transform 0.15s;

  &:hover { opacity: 0.9; transform: translateY(-1px); }
  &:active { transform: translateY(0); }
  &:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
`

export const SwitchLink = styled.p`
  text-align: center;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
`

export const PrimaryLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  text-decoration: none;

  &:hover { text-decoration: underline; }
`

export default function SignUp() {
  const navigate = useNavigate()

  const [universities, setUniversities] = useState([])
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    universityId: '',
    agreeTerms: false,
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')

  useEffect(() => {
    getUniversities()
      .then(data => setUniversities(Array.isArray(data) ? data : (data.universities || [])))
      .catch(() => setUniversities([]))
  }, [])

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
    setApiError('')
  }

  function validate() {
    const e = {}
    if (!form.email) e.email = 'Email is required'
    else if (!form.email.toLowerCase().endsWith('.ac.za'))
      e.email = 'Must be an official university email (ends in .ac.za)'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 8) e.password = 'Password must be at least 8 characters'
    if (!form.confirmPassword) e.confirmPassword = 'Please confirm your password'
    else if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match'
    if (!form.universityId) e.universityId = 'Please select your university'
    if (!form.agreeTerms) e.agreeTerms = 'You must agree to the terms'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) { setErrors(e2); return }

    setLoading(true)
    setApiError('')
    try {
      await signUp({ email: form.email, password: form.password, universityId: form.universityId })
      navigate(`/verify-email?email=${encodeURIComponent(form.email)}`)
    } catch (err) {
      setApiError(err?.response?.data?.message || 'Sign up failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthPage>
      {/* Left panel */}
      <LeftPanel>
        <LeftContent>
          <LogoMark>
            <span className="material-symbols-outlined">school</span>
            RateYourRes
          </LogoMark>
          <LeftHeading>
            Your voice shapes the next student's journey
          </LeftHeading>
          <Bullets>
            <li>
              <BulletIcon><span className="material-symbols-outlined">star</span></BulletIcon>
              Rate your residence
            </li>
            <li>
              <BulletIcon><span className="material-symbols-outlined">verified</span></BulletIcon>
              Read honest student reviews
            </li>
            <li>
              <BulletIcon><span className="material-symbols-outlined">groups</span></BulletIcon>
              Help thousands of students choose wisely
            </li>
          </Bullets>
          <LeftImageWrap>
            <img
              src="https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&q=80"
              alt="University campus"
            />
            <LeftImageOverlay />
          </LeftImageWrap>
        </LeftContent>
        <LeftDecoration aria-hidden="true" />
      </LeftPanel>

      {/* Right panel */}
      <RightPanel>
        <FormWrapper>
          {/* Tab switcher */}
          <Tabs>
            <TabSpan $active>Sign Up</TabSpan>
            <Tab to="/signin">Sign In</Tab>
          </Tabs>

          <FormTitle>Create your account</FormTitle>
          <FormSub>Join thousands of SA students sharing real reviews</FormSub>

          {apiError && <ApiError>{apiError}</ApiError>}

          <form onSubmit={handleSubmit} noValidate>
            <Field>
              <Label htmlFor="email">University email</Label>
              <Input
                id="email"
                type="email"
                $error={!!errors.email}
                placeholder="student@university.ac.za"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                autoComplete="email"
              />
              {errors.email && <ErrorMsg>{errors.email}</ErrorMsg>}
            </Field>

            <Field>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                $error={!!errors.password}
                placeholder="Minimum 8 characters"
                value={form.password}
                onChange={e => set('password', e.target.value)}
                autoComplete="new-password"
              />
              {errors.password && <ErrorMsg>{errors.password}</ErrorMsg>}
            </Field>

            <Field>
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input
                id="confirmPassword"
                type="password"
                $error={!!errors.confirmPassword}
                placeholder="Re-enter your password"
                value={form.confirmPassword}
                onChange={e => set('confirmPassword', e.target.value)}
                autoComplete="new-password"
              />
              {errors.confirmPassword && <ErrorMsg>{errors.confirmPassword}</ErrorMsg>}
            </Field>

            <Field>
              <Label htmlFor="university">University</Label>
              <SelectInput
                id="university"
                $error={!!errors.universityId}
                value={form.universityId}
                onChange={e => set('universityId', e.target.value)}
              >
                <option value="">Select your university</option>
                {universities.map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </SelectInput>
              {errors.universityId && <ErrorMsg>{errors.universityId}</ErrorMsg>}
            </Field>

            <TermsLabel>
              <Checkbox
                type="checkbox"
                checked={form.agreeTerms}
                onChange={e => set('agreeTerms', e.target.checked)}
              />
              <span>
                I agree to the{' '}
                <InlineLink href="#">Terms &amp; Conditions</InlineLink>
                {' '}and{' '}
                <InlineLink href="#">Privacy Policy</InlineLink>
              </span>
            </TermsLabel>
            {errors.agreeTerms && <ErrorMsg style={{ marginBottom: '0.35rem', display: 'block' }}>{errors.agreeTerms}</ErrorMsg>}

            <SubmitBtn type="submit" disabled={loading}>
              {loading ? 'Creating account…' : 'Create Account'}
            </SubmitBtn>
          </form>

          <SwitchLink>
            Already have an account?{' '}
            <PrimaryLink to="/signin">Sign in</PrimaryLink>
          </SwitchLink>
        </FormWrapper>
      </RightPanel>
    </AuthPage>
  )
}
