// Learner and partner stories. APPROVED STORIES ONLY (spec 4.2.10, CLAUDE.md content rule 1).
// None has been supplied yet, so this list is empty. The live site's testimonials look like
// template content and are deliberately not used.

export type Story = {
  id: string;
  quote: string;
  name: string;
  role: string; // e.g. programme and year
  outcome?: string; // only verified outcomes, with a defined source
  image?: { src: string; alt: string };
  approved: boolean;
};

export const stories: Story[] = [];
