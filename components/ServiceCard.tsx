import { BadgeCheck, Briefcase, Check, GraduationCap, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";

/*
  Service card (CLAUDE.md section 7, component 6; spec 4.2.5).
  Icon, title, description, capability list, CTA, optional "Coming soon" badge.
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
  const Icon = serviceIcons[icon];
  return (
    <article className="flex h-full flex-col rounded-card border border-gray-200 bg-white p-6 shadow-card md:p-8">
      <div className="flex items-start justify-between gap-4">
        <span className="inline-flex size-12 items-center justify-center rounded-control bg-green-50">
          <Icon aria-hidden className="size-6 text-green-700" />
        </span>
        {comingSoon && <Badge kind="comingSoon" />}
      </div>
      <h3 className="mt-6 text-h3 text-navy-900">{title}</h3>
      <p className="mt-2 text-gray-700">{description}</p>
      <ul className="mt-6 space-y-3 border-t border-gray-200 pt-6">
        {capabilities.map((c) => (
          <li key={c} className="flex gap-3 text-gray-800">
            <Check aria-hidden className="mt-0.5 size-5 shrink-0 text-green-500" />
            <span>{c}</span>
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-8">
        <Button variant="text" href={cta.href}>
          {cta.label}
        </Button>
      </div>
    </article>
  );
}
