import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AuthCard } from "@/components/auth/AuthCard";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { Button } from "@/components/ui/button";
import { authText } from "@/content/auth";

export const metadata: Metadata = { title: "Reset your password", robots: { index: false } };

const t = authText.forgot;

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      title={t.title}
      description={t.description}
      footer={
        <Button asChild variant="link">
          <Link href="/sign-in">
            <ArrowLeft data-icon="inline-start" aria-hidden /> {t.back}
          </Link>
        </Button>
      }
    >
      <ForgotPasswordForm />
    </AuthCard>
  );
}
