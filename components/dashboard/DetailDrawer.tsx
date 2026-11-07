"use client";

import { X } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import { dashboardText as t } from "@/content/dashboard";

/*
  Detail drawer: slides in from the right. Built on the native <dialog> element, so focus
  stays inside while it's open, Escape closes it and the page behind is inert. Focus
  returns to whatever opened it. Clicking the dimmed backdrop also closes it.
*/

export function DetailDrawer({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const returnTo = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      returnTo.current = document.activeElement as HTMLElement | null;
      d.showModal();
    }
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby="drawer-title"
      onClose={() => {
        onClose();
        returnTo.current?.focus();
      }}
      onClick={(e) => e.target === ref.current && ref.current?.close()}
      className="m-0 ml-auto h-dvh max-h-dvh w-full max-w-lg bg-white p-0 shadow-card-hover backdrop:bg-navy-900/60"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between gap-4 border-b border-gray-200 px-6 py-4">
          <h2 id="drawer-title" className="text-h3 text-navy-900">
            {title}
          </h2>
          <button
            type="button"
            onClick={() => ref.current?.close()}
            aria-label={t.close}
            className="inline-flex size-11 items-center justify-center rounded-control text-navy-900 hover:bg-green-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900"
          >
            <X aria-hidden className="size-6" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </dialog>
  );
}
