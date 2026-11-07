import Link from "next/link";
import { ArrowUpRight, Award, Plus } from "lucide-react";
import { ArticleCard } from "@/components/ArticleCard";
import { Badge } from "@/components/Badge";
import { BridgeAiPreview } from "@/components/BridgeAiPreview";
import { Button } from "@/components/Button";
import { DashPageHeader, Panel } from "@/components/dashboard/parts";
import { ApplicationsTracker } from "@/components/dashboard/student/ApplicationsTracker";
import { AssignmentsTable } from "@/components/dashboard/student/AssignmentsTable";
import { CourseCard, coursePercent } from "@/components/dashboard/student/CourseCard";
import { CoursesBrowser } from "@/components/dashboard/student/CoursesBrowser";
import { OpportunitiesTable } from "@/components/dashboard/student/OpportunitiesTable";
import { PassportCard, PassportPanel } from "@/components/dashboard/student/PassportPanel";
import { SkillsSection } from "@/components/dashboard/student/PassportView";
import { MessagesView } from "@/components/dashboard/student/MessagesView";
import { SettingsView } from "@/components/dashboard/SettingsView";
import { CompletedLessons, RangeProvider, RangeSelect } from "@/components/dashboard/student/Range";
import { GoalLine, TodayPanel } from "@/components/dashboard/student/TodayPanel";
import { bridgeAi } from "@/content/home";
import { messagesText, roleText, settingsText, studentText as t } from "@/content/dashboard";
import { prototypeMode } from "@/content/site";
import { articles } from "@/data/articles";
import { opportunities } from "@/data/opportunities";
import { assignments, certificates, courses, passport, projects, skills } from "@/data/student";
import { sampleUsers } from "@/data/users";

/*
  Student dashboard (Checkpoint 7), built from Aston's design. The overview follows the design;
  the other screens reuse its visual language. All data is sample data (data/student.ts).
*/

const base = "/dashboard/student";
const user = sampleUsers.student;
const firstName = user.name.split(" ")[0];
const mySkills = skills.filter((s) => s.verified).map((s) => s.name);
export const publicPassportHref = `/passport/${passport.id}`;
// "Welcome Back, {name}." with the name (and full stop) in green, as in the design.
const [welcomeBefore, welcomeAfter = ""] = roleText.student.welcome.split("{name}");

const arrowLink = (href: string, label: string) => (
  <Link
    href={href}
    aria-label={label}
    className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-gray-50 text-navy-900 hover:bg-green-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900"
  >
    <ArrowUpRight aria-hidden className="size-5" />
  </Link>
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
              <span className="text-green-700">
                {firstName}
                {welcomeAfter}
              </span>
            </>
          }
          description={<GoalLine />}
          actions={
            <>
              <RangeSelect />
              <Button href={`${base}/skills-passport#add`} shape="pill" size="lg">
                <Plus aria-hidden className="size-5" /> {t.addSkill}
              </Button>
            </>
          }
        />

        <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[1fr_24rem]">
          <Panel
            title={t.courses.title}
            subtitle={t.courses.summary.replace("{active}", String(active.length)).replace("{due}", String(dueThisWeek))}
            id="courses-title"
            action={
              <Button href={`${base}/courses`} variant="text">
                {t.courses.viewAll}
              </Button>
            }
          >
            <ul className="grid gap-4 sm:grid-cols-2 min-[87.5rem]:grid-cols-4">
              {active.map((c) => (
                <li key={c.id}>
                  <CourseCard course={c} href={`${base}/courses/${c.id}`} />
                </li>
              ))}
            </ul>
          </Panel>

          <PassportPanel name={firstName} href={`${base}/skills-passport`} completedLessons={<CompletedLessons />} />

          <Panel
            title={t.opportunities.title}
            subtitle={
              <span className="inline-flex flex-wrap items-center gap-2">
                {t.opportunities.subtitle}
                <span className="rounded-full border border-dashed border-gray-500 px-2 py-0.5 text-eyebrow uppercase text-gray-700">
                  {t.opportunities.sample}
                </span>
              </span>
            }
            id="opportunities-title"
            action={arrowLink(`${base}/opportunities`, t.opportunities.open)}
          >
            <OpportunitiesTable items={opportunities} mySkills={mySkills} />
          </Panel>

          <TodayPanel
            firstName={firstName}
            coursesHref={`${base}/courses`}
            passportHref={`${base}/skills-passport`}
            opportunitiesHref={`${base}/opportunities`}
          />
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
      <section aria-label={t.assignments.title} className="rounded-panel bg-white p-5 md:p-8">
        <AssignmentsTable items={assignments} courses={courses} />
      </section>
    </div>
  );
}

function ResourcesScreen() {
  const visible = articles.filter((a) => a.approved || prototypeMode);
  return (
    <div className="space-y-6">
      <DashPageHeader title={t.resourcesPage.title} description={t.resourcesPage.description} />
      <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
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
      <Panel
        title={t.opportunities.title}
        subtitle={
          <span className="inline-flex flex-wrap items-center gap-2">
            {t.opportunities.subtitle}
            <span className="rounded-full border border-dashed border-gray-500 px-2 py-0.5 text-eyebrow uppercase text-gray-700">{t.opportunities.sample}</span>
          </span>
        }
        id="opps-title"
      >
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
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[26rem_1fr]">
        <div className="space-y-6">
          <PassportCard name={user.name} />
          <Panel title={p.certificatesTitle} id="certs-title">
            <ul className="space-y-3">
              {certificates.map((c) => (
                <li key={c.id} className="flex items-start gap-3 rounded-tile bg-gray-50 p-4">
                  <Award aria-hidden className="mt-0.5 size-5 shrink-0 text-green-700" />
                  <div>
                    <p className="font-semibold text-navy-900">{c.title}</p>
                    <p className="text-sm text-gray-700">{p.issued.replace("{issuer}", c.issuer).replace("{year}", String(c.year))}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
        <div>
          <SkillsSection skills={skills} publicHref={publicPassportHref} />
          <section aria-labelledby="projects-title" className="mt-6 rounded-panel bg-white p-5 md:p-8">
            <h2 id="projects-title" className="text-h3 text-navy-900 md:text-panel">
              {p.projectsTitle}
            </h2>
            <ul className="mt-4 grid gap-4 md:grid-cols-2">
              {projects.map((pr) => (
                <li key={pr.id} className="rounded-tile border border-gray-200 p-5">
                  <p className="font-bold text-navy-900">{pr.title}</p>
                  <p className="mt-1 text-gray-700">{pr.description}</p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {pr.skills.map((s) => (
                      <li key={s} className="rounded-full bg-gray-50 px-3 py-1 text-sm font-semibold text-navy-900">
                        {s}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

function BridgeAiScreen() {
  return (
    <div className="space-y-6">
      <DashPageHeader title={bridgeAi.headline} description={bridgeAi.supporting} />
      <Badge kind="preview" />
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
