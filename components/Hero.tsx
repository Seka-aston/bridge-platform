import { Button } from "@/components/Button";
import { hero } from "@/content/home";
import { HeroVisual } from "@/components/HeroVisual";

/*
  Homepage hero (spec 4.2.3), in navy and green rather than the spec's emerald and amber
  (CLAUDE.md section 4). Eyebrow, H1, supporting line, three CTAs.
  The right-hand column holds the hero ecosystem visual.
*/

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-navy-900">
      <div className="mx-auto grid max-w-content items-center gap-12 px-gutter py-section-mobile md:py-section lg:grid-cols-[1.1fr_1fr]">
        <div>
          <p className="text-eyebrow uppercase text-white">{hero.eyebrow}</p>
          <h1 id="hero-title" className="mt-4 text-balance text-display-mobile text-white md:text-display">
            {/* Keep hyphenated words such as "Real-World" on one line. */}
            {hero.headline.split(" ").map((word, i) => (
              <span key={i}>
                {i > 0 && " "}
                {word.includes("-") ? <span className="whitespace-nowrap">{word}</span> : word}
              </span>
            ))}
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-body-lg text-white">{hero.supporting}</p>
          <div className="mt-10 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
            <Button href={hero.primary.href} size="lg" onDark>
              {hero.primary.label}
            </Button>
            <Button href={hero.secondary.href} variant="secondary" size="lg" onDark>
              {hero.secondary.label}
            </Button>
          </div>
          <p className="mt-6">
            <Button href={hero.additional.href} variant="textOnDark" size="lg">
              {hero.additional.label}
            </Button>
          </p>
        </div>

        <HeroVisual />
      </div>
    </section>
  );
}
