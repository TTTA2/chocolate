import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import path from "path";
import { viteSingleFile } from "vite-plugin-singlefile"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte(), viteSingleFile()],

  resolve: {
    alias: {
      $lib: path.resolve("./src/lib"),
    },
  },

})
