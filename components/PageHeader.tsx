import type { ReactNode } from "react";
import { SectionHeading } from "@/components/SectionHeading";

/*
  Top band for inner pages: light-green background, H1, optional eyebrow,
  supporting copy, actions and Draft badge. The homepage uses the navy Hero instead.
*/

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  supporting?: string;
  draft?: boolean;
  actions?: ReactNode;
  children?: ReactNode;
};

export function PageHeader({ eyebrow, title, supporting, draft, actions, children }: PageHeaderProps) {
  return (
    <section aria-labelledby="page-title" className="bg-green-50">
      <div className="mx-auto max-w-content px-gutter py-section-mobile md:py-section">
        <SectionHeading id="page-title" level="h1" eyebrow={eyebrow} title={title} supporting={supporting} draft={draft} />
        {actions && <div className="mt-8 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">{actions}</div>}
        {children}
      </div>
    </section>
  );
}
