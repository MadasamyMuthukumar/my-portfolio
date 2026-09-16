# Portfolio

Personal portfolio and resume site. Static, no backend.

**Stack:** Astro 7 · TypeScript (strict) · Tailwind CSS 4 · React 19 (islands) · MDX content collections

## Commands

| Command | Does |
| --- | --- |
| `pnpm dev` | Dev server on http://localhost:4321 |
| `pnpm build` | Static build to `dist/` |
| `pnpm preview` | Serve the built output |
| `pnpm check` | Typecheck `.astro` + `.tsx` |
| `pnpm format` | Prettier, incl. Tailwind class sorting |

Per `CLAUDE.md`, prefer `pnpm astro dev --background` when an agent starts the
dev server (`astro dev stop` / `status` / `logs` to manage it).

## Architecture notes

- **Zero JS by default.** Pages are static HTML. The homepage currently ships
  **0 JavaScript requests**; the theme toggle is an `is:inline` script of ~600
  bytes. Only add a React island when a feature genuinely needs state — a
  `client:*` directive pulls in ~210 KB of React runtime.
- **Design tokens** live in `src/styles/global.css`. Themeable colours are
  declared under `@theme inline` so they resolve through `var()` and follow the
  `data-theme` attribute; raw values sit on `:root` with dark overrides.
  Tailwind 4 is CSS-first — there is no `tailwind.config.js`.
- **`src/components/Seo.astro`** renders canonical URL, OpenGraph, Twitter
  tags, and the JSON-LD `Person` schema. Every page should go through
  `Base.astro`, which wires it up.
- **Content** is MDX under `src/content/projects/`, validated by the Zod schema
  in `src/content.config.ts`. Invalid frontmatter fails the build.
- **`/stack-check`** is an internal build probe (React hydration + collection
  query). It is `noindex` and excluded from the sitemap. Delete it once real
  Phase 2 components cover the same ground.

## Before going live

- [ ] Replace `site` in `astro.config.mjs` — canonical URLs and the sitemap derive from it
- [ ] Replace the sitemap URL in `public/robots.txt`
- [ ] Fill in real values in `src/site.config.ts` (name, job title, socials)
- [ ] Add `public/og-default.png` (referenced as the default share image)
- [ ] Pick a host (Cloudflare Pages / Vercel / Netlify — output is plain static, no adapter needed)

## Pinned versions

TypeScript is pinned to **6.x**. TypeScript 7's native compiler does not yet
expose the programmatic API `astro check` depends on
([tracking issue](https://github.com/withastro/roadmap/discussions/1321)).
