import { CtaBand } from "@/components/CtaBand";
import { finalCta } from "@/content/home";

// The final conversion band (spec 4.2.13) at the foot of inner pages. Pass overrides to tailor it.
export function FinalBand(props: Partial<React.ComponentProps<typeof CtaBand>>) {
  const band = { ...finalCta, ...props };
  return (
    <section aria-label={band.headline}>
      <div className="mx-auto max-w-content px-gutter py-section-mobile md:py-section">
        <CtaBand {...band} />
      </div>
    </section>
  );
}
