import { Sparkles } from "lucide-react";
import { ApprovableDraft, DraftIcon } from "@/components/ApprovableDraft";
import { Badge as UiBadge } from "@/components/ui/badge";
import { badgeLabels } from "@/content/site";

/*
  Content labels (CLAUDE.md content rules 2–4), drawn with the shadcn Badge.
  - draft: content awaiting Bridge's approval. Amber tint with a pencil (Aston, 8 Nov 2026).
  - comingSoon / preview: features that are not live yet.
  - sampleProfile: illustrative talent profiles.
*/

export type BadgeKind = keyof typeof badgeLabels;

const variant = { draft: "draft", comingSoon: "preview", preview: "preview", sampleProfile: "sample" } as const;

// `approvalKey` links a Draft badge to an item in the admin's Content approvals queue:
// once approved in this browser session, the badge disappears (Checkpoint 11).
export function Badge({ kind, className, approvalKey }: { kind: BadgeKind; className?: string; approvalKey?: string }) {
  if (kind === "draft" && approvalKey) return <ApprovableDraft approvalKey={approvalKey} className={className} />;
  return (
    <UiBadge variant={variant[kind]} className={className}>
      {kind === "draft" && <DraftIcon />}
      {kind === "comingSoon" && <Sparkles data-icon="inline-start" aria-hidden />}
      {badgeLabels[kind]}
    </UiBadge>
  );
}
