import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // xml2js (and its `sax`/`xmlbuilder` deps) are CommonJS modules that require
  // Node core modules (`timers`, `stream`, `setimmediate`, `events`, `buffer`)
  // that bundlers no longer auto-polyfill. Point them at browser-compatible
  // implementations — the Vite equivalent of the old craco.config.js aliases.
  // Upgrade to fast-xml-parser@5 to remove these
  resolve: {
    alias: {
      timers: 'timers-browserify',
      setimmediate: 'setimmediate',
      stream: 'stream-browserify',
      events: 'events',
      buffer: 'buffer',
    },
  },
})
