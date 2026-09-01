import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { casesEditorPlugin } from './vite/casesEditor'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // Editor local de cases (`/revisao`). Só liga em `npm run dev` com a
  // variável no `.env`; o plugin usa `apply: 'serve'` e nunca vai ao build.
  const casesEditor = env.VITE_CASES_EDITOR === 'true'

  return {
    assetsInclude: ['**/*.glb'],
    // Respeita a porta atribuída pelo ambiente (ex.: preview do Claude Code).
    server: process.env.PORT ? { port: Number(process.env.PORT) } : undefined,
    plugins: [react(), casesEditorPlugin(__dirname, casesEditor)],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      // Fatiar os vendores pesados: mantém o chunk da galeria abaixo do limite e
      // permite cache separado (Three raramente muda; a app muda a cada deploy).
      chunkSizeWarningLimit: 700,
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (!id.includes('node_modules')) return;
            // Ordem importa: @react-three casa "react" também — Three vem antes.
            if (id.includes('three') || id.includes('@react-three')) return 'three';
            if (id.includes('framer-motion') || id.includes('gsap') || id.includes('motionone')) {
              return 'motion';
            }
            if (id.includes('tsparticles') || id.includes('particles')) return 'particles';
            if (
              id.includes('/react/') ||
              id.includes('/react-dom/') ||
              id.includes('/scheduler/')
            ) {
              return 'react-vendor';
            }
          },
        },
      },
    },
  }
})
