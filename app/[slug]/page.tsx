import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SectionHeading } from "@/components/SectionHeading";
import { placeholderNotice, placeholderPages } from "@/content/placeholders";

// One template for every placeholder page listed in content/placeholders.ts.
// Any other address shows the "not found" page.

export function generateStaticParams() {
  return Object.keys(placeholderPages).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const title = placeholderPages[slug];
  return { title: title ? `${title} (placeholder)` : undefined, robots: { index: false, follow: true } };
}

export default async function PlaceholderPage({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  const title = placeholderPages[slug];
  if (!title) notFound();

  return (
    <main id="main" className="mx-auto w-full max-w-content flex-1 px-gutter py-section-mobile md:py-section">
      <SectionHeading eyebrow={placeholderNotice.eyebrow} title={title} supporting={placeholderNotice.message} level="h1" />
      <p className="mt-8">
        <Link
          href={placeholderNotice.backLink.href}
          className="rounded-sm font-semibold text-green-700 underline underline-offset-4 hover:text-green-800 hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900"
        >
          {placeholderNotice.backLink.label}
        </Link>
      </p>
    </main>
  );
}
