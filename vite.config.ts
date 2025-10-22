import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    // ✅ Autorise tous les domaines (Cloudflare, ngrok, etc.)
    allowedHosts: true,
    // host: '0.0.0.0', // permet les connexions externes
  },
});