// Site-wide content. Edit copy here, not inside components.

export const site = {
  name: "Bridge",
  // The spec has no meta description; this is the hero supporting statement (spec 4.2.3), copied exactly.
  // At 173 characters, search results may cut off the end. Replace if Bridge supplies a shorter one.
  description:
    "Bridge connects TVET students and graduates to practical learning, verified skills, industry experience, and career opportunities through one intelligent employability ecosystem.",
};

// Prototype mode (decided by Aston, 7 Nov 2026).
// true: content awaiting Bridge's approval is shown with a visible "Draft" badge.
// false (real launch): content awaiting approval is hidden entirely, never shown without the badge.
export const prototypeMode = true;

// Badge labels (content rules 2–4 in CLAUDE.md).
export const badgeLabels = {
  draft: "Draft",
  comingSoon: "Coming soon",
  sampleProfile: "Sample profile",
  preview: "Preview · in development",
};
