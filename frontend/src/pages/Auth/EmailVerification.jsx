import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import styled from 'styled-components'
import { verifyEmail, resendCode } from '../../services/auth'
import { ApiError, SubmitBtn } from './SignUp'

const CODE_LENGTH = 6
const RESEND_SECONDS = 45

const VerifyPage = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.surface};
  display: flex;
  flex-direction: column;
`

const VerifyNav = styled.header`
  height: ${({ theme }) => theme.navHeight};
  display: flex;
  align-items: center;
  padding: 0 1.5rem;
  background: ${({ theme }) => theme.colors.surfaceCard};
  border-bottom: 1px solid #eaecf0;
`

const VerifyNavLogo = styled(Link)`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.2rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
  letter-spacing: -0.02em;
  text-decoration: none;
`

const VerifyBody = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 1rem 4rem;
`

const VerifyCard = styled.div`
  background: ${({ theme }) => theme.colors.surfaceCard};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.float};
  padding: 2.75rem 2.5rem 2.25rem;
  width: 100%;
  max-width: 480px;
  text-align: center;

  @media (max-width: 768px) {
    padding: 2rem 1.25rem 1.75rem;
  }
`

const VerifyIconCircle = styled.div`
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primaryDark}, ${({ theme }) => theme.colors.primary});
  color: #fff;
  font-size: 2.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  box-shadow: 0 8px 24px rgba(79, 70, 229, 0.3);
`

const VerifyTitle = styled.h1`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.5rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.onSurface};
  letter-spacing: -0.02em;
  margin-bottom: 0.5rem;
`

const VerifySub = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  margin-bottom: 1.75rem;
  line-height: 1.6;
`

const VerifyEmail = styled.strong`
  color: ${({ theme }) => theme.colors.onSurface};
`

const OtpRow = styled.div`
  display: flex;
  gap: 0.6rem;
  justify-content: center;
  margin-bottom: 1.75rem;

  @media (max-width: 768px) {
    gap: 0.45rem;
  }

  @media (max-width: 420px) {
    gap: 0.35rem;
  }
`

const OtpInput = styled.input`
  width: 3rem;
  height: 3.5rem;
  border: 2px solid ${({ $filled, theme }) => $filled ? theme.colors.primary : '#e2e4e9'};
  border-radius: ${({ theme }) => theme.radii.md};
  text-align: center;
  font-size: 1.35rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.onSurface};
  background: ${({ $filled }) => $filled ? 'rgba(79, 70, 229, 0.04)' : '#f7f9fb'};
  transition: border-color 0.15s, background 0.15s;
  caret-color: ${({ theme }) => theme.colors.primary};
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    background: #fff;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.12);
  }

  @media (max-width: 768px) {
    width: 2.6rem;
    height: 3.1rem;
    font-size: 1.2rem;
  }

  @media (max-width: 420px) {
    width: 2.2rem;
    height: 2.8rem;
    font-size: 1.1rem;
  }
`

const ResendRow = styled.div`
  margin-bottom: 1.25rem;
`

const ResendCountdown = styled.span`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
`

const ResendLink = styled.button`
  font-size: 0.85rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
  font-family: inherit;

  &:disabled { opacity: 0.6; cursor: not-allowed; }
`

const ChangeEmail = styled(Link)`
  display: block;
  font-size: 0.82rem;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  text-decoration: none;
  margin-bottom: 1.25rem;
  transition: color 0.15s;

  &:hover { color: ${({ theme }) => theme.colors.primary}; }
`

const VerifyNote = styled.p`
  font-size: 0.78rem;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  padding-top: 1rem;
  border-top: 1px solid #f0f1f3;
  line-height: 1.5;
`

const FaqSection = styled.div`
  width: 100%;
  max-width: 480px;
  margin-top: 1.25rem;
  background: ${({ theme }) => theme.colors.surfaceCard};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.card};
  overflow: hidden;
`

const FaqToggle = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.onSurface};
  text-align: left;
  font-family: inherit;

  &:hover { background: ${({ theme }) => theme.colors.surfaceLow}; }
`

const FaqIcon = styled.span`
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  font-size: 1rem;
`

const FaqBody = styled.div`
  padding: 0 1.5rem 1.25rem;

  p {
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.onSurfaceMuted};
    line-height: 1.7;
  }

  code {
    font-family: monospace;
    background: ${({ theme }) => theme.colors.surfaceLow};
    padding: 0.1em 0.4em;
    border-radius: 4px;
    font-size: 0.85em;
    color: ${({ theme }) => theme.colors.primary};
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
      <VerifyNav>
        <VerifyNavLogo to="/">RateYourRes</VerifyNavLogo>
      </VerifyNav>

      <VerifyBody>
        <VerifyCard>
          <VerifyIconCircle>&#128231;</VerifyIconCircle>

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
                  $filled={!!digit}
                  value={digit}
                  onChange={e => handleCodeChange(i, e.target.value)}
                  onKeyDown={e => handleCodeKeyDown(i, e)}
                  aria-label={`Digit ${i + 1}`}
                  autoComplete="one-time-code"
                />
              ))}
            </OtpRow>

            <SubmitBtn type="submit" disabled={loading}>
              {loading ? 'Verifying…' : 'Verify Email'}
            </SubmitBtn>
          </form>

          <ResendRow>
            {countdown > 0 ? (
              <ResendCountdown>
                Didn't receive the code? Resend in{' '}
                <strong>{countdownStr}</strong>
              </ResendCountdown>
            ) : (
              <ResendLink
                type="button"
                onClick={handleResend}
                disabled={resending}
              >
                {resending ? 'Sending…' : 'Resend now'}
              </ResendLink>
            )}
          </ResendRow>

          <ChangeEmail to="/signup">
            &#8592; Change email address
          </ChangeEmail>

          <VerifyNote>
            &#127979; We only accept official university student email addresses
          </VerifyNote>
        </VerifyCard>

        {/* FAQ accordion */}
        <FaqSection>
          <FaqToggle
            type="button"
            onClick={() => setFaqOpen(o => !o)}
            aria-expanded={faqOpen}
          >
            Why do we verify?
            <FaqIcon>{faqOpen ? '∧' : '∨'}</FaqIcon>
          </FaqToggle>
          {faqOpen && (
            <FaqBody>
              <p>
                We verify your student email to ensure all reviews come from real
                South African university students. This keeps our platform trustworthy
                and prevents fake reviews. Only <code>.ac.za</code> email addresses are
                accepted.
              </p>
            </FaqBody>
          )}
        </FaqSection>
      </VerifyBody>
    </VerifyPage>
  )
}
