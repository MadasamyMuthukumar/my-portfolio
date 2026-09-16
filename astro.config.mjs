// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // PLACEHOLDER — replace with the real domain before going live.
  // Canonical URLs and the sitemap are both derived from this value.
  site: 'https://example.com',

  // No React integration: nothing currently mounts an island, and registering
  // it emitted a 220 KB client runtime into dist/ that no page referenced.
  // Re-add with `pnpm astro add react` the moment a feature needs component state.
  integrations: [
    mdx(),
    // /resume-print is the PDF source, not a page for humans.
    sitemap({
      filter: (page) =>
        !page.includes('/resume-print') && !page.includes('/og-preview'),
    }),
  ],

  // Tailwind v4 is wired as a Vite plugin. There is no tailwind.config.js —
  // configuration lives in src/styles/global.css.
  vite: {
    plugins: [tailwindcss()],
  },
});
