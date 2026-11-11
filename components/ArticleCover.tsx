import Image from "next/image";
import { BookOpen, Briefcase, UsersRound, type LucideIcon } from "lucide-react";
import type { ArticleCover as Cover } from "@/data/articles";
import { cn } from "@/lib/utils";

/*
  Designed cover for an article without a photo (Aston, 11 Nov 2026): a navy or green panel,
  the dotted map of Africa from the homepage hero fading in from the right, a large line icon
  for the topic in a frosted tile, and the Bridge wordmark. Decorative only (the card's title
  says what the article is), so it is hidden from screen readers.
*/

const icons: Record<Cover["icon"], LucideIcon> = { briefcase: Briefcase, mentoring: UsersRound, reading: BookOpen };
const tones: Record<Cover["tone"], string> = { navy: "bg-brand-navy", green: "bg-primary" };

export function ArticleCover({ cover = { icon: "reading", tone: "navy" }, className }: { cover?: Cover; className?: string }) {
  const Icon = icons[cover.icon];
  return (
    <div aria-hidden className={cn("relative aspect-video w-full overflow-hidden", tones[cover.tone], className)}>
      <div className="absolute -top-[22%] -right-[4%] aspect-[479.4/506.4] h-[150%] opacity-35 transition-transform duration-500 group-hover:scale-[1.03]">
        <Image src="/hero/dots.svg" alt="" fill unoptimized />
      </div>
      <span className="absolute top-1/2 left-[10%] flex size-18 -translate-y-1/2 items-center justify-center rounded-xl border border-white/25 bg-white/10 text-white backdrop-blur-sm md:size-20">
        <Icon className="size-9 md:size-10" strokeWidth={1.5} />
      </span>
      <Image src="/brand/bridge-logo-white.svg" alt="" width={120} height={24} unoptimized className="absolute bottom-[8%] left-[10%] h-4 w-auto opacity-80" />
    </div>
  );
}
