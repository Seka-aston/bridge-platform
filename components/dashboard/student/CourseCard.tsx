import Link from "next/link";
import { Code2, Database, MessageSquare, Monitor, ShieldCheck, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { studentText } from "@/content/dashboard";
import type { Course, CourseIcon } from "@/data/student";
import { cn } from "@/lib/utils";

/*
  Course card (redesign Step 7): a card with the course icon, module label, title, subtitle,
  progress bar and lesson count. The whole card is one link.
*/

export const courseIcons: Record<CourseIcon, LucideIcon> = { code: Code2, database: Database, message: MessageSquare, shield: ShieldCheck, monitor: Monitor };

export function coursePercent(c: Course) {
  return Math.round((c.lessonsDone / c.lessonsTotal) * 100);
}

export function CourseIconTile({ course, className }: { course: Course; className?: string }) {
  const Icon = courseIcons[course.icon];
  return (
    <span aria-hidden className={cn("inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary", className)}>
      <Icon className="size-5" />
    </span>
  );
}

export function CourseCard({ course: c, href }: { course: Course; href: string }) {
  const t = studentText.courses;
  const pct = coursePercent(c);
  return (
    <Link
      href={href}
      className="group flex h-full flex-col gap-4 rounded-xl bg-card p-4 text-sm shadow-xs ring-1 ring-border transition-shadow duration-150 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <div className="flex items-start justify-between gap-3">
        <CourseIconTile course={c} />
        <Badge variant="outline">{t.module.replace("{n}", String(c.module))}</Badge>
      </div>
      <div>
        <h3 className="font-heading text-base leading-snug font-semibold text-heading group-hover:underline group-hover:underline-offset-4">{c.title}</h3>
        <p className="mt-1 text-muted-foreground">{c.subtitle}</p>
      </div>
      <div className="mt-auto space-y-2">
        <Progress value={pct} aria-label={`${c.title} progress`} />
        <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>{pct === 100 ? t.completed : t.lessons.replace("{done}", String(c.lessonsDone)).replace("{total}", String(c.lessonsTotal))}</span>
          <span className="font-medium text-heading tabular-nums">{pct}%</span>
        </div>
      </div>
    </Link>
  );
}
