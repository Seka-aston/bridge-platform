"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

// Shows the public website's header or footer everywhere except inside the dashboards,
// which have their own frame (sidebar and top bar).
export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "/";
  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) return null;
  return <>{children}</>;
}
