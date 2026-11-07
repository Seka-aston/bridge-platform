import Link from "next/link";
import { Code2, Database, MessageSquare, Monitor, ShieldCheck, type LucideIcon } from "lucide-react";
import { studentText } from "@/content/dashboard";
import type { Course, CourseIcon, CourseTone } from "@/data/student";

/*
  Course card from Aston's design: coloured tile with a module chip and an icon, title,
  subtitle, progress bar with percentage, and lesson count. The whole card is one link.
  Tile colours are decorative; text on them sits on a darker chip so it stays readable.
*/

const tones: Record<CourseTone, string> = {
  navy: "bg-navy-900",
  deep: "bg-green-deep",
  amber: "bg-amber-600",
  green: "bg-green-500",
};

const icons: Record<CourseIcon, LucideIcon> = { code: Code2, database: Database, message: MessageSquare, shield: ShieldCheck, monitor: Monitor };

export function coursePercent(c: Course) {
  return Math.round((c.lessonsDone / c.lessonsTotal) * 100);
}

export function CourseCard({ course: c, href }: { course: Course; href: string }) {
  const t = studentText.courses;
  const Icon = icons[c.icon];
  const pct = coursePercent(c);
  return (
    <Link
      href={href}
      className="group flex h-full flex-col rounded-panel border border-gray-200 bg-white p-3 transition-shadow duration-150 hover:shadow-card-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900"
    >
      <div className={`relative flex h-36 items-center justify-center rounded-tile pt-4 sm:h-40 ${tones[c.tone]}`}>
        <span className="absolute left-3 top-3 rounded-full bg-navy-900/40 px-2.5 py-0.5 text-sm font-semibold text-white">
          {t.module.replace("{n}", String(c.module))}
        </span>
        <Icon aria-hidden className="size-12 text-white" strokeWidth={1.5} />
      </div>
      <div className="flex flex-1 flex-col px-1 pb-1 pt-4">
        <h3 className="text-h3 text-navy-900 group-hover:underline group-hover:underline-offset-4">{c.title}</h3>
        <p className="mt-1 text-gray-700">{c.subtitle}</p>
        <div className="mt-auto pt-4">
          <div className="flex items-center gap-3">
            <div
              role="progressbar"
              aria-label={`${c.title} progress`}
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
              className="h-2 flex-1 overflow-hidden rounded-full bg-green-50"
            >
              <div className="h-full rounded-full bg-green-500" style={{ width: `${pct}%` }} />
            </div>
            <span className="font-semibold text-navy-900">{pct}%</span>
          </div>
          <p className="mt-3 text-gray-700">
            {pct === 100 ? t.completed : t.lessons.replace("{done}", String(c.lessonsDone)).replace("{total}", String(c.lessonsTotal))}
          </p>
        </div>
      </div>
    </Link>
  );
}
