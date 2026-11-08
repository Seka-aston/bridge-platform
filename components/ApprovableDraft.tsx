"use client";

import { PenLine } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { badgeLabels } from "@/content/site";
import { APPROVAL_STORE, readJSON } from "@/lib/prototypeStore";

/*
  Draft badge for content that waits for Bridge's approval. Connected journey (Checkpoint 11):
  once the admin approves the item in this browser session, the badge disappears on the
  public site. Looks the same as the Draft badge in components/Badge.tsx.
*/

// The pencil shown on every Draft badge.
export function DraftIcon() {
  return <PenLine data-icon="inline-start" aria-hidden />;
}

export function ApprovableDraft({ approvalKey, className }: { approvalKey: string; className?: string }) {
  const [approved, setApproved] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- browser-only storage, read after mount
    setApproved(readJSON<Record<string, string>>(APPROVAL_STORE, {})[approvalKey] === "approved");
  }, [approvalKey]);
  if (approved) return null;
  return (
    <Badge variant="draft" className={className}>
      <DraftIcon />
      {badgeLabels.draft}
    </Badge>
  );
}
