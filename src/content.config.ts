import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Projects are authored as MDX. The schema is enforced at build time, so a
 * missing or mistyped field fails the build instead of rendering blank.
 *
 * `cover` is optional: cards fall back to a typographic placeholder so the
 * site ships before screenshots are cleared and supplied.
 */
const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      role: z.string(),
      period: z.string(),
      date: z.coerce.date(),
      tags: z.array(z.string()).default([]),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      featured: z.boolean().default(false),
      repo: z.url().optional(),
      live: z.url().optional(),
      draft: z.boolean().default(false),
      /** Headline metrics rendered on the case-study page. */
      stats: z
        .array(z.object({ label: z.string(), value: z.string() }))
        .default([]),
    }),
});

export const collections = { projects };
