# Portfolio — Design & Content Plan (Phase 2)

Derived from `GoZen_Muthukumar_Resume.pdf`. Written 2026-09-16.

---

## 0. Decisions locked

| Decision            | Choice                                                                              |
| ------------------- | ----------------------------------------------------------------------------------- |
| Positioning         | **AI product interfaces** — "Full-stack developer who builds AI product interfaces" |
| Palette             | **A · Ink & Citrus** (warm off-white / near-black / vivid orange)                   |
| Dark mode           | **Yes**, light is default                                                           |
| Typography          | Instrument Serif + Inter + **JetBrains Mono retained**                              |
| Allbound360 visuals | **Screenshots available** — image-led case study                                    |
| Phone number        | **Not published** on the site; stays on the PDF                                     |
| Projects            | Allbound360 (flagship) + **this portfolio site as project #2**                      |

**Outstanding from Madasamy:** a portrait photo (≥1200×1500, 4:5) and
Allbound360 screenshots. Monogram and diagram placeholders ship until both
arrive, so neither blocks the build.

---

## 1. What the résumé actually says

| Field     | Value                                                          |
| --------- | -------------------------------------------------------------- |
| Name      | Madasamy Muthukumar R                                          |
| Base      | Coimbatore, Tamil Nadu, India                                  |
| Current   | Full Stack Developer, GoZen Technologies (Sep 2024 – present)  |
| Prior     | Software Developer Intern, UST Global (Aug 2023 – Aug 2024)    |
| Education | B.E. ECE, Karpagam College of Engineering, 2020–2024, CGPA 8.7 |
| Flagship  | Allbound360 — LinkedIn automation SaaS                         |

### The real story in the document

The résumé is filed as "Full Stack Developer," but that undersells it. The
distinctive, scarce skill on the page is **AI application engineering**: RAG,
document grounding, multi-step agent orchestration, tool calling, SSE
streaming, scheduled agent runs. Generic full-stack developers are abundant.
Engineers who have shipped agentic product features to paying customers are
not.

The second thing the page proves, quietly, is **product breadth** — one person
covering auth, payments, multi-tenancy, queues, workers, third-party APIs and
the UI on top. That is a startup-shaped engineer.

### Where the frontend evidence actually lives

The stated goal is a frontend-oriented portfolio, and the résumé does support
it — but the evidence is buried in feature descriptions rather than the Skills
block:

- SSE streaming UIs for interactive generation
- An LLM chatbot interface with tool calling
- Image carousel + video generation UI
- A trackable content calendar (scheduling UI — genuinely hard)
- React, Redux Toolkit, Zustand, TanStack Query, Tailwind, SCSS

That is a coherent and honest niche: **interfaces for AI products** — streaming,
agentic, real-time, stateful. Not "I can center a div."

---

## 2. Positioning decision

**CHOSEN — headline identity: "Full-stack developer who builds AI product
interfaces."**

Reasoning: a pure-frontend framing throws away the AI work, which is the most
valuable thing on the résumé. A pure-backend framing contradicts the stated
goal. The hybrid is both honest and the most differentiated, and it lets the
site lead with frontend craft while the depth underneath does the convincing.

Order of emphasis on the page: **frontend craft → AI/product systems →
backend depth.**

---

## 3. Information architecture

Single-page scroll for the main narrative, with real routes for depth:

| Route                   | Purpose                                                             |
| ----------------------- | ------------------------------------------------------------------- |
| `/`                     | Hero · About · Experience · Projects · Skills · Education · Contact |
| `/projects/allbound360` | Full case study                                                     |
| `/resume`               | HTML résumé + PDF download                                          |

A recruiter scans in one scroll; an engineer who wants detail can click through.

---

## 4. Section plan

### 4.1 Hero — "Hi, I'm Madasamy"

Two-column asymmetric on desktop (text ~58%, photo card ~42%).

