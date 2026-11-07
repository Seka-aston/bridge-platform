import { BadgeCheck, BookOpen, CalendarClock, Clock, FileCheck2, Gauge, Hourglass, Users } from "lucide-react";
import { connection } from "next/server";
import { Suspense } from "react";
import { Badge } from "@/components/Badge";
import { ProgrammeCard, StatusPill } from "@/components/ProgrammeCard";
import { AdminProgrammeTable } from "@/components/dashboard/AdminProgrammeTable";
import { CompanyOverview } from "@/components/dashboard/company/CompanyScreens";
import { StudentOverview } from "@/components/dashboard/student/StudentScreens";
import { DashPageHeader, DataTable, ListItem, Panel, ProgressBar, StatCard, StatGrid } from "@/components/dashboard/parts";
import { footer, trust } from "@/content/home";
import { overviewText, roleText } from "@/content/dashboard";
import { talentCardText } from "@/content/ui";
import { articles } from "@/data/articles";
import { learnerProgress } from "@/data/dashboard";
import { programmes } from "@/data/programmes";
import { stories } from "@/data/stories";
import { talentProfiles } from "@/data/talent";
import { roles, sampleUsers, type Role } from "@/data/users";
import { formatDate, programmeStatus, todayInKigali } from "@/lib/programmes";

/*
  Role landing pages (Checkpoint 6). Each uses the shared dashboard components with the shared
  sample data, so the story is consistent across roles. Full screens come in Checkpoints 7–10.
*/

function welcome(role: Role) {
  return roleText[role].welcome.replace("{name}", sampleUsers[role].name.split(" ")[0]);
}

function SchoolOverview() {
  const t = overviewText.school;
  const verified = talentProfiles.filter((p) => p.verification === "verified").length;
  const avg = Math.round(talentProfiles.reduce((s, p) => s + (learnerProgress[p.id] ?? 0), 0) / talentProfiles.length);
  return (
    <div className="space-y-8">
      <DashPageHeader large title={welcome("school")} description={sampleUsers.school.detail} />
      <StatGrid>
        <StatCard label={t.stats.learners} value={talentProfiles.length} icon={Users} />
        <StatCard label={t.stats.verified} value={verified} icon={BadgeCheck} />
        <StatCard label={t.stats.avgProgress} value={`${avg}%`} icon={Gauge} />
      </StatGrid>
      <Panel title={t.tableTitle} id="learners-title">
        <DataTable
          caption={t.tableTitle}
          columns={[
            { key: "learner", header: t.columns.learner },
            { key: "discipline", header: t.columns.discipline },
            { key: "level", header: t.columns.level },
            { key: "verification", header: t.columns.verification },
            { key: "progress", header: t.columns.progress, className: "w-56" },
          ]}
          rows={talentProfiles.map((p) => ({
            key: p.id,
            cells: {
              learner: p.name,
              discipline: p.discipline,
              level: p.level,
              verification:
                p.verification === "verified" ? (
                  <span className="inline-flex items-center gap-1.5 font-semibold text-green-700">
                    <BadgeCheck aria-hidden className="size-4" /> {talentCardText.verified}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-gray-700">
                    <Clock aria-hidden className="size-4" /> {talentCardText.inProgress}
                  </span>
                ),
              progress: <ProgressBar label={`${p.name}: ${t.columns.progress}`} value={learnerProgress[p.id] ?? 0} hideLabel />,
            },
          }))}
        />
      </Panel>
    </div>
  );
}

async function AdminProgrammes() {
  await connection();
  const today = todayInKigali();
  const rows = programmes.map((p) => {
    const status = programmeStatus(p, today);
    return {
      id: p.id,
      name: p.name,
      status: (
        <span className="inline-flex flex-wrap gap-2">
          <StatusPill status={status} />
          {!p.approved && <Badge kind="draft" />}
        </span>
      ),
      opens: formatDate(p.opensOn),
      closes: formatDate(p.closesOn),
      card: <ProgrammeCard programme={p} status={status} />,
    };
  });
  const count = (s: string) => programmes.filter((p) => programmeStatus(p, today) === s).length;
  const t = overviewText.admin;
  const pending =
    trust.stats.filter((s) => !s.approved).length +
    programmes.filter((p) => !p.approved).length +
    articles.filter((a) => !a.approved).length +
    (footer.contact && !footer.contact.approved ? 1 : 0);
  return (
    <>
      <StatGrid>
        <StatCard label={t.stats.open} value={count("open")} icon={CalendarClock} />
        <StatCard label={t.stats.upcoming} value={count("upcoming")} icon={Hourglass} />
        <StatCard label={t.stats.users} value={roles.length} icon={Users} />
        <StatCard label={t.stats.pending} value={pending} icon={FileCheck2} />
      </StatGrid>
      <div className="mt-8">
        <Panel title={t.tableTitle} id="programmes-title">
          <AdminProgrammeTable rows={rows} />
        </Panel>
      </div>
    </>
  );
}

function AdminOverview() {
  const t = overviewText.admin;
  const approvals: [string, number][] = [
    [t.approvals.stats, trust.stats.filter((s) => !s.approved).length],
    [t.approvals.programmes, programmes.filter((p) => !p.approved).length],
    [t.approvals.articles, articles.filter((a) => !a.approved).length],
    [t.approvals.contact, footer.contact && !footer.contact.approved ? 1 : 0],
    [t.approvals.stories, stories.length],
  ];
  return (
    <div className="space-y-8">
      <DashPageHeader large title={welcome("admin")} description={sampleUsers.admin.detail} />
      <Suspense fallback={<div className="min-h-96" />}>
        <AdminProgrammes />
      </Suspense>
      <Panel title={t.approvalsTitle} id="approvals-title">
        <ul>
          {approvals.map(([label, n]) => (
            <ListItem
              key={label}
              title={label}
              end={
                <span className="inline-flex items-center gap-2 font-semibold text-navy-900">
                  <BookOpen aria-hidden className="size-4 text-green-700" /> {n}
                </span>
              }
            />
          ))}
        </ul>
      </Panel>
    </div>
  );
}

export function RoleOverview({ role }: { role: Role }) {
  switch (role) {
    case "student":
      return <StudentOverview />;
    case "school":
      return <SchoolOverview />;
    case "company":
      return <CompanyOverview />;
    case "admin":
      return <AdminOverview />;
  }
}
