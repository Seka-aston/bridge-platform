"use client";

import { Lock } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
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
    <div className="mx-auto max-w-2xl px-gutter py-section-mobile text-center md:py-section">
      <span className="inline-flex size-14 items-center justify-center rounded-full bg-green-50">
        <Lock aria-hidden className="size-6 text-green-700" />
      </span>
      <p className="mt-6 text-h3 text-navy-900">{settingsText.privacy.privateNotice}</p>
    </div>
  );
}
