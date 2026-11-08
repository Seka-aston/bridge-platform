import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

// A list of short statements, each in a bordered row with a green tick (eligibility, capabilities).
export function CheckList({ items, className }: { items: string[]; className?: string }) {
  return (
    <ul className={cn("grid gap-3", className)}>
      {items.map((item) => (
        <li key={item} className="flex gap-3 rounded-lg border bg-card p-4">
          <Check aria-hidden className="mt-1 size-4 shrink-0 text-primary" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
