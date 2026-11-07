import type { Article } from "@/data/articles";

// Reading time from the article text, at about 200 words a minute (rounded up).
export function readingMinutes(a: Article): number | undefined {
  if (!a.body) return a.readingMinutes;
  const text = a.body.flatMap((b) => [b.heading ?? "", ...(b.paragraphs ?? []), ...(b.list ?? [])]).join(" ");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}
