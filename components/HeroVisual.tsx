import { BadgeCheck, Briefcase, Building2, School } from "lucide-react";
import { Badge } from "@/components/Badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge as UiBadge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Eyebrow } from "@/components/ui/typography";
import { heroVisual as v } from "@/content/home";
import { talentProfiles } from "@/data/talent";
import { cn } from "@/lib/utils";

/*
  Hero ecosystem visual (spec 4.2.3). A sample learner's Skills Passport at the centre,
  connected by a subtle network to disciplines, a partner school, an industry partner and an
  opportunity.
  - Illustrative only: the learner is labelled "Sample profile"; no real partners or logos.
  - Screen readers get one description (role="img") instead of every card's text.
  - Motion: a slow flow along the lines, removed entirely for reduced-motion users.
  - Large screens: cards around the passport. Smaller screens: a simple stacked version.
  White cards keep their light colours on navy automatically (see globals.css).
*/

const learner = talentProfiles[0];

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2);
}

function Passport() {
  return (
    <Card className="w-full max-w-80 gap-0 p-5 shadow-lg">
      <Eyebrow>{v.passportTitle}</Eyebrow>
      <div className="mt-4 flex items-center gap-3">
        <Avatar size="lg">
          <AvatarFallback className="bg-secondary font-semibold text-secondary-foreground">{initials(learner.name)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-heading">{learner.name}</p>
          <p className="text-sm text-muted-foreground">{learner.discipline}</p>
        </div>
      </div>
      <div className="mt-4">
        <UiBadge variant="verified">
          <BadgeCheck data-icon="inline-start" /> Skills verified
        </UiBadge>
      </div>
      <ul className="mt-3 flex flex-wrap gap-1.5">
        {learner.skills.slice(0, 3).map((s) => (
          <li key={s}>
            <UiBadge variant="outline">{s}</UiBadge>
          </li>
        ))}
      </ul>
      <Separator className="my-4" />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm whitespace-nowrap text-muted-foreground">{learner.projectEvidence.length} projects evidenced</p>
        <Badge kind="sampleProfile" />
      </div>
    </Card>
  );
}

function Disciplines() {
  return (
    <ul className="flex max-w-60 flex-wrap gap-1.5">
      {v.disciplines.map((d) => (
        <li key={d} className="rounded-full border bg-accent px-3 py-1 text-sm font-medium">
          {d}
        </li>
      ))}
    </ul>
  );
}

function Node({ icon: Icon, title, detail, className = "w-52" }: { icon: typeof School; title: string; detail: string; className?: string }) {
  return (
    <div className={cn("flex items-center gap-3 rounded-xl border bg-brand-navy p-3 shadow-md", className)}>
      <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-md bg-accent">
        <Icon className="size-5 text-brand-green" />
      </span>
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-sm text-muted-foreground">{detail}</p>
      </div>
    </div>
  );
}

function Opportunity() {
  return (
    <Card className="w-56 gap-0 p-4 shadow-lg">
      <Eyebrow className="text-muted-foreground">{v.opportunity.tag}</Eyebrow>
      <p className="mt-3 flex items-start gap-2 font-semibold text-heading">
        <Briefcase className="mt-0.5 size-4 shrink-0 text-primary" />
        {v.opportunity.title}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">{v.opportunity.detail}</p>
    </Card>
  );
}

// Line end points, as percentages of the visual's width and height (canvas is 4:5).
// Each sits on the edge of its card, so the dashed line shows in the gap to the passport.
const centre = { x: 50, y: 48 };
const anchors = [
  { x: 22, y: 17 }, // disciplines
  { x: 72, y: 26 }, // industry partner
  { x: 24, y: 80 }, // partner school
  { x: 76, y: 80 }, // opportunity
];

export function HeroVisual() {
  return (
    <div role="img" aria-label={v.label}>
      {/* 1280px and wider: network layout */}
      <div className="relative mx-auto hidden aspect-[4/5] w-full max-w-[34rem] xl:block">
        <svg className="absolute inset-0 size-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
          {anchors.map((a, i) => (
            <line
              key={i}
              x1={centre.x}
              y1={centre.y}
              x2={a.x}
              y2={a.y}
              stroke="var(--brand-green)"
              strokeOpacity="0.7"
              strokeWidth="1.5"
              strokeDasharray="4 8"
              vectorEffect="non-scaling-stroke"
              className="bridge-flow"
            />
          ))}
        </svg>
        {anchors.map((a, i) => (
          <span
            key={i}
            aria-hidden
            className="absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-green"
            style={{ left: `${a.x}%`, top: `${a.y}%` }}
          />
        ))}
        <div className="absolute top-0 left-0">
          <Disciplines />
        </div>
        <div className="absolute right-0 top-[12%]">
          <Node icon={Building2} title={v.industry.title} detail={v.industry.detail} />
        </div>
        <div className="absolute left-1/2 top-[48%] flex w-80 -translate-x-1/2 -translate-y-1/2 justify-center">
          <Passport />
        </div>
        <div className="absolute bottom-[6%] left-0">
          <Node icon={School} title={v.school.title} detail={v.school.detail} />
        </div>
        <div className="absolute bottom-0 right-0">
          <Opportunity />
        </div>
      </div>

      {/* Below 1280px: stacked, with one connecting line */}
      <div className="relative mx-auto flex max-w-sm flex-col items-center gap-5 xl:hidden">
        <span aria-hidden className="absolute bottom-6 top-6 left-1/2 w-px -translate-x-1/2 border-l border-dashed border-brand-green/70" />
        <div className="relative flex justify-center">
          <Disciplines />
        </div>
        <div className="relative flex w-full justify-center">
          <Passport />
        </div>
        <div className="relative grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
          <Node icon={School} title={v.school.title} detail={v.school.detail} className="w-full" />
          <Node icon={Building2} title={v.industry.title} detail={v.industry.detail} className="w-full" />
        </div>
        <div className="relative">
          <Opportunity />
        </div>
      </div>
    </div>
  );
}
