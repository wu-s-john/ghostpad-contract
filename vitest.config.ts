import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['test/**/*.test.ts'],
    setupFiles: ['./test/setup.ts'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
      '@src': resolve(__dirname, './src'),
      '@test': resolve(__dirname, './test'),
      '@types': resolve(__dirname, './types'),
    },
  },
}); 