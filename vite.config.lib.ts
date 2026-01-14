import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ['src/lib'],
      outDir: 'dist',
      rollupTypes: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/lib/index.ts'),
      name: 'AWSArchitectureAnimations',
      formats: ['es', 'umd'],
      fileName: (format) => `aws-architecture-animations.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'motion/react'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'motion/react': 'Motion',
        },
      },
    },
    cssCodeSplit: false,
    sourcemap: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@lib': resolve(__dirname, 'src/lib'),
    },
  },
});
