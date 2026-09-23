import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  // Electron loads the bundled renderer with file://. Relative URLs keep the
  // same build usable from both file:// and an HTTP origin.
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'גיבורי המוקד',
        short_name: 'גיבורי המוקד',
        lang: 'he',
        dir: 'rtl',
        theme_color: '#10262b',
        background_color: '#f7f5ef',
        display: 'standalone',
        icons: [{ src: 'favicon.svg', sizes: 'any', type: 'image/svg+xml' }],
      },
    }),
  ],
})
