"use client";

import { RotateCcw } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/Button";
import { resetText as t } from "@/content/dashboard";
import { resetDemo } from "@/lib/prototypeStore";

// Clears everything the demo saved in this browser tab, so each presentation starts fresh.
export function ResetDemo() {
  const [done, setDone] = useState(false);
  return (
    <section aria-labelledby="reset-title" className="rounded-card border border-dashed border-gray-500 p-6">
      <h2 id="reset-title" className="text-h3 text-navy-900">{t.title}</h2>
      <p className="mt-2 max-w-2xl text-gray-700">{t.body}</p>
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <Button
          variant="outline"
          onClick={() => {
            resetDemo();
            setDone(true);
          }}
        >
          <RotateCcw aria-hidden className="size-4" /> {t.button}
        </Button>
        <p role="status" className="font-semibold text-green-700">{done ? t.done : ""}</p>
      </div>
    </section>
  );
}
