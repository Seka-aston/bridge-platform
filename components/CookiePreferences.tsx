"use client";

import { CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { cookies as c } from "@/content/legal";

/*
  Cookie preferences control. Essential is always on; Analytics is a choice. The choice is a
  per-viewer convenience, so it lives in this browser's local storage (with a safe fallback).
*/

const KEY = "bridge-cookie-preferences";

export function CookiePreferences() {
  const [prefs, setPrefs] = useState<Record<string, boolean>>({ analytics: false });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- browser-only storage, read after mount
      if (raw) setPrefs(JSON.parse(raw));
    } catch {}
  }, []);

  return (
    <section aria-labelledby="cookie-choices" className="mt-10 rounded-card border border-gray-200 p-6">
      <h2 id="cookie-choices" className="sr-only">{c.title}</h2>
      <p className="rounded-control bg-green-50 p-4 text-gray-800">{c.prototypeFact}</p>
      <ul className="mt-6 space-y-5">
        {c.categories.map((cat) => (
          <li key={cat.id} className="flex items-start justify-between gap-6 border-b border-gray-200 pb-5 last:border-0">
            <div>
              <p className="font-bold text-navy-900" id={`cookie-${cat.id}`}>
                {cat.title}
              </p>
              <p className="mt-1 text-gray-700">{cat.description}</p>
            </div>
            {cat.locked ? (
              <span className="shrink-0 whitespace-nowrap rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-800">{c.alwaysOn}</span>
            ) : (
              <input
                type="checkbox"
                role="switch"
                aria-labelledby={`cookie-${cat.id}`}
                checked={!!prefs[cat.id]}
                onChange={(e) => {
                  setPrefs({ ...prefs, [cat.id]: e.target.checked });
                  setSaved(false);
                }}
                className="relative mt-1 h-6 w-11 shrink-0 cursor-pointer appearance-none rounded-full bg-gray-500 transition-colors duration-150 before:absolute before:left-0.5 before:top-0.5 before:size-5 before:rounded-full before:bg-white before:transition-transform before:duration-150 checked:bg-green-700 checked:before:translate-x-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900"
              />
            )}
          </li>
        ))}
      </ul>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <Button
          onClick={() => {
            try {
              localStorage.setItem(KEY, JSON.stringify(prefs));
            } catch {}
            setSaved(true);
          }}
        >
          {c.save}
        </Button>
        <p role="status" className="flex items-center gap-2 font-semibold text-green-700">
          {saved && (
            <>
              <CheckCircle2 aria-hidden className="size-5" /> {c.saved}
            </>
          )}
        </p>
      </div>
    </section>
  );
}
