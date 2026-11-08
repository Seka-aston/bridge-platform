import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Eyebrow, H3 } from "@/components/ui/typography";
import type { Block } from "@/content/pages";
import { cn } from "@/lib/utils";

/*
  A grid of short title + description blocks (benefits, challenges, curriculum weeks,
  application phases). `numbered` shows 01, 02… instead of a tick, for ordered lists.
  tone "green" is kept for older callers and now means the plain card as well.
*/

type FeatureGridProps = {
  items: Block[];
  numbered?: boolean;
  numberLabel?: string; // e.g. "Week" gives "Week 1"
  columns?: 2 | 3 | 4;
  tone?: "white" | "green";
};

const cols = { 2: "md:grid-cols-2", 3: "md:grid-cols-2 lg:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4" };

export function FeatureGrid({ items, numbered = false, numberLabel, columns = 3 }: FeatureGridProps) {
  const List = numbered ? "ol" : "ul";
  return (
    <List className={cn("grid gap-6", cols[columns])}>
      {items.map((item, i) => (
        <li key={item.title}>
          <Card className="h-full gap-0 p-6 text-base">
            {numbered ? (
              <Eyebrow>{numberLabel ? `${numberLabel} ${i + 1}` : String(i + 1).padStart(2, "0")}</Eyebrow>
            ) : (
              <span className="inline-flex size-8 items-center justify-center rounded-md bg-secondary text-primary">
                <Check aria-hidden className="size-4" />
              </span>
            )}
            <H3 className="mt-4">{item.title}</H3>
            <p className="mt-2 text-muted-foreground">{item.description}</p>
          </Card>
        </li>
      ))}
    </List>
  );
}
