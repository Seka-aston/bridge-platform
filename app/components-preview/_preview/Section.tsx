import { Separator } from "@/components/ui/separator";
import { Caption, Eyebrow, H2, Small } from "@/components/ui/typography";

// One block of the design-system preview: a heading, a short note, then the examples.
export function Section({ id, eyebrow, title, note, children }: { id: string; eyebrow: string; title: string; note?: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-24">
      <Eyebrow>{eyebrow}</Eyebrow>
      <H2 id={`${id}-title`} className="mt-3">
        {title}
      </H2>
      {note && <Small className="mt-3 max-w-prose">{note}</Small>}
      <div className="mt-8 space-y-10">{children}</div>
      <Separator className="mt-16" />
    </section>
  );
}

// A labelled group of examples inside a section.
export function Demo({ label, hint, children, className }: { label: string; hint?: string; children: React.ReactNode; className?: string }) {
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h3 className="text-sm font-semibold text-heading">{label}</h3>
        {hint && <Caption>{hint}</Caption>}
      </div>
      <div className={className}>{children}</div>
    </div>
  );
}
