import Link from "next/link";
import { ArrowRight, BadgeCheck, Briefcase, Check, GraduationCap, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/Badge";
import { IconTile } from "@/components/IconTile";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { H3 } from "@/components/ui/typography";

/*
  Service card (spec 4.2.5): icon, title, description, capability list, CTA,
  optional "Coming soon" badge. Cards in a row share one height; the CTA sits on the bottom.
*/

export const serviceIcons: Record<string, LucideIcon> = {
  learn: GraduationCap,
  prove: BadgeCheck,
  connect: Briefcase,
};

type ServiceCardProps = {
  icon: keyof typeof serviceIcons;
  title: string;
  description: string;
  capabilities: string[];
  cta: { label: string; href: string };
  comingSoon?: boolean;
};

export function ServiceCard({ icon, title, description, capabilities, cta, comingSoon = false }: ServiceCardProps) {
  return (
    <Card className="h-full gap-6 text-base">
      <CardHeader className="gap-0">
        <div className="flex items-start justify-between gap-4">
          <IconTile icon={serviceIcons[icon]} />
          {comingSoon && <Badge kind="comingSoon" />}
        </div>
        <H3 className="mt-6">{title}</H3>
        <p className="mt-2 text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="flex-1">
        <Separator className="mb-3" />
        <ul className="space-y-3">
          {capabilities.map((c) => (
            <li key={c} className="flex gap-3">
              <Check aria-hidden className="mt-1 size-4 shrink-0 text-primary" />
              <span>{c}</span>
            </li>
          ))}
        </ul>
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
