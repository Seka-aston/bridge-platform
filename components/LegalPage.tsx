import type { ReactNode } from "react";
import { Info } from "lucide-react";
import { Badge } from "@/components/Badge";
import { PageHeader } from "@/components/PageHeader";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eyebrow, H3, P } from "@/components/ui/typography";
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
            <Eyebrow>{legalNotice.contents}</Eyebrow>
            <ul className="mt-4 space-y-1 border-l">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="-ml-px block border-l border-transparent py-1 pl-4 text-sm text-muted-foreground hover:border-heading hover:text-heading focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <div className="max-w-3xl">
          <Alert>
            <Info />
            <AlertDescription className="flex flex-wrap items-center gap-2 text-foreground">
              <Badge kind="draft" /> {legalNotice.draft}
            </AlertDescription>
          </Alert>
          <p className="mt-4 text-sm text-muted-foreground">{legalNotice.updated}</p>
          {children}
          {sections.map((s) => (
            <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`} className="mt-12 scroll-mt-28">
              <H3 as="h2" id={`${s.id}-h`}>
                {s.title}
              </H3>
              {s.paragraphs.map((p) => (
                <P key={p} className="mt-3">
                  {p}
                </P>
              ))}
              {s.list && (
                <ul className="mt-3 max-w-prose list-disc space-y-2 pl-6 leading-relaxed marker:text-muted-foreground">
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
