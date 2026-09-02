import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: GitHub Pages 등 하위 경로 배포 시 VITE_BASE=/저장소명/ 으로 지정
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE || '/',
  build: { outDir: 'dist', assetsDir: 'assets' },
});
