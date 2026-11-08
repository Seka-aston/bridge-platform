import { Badge } from "@/components/Badge";
import { Display, Eyebrow, H2, Lead } from "@/components/ui/typography";
import { prototypeMode } from "@/content/site";
import { cn } from "@/lib/utils";

/*
  Section heading block: eyebrow (optional), title, supporting copy (optional).

  - align: "left" (default) or "center" (short, single-statement sections such as How Bridge works)
  - tone: "dark" when the heading sits on navy; colours then flip through the tokens-navy helper
  - level: "h2" for sections (default), "h1" for a page's main title
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

export function SectionHeading({ draft = false, eyebrow, title, supporting, align = "left", tone = "light", level = "h2", id, className }: SectionHeadingProps) {
  const centred = align === "center";
  const Title = level === "h1" ? Display : H2;
  return (
    <div className={cn("max-w-3xl", centred && "mx-auto text-center", tone === "dark" && "tokens-navy", className)}>
      {draft && prototypeMode && <Badge kind="draft" className="mb-4" />}
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <Title as={level} id={id} className={cn(eyebrow && "mt-4")}>
        {title}
      </Title>
      {supporting && <Lead className={cn("mt-4 text-pretty", centred && "mx-auto")}>{supporting}</Lead>}
    </div>
  );
}
