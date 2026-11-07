import Image from "next/image";
import { Quote } from "lucide-react";
import { Badge } from "@/components/Badge";
import { prototypeMode } from "@/content/site";
import { storyCardText as t } from "@/content/ui";
import type { Story } from "@/data/stories";

/*
  Testimonial / story card (CLAUDE.md section 7, component 12; spec 4.2.10).
  Approved stories only. With no story supplied, prototype mode shows a clearly
  bracketed placeholder; outside prototype mode nothing is shown.
*/

export function StoryCard({ story }: { story?: Story }) {
  if (!story && !prototypeMode) return null;
  if (story && !story.approved && !prototypeMode) return null;
  const placeholder = !story;

  return (
    <figure
      className={`flex h-full flex-col rounded-card p-6 md:p-8 ${
        placeholder ? "border border-dashed border-gray-500 bg-white" : "border border-gray-200 bg-white shadow-card"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <Quote aria-hidden className="size-8 text-green-500" />
        {(placeholder || !story.approved) && <Badge kind="draft" />}
      </div>
      <blockquote className={`mt-4 text-body-lg ${placeholder ? "text-gray-500" : "text-gray-800"}`}>
        {placeholder ? t.placeholderQuote : story.quote}
      </blockquote>
      {story?.outcome && <p className="mt-4 font-semibold text-green-700">{story.outcome}</p>}
      <figcaption className="mt-auto flex items-center gap-3 pt-6">
        {story?.image && (
          <Image src={story.image.src} alt={story.image.alt} width={48} height={48} className="size-12 rounded-full object-cover" />
        )}
        <div>
          <p className="font-semibold text-navy-900">{placeholder ? t.placeholderName : story.name}</p>
          <p className="text-gray-500">{placeholder ? t.placeholderRole : story.role}</p>
        </div>
      </figcaption>
    </figure>
  );
}
