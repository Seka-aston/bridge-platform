import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/Badge";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { prototypeMode } from "@/content/site";
import { articleCardText as t } from "@/content/ui";
import type { Article } from "@/data/articles";
import { formatDate } from "@/lib/programmes";

/*
  Article card (CLAUDE.md section 7, component 11; spec 4.2.12).
  Category, title, excerpt, date, image, reading time (only if calculated), link.
  The whole card is one link; the title is the link text.
*/

export function ArticleCard({ article: a, showImage = true }: { article: Article; showImage?: boolean }) {
  if (!a.approved && !prototypeMode) return null;
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-card border border-gray-200 bg-white shadow-card transition-shadow duration-150 hover:shadow-card-hover focus-within:shadow-card-hover">
      {showImage &&
        (a.image ? (
          <Image src={a.image.src} alt={a.image.alt} width={800} height={450} className="aspect-video w-full object-cover" />
        ) : (
          <ImagePlaceholder className="aspect-video w-full" />
        ))}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-eyebrow uppercase text-green-700">{a.category}</p>
          {!a.approved && <Badge kind="draft" approvalKey={`article:${a.id}`} />}
        </div>
        <h3 className="mt-3 text-h3 text-navy-900">
          <Link
            href={a.href}
            className="rounded-sm after:absolute after:inset-0 group-hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900 underline-offset-4"
          >
            {a.title}
          </Link>
        </h3>
        <p className="mt-2 text-gray-700">{a.excerpt}</p>
        <p className="mt-auto pt-6 text-gray-500">
          <time dateTime={a.publishedOn}>{formatDate(a.publishedOn)}</time>
          {a.readingMinutes ? ` · ${t.readingTime.replace("{minutes}", String(a.readingMinutes))}` : null}
        </p>
      </div>
    </article>
  );
}
