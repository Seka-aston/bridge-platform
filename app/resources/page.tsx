import type { Metadata } from "next";
import { ArticleCard } from "@/components/ArticleCard";
import { FinalBand } from "@/components/FinalBand";
import { PageHeader } from "@/components/PageHeader";
import { resourcesPage as c } from "@/content/pages";
import { prototypeMode } from "@/content/site";
import { articles } from "@/data/articles";

export const metadata: Metadata = { title: "Resources", description: c.header.supporting };

export default function ResourcesPage() {
  const visible = articles.filter((a) => a.approved || prototypeMode);
  return (
    <main id="main" className="flex-1">
      <PageHeader title={c.header.title} supporting={c.header.supporting} />
      <div className="mx-auto max-w-content px-gutter py-section-mobile md:py-section">
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((a) => (
            <li key={a.id}>
              <ArticleCard article={a} />
            </li>
          ))}
        </ul>
      </div>
      <FinalBand />
    </main>
  );
}
