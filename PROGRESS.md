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
- Spec 4.2.13 asks for "a visually strong green section" for the final conversion band; Aston chose navy with green accents (7 Nov 2026). Bridge sign-off still needed.
- Decided 7 Nov 2026 (Aston accepted Claude's recommendations): H2 is 30px on mobile, 36px from 768px; headings left-aligned by default, centred only for short single-statement sections; hero eyebrow's full stop dropped.
- Live bridge.co.rw nav is Home · About (About Us, Success Stories, Partnerships, Resources) · Programs · Bridge Ventures Lab · Bridge AI · Contact. It has no audience menus, so the spec's dropdown contents are still unknown. Live header: sticky, 80px tall, 48px logo.
- Spec 4.2.2 suggests a transparent or integrated header over the hero where appropriate.
- The hero eyebrow is written with a full stop in the spec ("THE FUTURE OF TVET EMPLOYABILITY."); the others have none.
- Footer "Programmes and Resources" is treated as two links.
- Analytics: spec 4.2.15 wants important actions trackable; no setup agreed yet.
- [ ] Header with dropdowns and mobile menu (`components/Header.tsx` built and tested; awaiting Aston's review. Menu items are plain links until the dropdown contents from the slides arrive: add them as `children` in `content/home.ts`.)
- [x] Footer
- [x] Cards: service, audience panel, programme (with automatic Open, Upcoming, Closed and Archived status), talent profile, article, testimonial
- [x] Stat item, journey step, CTA band, badges ("Coming soon", "Sample profile", "Draft")

All Checkpoint 2 components built and self-tested; awaiting Aston's single review of the whole checkpoint.

**Aston reviews:** every component and state on the preview page, at desktop and mobile widths.

## Checkpoint 3: Homepage assembled

- [x] All 13 sections from CLAUDE.md section 6, in order, with the spec copy
- [x] Sample data wired in: programmes, talent cards, articles
- [x] Unapproved figures marked as Draft

Built and self-tested; awaiting Aston's review of the whole page.

**Aston reviews:** the full page from top to bottom, for hierarchy and flow.

## Checkpoint 4: Homepage polish

- [x] Hero ecosystem visual (network of profiles, skills, partners and opportunities)
- [x] Responsive at 375, 768, 1024 and 1440px (also 1280)
- [x] Keyboard navigation, focus states, contrast checked (axe: 0 issues on homepage and placeholder pages)
- [x] Restrained motion that is switched off when "reduce motion" is on

Built and self-tested; awaiting Aston's review. Then the homepage is demo-ready.

**Aston reviews:** the homepage is demo-ready.

## Checkpoint 5: Public pages

- [x] For Talents, For Schools, For Companies, For Ecosystem
- [x] Ventures Lab
- [x] Programmes list with filters, and a programme detail page with an apply flow (form with validation, loading and success states)
- [x] Resources list and article page
- [x] About, Book a Discovery Call (placeholder booking step), Privacy and Terms placeholders
- [x] Every header, footer and CTA link goes somewhere real (only Login remains a placeholder, for Checkpoint 6)

Built and self-tested; awaiting Aston's review.

**Aston reviews:** clicking every link on the site, with no dead ends.

## Checkpoint 6: Platform shell

- [x] "Sign in as…" screen with the four sample users
- [x] Shared dashboard layout: sidebar, top bar, page header
- [x] Dashboard components: stat cards, tables, lists, progress bars, empty states, filters, detail drawers
- [x] Each role lands on its own dashboard

Built and self-tested; awaiting Aston's review.

**Aston reviews:** the dashboard frame and components, before any role's screens are built.

## Checkpoint 7: Student dashboard

- [x] Overview: progress, next tasks, recommended opportunities (built from Aston's design)
- [x] Courses and assignments
- [x] Skills Passport (skills, project evidence, verification status, certificates, shareable view)
- [x] Opportunities and application tracking
- [x] Bridge AI shown as a labelled preview only

Built and self-tested; awaiting Aston's review.

Built from Aston's existing student dashboard designs. Share Figma frames or screenshots before this checkpoint starts.

## Checkpoint 8: Company dashboard

- [x] Talent discovery with search and filters (discipline, verified skills, availability)
- [x] Talent profile view built from the Skills Passport (public, authorised fields only)
- [x] Post and manage opportunities; see applicants
- [x] Shortlist

Built in the student dashboard's visual language (Aston, 7 Nov 2026); self-tested; awaiting review.

## Checkpoint 9: School dashboard

- [x] Student overview and progress by programme or class
- [x] Programme participation and placements
- [x] Institution profile and facilitators

Built in the student dashboard's visual language (Aston, 7 Nov 2026); self-tested; awaiting review.

## Checkpoint 10: Admin dashboard

- [x] Users (all roles) list and detail
- [x] Programme management: create, edit, open and close (feeding the public listing is wired in Checkpoint 11)
- [x] Content: approve stats, testimonials and articles (removing public Draft badges is wired in Checkpoint 11)
- [x] Reporting overview with charts

Built in the student dashboard's visual language; self-tested; awaiting review.

## Checkpoint 11: Connected journeys

- [x] Student applies to a programme → appears for School and Admin
- [x] Admin opens a programme → appears on the homepage and Programmes page
- [x] Company views a student's Skills Passport → student sees the interest
- [x] Sample data tells one coherent story across all four roles

Also: admin approvals remove Draft badges on the public site; company stage changes move the student's tracker; school verification shows on the student's passport. All journeys work within one browser tab (demo data is per tab).

**Aston reviews:** walking through each journey as each role.

## Checkpoint 12: QA and demo

- [x] Check against the acceptance criteria in CLAUDE.md section 10 (see table below)
- [x] Cross-device check (52 pages × 375, 768, 1024, 1440px)
- [x] Demo script: the 3–4 journeys to show Bridge, in order (`DEMO.md`)
- [x] Final deploy with a shareable link: https://bridge-platform-eovr.vercel.app

Definition of done (CLAUDE.md section 10), honest status:

| # | Criterion | Status |
|---|---|---|
| 1 | Agreed sections and hierarchy implemented | Done: all 13 homepage sections in spec order |
| 2 | Bridge identity preserved and applied consistently | Done in the prototype; Bridge's sign-off on navy-and-green is still open |
| 3 | Four audience pathways clear and functional | Done: homepage panels, four audience pages, four dashboards |
| 4 | Programme information reflects the approved source of truth | **Not yet**: dates are sample dates; needs Bridge's real programme data |
| 5 | Every CTA leads to its intended destination | Done for the prototype: no dead ends (crawl of 52 pages). Booking and login are clearly labelled stand-ins |
| 6 | Works on desktop, tablet and mobile | Done: no sideways scrolling at 375, 768, 1024, 1440px |
| 7 | Accessibility, performance and security | Accessibility done (axe WCAG 2.1 AA: 0 issues in 208 checks; keyboard, focus, reduced motion). Performance not formally measured. No backend yet, so security review comes with the real build |
| 8 | No fabricated statistics, endorsements or capabilities | Done: all samples labelled; unapproved items Draft; Bridge AI shown as preview; no match percentages; no real company names |
| 9 | Bridge has approved content, imagery and journeys | **Not yet**: needs Bridge's review |

## Checkpoint 13: Fill every unfinished page

- [x] Privacy Policy, Terms of Use and Cookie preferences: full Draft template text with [bracketed gaps] for facts only Bridge can supply; working cookie choice
- [x] Resources: two full Draft articles; reading time calculated from the text
- [x] Impact page: how stories are collected (with consent) and how figures will be reported, both Draft. Stories themselves stay placeholders (content rule 1)
- [x] Student course pages with lesson lists, a lesson view and "Mark as complete"
- [x] Messages (student) with three sample conversations; companies can message an applicant from the applicant drawer
- [x] Settings for all four roles; the student's Skills Passport privacy choices take effect on the public passport and in company talent search
- [x] Programmes created in the admin dashboard get their own public page (this browser tab only)

**Aston reviews:** the pages listed above, each role's Settings, and the privacy effects.

## Redesign on shadcn/ui (REDESIGN-BRIEF.md)

Branch `shadcn-redesign`. One step at a time, each reviewed by Aston before the next. Screenshots are kept locally in `/screenshots` (git-ignored).

- [x] Step 1: Audit and "before" screenshots (118 screenshots: 59 pages at 1440 and 375px)
- [x] Step 2: Foundation: shadcn set up, Bridge theme, components installed, `/components-preview` rebuilt (approved 8 Nov 2026)
- [x] Step 3: Shared layout: header, footer, section heading, CTA band, every card type, badges (approved 8 Nov 2026)
- [ ] Step 4: Homepage
- [ ] Step 5: Public pages
- [ ] Step 6: Platform shell
- [ ] Step 7: Dashboards (Student, Company, School, Admin)
- [ ] Step 8: Clean-up and QA

Decisions (Aston, 8 Nov 2026):
- His student dashboard design shows what belongs on a dashboard, not how it should look. All dashboards are redesigned on shadcn.
- Fix every contrast issue, including field borders and switch tracks.
- Focus ring stays navy on light backgrounds and white on navy.
- Screenshots stay local only.
- Step 3 review: alternate sections stay neutral grey (not mint); REDESIGN-BRIEF.md stays local and git-ignored.
- Step 2 review: Draft label is the amber tint with a pencil (option A); dashboard sidebar stays light grey; the neutral outline button replaces the old green outline; branch pushed for a Vercel preview link.

---

## Changelog

(Claude Code adds a short entry after each working session.)

### 2026-11-08 — Redesign Step 3: shared layout
- Header rebuilt on the shadcn Navigation Menu, with a slide-in Sheet menu on phones and tablets. Full menu from 1024px (was 1280px). Navy at the top of the homepage, solid white once scrolled.
- Footer, section heading, section wrapper, page header, CTA band, stats, and every card type (service, audience, programme, talent, article, story, feature grid, journey steps, Bridge AI preview) rebuilt on shadcn Card, Badge, Separator, Avatar and the type scale.
- Badges: the Draft label is the amber tint with a pencil everywhere; programme status uses the new status badges. On navy, badges swap to navy-safe colours.
- `components/Button.tsx` is now a transition adapter that draws the shadcn Button, so every button on the site has the new look; it is deleted in Step 8.
- New helpers: `IconTile`, `TalentField`, `tokens-navy` utility, `section-tint` token (alternate sections are neutral grey instead of mint; Aston agreed).
- `/components-preview` gains a "Shared layout" section.

### 2026-11-08 — Redesign Steps 1 and 2: audit and shadcn foundation
- Step 1: audit of every page and component; 118 "before" screenshots saved locally.
- Created branch `shadcn-redesign`; `/screenshots/` git-ignored.
- shadcn/ui set up with the Vega style (the current name for "New York"), Radix and lucide icons; 44 components installed in `components/ui`. Also installed: react-hook-form, zod and resolvers (forms), TanStack Table v8 (tables; v9 changed its API), Recharts, Sonner, cmdk, react-day-picker and date-fns (all shadcn dependencies). Removed next-themes (light theme only).
- Bridge theme in `app/globals.css`: brand colours as shadcn tokens. Contrast fixes: captions #626A75, field borders #80878F, secondary text green-700. New tokens: `brand-navy`, `heading`, `eyebrow-foreground`, `link`, `warning`; `surface-navy` utility flips text, links and the focus ring for navy sections.
- Components adjusted for Bridge: focus ring (2px with 2px gap), primary hover green-800, Bridge button variants (navy, on-navy) and marketing sizes, Bridge badge variants (programme status, Draft, Preview, Sample, Verified), navy titles, stronger toggle and tab states.
- Type scale as named components in `components/ui/typography.tsx`.
- `/components-preview` rebuilt to show every component, variant and state.
- Old tokens and components are kept, marked "legacy", until their pages are migrated (deleted in Step 8). Pages look unchanged so far.

### 2026-11-08 — Checkpoint 13: every unfinished page filled
- New content files: `content/legal.ts` (privacy, terms, cookies), message threads in `data/messages.ts`, article bodies in `data/articles.ts`, lessons in `data/student.ts`. All new wording is marked Draft.
- New screens: student course page (`/dashboard/student/courses/[course]`), Messages, and Settings for every role. Messages and Settings are no longer "Coming soon" in the dashboard menus.
- Privacy settings (`lib/privacy.ts`) switch off Diane's public passport link and hide her availability from companies.
- Footer mission line now uses the live site's wording.
- Fixed: sending a message crashed the page in recent Chrome (a scroll call returned a value React misread).
- Settings and cookie switches restyled as toggle switches; the off state meets 3:1 contrast for controls.

### 2026-11-07 — Checkpoints 11 and 12: connected journeys, QA and demo
- Aston approved deleting unused files: StudentApplications, CompanyTalentTable, AdminProgrammeTable components and two leftover data blocks removed.
- Programme card and detail split into presentational views (`ProgrammeCardView`, `ProgrammeDetailView`) plus a browser layer (`LiveProgrammes`) that applies admin programme edits from this session to the homepage, Programmes list, Ventures Lab and programme pages. `arrangeProgrammes` in `lib/programmes.ts`.
- Draft badges take an `approvalKey`; approved items lose the badge on the public site (`ApprovableDraft`).
- Live notifications between roles (`addNotice` / `readNotices`), shown first in each dashboard's bell: programme applications (school, admin), opportunity applications (company), skill requests (school), profile viewed, shortlisted, stage moved, skill verified (student).
- Student application tracker follows the company's stage; admin programme table shows session applications.
- "Reset demo data" on the sign-in screen clears everything the demo saved in the tab.
- QA: crawl found 52 pages, no broken links; axe 0 issues in 208 checks (52 pages × 4 widths); no sideways scrolling on any page at 375, 768, 1024 or 1440px after two fixes: dashboard header buttons now stack under the title below 1024px, and table frames now contain their screen-reader-only labels (they had widened the Content approvals page at 768px). Button text no longer wraps.
- `DEMO.md`: four journeys for presenting to Bridge, with setup, clicks and talking points. Verified by an automated run of all journeys in one tab.

### 2026-11-07 — Checkpoints 9 and 10: school and admin dashboards
- Direction (Aston): same visual language as the student dashboard, built together.
- Shared kit `components/dashboard/kit.tsx`: ColorTile, SummaryPanel (gradient card + mini stats), TodayTabs, ArrowLink, Pill. `StatusPill` moved to its own file so browser components can use it.
- School (Jean-Paul K.): overview with class tiles (average progress), institution snapshot, verification requests, "what's next today?" (Verify / Placements / Programmes); Students (search, class filter, progress, drawer); Programmes (live status, sample learner counts, Diane's session application flagged); Placements (sample employers, no-guarantee note); Institution profile with facilitators and a validated Add facilitator form.
- Cross-role journey: skills Diane adds (and her pending sample skills) arrive as verification requests; verifying one shows it as "Verified by Sample TVET School" on her Skills Passport.
- Admin (Eric H.): overview with programme table, platform snapshot, approvals queue and today tabs; Users (all roles, search, role filter, drawer); Programmes (create and edit with date-order validation, "open/close applications today", live status preview; status always from dates); Content approvals (approve / request changes for all 11 Draft items); Reports (stat tiles, weekly sign-ups column chart, two bar charts; one hue, tooltips on hover and keyboard focus, "Show as table" for each, labelled "Sample figures, not real data").
- Data: `data/school.ts`, `data/admin.ts`. Wording in `content/dashboard.ts` (Draft).
- Tested: axe 0 issues on all 10 school and admin screens at 1440, 1024, 375 (after adding image roles to chart bars); no sideways scrolling; verification journey end to end; class filter; facilitator form (3 errors, then added); programme date-order error, status preview, creation; approvals (11 → 9); chart keyboard tooltip.
- Unused files awaiting Aston's OK to delete: `components/dashboard/StudentApplications.tsx`, `CompanyTalentTable.tsx`, `AdminProgrammeTable.tsx`, plus `studentCourses` and `overviewText` leftovers.

### 2026-11-07 — Checkpoint 8: company dashboard
- Direction (Aston): same visual language as the student dashboard; no separate design.
- Overview: "Welcome, Grace." with live counts, Find talent / Post an opportunity; Recommended talent (coloured tiles like course cards, picked by skills that match open roles); Hiring snapshot (gradient card + mini stats); Recent applicants with navy Review pills; "what's next today?" tabs (Review / Interviews / Post).
- Talent discovery: search, discipline, availability, verified-only; profile drawer from the Skills Passport (public, authorised fields only) with Add to shortlist; link to Diane's public passport.
- Opportunities: postings table (Open / Draft / Closed), manage drawer (close, reopen, publish), "Post an opportunity" form with validation, save as draft or publish.
- Applicants: role and stage filters, drawer to move stage (New, Reviewing, Interview, Offer, Not progressing), note that Bridge never guarantees a match or placement.
- Shortlist page. All changes kept in this browser tab (`CompanyData` provider keeps panels in sync).
- Connected journey: Diane's application to the Back-End Developer Intern role (made in the student dashboard) appears in Grace's applicants as "Applied in this session".
- Sample data: `data/company.ts`; three more sample learners in `data/talent.ts` (public pages still show three).
- Tested: axe 0 issues on company screens at 1440, 1024, 375 (after fixing white initials on amber tiles, now navy); no sideways scrolling; filters (6 / 2 / 1 / 1); shortlist sync; posting validation (5 errors) and creation; close posting; journey; stage change reflected in table and snapshot.
- Also unused now: `components/dashboard/CompanyTalentTable.tsx` (replaced). Awaiting Aston's OK to delete, with the two files listed under Checkpoint 7.

### 2026-11-07 — Checkpoint 7: student dashboard (Aston's design)
- Aston supplied the student dashboard design. Decisions: his frame (top pill menu, white icon rail, grey-green background) for all four roles, replacing the navy sidebar; sample employers and matched skills in words instead of real company names, logos and match percentages (content rules 1 and 4); design colours kept accessible (green buttons use green-700, navy "Apply" buttons, amber back as a decorative accent, new grey-green background and deep-green tokens); every control works with sample data.
- New tokens: gray-50, green-deep, amber-500, amber-600, text-panel (26px panel titles), radius-tile (16px), radius-panel (28px). CLAUDE.md colour and button tables updated. Passport gradient ends at green-700 (not brand green) so white text passes; module chips sit on a navy overlay so white text passes on amber.
- Button: `shape="pill"` and a Navy variant.
- New frame `DashboardShell` for all roles: search dialog (focuses the field), notifications menu, account menu, icon rail with tooltips and accessible names, mobile menu dialog.
- Student screens: overview (courses, Skills Passport card with rank labelled as sample, opportunities, "what are you doing today?" with Build / Learn / Connect tabs, weekly goal ring, up next, date-range selector that updates completed lessons), Courses (filter), Assignments (filter, drawer, submit), Resources, Opportunities (apply dialog + application tracker that also shows programme applications from the website), Skills Passport (skills with verifier and evidence, projects, certificates, Add New Skill, copy shareable link), Bridge AI preview. Messages and Settings show "not in the prototype yet".
- Public shareable passport at `/passport/BR-2026-0417`: verified skills, projects, certificates only; never contact details.
- Sample data: `data/student.ts`, `data/opportunities.ts` (incl. notifications); Diane M.'s public skills aligned with the design's back-end story.
- Tested: crawl from sign-in (44 pages, no dead ends); axe 0 issues on 13 screens at 1440, 1024 and 375px; no sideways scrolling at 375, 1024, 1280, 1440 for all roles; date range (25 / 16 / 7 lessons); tabs with arrow keys; search; notifications; apply → Applied → tracker; assignment error and submit; Add New Skill auto-opens from #add; public passport has no email or phone.
- Fixed during testing: page overflow at 1024–1440 (grid columns, top-bar width), cramped table (Match merged into Skills), 2×2 course grid at 1440, search box not taking focus.
- Left in place for Aston's decision: `components/dashboard/StudentApplications.tsx` (unused, replaced by ApplicationsTracker) and `studentCourses` in `data/dashboard.ts` (unused).

### 2026-11-07 — Checkpoint 6: platform shell
- Decisions (Aston): navy dashboard sidebar; delete the unused placeholder-page template (`app/[slug]`, `content/placeholders.ts`), done.
- `/sign-in`: four sample users (Diane M. student, Jean-Paul K. school, Grace N. company, Eric H. admin) in `data/users.ts`; no passwords, nothing stored. `/dashboard` redirects there.
- `DashboardShell`: navy sidebar (green bar marks the current page), white top bar with "Prototype · sample data" label and the sample user, Switch user and Back to website. Below 1024px the sidebar is a slide-in menu (native dialog). Public header and footer hidden on dashboards (`SiteChrome`).
- Components in `components/dashboard/`: DashPageHeader, Panel, StatCard, ProgressBar, EmptyState, DataTable (scrolls inside its frame on phones), ListItem, DetailDrawer (native dialog), plus CompanyTalentTable (search, discipline filter, drawer), AdminProgrammeTable (drawer), StudentApplications.
- Role overviews use the shared sample data: student courses and applications; school learner progress table; company talent table; admin programme table (live statuses) and a count of items awaiting Bridge approval (11, worked out from the data).
- Connected journey, first step: applications made on the public site this session appear on the student dashboard.
- Every sidebar link works; screens for Checkpoints 7–10 show an empty state naming the checkpoint.
- All dashboard wording in `content/dashboard.ts` (new, Draft).
- Tested: crawl of sign-in and all 22 dashboard screens (no dead ends; unknown role shows 404); axe 0 issues at 1440 and 375px; no sideways scrolling; search and filter counts; drawer opens by keyboard with focus inside, Escape closes, focus returns; mobile menu opens and closes; apply-then-dashboard journey.

### 2026-11-07 — Checkpoint 5: public pages
- Copy approach (Aston): reuse spec and live-site copy; anything new is marked Draft. All page copy in `content/pages.ts`, every block labelled spec / live / NEW. Live-site US spellings changed to British. Live figures and fees (60 innovators, ~100 shortlisted, 50,000 Frw fee) marked Draft.
- 20 new pages: For Talents, For Schools, For Companies, For Ecosystem, Ventures Lab, Programmes (filters), Programme detail (×4, apply form when open), Resources, Article (×2), About, Book a Discovery Call, Learning, Skills Passport, Opportunities, Bridge AI, Impact, Privacy, Terms, Cookies. Only Login remains a placeholder.
- New components: PageHeader, FeatureGrid, ProgrammeBrowser (status filter), form fields with error summary, ApplyForm, DiscoveryCallForm, TopicPage, FinalBand, LegalPage. New Outline button (CLAUDE.md updated). Draft option on SectionHeading.
- Forms: validation with an error summary that links to each field, live re-checking, loading state, success message; saved to the browser tab only, with a visible "Prototype: nothing is sent" note.
- Legal pages contain no invented legal text.
- Tested: link crawl from the homepage (24 pages, no dead ends; unknown addresses show 404); axe 0 issues on all 24 pages at 1440 and 375px; no sideways scrolling at 375px; filter counts correct; apply form (8 errors on empty submit, focus to summary, invalid email message, loading, success, saved); closed programmes show no form; discovery form (6 errors).
- Fixed during testing: Secondary buttons invisible on light-green headers (now Outline), duplicate Ventures Lab heading, sticky header covering scrolled-to fields (scroll padding).

### 2026-11-07 — Checkpoint 4: homepage polish
- Aston approved Checkpoint 3 and Claude's open suggestions (navy hero, integrated header).
- `components/HeroVisual.tsx`: sample learner's Skills Passport (Diane M., labelled Sample profile) linked by dashed green lines to disciplines (live-site tracks), a partner school, an industry partner and a sample opportunity. Network layout from 1280px; simplified stacked version below. One accessible description for screen readers. Wording in `content/home.ts` (`heroVisual`).
- Motion: a slow 3-second flow along the lines; removed entirely under reduced motion.
- Integrated header: navy on the homepage while at the top of the hero, white once scrolling starts or the menu opens.
- Badges never wrap onto two lines.
- Tested: axe (WCAG 2.1 A/AA) found 0 issues on the homepage at 1440 and 375px and on placeholder pages; the only findings on /components-preview are the deliberately failing samples in its Contrast table. 90 keyboard stops, all with a visible focus ring; skip link first. Screenshots at 375, 768, 1024, 1280 and 1440px with no sideways scrolling.
- Fixed during testing: overlapping cards and hidden lines in the first hero-visual layout, passport header wrapping, partner cards overlapping at 1024px.

### 2026-11-07 — Checkpoint 3: homepage assembled
- Aston approved all Checkpoint 2 components as built.
- Header and footer moved into `app/layout.tsx`, so every page has them. Page titles now read "Page · Bridge".
- `app/page.tsx`: all 13 sections in spec order. Backgrounds alternate white and green-50; navy for hero, final band and footer.
- New: `Hero` (navy, like the live site; reserved, clearly labelled space for the Checkpoint 4 ecosystem visual), `BridgeAiPreview` (static capability panel, "Preview · in development" badge, no chat input), `HomeSection` wrapper, `textOnDark` button style (white link with arrow for navy backgrounds), "Preview" badge.
- Homepage hides archived programmes (they belong in the full listing). Stories and articles sections disappear at launch if nothing is approved.
- Fixed: hero headline breaking "Real-World" at the hyphen.
- Self-tested: type check, lint, build; screenshots at 375, 768, 1024 and 1440px; no sideways scrolling.

### 2026-11-07 — Components 6–14 in one batch
- Working style changed at Aston's request: whole checkpoints are built, then reviewed together (CLAUDE.md section 1 updated).
- Sample data in `/data`: programmes (live-site names, descriptions and eligibility; SAMPLE dates chosen to show all four statuses), illustrative talent profiles, two articles from the live Resources section, and an empty stories list. All unapproved items show Draft.
- `lib/programmes.ts`: status calculated from dates in Kigali time, at request time (not build time), so it changes on the right day without a redeploy.
- New components: ServiceCard, AudiencePanel, ProgrammeCard (+ featured Ventures Lab layout), TalentCard, JourneySteps, ArticleCard, StoryCard (bracketed placeholder until approved stories exist), CtaBand (navy, green symbol accents), Footer (contact details from the live site marked Draft; mission and social links shown as placeholders), ImagePlaceholder.
- Interface wording in `content/ui.ts`.
- Not used on purpose: the live site's testimonials (look like template content) and its webinar resource (expired event described as upcoming).
- Self-tested: type check, lint, build; screenshots at 375, 768 and 1440px; no sideways scrolling. Fixed during testing: audience panel button disappearing on its own background, programme card footer alignment, talent card header crowding.
- Hero ecosystem visual stays in Checkpoint 4, as planned.

### 2026-11-07 — Component 5: stat item and badges
- Header approved to continue; real dropdown contents to be added later.
- Decisions (Aston accepted recommendations): stats use a navy number with a short brand-green bar above and a grey label; unapproved content shows a "Draft" badge on the prototype, including the Vercel link.
- `prototypeMode` switch in `content/site.ts`: when turned off for launch, unapproved content is hidden entirely. CLAUDE.md content rule 2 updated to match.
- `components/Badge.tsx`: Draft (grey, dashed border), Coming soon and Sample profile (light green until an accent colour is chosen).
- `components/StatItem.tsx`: stat item plus a list that is four across from 1024px and two by two below. Numbers are 30px on phones, 40px from 768px. Fits at 320px.
- The spec's stat labels end with full stops ("facilitators."); kept as written for now.

### 2026-11-07 — Component 4: header
- Decisions (Aston accepted recommendations): menu items are plain links now, with dropdowns switched on per item when the slide contents arrive; Login is a plain text link.
- `components/Header.tsx`: sticky; 64px tall on mobile, 72px from 1280px. 1280px+: logo, menu, Login, Book a Discovery Call. 768–1279px: logo, button, menu button. Below 768px: logo and menu button only.
- Dropdowns: open with click, Enter or Space; close with Escape (focus returns), clicking away or tabbing away. Mobile menu: Escape closes, page behind doesn't scroll, closes after navigating. "Skip to main content" link added.
- Tested in Chrome: all of the above, no sideways scrolling at 375, 768, 1024, 1280 and 1440px; all five items still fit at 1280px with dropdown arrows. Fixed a bug where Login and the button showed on small screens.
- Placeholder pages for every link destination (`app/[slug]/page.tsx`, list in `content/placeholders.ts`), marked "Placeholder page" and hidden from search engines. Unknown addresses show the 404 page.
- Header shown at the top of `/components-preview`, with a dropdown test using clearly labelled sample items. Not yet on the homepage (Checkpoint 3).

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
