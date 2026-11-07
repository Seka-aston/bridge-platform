import type { Metadata } from "next";
import { Construction } from "lucide-react";
import { notFound } from "next/navigation";
import { DashPageHeader, EmptyState } from "@/components/dashboard/parts";
import { dashboardText as t, roleText } from "@/content/dashboard";
import { roles, type Role } from "@/data/users";

// Every sidebar link works now; screens built in later checkpoints show a clear empty state.
export function generateStaticParams() {
  return roles.flatMap((role) => roleText[role].nav.map((n) => ({ role, section: n.slug })));
}

export async function generateMetadata({ params }: PageProps<"/dashboard/[role]/[section]">): Promise<Metadata> {
  const { role, section } = await params;
  const item = roleText[role as Role]?.nav.find((n) => n.slug === section);
  return { title: item ? `${item.label} · ${roleText[role as Role].title}` : undefined };
}

export default async function SectionPage({ params }: PageProps<"/dashboard/[role]/[section]">) {
  const { role, section } = await params;
  const r = role as Role;
  const item = roleText[r]?.nav.find((n) => n.slug === section);
  if (!item) notFound();
  return (
    <div className="space-y-8">
      <DashPageHeader title={item.label} />
      <EmptyState
        icon={Construction}
        title={t.comingTitle}
        body={t.comingBody.replace("{n}", String(item.checkpoint))}
        action={{ label: t.backToOverview, href: `/dashboard/${r}` }}
      />
    </div>
  );
}
