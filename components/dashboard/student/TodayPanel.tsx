"use client";

import Link from "next/link";
import { BookOpen, CalendarDays, Code2, Hammer, Play, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { ProgressBar } from "@/components/dashboard/parts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SectionTitle } from "@/components/ui/typography";
import { studentText } from "@/content/dashboard";
import { currentProject, lessonLog, lessons, nextConnection, upNext, weeklyGoal } from "@/data/student";

/*
  "What are you doing today?" (redesign Step 7) on shadcn Tabs. Learn: weekly goal ring and the
  next lesson. Build and Connect: sample content (Draft). The weekly count uses the visitor's
  own calendar week, so it's worked out in the browser.
*/

const t = studentText.today;

function Ring({ value }: { value: number }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative size-24 shrink-0">
      <svg viewBox="0 0 120 120" className="size-full -rotate-90" aria-hidden>
        <circle cx="60" cy="60" r={r} fill="none" stroke="var(--secondary)" strokeWidth="12" />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke="var(--primary)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - value / 100)}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-lg font-semibold text-heading tabular-nums">{value}%</span>
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
  const done = useWeeklyLessons() ?? 0;
  const pct = Math.min(100, Math.round((done / weeklyGoal) * 100));
  const left = Math.max(0, weeklyGoal - done);
  const title = t.title.replace("{name}", firstName);
  const lessonHref = `${coursesHref}/${upNext.courseId}#lesson-${(lessons[upNext.courseId] ?? []).indexOf(upNext.title) + 1}`;

  return (
    <Card as="section" aria-labelledby="today-title" className="min-w-0">
      <CardHeader>
        <SectionTitle id="today-title">{title}</SectionTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="learn">
          <TabsList aria-label={title} className="w-full">
            <TabsTrigger value="build" id="tab-build">
              <Hammer aria-hidden /> {t.tabs.build}
            </TabsTrigger>
            <TabsTrigger value="learn" id="tab-learn">
              <BookOpen aria-hidden /> {t.tabs.learn}
            </TabsTrigger>
            <TabsTrigger value="connect" id="tab-connect">
              <Users aria-hidden /> {t.tabs.connect}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="learn" className="mt-4 space-y-4">
            <div className="flex items-center gap-4">
              <Ring value={pct} />
              <div>
                <h3 className="font-semibold text-heading">{t.goalTitle}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {(left ? t.goalBody : t.goalBodyDone).replace("{done}", String(done)).replace("{target}", String(weeklyGoal)).replace("{left}", String(left))}
                </p>
              </div>
            </div>
            <Item variant="outline" size="sm">
              <ItemMedia>
                <span aria-hidden className="inline-flex size-9 items-center justify-center rounded-md bg-brand-navy text-white">
                  <Code2 className="size-4" />
                </span>
              </ItemMedia>
              <ItemContent>
                <ItemDescription className="text-xs">{t.upNext.replace("{min}", String(upNext.minutes))}</ItemDescription>
                <ItemTitle className="text-heading">{upNext.title}</ItemTitle>
              </ItemContent>
              <ItemActions>
                <Button asChild size="icon" className="rounded-full">
                  <Link href={lessonHref} aria-label={t.startLesson.replace("{title}", upNext.title)}>
                    <Play fill="currentColor" />
                  </Link>
                </Button>
              </ItemActions>
            </Item>
          </TabsContent>

          <TabsContent value="build" className="mt-4 space-y-4">
            <div>
              <h3 className="font-semibold text-heading">{t.buildTitle}</h3>
              <p className="mt-1 text-sm font-medium text-foreground">{currentProject.title}</p>
              <p className="text-sm text-muted-foreground">{t.buildMilestone.replace("{m}", currentProject.milestone)}</p>
            </div>
            <ProgressBar label={currentProject.title} value={currentProject.progress} hideLabel />
            <Button asChild variant="outline" className="w-full">
              <Link href={passportHref}>{t.buildAction}</Link>
            </Button>
          </TabsContent>

          <TabsContent value="connect" className="mt-4 space-y-4">
            <h3 className="font-semibold text-heading">{t.connectTitle}</h3>
            <Item variant="muted" size="sm">
              <ItemMedia variant="icon">
                <CalendarDays aria-hidden className="text-primary" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle className="text-heading">{nextConnection.title}</ItemTitle>
                <ItemDescription>
                  {nextConnection.when} · {nextConnection.where}
                </ItemDescription>
              </ItemContent>
            </Item>
            <Button asChild variant="outline" className="w-full">
              <Link href={opportunitiesHref}>{t.connectAction}</Link>
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
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
