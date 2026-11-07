"use client";

import { ArrowLeft, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/Button";
import { ErrorText } from "@/components/forms/Fields";
import { ago, ring } from "@/components/dashboard/kit";
import { messagesText as t } from "@/content/dashboard";
import { threads, type Message } from "@/data/messages";
import { readJSON } from "@/lib/prototypeStore";

/*
  Student messages (Checkpoint 13): conversation list and thread, two panes on large screens,
  one at a time on small ones. Sent messages, and messages a company sends from its dashboard,
  are kept in this browser tab ("bridge-messages").
*/

export const MESSAGE_STORE = "bridge-messages";
type Extra = { from: "me" | "them"; text: string; at: string };

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
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[22rem_1fr]">
      <section aria-label={t.listLabel} className={`rounded-panel bg-white p-3 ${active ? "hidden lg:block" : ""}`}>
        <ul>
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
                  className={`flex w-full items-start gap-3 rounded-tile p-3 text-left ${ring} ${selected ? "bg-green-50" : "hover:bg-gray-50"}`}
                >
                  <span aria-hidden className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-navy-900 font-bold text-white">
                    {initials(th.name)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-2">
                      <span className="font-semibold text-navy-900">{th.name}</span>
                      <span className="shrink-0 text-sm text-gray-500">{ago(last.daysAgo)}</span>
                    </span>
                    <span className="block truncate text-sm text-gray-700">{last.text}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-label={current?.name ?? t.title} className={`min-w-0 flex-col rounded-panel bg-white ${active ? "flex" : "hidden lg:flex"}`}>
        {current ? (
          <>
            <div className="flex items-center gap-3 border-b border-gray-200 p-4">
              <button type="button" onClick={() => setActive(null)} aria-label={t.back} className={`inline-flex size-10 items-center justify-center rounded-full bg-gray-50 lg:hidden ${ring}`}>
                <ArrowLeft aria-hidden className="size-5" />
              </button>
              <div>
                <h2 className="font-bold text-navy-900">{current.name}</h2>
                <p className="text-sm text-gray-700">{current.role}</p>
              </div>
            </div>
            <ol className="flex max-h-[28rem] min-h-72 flex-col gap-3 overflow-y-auto p-4" aria-live="polite">
              {all(current.id).map((m, i) => (
                <li key={i} className={`max-w-[85%] rounded-tile px-4 py-3 ${m.from === "me" ? "self-end bg-green-700 text-white" : "self-start bg-gray-50 text-gray-800"}`}>
                  <span className="sr-only">{m.from === "me" ? t.you : current.name}: </span>
                  {m.text}
                  <span className={`mt-1 block text-sm ${m.from === "me" ? "text-white" : "text-gray-500"}`}>{ago(m.daysAgo)}</span>
                </li>
              ))}
              <li ref={endRef} aria-hidden className="h-0" />
            </ol>
            <form noValidate onSubmit={send} className="border-t border-gray-200 p-4">
              <div className="flex gap-3">
                <label className="sr-only" htmlFor="message">{t.placeholder}</label>
                <input
                  id="message"
                  value={draft}
                  onChange={(e) => {
                    setDraft(e.target.value);
                    setError("");
                  }}
                  placeholder={t.placeholder}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? "message-error" : undefined}
                  className={`min-w-0 flex-1 rounded-full border border-gray-500 px-4 py-2.5 text-gray-800 ${ring}`}
                />
                <Button type="submit" shape="pill">
                  <Send aria-hidden className="size-4" /> {t.send}
                </Button>
              </div>
              <ErrorText id="message-error" error={error} />
              <p className="mt-2 text-sm text-gray-500">{t.sentNote}</p>
            </form>
          </>
        ) : (
          <p className="m-auto p-10 text-center text-gray-700">{t.description}</p>
        )}
      </section>
    </div>
  );
}
