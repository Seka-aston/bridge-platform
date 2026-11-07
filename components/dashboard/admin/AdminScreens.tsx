import { BadgeCheck, Briefcase, FileCheck2, Handshake, Plus, Users } from "lucide-react";
import { Button } from "@/components/Button";
import { BarChart, ColumnChart } from "@/components/dashboard/charts";
import { SettingsView } from "@/components/dashboard/SettingsView";
import { settingsText } from "@/content/dashboard";
import { DashPageHeader, Panel, StatCard, StatGrid } from "@/components/dashboard/parts";
import {
  AdminDataProvider, AdminSnapshot, AdminToday, AdminWelcomeLine, ApprovalsPanel, ContentApprovals, ProgrammeManager, UsersView,
} from "@/components/dashboard/admin/AdminViews";
import { adminText as t, roleText, sharedText } from "@/content/dashboard";
import { reports } from "@/data/admin";
import { sampleUsers } from "@/data/users";

// Admin dashboard (Checkpoint 10), same layout as the other overviews.

const base = "/dashboard/admin";
const firstName = sampleUsers.admin.name.split(" ")[0];
const [before, after = ""] = roleText.admin.welcome.split("{name}");

export function AdminOverview() {
  return (
    <AdminDataProvider>
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
          description={<AdminWelcomeLine />}
          actions={
            <>
              <Button href={`${base}/content`} variant="outline" shape="pill" size="lg">
                <FileCheck2 aria-hidden className="size-5" /> {t.approvalsCta}
              </Button>
              <Button href={`${base}/programmes`} shape="pill" size="lg">
                <Plus aria-hidden className="size-5" /> {t.newProgrammeCta}
              </Button>
            </>
          }
        />
        <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[1fr_24rem]">
          <Panel title={t.programmes.title} subtitle={t.programmes.description} id="aprog-title" action={<Button href={`${base}/programmes`} variant="text">{roleText.admin.nav[2].label}</Button>}>
            <ProgrammeManager compact />
          </Panel>
          <AdminSnapshot href={`${base}/reports`} />
          <ApprovalsPanel href={`${base}/content`} />
          <AdminToday firstName={firstName} contentHref={`${base}/content`} programmesHref={`${base}/programmes`} usersHref={`${base}/users`} />
        </div>
      </div>
    </AdminDataProvider>
  );
}

function SampleNote() {
  return (
    <span className="inline-flex rounded-full border border-dashed border-gray-500 px-2.5 py-0.5 text-eyebrow uppercase text-gray-700">{sharedText.sampleFigures}</span>
  );
}

function ReportsScreen() {
  const r = t.reports;
  return (
    <div className="space-y-6">
      <DashPageHeader title={r.title} description={r.description} actions={<SampleNote />} />
      <StatGrid>
        <StatCard label={r.tiles.learners} value={reports.tiles.learners} icon={Users} />
        <StatCard label={r.tiles.skillsVerified} value={reports.tiles.skillsVerified} icon={BadgeCheck} />
        <StatCard label={r.tiles.placements} value={reports.tiles.placements} icon={Briefcase} />
        <StatCard label={r.tiles.partners} value={reports.tiles.partners} icon={Handshake} />
      </StatGrid>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Panel title={r.signups} id="chart-signups">
          <ColumnChart data={reports.weeklySignups} labelHeader={r.weekLabel} />
        </Panel>
        <Panel title={r.applications} id="chart-apps">
          <BarChart data={reports.applicationsByProgramme} labelHeader={t.programmes.columns.name} />
        </Panel>
        <Panel title={r.disciplines} id="chart-disc" className="xl:col-span-2">
          <BarChart data={reports.learnersByDiscipline} labelHeader={roleText.school.nav[1].label} />
        </Panel>
      </div>
    </div>
  );
}

const screen = (title: string, description: string, body: React.ReactNode) =>
  function Screen() {
    return (
      <AdminDataProvider>
        <div className="space-y-6">
          <DashPageHeader title={title} description={description} />
          {body}
        </div>
      </AdminDataProvider>
    );
  };

export const adminScreens: Record<string, () => React.ReactElement> = {
  users: screen(t.users.title, t.users.description, <UsersView />),
  programmes: screen(t.programmes.title, t.programmes.description, <ProgrammeManager />),
  content: screen(
    t.content.title,
    t.content.description,
    <section aria-label={t.content.title} className="rounded-panel bg-white p-5 md:p-8">
      <ContentApprovals />
    </section>,
  ),
  reports: ReportsScreen,
  settings: screen(settingsText.title, settingsText.description, <SettingsView role="admin" />),
};
