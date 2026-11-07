import type { TalentProfile } from "@/data/talent";

/*
  The sample student's Skills Passport privacy choices (Settings → Skills Passport privacy).
  Read in the browser by the company dashboard and the public passport page, so a change in
  Settings changes what others actually see (content rule: availability only with consent).
*/

export const PRIVACY_STORE = "bridge-student-privacy";
export type StudentPrivacy = { publicLink: boolean; shareAvailability: boolean; availabilityText: string };

export function readStudentPrivacy(defaults: StudentPrivacy): StudentPrivacy {
  try {
    const raw = sessionStorage.getItem(PRIVACY_STORE);
    return raw ? { ...defaults, ...(JSON.parse(raw) as Partial<StudentPrivacy>) } : defaults;
  } catch {
    return defaults;
  }
}

export function defaultPrivacy(p: TalentProfile): StudentPrivacy {
  return { publicLink: true, shareAvailability: !!p.availability?.consented, availabilityText: p.availability?.text ?? "" };
}

// Apply the student's choices to her profile as others see it.
export function withPrivacy(p: TalentProfile, privacy: StudentPrivacy | null): TalentProfile {
  if (!privacy || p.id !== "sample-1") return p;
  return { ...p, availability: { consented: privacy.shareAvailability, text: privacy.availabilityText } };
}
