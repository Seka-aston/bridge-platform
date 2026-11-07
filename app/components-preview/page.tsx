import type { Metadata } from "next";
import { Check, X } from "lucide-react";

// Internal review page for Aston. Not linked from the public navigation.
export const metadata: Metadata = {
  title: "Design system preview",
  robots: { index: false, follow: false },
};

// Class names are written out in full so Tailwind can find them.
const colours = [
  { token: "navy-900", hex: "#1C3D6A", use: "Headings, dark sections, footer", swatch: "bg-navy-900" },
  { token: "green-500", hex: "#3AAA6D", use: "Brand green: icons, illustrations, large display text", swatch: "bg-green-500" },
  { token: "green-600", hex: "#2F8A58", use: "Text on light-green backgrounds", swatch: "bg-green-600" },
  { token: "green-700", hex: "#277A4D", use: "Proposed button and link colour (decision pending)", swatch: "bg-green-700" },
  { token: "green-50", hex: "#EBF7F0", use: "Light section backgrounds, secondary button fill", swatch: "bg-green-50" },
  { token: "gray-800", hex: "#1F2937", use: "Body text", swatch: "bg-gray-800" },
  { token: "gray-700", hex: "#374151", use: "Secondary text, nav links", swatch: "bg-gray-700" },
  { token: "gray-500", hex: "#6B7280", use: "Captions, metadata", swatch: "bg-gray-500" },
  { token: "gray-200", hex: "#E5E7EB", use: "Borders, dividers", swatch: "bg-gray-200" },
  { token: "white", hex: "#FFFFFF", use: "Page background, text on navy", swatch: "bg-white" },
];

// WCAG AA needs 4.5:1 for normal text and 3:1 for large text (24px+, or 18.66px+ bold).
const contrast = [
  { pair: "Navy-900 on white", ratio: 10.9, sample: "bg-white text-navy-900" },
  { pair: "White on navy-900", ratio: 10.9, sample: "bg-navy-900 text-white" },
  { pair: "Gray-800 on white", ratio: 14.7, sample: "bg-white text-gray-800" },
  { pair: "Gray-700 on white", ratio: 10.3, sample: "bg-white text-gray-700" },
  { pair: "Gray-500 on white", ratio: 4.8, sample: "bg-white text-gray-500" },
  { pair: "Green-700 on white", ratio: 5.3, sample: "bg-white text-green-700" },
  { pair: "White on green-700", ratio: 5.3, sample: "bg-green-700 text-white" },
  { pair: "Green-700 on green-50", ratio: 4.8, sample: "bg-green-50 text-green-700" },
  { pair: "Green-600 on white", ratio: 4.3, sample: "bg-white text-green-600" },
  { pair: "Green-600 on green-50", ratio: 3.9, sample: "bg-green-50 text-green-600" },
  { pair: "Green-500 on navy-900", ratio: 3.7, sample: "bg-navy-900 text-green-500" },
  { pair: "Green-500 on white", ratio: 2.9, sample: "bg-white text-green-500" },
  { pair: "White on green-500", ratio: 2.9, sample: "bg-green-500 text-white" },
];

// Sample text is taken from CLAUDE.md, not invented.
const typeStyles = [
  { token: "display", spec: "60px · 800 · line-height 1.0 (desktop H1)", className: "text-display text-navy-900", sample: "From Technical Skills to Real-World Opportunity." },
  { token: "display-mobile", spec: "40px · 800 · line-height 1.0 (mobile H1)", className: "text-display-mobile text-navy-900", sample: "From Technical Skills to Real-World Opportunity." },
  { token: "h2", spec: "36px · 800 · line-height 1.1", className: "text-h2 text-navy-900", sample: "More Than Learning. A Pathway to Opportunity." },
  { token: "h3", spec: "20px · 700 · line-height 28px", className: "text-h3 text-navy-900", sample: "Learn and Build" },
  { token: "eyebrow", spec: "13px · 700 · uppercase · letter-spacing 0.08em", className: "text-eyebrow uppercase text-green-700", sample: "The future of TVET employability" },
  { token: "body-lg", spec: "20px / 28px · 400", className: "text-body-lg text-gray-700", sample: "Bridge is an AI-powered employability ecosystem connecting TVET students and graduates in Rwanda with practical learning, verified skills, industry experience and career opportunities." },
  { token: "body", spec: "16px / 24px · 400", className: "text-body text-gray-800", sample: "Bridge is an AI-powered employability ecosystem connecting TVET students and graduates in Rwanda with practical learning, verified skills, industry experience and career opportunities." },
];

function Section({ title, intro, children }: { title: string; intro?: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-gray-200 py-section-mobile md:py-section">
      <h2 className="text-h2 text-navy-900">{title}</h2>
      {intro && <p className="mt-3 max-w-3xl text-gray-700">{intro}</p>}
      <div className="mt-8">{children}</div>
    </section>
  );
}

