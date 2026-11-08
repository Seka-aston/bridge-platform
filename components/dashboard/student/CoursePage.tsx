"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Circle, Play, PlayCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { DetailDrawer } from "@/components/dashboard/DetailDrawer";
import { ProgressBar } from "@/components/dashboard/parts";
import { CourseIconTile } from "@/components/dashboard/student/CourseCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PageTitle, SectionTitle } from "@/components/ui/typography";
import { coursePageText as t, studentText } from "@/content/dashboard";
import { courses, lessonMinutes, lessons } from "@/data/student";
import { readJSON } from "@/lib/prototypeStore";
import { cn } from "@/lib/utils";

/*
  Course page with its lessons (redesign Step 7). Opening a lesson shows the lesson view in a
  drawer: video area, notes, Mark as complete and Next lesson. Lessons completed during the demo
  are kept in this browser tab. "#lesson-9" in the address opens lesson 9 straight away
  (used by "Up next" on the overview).
*/

const STORE = "bridge-lesson-progress";

export function CoursePage({ courseId }: { courseId: string }) {
  const course = courses.find((c) => c.id === courseId)!;
  const titles = lessons[courseId] ?? [];
  const [extra, setExtra] = useState<number[]>([]);
  const [open, setOpen] = useState<number | null>(null);
  const [justDone, setJustDone] = useState(false);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- browser-only storage and address, read after mount */
    setExtra(readJSON<Record<string, number[]>>(STORE, {})[courseId] ?? []);
    const m = window.location.hash.match(/^#lesson-(\d+)$/);
    if (m) setOpen(Number(m[1]) - 1);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [courseId]);

  const isDone = (i: number) => i < course.lessonsDone || extra.includes(i);
  const doneCount = titles.filter((_, i) => isDone(i)).length;
  const pct = Math.round((doneCount / titles.length) * 100);
  const nextIndex = titles.findIndex((_, i) => !isDone(i));

  function complete(i: number) {
    const next = [...new Set([...extra, i])];
    setExtra(next);
    setJustDone(true);
    try {
      const all = readJSON<Record<string, number[]>>(STORE, {});
      sessionStorage.setItem(STORE, JSON.stringify({ ...all, [courseId]: next }));
    } catch {}
  }

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2.5">
        <Link href="/dashboard/student/courses">
          <ArrowLeft data-icon="inline-start" aria-hidden /> {t.back}
        </Link>
      </Button>

      <Card as="section" aria-labelledby="course-title">
        <CardContent className="flex flex-col gap-6 md:flex-row md:items-start">
          <CourseIconTile course={course} className="size-14 rounded-xl [&_svg]:size-7" />
          <div className="min-w-0 flex-1">
            <Badge variant="outline">{studentText.courses.module.replace("{n}", String(course.module))}</Badge>
            <PageTitle id="course-title" className="mt-2">
              {course.title}
            </PageTitle>
            <p className="mt-1 text-muted-foreground">{course.subtitle}</p>
            <div className="mt-5 max-w-md">
              <ProgressBar label={t.progress} value={pct} />
              <p className="mt-2 text-xs text-muted-foreground">
                {studentText.courses.lessons.replace("{done}", String(doneCount)).replace("{total}", String(titles.length))}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card as="section" aria-labelledby="lessons-title">
        <CardHeader>
          <SectionTitle id="lessons-title">{t.lessonsTitle}</SectionTitle>
        </CardHeader>
        <CardContent>
          <ol className="divide-y rounded-lg border">
            {titles.map((title, i) => {
              const done = isDone(i);
              const next = i === nextIndex;
              return (
                <li key={title} id={`lesson-${i + 1}`} className={cn("flex flex-wrap items-center gap-3 px-4 py-3", next && "bg-secondary/50")}>
                  {done ? (
                    <CheckCircle2 aria-hidden className="size-5 shrink-0 text-primary" />
                  ) : next ? (
                    <PlayCircle aria-hidden className="size-5 shrink-0 text-heading" />
                  ) : (
                    <Circle aria-hidden className="size-5 shrink-0 text-muted-foreground" />
                  )}
                  <div className="min-w-48 flex-1">
                    <p className="font-medium text-heading">
                      {i + 1}. {title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t.minutes.replace("{n}", String(lessonMinutes(courseId, i)))} · {done ? t.completed : next ? t.current : t.locked}
                    </p>
                  </div>
                  <Button
                    variant={next ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setOpen(i);
                      setJustDone(false);
                    }}
                  >
                    {t.open}
                    <span className="sr-only">: {title}</span>
                  </Button>
                </li>
              );
            })}
          </ol>
        </CardContent>
      </Card>

      <DetailDrawer open={open !== null} onClose={() => setOpen(null)} title={open !== null ? titles[open] : ""}>
        {open !== null && (
          <div className="space-y-6 text-sm">
            <p className="text-muted-foreground">
              {t.lessonOf.replace("{n}", String(open + 1)).replace("{total}", String(titles.length))} · {t.minutes.replace("{n}", String(lessonMinutes(courseId, open)))}
            </p>
            <figure className="overflow-hidden rounded-lg border">
              <div className="surface-navy flex aspect-video items-center justify-center">
                <span className="inline-flex size-14 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/30">
                  <Play aria-hidden className="size-6 text-white" fill="currentColor" />
                </span>
              </div>
              <figcaption className="bg-muted px-4 py-3 text-xs text-muted-foreground">
                <span className="font-medium text-heading">{t.video}.</span> {t.videoNote}
              </figcaption>
            </figure>
            <div>
              <h3 className="font-semibold text-heading">{t.notesTitle}</h3>
              <ul className="mt-2 list-disc space-y-1.5 pl-5">
                {t.notes.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            </div>
            <div className="space-y-3 border-t pt-6">
              {isDone(open) ? (
                <Alert variant="success" role="status">
                  <CheckCircle2 aria-hidden />
                  <AlertDescription>{justDone ? t.markedComplete : t.completed}</AlertDescription>
                </Alert>
              ) : (
                <Button className="w-full" onClick={() => complete(open)}>
                  <CheckCircle2 data-icon="inline-start" aria-hidden /> {t.markComplete}
                </Button>
              )}
              {open < titles.length - 1 && (
                <Button
                  variant="outline"
                  className="h-auto w-full justify-between py-2 text-left whitespace-normal"
                  onClick={() => {
                    setOpen(open + 1);
                    setJustDone(false);
                  }}
                >
                  <span>
                    <span className="block text-xs font-normal text-muted-foreground">{t.nextLesson}</span>
                    {titles[open + 1]}
                  </span>
                  <ArrowRight data-icon="inline-end" aria-hidden />
                </Button>
              )}
            </div>
          </div>
        )}
      </DetailDrawer>
    </div>
  );
}
