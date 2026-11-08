import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SettingsView } from "@/components/dashboard/SettingsView";
import { settingsText } from "@/content/dashboard";
import { DashPageHeader } from "@/components/dashboard/parts";
import { CompanyDataProvider } from "@/components/dashboard/company/CompanyData";
import {
  ApplicantsView, CompanyToday, HiringSnapshot, PostingsView, RecentApplicants, RecommendedTalent, ShortlistView, TalentDiscovery, WelcomeLine,
} from "@/components/dashboard/company/CompanyViews";
import { companyText as t, roleText } from "@/content/dashboard";
import { sampleUsers } from "@/data/users";

/*
  Company dashboard (redesign Step 7, on shadcn/ui), laid out like the Student overview:
  recommended talent and recent applicants on the left; the hiring snapshot and a tabbed
  "today" panel on the right.
*/

const base = "/dashboard/company";
const user = sampleUsers.company;
const firstName = user.name.split(" ")[0];
const [welcomeBefore, welcomeAfter = ""] = roleText.company.welcome.split("{name}");

export function CompanyOverview() {
  return (
    <CompanyDataProvider>
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
          description={<WelcomeLine />}
          actions={
            <>
              <Button asChild variant="outline">
                <Link href={`${base}/talent`}>
                  <Search data-icon="inline-start" aria-hidden /> {t.findTalent}
                </Link>
              </Button>
              <Button asChild>
                <Link href={`${base}/opportunities`}>{t.postCta}</Link>
              </Button>
            </>
          }
        />
        <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="min-w-0 space-y-6">
            <RecommendedTalent href={`${base}/talent`} />
            <RecentApplicants href={`${base}/applicants`} />
          </div>
          <div className="min-w-0 space-y-6">
            <HiringSnapshot href={`${base}/opportunities`} />
            <CompanyToday firstName={firstName} applicantsHref={`${base}/applicants`} opportunitiesHref={`${base}/opportunities`} />
          </div>
        </div>
      </div>
    </CompanyDataProvider>
  );
}

function TalentScreen() {
  return (
    <CompanyDataProvider>
      <div className="space-y-6">
        <DashPageHeader title={t.talent.title} description={t.talent.description} />
        <TalentDiscovery />
      </div>
    </CompanyDataProvider>
  );
}

function OpportunitiesScreen() {
  return (
    <CompanyDataProvider>
      <div className="space-y-6">
        <DashPageHeader title={t.postingsPage.title} description={t.postingsPage.description} />
        <PostingsView />
      </div>
    </CompanyDataProvider>
  );
}

function ApplicantsScreen() {
  return (
    <CompanyDataProvider>
      <div className="space-y-6">
        <DashPageHeader title={t.applicantsPage.title} description={t.applicantsPage.description} />
        <ApplicantsView />
      </div>
    </CompanyDataProvider>
  );
}

function ShortlistScreen() {
  return (
    <CompanyDataProvider>
      <div className="space-y-6">
        <DashPageHeader title={t.shortlistPage.title} description={t.shortlistPage.description} />
        <ShortlistView talentHref={`${base}/talent`} />
      </div>
    </CompanyDataProvider>
  );
}

function SettingsScreen() {
  return (
    <div className="space-y-6">
      <DashPageHeader title={settingsText.title} description={settingsText.description} />
      <SettingsView role="company" />
    </div>
  );
}

export const companyScreens: Record<string, () => React.ReactElement> = {
  talent: TalentScreen,
  opportunities: OpportunitiesScreen,
  applicants: ApplicantsScreen,
  shortlist: ShortlistScreen,
  settings: SettingsScreen,
};
