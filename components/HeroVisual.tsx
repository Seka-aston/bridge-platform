import Image from "next/image";
import { Badge } from "@/components/Badge";
import { Badge as UiBadge } from "@/components/ui/badge";
import { heroVisual as v } from "@/content/home";
import { prototypeMode } from "@/content/site";
import { cn } from "@/lib/utils";

/*
  Hero ecosystem visual (spec 4.2.3), built from Aston's Figma hero (Bridge Designs, node 18:152,
  9 Nov 2026): a dotted map of Africa, sample learners in six cities, and dotted lines that
  converge on Bridge in Kigali, marked by a soft amber pulse.

  - The map artwork (dots, connection lines, Rwanda, glows) is the exported Figma SVGs in
    /public/hero. Positions below are percentages of the Figma map frame (493.5 × 514.5), so the
    whole visual scales with its column.
  - Illustrative only: the people are sample profiles (visible caption and chip) and no match
    scores are shown (content rule 4).
  - Screen readers get one description (role="img") instead of every label.
  - Motion: avatars and cards fade in once and the Kigali hub pulses gently. Both are removed for
    reduced-motion users (globals.css).
  - The map is a size container: card text scales with it (hero-map-text, globals.css) so the
    cards keep the Figma's proportions. Below a 26rem map the cards are hidden so the map stays
    legible; avatars and lines remain.
*/

const flows = ["dakar", "lagos", "cairo", "addis-ababa", "kinshasa", "johannesburg"];

// Avatar centres (% of the map frame), in the same order as v.learners and the flow lines.
const tones = {
  navy: "bg-brand-navy text-white",
  white: "bg-white text-primary",
  amber: "bg-brand-amber text-brand-navy",
};
const avatars: { x: number; y: number; tone: keyof typeof tones }[] = [
  { x: 0.85, y: 31.92, tone: "navy" }, // Dakar
  { x: 30.55, y: 43.13, tone: "white" }, // Lagos
  { x: 70.35, y: 10.9, tone: "amber" }, // Cairo
  { x: 81.08, y: 39.74, tone: "white" }, // Addis Ababa
  { x: 47.57, y: 57.96, tone: "navy" }, // Kinshasa
  { x: 65.79, y: 87.97, tone: "amber" }, // Johannesburg
];

// Top-left corners of the two learner cards (% of the map frame) and their chip colours.
const cardPlaces = [
  { left: "0%", top: "49.27%", chip: "bg-white text-primary" },
  { left: "21.11%", top: "85.71%", chip: "bg-brand-amber text-brand-navy" },
];

// One exported SVG, stretched to its positioned wrapper.
function Art({ src, className, inner, priority }: { src: string; className: string; inner?: string; priority?: boolean }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute", className)}>
      <div className={cn("absolute", inner ?? "inset-0")}>
        <Image src={`/hero/${src}.svg`} alt="" fill unoptimized priority={priority} />
      </div>
    </div>
  );
}

const glass = "hero-map-text absolute hidden items-center gap-[0.6em] rounded-xl border border-white/28 bg-hero-end/55 py-[0.65em] pr-[0.95em] pl-[0.8em] shadow-lg backdrop-blur-sm @[26rem]:flex";
const appear = "animate-in fade-in zoom-in-90 fill-mode-both duration-700";

export function HeroVisual() {
  return (
    <div className="@container mx-auto w-full max-w-[34rem]">
      <div role="img" aria-label={v.label} className="relative aspect-[493.5/514.5] w-full">
        {/* Soft green and amber light behind the map */}
        <Art src="glow-map" className="top-[6.71%] left-[14.59%] h-[81.6%] w-[85.1%]" inner="inset-[-30.36%]" />
        <Art src="glow-core" className="top-[30.03%] left-[44.98%] h-[32.07%] w-[33.43%]" inner="inset-[-54.55%]" />

        <Art src="dots" className="inset-[1.37%_1.43%_0.2%_1.43%]" priority />
        {flows.map((f) => (
          <Art key={f} src={`flow-${f}`} className="inset-0" />
        ))}

        {/* Kigali hub: pulse rings, Rwanda outline, city marker */}
        <Art src="pulse-outer" className="hero-pulse top-[48.03%] left-[61.67%] h-[13.41%] w-[13.98%]" />
        <Art src="pulse-inner" className="top-[50.36%] left-[64.1%] h-[8.75%] w-[9.12%]" />
        <Art src="rwanda" className="inset-[52.17%_28.72%_42.48%_65.63%]" inner="inset-[-48.99%_-48.41%]" />
        <Art src="kigali" className="top-[53.72%] left-[67.59%] h-[2.04%] w-[2.13%]" />

        {avatars.map((a, i) => (
          <span
            key={v.learners[i]}
            aria-hidden
            className={cn(
              appear,
              "absolute z-10 flex aspect-square w-[7%] min-w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[3px] border-white text-xs font-bold shadow-md",
              tones[a.tone],
            )}
            style={{ left: `${a.x}%`, top: `${a.y}%`, animationDelay: `${150 + i * 90}ms` }}
          >
            {v.learners[i]}
          </span>
        ))}

        <div aria-hidden className={cn(glass, appear, "top-[59.11%] left-[73.83%]")} style={{ animationDelay: "800ms" }}>
          <span className="size-[0.7em] shrink-0 rounded-full bg-brand-amber" />
          <span className="leading-tight">
            <span className="block font-bold whitespace-nowrap">{v.hub.title}</span>
            <span className="block whitespace-nowrap text-muted-foreground">{v.hub.detail}</span>
          </span>
        </div>

        {v.cards.map((c, i) => (
          <div
            key={c.name}
            aria-hidden
            className={cn(glass, appear, "gap-[0.75em]")}
            style={{ left: cardPlaces[i].left, top: cardPlaces[i].top, animationDelay: `${950 + i * 150}ms` }}
          >
            <span className="leading-tight">
              <span className="block font-bold whitespace-nowrap">
                {c.name} · {c.city}
              </span>
              <span className="block whitespace-nowrap text-muted-foreground">{c.discipline}</span>
            </span>
            <span className={cn("rounded-full px-[0.6em] py-[0.2em] text-[0.88em] font-bold whitespace-nowrap", cardPlaces[i].chip)}>{c.chip}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap justify-end gap-2">
        {/* Learners across Africa show ambition, not current reach: Draft until Bridge approves. */}
        {prototypeMode && <Badge kind="draft" />}
        <UiBadge variant="sample">{v.caption}</UiBadge>
      </div>
    </div>
  );
}
