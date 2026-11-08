"use client";

import { ArrowLeft, MessagesSquare, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ErrorText } from "@/components/forms/Fields";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { messagesText as t, sharedText } from "@/content/dashboard";
import { threads, type Message } from "@/data/messages";
import { readJSON } from "@/lib/prototypeStore";
import { cn } from "@/lib/utils";

/*
  Student messages (redesign Step 7): one card with the conversation list and the open thread,
  side by side on large screens and one at a time on small ones. Sent messages, and messages a
  company sends from its dashboard, are kept in this browser tab ("bridge-messages").
*/

export const MESSAGE_STORE = "bridge-messages";
type Extra = { from: "me" | "them"; text: string; at: string };

const ago = (n: number) => sharedText.agoDays[String(n)] ?? sharedText.agoDays.n.replace("{n}", String(n));

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2);
}

export function MessagesView() {
  const [active, setActive] = useState<string | null>(null);
  const [extra, setExtra] = useState<Record<string, Extra[]>>({});
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const endRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- browser-only storage, read after mount
    setExtra(readJSON(MESSAGE_STORE, {}));
  }, []);
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "nearest" });
  }, [active, extra]);

  const all = (id: string): (Message | (Extra & { daysAgo: number }))[] => [
    ...threads.find((x) => x.id === id)!.messages,
    ...(extra[id] ?? []).map((m) => ({ ...m, daysAgo: 0 })),
  ];
  const current = threads.find((x) => x.id === active);

  function send(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim()) {
      setError(t.empty);
      return;
    }
    const next = { ...extra, [active!]: [...(extra[active!] ?? []), { from: "me" as const, text: draft.trim(), at: new Date().toISOString() }] };
    setExtra(next);
    try {
      sessionStorage.setItem(MESSAGE_STORE, JSON.stringify(next));
    } catch {}
    setDraft("");
  }

  return (
    <Card className="grid gap-0 p-0 lg:min-h-[34rem] lg:grid-cols-[20rem_minmax(0,1fr)]">
      <section aria-label={t.listLabel} className={cn("p-2 lg:border-r", active && "hidden lg:block")}>
        <ul className="space-y-0.5">
          {threads.map((th) => {
            const msgs = all(th.id);
            const last = msgs[msgs.length - 1];
            const selected = th.id === active;
            return (
              <li key={th.id}>
                <button
                  type="button"
                  onClick={() => setActive(th.id)}
                  aria-current={selected ? "true" : undefined}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-lg p-3 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                    selected ? "bg-accent" : "hover:bg-muted",
                  )}
                >
                  <Avatar>
                    <AvatarFallback className="bg-brand-navy text-xs font-semibold text-white">{initials(th.name)}</AvatarFallback>
                  </Avatar>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-2">
                      <span className="font-medium text-heading">{th.name}</span>
                      <span className="shrink-0 text-xs text-muted-foreground">{ago(last.daysAgo)}</span>
                    </span>
                    <span className="block truncate text-muted-foreground">{last.text}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-label={current?.name ?? t.title} className={cn("min-w-0 flex-col", active ? "flex" : "hidden lg:flex")}>
        {current ? (
          <>
            <div className="flex items-center gap-3 border-b px-4 py-3">
              <Button variant="ghost" size="icon-sm" onClick={() => setActive(null)} aria-label={t.back} className="lg:hidden">
                <ArrowLeft />
              </Button>
              <Avatar>
                <AvatarFallback className="bg-brand-navy text-xs font-semibold text-white">{initials(current.name)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold text-heading">{current.name}</h2>
                <p className="text-xs text-muted-foreground">{current.role}</p>
              </div>
            </div>
            <ol className="flex max-h-[28rem] min-h-72 flex-1 flex-col gap-3 overflow-y-auto bg-muted/40 p-4 text-sm" aria-live="polite">
              {all(current.id).map((m, i) => (
                <li
                  key={i}
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-2.5",
                    m.from === "me" ? "self-end rounded-br-sm bg-primary text-primary-foreground" : "self-start rounded-bl-sm bg-card ring-1 ring-border",
                  )}
                >
                  <span className="sr-only">{m.from === "me" ? t.you : current.name}: </span>
                  {m.text}
                  <span className={cn("mt-1 block text-xs", m.from === "me" ? "text-primary-foreground" : "text-muted-foreground")}>{ago(m.daysAgo)}</span>
                </li>
              ))}
              <li ref={endRef} aria-hidden className="h-0" />
            </ol>
            <form noValidate onSubmit={send} className="border-t p-4">
              <div className="flex gap-2">
                <label className="sr-only" htmlFor="message">
                  {t.placeholder}
                </label>
                <Input
                  id="message"
                  value={draft}
                  onChange={(e) => {
                    setDraft(e.target.value);
                    setError("");
                  }}
                  placeholder={t.placeholder}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? "message-error" : undefined}
                  className="h-9 flex-1"
                />
                <Button type="submit">
                  <Send data-icon="inline-start" aria-hidden /> {t.send}
                </Button>
              </div>
              <div className="mt-2">
                <ErrorText id="message-error" error={error} />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{t.sentNote}</p>
            </form>
          </>
        ) : (
          <Empty className="m-auto">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <MessagesSquare />
              </EmptyMedia>
              <EmptyTitle>{t.title}</EmptyTitle>
              <EmptyDescription>{t.description}</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </section>
    </Card>
  );
}
