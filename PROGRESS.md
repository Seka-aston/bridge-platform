# Bridge 1.0 — Prototype Plan and Progress

Goal: a **full working prototype** of the Bridge platform. That means the public website plus the four dashboards, fully clickable, with realistic sample data.

Read this file with CLAUDE.md at the start of every session. Work on one checkpoint at a time. Tick items as they are finished, and stop at the end of each checkpoint so Aston can review it before moving on.

## Prototype scope

**In scope:** all public pages, all four dashboards, the journeys that connect them, and responsive layouts. Everything runs on shared sample data.

**Not in scope yet:** real accounts and passwords, a database, sending emails, payments, a live AI chat, or real booking. These are faked convincingly and clearly marked, so a real backend can replace them later without redesigning anything.

- **Login:** a "Sign in as…" screen with four sample users (Student, School, Company, Admin). No passwords.
- **Data:** one shared sample dataset in `/data` (students, schools, companies, programmes, opportunities, applications, articles), used by every page so the story is consistent across roles.
- **Changes during a demo** (e.g. a student applies to a programme) are kept in the browser for that session only.

---

## Checkpoint 0: Setup

- [x] Next.js + TypeScript + Tailwind project created around the existing CLAUDE.md and PROGRESS.md
      (Next.js 16.4.5, lucide-react installed, `content/site.ts` added, lint and build pass)
- [x] Manrope loaded with `next/font` (set only in `app/layout.tsx` via `--font-brand`; Geist removed)
- [x] Git initialised, first commit made
      (pushed to github.com/Seka-aston/bridge-platform, branch `main`; commits use g.seka@alustudent.com, which is linked to the Seka-aston GitHub account)
