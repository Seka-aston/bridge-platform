import { Building2, Handshake, School, UserRound, type LucideIcon } from "lucide-react";
import { Button } from "@/components/Button";

/*
  Audience panel (CLAUDE.md section 7, component 7; spec 4.2.6).
  Four visually consistent panels: audience label, headline, body, CTA.
*/

export const audienceIcons: Record<string, LucideIcon> = {
  talents: UserRound,
  schools: School,
  companies: Building2,
  partners: Handshake,
};

type AudiencePanelProps = {
  icon: keyof typeof audienceIcons;
  audience: string;
  headline: string;
  body: string;
  cta: { label: string; href: string };
};

export function AudiencePanel({ icon, audience, headline, body, cta }: AudiencePanelProps) {
  const Icon = audienceIcons[icon];
  return (
    <article className="flex h-full flex-col rounded-card bg-green-50 p-6 md:p-8">
      <div className="flex items-center gap-3">
        <span className="inline-flex size-10 items-center justify-center rounded-control bg-white">
          <Icon aria-hidden className="size-5 text-green-700" />
        </span>
        <p className="text-eyebrow uppercase text-green-700">{audience}</p>
      </div>
      <h3 className="mt-5 text-h3 text-navy-900">{headline}</h3>
      <p className="mt-2 text-gray-700">{body}</p>
      <div className="mt-auto pt-6">
        {/* Text link, not the Secondary button: its green-50 fill would disappear on this green-50 panel. */}
        <Button variant="text" href={cta.href}>
          {cta.label}
        </Button>
      </div>
    </article>
  );
}
