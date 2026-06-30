import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port: 3000 },
  resolve: {
    alias: {
      // Resolve workspace packages from source (avoids dist dependency in builds)
      '@aigency-os/shared-types': path.resolve(__dirname, '../../packages/shared-types/src'),
      '@aigency-os/shared-types/metrics-helper': path.resolve(__dirname, '../../packages/shared-types/src/metrics-helper.ts'),
      '@aigency-os/shared-types/metrics': path.resolve(__dirname, '../../packages/shared-types/src/metrics.ts'),
      '@aigency-os/api-client': path.resolve(__dirname, '../../packages/api-client/src'),
      '@aigency-os/ui': path.resolve(__dirname, '../../packages/ui/src'),
    },
  },
  test: {
    passWithNoTests: true,
  },
});
