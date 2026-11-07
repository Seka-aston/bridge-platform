// Interface wording used inside cards and the footer (not from the spec; written for the
// prototype in British English). Edit here, not inside components.

export const programmeCardText = {
  status: { open: "Open", upcoming: "Upcoming", closed: "Closed", archived: "Archived" },
  // {date} is replaced with a formatted date. Closed and archived cards never show a deadline.
  dateLine: {
    open: "Apply by {date}",
    upcoming: "Applications open {date}",
    closed: "Applications closed",
    archived: "Programme completed",
  },
  labels: { audience: "Who it's for", eligibility: "Eligibility", format: "Format", location: "Location" },
  cta: { open: "Apply now", other: "View programme" },
  featuredLabel: "Featured",
};

export const talentCardText = {
  skills: "Skills",
  evidence: "Project evidence",
  experience: "Experience",
  availability: "Availability",
  suitableFor: "Suitable for",
  verified: "Skills verified",
  inProgress: "Verification in progress",
};

export const journeyText = {
  step: "Step {number}",
};

export const articleCardText = {
  readingTime: "{minutes} min read",
  readMore: "Read article",
};

export const storyCardText = {
  // Shown only in prototype mode when no approved stories exist yet.
  placeholderQuote: "[An approved learner or partner story will appear here once Bridge supplies it.]",
  placeholderName: "[Name]",
  placeholderRole: "[Programme and year]",
};

export const footerText = {
  columns: { pathways: "Pathways", explore: "Explore", contact: "Contact" },
  missionPlaceholder: "Mission statement awaiting Bridge.",
  socialPlaceholder: "Official social links awaiting Bridge.",
  copyright: "© {year} Bridge. All rights reserved.",
};

export const homeText = {
  // Shown only in prototype mode, where the hero ecosystem visual will go (Checkpoint 4).
  heroVisualPlaceholder: "Hero ecosystem visual: learner profiles, Skills Passport, disciplines, partners and opportunities. Designed in Checkpoint 4.",
};

export const bridgeAiText = {
  panelTitle: "Bridge AI",
  // Makes clear the panel is an illustration, not a working service (spec 4.2.9).
  panelNote: "Illustration of planned capabilities. Bridge AI is not live yet.",
};
