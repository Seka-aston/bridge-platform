import { Info } from "lucide-react";
import { Badge } from "@/components/Badge";
import { Logo } from "@/components/Logo";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";
import { PageTitle } from "@/components/ui/typography";
import { authText } from "@/content/auth";
import { prototypeMode } from "@/content/site";

/*
  Centred card for the log in, create account and password reset screens (shadcn login block
  layout). Every screen carries the prototype note: there are no real accounts yet.
*/

export function AuthCard({ title, description, children, footer }: { title: string; description: string; children: React.ReactNode; footer?: React.ReactNode }) {
  return (
    <main id="main" className="flex flex-1 items-start justify-center bg-section-tint px-gutter py-12 md:items-center md:py-20">
      <div className="w-full max-w-md">
        <Card className="gap-6 shadow-sm">
          <CardHeader className="items-center gap-2 text-center">
            <Logo size={32} className="mx-auto mb-4" />
            <PageTitle>{title}</PageTitle>
            <CardDescription className="text-base">{description}</CardDescription>
          </CardHeader>
          <CardContent>{children}</CardContent>
          {footer && <CardFooter className="justify-center border-t text-sm">{footer}</CardFooter>}
        </Card>
        {prototypeMode && (
          <p className="mt-4 flex items-start justify-center gap-2 text-center text-sm text-muted-foreground">
            <Info aria-hidden className="mt-0.5 size-4 shrink-0" />
            <span>
              {authText.prototypeNote} <Badge kind="draft" className="ml-1 align-middle" />
            </span>
          </p>
        )}
      </div>
    </main>
  );
}
