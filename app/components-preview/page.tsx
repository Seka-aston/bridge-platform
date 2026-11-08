import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Display, Eyebrow, Lead } from "@/components/ui/typography";
import { Actions } from "./_preview/Actions";
import { DataDisplay } from "./_preview/DataDisplay";
import { Feedback } from "./_preview/Feedback";
import { Forms } from "./_preview/Forms";
import { Foundations } from "./_preview/Foundations";
import { Navigation } from "./_preview/Navigation";
import { Overlays } from "./_preview/Overlays";
import { SidebarDemo } from "./_preview/SidebarDemo";

// Internal review page for Aston (REDESIGN-BRIEF.md Step 2). Not linked from the public navigation.
export const metadata: Metadata = {
  title: "Design system preview",
  robots: { index: false, follow: false },
};

const contents = [
  ["colour", "Colour"],
  ["type", "Type scale"],
  ["shape", "Corners and spacing"],
  ["focus", "Focus"],
  ["buttons", "Buttons"],
  ["badges", "Badges"],
  ["forms", "Forms"],
  ["overlays", "Dialogs and menus"],
  ["navigation", "Navigation"],
  ["data", "Cards, tables, data"],
  ["feedback", "Feedback and states"],
  ["sidebar", "Dashboard sidebar"],
] as const;

export default function ComponentsPreviewPage() {
  return (
    <main id="main" className="mx-auto w-full max-w-content px-gutter py-section-mobile md:py-section">
      <Eyebrow>Design system · Step 2</Eyebrow>
      <Display className="mt-4">Bridge on shadcn/ui</Display>
      <Lead className="mt-4">
        Every component the platform will use, themed with Bridge colours, Manrope and one set of rules. Pages move onto these components from Step 3.
      </Lead>
      <div className="mt-4">
        <Badge variant="sample">Internal review page</Badge>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[12rem_1fr]">
        <nav aria-label="On this page" className="lg:sticky lg:top-28 lg:self-start">
          <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm lg:flex-col">
            {contents.map(([id, label]) => (
              <li key={id}>
                <a href={`#${id}`} className="rounded-sm text-muted-foreground hover:text-heading focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="min-w-0 space-y-16">
          <Foundations />
          <Actions />
          <Forms />
          <Overlays />
          <Navigation />
          <DataDisplay />
          <Feedback />
          <SidebarDemo />
        </div>
      </div>
    </main>
  );
}
