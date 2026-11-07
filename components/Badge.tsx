import { ApprovableDraft } from "@/components/ApprovableDraft";
import { badgeLabels } from "@/content/site";

/*
  Small status label (CLAUDE.md content rules 2–4).
  - draft: content awaiting Bridge's approval. Neutral grey with a dashed border, so it reads as "not final".
  - comingSoon: features that are not live yet.
  - sampleProfile: illustrative talent profiles.
  The green tone is a placeholder until the accent-colour decision (CLAUDE.md section 9).
*/

export type BadgeKind = keyof typeof badgeLabels;

const looks: Record<BadgeKind, string> = {
  draft: "border border-dashed border-gray-500 bg-white text-gray-700",
  comingSoon: "border border-transparent bg-green-50 text-green-700",
  sampleProfile: "border border-transparent bg-green-50 text-green-700",
  preview: "border border-green-700 bg-white text-green-700",
};

// `approvalKey` links a Draft badge to an item in the admin's Content approvals queue:
// once approved in this browser session, the badge disappears (Checkpoint 11).
export function Badge({ kind, className = "", approvalKey }: { kind: BadgeKind; className?: string; approvalKey?: string }) {
  if (kind === "draft" && approvalKey) return <ApprovableDraft approvalKey={approvalKey} className={className} />;
  return (
    <span
      className={`inline-flex shrink-0 items-center whitespace-nowrap rounded-control px-2 py-0.5 text-eyebrow uppercase ${looks[kind]} ${className}`}
    >
      {badgeLabels[kind]}
    </span>
  );
}
