import type { Metadata } from "next";
import { Construction } from "lucide-react";
import { notFound } from "next/navigation";
import { DashPageHeader, EmptyState } from "@/components/dashboard/parts";
import { studentScreens } from "@/components/dashboard/student/StudentScreens";
import { dashboardText as t, roleText } from "@/content/dashboard";
import { roles, type Role } from "@/data/users";

// Every menu link works. Built screens render here; later ones show a clear empty state.
export function generateStaticParams() {
  return roles.flatMap((role) => roleText[role].nav.filter((n) => n.slug).map((n) => ({ role, section: n.slug })));
}

export async function generateMetadata({ params }: PageProps<"/dashboard/[role]/[section]">): Promise<Metadata> {
  const { role, section } = await params;
  const item = roleText[role as Role]?.nav.find((n) => n.slug === section);
  return { title: item ? `${item.label} · ${roleText[role as Role].title}` : undefined };
}

export default async function SectionPage({ params }: PageProps<"/dashboard/[role]/[section]">) {
  const { role, section } = await params;
  const r = role as Role;
  const item = roleText[r]?.nav.find((n) => n.slug === section && n.slug);
  if (!item) notFound();

  const Screen = r === "student" ? studentScreens[section] : undefined;
  if (Screen) return <Screen />;

  return (
    <div className="space-y-6">
      <DashPageHeader title={item.label} />
      <EmptyState
        icon={Construction}
        title={item.checkpoint ? t.comingTitle : t.notPlannedTitle}
        body={item.checkpoint ? t.comingBody.replace("{n}", String(item.checkpoint)) : t.notPlannedBody}
        action={{ label: t.backToOverview, href: `/dashboard/${r}` }}
      />
    </div>
  );
}
