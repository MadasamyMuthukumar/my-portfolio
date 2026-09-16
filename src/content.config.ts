import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Projects are authored as MDX. The schema is enforced at build time, so a
 * missing or mistyped field fails the build instead of rendering blank.
 *
 * No route consumes this yet — src/pages/projects/[...slug].astro is Phase 2.
 */
const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      date: z.coerce.date(),
      tags: z.array(z.string()).default([]),
      // Typed via image() so astro:assets optimises it and emits intrinsic
      // width/height, which is what keeps CLS at zero.
      cover: image(),
      coverAlt: z.string(),
      featured: z.boolean().default(false),
      repo: z.url().optional(),
      live: z.url().optional(),
      draft: z.boolean().default(false),
    }),
});

export const collections = { projects };
