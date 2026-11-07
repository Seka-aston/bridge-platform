// Shared sample articles. Titles, summaries, categories and dates come from the live
// bridge.co.rw Resources section (whose links currently go nowhere).
// TODO: awaiting Bridge approval. Only approved articles may be published.
// Reading time is left out because the article text isn't available to calculate it.

export type Article = {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  publishedOn: string; // YYYY-MM-DD
  readingMinutes?: number;
  image?: { src: string; alt: string };
  href: string;
  approved: boolean;
};

export const articles: Article[] = [
  {
    id: "successful-internship-tips",
    category: "Blog",
    title: "5 Tips for a Successful Internship",
    excerpt:
      "Learn how to make the most of your internship experience, from setting goals to networking effectively.",
    publishedOn: "2023-10-26",
    href: "/resources/successful-internship-tips",
    approved: false,
  },
  {
    id: "mentee-guide",
    category: "Mentorship Guide",
    title: "Guide for Mentees: How to Build a Great Mentoring Relationship",
    excerpt:
      "This guide provides practical advice for students on how to engage with their mentors for maximum benefit.",
    publishedOn: "2023-10-10",
    href: "/resources/mentee-guide",
    approved: false,
  },
];
// The live site's third resource, a webinar described as "upcoming" and dated November 2023,
// is left out: it would present an expired event as upcoming.
