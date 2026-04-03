import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import styled from 'styled-components'
import { verifyEmail, resendCode } from '../../services/auth'

const CODE_LENGTH = 6
const RESEND_SECONDS = 45

const VerifyPage = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.surface};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
`

const VerifyGlow = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 380px;
  height: 380px;
  background: ${({ theme }) => theme.colors.primary};
  opacity: 0.03;
  filter: blur(100px);
  border-radius: 50%;
  transform: translate(50%, -50%);
  pointer-events: none;
  z-index: 0;
`

const VerifyGlowBottom = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 380px;
  height: 380px;
  background: ${({ theme }) => theme.colors.tertiaryBadge};
  opacity: 0.03;
  filter: blur(100px);
  border-radius: 50%;
  transform: translate(-50%, 50%);
  pointer-events: none;
  z-index: 0;
`

const VerifyNav = styled.header`
  height: ${({ theme }) => theme.navHeight};
  display: flex;
  align-items: center;
  padding: 0 1.5rem;
  background: ${({ theme }) => theme.colors.surfaceLow};
  position: relative;
  z-index: 1;
`

const VerifyNavLogo = styled(Link)`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.2rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
  letter-spacing: -0.02em;
  text-decoration: none;
`

const VerifyBody = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem 4rem;
  position: relative;
  z-index: 1;
`

const VerifyCard = styled.div`
  background: ${({ theme }) => theme.colors.surfaceCard};
  border-radius: ${({ theme }) => theme.radii.xl};
  box-shadow: 0 20px 40px rgba(25, 28, 30, 0.06);
  padding: 3rem 2.5rem;
  width: 100%;
  max-width: 520px;
  text-align: center;

  @media (max-width: 768px) {
    padding: 2rem 1.25rem 1.75rem;
  }
`

const VerifyIconCircle = styled.div`
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primaryFixed};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem;

  .material-symbols-outlined {
    font-size: 2.25rem;
    color: ${({ theme }) => theme.colors.primary};
    font-variation-settings: 'FILL' 1;
  }
`

const VerifyTitle = styled.h1`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.75rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.onSurface};
  letter-spacing: -0.02em;
  margin-bottom: 0.75rem;
`

const VerifySub = styled.p`
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  margin-bottom: 2.5rem;
  line-height: 1.6;
`

const VerifyEmail = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`

const OtpRow = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.5rem;
  margin-bottom: 2.5rem;

  @media (max-width: 420px) {
    gap: 0.35rem;
  }
`

const OtpInput = styled.input`
  width: 100%;
  height: 56px;
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  text-align: center;
  font-size: 1.35rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.onSurface};
  background: ${({ theme }) => theme.colors.surfaceHigh};
  transition: background 0.15s, box-shadow 0.15s;
  caret-color: ${({ theme }) => theme.colors.primary};
  font-family: inherit;

  &::placeholder { color: ${({ theme }) => theme.colors.outlineVariant}; }

  &:focus {
    outline: none;
    background: ${({ theme }) => theme.colors.surfaceCard};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}40;
  }

  @media (max-width: 768px) {
    height: 48px;
    font-size: 1.2rem;
  }
`

const VerifyBtn = styled.button`
  width: 100%;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.accent};
  color: #fff;
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 700;
  font-size: 1rem;
  border: none;
  border-radius: ${({ theme }) => theme.radii.full};
  cursor: pointer;
  transition: background 0.15s, transform 0.1s;
  margin-bottom: 2rem;

  &:hover:not(:disabled) { background: #ea580c; }
  &:active:not(:disabled) { transform: scale(0.98); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`

const ApiError = styled.div`
  background: #fef2f2;
  color: #b91c1c;
  border: 1px solid #fecaca;
  border-radius: ${({ theme }) => theme.radii.md};
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  margin-bottom: 1.25rem;
  text-align: left;
`

const ResendRow = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  margin-bottom: 1rem;
  font-weight: 500;
`

const ResendCountdown = styled.span`
  color: ${({ theme }) => theme.colors.muted};
`

const ResendLink = styled.button`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  text-decoration: underline;
  text-underline-offset: 3px;

  &:disabled { opacity: 0.6; cursor: not-allowed; }
`

const ChangeEmail = styled(Link)`
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  transition: opacity 0.15s;

  &:hover { text-decoration: underline; text-underline-offset: 3px; }
`

const VerifyNote = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  text-align: left;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid ${({ theme }) => theme.colors.surfaceLow};
  background: ${({ theme }) => theme.colors.surfaceLow};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: 1rem;
  margin-top: 2rem;

  .material-symbols-outlined {
    color: ${({ theme }) => theme.colors.primary};
    font-size: 1.1rem;
    flex-shrink: 0;
    margin-top: 0.1rem;
  }

  p {
    font-size: 0.78rem;
    color: ${({ theme }) => theme.colors.onSurfaceMuted};
    line-height: 1.6;
  }
`

const FaqSection = styled.div`
  width: 100%;
  max-width: 520px;
  margin-top: 1.25rem;
  background: ${({ theme }) => theme.colors.surfaceLow};
  border-radius: ${({ theme }) => theme.radii.xl};
  overflow: hidden;
`

const FaqToggle = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 0.95rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.onSurface};
  text-align: left;
  transition: background 0.15s;

  &:hover { background: ${({ theme }) => theme.colors.surfaceHigh}; }

  .material-symbols-outlined {
    transition: transform 0.3s;
    transform: ${({ $open }) => $open ? 'rotate(180deg)' : 'rotate(0deg)'};
    color: ${({ theme }) => theme.colors.onSurfaceMuted};
  }
