"use client";

import { AlertCircle, CheckCircle2, ClipboardList, Info, RotateCw, TriangleAlert } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Demo, Section } from "./Section";

// The three states every list, table and dashboard panel must design for.
function PanelStates() {
  const [state, setState] = useState<"loading" | "empty" | "error">("loading");
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Choose a state">
        {(["loading", "empty", "error"] as const).map((s) => (
          <Button key={s} size="sm" variant={state === s ? "secondary" : "outline"} aria-pressed={state === s} onClick={() => setState(s)}>
            {s === "loading" ? "Loading" : s === "empty" ? "Empty" : "Error"}
          </Button>
        ))}
      </div>
      <Card className="min-h-72">
        {state === "loading" && (
          <>
            <CardHeader>
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent className="space-y-4" role="status" aria-busy="true" aria-label="Loading assignments">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="size-10 rounded-md" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </CardContent>
          </>
        )}
        {state === "empty" && (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ClipboardList />
              </EmptyMedia>
              <EmptyTitle>No assignments due</EmptyTitle>
              <EmptyDescription>New assignments from your facilitators will appear here.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button variant="outline" size="sm">
                Browse courses
              </Button>
            </EmptyContent>
          </Empty>
        )}
        {state === "error" && (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon" className="bg-destructive/10 text-destructive">
                <AlertCircle />
              </EmptyMedia>
              <EmptyTitle>Assignments couldn&apos;t load</EmptyTitle>
              <EmptyDescription>Check your connection and try again. Your work is saved.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button variant="outline" size="sm" onClick={() => setState("loading")}>
                <RotateCw data-icon="inline-start" /> Try again
              </Button>
            </EmptyContent>
          </Empty>
        )}
      </Card>
    </div>
  );
}

export function Feedback() {
  return (
    <Section
      id="feedback"
      eyebrow="Components"
      title="Feedback and states"
      note="Alerts stay on the page; toasts confirm an action and fade after a few seconds. Every panel has a designed loading, empty and error state."
    >
      <Demo label="Alerts" className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Alert>
          <Info />
          <AlertTitle>Prototype</AlertTitle>
          <AlertDescription>This platform runs on sample data. Changes are kept in this browser tab only.</AlertDescription>
        </Alert>
        <Alert variant="destructive">
          <TriangleAlert />
          <AlertTitle>There are 2 problems with your application</AlertTitle>
          <AlertDescription>
            <ul className="list-inside list-disc">
              <li>Enter your full name.</li>
              <li>Choose your discipline.</li>
            </ul>
          </AlertDescription>
        </Alert>
      </Demo>

      <Demo label="Toasts" className="flex flex-wrap gap-3">
        <Button variant="outline" onClick={() => toast.success("Application sent", { description: "Track it under Opportunities." })}>
          <CheckCircle2 data-icon="inline-start" /> Success
        </Button>
        <Button variant="outline" onClick={() => toast("Added to shortlist", { action: { label: "Undo", onClick: () => toast("Removed from shortlist") } })}>
          With undo
        </Button>
        <Button variant="outline" onClick={() => toast.error("Couldn't save", { description: "Try again in a moment." })}>
          Error
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.promise(new Promise((r) => setTimeout(r, 1500)), { loading: "Sending…", success: "Message sent", error: "Couldn't send" })
          }
        >
          Loading, then success
        </Button>
      </Demo>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Demo label="Loading, empty and error" hint="Switch between the states">
          <PanelStates />
        </Demo>
        <Demo label="Spinner" className="flex items-center gap-6 text-sm text-muted-foreground">
          <Spinner className="size-5" /> Loading…
        </Demo>
      </div>
    </Section>
  );
}
