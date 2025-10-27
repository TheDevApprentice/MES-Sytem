import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import fs from 'fs'
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        "@components": resolve("src/renderer/src/components"),
        "@icons": resolve("src/renderer/src/components/icons"),
        "@pages": resolve("src/renderer/src/pages"),
        "@stores": resolve("src/renderer/src/stores"),
        "@utils": resolve("src/renderer/src/utils"),
      },
      // Extensions par défaut pour améliorer la résolution
      extensions: [".ts", ".tsx", ".js", ".jsx", ".vue", ".json"],
    },
    server: {
      host: 'localhost',
      port: 5173,
      https: {
        key: fs.readFileSync(resolve('certs/mes-local.key')),
        cert: fs.readFileSync(resolve('certs/mes-local.crt'))
      }
    },
    plugins: [vue(), tailwindcss()]
  }
})
