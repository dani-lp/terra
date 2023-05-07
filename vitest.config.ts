// eslint-disable-next-line spaced-comment
/// <reference types="vitest" />

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import { loadEnvConfig } from '@next/env';

export default defineConfig(() => {
  loadEnvConfig(process.cwd());
  
  return {
    plugins: [react()],
    test: {
      environment: 'jsdom',
      setupFiles: './src/scripts/setupTests.ts',
      globals: true,
    },
    resolve: {
      alias: {
        '@': '/src',
      }
    },
  };
});
