import Image from "next/image";
import { cn } from "@/lib/utils";

/*
  Shown where a card's image will go when no approved photo exists yet.
  Purely decorative (hidden from screen readers): a quiet tinted panel with a small Bridge symbol.
  Real images must use next/image with meaningful alt text.
*/

export function ImagePlaceholder({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("flex items-center justify-center overflow-hidden bg-muted", className)}>
      <Image src="/brand/bridge-symbol.svg" alt="" width={48} height={80} unoptimized className="h-1/4 max-h-16 w-auto opacity-40" />
    </div>
  );
}
