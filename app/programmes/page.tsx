import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { Badge } from "@/components/Badge";
import { FinalBand } from "@/components/FinalBand";
import { PageHeader } from "@/components/PageHeader";
import { LiveProgrammeBrowser } from "@/components/LiveProgrammes";
import { programmesPage as c } from "@/content/pages";
import { prototypeMode } from "@/content/site";
import { programmes } from "@/data/programmes";
import { todayInKigali } from "@/lib/programmes";

export const metadata: Metadata = { title: "Programmes", description: c.header.supporting };

// Status is worked out for today when the page is requested; the cards are then filtered in the browser.
async function Listing() {
  await connection();
  return <LiveProgrammeBrowser programmes={programmes.filter((p) => p.approved || prototypeMode)} today={todayInKigali()} labels={c.filters} />;
}

export default function ProgrammesPage() {
  return (
    <main id="main" className="flex-1">
      <PageHeader title={c.header.title} supporting={c.header.supporting} />
      <section aria-label={c.header.title} className="mx-auto w-full max-w-content px-gutter py-section-mobile md:py-section">
        {prototypeMode && (
          <p className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Badge kind="draft" /> {c.filters.draftNote}
          </p>
        )}
        <Suspense fallback={<div className="min-h-96" />}>
          <Listing />
        </Suspense>
      </section>
      <FinalBand />
    </main>
  );
}
