import { connection } from "next/server";
import { LiveProgrammeCard, LiveProgrammeGrid } from "@/components/LiveProgrammes";
import type { Programme } from "@/data/programmes";
import { todayInKigali } from "@/lib/programmes";

/*
  Server entry points for programme lists. They work out today's date when the page is
  requested (not when the site was built), so a status changes on the right day without a
  new deploy. The browser layer then applies any programme edits made in the admin dashboard
  during this session (connected journey, Checkpoint 11). Wrap in <Suspense> where used.
*/

export { ProgrammeCard } from "@/components/ProgrammeCardView";
export { StatusPill } from "@/components/StatusPill";

export async function ProgrammeCards({
  programmes,
  showFeatured = true,
  hideArchived = false,
}: {
  programmes: Programme[];
  showFeatured?: boolean;
  // The homepage hides archived programmes; they belong in the full programme listing.
  hideArchived?: boolean;
}) {
  await connection();
  return <LiveProgrammeGrid programmes={programmes} today={todayInKigali()} showFeatured={showFeatured} hideArchived={hideArchived} />;
}

// One programme with its status for today (e.g. the Ventures Lab page).
export async function ProgrammeCardById({ programmes, id, featured = false }: { programmes: Programme[]; id: string; featured?: boolean }) {
  await connection();
  return <LiveProgrammeCard programmes={programmes} id={id} today={todayInKigali()} featured={featured} />;
}
