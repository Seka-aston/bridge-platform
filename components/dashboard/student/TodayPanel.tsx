"use client";

import Link from "next/link";
import { Code2, Hammer, Play, BookOpen, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { ProgressBar } from "@/components/dashboard/parts";
import { studentText } from "@/content/dashboard";
import { currentProject, lessonLog, nextConnection, upNext, weeklyGoal } from "@/data/student";

/*
  "What are you doing today?" from Aston's design. Learn (drawn in the design): weekly goal
  ring and the next lesson. Build and Connect follow the same style with sample content
  (Draft). The weekly count uses the visitor's own calendar week, so it's worked out in the browser.
*/

const t = studentText.today;
type Tab = "build" | "learn" | "connect";

function Ring({ value }: { value: number }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative size-32 shrink-0">
      <svg viewBox="0 0 120 120" className="size-full -rotate-90" aria-hidden>
        <circle cx="60" cy="60" r={r} fill="none" stroke="var(--color-green-50)" strokeWidth="10" />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke="var(--color-green-500)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - value / 100)}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-h2-mobile text-navy-900">{value}%</span>
    </div>
  );
}

export function useWeeklyLessons() {
  const [done, setDone] = useState<number | null>(null);
  useEffect(() => {
    const daysSinceMonday = (new Date().getDay() + 6) % 7;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- needs the visitor's calendar week, after mount
    setDone(lessonLog.filter((d) => d <= daysSinceMonday).length);
  }, []);
  return done;
}

export function TodayPanel({ firstName, coursesHref, passportHref, opportunitiesHref }: { firstName: string; coursesHref: string; passportHref: string; opportunitiesHref: string }) {
  const [tab, setTab] = useState<Tab>("learn");
  const done = useWeeklyLessons() ?? 0;
  const pct = Math.min(100, Math.round((done / weeklyGoal) * 100));
  const left = Math.max(0, weeklyGoal - done);
  const tabs: { key: Tab; icon: typeof Hammer }[] = [
    { key: "build", icon: Hammer },
    { key: "learn", icon: BookOpen },
    { key: "connect", icon: Users },
  ];

  return (
    <section aria-labelledby="today-title" className="min-w-0 rounded-panel bg-white p-5 md:p-8">
      <h2 id="today-title" className="text-h3 text-navy-900 md:text-panel">
        {t.title.replace("{name}", firstName)}
      </h2>
      <div role="tablist" aria-label={t.title.replace("{name}", firstName)} className="mt-6 grid grid-cols-3 gap-1 rounded-full bg-gray-50 p-1.5">
        {tabs.map(({ key, icon: Icon }) => (
          <button
            key={key}
            role="tab"
            id={`tab-${key}`}
            aria-selected={tab === key}
            aria-controls={`panel-${key}`}
            tabIndex={tab === key ? 0 : -1}
            onClick={() => setTab(key)}
            onKeyDown={(e) => {
              const i = tabs.findIndex((x) => x.key === tab);
              if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                const next = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length].key;
                setTab(next);
                document.getElementById(`tab-${next}`)?.focus();
              }
            }}
            className={`inline-flex items-center justify-center gap-2 rounded-full px-3 py-2.5 font-semibold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900 ${
              tab === key ? "bg-green-700 text-white" : "text-navy-900 hover:bg-white"
            }`}
          >
            <Icon aria-hidden className="size-4" /> {t.tabs[key]}
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} className="mt-6">
        {tab === "learn" && (
          <>
            <div className="flex items-center gap-5">
              <Ring value={pct} />
              <div>
                <h3 className="text-h3 text-navy-900">{t.goalTitle}</h3>
                <p className="mt-1 text-gray-700">
                  {(left ? t.goalBody : t.goalBodyDone)
                    .replace("{done}", String(done))
                    .replace("{target}", String(weeklyGoal))
                    .replace("{left}", String(left))}
                </p>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-4 rounded-tile bg-green-50 p-3">
              <span aria-hidden className="inline-flex size-12 shrink-0 items-center justify-center rounded-tile bg-navy-900 text-white">
                <Code2 className="size-6" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-green-700">{t.upNext.replace("{min}", String(upNext.minutes))}</p>
                <p className="font-bold text-navy-900">{upNext.title}</p>
              </div>
              <Link
                href={`${coursesHref}#${upNext.courseId}`}
                aria-label={t.startLesson.replace("{title}", upNext.title)}
                className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-green-700 text-white hover:bg-green-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900"
              >
                <Play aria-hidden className="size-5" fill="currentColor" />
              </Link>
            </div>
          </>
        )}
        {tab === "build" && (
          <>
            <h3 className="text-h3 text-navy-900">{t.buildTitle}</h3>
            <p className="mt-1 font-semibold text-navy-900">{currentProject.title}</p>
            <p className="mt-1 text-gray-700">{t.buildMilestone.replace("{m}", currentProject.milestone)}</p>
            <div className="mt-4">
              <ProgressBar label={currentProject.title} value={currentProject.progress} hideLabel />
            </div>
            <div className="mt-6">
              <Button href={passportHref} variant="outline" shape="pill">
                {t.buildAction}
              </Button>
            </div>
          </>
        )}
        {tab === "connect" && (
          <>
            <h3 className="text-h3 text-navy-900">{t.connectTitle}</h3>
            <div className="mt-3 rounded-tile bg-green-50 p-4">
              <p className="font-bold text-navy-900">{nextConnection.title}</p>
              <p className="text-gray-700">
                {nextConnection.when} · {nextConnection.where}
              </p>
            </div>
            <div className="mt-6">
              <Button href={opportunitiesHref} variant="outline" shape="pill">
                {t.connectAction}
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

// "You are N lessons away from your weekly goal" line under the welcome heading.
export function GoalLine() {
  const done = useWeeklyLessons();
  if (done === null) return <span>&nbsp;</span>;
  const left = Math.max(0, weeklyGoal - done);
  const g = studentText.goalLine;
  return <>{left === 0 ? g.done : left === 1 ? g.one : g.remaining.replace("{n}", String(left))}</>;
}
