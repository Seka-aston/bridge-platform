// Placeholder pages for links whose real page is built in Checkpoint 5 (or later).
// Every link on the site must lead to a real page or one of these clearly marked placeholders.

export const placeholderNotice = {
  eyebrow: "Placeholder page",
  message: "This page hasn't been built yet. It will be added in a later stage of the prototype.",
  backLink: { label: "Back to the homepage", href: "/" },
};

// Only Login remains a placeholder; the "Sign in as…" screen is built in Checkpoint 6.
export const placeholderPages: Record<string, string> = {
  "sign-in": "Login",
};
