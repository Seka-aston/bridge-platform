import Link from "next/link";
import { ArrowUpRight, Award, Plus } from "lucide-react";
import { ArticleCard } from "@/components/ArticleCard";
import { Badge } from "@/components/Badge";
import { BridgeAiPreview } from "@/components/BridgeAiPreview";
import { DashPageHeader, Panel } from "@/components/dashboard/parts";
import { ApplicationsTracker } from "@/components/dashboard/student/ApplicationsTracker";
import { AssignmentsTable } from "@/components/dashboard/student/AssignmentsTable";
import { CourseCard, coursePercent } from "@/components/dashboard/student/CourseCard";
import { CoursesBrowser } from "@/components/dashboard/student/CoursesBrowser";
import { MessagesView } from "@/components/dashboard/student/MessagesView";
import { OpportunitiesTable } from "@/components/dashboard/student/OpportunitiesTable";
import { PassportCard, PassportPanel } from "@/components/dashboard/student/PassportPanel";
import { SkillsSection } from "@/components/dashboard/student/PassportView";
import { CompletedLessons, RangeProvider, RangeSelect } from "@/components/dashboard/student/Range";
import { GoalLine, TodayPanel } from "@/components/dashboard/student/TodayPanel";
import { SettingsView } from "@/components/dashboard/SettingsView";
import { Badge as UiBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import { SectionTitle } from "@/components/ui/typography";
import { bridgeAi } from "@/content/home";
import { messagesText, roleText, settingsText, studentText as t } from "@/content/dashboard";
import { prototypeMode } from "@/content/site";
import { articles } from "@/data/articles";
import { opportunities } from "@/data/opportunities";
import { assignments, certificates, courses, passport, projects, skills } from "@/data/student";
import { sampleUsers } from "@/data/users";

/*
  Student dashboard (redesign Step 7, on shadcn/ui). Aston's original design set what belongs on
  the dashboard; the look is the shadcn system. All data is sample data (data/student.ts).
*/

const base = "/dashboard/student";
const user = sampleUsers.student;
const firstName = user.name.split(" ")[0];
const mySkills = skills.filter((s) => s.verified).map((s) => s.name);
export const publicPassportHref = `/passport/${passport.id}`;
const [welcomeBefore, welcomeAfter = ""] = roleText.student.welcome.split("{name}");

const sampleNote = (
  <span className="inline-flex flex-wrap items-center gap-2">
    {t.opportunities.subtitle}
    <UiBadge variant="sample">{t.opportunities.sample}</UiBadge>
  </span>
);

export function StudentOverview() {
  const active = courses.filter((c) => coursePercent(c) < 100);
  const dueThisWeek = assignments.filter((a) => a.status === "to-do" && a.dueInDays >= 0 && a.dueInDays <= 6).length;
  return (
    <RangeProvider>
      <div className="space-y-6">
        <DashPageHeader
          large
          title={
            <>
              {welcomeBefore}
              <span className="text-primary">
                {firstName}
                {welcomeAfter}
              </span>
            </>
          }
          description={<GoalLine />}
          actions={
            <>
              <RangeSelect />
              <Button asChild>
                <Link href={`${base}/skills-passport#add`}>
                  <Plus data-icon="inline-start" aria-hidden /> {t.addSkill}
                </Link>
              </Button>
            </>
          }
        />

        <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="min-w-0 space-y-6">
            <Panel
              title={t.courses.title}
              subtitle={t.courses.summary.replace("{active}", String(active.length)).replace("{due}", String(dueThisWeek))}
              id="courses-title"
              action={
                <Button asChild variant="outline" size="sm">
                  <Link href={`${base}/courses`}>{t.courses.viewAll}</Link>
                </Button>
              }
            >
              <ul className="grid gap-4 sm:grid-cols-2">
                {active.map((c) => (
                  <li key={c.id}>
                    <CourseCard course={c} href={`${base}/courses/${c.id}`} />
                  </li>
                ))}
              </ul>
            </Panel>

            <Panel
              title={t.opportunities.title}
              subtitle={sampleNote}
              id="opportunities-title"
              action={
                <Button asChild variant="ghost" size="icon-sm">
                  <Link href={`${base}/opportunities`} aria-label={t.opportunities.open}>
                    <ArrowUpRight />
                  </Link>
                </Button>
              }
            >
              <OpportunitiesTable items={opportunities} mySkills={mySkills} />
            </Panel>
          </div>

          <div className="min-w-0 space-y-6">
            <PassportPanel name={firstName} href={`${base}/skills-passport`} completedLessons={<CompletedLessons />} />
            <TodayPanel firstName={firstName} coursesHref={`${base}/courses`} passportHref={`${base}/skills-passport`} opportunitiesHref={`${base}/opportunities`} />
          </div>
        </div>
      </div>
    </RangeProvider>
  );
}

function CoursesScreen() {
  return (
    <div className="space-y-6">
      <DashPageHeader title={t.coursesPage.title} description={t.coursesPage.description} />
      <CoursesBrowser items={courses} />
    </div>
  );
}

function AssignmentsScreen() {
  return (
    <div className="space-y-6">
      <DashPageHeader title={t.assignments.title} description={t.assignments.description} />
      <AssignmentsTable items={assignments} courses={courses} />
    </div>
  );
}

function ResourcesScreen() {
  const visible = articles.filter((a) => a.approved || prototypeMode);
  return (
    <div className="space-y-6">
      <DashPageHeader title={t.resourcesPage.title} description={t.resourcesPage.description} />
      <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {visible.map((a) => (
          <li key={a.id}>
            <ArticleCard article={a} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function OpportunitiesScreen() {
  return (
    <div className="space-y-6">
      <DashPageHeader title={t.opportunitiesPage.title} description={t.opportunitiesPage.description} />
      <Panel title={t.opportunities.title} subtitle={sampleNote} id="opps-title">
        <OpportunitiesTable items={opportunities} mySkills={mySkills} />
      </Panel>
      <Panel title={t.opportunitiesPage.applicationsTitle} id="apps-title">
        <ApplicationsTracker />
      </Panel>
    </div>
  );
}

function PassportScreen() {
  const p = t.passportPage;
  return (
    <div className="space-y-6">
      <DashPageHeader title={p.title} description={p.description} />
      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[22rem_minmax(0,1fr)]">
        <div className="space-y-6">
          <PassportCard name={user.name} />
          <Panel title={p.certificatesTitle} id="certs-title">
            <ul className="space-y-2">
              {certificates.map((c) => (
                <li key={c.id}>
                  <Item variant="outline" size="sm">
                    <ItemMedia>
                      <span aria-hidden className="inline-flex size-9 items-center justify-center rounded-md bg-secondary text-primary">
                        <Award className="size-4" />
                      </span>
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle className="text-heading">{c.title}</ItemTitle>
                      <ItemDescription>{p.issued.replace("{issuer}", c.issuer).replace("{year}", String(c.year))}</ItemDescription>
                    </ItemContent>
                  </Item>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
        <div className="min-w-0">
          <SkillsSection skills={skills} publicHref={publicPassportHref} />
          <Card as="section" aria-labelledby="projects-title" className="mt-6">
            <CardHeader>
              <SectionTitle id="projects-title">{p.projectsTitle}</SectionTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-4 md:grid-cols-2">
                {projects.map((pr) => (
                  <li key={pr.id} className="flex flex-col rounded-lg border p-4 text-sm">
                    <p className="font-semibold text-heading">{pr.title}</p>
                    <p className="mt-1 text-muted-foreground">{pr.description}</p>
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {pr.skills.map((s) => (
                        <li key={s}>
                          <UiBadge variant="secondary">{s}</UiBadge>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function BridgeAiScreen() {
  return (
    <div className="space-y-6">
      <DashPageHeader title={bridgeAi.headline} description={bridgeAi.supporting} actions={<Badge kind="preview" />} />
      <div className="max-w-3xl">
        <BridgeAiPreview capabilities={bridgeAi.capabilities} />
      </div>
    </div>
  );
}

function MessagesScreen() {
  return (
    <div className="space-y-6">
      <DashPageHeader title={messagesText.title} description={messagesText.description} />
      <MessagesView />
    </div>
  );
}

function SettingsScreen() {
  return (
    <div className="space-y-6">
      <DashPageHeader title={settingsText.title} description={settingsText.description} />
      <SettingsView role="student" />
    </div>
  );
}

// Section slug → screen. Slugs not listed fall back to the shared "coming next" state.
export const studentScreens: Record<string, () => React.ReactElement> = {
  courses: CoursesScreen,
  assignments: AssignmentsScreen,
  resources: ResourcesScreen,
  opportunities: OpportunitiesScreen,
  "skills-passport": PassportScreen,
  "bridge-ai": BridgeAiScreen,
  messages: MessagesScreen,
  settings: SettingsScreen,
};
