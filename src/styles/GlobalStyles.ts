import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  :root {
    font-family: ${({ theme }) => theme.typography.fontFamily.sans};
    line-height: 1.5;
    font-weight: ${({ theme }) => theme.typography.weights.regular};
    
    color-scheme: dark;
    color: ${({ theme }) => theme.colors.text.primary};
    background-color: ${({ theme }) => theme.colors.background};
    
    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    margin: 0;
    display: block;
    min-width: 320px;
    min-height: 100vh;
    overflow-x: hidden;
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text.primary};
  }

  a {
    text-decoration: none;
    color: inherit;
    transition: ${({ theme }) => theme.transitions.default};
  }

  button {
    font-family: inherit;
  }

  html {
    scroll-behavior: smooth;
  }
`;
