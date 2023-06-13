// eslint-disable-next-line spaced-comment
/// <reference types="vitest" />

import { loadEnvConfig } from '@next/env';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig(() => {
  loadEnvConfig(process.cwd());

  return {
    plugins: [react()],
    test: {
      environment: 'jsdom',
      setupFiles: './src/test/setupTests.ts',
      globals: true,
      mockReset: true,
      deps: {
        inline: ['react-dropzone'],
      },
    },
    resolve: {
      alias: {
        '@': '/src',
      },
    },
  };
});
