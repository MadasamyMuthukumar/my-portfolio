/**
 * Identity and social links, used to build the JSON-LD Person schema and
 * page metadata. PLACEHOLDER VALUES — replace before going live.
 *
 * The canonical site URL is NOT duplicated here; it lives in `site` in
 * astro.config.mjs and is read via `Astro.site`.
 */
export const SITE = {
  name: 'Maddy',
  jobTitle: 'Frontend Developer',
  defaultDescription:
    'Frontend developer building fast, accessible web interfaces.',
  locale: 'en',
  socials: {
    github: 'https://github.com/USERNAME',
    linkedin: 'https://www.linkedin.com/in/USERNAME',
  },
  knowsAbout: ['Frontend Development', 'TypeScript', 'React', 'Astro', 'CSS'],
} as const;

export const SAME_AS = Object.values(SITE.socials);
