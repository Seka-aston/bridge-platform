"use client";

import { AlertCircle, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { dashboardText as t } from "@/content/dashboard";

// Shown inside the dashboard frame if a screen fails; "Try again" re-renders it.
export default function DashboardError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <Empty className="border bg-card">
      <EmptyHeader>
        <EmptyMedia variant="icon" className="bg-destructive/10 text-destructive">
          <AlertCircle />
        </EmptyMedia>
        <EmptyTitle>{t.error.title}</EmptyTitle>
        <EmptyDescription>{t.error.body}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" size="sm" onClick={() => reset()}>
          <RotateCw data-icon="inline-start" aria-hidden /> {t.error.retry}
        </Button>
      </EmptyContent>
    </Empty>
  );
}
