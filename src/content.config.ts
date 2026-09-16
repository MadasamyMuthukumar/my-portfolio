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
      /** Hero image on the case-study page. Omit to keep that page imageless. */
      cover: image().optional(),
      coverAlt: z.string().optional(),
      /**
       * Card thumbnail on the homepage. Separate from `cover` because the two
       * jobs differ: a thumbnail can be a mark or a crop that would make a
       * poor full-width hero. Falls back to `cover` when absent.
       */
      thumb: image().optional(),
      thumbAlt: z.string().optional(),
      featured: z.boolean().default(false),
      /**
       * primary   = large card + generated case-study page and OG image
       * secondary = compact row in "Also built", links straight out
       *
       * Defaults to primary so existing entries need no change.
       */
      tier: z.enum(['primary', 'secondary']).default('primary'),
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
