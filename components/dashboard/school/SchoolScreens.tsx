import Link from "next/link";
import { ShieldCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SettingsView } from "@/components/dashboard/SettingsView";
import { settingsText } from "@/content/dashboard";
import { DashPageHeader } from "@/components/dashboard/parts";
import {
  ClassesPanel, InstitutionProfileView, PlacementsView, SchoolDataProvider, SchoolProgrammesView, SchoolSnapshot, SchoolToday, SchoolWelcomeLine, StudentsView, VerificationPanel,
} from "@/components/dashboard/school/SchoolViews";
import { roleText, schoolText as t } from "@/content/dashboard";
import { sampleUsers } from "@/data/users";

// School dashboard (redesign Step 7, on shadcn/ui), same layout as the Student and Company overviews.

const base = "/dashboard/school";
const firstName = sampleUsers.school.name.split(" ")[0];
const [before, after = ""] = roleText.school.welcome.split("{name}");

export function SchoolOverview() {
  return (
    <SchoolDataProvider>
      <div className="space-y-6">
        <DashPageHeader
          large
          title={
            <>
              {before}
              <span className="text-primary">
                {firstName}
                {after}
              </span>
            </>
          }
          description={<SchoolWelcomeLine />}
          actions={
            <>
              <Button asChild variant="outline">
                <Link href={`${base}/students`}>
                  <Users data-icon="inline-start" aria-hidden /> {t.studentsCta}
                </Link>
              </Button>
              <Button asChild>
                <Link href={`${base}/students#verify`}>
                  <ShieldCheck data-icon="inline-start" aria-hidden /> {t.verifyCta}
                </Link>
              </Button>
            </>
          }
        />
        <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="min-w-0 space-y-6">
            <ClassesPanel href={`${base}/students`} />
            <VerificationPanel limit={4} />
          </div>
          <div className="min-w-0 space-y-6">
            <SchoolSnapshot href={`${base}/profile`} />
            <SchoolToday firstName={firstName} studentsHref={`${base}/students#verify`} placementsHref={`${base}/placements`} programmesHref={`${base}/programmes`} />
          </div>
        </div>
      </div>
    </SchoolDataProvider>
  );
}

const screen = (title: string, description: string, body: React.ReactNode) =>
  function Screen() {
    return (
      <SchoolDataProvider>
        <div className="space-y-6">
          <DashPageHeader title={title} description={description} />
          {body}
        </div>
      </SchoolDataProvider>
    );
  };

export const schoolScreens: Record<string, () => React.ReactElement> = {
  students: screen(
    t.students.title,
    t.students.description,
    <>
      <StudentsView />
      <div id="verify" className="scroll-mt-32">
        <VerificationPanel />
      </div>
    </>,
  ),
  programmes: screen(t.programmes.title, t.programmes.description, <SchoolProgrammesView />),
  placements: screen(t.placements.title, t.placements.description, <PlacementsView />),
  profile: screen(t.profile.title, t.profile.description, <InstitutionProfileView />),
  settings: screen(settingsText.title, settingsText.description, <SettingsView role="school" />),
};
