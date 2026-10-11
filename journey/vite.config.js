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
              priority: 30,
              test: /node_modules[\\/]react(-dom)?[\\/]/,
            },
            {
              name: 'vendor-router',
              priority: 20,
              test: /node_modules[\\/]@tanstack[\\/]/,
            },
            {
              name: 'vendor-motion',
              priority: 15,
              test: /node_modules[\\/]motion[\\/]/,
            },
            {
              name: 'vendor-contentful',
              priority: 10,
              test: /node_modules[\\/]contentful-management[\\/]/,
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
