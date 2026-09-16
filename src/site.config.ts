import { profile, education, experience, skills } from './data/resume';

/** Identity metadata used for JSON-LD and page meta. */
export const SITE = {
  name: profile.name,
  shortName: profile.shortName,
  jobTitle: profile.role,
  defaultDescription: profile.tagline,
  locale: 'en',
} as const;

const currentRole = experience.find((role) => role.current) ?? experience[0];

/** schema.org Person — how Google associates this site with a named human. */
export function buildPersonSchema(siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    alternateName: profile.shortName,
    url: siteUrl,
    jobTitle: profile.role,
    email: `mailto:${profile.email}`,
    description: profile.summary,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Coimbatore',
      addressRegion: 'Tamil Nadu',
      addressCountry: 'IN',
    },
    worksFor: {
      '@type': 'Organization',
      name: currentRole.company,
    },
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: education.institution,
    },
    knowsAbout: skills.flatMap((group) => group.items),
    sameAs: [profile.github, profile.linkedin],
  };
}
