import { defineConfig } from 'vite';

export default defineConfig({
  // base relativa ('./') para compatibilidad universal (showrumbalatina.github.io o subruta /showrumbalatina/)
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  }
});
