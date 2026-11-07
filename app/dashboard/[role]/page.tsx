import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RoleOverview } from "@/components/dashboard/Overviews";
import { roleText } from "@/content/dashboard";
import { roles, type Role } from "@/data/users";

export async function generateMetadata({ params }: PageProps<"/dashboard/[role]">): Promise<Metadata> {
  const { role } = await params;
  return { title: roleText[role as Role]?.title };
}

export default async function RoleOverviewPage({ params }: PageProps<"/dashboard/[role]">) {
  const { role } = await params;
  if (!roles.includes(role as Role)) notFound();
  return <RoleOverview role={role as Role} />;
}
