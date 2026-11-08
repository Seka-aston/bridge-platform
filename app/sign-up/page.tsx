import type { Metadata } from "next";
import Link from "next/link";
import { AuthCard } from "@/components/auth/AuthCard";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { authText } from "@/content/auth";

export const metadata: Metadata = { title: "Create an account", robots: { index: false } };

const t = authText.signUp;

export default function SignUpPage() {
  return (
    <AuthCard
      title={t.title}
      description={t.description}
      footer={
        <p className="text-muted-foreground">
          {t.haveAccount}{" "}
          <Link href="/sign-in" className="rounded-sm font-medium text-link underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
            {t.logIn}
          </Link>
        </p>
      }
    >
      <SignUpForm />
    </AuthCard>
  );
}
