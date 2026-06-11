import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'vendor-react',
              test: /node_modules[\\/]react(-dom)?[\\/]/,
              priority: 30,
            },
            {
              name: 'vendor-router',
              test: /node_modules[\\/]@tanstack[\\/]/,
              priority: 20,
            },
            {
              name: 'vendor-motion',
              test: /node_modules[\\/]motion[\\/]/,
              priority: 15,
            },
            {
              name: 'vendor-contentful',
              test: /node_modules[\\/]contentful-management[\\/]/,
              priority: 10,
            },
          ],
        },
      },
    },
    sourcemap: true,
    target: 'esnext',
  },
  plugins: [
    // Please make sure that '@tanstack/router-plugin' is passed before '@vitejs/plugin-react'
    tanstackRouter({
      autoCodeSplitting: true,
      target: 'react',
    }),
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    visualizer({
      filename: 'stats.html',
      gzipSize: true,
      open: true,
    }),
  ],
  server: {
    port: 3000,
  },
});
