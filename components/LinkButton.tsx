import Link from "next/link";
import type { VariantProps } from "class-variance-authority";
import { Button, type buttonVariants } from "@/components/ui/button";

// A shadcn Button that is a link. Marketing pages use size "xl" for page-level actions.
export function LinkButton({
  href,
  children,
  variant,
  size = "xl",
  className,
}: { href: string; children: React.ReactNode; className?: string } & VariantProps<typeof buttonVariants>) {
  return (
    <Button asChild variant={variant} size={size} className={className}>
      <Link href={href}>{children}</Link>
    </Button>
  );
}
