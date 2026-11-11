import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Caption, Display, Eyebrow, H2, H3, Lead, P, PageTitle, SectionTitle, Small } from "@/components/ui/typography";
import { Demo, Section } from "./Section";

/*
  Foundations: the Bridge theme tokens as they are mapped into shadcn/ui.
  Contrast figures were calculated on 8 Nov 2026 (WCAG 2.1: 4.5:1 for text, 3:1 for
  field borders, switch tracks and focus rings).
*/

type Swatch = { token: string; value: string; use: string; contrast?: string; changed?: string };

const groups: { title: string; swatches: Swatch[] }[] = [
  {
    title: "Brand",
    swatches: [
      { token: "primary", value: "#277A4D", use: "Buttons, links, selected states", contrast: "White text 5.3:1" },
      { token: "primary-hover", value: "#1F6340", use: "Hover and pressed for primary", contrast: "White text 7.2:1" },
      { token: "secondary", value: "#EBF7F0", use: "Secondary button fill, Open status", contrast: "Green-700 text 4.8:1" },
      { token: "secondary-foreground", value: "#277A4D", use: "Text on secondary", contrast: "4.8:1", changed: "The brief's green-600 failed (3.9:1)" },
      { token: "brand-navy", value: "#1C3D6A", use: "Headings, navy sections, footer", contrast: "10.9:1 on white" },
      { token: "brand-green", value: "#3AAA6D", use: "Logo, icons, illustrations. Never small text", contrast: "2.9:1, decoration only" },
      { token: "brand-amber", value: "#F8AC36", use: "Decorative accent", contrast: "Navy text 5.7:1" },
    ],
  },
  {
    title: "Neutrals",
    swatches: [
      { token: "background", value: "#FFFFFF", use: "Page background" },
      { token: "foreground", value: "#1F2937", use: "Body text", contrast: "14.7:1" },
      { token: "muted", value: "#F4F6F5", use: "Quiet backgrounds, sidebar" },
      { token: "muted-foreground", value: "#626A75", use: "Captions, metadata", contrast: "5.0:1 on muted", changed: "Gray-500 failed on muted (4.45:1)" },
      { token: "accent", value: "#EEF1F0", use: "Hover on menu items and rows" },
      { token: "border", value: "#E5E7EB", use: "Card edges and dividers (decorative)" },
      { token: "input", value: "#80878F", use: "Field borders, switch track", contrast: "3.2:1 or more", changed: "Gray-200 fields were 1.2:1, too faint" },
      { token: "ring", value: "#1C3D6A", use: "Focus ring (white on navy)", contrast: "10.9:1" },
    ],
  },
  {
    title: "Feedback and charts",
    swatches: [
      { token: "destructive", value: "#B42318", use: "Errors only", contrast: "6.6:1" },
      { token: "warning", value: "#8A5A00", use: "Text-safe amber", contrast: "5.9:1" },
      { token: "chart-1", value: "#3F6FAE", use: "Chart series 1" },
      { token: "chart-2", value: "#2F8A58", use: "Chart series 2" },
      { token: "chart-3", value: "#D58916", use: "Chart series 3" },
      { token: "chart-4", value: "#5BA4D6", use: "Chart series 4" },
      { token: "chart-5", value: "#A65E2E", use: "Chart series 5" },
    ],
  },
];

function SwatchCard({ s }: { s: Swatch }) {
  return (
    <li className="flex gap-4 rounded-xl border p-3">
      <span aria-hidden className="size-12 shrink-0 rounded-md border" style={{ background: `var(--${s.token})` }} />
      <div className="min-w-0 text-sm">
        <p className="font-semibold text-heading">{s.token}</p>
        <p className="text-muted-foreground tabular-nums">{s.value}</p>
        <p className="mt-1">{s.use}</p>
        {s.contrast && <p className="text-muted-foreground">{s.contrast}</p>}
        {s.changed && <p className="mt-1 font-medium text-warning">Changed: {s.changed}</p>}
      </div>
    </li>
  );
}

const spacing = [4, 8, 12, 16, 24, 32, 48, 64, 96];