`

const FaqBody = styled.div`
  padding: 0 1.5rem 1.5rem;

  p {
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.onSurfaceMuted};
    line-height: 1.7;
    margin-bottom: 1rem;
  }
`

const FaqCheck = styled.li`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  margin-bottom: 0.5rem;

  .material-symbols-outlined {
    font-size: 1rem;
    color: ${({ theme }) => theme.colors.primary};
    font-variation-settings: 'FILL' 1;
    flex-shrink: 0;
  }
`

export default function EmailVerification() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email') || ''

  const [code, setCode] = useState(Array(CODE_LENGTH).fill(''))
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  const [countdown, setCountdown] = useState(RESEND_SECONDS)
  const [resending, setResending] = useState(false)
  const [faqOpen, setFaqOpen] = useState(false)

  const inputRefs = useRef([])

  useEffect(() => {
    if (countdown <= 0) return
    const id = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(id)
  }, [countdown])

  function handleCodeChange(index, value) {
    const char = value.replace(/\D/g, '').slice(-1)
    const next = [...code]
    next[index] = char
    setCode(next)
    setApiError('')

    if (char && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  function handleCodeKeyDown(index, e) {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  function handleCodePaste(e) {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, CODE_LENGTH)
    if (!pasted) return
    const next = [...code]
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i]
    setCode(next)
    const focusIdx = Math.min(pasted.length, CODE_LENGTH - 1)
    inputRefs.current[focusIdx]?.focus()
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const fullCode = code.join('')
    if (fullCode.length < CODE_LENGTH) {
      setApiError('Please enter the full 6-digit code')
      return
    }
    setLoading(true)
    setApiError('')
    try {
      await verifyEmail({ email, code: fullCode })
      navigate('/signin')
    } catch (err) {
      setApiError(err?.response?.data?.message || 'Invalid or expired code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {
    if (countdown > 0) return
    setResending(true)
    setApiError('')
    try {
      await resendCode({ email })
      setCountdown(RESEND_SECONDS)
      setCode(Array(CODE_LENGTH).fill(''))
      inputRefs.current[0]?.focus()
    } catch (err) {
      setApiError(err?.response?.data?.message || 'Failed to resend code.')
    } finally {
      setResending(false)
    }
  }

  const minutes = Math.floor(countdown / 60)
  const seconds = countdown % 60
  const countdownStr = `${minutes}:${String(seconds).padStart(2, '0')}`

  return (
    <VerifyPage>
      <VerifyGlow />
      <VerifyGlowBottom />

      <VerifyNav>
        <VerifyNavLogo to="/">RateYourRes</VerifyNavLogo>
      </VerifyNav>

      <VerifyBody>
        <VerifyCard>
          <VerifyIconCircle>
            <span className="material-symbols-outlined">mark_email_unread</span>
          </VerifyIconCircle>

          <VerifyTitle>Verify your student email</VerifyTitle>
          <VerifySub>
            We've sent a 6-digit code to{' '}
            <VerifyEmail>{email || 'your email'}</VerifyEmail>
          </VerifySub>

          {apiError && <ApiError>{apiError}</ApiError>}

          <form onSubmit={handleSubmit}>
            <OtpRow onPaste={handleCodePaste}>
              {code.map((digit, i) => (
                <OtpInput
                  key={i}
                  ref={el => (inputRefs.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  placeholder="•"
                  value={digit}
                  onChange={e => handleCodeChange(i, e.target.value)}
                  onKeyDown={e => handleCodeKeyDown(i, e)}
                  aria-label={`Digit ${i + 1}`}
                  autoComplete="one-time-code"
                />
              ))}
            </OtpRow>

            <VerifyBtn type="submit" disabled={loading}>
              {loading ? 'Verifying…' : 'Verify Email'}
            </VerifyBtn>
          </form>

          <div style={{ marginBottom: '1rem' }}>
            {countdown > 0 ? (
              <ResendRow>
                Didn't receive the code?{' '}
                <ResendCountdown>Resend in <strong>{countdownStr}</strong></ResendCountdown>
              </ResendRow>
            ) : (
              <ResendRow>
                Didn't receive the code?{' '}
                <ResendLink type="button" onClick={handleResend} disabled={resending}>
                  {resending ? 'Sending…' : 'Resend now'}
                </ResendLink>
              </ResendRow>
            )}
          </div>

          <ChangeEmail to="/signup">Change email address</ChangeEmail>

          <VerifyNote>
            <span className="material-symbols-outlined">info</span>
            <p>
              We only accept official university student email addresses to ensure reviews come from real students.
            </p>
          </VerifyNote>
        </VerifyCard>

        {/* FAQ accordion */}
        <FaqSection>
          <FaqToggle
            type="button"
            $open={faqOpen}
            onClick={() => setFaqOpen(o => !o)}
            aria-expanded={faqOpen}
          >
            Why do we verify?
            <span className="material-symbols-outlined">expand_more</span>
          </FaqToggle>
          {faqOpen && (
            <FaqBody>
              <p>
                To maintain the integrity of RateYourRes, we require all reviewers to verify their university affiliation. This prevents fake reviews, bot spam, and ensures the feedback comes from actual residents.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <FaqCheck>
                  <span className="material-symbols-outlined">check_circle</span>
                  Verified community of real students
                </FaqCheck>
                <FaqCheck>
                  <span className="material-symbols-outlined">check_circle</span>
                  High-quality, reliable residential data
                </FaqCheck>
              </ul>
            </FaqBody>
          )}
        </FaqSection>
      </VerifyBody>
    </VerifyPage>
  )
}
