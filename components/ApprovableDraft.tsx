"use client";

import { useEffect, useState } from "react";
import { badgeLabels } from "@/content/site";
import { APPROVAL_STORE, readJSON } from "@/lib/prototypeStore";

/*
  Draft badge for content that waits for Bridge's approval. Connected journey (Checkpoint 11):
  once the admin approves the item in this browser session, the badge disappears on the
  public site. Everything else about the badge matches components/Badge.tsx.
*/

export function ApprovableDraft({ approvalKey, className = "" }: { approvalKey: string; className?: string }) {
  const [approved, setApproved] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- browser-only storage, read after mount
    setApproved(readJSON<Record<string, string>>(APPROVAL_STORE, {})[approvalKey] === "approved");
  }, [approvalKey]);
  if (approved) return null;
  return (
    <span
      className={`inline-flex shrink-0 items-center whitespace-nowrap rounded-control border border-dashed border-gray-500 bg-white px-2 py-0.5 text-eyebrow uppercase text-gray-700 ${className}`}
    >
      {badgeLabels.draft}
    </span>
  );
}