export function Foundations() {
  return (
    <>
      <Section
        id="colour"
        eyebrow="Foundations"
        title="Colour tokens"
        note="Bridge colours mapped into shadcn's theme. Components only ever use these names, never a colour code. Three values changed from the brief to pass contrast; they are marked."
      >
        {groups.map((g) => (
          <Demo key={g.title} label={g.title}>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {g.swatches.map((s) => (
                <SwatchCard key={s.token} s={s} />
              ))}
            </ul>
          </Demo>
        ))}
      </Section>

      <Section id="type" eyebrow="Foundations" title="Type scale" note="Manrope throughout. One scale for marketing pages and a denser one for dashboards. Weight 800 is used for the display headline only.">
        <Demo label="Marketing pages" className="space-y-6">
          <div>
            <Caption>Display · 48px mobile, 60px desktop · 800</Caption>
            <Display as="p" className="mt-2">
              From Technical Skills to Real-World Opportunity.
            </Display>
          </div>
          <div>
            <Caption>Eyebrow · 12px · 600 · uppercase</Caption>
            <Eyebrow className="mt-2">One connected journey</Eyebrow>
          </div>
          <div>
            <Caption>H2 · 30px mobile, 36px desktop · 700</Caption>
            <H2 as="p" className="mt-2">
              More Than Learning. A Pathway to Opportunity.
            </H2>
          </div>
          <div>
            <Caption>H3 · 20px · 600</Caption>
            <H3 as="p" className="mt-2">
              Learn and Build
            </H3>
          </div>
          <div>
            <Caption>Lead · 18px</Caption>
            <Lead className="mt-2">Bridge connects TVET students and graduates to practical learning, verified skills, industry experience, and career opportunities.</Lead>
          </div>
          <div>
            <Caption>Body · 16px · paragraphs stop at about 70 characters per line</Caption>
            <P className="mt-2">
              Technical education is the beginning. Bridge helps learners build practical experience, demonstrate what they can do, connect with industry, and prepare for meaningful work.
            </P>
          </div>
          <div>
            <Caption>Small · 14px</Caption>
            <Small className="mt-2">Applications close 30 Nov 2026.</Small>
          </div>
        </Demo>
        <Demo label="Dashboards" className="space-y-6 rounded-xl border bg-muted p-6">
          <div>
            <Caption>Page title · 24px · 600</Caption>
            <PageTitle as="p" className="mt-2">
              Applicants
            </PageTitle>
          </div>
          <div>
            <Caption>Section title · 18px · 600</Caption>
            <SectionTitle as="p" className="mt-2">
              My current courses
            </SectionTitle>
          </div>
          <div>
            <Caption>Body · 14px</Caption>
            <p className="mt-2 text-sm">Everyone who applied to your postings, and where they are in your process.</p>
          </div>
          <div>
            <Caption>Caption · 12px · numbers use tabular figures</Caption>
            <Caption className="mt-2 tabular-nums">8 / 12 lessons · 67%</Caption>
          </div>
        </Demo>
      </Section>

      <Section id="shape" eyebrow="Foundations" title="Corners, spacing and surfaces" note="One radius system from a single 8px value. Cards use a thin border and at most a very faint shadow.">
        <Demo label="Corner radius" className="flex flex-wrap gap-6">
          {[
            ["rounded-sm", "4px · checkboxes"],
            ["rounded-md", "8px · buttons, inputs, menus"],
            ["rounded-xl", "12px · cards, dialogs"],
            ["rounded-4xl", "Pill · badges"],
          ].map(([cls, label]) => (
            <div key={cls} className="text-center">
              <div className={`mx-auto h-16 w-24 border-2 border-heading bg-secondary ${cls}`} />
              <Caption className="mt-2">{label}</Caption>
            </div>
          ))}
        </Demo>
        <Demo label="Spacing scale" hint="4px grid. Only these steps are used." className="space-y-2">
          {spacing.map((px) => (
            <div key={px} className="flex items-center gap-4">
              <Caption className="w-10 tabular-nums">{px}px</Caption>
              <span aria-hidden className="h-3 rounded-sm bg-chart-1" style={{ width: px * 3 }} />
            </div>
          ))}
        </Demo>
        <Demo label="Surfaces" className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Card on white</CardTitle>
              <CardDescription>1px border and a faint shadow. The default.</CardDescription>
            </CardHeader>
          </Card>
          <div className="rounded-xl bg-muted p-6">
            <Card>
              <CardHeader>
                <CardTitle>Card on muted</CardTitle>
                <CardDescription>For dashboard panels and quiet sections.</CardDescription>
              </CardHeader>
            </Card>
          </div>
          <div className="surface-navy rounded-xl p-6">
            <Card>
              <CardHeader>
                <CardTitle>Card on navy</CardTitle>
                <CardDescription>Keeps its light colours automatically.</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </Demo>
      </Section>

      <Section id="focus" eyebrow="Foundations" title="Focus" note="Press Tab to move through these buttons. Navy ring with a 2px gap on light backgrounds; white ring on navy.">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="flex flex-wrap gap-3 rounded-xl border p-6">
            <Button>On white</Button>
            <Button variant="outline">Outline</Button>
          </div>
          <div className="flex flex-wrap gap-3 rounded-xl bg-muted p-6">
            <Button variant="secondary">On muted</Button>
            <Button variant="link">Text link</Button>
          </div>
          <div className="surface-navy flex flex-wrap gap-3 rounded-xl p-6">
            <Button>On navy</Button>
            <Button variant="on-navy">Ghost on navy</Button>
          </div>
        </div>
      </Section>
    </>
  );
}
