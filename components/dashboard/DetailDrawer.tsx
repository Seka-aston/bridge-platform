"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";

/*
  Detail drawer on the shadcn Sheet: slides in from the right, keeps focus inside while open,
  closes with Escape or a click outside, and returns focus to whatever opened it (the screens
  open it from their own buttons, so that element is remembered here).
  Same props as before, so every dashboard screen uses it unchanged.
*/

export function DetailDrawer({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  const returnTo = useRef<HTMLElement | null>(null);
  const returnArea = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!open) return;
    returnTo.current = document.activeElement as HTMLElement | null;
    // If the button that opened the drawer is gone when it closes (e.g. a verified request leaves
    // the list), focus goes to the panel it was in instead of being lost.
    returnArea.current = returnTo.current?.closest<HTMLElement>("section, main") ?? document.getElementById("main");
  }, [open]);
  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        className="w-full gap-0 sm:max-w-lg"
        onCloseAutoFocus={(e) => {
          if (returnTo.current?.isConnected) {
            e.preventDefault();
            returnTo.current.focus();
          } else if (returnArea.current?.isConnected) {
            e.preventDefault();
            if (!returnArea.current.hasAttribute("tabindex")) returnArea.current.setAttribute("tabindex", "-1");
            returnArea.current.focus();
          }
        }}
      >
        <SheetHeader className="border-b">
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription className="sr-only">{title}</SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-6 text-sm">{children}</div>
      </SheetContent>
    </Sheet>
  );
}
