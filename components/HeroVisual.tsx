import { BadgeCheck, Briefcase, Building2, School } from "lucide-react";
import { Badge } from "@/components/Badge";
import { heroVisual as v } from "@/content/home";
import { talentProfiles } from "@/data/talent";

/*
  Hero ecosystem visual (CLAUDE.md section 7, component 15; spec 4.2.3).
  A sample learner's Skills Passport at the centre, connected by a subtle network to
  disciplines, a partner school, an industry partner and an opportunity.
  - Illustrative only: the learner is labelled "Sample profile"; no real partners or logos.
  - Screen readers get one description (role="img") instead of every card's text.
  - Motion: a slow flow along the lines, removed entirely for reduced-motion users.
  - Large screens: cards around the passport. Smaller screens: a simple stacked version.
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
    <div className="w-full max-w-80 rounded-card bg-white p-5 shadow-card-hover">
      <p className="text-eyebrow uppercase text-green-700">{v.passportTitle}</p>
      <div className="mt-4 flex items-center gap-3">
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-green-50 font-bold text-green-700">
          {initials(learner.name)}
        </span>
        <div>
          <p className="font-bold text-navy-900">{learner.name}</p>
          <p className="text-sm text-gray-700">{learner.discipline}</p>
        </div>
      </div>
      <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-green-700">
        <BadgeCheck className="size-4" /> Skills verified
      </p>
      <ul className="mt-3 flex flex-wrap gap-1.5">
        {learner.skills.slice(0, 3).map((s) => (
          <li key={s} className="rounded-control border border-gray-200 px-2 py-0.5 text-sm text-gray-800">
            {s}
          </li>
        ))}
      </ul>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-gray-200 pt-3">
        <p className="whitespace-nowrap text-sm text-gray-700">{learner.projectEvidence.length} projects evidenced</p>
        <Badge kind="sampleProfile" />
      </div>
    </div>
  );
}

function Disciplines() {
  return (
    <ul className="flex max-w-60 flex-wrap gap-1.5">
      {v.disciplines.map((d) => (
        <li key={d} className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-sm font-semibold text-white">
          {d}
        </li>
      ))}
    </ul>
  );
}

function Node({
  icon: Icon,
  title,
  detail,
  className = "w-52",
}: {
  icon: typeof School;
  title: string;
  detail: string;
  className?: string;
}) {
  return (
    <div className={`flex ${className} items-center gap-3 rounded-card border border-white/20 bg-navy-900 p-3 shadow-card`}>
      <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-control bg-white/10">
        <Icon className="size-5 text-green-500" />
      </span>
      <div>
        <p className="text-sm font-bold text-white">{title}</p>
        <p className="text-sm text-white/80">{detail}</p>
      </div>
    </div>
  );
}

function Opportunity() {
  return (
    <div className="w-56 rounded-card bg-white p-4 shadow-card-hover">
      <p className="text-eyebrow uppercase text-gray-700">{v.opportunity.tag}</p>
      <p className="mt-2 flex items-start gap-2 font-bold text-navy-900">
        <Briefcase className="mt-0.5 size-4 shrink-0 text-green-700" />
        {v.opportunity.title}
      </p>
      <p className="mt-1 text-sm text-gray-700">{v.opportunity.detail}</p>
    </div>
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
              stroke="var(--color-green-500)"
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
            className="absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-500"
            style={{ left: `${a.x}%`, top: `${a.y}%` }}
          />
        ))}
        <div className="absolute left-0 top-0">
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
        <span aria-hidden className="absolute bottom-6 top-6 left-1/2 w-px -translate-x-1/2 border-l border-dashed border-green-500/70" />
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
