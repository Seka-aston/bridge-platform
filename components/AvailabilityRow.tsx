"use client";

import { useEffect, useState } from "react";
import { TalentField } from "@/components/TalentField";
import { readStudentPrivacy } from "@/lib/privacy";

/*
  The Availability row of a talent card. Shown only when the learner has consented to share it.
  For the sample student, her current choice in Settings → Skills Passport privacy applies.
*/

export function AvailabilityRow({ profileId, consented, text, label }: { profileId: string; consented: boolean; text: string; label: string }) {
  const [state, setState] = useState({ consented, text });
  useEffect(() => {
    if (profileId !== "sample-1") return;
    const p = readStudentPrivacy({ publicLink: true, shareAvailability: consented, availabilityText: text });
    // eslint-disable-next-line react-hooks/set-state-in-effect -- browser-only storage, read after mount
    setState({ consented: p.shareAvailability, text: p.availabilityText });
  }, [profileId, consented, text]);
  if (!state.consented || !state.text) return null;
  return (
    <TalentField label={label}>
      <p>{state.text}</p>
    </TalentField>
  );
}
