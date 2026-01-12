import { ThemeProvider } from 'styled-components';
import { Header } from '@/components/layout/Header';
import { Hero } from '@/components/layout/Hero';
import { GlobalStyles } from '@/styles/GlobalStyles';
import { theme } from '@/styles/theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Header />
      <main>
        <Hero />
      </main>
    </ThemeProvider>
  );
}

export default App;
