import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";

/*
  CTA band (spec 4.2.13). Navy with green accents (Aston, 7 Nov 2026): primary button, outlined
  button and a white text link. The Bridge symbol sits faintly at two corners as the brand accent.
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
    <div className="surface-navy relative isolate overflow-hidden rounded-xl px-6 py-16 md:px-12 md:py-24">
      <Image
        aria-hidden
        src="/brand/bridge-symbol-on-navy.svg"
        alt=""
        width={129}
        height={215}
        unoptimized
        className="pointer-events-none absolute -top-16 -left-10 -z-10 h-64 w-auto opacity-15 md:h-80"
      />
      <Image
        aria-hidden
        src="/brand/bridge-symbol-on-navy.svg"
        alt=""
        width={129}
        height={215}
        unoptimized
        className="pointer-events-none absolute -right-10 -bottom-16 -z-10 h-64 w-auto rotate-180 opacity-15 md:h-80"
      />
      <SectionHeading title={headline} supporting={supporting} align="center" />
      <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
        <Button asChild size="xl">
          <Link href={primary.href}>{primary.label}</Link>
        </Button>
        {secondary && (
          <Button asChild size="xl" variant="on-navy">
            <Link href={secondary.href}>{secondary.label}</Link>
          </Button>
        )}
      </div>
      {link && (
        <p className="mt-6 text-center">
          <Button asChild variant="link" size="lg">
            <Link href={link.href}>
              {link.label} <ArrowRight data-icon="inline-end" aria-hidden />
            </Link>
          </Button>
        </p>
      )}
    </div>
  );
}
