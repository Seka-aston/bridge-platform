import type { Metadata } from "next";
import { DiscoveryCallForm } from "@/components/forms/DiscoveryCallForm";
import { PageHeader } from "@/components/PageHeader";
import { discoveryCall as c } from "@/content/pages";

export const metadata: Metadata = { title: "Book a Discovery Call", description: c.header.supporting };

export default function DiscoveryCallPage() {
  return (
    <main id="main" className="flex-1">
      <PageHeader eyebrow={c.header.eyebrow} title={c.header.title} supporting={c.header.supporting} draft />
      <div className="mx-auto max-w-3xl px-gutter py-section-mobile md:py-section">
        <DiscoveryCallForm />
      </div>
    </main>
  );
}
