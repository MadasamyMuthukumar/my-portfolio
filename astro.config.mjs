// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // PLACEHOLDER — replace with the real domain before going live.
  // Canonical URLs and the sitemap are both derived from this value.
  site: 'https://example.com',

  integrations: [
    react(),
    mdx(),
    // /stack-check is an internal build probe, not a real page.
    sitemap({ filter: (page) => !page.includes('/stack-check') }),
  ],

  // Tailwind v4 is wired as a Vite plugin. There is no tailwind.config.js —
  // configuration lives in src/styles/global.css.
  vite: {
    plugins: [tailwindcss()],
  },
});
