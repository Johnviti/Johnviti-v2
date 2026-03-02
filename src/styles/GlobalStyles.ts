import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  :root {
    color-scheme: dark;
    --bg-body: #0b0b0b1a;
    --dark: #0909081f;
    --dark-hsl: 240, 10%, 5%;
  }



  body {
    margin: 0;
    display: block;
    min-width: 320px;
    min-height: 100vh;
    overflow-x: hidden;
  }

  .container-custom {
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    padding-left: ${({ theme }) => theme.layout.container.gutter};
    padding-right: ${({ theme }) => theme.layout.container.gutter};
    @media (min-width: 1024px) {
      padding-left: ${({ theme }) => theme.layout.container.margin};
      padding-right: ${({ theme }) => theme.layout.container.margin};
    }
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
