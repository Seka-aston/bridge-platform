import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/*
  Wrapper for each page section: background, vertical padding (96px desktop, 64px mobile),
  centred 1200px content width, and an accessible name taken from the section's heading
  (pass the heading's id as labelledBy).
  tone "green" is the alternate tinted section (the section-tint token); "navy" flips colours;
  "brand" is the flat Bridge green (surface-brand), used to highlight the Bridge AI section.
*/

type HomeSectionProps = {
  id: string;
  labelledBy: string;
  tone?: "white" | "green" | "navy" | "brand";
  children: ReactNode;
};

const tones = {
  white: "bg-background",
  green: "bg-section-tint",
  navy: "surface-navy",
  brand: "surface-brand",
};

export function HomeSection({ id, labelledBy, tone = "white", children }: HomeSectionProps) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cn("scroll-mt-20", tones[tone])}>
      <div className="mx-auto max-w-content px-gutter py-section-mobile md:py-section">{children}</div>
    </section>
  );
}

// Heading on the left, a "see all" style link on the right (stacks on mobile).
export function SectionTop({ heading, action }: { heading: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      {heading}
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
