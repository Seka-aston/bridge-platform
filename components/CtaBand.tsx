import Image from "next/image";
import { Button } from "@/components/Button";
import { SectionHeading } from "@/components/SectionHeading";

/*
  CTA band (CLAUDE.md section 7, component 13; spec 4.2.13).
  Navy with green accents (Aston, 7 Nov 2026). Primary button, ghost button, and a white text link
  (green text links are too low in contrast on navy).
*/

type CtaBandProps = {
  headline: string;
  supporting?: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
  link?: { label: string; href: string };
};

export function CtaBand({ headline, supporting, primary, secondary, link }: CtaBandProps) {
  return (
    <div className="relative isolate overflow-hidden rounded-card bg-navy-900 px-6 py-section-mobile md:px-12 md:py-section">
      {/* Green accents: the Bridge symbol, large and faint, at both edges. Decoration only. */}
      <Image
        aria-hidden
        src="/brand/bridge-symbol-on-navy.svg"
        alt=""
        width={129}
        height={215}
        unoptimized
        className="pointer-events-none absolute -left-10 -top-16 -z-10 h-64 w-auto opacity-20 md:h-80"
      />
      <Image
        aria-hidden
        src="/brand/bridge-symbol-on-navy.svg"
        alt=""
        width={129}
        height={215}
        unoptimized
        className="pointer-events-none absolute -bottom-16 -right-10 -z-10 h-64 w-auto rotate-180 opacity-20 md:h-80"
      />
      <span aria-hidden className="mx-auto mb-6 block h-1 w-12 rounded-full bg-green-500" />
      <SectionHeading title={headline} supporting={supporting} align="center" tone="dark" />
      <div className="mt-10 flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center">
        <Button href={primary.href} size="lg" onDark>
          {primary.label}
        </Button>
        {secondary && (
          <Button href={secondary.href} variant="ghost" size="lg">
            {secondary.label}
          </Button>
        )}
      </div>
      {link && (
        <p className="mt-6 text-center">
          <Button href={link.href} variant="textOnDark">
            {link.label}
          </Button>
        </p>
      )}
    </div>
  );
}
