import { Badge } from "@/components/ui/badge";
import { programmeCardText as t } from "@/content/ui";
import type { ProgrammeStatus } from "@/lib/programmes";

// Programme status label (Open, Upcoming, Closed, Archived), always calculated from the dates.
export function StatusPill({ status }: { status: ProgrammeStatus }) {
  return <Badge variant={status}>{t.status[status]}</Badge>;
}
