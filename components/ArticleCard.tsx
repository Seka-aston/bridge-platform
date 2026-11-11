import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/Badge";
import { ArticleCover } from "@/components/ArticleCover";
import { Card } from "@/components/ui/card";
import { Eyebrow, H3 } from "@/components/ui/typography";
import { prototypeMode } from "@/content/site";
import { articleCardText as t } from "@/content/ui";
import type { Article } from "@/data/articles";
import { formatDate } from "@/lib/programmes";
import { readingMinutes } from "@/lib/articles";

/*
  Article card (spec 4.2.12): category, title, excerpt, date, image, reading time, link.
  The whole card is one link; the title is the link text.
*/

export function ArticleCard({ article: a, showImage = true }: { article: Article; showImage?: boolean }) {
  if (!a.approved && !prototypeMode) return null;
  const minutes = readingMinutes(a);
  return (
    <Card as="article" className="group relative h-full gap-0 py-0 text-base transition-shadow duration-150 focus-within:shadow-md hover:shadow-md">
      {showImage &&
        (a.image ? (
          <Image src={a.image.src} alt={a.image.alt} width={800} height={450} className="aspect-video w-full object-cover" />
        ) : (
          <ArticleCover cover={a.cover} />
        ))}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Eyebrow>{a.category}</Eyebrow>
          {!a.approved && <Badge kind="draft" approvalKey={`article:${a.id}`} />}
        </div>
        <H3 className="mt-3">
          <Link
            href={a.href}
            className="rounded-sm underline-offset-4 group-hover:underline after:absolute after:inset-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            {a.title}
          </Link>
        </H3>
        <p className="mt-2 text-muted-foreground">{a.excerpt}</p>
        <p className="mt-auto pt-6 text-sm text-muted-foreground">
          <time dateTime={a.publishedOn}>{formatDate(a.publishedOn)}</time>
          {minutes ? ` · ${t.readingTime.replace("{minutes}", String(minutes))}` : null}
        </p>
      </div>
    </Card>
  );
}
