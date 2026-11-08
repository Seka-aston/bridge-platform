import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Text link with an arrow ("Explore All Programmes →"). Green on light backgrounds, white on navy.
export function TextLink({ href, children, size = "lg", className }: { href: string; children: React.ReactNode; size?: "default" | "lg"; className?: string }) {
  return (
    <Button asChild variant="link" size={size} className={cn("group/link", className)}>
      <Link href={href}>
        {children}
        <ArrowRight data-icon="inline-end" aria-hidden className="transition-transform duration-150 group-hover/link:translate-x-0.5" />
      </Link>
    </Button>
  );
}
