import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { privacy } from "@/content/legal";

export const metadata: Metadata = { title: privacy.title, description: privacy.intro, robots: { index: false } };

export default function Page() {
  return <LegalPage title={privacy.title} intro={privacy.intro} sections={privacy.sections} />;
}
