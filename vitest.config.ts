import { defineConfig } from 'vitest/config';
import path from 'node:path';

// Config separada do Vite para não carregar plugins de build nos testes.
export default defineConfig({
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
