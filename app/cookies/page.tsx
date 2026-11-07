import type { Metadata } from "next";
import { CookiePreferences } from "@/components/CookiePreferences";
import { LegalPage } from "@/components/LegalPage";
import { cookies } from "@/content/legal";

export const metadata: Metadata = { title: cookies.title, description: cookies.intro, robots: { index: false } };

export default function Page() {
  return (
    <LegalPage title={cookies.title} intro={cookies.intro} sections={cookies.sections}>
      <CookiePreferences />
    </LegalPage>
  );
}
