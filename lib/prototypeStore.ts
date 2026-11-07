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

// Admin decisions and edits, read by the public site (cross-role journeys, Checkpoint 11).
export const APPROVAL_STORE = "bridge-approvals"; // { "stat:1,000+": "approved" | "changes", ... }
export const PROGRAMME_EDITS_STORE = "bridge-admin-programmes"; // { programmeId: Programme }

export function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

// Live notifications created by journeys between roles, shown in the dashboard bell.
export type LiveNotice = { role: string; text: string; at: string };
const NOTICE_STORE = "bridge-notices";

export function addNotice(role: string, text: string) {
  try {
    const list = readJSON<LiveNotice[]>(NOTICE_STORE, []);
    if (list.some((n) => n.role === role && n.text === text)) return;
    list.unshift({ role, text, at: new Date().toISOString() });
    sessionStorage.setItem(NOTICE_STORE, JSON.stringify(list));
  } catch {}
}

export function readNotices(role: string): LiveNotice[] {
  return readJSON<LiveNotice[]>(NOTICE_STORE, []).filter((n) => n.role === role);
}

// Clears everything the demo saved in this browser tab.
export function resetDemo() {
  try {
    Object.keys(sessionStorage)
      .filter((k) => k.startsWith("bridge-"))
      .forEach((k) => sessionStorage.removeItem(k));
  } catch {}
}
