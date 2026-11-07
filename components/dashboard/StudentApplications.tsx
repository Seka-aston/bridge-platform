"use client";

import { Send } from "lucide-react";
import { useEffect, useState } from "react";
import { EmptyState, ListItem } from "@/components/dashboard/parts";
import { overviewText } from "@/content/dashboard";
import { readSession } from "@/lib/prototypeStore";

/*
  Connected journey (first step): applications submitted on the public site during this
  browser session appear on the student dashboard. Read from session storage after mount.
*/

const t = overviewText.student;
type Saved = { programmeId: string; programmeName: string; savedAt: string };

export function useSessionApplications() {
  const [apps, setApps] = useState<Saved[] | null>(null);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- browser-only storage, read after mount
  useEffect(() => setApps(readSession<Saved>("bridge-applications")), []);
  return apps;
}

export function StudentApplications() {
  const apps = useSessionApplications();
  if (apps === null) return <div className="min-h-32" />;
  if (apps.length === 0) {
    return <EmptyState icon={Send} title={t.applicationsEmpty.title} body={t.applicationsEmpty.body} action={{ label: t.applicationsEmpty.action, href: "/programmes" }} />;
  }
  return (
    <ul>
      {apps.map((a) => (
        <ListItem
          key={a.programmeId + a.savedAt}
          title={a.programmeName}
          meta={t.appliedOn.replace(
            "{date}",
            new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(a.savedAt)),
          )}
        />
      ))}
    </ul>
  );
}

export function ApplicationCount() {
  const apps = useSessionApplications();
  return <>{apps === null ? "–" : apps.length}</>;
}
