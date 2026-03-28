import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signIn } from '../../services/auth'
import { useAuth } from '../../context/AuthContext'
import {
  AuthPage, LeftPanel, LeftContent, LogoMark, LeftHeading, Bullets, BulletIcon,
  LeftDecoration, LeftImageWrap, LeftImageOverlay,
  RightPanel, FormWrapper, Tabs, Tab, TabSpan, FormTitle, FormSub, ApiError,
  Field, Label, LabelRow, Input, ForgotLink, SubmitBtn, SwitchLink, PrimaryLink,
} from './SignUp'

export default function SignIn() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
    setApiError('')
  }

  function validate() {
    const e = {}
    if (!form.email) e.email = 'Email is required'
    if (!form.password) e.password = 'Password is required'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) { setErrors(e2); return }

    setLoading(true)
    setApiError('')
    try {
      const tokens = await signIn({ email: form.email, password: form.password })
      login(tokens)
      navigate('/')
    } catch (err) {
      setApiError(err?.response?.data?.message || 'Incorrect email or password.')
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
            <Tab to="/signup">Sign Up</Tab>
            <TabSpan $active>Sign In</TabSpan>
          </Tabs>

          <FormTitle>Welcome back</FormTitle>
          <FormSub>Sign in to your student account</FormSub>

          {apiError && <ApiError>{apiError}</ApiError>}

          <form onSubmit={handleSubmit} noValidate>
            <Field>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                $error={!!errors.email}
                placeholder="student@university.ac.za"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                autoComplete="email"
              />
              {errors.email && <span style={{ display: 'block', fontSize: '0.78rem', color: '#ef4444', marginTop: '0.3rem' }}>{errors.email}</span>}
            </Field>

            <Field>
              <LabelRow>
                <Label htmlFor="password">Password</Label>
                <ForgotLink href="#">Forgot password?</ForgotLink>
              </LabelRow>
              <Input
                id="password"
                type="password"
                $error={!!errors.password}
                placeholder="Enter your password"
                value={form.password}
                onChange={e => set('password', e.target.value)}
                autoComplete="current-password"
              />
              {errors.password && <span style={{ display: 'block', fontSize: '0.78rem', color: '#ef4444', marginTop: '0.3rem' }}>{errors.password}</span>}
            </Field>

            <SubmitBtn type="submit" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In'}
            </SubmitBtn>
          </form>

          <SwitchLink>
            Don't have an account?{' '}
            <PrimaryLink to="/signup">Sign up</PrimaryLink>
          </SwitchLink>
        </FormWrapper>
      </RightPanel>
    </AuthPage>
  )
}
