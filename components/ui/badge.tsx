import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Slot } from "radix-ui"

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary-hover",
        secondary:
          "bg-secondary text-secondary-foreground [a]:hover:bg-brand-green/15",
        destructive:
          "bg-destructive/10 text-destructive [a]:hover:bg-destructive/20",
        outline:
          "border-border text-foreground [a]:hover:bg-accent",
        ghost: "hover:bg-accent",
        link: "text-primary underline-offset-4 hover:underline",

        // Bridge status labels (CLAUDE.md content rules). Always text, never colour alone.
        // Programme status: calculated from dates, never typed by hand.
        open: "bg-secondary text-secondary-foreground",
        upcoming: "bg-brand-navy/10 text-brand-navy",
        closed: "bg-muted text-muted-foreground",
        archived: "border-border text-muted-foreground",
        // Content not yet approved by Bridge (shown only while prototypeMode is on).
        draft: "bg-brand-amber/20 text-warning",
        // Features not live yet: "Coming soon", "Preview · In development".
        preview: "border-brand-navy/25 text-brand-navy",
        // Illustrative records: "Sample profile", "Sample figures".
        sample: "border-border bg-background text-muted-foreground",
        verified: "bg-secondary text-secondary-foreground",
        featured: "bg-brand-navy text-brand-navy-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
