"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { GoogleIcon, LinkedInIcon, MicrosoftIcon } from "@/components/auth/SocialIcons";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { authText as t } from "@/content/auth";

/*
  Social log in (simulated, Aston 8 Nov 2026). There is no real Google, Microsoft or LinkedIn
  connection yet: a short "Connecting…" state, then the sample Student dashboard, since
  learners are the main social-login users.
*/

const providers = [
  { id: "google", label: t.social.google, icon: GoogleIcon },
  { id: "microsoft", label: t.social.microsoft, icon: MicrosoftIcon },
  { id: "linkedin", label: t.social.linkedin, icon: LinkedInIcon },
] as const;

export function SocialButtons({ onBusy }: { onBusy?: (busy: boolean) => void }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  return (
    <div className="grid gap-3">
      {providers.map((p) => (
        <Button
          key={p.id}
          type="button"
          variant="outline"
          size="lg"
          className="w-full text-base"
          disabled={busy !== null}
          onClick={() => {
            setBusy(p.id);
            onBusy?.(true);
            setTimeout(() => router.push("/dashboard/student"), 1000);
          }}
        >
          {busy === p.id ? <Spinner data-icon="inline-start" /> : <p.icon />}
          {busy === p.id ? t.social.connecting.replace("{provider}", t.social.providers[p.id]) : p.label}
        </Button>
      ))}
    </div>
  );
}

// "or log in with email" divider.
export function OrDivider({ label }: { label: string }) {
  return (
    <div className="relative my-6 flex items-center gap-3 text-sm text-muted-foreground" role="separator" aria-label={label}>
      <span className="h-px flex-1 bg-border" />
      <span aria-hidden>{label}</span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}
