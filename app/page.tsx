import Link from "next/link";
import { homePlaceholder } from "@/content/site";

// Temporary homepage. Replaced in Checkpoint 3.
export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-content flex-1 flex-col justify-center gap-4 px-gutter py-section-mobile md:py-section">
      <h1 className="text-display-mobile text-navy-900 md:text-display">{homePlaceholder.title}</h1>
      <p className="text-body-lg text-gray-700">{homePlaceholder.message}</p>
      <p>
        <Link
          href={homePlaceholder.previewLink.href}
          className="font-semibold text-green-700 underline underline-offset-4 hover:no-underline"
        >
          {homePlaceholder.previewLink.label}
        </Link>
      </p>
    </main>
  );
}
