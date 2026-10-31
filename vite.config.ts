import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        // Cache the framework independently as the educational catalog grows.
        manualChunks(id) {
          if (id.includes('/node_modules/react/') || id.includes('/node_modules/react-dom/') || id.includes('/node_modules/scheduler/')) return 'react-vendor';
          // Shared with the local searches; cache the clinical text independently.
          if (id.includes('/src/data/clinical-')) return 'clinical-content';
          if (id.includes('/src/data/medications-')) return 'medication-content';
        },
      },
    },
  },
});
