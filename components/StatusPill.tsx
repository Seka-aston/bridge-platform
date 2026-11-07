import { programmeCardText as t } from "@/content/ui";
import type { ProgrammeStatus } from "@/lib/programmes";

// Programme status pill (Open, Upcoming, Closed, Archived). Works in server and browser code.
const statusLook: Record<ProgrammeStatus, string> = {
  open: "bg-green-700 text-white",
  upcoming: "border border-navy-900 text-navy-900",
  closed: "bg-gray-200 text-gray-800",
  archived: "border border-gray-500 text-gray-700",
};

export function StatusPill({ status }: { status: ProgrammeStatus }) {
  return (
    <span className={`inline-flex items-center rounded-control px-2 py-0.5 text-eyebrow uppercase ${statusLook[status]}`}>
      {t.status[status]}
    </span>
  );
}

