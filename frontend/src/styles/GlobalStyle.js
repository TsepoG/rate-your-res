import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  .material-symbols-outlined {
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  }

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: ${({ theme }) => theme.fonts.body};
    background-color: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.onSurface};
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    padding-bottom: 80px;

    @media (min-width: 768px) {
      padding-bottom: 0;
    }
  }

  img { display: block; max-width: 100%; }

  a { color: inherit; text-decoration: none; }

  button { font-family: ${({ theme }) => theme.fonts.body}; cursor: pointer; border: none; background: none; }

  input, textarea, select { font-family: ${({ theme }) => theme.fonts.body}; }
`

export default GlobalStyle
