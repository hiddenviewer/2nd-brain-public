import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'

export default defineConfig({
  site: 'https://hiddenviewer.github.io',
  base: '/2nd-brain-public',
  integrations: [mdx()],
})
