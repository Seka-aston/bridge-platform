import Image from "next/image";
import { BookOpenCheck, FileText, Rocket, Route, Search, Target, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/Badge";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { bridgeAiText as t } from "@/content/ui";

/*
  Bridge AI product preview (spec 4.2.9). A static illustration of planned capabilities, clearly
  labelled as in development. Deliberately no chat input or anything that looks typeable: the
  service isn't live (CLAUDE.md content rule 3).
*/

const icons: LucideIcon[] = [BookOpenCheck, Target, FileText, Route, Search, Rocket];

export function BridgeAiPreview({ capabilities }: { capabilities: string[] }) {
  return (
    <Card className="gap-0 py-0 text-base shadow-md">
      <figure>
        <CardHeader className="flex flex-wrap items-center justify-between gap-3 border-b py-4">
          <div className="flex items-center gap-3">
            <Image src="/brand/bridge-symbol.svg" alt="" aria-hidden width={14} height={24} unoptimized className="h-6 w-auto" />
            <p className="font-semibold text-heading">{t.panelTitle}</p>
          </div>
          <Badge kind="preview" />
        </CardHeader>
        <ul className="grid gap-3 p-6 sm:grid-cols-2">
          {capabilities.map((c, i) => {
            const Icon = icons[i % icons.length];
            return (
              <li key={c} className="flex items-center gap-3 rounded-lg border p-3">
                <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                  <Icon aria-hidden className="size-5" />
                </span>
                <span className="text-sm font-medium">{c}</span>
              </li>
            );
          })}
        </ul>
        <CardFooter className="border-t bg-muted py-3 text-sm text-muted-foreground">
          <figcaption>{t.panelNote}</figcaption>
        </CardFooter>
      </figure>
    </Card>
  );
}
