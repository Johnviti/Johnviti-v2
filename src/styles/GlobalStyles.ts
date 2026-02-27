import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  :root {
    --bg-color: ${({ theme }) => theme.colors.background};
    --text-primary: ${({ theme }) => theme.colors.text.primary};
    --text-secondary: ${({ theme }) => theme.colors.text.secondary};
    --primary-main: ${({ theme }) => theme.colors.primary.main};
    
    --glass-bg: ${({ theme }) => theme.colors.glass.background};
    --glass-border: ${({ theme }) => theme.colors.glass.border};
    --glass-hover: ${({ theme }) => theme.colors.glass.hover};

    --container-margin: ${({ theme }) => theme.layout.container.margin};
    --container-gutter: ${({ theme }) => theme.layout.container.gutter};
    --container-columns: ${({ theme }) => theme.layout.container.columns};

    font-family: ${({ theme }) => theme.typography.fontFamily.sans};
    line-height: 1.5;
    font-weight: ${({ theme }) => theme.typography.weights.regular};
    
    color-scheme: dark;
    color: var(--text-primary);
    background-color: var(--bg-color);
    
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
    background-color: var(--bg-color);
    color: var(--text-primary);
    cursor: url(http://www.rw-designer.com/cursor-extern.php?id=129398), auto;
  }

  .container-custom {
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    padding-left: var(--container-gutter);
    padding-right: var(--container-gutter);
    /* For large screens apply the specific margin explicitly */
    @media (min-width: 1024px) {
      padding-left: var(--container-margin);
      padding-right: var(--container-margin);
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
