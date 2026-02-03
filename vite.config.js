import { resolve } from 'path';

export default {
  root: 'src',  // 'src' es la raíz
  build: {
    outDir: '../dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        search: resolve(__dirname, 'src/search.html'),
        favorites: resolve(__dirname, 'src/favorites.html'),
        contact: resolve(__dirname, 'src/contact.html')
      }
    }
  },
  server: {
    port: 5173,
    open: true
  }
};
