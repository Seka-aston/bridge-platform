import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { terms } from "@/content/legal";

export const metadata: Metadata = { title: terms.title, description: terms.intro, robots: { index: false } };

export default function Page() {
  return <LegalPage title={terms.title} intro={terms.intro} sections={terms.sections} />;
}
