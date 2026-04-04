import { Component } from 'react'
import styled from 'styled-components'

/* ── Styled Components ── */

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.surface};
  padding: 24px;
`

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surfaceCard};
  border-radius: ${({ theme }) => theme.radii.xl};
  box-shadow: ${({ theme }) => theme.shadows.float};
  padding: 48px 40px;
  max-width: 480px;
  width: 100%;
  text-align: center;
`

const IconWrap = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 20px;
  background: #fee2e2;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;

  .material-symbols-outlined {
    font-size: 2.25rem;
    color: #dc2626;
  }
`

const Title = styled.h1`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.5rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.onSurface};
  margin-bottom: 12px;
  letter-spacing: -0.02em;
`

const Message = styled.p`
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  line-height: 1.6;
  margin-bottom: 32px;
`

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (min-width: 400px) {
    flex-direction: row;
    justify-content: center;
  }
`

const BtnPrimary = styled.button`
  flex: 1;
  padding: 12px 24px;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 0.9rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: opacity 0.15s;

  &:hover { opacity: 0.9; }
`

const BtnOutline = styled.a`
  flex: 1;
  padding: 12px 24px;
  border-radius: ${({ theme }) => theme.radii.full};
  border: 2px solid ${({ theme }) => theme.colors.outlineVariant};
  color: ${({ theme }) => theme.colors.onSurface};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 0.9rem;
  font-weight: 700;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.15s;

  &:hover { border-color: ${({ theme }) => theme.colors.primary}; }
`

const ErrorDetail = styled.pre`
  margin-top: 24px;
  padding: 16px;
  background: ${({ theme }) => theme.colors.surfaceLow};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  text-align: left;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-word;
`

/* ── Error UI ── */

function ErrorFallback({ error, onReset }) {
  const isDev = import.meta.env.DEV

  return (
    <Page>
      <Card>
        <IconWrap>
          <span className="material-symbols-outlined">error</span>
        </IconWrap>

        <Title>Something went wrong</Title>
        <Message>
          An unexpected error occurred. You can try again or go back to the home page.
        </Message>

        <Actions>
          <BtnPrimary onClick={onReset}>Try again</BtnPrimary>
          <BtnOutline href="/">Go home</BtnOutline>
        </Actions>

        {isDev && error && (
          <ErrorDetail>{error.message}</ErrorDetail>
        )}
      </Card>
    </Page>
  )
}

/* ── Error Boundary ── */

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
    this.reset = this.reset.bind(this)
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) {
      console.error('[ErrorBoundary]', error, info.componentStack)
    }
  }

  reset() {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} onReset={this.reset} />
    }
    return this.props.children
  }
}
