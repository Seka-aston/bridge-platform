import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/Badge";
import { FinalBand } from "@/components/FinalBand";
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

  return (
    <main id="main" className="flex-1">
      <article className="mx-auto max-w-3xl px-gutter py-section-mobile md:py-section">
        <Link
          href={c.backLink.href}
          className="inline-flex items-center gap-2 rounded-sm font-semibold text-green-700 hover:text-green-800 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900"
        >
          <ArrowLeft aria-hidden className="size-4" /> {c.backLink.label}
        </Link>
        <div className="mt-8 flex flex-wrap items-center gap-2">
          <p className="text-eyebrow uppercase text-green-700">{a.category}</p>
          {!a.approved && <Badge kind="draft" approvalKey={`article:${a.id}`} />}
        </div>
        <h1 className="mt-4 text-balance text-h2-mobile text-navy-900 md:text-display-mobile">{a.title}</h1>
        <p className="mt-4 text-gray-500">
          <time dateTime={a.publishedOn}>{formatDate(a.publishedOn)}</time>
          {readingMinutes(a) ? ` · ${articleCardText.readingTime.replace("{minutes}", String(readingMinutes(a)))}` : null}
        </p>
        <p className="mt-8 text-body-lg text-gray-800">{a.excerpt}</p>
        {a.body ? (
          <div className="mt-10 space-y-8">
            {a.body.map((b, i) => (
              <section key={i}>
                {b.heading && <h2 className="text-h3 text-navy-900 md:text-panel">{b.heading}</h2>}
                {b.paragraphs?.map((p) => (
                  <p key={p} className="mt-3 text-body-lg text-gray-800">
                    {p}
                  </p>
                ))}
                {b.list && (
                  <ul className="mt-3 list-disc space-y-2 pl-6 text-body-lg text-gray-800">
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
            <p className="mt-8 flex flex-wrap items-center gap-3 rounded-card border border-dashed border-gray-500 p-6 text-gray-700">
              <Badge kind="draft" /> {c.articleBodyPlaceholder}
            </p>
          )
        )}
      </article>
      <FinalBand />
    </main>
  );
}
