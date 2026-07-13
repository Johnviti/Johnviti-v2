import { ThemeProvider } from 'styled-components';
import { theme } from '@/styles/theme';
import { GlobalStyles } from '@/styles/GlobalStyles';
import { Headset3DConfigurator } from '@/components/ui/Headset3D';

const ThreeDTestPage = () => (
  <ThemeProvider theme={theme}>
    <GlobalStyles />
    <div className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-[#020617]">
      <h1 className="pointer-events-none absolute top-10 z-20 text-2xl font-bold text-white">
        Página de Teste 3D
      </h1>
      <Headset3DConfigurator />
    </div>
  </ThemeProvider>
);

export default ThreeDTestPage;
