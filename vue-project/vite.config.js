import { fileURLToPath, URL } from "url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import react from '@vitejs/plugin-react';
import babel from '@rollup/plugin-babel';
import vueJsx from '@vitejs/plugin-vue-jsx';


export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    react()
  ],
  esbuild: {
    loader: 'jsx',
    include: /.*\.jsx?$/,
    exclude: []
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },},
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
