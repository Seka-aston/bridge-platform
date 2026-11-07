import { Badge } from "@/components/Badge";
import { PageHeader } from "@/components/PageHeader";
import { legal } from "@/content/pages";

// Privacy, Terms and Cookie pages: no legal text is invented. Bridge supplies the official wording.
export function LegalPage({ title }: { title: string }) {
  return (
    <main id="main" className="flex-1">
      <PageHeader title={title} />
      <div className="mx-auto max-w-3xl px-gutter py-section-mobile md:py-section">
        <p className="flex flex-wrap items-center gap-3 rounded-card border border-dashed border-gray-500 p-6 text-body-lg text-gray-700">
          <Badge kind="draft" /> {legal.body}
        </p>
      </div>
    </main>
  );
}