function Verdict({ ratio }: { ratio: number }) {
  if (ratio >= 4.5) {
    return (
      <span className="inline-flex items-center gap-1 font-semibold text-gray-800">
        <Check aria-hidden className="size-4 text-green-700" /> Pass, all text
      </span>
    );
  }
  if (ratio >= 3) {
    return (
      <span className="inline-flex items-center gap-1 font-semibold text-gray-800">
        <Check aria-hidden className="size-4 text-gray-500" /> Large text and icons only
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 font-semibold text-gray-800">
      <X aria-hidden className="size-4 text-gray-800" /> Fail, decoration only
    </span>
  );
}

export default function ComponentsPreview() {
  return (
    <main className="mx-auto w-full max-w-content px-gutter">
      <header className="py-section-mobile md:py-section">
        <p className="text-eyebrow uppercase text-green-700">Internal review page</p>
        <h1 className="mt-3 text-display-mobile text-navy-900 md:text-display">Design system preview</h1>
        <p className="mt-6 max-w-3xl text-body-lg text-gray-700">
          Component 1: design tokens and base typography. Every value on this page comes from{" "}
          <code className="font-mono text-body">app/globals.css</code>.
        </p>
      </header>

      <Section title="Colour" intro="The only colours available in the project. Tailwind's own palette is switched off.">
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {colours.map((c) => (
            <li key={c.token}>
              <div className={`h-24 rounded-card border border-gray-200 ${c.swatch}`} />
              <p className="mt-3 font-semibold text-navy-900">{c.token}</p>
              <p className="font-mono text-gray-500">{c.hex}</p>
              <p className="mt-1 text-gray-700">{c.use}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        title="Contrast"
        intro="Measured ratios. WCAG AA needs 4.5:1 for normal text and 3:1 for large text (24px and up, or about 19px bold) and icons."
      >
        <ul className="divide-y divide-gray-200 rounded-card border border-gray-200">
          {contrast.map((c) => (
            <li key={c.pair} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
              <span className={`w-full rounded-control px-4 py-2 font-semibold sm:w-56 ${c.sample} ${c.sample.startsWith("bg-white") ? "border border-gray-200" : ""}`}>
                Sample text
              </span>
              <span className="flex-1 text-gray-800">{c.pair}</span>
              <span className="w-16 font-mono text-gray-700">{c.ratio.toFixed(1)}:1</span>
              <span className="sm:w-64">
                <Verdict ratio={c.ratio} />
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Typography" intro="Manrope. The H1 below switches from the mobile to the desktop size at 768px wide.">
        <div className="mb-10 rounded-card bg-green-50 p-6">
          <p className="text-eyebrow uppercase text-green-700">Responsive H1</p>
          <p className="mt-3 text-display-mobile text-navy-900 md:text-display">
            From Technical Skills to Real-World Opportunity.
          </p>
        </div>
        <ul className="space-y-10">
          {typeStyles.map((t) => (
            <li key={t.token} className="grid gap-3 md:grid-cols-[14rem_1fr]">
              <div>
                <p className="font-semibold text-navy-900">{t.token}</p>
                <p className="text-gray-500">{t.spec}</p>
              </div>
              <p className={t.className}>{t.sample}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Shape and shadow" intro="Shadows are copied from the live site's cards. Hover the third card to see the hover shadow.">
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <li className="rounded-control border border-gray-200 p-6">
            <p className="font-semibold text-navy-900">radius-control</p>
            <p className="text-gray-500">8px · buttons, inputs</p>
          </li>
          <li className="rounded-card border border-gray-200 p-6">
            <p className="font-semibold text-navy-900">radius-card</p>
            <p className="text-gray-500">12px · cards</p>
          </li>
          <li className="rounded-card border border-gray-200 bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover">
            <p className="font-semibold text-navy-900">shadow-card</p>
            <p className="text-gray-500">Resting card; grows to shadow-card-hover on hover</p>
          </li>
          <li className="rounded-control border border-gray-200 bg-white p-6 shadow-soft">
            <p className="font-semibold text-navy-900">shadow-soft</p>
            <p className="text-gray-500">Buttons and inputs</p>
          </li>
        </ul>
      </Section>

      <Section title="Layout" intro="Spacing otherwise follows Tailwind's 4px scale.">
        <ul className="space-y-6">
          {[
            { name: "gutter", value: "24px · side padding on mobile", bar: "w-gutter" },
            { name: "section-mobile", value: "64px · section top and bottom padding, mobile", bar: "w-section-mobile" },
            { name: "section", value: "96px · section top and bottom padding, desktop", bar: "w-section" },
          ].map((s) => (
            <li key={s.name} className="flex items-center gap-6">
              <span className={`h-6 shrink-0 rounded-sm bg-green-500 ${s.bar}`} />
              <span>
                <span className="font-semibold text-navy-900">{s.name}</span>{" "}
                <span className="text-gray-500">{s.value}</span>
              </span>
            </li>
          ))}
          <li className="text-gray-700">
            <span className="font-semibold text-navy-900">content</span>{" "}
            <span className="text-gray-500">1200px · maximum content width (this page uses it)</span>
          </li>
        </ul>
      </Section>
    </main>
  );
}
