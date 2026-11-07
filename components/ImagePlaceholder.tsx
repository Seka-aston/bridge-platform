import Image from "next/image";

/*
  Shown where a card's image will go when no approved photo exists yet.
  Purely decorative (hidden from screen readers): a light-green panel with the Bridge symbol.
  Real images must use next/image with meaningful alt text.
*/

export function ImagePlaceholder({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`flex items-center justify-center overflow-hidden bg-green-50 ${className}`}>
      <Image src="/brand/bridge-symbol.svg" alt="" width={48} height={80} unoptimized className="h-1/3 w-auto opacity-60" />
    </div>
  );
}
