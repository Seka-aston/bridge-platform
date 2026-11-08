import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeroVisual } from "@/components/HeroVisual";
import { Button } from "@/components/ui/button";
import { Display, Eyebrow, Lead } from "@/components/ui/typography";
import { hero } from "@/content/home";

/*
  Homepage hero (spec 4.2.3), in navy and green rather than the spec's emerald and amber.
  Eyebrow, H1, supporting line, three CTAs. The right-hand column holds the ecosystem visual,
  the one expressive moment of the site (redesign brief section 6).
*/

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="surface-navy relative isolate overflow-hidden">
      <div className="mx-auto grid max-w-content items-center gap-12 px-gutter py-section-mobile md:py-section lg:grid-cols-[1.1fr_1fr]">
        <div>
          <Eyebrow className="text-foreground">{hero.eyebrow}</Eyebrow>
          <Display id="hero-title" className="mt-5">
            {/* Keep hyphenated words such as "Real-World" on one line. */}
            {hero.headline.split(" ").map((word, i) => (
              <span key={i}>
                {i > 0 && " "}
                {word.includes("-") ? <span className="whitespace-nowrap">{word}</span> : word}
              </span>
            ))}
          </Display>
          <Lead className="mt-6 max-w-xl text-pretty text-foreground/90">{hero.supporting}</Lead>
          <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <Button asChild size="xl">
              <Link href={hero.primary.href}>{hero.primary.label}</Link>
            </Button>
            <Button asChild size="xl" variant="secondary">
              <Link href={hero.secondary.href}>{hero.secondary.label}</Link>
            </Button>
          </div>
          <p className="mt-6">
            <Button asChild variant="link" size="lg">
              <Link href={hero.additional.href}>
                {hero.additional.label} <ArrowRight data-icon="inline-end" aria-hidden />
              </Link>
            </Button>
          </p>
        </div>

        <HeroVisual />
      </div>
    </section>
  );
}
