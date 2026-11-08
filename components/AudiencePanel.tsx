import Link from "next/link";
import { ArrowRight, Building2, Handshake, School, UserRound, type LucideIcon } from "lucide-react";
import { IconTile } from "@/components/IconTile";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Eyebrow, H3 } from "@/components/ui/typography";

/*
  Audience panel (spec 4.2.6). Four visually consistent panels: audience label, headline, body, CTA.
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
  return (
    <Card className="h-full gap-6 text-base">
      <CardHeader className="gap-0">
        <div className="flex items-center gap-4">
          <IconTile icon={audienceIcons[icon]} />
          <Eyebrow>{audience}</Eyebrow>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <H3>{headline}</H3>
        <p className="mt-2 text-muted-foreground">{body}</p>
      </CardContent>
      <CardFooter>
        <Button asChild variant="link" size="lg">
          <Link href={cta.href}>
            {cta.label} <ArrowRight data-icon="inline-end" aria-hidden />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
