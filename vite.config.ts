import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // يضمن هذا السطر أن Vite سيقوم باستبدال process.env.API_KEY بالقيمة الموجودة في Netlify
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
});