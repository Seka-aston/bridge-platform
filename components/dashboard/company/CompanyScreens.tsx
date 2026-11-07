import { Search } from "lucide-react";
import { Button } from "@/components/Button";
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
  Company dashboard (Checkpoint 8), in the student dashboard's visual language: big welcome line
  with pill actions, coloured talent tiles (like course cards), a gradient summary card (like the
  Skills Passport card), applicants list with navy Review buttons, and a tabbed "today" panel.
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
              <span className="text-green-700">
                {firstName}
                {welcomeAfter}
              </span>
            </>
          }
          description={<WelcomeLine />}
          actions={
            <>
              <Button href={`${base}/talent`} variant="outline" shape="pill" size="lg">
                <Search aria-hidden className="size-5" /> {t.findTalent}
              </Button>
              <Button href={`${base}/opportunities`} shape="pill" size="lg">
                {t.postCta}
              </Button>
            </>
          }
        />
        <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[1fr_24rem]">
          <RecommendedTalent href={`${base}/talent`} />
          <HiringSnapshot href={`${base}/opportunities`} />
          <RecentApplicants href={`${base}/applicants`} />
          <CompanyToday firstName={firstName} applicantsHref={`${base}/applicants`} opportunitiesHref={`${base}/opportunities`} />
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
