"use client";

import { CheckCircle2, Info } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge as UiBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
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
    <section aria-labelledby="cookie-choices" className="mt-10">
      <h2 id="cookie-choices" className="sr-only">
        {c.title}
      </h2>
      <Card className="text-base">
        <CardContent className="space-y-6">
          <Alert>
            <Info />
            <AlertDescription className="text-foreground">{c.prototypeFact}</AlertDescription>
          </Alert>
          <ul className="divide-y">
            {c.categories.map((cat) => (
              <li key={cat.id} className="flex items-start justify-between gap-6 py-5 first:pt-0 last:pb-0">
                <div>
                  <p className="font-semibold text-heading" id={`cookie-${cat.id}`}>
                    {cat.title}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{cat.description}</p>
                </div>
                {cat.locked ? (
                  <UiBadge variant="closed" className="shrink-0">
                    {c.alwaysOn}
                  </UiBadge>
                ) : (
                  <Switch
                    aria-labelledby={`cookie-${cat.id}`}
                    checked={!!prefs[cat.id]}
                    onCheckedChange={(v) => {
                      setPrefs({ ...prefs, [cat.id]: v });
                      setSaved(false);
                    }}
                    className="mt-1"
                  />
                )}
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter className="flex-wrap gap-4 border-t">
          <Button
            onClick={() => {
              try {
                localStorage.setItem(KEY, JSON.stringify(prefs));
              } catch {}
              setSaved(true);
              toast.success(c.saved);
            }}
          >
            {c.save}
          </Button>
          <p role="status" className="flex items-center gap-2 text-sm font-medium text-primary">
            {saved && (
              <>
                <CheckCircle2 aria-hidden className="size-4" /> {c.saved}
              </>
            )}
          </p>
        </CardFooter>
      </Card>
    </section>
  );
}