```
┌──────────────────────────────────────────────────────────┐
│  FULL STACK DEVELOPER · COIMBATORE          ← mono eyebrow│
│                                                           │
│  Hi, I'm Madasamy.        ┌──────────────┐               │
│  ^^^^^^^^^ serif italic   │              │               │
│                           │   PHOTO      │  ← 4:5 card,  │
│  I build AI-powered       │   CARD       │    hairline   │
│  product interfaces —     │              │    border,    │
│  streaming chat, agent    │              │    accent     │
│  workflows, and the       └──────────────┘    block      │
│  systems that run them.                       offset     │
│                                               behind     │
│  [ View my work ]  [ Résumé ↓ ]                          │
│  GitHub · LinkedIn · Email                               │
└──────────────────────────────────────────────────────────┘
```

- **Photo card**: 4:5 portrait, 14px radius, 1px hairline border, with a solid
  accent rectangle offset 12px behind it. This is the single loudest use of the
  accent colour on the whole site — one deliberate moment, then restraint.
- Dimensions are reserved via `astro:assets` so there is **zero layout shift**
  while the photo loads.
- Until a real photo exists, a monogram placeholder ("MM" on accent) ships, so
  the build is never blocked.

### 4.2 About

~70 words, first person, plain prose. Replaces résumé-speak with a voice.
Draft: _"I'm a full stack developer in Coimbatore, three years into building
SaaS products end to end. Most of my recent work sits where AI meets product:
retrieval-grounded generation, multi-step agent orchestration, and the
streaming interfaces that make them feel immediate. I care about the
unglamorous parts too — queue reliability, tenant isolation, and frontend that
stays fast as features pile up."_

### 4.3 Experience

Vertical timeline. Left rail with dot markers ≥1024px; plain stack below.
GoZen condensed from six bullets to five (the chatbot bullet folds into the AI
bullet). UST condensed to two. Full detail stays in the PDF — the web version
should be scannable, not a transcript.

### 4.4 Projects

Allbound360 as flagship, with a dedicated case study structured in three
chapters that mirror how it was actually built: **Inbound** (Content Brain,
carousel/video generation, calendar) → **Outbound** (lead discovery,
sequencing, personalisation) → **AI-SDR** (ICP-driven qualification,
signal-based workflows, scheduled agent runs).

**Screenshots are available**, so the case study is image-led: real product UI
per chapter, served through `astro:assets` as responsive AVIF/WebP with
reserved dimensions. Any customer data gets blurred before it ships.

This portfolio site is **confirmed as project #2** — the 0 KB JS homepage, the
performance budget, and the responsive test harness are the story.

### 4.5 Skills

Grouped rows, mono label + chips, reordered to lead with frontend:
Frontend · Languages · Backend · Data & Messaging · AI & LLM · Cloud &
Integrations · Tools.

**Anti-pattern, explicitly rejected:** no percentage bars, no "React 95%".
They are unfalsifiable and read as padding.

### 4.6 Education

One compact row. Degree, college, years, CGPA. No more.

### 4.7 Contact

Large closing CTA, email as primary, GitHub/LinkedIn secondary.
**No phone number** — it stays on the PDF only.

---

## 5. Design system

### 5.1 Colour

Measured WCAG contrast against the paper tone (computed, not estimated):

**Palette A — Ink & Citrus — CHOSEN**

| Token       | Hex       | Contrast on paper | Grade                        |
| ----------- | --------- | ----------------- | ---------------------------- |
| paper       | `#FCFBF8` | —                 | warm off-white               |
| ink         | `#14151A` | 17.62:1           | AAA                          |
| muted       | `#6B6B74` | 5.10:1            | AA                           |
| accent      | `#FF5A1F` | 3.01:1            | large text / decoration only |
| accent-text | `#C2410C` | 5.00:1            | AA                           |

_Not chosen, kept for reference._ **Palette B — Forest & Bone:** paper `#FAF9F5`, ink `#0F2A22` (14.50:1),
muted `#5C6B63` (5.33:1), accent `#D97706` (3.02:1), accent-text `#B45309`
(4.77:1).

_Not chosen, kept for reference._ **Palette C — Ink & Indigo:** paper `#FCFCFD`, ink `#0F1222` (18.13:1),
muted `#6B6B7B` (5.10:1), accent `#4F46E5` (6.13:1), accent-text `#4338CA`
(7.71:1). Safest, but the most common look in developer portfolios.

