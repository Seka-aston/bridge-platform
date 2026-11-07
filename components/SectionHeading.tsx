import { Badge } from "@/components/Badge";
import { prototypeMode } from "@/content/site";

/*
  Section heading block (CLAUDE.md section 7, component 3).
  Eyebrow (optional), title, supporting copy (optional).

  - align: "left" (default for most homepage sections) or "center" (short,
    single-statement sections such as How Bridge works and the final band)
  - tone: "light" for white and light-green sections, "dark" for navy sections
  - level: "h2" for homepage sections (default), "h1" for a page's main title
  - id: set it on the title so the surrounding <section> can use aria-labelledby
*/

type SectionHeadingProps = {
  // Wording written for the prototype (not from the spec or live site): shows a Draft badge.
  draft?: boolean;
  eyebrow?: string;
  title: string;
  supporting?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
  level?: "h1" | "h2";
  id?: string;
  className?: string;
};

export function SectionHeading({
  draft = false,
  eyebrow,
  title,
  supporting,
  align = "left",
  tone = "light",
  level = "h2",
  id,
  className = "",
}: SectionHeadingProps) {
  const Title = level;
  const dark = tone === "dark";
  const centred = align === "center";

  return (
    <div className={`max-w-3xl ${centred ? "mx-auto text-center" : ""} ${className}`}>
      {draft && prototypeMode && <Badge kind="draft" className="mb-3" />}
      {eyebrow && (
        // Green-500 is too low in contrast for small text on navy, so eyebrows turn white there.
        <p className={`text-eyebrow uppercase ${dark ? "text-white" : "text-green-700"}`}>{eyebrow}</p>
      )}
      <Title
        id={id}
        className={`${eyebrow ? "mt-3" : ""} ${
          level === "h1" ? "text-display-mobile md:text-display" : "text-h2-mobile md:text-h2"
        } ${dark ? "text-white" : "text-navy-900"} text-balance`}
      >
        {title}
      </Title>
      {supporting && (
        <p className={`mt-4 text-body-lg ${dark ? "text-white" : "text-gray-700"} text-pretty`}>{supporting}</p>
      )}
    </div>
  );
}
