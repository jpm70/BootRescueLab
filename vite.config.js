import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

// App estática (index.html + app.js + styles.css): Vite compila Tailwind 4, empaqueta app.js y copia
// el logo. Base relativa: funciona en GitHub Pages (/BootRescueLab/) y en cualquier subcarpeta.
export default defineConfig({
  base: './',
  plugins: [tailwindcss()],
});