**Key decision that falls out of the numbers:** vivid accents fail body-text
contrast. So the system carries **two accent tokens** — `--accent` for fills,
borders and large display type, `--accent-text` for any accent-coloured text at
body size. Without that split, links would be unreadable at AA.

**Discipline rule:** accent covers **≤5% of any screen**. Warm off-white
rather than pure `#FFF`, near-black rather than pure `#000` — that alone is
most of the difference between "aesthetic" and "cringe poster."

**Dark mode ships**, with light as default. The dark variant re-tones the same
roles: near-black paper, off-white ink, and a slightly desaturated accent —
`#FF5A1F` is too hot against a dark ground and will be lowered in chroma, then
re-measured for contrast before it lands.

### 5.2 Typography

| Role      | Family                          | Used for                                |
| --------- | ------------------------------- | --------------------------------------- |
| Display   | **Instrument Serif** (+ italic) | "Madasamy" in the hero, section numbers |
| Body / UI | **Inter Variable**              | everything structural                   |
| Mono      | **JetBrains Mono Variable**     | eyebrows, section labels, tech chips    |

All three confirmed available on Fontsource (v5.3.0), self-hosted, latin subset.

The "stylish font" request is answered surgically: the serif appears on **the
name and little else**. A whole page set in a display serif looks like a
wedding invitation; one italic serif word inside a clean grotesque looks
deliberate.

Hero `h1` scales `clamp(2.5rem, 1.2rem + 6vw, 5.5rem)` — 40px on a small phone,
88px on desktop, continuous in between.

Cost: ~70 KB of fonts across 3 files, preloading the two needed above the fold.
**Mono is retained** — the label/chip texture was judged worth the ~25 KB.

### 5.3 Motion & scroll

| Behaviour                         | Implementation                     | JS  |
| --------------------------------- | ---------------------------------- | --- |
| Section reveal (fade + 16px rise) | CSS `animation-timeline: view()`   | 0   |
| Top scroll-progress bar           | CSS `animation-timeline: scroll()` | 0   |
| Hero entrance                     | CSS `@keyframes` on load           | 0   |
| Card hover lift                   | `transform` + 150ms ease-out       | 0   |
| Page transitions                  | Astro View Transitions             | ~0  |

**Non-negotiable guard:** reveal animations live inside
`@supports (animation-timeline: view())`, with elements fully visible by
default outside it. If the feature is unsupported, content simply appears —
it can never end up invisible. Everything is additionally disabled under
`prefers-reduced-motion: reduce`.

### 5.4 Section separation

1px hairline rule, fluid vertical rhythm `clamp(5rem, 12vw, 10rem)`, mono
section label (`01 — EXPERIENCE`) that sticks to the viewport on ≥1024px while
its section scrolls past. At most one section gets a tinted background, to
break monotony without stripes.

---

## 6. Responsive architecture

> Treated as an architectural constraint, not a finishing pass.

### 6.1 Principle: fluid first, breakpoints only for rearrangement

Nothing _resizes_ at a breakpoint — type and spacing scale continuously with
`clamp()`. Breakpoints exist only where the layout must **rearrange**. This
eliminates the classic failure where a design is tuned at 1440 and 1280 and
falls apart at 1100.

### 6.2 Four mechanisms

1. **`clamp()`** for every font size and section pad — no resize breakpoints.
2. **Container queries** (`@container`) on cards, so a card responds to _its
   own slot_, not the viewport. A project card then works in a 1-, 2- or
   3-column grid with no extra rules.
3. **Intrinsic grids** — `repeat(auto-fit, minmax(min(100%, 20rem), 1fr))`
   reflows on its own. The `min(100%, …)` is what stops overflow at 320px.
4. **Breakpoints** only for: hero stack→split, timeline rail, sticky labels.

### 6.3 Breakpoint contract

