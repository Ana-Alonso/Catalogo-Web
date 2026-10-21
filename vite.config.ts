import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import type { Plugin } from 'vite'

const previewNoindex = (): Plugin => ({
  name: 'preview-noindex',
  transformIndexHtml(html) {
    if (process.env.VERCEL_ENV !== 'preview') {
      return html
    }

    return html.replace(
      '<meta name="robots" content="index, follow" />',
      '<meta name="robots" content="noindex, nofollow" />'
    )
  },
})

export default defineConfig({
  plugins: [react(), tailwindcss(), previewNoindex()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    css: false,
  },
})
