"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle2, Circle, PlayCircle, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { DetailDrawer } from "@/components/dashboard/DetailDrawer";
import { ProgressBar } from "@/components/dashboard/parts";
import { ring } from "@/components/dashboard/kit";
import { coursePageText as t, studentText } from "@/content/dashboard";
import { courses, lessonMinutes, lessons } from "@/data/student";
import { readJSON } from "@/lib/prototypeStore";

/*
  Course page with its lessons (Checkpoint 13). Opening a lesson shows the lesson view in a
  drawer: video area, notes, Mark as complete and Next lesson. Lessons completed during the demo
  are kept in this browser tab. "#lesson-9" in the address opens lesson 9 straight away
  (used by "Up next" on the overview).
*/

const STORE = "bridge-lesson-progress";
const tones: Record<string, string> = { navy: "bg-navy-900", deep: "bg-green-deep", amber: "bg-amber-600", green: "bg-green-500" };

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
      <Link href="/dashboard/student/courses" className={`inline-flex items-center gap-2 rounded-sm font-semibold text-green-700 hover:text-green-800 hover:underline ${ring}`}>
        <ArrowLeft aria-hidden className="size-4" /> {t.back}
      </Link>

      <section aria-labelledby="course-title" className="grid gap-6 rounded-panel bg-white p-5 md:grid-cols-[16rem_1fr] md:p-8">
        <div className={`relative flex h-40 items-center justify-center rounded-tile ${tones[course.tone]}`}>
          <span className="absolute left-3 top-3 rounded-full bg-navy-900/40 px-2.5 py-0.5 text-sm font-semibold text-white">
            {studentText.courses.module.replace("{n}", String(course.module))}
          </span>
          <PlayCircle aria-hidden className="size-14 text-white" strokeWidth={1.5} />
        </div>
        <div>
          <h1 id="course-title" className="text-h2-mobile text-navy-900 md:text-h2">{course.title}</h1>
          <p className="mt-2 text-body-lg text-gray-700">{course.subtitle}</p>
          <div className="mt-6 max-w-md">
            <ProgressBar label={t.progress} value={pct} />
            <p className="mt-2 text-gray-700">
              {studentText.courses.lessons.replace("{done}", String(doneCount)).replace("{total}", String(titles.length))}
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="lessons-title" className="rounded-panel bg-white p-5 md:p-8">
        <h2 id="lessons-title" className="text-h3 text-navy-900 md:text-panel">{t.lessonsTitle}</h2>
        <ol className="mt-4">
          {titles.map((title, i) => {
            const done = isDone(i);
            const next = i === nextIndex;
            return (
              <li key={title} id={`lesson-${i + 1}`} className="flex flex-wrap items-center gap-4 border-b border-gray-200 py-3 last:border-0">
                {done ? (
                  <CheckCircle2 aria-hidden className="size-6 shrink-0 text-green-700" />
                ) : next ? (
                  <PlayCircle aria-hidden className="size-6 shrink-0 text-navy-900" />
                ) : (
                  <Circle aria-hidden className="size-6 shrink-0 text-gray-500" />
                )}
                <div className="min-w-48 flex-1">
                  <p className="font-semibold text-navy-900">
                    {i + 1}. {title}
                  </p>
                  <p className="text-sm text-gray-700">
                    {t.minutes.replace("{n}", String(lessonMinutes(courseId, i)))} · {done ? t.completed : next ? t.current : t.locked}
                  </p>
                </div>
                <Button variant={next ? "primary" : "outline"} shape="pill" onClick={() => { setOpen(i); setJustDone(false); }}>
                  {t.open}
                  <span className="sr-only">: {title}</span>
                </Button>
              </li>
            );
          })}
        </ol>
      </section>

      <DetailDrawer open={open !== null} onClose={() => setOpen(null)} title={open !== null ? titles[open] : ""}>
        {open !== null && (
          <div className="space-y-5">
            <p className="text-gray-700">
              {t.lessonOf.replace("{n}", String(open + 1)).replace("{total}", String(titles.length))} · {t.minutes.replace("{n}", String(lessonMinutes(courseId, open)))}
            </p>
            <figure className="overflow-hidden rounded-tile">
              <div className={`flex aspect-video items-center justify-center ${tones[course.tone]}`}>
                <span className="inline-flex size-16 items-center justify-center rounded-full bg-white/20">
                  <Play aria-hidden className="size-8 text-white" fill="currentColor" />
                </span>
              </div>
              <figcaption className="bg-gray-50 px-4 py-3 text-sm text-gray-700">
                <span className="font-semibold text-navy-900">{t.video}.</span> {t.videoNote}
              </figcaption>
            </figure>
            <div>
              <h3 className="font-bold text-navy-900">{t.notesTitle}</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-gray-800">
                {t.notes.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            </div>
            {isDone(open) ? (
              <p role="status" className="flex items-start gap-2 rounded-tile bg-green-50 p-4 text-gray-800">
                <CheckCircle2 aria-hidden className="mt-0.5 size-5 shrink-0 text-green-700" /> {justDone ? t.markedComplete : t.completed}
              </p>
            ) : (
              <Button shape="pill" onClick={() => complete(open)}>
                <CheckCircle2 aria-hidden className="size-5" /> {t.markComplete}
              </Button>
            )}
            {open < titles.length - 1 && (
              <Button variant="outline" shape="pill" onClick={() => { setOpen(open + 1); setJustDone(false); }}>
                {t.nextLesson}: {titles[open + 1]}
              </Button>
            )}
          </div>
        )}
      </DetailDrawer>
    </div>
  );
}
