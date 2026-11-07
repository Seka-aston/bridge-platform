import { ShieldCheck, Users } from "lucide-react";
import { Button } from "@/components/Button";
import { DashPageHeader } from "@/components/dashboard/parts";
import {
  ClassesPanel, InstitutionProfileView, PlacementsView, SchoolDataProvider, SchoolProgrammesView, SchoolSnapshot, SchoolToday, SchoolWelcomeLine, StudentsView, VerificationPanel,
} from "@/components/dashboard/school/SchoolViews";
import { roleText, schoolText as t } from "@/content/dashboard";
import { sampleUsers } from "@/data/users";

// School dashboard (Checkpoint 9), same layout as the student and company overviews.

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
              <span className="text-green-700">
                {firstName}
                {after}
              </span>
            </>
          }
          description={<SchoolWelcomeLine />}
          actions={
            <>
              <Button href={`${base}/students`} variant="outline" shape="pill" size="lg">
                <Users aria-hidden className="size-5" /> {t.studentsCta}
              </Button>
              <Button href={`${base}/students#verify`} shape="pill" size="lg">
                <ShieldCheck aria-hidden className="size-5" /> {t.verifyCta}
              </Button>
            </>
          }
        />
        <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[1fr_24rem]">
          <ClassesPanel href={`${base}/students`} />
          <SchoolSnapshot href={`${base}/profile`} />
          <VerificationPanel limit={4} />
          <SchoolToday firstName={firstName} studentsHref={`${base}/students#verify`} placementsHref={`${base}/placements`} programmesHref={`${base}/programmes`} />
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
};
