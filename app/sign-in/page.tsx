import type { Metadata } from "next";
import Link from "next/link";
import { AuthCard } from "@/components/auth/AuthCard";
import { LoginForm } from "@/components/auth/LoginForm";
import { authText } from "@/content/auth";

export const metadata: Metadata = { title: "Log in", robots: { index: false } };

const t = authText.login;

// Log in (Aston, 8 Nov 2026): replaces the "Sign in as…" sample-account screen.
export default function SignInPage() {
  return (
    <AuthCard
      title={t.title}
      description={t.description}
      footer={
        <p className="text-muted-foreground">
          {t.newHere}{" "}
          <Link href="/sign-up" className="rounded-sm font-medium text-link underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
            {t.createAccount}
          </Link>
        </p>
      }
    >
      <LoginForm />
    </AuthCard>
  );
}
