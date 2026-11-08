"use client";

import { RotateCcw } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { resetText as t } from "@/content/dashboard";
import { resetDemo } from "@/lib/prototypeStore";

// Clears everything the demo saved in this browser tab, so each presentation starts fresh.
export function ResetDemo() {
  const [done, setDone] = useState(false);
  return (
    <section aria-labelledby="reset-title" className="rounded-lg bg-muted p-4">
      <h2 id="reset-title" className="text-sm font-semibold text-heading">
        {t.title}
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">{t.body}</p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            resetDemo();
            setDone(true);
          }}
        >
          <RotateCcw data-icon="inline-start" aria-hidden /> {t.button}
        </Button>
        <p role="status" className="text-sm font-medium text-primary">
          {done ? t.done : ""}
        </p>
      </div>
    </section>
  );
}
