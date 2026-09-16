/**
 * Single source of truth for résumé content.
 *
 * Consumed by the homepage sections, the /resume page, and the build-time PDF.
 * Change it here and all three stay in sync.
 */

export const profile = {
  name: 'Madasamy Muthukumar R',
  shortName: 'Madasamy',
  role: 'Full Stack Developer',
  location: 'Coimbatore, India',
  email: 'madasamy939@gmail.com',
  /** PDF only — deliberately not rendered on the public site (scraper spam). */
  phone: '+91 93452 63337',
  github: 'https://github.com/MadasamyMuthukumar',
  linkedin: 'https://www.linkedin.com/in/madasamy-muthukumar',

  /** Hero sub-headline. */
  tagline:
    'I build AI-powered product interfaces — streaming chat, agent workflows, and the systems that run them.',

  /** About section. First person, deliberately not résumé-speak. */
  about: [
    "I'm a full stack developer in Coimbatore, three years into building SaaS products end to end. Most of my recent work sits where AI meets product: retrieval-grounded generation, multi-step agent orchestration, and the streaming interfaces that make them feel immediate.",
    'I care about the unglamorous parts too — queue reliability, tenant isolation, and frontend that stays fast as features pile up.',
  ],

  /** Condensed for the PDF header. */
  summary:
    'Full Stack Developer with 3+ years of hands-on experience building and maintaining web applications and SaaS products. Experienced across frontend, backend, APIs, databases, asynchronous systems, distributed systems, scalable design, third-party integrations, and AI-enabled application workflows using React, TypeScript, NestJS, PostgreSQL, and Redis.',
} as const;

export interface Role {
  company: string;
  title: string;
  location: string;
  start: string;
  end: string;
  current?: boolean;
  /** Shown on the website — condensed. */
  highlights: string[];
  /** Extra bullets that appear in the PDF only. */
  pdfOnly?: string[];
}

export const experience: Role[] = [
  {
    company: 'GoZen Technologies',
    title: 'Full Stack Developer',
    location: 'Coimbatore, India',
    start: 'Sep 2024',
    end: 'Present',
    current: true,
    highlights: [
      'Build and maintain SaaS product features end-to-end across React, TypeScript, NestJS, PostgreSQL, Redis and REST APIs — frontend, backend, data, integrations and background processing.',
      'Developed AI-assisted application workflows with RAG, document grounding and multi-step agent orchestration, including tool-based workflows and SSE streaming for interactive generation experiences.',
      'Built an LLM-powered chatbot interface with tool calling, backend tool integration and SSE streaming to support interactive, action-oriented user experiences.',
      'Implemented workspace and team management for an agency-friendly multi-tenant architecture with role-based authorization (RBAC).',
      'Built asynchronous workflows using queues, BullMQ, Pub/Sub and worker jobs for reliable execution of long-running and scheduled tasks.',
    ],
    pdfOnly: [
      'Integrated core platform services including Auth0 authentication, Stripe payments and subscriptions, LinkedIn APIs, Apify, RapidAPI and cloud services, ensuring reliable communication between application components and third-party systems.',
    ],
  },
  {
    company: 'UST Global',
    title: 'Software Developer Intern',
    location: 'Bangalore, India',
    start: 'Aug 2023',
    end: 'Aug 2024',
    highlights: [
      'Completed hands-on software development training in HTML, CSS, JavaScript, React and templating engines, building a strong foundation in frontend engineering.',
      'Developed and integrated reusable frontend components for a live project, debugging, testing and optimising UI code for correctness and maintainability.',
    ],
    pdfOnly: [
      'Collaborated with senior developers on feature implementation and issue resolution, gaining practical experience with team development and delivery in a production-oriented environment.',
    ],
  },
];

export const education = {
  degree: 'B.E. Electronics and Communication Engineering',
  institution: 'Karpagam College of Engineering',
  location: 'Coimbatore',
  start: '2020',
  end: '2024',
  result: 'CGPA 8.7 / 10.0',
} as const;

export interface SkillGroup {
  label: string;
  items: string[];
}

/** Ordered frontend-first, matching the site's positioning. */
export const skills: SkillGroup[] = [
  {
    label: 'Frontend',
    items: [
      'React',
      'Redux Toolkit',
      'Zustand',
      'TanStack Query',
      'Tailwind CSS',
      'SCSS',
      'Astro',
    ],
  },
  {
    label: 'Languages',
    items: ['TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'SQL'],
  },
  {
    label: 'AI & LLM',
    items: [
      'RAG',
      'LLM APIs',
      'Agent Orchestration',
      'Document Grounding',
      'Tool Calling',
      'SSE Streaming',
    ],
  },
  {
    label: 'Backend',
    items: ['Node.js', 'NestJS', 'REST APIs', 'SSE', 'Prisma', 'Drizzle ORM'],
  },
  {
    label: 'Data & Messaging',
    items: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'BullMQ', 'Pub/Sub'],
  },
  {
    label: 'Cloud & Integrations',
    items: [
      'Auth0',
      'Stripe',
      'LinkedIn APIs',
      'Apify',
      'RapidAPI',
      'SQS',
      'S3',
      'Lambda',
      'GCS',
      'Cloud Functions',
    ],
  },
  {
    label: 'Tools',
    items: ['Git', 'GitHub', 'Claude Code', 'Codex'],
  },
];

/*
 * Root-relative, not bare fragments: these must also work from /resume and
 * /projects/*, where the target sections do not exist on the page.
 */
export const navLinks = [
  { href: '/#about', label: 'About' },
  { href: '/#experience', label: 'Experience' },
  { href: '/#work', label: 'Work' },
  { href: '/#skills', label: 'Skills' },
  { href: '/#contact', label: 'Contact' },
] as const;
