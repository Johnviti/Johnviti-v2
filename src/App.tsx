import { Header } from './components/layout/Header';
import { Hero } from './components/layout/Hero';
import { GlobalStyles } from './styles/GlobalStyles';

function App() {
  return (
    <>
      <GlobalStyles />
      <Header />
      <main>
        <Hero />
      </main>
    </>
  );
}

export default App;
