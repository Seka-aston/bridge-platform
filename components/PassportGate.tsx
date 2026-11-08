"use client";

import { Lock } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { settingsText } from "@/content/dashboard";
import { readStudentPrivacy } from "@/lib/privacy";

// Public Skills Passport: hidden when the learner has turned off her public link in Settings.
export function PassportGate({ children }: { children: ReactNode }) {
  const [isPublic, setPublic] = useState(true);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- browser-only storage, read after mount
    setPublic(readStudentPrivacy({ publicLink: true, shareAvailability: true, availabilityText: "" }).publicLink);
  }, []);
  if (isPublic) return <>{children}</>;
  return (
    <div className="mx-auto max-w-2xl px-gutter py-section-mobile md:py-section">
      <Empty className="border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Lock />
          </EmptyMedia>
          <EmptyTitle>{settingsText.privacy.privateNotice}</EmptyTitle>
        </EmptyHeader>
      </Empty>
    </div>
  );
}
