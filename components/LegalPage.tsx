import type { ReactNode } from "react";
import { Info } from "lucide-react";
import { Badge } from "@/components/Badge";
import { PageHeader } from "@/components/PageHeader";
import { legalNotice, type LegalSection } from "@/content/legal";

/*
  Privacy, Terms and Cookie pages: Draft templates for Bridge's legal review (content/legal.ts),
  with a contents list and clearly marked [gaps] for facts only Bridge can supply.
*/

export function LegalPage({ title, intro, sections, children }: { title: string; intro: string; sections: LegalSection[]; children?: ReactNode }) {
  return (
    <main id="main" className="flex-1">
      <PageHeader title={title} supporting={intro} />
      <div className="mx-auto grid max-w-content gap-10 px-gutter py-section-mobile md:py-section lg:grid-cols-[16rem_1fr]">
        <aside className="lg:sticky lg:top-28 lg:h-fit">
          <nav aria-label={legalNotice.contents}>
            <p className="text-eyebrow uppercase text-green-700">{legalNotice.contents}</p>
            <ul className="mt-3 space-y-2">
              {sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="rounded-sm text-gray-700 underline-offset-4 hover:text-green-800 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900">
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <div className="max-w-3xl">
          <p className="flex flex-wrap items-start gap-3 rounded-card border border-dashed border-gray-500 p-5 text-gray-800">
            <Badge kind="draft" />
            <span className="flex-1">{legalNotice.draft}</span>
          </p>
          <p className="mt-4 flex items-center gap-2 text-sm text-gray-500">
            <Info aria-hidden className="size-4" /> {legalNotice.updated}
          </p>
          {children}
          {sections.map((s) => (
            <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`} className="mt-10 scroll-mt-28">
              <h2 id={`${s.id}-h`} className="text-h3 text-navy-900 md:text-panel">
                {s.title}
              </h2>
              {s.paragraphs.map((p) => (
                <p key={p} className="mt-3 text-gray-800">
                  {p}
                </p>
              ))}
              {s.list && (
                <ul className="mt-3 list-disc space-y-2 pl-6 text-gray-800">
                  {s.list.map((li) => (
                    <li key={li}>{li}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