| Width     | Hero                         | Photo                       | Projects | Skills | Sticky labels |
| --------- | ---------------------------- | --------------------------- | -------- | ------ | ------------- |
| 320–479   | stacked                      | 120px circle, above eyebrow | 1 col    | 1 col  | off           |
| 480–767   | stacked                      | 160px circle                | 1 col    | 2 col  | off           |
| 768–1023  | stacked, centred             | 220px card                  | 2 col    | 2 col  | off           |
| 1024–1279 | split 58/42                  | 4:5 card                    | 2 col    | 3 col  | on            |
| 1280–1535 | split, max 1120px            | 4:5 card                    | 2 col    | 3 col  | on            |
| ≥1536     | gutters grow, content capped | 4:5 card                    | 3 col    | 3 col  | on            |

### 6.4 The cases that actually break things

- **Landscape phone** (844×390): a `min-h-dvh` centred hero overflows. Under
  `(max-height: 500px) and (orientation: landscape)` the hero drops to
  `min-height: auto` with reduced padding.
- **`dvh`, never `vh`** — `vh` is wrong under mobile browser chrome.
- **Notched devices** — `padding-inline: max(1rem, env(safe-area-inset-left))`.
- **200% browser zoom at 1280px** behaves as ~640px. An accessibility
  requirement, and free if the layout is genuinely fluid.
- **Long unbreakable strings** (email, URLs) — `overflow-wrap: anywhere`, the
  single most common cause of mobile horizontal scroll.
- **Touch targets ≥44×44px**; no information conveyed by hover alone.

### 6.5 Enforcement

Responsiveness is **tested, not asserted**. The headless-Chrome harness built
in Phase 1 already measures `scrollWidth > clientWidth`. Phase 2 turns it into
a build-gating script across the full matrix — 320, 360, 390, 414, 768, 834,
1024, 1280, 1440, 1920, 2560, plus 844×390 and 926×428 landscape, plus 200%
zoom — asserting zero horizontal overflow and ≥44px touch targets at every one.

---

## 7. Performance & SEO budget

| Metric                        | Budget                                    |
| ----------------------------- | ----------------------------------------- |
| JS requests on `/`            | 0                                         |
| Total page weight incl. photo | < 250 KB                                  |
| CLS                           | 0 (enforced by reserved media dimensions) |
| Lighthouse                    | 100 / 100 / 100 / 100                     |

SEO: extend the existing `Person` schema with `worksFor`, `alumniOf` and
`address`; add `CreativeWork` schema to the case study; per-page OG images
generated at build.

---

## 8. Component patterns

| Pattern        | Rule                                                                      |
| -------------- | ------------------------------------------------------------------------- |
| Section header | mono number + label, then heading                                         |
| Card           | hairline border, 14px radius, 2px hover lift, container-queried internals |
| Tech chip      | mono, small, ink text on tinted surface — never accent-filled             |
| Link           | 3px underline offset; accent on hover only                                |
| Timeline       | dot + rail ≥1024px, plain stack below                                     |
| Button         | one filled accent primary per section, max                                |

---

## 9. Risks I would flag before building

1. **Still the main open risk: project count.** Adding this site as project #2
   helps, but both entries are then either employer-owned or meta. One or two
   small personal projects would harden the portfolio considerably. Not a
   blocker — the build proceeds without them.
2. ~~Phone number spam risk~~ — **resolved**: not published.
3. ~~Allbound360 confidentiality~~ — **resolved**: screenshots can be shown.
4. **A photo is required.** Ideally 1200×1500 (4:5) or larger. A monogram
   placeholder ships until then.
5. ~~Three font families~~ — **resolved**: mono retained deliberately.
6. **"3+ years"** counts a one-year internship alongside two years full-time.
   Defensible, but the site copy must not contradict the PDF.

---

## 10. Build order

1. Design tokens — colour, type scale, spacing, motion primitives
2. Primitives — Section, Container, Chip, Card, Link, Button
3. Hero (incl. photo card + placeholder)
4. About · Experience · Skills · Education
5. Projects grid + Allbound360 case study
6. Contact + footer
7. `/resume` page + build-time PDF
8. Motion layer (scroll reveals, progress bar, view transitions)
9. Responsive test harness wired into the build
10. OG images, extended schema, Lighthouse pass
