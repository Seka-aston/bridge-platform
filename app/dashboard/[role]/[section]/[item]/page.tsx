import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CoursePage } from "@/components/dashboard/student/CoursePage";
import { courses } from "@/data/student";

// Detail pages inside a dashboard section. Today: the student's course pages (Checkpoint 13).
export function generateStaticParams() {
  return courses.map((c) => ({ role: "student", section: "courses", item: c.id }));
}

export async function generateMetadata({ params }: PageProps<"/dashboard/[role]/[section]/[item]">): Promise<Metadata> {
  const { item } = await params;
  const c = courses.find((x) => x.id === item);
  return { title: c ? `${c.title} · Student dashboard` : undefined };
}

export default async function ItemPage({ params }: PageProps<"/dashboard/[role]/[section]/[item]">) {
  const { role, section, item } = await params;
  if (role !== "student" || section !== "courses" || !courses.some((c) => c.id === item)) notFound();
  return <CoursePage courseId={item} />;
}
