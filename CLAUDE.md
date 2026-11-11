# Bridge 1.0 — Project Brief for Claude Code

Read this file fully at the start of every session. It is the source of truth for how this project is built.

## 1. Who you are working with

The project owner is **Aston**, a senior UX/product designer, not a developer. He designed the Bridge brand and website and wants to build the components he designed.

How to work with him:

- Explain what you are doing in plain language. Avoid jargon; when a technical term is unavoidable, explain it in one sentence.
- Work **in batches** (Aston's preference since 7 November 2026): build a whole checkpoint's components, test them yourself, then present them for one review with all open decisions listed together at the end. Tell him how to see them in the browser and what to check, then wait for his approval before the next checkpoint.
- Never make a design decision silently. If something isn't specified here or in his designs, ask, and offer two or three concrete options.
- Before installing a new library, changing the folder structure, or deleting files, explain why and ask first.
- When he gives visual feedback ("tighter", "more breathing room", "feels heavy"), translate it into specific changes and say what you changed.
- Keep a short changelog at the bottom of `PROGRESS.md` after each working session.

## 2. What we are building

A **full working prototype** of the Bridge platform: the public website, with the homepage redeveloped according to *Platform Redevelopment Notes: Bridge 1.0*, section 4.2 (28 October 2026), plus the four dashboards (Student, School, Company, Admin), fully clickable with realistic sample data. The checkpoint plan and prototype scope are in `PROGRESS.md`; work through it one checkpoint at a time.

The dashboards have no written spec. The Student dashboard is built from Aston's existing designs. For the School, Company and Admin dashboards, ask Aston for designs or direction before starting each one.

Bridge is an AI-powered employability ecosystem connecting TVET (technical and vocational) students and graduates in Rwanda with practical learning, verified skills, industry experience and career opportunities. The site must feel premium, credible, human-centred, technology-enabled and distinctly African, with a vision that can scale internationally.

Current live site for reference: https://bridge.co.rw

## 3. Tech stack

- **Next.js** (App Router) with **TypeScript**
- **Tailwind CSS v4** for styling, with all brand values defined as design tokens (section 4). Never hard-code a colour, font size or spacing value inside a component.
- **shadcn/ui** (style "radix-vega", Radix primitives) for every UI component, themed with the Bridge tokens (section 4). Forms use react-hook-form and zod; tables use TanStack Table v8; toasts use sonner.
- Icons: **lucide-react**, a single consistent line-icon set
- Font: **Manrope**, loaded with `next/font`.
- Copy lives in **separate content files** (`/content/*.ts`), never inside components, so copy can be edited without touching layout. Sample records (students, schools, companies, programmes, opportunities, applications, articles) live in **one shared dataset in `/data`**, used by every page and dashboard so the story is consistent across roles.
- No backend. Sample data is shaped like the real data will be. Login, the database, emails, payments, booking and Bridge AI are simulated and clearly marked (see "Prototype scope" in `PROGRESS.md`). Changes made during a demo are kept in the browser for that session only.

## 4. Design system: shadcn/ui with the Bridge theme

Since 8 November 2026 the whole platform runs on **shadcn/ui** with a Bridge theme (redesign Steps 1–8, see `PROGRESS.md`). Visual direction: **navy and white with green actions**, premium and production-ready. The one exception is the **homepage hero**, rebuilt from Aston's own Figma design (9 Nov 2026): a deep green gradient (`hero-start` → `hero-end`, `surface-green`) with amber highlights, glass details and a dotted map of Africa. The header is see-through over it until the visitor scrolls. Everything else stays navy and green.

### Tokens (`app/globals.css`)

All values live in `:root` and are exposed to Tailwind through `@theme inline`. Tailwind's built-in colour palette is **switched off**: only these tokens (plus white, and black for overlays) exist, so a stray `bg-gray-500` draws nothing. Use the token classes (`bg-primary`, `text-heading`, `text-muted-foreground`, `border-border` …), never hex values.

| Token | Value | Use |
|---|---|---|
| `foreground` | `#1F2937` | Body text |
| `heading` | `#1C3D6A` | Headings (navy) |
| `primary` / `primary-hover` | `#277A4D` / `#1F6340` | Buttons, links, selected states / hover and pressed. White text 5.3:1 (Aston's green-700 decision, 7 Nov 2026) |
| `secondary` / `secondary-foreground` | `#EBF7F0` / `#277A4D` | Secondary button fill, Open and Verified labels |
| `link`, `eyebrow-foreground` | `#277A4D` | Text links, eyebrow labels |
| `brand-navy` | `#1C3D6A` | Navy sections, footer, avatars, Navy button |
| `brand-green` | `#3AAA6D` | Logo, icons, illustrations, decorative arcs. **Never small text** (2.9:1) |
| `brand-amber` | `#F8AC36` | Decorative accent: Draft label tint, rank chip, shortlist star, notification dot. Navy text on it. Also the large highlighted headline words on the green hero (3:1 for large text) |
| `hero-start` / `hero-end` | `#016A3F` / `#015432` | Homepage hero gradient only. The Figma's `#027A48` start is deepened so amber and pale-green text pass over the glow |
| `muted` / `muted-foreground` | `#F4F6F5` / `#626A75` | Quiet backgrounds / captions and metadata (5.5:1) |
| `section-tint` | `#F4F6F5` | Alternate marketing sections (neutral grey, not mint) |
| `accent` | `#EEF1F0` | Hover background for menus and list rows |
| `border` | `#E5E7EB` | Card and divider lines |
| `input` | `#80878F` | Field borders and switch tracks (3:1 or more) |
| `ring` | `#1C3D6A` | Focus ring |
| `destructive`, `warning`, `success` | `#B42318`, `#8A5A00`, `#277A4D` | Errors, text-safe amber, success |
| `chart-1…5` | validated palette | Multi-series charts (single-series charts use `primary`) |
| `sidebar-*` | light grey | Dashboard sidebar |

**Navy surfaces:** `surface-navy` paints a navy background and flips the tokens (text, muted text, borders, links, focus ring → white); `tokens-navy` flips the tokens only. White cards and menus inside a navy section reset to the light tokens automatically.

**Accessibility (decided):** WCAG 2.1 AA everywhere. The focus ring is a solid 2px outline with a 2px gap: navy on light backgrounds, white on navy. Animations respect "reduce motion".

### Typography (`components/ui/typography.tsx`)

**Manrope** only, loaded once with `next/font` (`--font-brand`). Use the named components, not raw sizes:

| Marketing | | Dashboards | |
|---|---|---|---|
| `Display` | 40 / 48 / 60px, 800 | `PageTitle` | 24px, 600 |
| `H2` | 30 / 36px, 700 | `SectionTitle` | 18px, 600 |
| `H3` | 20px, 600 | body | 14px (`text-sm`) |
| `Lead` | 18px | `Caption` | 12px |
| body / `Small` | 16px / 14px | `Eyebrow` | 12px, 600, uppercase, 0.08em (one style everywhere) |

Headings are left-aligned by default; centred only for short single-statement sections. Paragraphs cap at about 70 characters. Numbers in tables and stats use `tabular-nums`. At most three weights per view.

### Shape, spacing and surfaces

- Radius: `--radius` 8px for buttons, inputs and small elements; cards 12px (`rounded-xl`). No other corner styles.
- 4px grid; use 4, 8, 12, 16, 24, 32, 48, 64, 96. Content max-width 1200px (`max-w-content`), 24px side padding on mobile, sections 96px / 64px vertical padding.
- Borders over shadows: cards use a 1px border and at most `shadow-xs`; clickable cards may lift to `shadow-md` on hover. No gradients or glows, except the homepage hero visual.
- Icons: lucide-react only. 16px inline, 20px in buttons and nav, 24px feature icons (`IconTile`).

### Variants (customise through these, never one-off overrides)

- **Button** (`components/ui/button.tsx`): `default` (green), `secondary`, `outline`, `navy` (dashboard actions such as Apply, Review), `on-navy` (on navy sections and the green hero), `inverse` (white with green text, on the green hero and its header), `ghost`, `link`, `destructive`. Sizes `xs`, `sm`, `default` (36px), `lg` (44px), `xl` (48px), `icon*`. Links that look like buttons use `<Button asChild><Link/></Button>`. Every state (hover, focus-visible, active, disabled, loading with `Spinner`) comes from the component.
- **Badge** (`components/ui/badge.tsx`), always text, never colour alone: programme status `open`, `upcoming`, `closed`, `archived` (calculated from dates); `draft` (amber tint with a pencil, content awaiting Bridge approval); `preview` ("Coming soon", Bridge AI); `sample` ("Sample profile", "Sample figures"); `verified`; `featured`; plus `secondary` and `outline`. Dashboard stage labels map onto these: the further along, the stronger the green.
- **Alert**: `default` (info), `success`, `destructive`. **Card** takes `as="section" | "article"`. **Table** takes `scrollLabel` so narrow screens scroll it in a labelled frame.

### Patterns

- **Forms:** `components/forms/Fields.tsx` (labels, "(required)", inline errors linked to the field, calendar date picker), an error summary that takes focus after a failed submit, a spinner on the submit button, and a toast on success.
- **Dashboards:** shadcn Sidebar frame (collapsible, breadcrumb, Ctrl+K search, notifications); page header = title, short description, actions on the right; one stat card, one table (`DataGrid`: search, sorting, filters in the toolbar, pages, empty state), one drawer (`DetailDrawer`, returns focus), dialogs for forms, toasts for confirmations; every list has empty, loading (Skeleton) and error states.

## 5. Content rules (non-negotiable)

These come directly from the spec and apply to every section.

1. **Never fabricate** statistics, reviews, ratings, testimonials, partner logos, endorsements, placement outcomes, addresses, phone numbers or social profiles.
2. Any figure or claim not yet approved by Bridge must be marked in the content file with `// TODO: awaiting Bridge approval` and shown with a visible **"Draft"** badge while `prototypeMode` is on (`content/site.ts`), including on the shared Vercel link. When `prototypeMode` is off (real launch), unapproved items are hidden entirely, never shown without the badge. (Aston, 7 November 2026.)
3. Features that are not yet live (e.g. Bridge AI) must be clearly labelled as **"Coming soon"** or **"Preview"**. **No live chat input** anywhere unless it is connected to a working service.
4. Sample talent profiles must be clearly illustrative (e.g. "Sample profile"). Never imply that a match or placement is guaranteed. Do not show match percentages.
5. Never display an expired deadline or suggest a closed programme is accepting applications.
6. Every image needs meaningful alt text.
7. Spelling: **British English** as used in the spec ("Programme", "personalised"). Confirm with Aston if the live site's "Program" should be kept instead.

## 6. Homepage structure (in order)

| # | Section | Key content |
|---|---|---|
| 1 | **Header** | Logo · For Talents, For Schools, For Companies, Ventures Lab, For Ecosystem (dropdowns) · Login (visually secondary) · Book a Discovery Call (primary). Sticky, compact, mobile menu. |
| 2 | **Hero** | Eyebrow "THE FUTURE OF TVET EMPLOYABILITY" · H1 "From Technical Skills to Real-World Opportunity." · supporting line · CTAs: Join a Programme (primary), Hire Vetted Talent (secondary), Book a Discovery Call (text link) · ecosystem visual: learner profiles, Skills Passport indicators, disciplines, partners and opportunity cards linked by a subtle network graphic. Not a generic AI animation, not an overcrowded map. **Built (9 Nov 2026) from Aston's Figma** (Bridge Designs, node 18:152): spec copy kept, last words of the H1 in amber, dotted Africa map with sample learners linked to Kigali (labelled illustration, Draft), Bridge AI preview bar that links to `/bridge-ai` (Coming soon, not an input). |
| 3 | **Trust and credibility** | "Built Around Real Learners. Connected to Industry." · stats: 1,000+ students, 24+ partner schools, 15+ industry firms, 45+ facilitators (**all awaiting approval**) · optional verified logos. |
| 4 | **The Bridge ecosystem** | Eyebrow "ONE CONNECTED JOURNEY" · "More Than Learning. A Pathway to Opportunity." · 3 service cards: Learn and Build, Prove Your Skills, Connect to Opportunity, each with capabilities list and CTA. |
| 5 | **Audience pathways** | "One Ecosystem. Different Pathways to Growth." · 4 consistent panels: Talents, Schools, Companies, Ecosystem Partners. |
| 6 | **Programmes and Ventures Lab** | "Opportunities to Learn, Build, and Grow." · programme cards driven by data · Ventures Lab featured when open · CTA Explore All Programmes. |
| 7 | **Talent discovery** | Eyebrow "SKILLS THAT CONNECT TO WORK" · "Help Employers See What Talent Can Do." · illustrative profile cards · CTAs Hire Vetted Talent, Explore the Skills Passport. |
| 8 | **Bridge AI** | Eyebrow "INTELLIGENCE FOR THE JOURNEY AHEAD" · "Your AI Companion from the Classroom to Your Career." · capabilities shown as a **product preview**, labelled as in development. |
| 9 | **Impact and learner stories** | "Progress That Goes Beyond Graduation." · approved stories only · CTA Explore Bridge's Impact. |
| 10 | **How Bridge works** | "One Connected Journey, from Learning to Opportunity." · 4 steps: Learn, Build, Demonstrate, Connect, with consistent icons · CTA Start Your Journey. Must not imply every student automatically goes through every stage. |
| 11 | **Insights and resources** | "Ideas for the Future of Technical Talent." · article cards · CTA Explore Resources. |
| 12 | **Final conversion** | "Let's Connect Technical Talent to Opportunity." · Join a Programme, Book a Discovery Call, Partner with Bridge link. Strong brand section (navy, with green accents; the spec asks for green, Aston chose navy on 7 Nov 2026). |
| 13 | **Footer** | Logo and mission line · audience links · About, Programmes and Resources · official contact details · official social links · Privacy Policy, Terms of Use, Cookie preferences. |

Full copy for every section is in the spec PDF. Copy it exactly into the content files; do not rewrite it.

## 7. Components: where things live

Every component is reviewed on **`/components-preview`** before it is used. To add one: install it with the shadcn CLI (`npx shadcn@latest add <name>`), make the focus ring and colours match section 4 inside `components/ui`, add it to the preview page, then use it.

| Area | Files |
|---|---|
| shadcn components, Bridge-themed | `components/ui/*` (button, badge, card, table, dialog, sheet, sidebar, tabs, select, field, …) and `components/ui/typography.tsx` |
| Content labels | `components/Badge.tsx` (Draft, Coming soon, Sample profile), `ApprovableDraft.tsx`, `StatusPill.tsx` (programme status from dates) |
| Marketing layout | `Header`, `Footer`, `HomeSection`, `PageHeader`, `SectionHeading`, `CtaBand`, `LinkButton`, `TextLink`, `IconTile`, `CheckList` |
| Marketing cards | `StatItem`, `ServiceCard`, `AudiencePanel`, `ProgrammeCardView`, `TalentCard`, `ArticleCard`, `StoryCard`, `JourneySteps`, `BridgeAiPreview`, `Hero` + `HeroVisual` |
| Forms | `components/forms/Fields.tsx`, `ApplyForm`, `DiscoveryCallForm`, `components/auth/*` (log in, create account, password reset, simulated social buttons) |
| Dashboard frame | `components/dashboard/DashboardShell.tsx`, `app/dashboard/[role]/loading.tsx` and `error.tsx` |
| Dashboard building blocks | `parts.tsx` (page header, panel, stat card, progress bar, empty state), `DataGrid.tsx`, `DetailDrawer.tsx`, `kit.tsx` (navy summary card, figure strip, today tabs, initials avatar, toolbar dropdown), `charts.tsx` (accessible single-series charts with "Show as table") |
| Role screens | `components/dashboard/{student,company,school,admin}/*`, shared `SettingsView.tsx` |

## 8. Quality bar

- Responsive at 375px, 768px, 1024px and 1440px; mobile keeps the same hierarchy and usefulness as desktop.
- Keyboard navigable; dropdowns work with keyboard and close with Escape.
- WCAG 2.1 AA contrast.
- Animations are restrained and turned off when the user has "reduce motion" enabled.
- Images optimised with Next.js `<Image>`.
- Every link and CTA points somewhere real or to a clearly marked placeholder route.

## 9. Open decisions (do not invent answers)

| Item | Status |
|---|---|
| Typeface | **Decided:** Manrope |
| Button green (`#3AAA6D` vs proposed `#277A4D`) | **Decided:** `#277A4D` (green-700) |
| Accent colour (if any) | Amber returns as a decorative accent in the dashboards (Aston's design, 7 Nov 2026); not used for text on white or for badges |
| Nav dropdown contents | Referenced as "shared in slides"; not yet supplied |
| Booking tool for "Book a Discovery Call" | Not specified |
| Programme data source | Prototype: shared sample data in `/data`. Real source not specified. |
| Login destination | Prototype (Aston, 8 Nov 2026): log in screen with email/password and simulated Google, Microsoft and LinkedIn buttons; the four sample users' emails open their dashboards with any password; simulated create-account and password-reset screens. Real login provider not specified. |
| Approved stats, logos, testimonials, photos | Awaiting Bridge |
| Official social accounts | Awaiting Bridge (the live footer's GitHub icon looks like a template leftover) |
| Analytics setup | Not specified |
| Hosting and deployment | Prototype: Vercel (`bridge-platform-eovr`), auto-deployed from GitHub `main`. Final hosting not specified. |
| Bridge sign-off on the green hero (Aston's Figma, 9 Nov 2026) and the navy final section | Aston to confirm with Bridge |
| Hero map: learners across Africa (Dakar, Lagos, Cairo, Addis Ababa, Kinshasa, Johannesburg) show ambition, not current reach | Shown with Draft until Bridge approves |

## 10. Definition of done (from spec 4.2.16)

1. Agreed sections and hierarchy implemented.
2. Bridge identity preserved and applied consistently.
3. Four audience pathways clear and functional.
4. Programme information reflects the approved source of truth.
5. Every CTA leads to its intended destination.
6. Works on desktop, tablet and mobile.
7. Accessibility, performance and security requirements met.
8. No fabricated statistics, endorsements or capabilities.
9. Bridge has approved final content, imagery and journeys.
