import type { Metadata } from "next";
import { ArrowLeft, Info } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/Badge";
import { FinalBand } from "@/components/FinalBand";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Eyebrow, H2, H3, Lead, P } from "@/components/ui/typography";
import { resourcesPage as c } from "@/content/pages";
import { prototypeMode } from "@/content/site";
import { articleCardText } from "@/content/ui";
import { articles } from "@/data/articles";
import { formatDate } from "@/lib/programmes";
import { readingMinutes } from "@/lib/articles";

export function generateStaticParams() {
  return articles.map((a) => ({ id: a.id }));
}

export async function generateMetadata({ params }: PageProps<"/resources/[id]">): Promise<Metadata> {
  const { id } = await params;
  const a = articles.find((x) => x.id === id);
  return a ? { title: a.title, description: a.excerpt } : {};
}

export default async function ArticlePage({ params }: PageProps<"/resources/[id]">) {
  const { id } = await params;
  const a = articles.find((x) => x.id === id);
  if (!a || (!a.approved && !prototypeMode)) notFound();

  const minutes = readingMinutes(a);
  return (
    <main id="main" className="flex-1">
      <article className="mx-auto max-w-3xl px-gutter py-section-mobile md:py-section">
        <Button asChild variant="link" size="lg">
          <Link href={c.backLink.href}>
            <ArrowLeft data-icon="inline-start" aria-hidden /> {c.backLink.label}
          </Link>
        </Button>
        <div className="mt-8 flex flex-wrap items-center gap-2">
          <Eyebrow>{a.category}</Eyebrow>
          {!a.approved && <Badge kind="draft" approvalKey={`article:${a.id}`} />}
        </div>
        <H2 as="h1" className="mt-4 lg:text-5xl">
          {a.title}
        </H2>
        <p className="mt-4 text-sm text-muted-foreground">
          <time dateTime={a.publishedOn}>{formatDate(a.publishedOn)}</time>
          {minutes ? ` · ${articleCardText.readingTime.replace("{minutes}", String(minutes))}` : null}
        </p>
        <Lead className="mt-8 text-foreground">{a.excerpt}</Lead>
        <Separator className="my-10" />
        {a.body ? (
          <div className="space-y-10">
            {a.body.map((b, i) => (
              <section key={i}>
                {b.heading && <H3 as="h2">{b.heading}</H3>}
                {b.paragraphs?.map((p) => (
                  <P key={p} className="mt-4 text-lg">
                    {p}
                  </P>
                ))}
                {b.list && (
                  <ul className="mt-4 max-w-prose list-disc space-y-2 pl-6 text-lg leading-relaxed marker:text-muted-foreground">
                    {b.list.map((li) => (
                      <li key={li}>{li}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
        ) : (
          prototypeMode && (
            <Alert>
              <Info />
              <AlertDescription className="flex flex-wrap items-center gap-2">
                <Badge kind="draft" /> {c.articleBodyPlaceholder}
              </AlertDescription>
            </Alert>
          )
        )}
      </article>
      <FinalBand />
    </main>
  );
}
