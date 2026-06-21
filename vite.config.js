import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Lanyard-brickan (CompanyBadgeNavbar) importerar en .glb-modell.
  assetsInclude: ['**/*.glb'],
});
