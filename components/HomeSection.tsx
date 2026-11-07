import type { ReactNode } from "react";

/*
  Wrapper for each homepage section: background, vertical padding (96px desktop,
  64px mobile), centred 1200px content width, and an accessible name taken from
  the section's heading (pass the heading's id as labelledBy).
*/

type HomeSectionProps = {
  id: string;
  labelledBy: string;
  tone?: "white" | "green" | "navy";
  children: ReactNode;
};

const tones = {
  white: "bg-white",
  green: "bg-green-50",
  navy: "bg-navy-900",
};

export function HomeSection({ id, labelledBy, tone = "white", children }: HomeSectionProps) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={`scroll-mt-20 ${tones[tone]}`}>
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
