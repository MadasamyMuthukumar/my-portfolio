# Madasamy Muthukumar — Portfolio

Static portfolio and résumé site. No backend.

**Stack:** Astro 7 · TypeScript (strict) · Tailwind CSS 4 · MDX content collections
**Positioning:** full-stack developer who builds AI product interfaces

## Commands

| Command                | Does                                                            |
| ---------------------- | --------------------------------------------------------------- |
| `pnpm dev`             | Dev server on http://localhost:4321                             |
| `pnpm build`           | Static build → `dist/`, plus OG images and the résumé PDF       |
| `pnpm build:fast`      | Build without the Chrome-driven steps                           |
| `pnpm preview`         | Serve the built output                                          |
| `pnpm check`           | Typecheck `.astro` + `.tsx`                                     |
| `pnpm test:responsive` | 42 viewport checks against `dist/` — **run after `pnpm build`** |
| `pnpm screenshot`      | Capture `.screens/` for visual review                           |
| `pnpm format`          | Prettier, incl. Tailwind class sorting                          |

Per `CLAUDE.md`, start the dev server with `pnpm astro dev --background`
(`astro dev stop` / `status` / `logs` to manage it).

## Content

Everything on the site reads from two places:

- **`src/data/resume.ts`** — profile, experience, education, skills. The
  homepage sections, `/resume` and the PDF all render from this one file, so
  they cannot drift.
- **`src/content/projects/*.mdx`** — one file per project, validated by the Zod
  schema in `src/content.config.ts`. Malformed frontmatter fails the build.

To add a project, add an MDX file. To change a job title, edit `resume.ts`.

## Architecture notes

**Zero JS.** Every page ships **0 JavaScript requests**, and `dist/` contains
no `.js` files at all. The theme toggle is an inline script (~600 bytes) and
the mobile menu is a native `<details>` disclosure.

The React integration was **removed**: nothing mounted an island, and merely
registering it emitted a 220 KB client runtime into `dist/` that no page
referenced. Re-add it with `pnpm astro add react` the moment a feature genuinely
needs component state — and expect that island to cost ~210 KB of runtime on
whatever pages use it.

**Design tokens** live in `src/styles/global.css`. Themeable colours are
declared under `@theme inline` so they resolve through `var()` and follow the
`data-theme` attribute. Palette is contrast-verified: the vivid accent
(`#FF5A1F`, 3.01:1) fails body-text contrast, so accent-coloured **text** uses
`--accent-text` (`#C2410C`, 5.00:1) instead. Keep accent under ~5% of any screen.

**Motion** is pure CSS, driven by `animation-timeline`. Two things to know:

1. Reveals live inside `@supports` and set no hidden state outside it, so
   content can never be stuck invisible where unsupported.
2. The timeline declarations sit on a **deliberately different selector**
   (`[class~='reveal']`) from the animation ones. Lightning CSS merges rules
   with identical selectors and folds `animation-timeline` into the `animation`
   shorthand, producing `animation: linear both reveal-in view()` — which
   Chrome rejects outright. Do not merge those rules back together.

**Responsiveness is tested, not asserted.** `pnpm test:responsive` drives
headless Chrome across 14 viewports (320 → 2560, both landscape phone sizes,
and 200% zoom) on 3 pages, asserting no horizontal overflow and ≥44px touch
targets. Note `overflow-x: hidden` is deliberately **not** set on `body` — it
would mask the very bugs this test exists to catch.

**Privacy.** The phone number is never rendered into the markup of an indexed
page. CSS `display: none` is not privacy — scrapers read HTML. The number
appears only on `/resume-print`, a noindexed route excluded from the sitemap
that exists purely as the PDF source.

**Chrome-driven build steps.** The résumé PDF and OG images are produced by the
system Chrome rather than Playwright or Satori. Both skip with a warning if
Chrome is absent, so a deploy never fails over them. Set `CHROME_PATH` to point
at a specific binary.

## Measured

| Metric      | Home   | Résumé | Case study |
| ----------- | ------ | ------ | ---------- |
| JS requests | 0      | 0      | 0          |
| CLS         | 0.0007 | 0      | 0.0007     |
| LCP (local) | 136 ms | 216 ms | 148 ms     |
| Transferred | 145 KB | 100 KB | 101 KB     |

## Before going live

- [ ] Replace `site` in `astro.config.mjs` — canonical URLs, sitemap and OG
      image URLs all derive from it
- [ ] Replace the sitemap URL in `public/robots.txt`
- [ ] Add a portrait: drop a 4:5 image (≥1200×1500) into `src/assets/` and pass
      it to `<PhotoCard src={…} />` in `src/components/sections/Hero.astro`.
      Until then a monogram renders.
- [ ] Add Allbound360 screenshots: place them alongside the MDX and set `cover`
      / `coverAlt` in its frontmatter. Cards fall back to a typographic
      placeholder without them.
- [ ] Pick a host — output is plain static, no adapter needed

## Pinned versions

TypeScript is pinned to **6.x**. TypeScript 7's native compiler does not expose
the programmatic API `astro check` depends on
([tracking issue](https://github.com/withastro/roadmap/discussions/1321)).
