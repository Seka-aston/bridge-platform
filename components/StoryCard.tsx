import Image from "next/image";
import { Quote } from "lucide-react";
import { Badge } from "@/components/Badge";
import { Card } from "@/components/ui/card";
import { prototypeMode } from "@/content/site";
import { storyCardText as t } from "@/content/ui";
import type { Story } from "@/data/stories";
import { cn } from "@/lib/utils";

/*
  Testimonial / story card (spec 4.2.10). Approved stories only. With no story supplied,
  prototype mode shows a clearly bracketed placeholder on a quiet tinted card; outside
  prototype mode nothing is shown.
*/

export function StoryCard({ story }: { story?: Story }) {
  if (!story && !prototypeMode) return null;
  if (story && !story.approved && !prototypeMode) return null;
  const placeholder = !story;

  return (
    <Card className={cn("h-full gap-0 p-6 text-base md:p-8", placeholder && "bg-muted shadow-none")}>
      <figure className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <Quote aria-hidden className="size-6 text-brand-green" />
          {(placeholder || !story.approved) && <Badge kind="draft" />}
        </div>
        <blockquote className={cn("mt-4 text-lg leading-relaxed", placeholder && "text-muted-foreground")}>
          {placeholder ? t.placeholderQuote : story.quote}
        </blockquote>
        {story?.outcome && <p className="mt-4 font-semibold text-primary">{story.outcome}</p>}
        <figcaption className="mt-auto flex items-center gap-3 pt-6">
          {story?.image && <Image src={story.image.src} alt={story.image.alt} width={48} height={48} className="size-12 rounded-full object-cover" />}
          <div>
            <p className="font-semibold text-heading">{placeholder ? t.placeholderName : story.name}</p>
            <p className="text-sm text-muted-foreground">{placeholder ? t.placeholderRole : story.role}</p>
          </div>
        </figcaption>
      </figure>
    </Card>
  );
}
