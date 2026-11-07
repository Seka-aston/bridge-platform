import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { roleText } from "@/content/dashboard";
import { roles, sampleUsers, type Role } from "@/data/users";

export function generateStaticParams() {
  return roles.map((role) => ({ role }));
}

export const metadata: Metadata = { robots: { index: false } };

export default async function RoleLayout({ children, params }: LayoutProps<"/dashboard/[role]">) {
  const { role } = await params;
  if (!roles.includes(role as Role)) notFound();
  const r = role as Role;
  return (
    <DashboardShell base={`/dashboard/${r}`} title={roleText[r].title} roleLabel={roleText[r].label} user={sampleUsers[r]} nav={roleText[r].nav}>
      {children}
    </DashboardShell>
  );
}
