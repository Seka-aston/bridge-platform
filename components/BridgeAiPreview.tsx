import Image from "next/image";
import { BookOpenCheck, FileText, Rocket, Route, Search, Target, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/Badge";
import { bridgeAiText as t } from "@/content/ui";

/*
  Bridge AI product preview (spec 4.2.9). A static illustration of planned capabilities,
  clearly labelled as in development. Deliberately no chat input or anything that looks
  typeable: the service isn't live (CLAUDE.md content rule 3).
*/

const icons: LucideIcon[] = [BookOpenCheck, Target, FileText, Route, Search, Rocket];

export function BridgeAiPreview({ capabilities }: { capabilities: string[] }) {
  return (
    <figure className="overflow-hidden rounded-card border border-gray-200 bg-white shadow-card-hover">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <Image src="/brand/bridge-symbol.svg" alt="" aria-hidden width={14} height={24} unoptimized className="h-6 w-auto" />
          <p className="font-bold text-navy-900">{t.panelTitle}</p>
        </div>
        <Badge kind="preview" />
      </div>
      <ul className="grid gap-3 p-6 sm:grid-cols-2">
        {capabilities.map((c, i) => {
          const Icon = icons[i % icons.length];
          return (
            <li key={c} className="flex items-start gap-3 rounded-control border border-gray-200 p-4">
              <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-control bg-green-50">
                <Icon aria-hidden className="size-5 text-green-700" />
              </span>
              <span className="pt-1.5 font-semibold text-gray-800">{c}</span>
            </li>
          );
        })}
      </ul>
      <figcaption className="border-t border-gray-200 bg-green-50 px-6 py-3 text-gray-700">{t.panelNote}</figcaption>
    </figure>
  );
}
