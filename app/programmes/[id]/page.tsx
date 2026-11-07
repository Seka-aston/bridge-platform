import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { LiveProgrammeDetail, SessionProgrammeDetail } from "@/components/LiveProgrammes";
import { programmeDetail } from "@/content/pages";
import { prototypeMode } from "@/content/site";
import { programmes } from "@/data/programmes";
import { todayInKigali } from "@/lib/programmes";

export function generateStaticParams() {
  return programmes.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: PageProps<"/programmes/[id]">): Promise<Metadata> {
  const { id } = await params;
  const p = programmes.find((x) => x.id === id);
  return p ? { title: p.name, description: p.summary } : {};
}

// Everything that depends on today's date (status, apply form) is decided at request time;
// the browser layer then applies any admin edit to this programme made in this session.
async function Detail({ id }: { id: string }) {
  await connection();
  const p = programmes.find((x) => x.id === id);
  // Programmes created in the admin dashboard this session live only in the browser.
  if (!p && id.startsWith("new-")) return <SessionProgrammeDetail id={id} today={todayInKigali()} notFoundText={programmeDetail.sessionNotFound} />;
  if (!p || (!p.approved && !prototypeMode)) notFound();
  return <LiveProgrammeDetail programme={p} today={todayInKigali()} />;
}

export default async function ProgrammeDetailPage({ params }: PageProps<"/programmes/[id]">) {
  const { id } = await params;
  return (
    <main id="main" className="flex-1">
      <Suspense fallback={<div className="min-h-screen" />}>
        <Detail id={id} />
      </Suspense>
    </main>
  );
}
