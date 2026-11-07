import { Check } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/Button";
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
          <Button key={a.href} href={a.href} size="lg" variant={i === 0 ? "primary" : "outline"}>
            {a.label}
          </Button>
        ))}
      >
        <ul className="mt-10 grid gap-3 sm:grid-cols-2">
          {capabilities.map((c) => (
            <li key={c} className="flex gap-3 rounded-control bg-white p-4 text-gray-800">
              <Check aria-hidden className="mt-0.5 size-5 shrink-0 text-green-700" />
              {c}
            </li>
          ))}
        </ul>
      </PageHeader>
      {children}
      <FinalBand />
    </main>
  );
}

export { HomeSection };
