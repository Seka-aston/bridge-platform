import type { ReactNode } from "react";
import { CheckList } from "@/components/CheckList";
import { LinkButton } from "@/components/LinkButton";
import { FinalBand } from "@/components/FinalBand";
import { HomeSection } from "@/components/HomeSection";
import { PageHeader } from "@/components/PageHeader";

/*
  Shared layout for the pages that the homepage service cards point to
  (Learning, Skills Passport, Opportunities). All copy comes from spec 4.2.5.
*/

type TopicPageProps = {
  eyebrow?: string;
  title: string;
  description: string;
  capabilities: string[];
  actions?: { label: string; href: string }[];
  children?: ReactNode;
};

export function TopicPage({ eyebrow, title, description, capabilities, actions, children }: TopicPageProps) {
  return (
    <main id="main" className="flex-1">
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        supporting={description}
        actions={actions?.map((a, i) => (
          <LinkButton key={a.href} href={a.href} variant={i === 0 ? "default" : "outline"}>
            {a.label}
          </LinkButton>
        ))}
      >
        <CheckList items={capabilities} className="mt-10 sm:grid-cols-2" />
      </PageHeader>
      {children}
      <FinalBand />
    </main>
  );
}

export { HomeSection };
