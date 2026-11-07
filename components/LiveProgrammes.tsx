"use client";

import { useEffect, useState } from "react";
import { ProgrammeBrowser } from "@/components/ProgrammeBrowser";
import { ProgrammeCard, ProgrammeGrid } from "@/components/ProgrammeCardView";
import { ProgrammeDetailView } from "@/components/ProgrammeDetailView";
import type { Programme } from "@/data/programmes";
import { arrangeProgrammes, programmeStatus } from "@/lib/programmes";
import { PROGRAMME_EDITS_STORE, readJSON } from "@/lib/prototypeStore";

/*
  Connected journey (Checkpoint 11): programmes the admin edits or creates in the dashboard
  during this browser session show on the public site. The server renders the published data
  first; after the page loads, any edits from this session are applied in the browser.
  Status is still always calculated from the dates.
*/

function useProgrammes(base: Programme[]) {
  const [edits, setEdits] = useState<Record<string, Programme> | null>(null);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- browser-only storage, read after mount
  useEffect(() => setEdits(readJSON<Record<string, Programme>>(PROGRAMME_EDITS_STORE, {})), []);
  if (!edits || Object.keys(edits).length === 0) return base;
  const created = Object.values(edits).filter((p) => !base.some((b) => b.id === p.id));
  return [...created, ...base.map((p) => edits[p.id] ?? p)];
}

export function LiveProgrammeGrid({
  programmes,
  today,
  showFeatured,
  hideArchived,
}: {
  programmes: Programme[];
  today: string;
  showFeatured?: boolean;
  hideArchived?: boolean;
}) {
  const list = useProgrammes(programmes);
  return <ProgrammeGrid {...arrangeProgrammes(list, today, { showFeatured, hideArchived })} />;
}

export function LiveProgrammeCard({ programmes, id, today, featured }: { programmes: Programme[]; id: string; today: string; featured?: boolean }) {
  const p = useProgrammes(programmes).find((x) => x.id === id);
  if (!p) return null;
  return <ProgrammeCard programme={p} status={programmeStatus(p, today)} featured={featured} />;
}

export function LiveProgrammeBrowser({
  programmes,
  today,
  labels,
}: {
  programmes: Programme[];
  today: string;
  labels: React.ComponentProps<typeof ProgrammeBrowser>["labels"];
}) {
  const list = useProgrammes(programmes);
  const items = list.map((p) => {
    const status = programmeStatus(p, today);
    return { id: p.id, status, card: <ProgrammeCard programme={p} status={status} /> };
  });
  return <ProgrammeBrowser items={items} labels={labels} />;
}

export function LiveProgrammeDetail({ programme, today }: { programme: Programme; today: string }) {
  const p = useProgrammes([programme]).find((x) => x.id === programme.id) ?? programme;
  return <ProgrammeDetailView programme={p} status={programmeStatus(p, today)} />;
}

// Page for a programme created in the admin dashboard during this session (Checkpoint 13).
// The server doesn't know it, so it is looked up in this browser tab's edits.
export function SessionProgrammeDetail({ id, today, notFoundText }: { id: string; today: string; notFoundText: string }) {
  const [p, setP] = useState<Programme | null | undefined>(undefined);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- browser-only storage, read after mount
  useEffect(() => setP(readJSON<Record<string, Programme>>(PROGRAMME_EDITS_STORE, {})[id] ?? null), [id]);
  if (p === undefined) return <div className="min-h-screen" />;
  if (p === null)
    return (
      <div className="mx-auto max-w-content px-gutter py-section-mobile md:py-section">
        <h1 className="text-h2-mobile text-navy-900 md:text-h2">{notFoundText}</h1>
      </div>
    );
  return <ProgrammeDetailView programme={p} status={programmeStatus(p, today)} />;
}