- [ ] Project runs locally; Aston knows how to open it in the browser (runs; awaiting Aston's check)
- [x] (Optional) Connected to GitHub and Vercel so every update gets a shareable preview link
      (Vercel project `bridge-platform-eovr` in team "lineaar's projects"; live at https://bridge-platform-eovr.vercel.app.
      Pushes to `main` publish the live site; other branches get their own preview link. Preview links only open for
      people signed in to the Vercel team; share the main link with Bridge. Node 22.x on Vercel, matching Aston's Mac.)

**Aston reviews:** the empty site opens in the browser.

## Checkpoint 1: Design foundation

- [x] Colour, type, spacing, radius and shadow tokens from CLAUDE.md section 4 (in `app/globals.css`; awaiting Aston's review)
- [x] `/components-preview` page showing the type scale, colours and buttons in every state (awaiting Aston's review of buttons)
- [x] Logo added as SVG (green, amber and white versions in `public/brand/`, shown with `components/Logo.tsx`)
- [x] Remove the starter's automatic dark mode
- [x] Replace the Next.js sample homepage and delete the sample images in `public/` (temporary placeholder homepage)
- [x] Add the meta description from the spec to `content/site.ts` (spec has none; using the hero supporting statement, 173 characters)

Decisions made in this checkpoint (Aston, 7 Nov 2026; recorded in CLAUDE.md):
- Buttons and text links use green-700 #277A4D (brand green #3AAA6D failed contrast).
- Secondary button text is green-700, not green-600 (green-600 on green-50 is 3.9:1 and failed).
- New token green-800 #1F6340 for hover and pressed states.
- Focus ring: 2px navy with a 2px gap on light backgrounds, 2px white on navy.
- Aston approved the tokens and typography as built.
- Header logo: green version (wordmark is brand green-500), 32px tall on mobile and 40px from 768px up; letters are then 13px and 16px tall. Chosen by Claude at Aston's request.
- Mobile H1 set to 40px (the brief says 36–40px); line-height 1.0 as specified.
- Shadows copied from the live site's cards (Tailwind `shadow-md` / `shadow-lg` values); card radius 12px matches the live site.

**Aston reviews:** type, colour and buttons feel right. All later work depends on this step.

## Checkpoint 2: Shared components

- [x] Section heading block (eyebrow, title, intro) (`components/SectionHeading.tsx`; awaiting Aston's review)

Spec notes (from `Bridge 1.0.pdf`, kept out of git because the repo is public):
- All homepage copy is now in `content/home.ts`, copied exactly from spec 4.2. Link destinations are placeholder routes until Checkpoint 5.
- Spec 4.2.13 asks for "a visually strong green section" for the final conversion band; CLAUDE.md says navy with green accents. Needs Aston's call.
- Spec 4.2.2 suggests a transparent or integrated header over the hero where appropriate.
- The hero eyebrow is written with a full stop in the spec ("THE FUTURE OF TVET EMPLOYABILITY."); the others have none.
- Footer "Programmes and Resources" is treated as two links.
- Analytics: spec 4.2.15 wants important actions trackable; no setup agreed yet.
- [ ] Header with dropdowns and mobile menu
- [ ] Footer
- [ ] Cards: service, audience panel, programme (with automatic Open, Upcoming, Closed and Archived status), talent profile, article, testimonial
- [ ] Stat item, journey step, CTA band, badges ("Coming soon", "Sample profile", "Draft")

**Aston reviews:** every component and state on the preview page, at desktop and mobile widths.

## Checkpoint 3: Homepage assembled

- [ ] All 13 sections from CLAUDE.md section 6, in order, with the spec copy
- [ ] Sample data wired in: programmes, talent cards, articles
- [ ] Unapproved figures marked as Draft

**Aston reviews:** the full page from top to bottom, for hierarchy and flow.

## Checkpoint 4: Homepage polish

- [ ] Hero ecosystem visual (network of profiles, skills, partners and opportunities)
- [ ] Responsive at 375, 768, 1024 and 1440px
- [ ] Keyboard navigation, focus states, contrast checked
- [ ] Restrained motion that is switched off when "reduce motion" is on

**Aston reviews:** the homepage is demo-ready.

## Checkpoint 5: Public pages

- [ ] For Talents, For Schools, For Companies, For Ecosystem
- [ ] Ventures Lab
- [ ] Programmes list with filters, and a programme detail page with an apply flow (form with validation, loading and success states)
- [ ] Resources list and article page
- [ ] About, Book a Discovery Call (placeholder booking step), Privacy and Terms placeholders
- [ ] Every header, footer and CTA link goes somewhere real

**Aston reviews:** clicking every link on the site, with no dead ends.

## Checkpoint 6: Platform shell

- [ ] "Sign in as…" screen with the four sample users
- [ ] Shared dashboard layout: sidebar, top bar, page header
- [ ] Dashboard components: stat cards, tables, lists, progress bars, empty states, filters, detail drawers
- [ ] Each role lands on its own dashboard

**Aston reviews:** the dashboard frame and components, before any role's screens are built.

## Checkpoint 7: Student dashboard

- [ ] Overview: progress, next tasks, recommended opportunities
- [ ] Courses and assignments
- [ ] Skills Passport (skills, project evidence, verification status, certificates, shareable view)
- [ ] Opportunities and application tracking
- [ ] Bridge AI shown as a labelled preview only

Built from Aston's existing student dashboard designs. Share Figma frames or screenshots before this checkpoint starts.

## Checkpoint 8: Company dashboard

- [ ] Talent discovery with search and filters (discipline, verified skills, availability)
- [ ] Talent profile view built from the Skills Passport (public, authorised fields only)
- [ ] Post and manage opportunities; see applicants
- [ ] Shortlist

## Checkpoint 9: School dashboard

- [ ] Student overview and progress by programme or class
- [ ] Programme participation and placements
- [ ] Institution profile and facilitators

## Checkpoint 10: Admin dashboard

- [ ] Users (all roles) list and detail
- [ ] Programme management: create, edit, open and close (feeds the public programme listing)
- [ ] Content: approve stats, testimonials and articles
- [ ] Reporting overview with charts

## Checkpoint 11: Connected journeys

- [ ] Student applies to a programme → appears for School and Admin
- [ ] Admin opens a programme → appears on the homepage and Programmes page
- [ ] Company views a student's Skills Passport → student sees the interest
- [ ] Sample data tells one coherent story across all four roles

**Aston reviews:** walking through each journey as each role.

## Checkpoint 12: QA and demo

- [ ] Check against the acceptance criteria in CLAUDE.md section 10
- [ ] Cross-device check
- [ ] Demo script: the 3–4 journeys to show Bridge, in order
- [ ] Final deploy with a shareable link

---

## Changelog

(Claude Code adds a short entry after each working session.)

### 2026-11-07 — Spec copy, meta description, section heading
- Aston added the spec PDF. It is git-ignored so it stays out of the public repo.
- `content/home.ts`: all homepage copy from spec 4.2, copied exactly (ligature characters in "Different", "Official" fixed). Stats marked as awaiting Bridge approval; footer mission, contact and social left empty for Bridge to supply.
- Meta description set to the hero supporting statement (the spec has no separate one).
- `components/SectionHeading.tsx` (component 3): eyebrow, title, supporting copy; left or centred; light or navy tone; H1 or H2. Eyebrows turn white on navy for contrast.
- Section heading examples added to the top of `/components-preview`.
- Checkpoint 1 complete.

### 2026-11-07 — Logo
- Added Aston's three logo versions (green, amber, white wordmark), first as PNGs, then replaced with his SVG exports copied exactly; PNGs removed.
- `components/Logo.tsx` shows any version at a chosen height, or the "header" preset (32px mobile, 40px from 768px), with alt text "Bridge".
- Symbol cut out as the browser-tab icon (`app/icon.png`); default Next.js `favicon.ico` removed.
- Logo section added to the top of `/components-preview`.
- Header uses the green version (see decisions above).

### 2026-11-07 — Component 2: buttons
- `components/Button.tsx`: Primary, Secondary, Ghost (on navy) and Text link variants; medium and large sizes; hover, pressed, keyboard focus and disabled states. Renders a link when given `href`, otherwise a button.
- Added green-800 token. Secondary hover fill is green-500 at 15% (no new hex).
- Buttons section added to the top of `/components-preview`, with every state side by side and "Try it" rows.
- CLAUDE.md updated with the four button decisions.
- Lint and build pass; checked at 375px and 1440px.

### 2026-11-07 — Component 1: design tokens and base typography
- CLAUDE.md hosting row updated to Vercel.
- `app/globals.css`: brand colours (Tailwind's own palette switched off), type scale, radius, shadows, content width, gutter and section spacing as tokens. Dark mode removed. Reduced-motion rule added.
- New `/components-preview` page (hidden from search engines) showing colours, measured contrast, type scale, shape, shadow and layout tokens.
- Sample homepage replaced with a placeholder (copy in `content/site.ts`); five Next.js sample images deleted.
- Lint and build pass; checked at 375px and 1440px.

### 2026-11-07 — Vercel connected
- Vercel CLI updated to 65.12.1. Vercel project `bridge-platform-eovr` was already linked to the GitHub repo (imported via the Vercel website).
- Deleted an empty duplicate Vercel project named `bridge-platform`.
- Set the Vercel Node version to 22.x to match the local machine.
- Preview protection left on (previews need a Vercel sign-in); the address keeps its "-eovr" ending until a real domain is chosen.
- Skipped on purpose from Vercel's agent guide: the Vercel plugin/skills for Claude and the Vercel MCP server (not needed; would widen AI access).

### 2026-11-07 — Manrope added
- Replaced the starter's Geist fonts with Manrope (self-hosted by Next.js, no requests to Google).
- Font is chosen in one place, `app/layout.tsx`; `app/globals.css` uses it as the site default. Lint and build pass.

### 2026-11-07 — CLAUDE.md updated, git and GitHub connected
- CLAUDE.md updated to match this plan: full prototype including dashboards, Manrope as the typeface, `/data` for shared sample data, "Sign in as…" for prototype login.
- Git initialised on `main`; first commit pushed to github.com/Seka-aston/bridge-platform (public repo).

### 2026-11-07 — Progress files merged
- Merged the original PROGRESS.md into the new prototype plan; PROGRESS-new.md deleted.
- Checkpoint 0 items ticked where done; starter leftovers and the meta description TODO moved into Checkpoint 1.

### 2026-11-07 — Project setup
- Created a Next.js 16.4.5 project (App Router, TypeScript, Tailwind CSS v4, ESLint) in this folder. CLAUDE.md is untouched.
- Installed `lucide-react` for icons.
- Added `content/site.ts` (site name; meta description left as a TODO for the spec copy).
- Browser tab title now reads "Bridge"; page language set to British English (`en-GB`).
- Lint and production build both pass.
- Still from the starter, to replace in Checkpoint 1: Geist font (to be replaced by Manrope in Checkpoint 0), automatic dark mode, and the Next.js sample homepage and images in `public/`.
- No git repository set up yet.
