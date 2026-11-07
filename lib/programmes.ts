import type { Programme } from "@/data/programmes";

/*
  Programme status is always calculated from the dates, never typed by hand
  (CLAUDE.md section 7, item 8):
  - upcoming: before applications open
  - open: from the opening date to the closing date (inclusive)
  - closed: after applications close, until the programme ends
  - archived: after the programme ends
  Dates are compared as calendar days in Rwanda (Africa/Kigali).
*/

export type ProgrammeStatus = "open" | "upcoming" | "closed" | "archived";

export function todayInKigali(now = new Date()): string {
  // en-CA formats as YYYY-MM-DD, which compares correctly as text.
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Kigali" }).format(now);
}

export function programmeStatus(p: Programme, today: string): ProgrammeStatus {
  if (today < p.opensOn) return "upcoming";
  if (today <= p.closesOn) return "open";
  if (today <= p.endsOn) return "closed";
  return "archived";
}

export function formatDate(isoDay: string): string {
  // "30 Nov 2026"
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${isoDay}T00:00:00Z`),
  );
}

// Order programmes for display: hide archived if asked, and feature Bridge Ventures Lab
// only "when relevant and available" (open or upcoming), as spec 4.2.7 says.
export function arrangeProgrammes(list: Programme[], today: string, opts: { showFeatured?: boolean; hideArchived?: boolean } = {}) {
  const withStatus = list
    .map((p) => ({ p, status: programmeStatus(p, today) }))
    .filter(({ status }) => !(opts.hideArchived && status === "archived"));
  const featured = opts.showFeatured !== false ? withStatus.find(({ p, status }) => p.featured && (status === "open" || status === "upcoming")) : undefined;
  return { featured, rest: withStatus.filter((x) => x !== featured) };
}
