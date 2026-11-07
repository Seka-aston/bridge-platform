/*
  Prototype "saving": demo submissions are kept in the browser for this tab only
  (sessionStorage), as agreed in PROGRESS.md. Nothing is sent anywhere.
*/

export function saveToSession(key: string, record: Record<string, unknown>) {
  try {
    const list = JSON.parse(sessionStorage.getItem(key) ?? "[]") as unknown[];
    list.push({ ...record, savedAt: new Date().toISOString() });
    sessionStorage.setItem(key, JSON.stringify(list));
  } catch {
    // Storage can be unavailable (private mode); the demo still shows success.
  }
}

export function readSession<T>(key: string): T[] {
  try {
    return JSON.parse(sessionStorage.getItem(key) ?? "[]") as T[];
  } catch {
    return [];
  }
}

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

// Short pause so the loading state is visible, like a real request.
export const fakeNetwork = () => new Promise((r) => setTimeout(r, 1200));

// School verification decisions, read by the student's Skills Passport (cross-role journey).
// Shape: { "talentId:skill name": "verified" | "declined" }
export const VERIFY_STORE = "bridge-skill-verifications";
