import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Feature icon in a soft green square: 24px icon (brief section 6), 48px tile, 8px corners.
export function IconTile({ icon: Icon, className }: { icon: LucideIcon; className?: string }) {
  return (
    <span className={cn("inline-flex size-12 shrink-0 items-center justify-center rounded-md bg-secondary text-primary", className)}>
      <Icon aria-hidden className="size-6" />
    </span>
  );
}
